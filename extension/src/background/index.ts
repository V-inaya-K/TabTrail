import { startTracking } from './tracker';
import { startScreenshotAlarm, stopScreenshotAlarm } from './screenshotter';
import { getState, saveState } from '../lib/storage';
import { flushQueue, getQueueSize } from '../lib/offline-queue';
import { enqueue } from '../lib/offline-queue';

// Set up connectivity-aware flush
self.addEventListener('online', () => {
  syncQueues();
});

chrome.alarms.create('tabtrail-sync-check', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'tabtrail-sync-check') {
    syncQueues();
  }
});

async function syncQueues(): Promise<void> {
  if (!navigator.onLine) return;
  const state = await getState();
  if (!state.userId) return;
  await flushQueue(state.userId, 'ext_' + state.userId.slice(0, 8));
}

// Listen for popup messages (start/stop/status)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'START_MONITORING') {
    handleStartMonitoring().then(() => sendResponse({ success: true }));
    return true;
  }
  if (message.type === 'STOP_MONITORING') {
    handleStopMonitoring().then(() => sendResponse({ success: true }));
    return true;
  }
  if (message.type === 'GET_STATUS') {
    handleGetStatus().then((status) => sendResponse(status));
    return true;
  }
});

async function handleStartMonitoring(): Promise<void> {
  await saveState({
    isRecording: true,
    startedAt: new Date().toISOString(),
  });
  startTracking();
  const state = await getState();
  startScreenshotAlarm(state.screenshotIntervalSeconds);
}

async function handleStopMonitoring(): Promise<void> {
  await saveState({
    isRecording: false,
    startedAt: null,
  });
  chrome.alarms.clear('tabtrail-screenshot');
}

async function handleGetStatus(): Promise<Record<string, unknown>> {
  const state = await getState();
  const activityCount = await getQueueSize('activity');
  const screenshotCount = await getQueueSize('screenshot');
  return {
    isRecording: state.isRecording,
    startedAt: state.startedAt,
    activityQueueSize: activityCount,
    screenshotQueueSize: screenshotCount,
    isOnline: navigator.onLine,
  };
}

// Initialization
chrome.runtime.onInstalled.addListener(async () => {
  const state = await getState();
  if (!state.userId) {
    await saveState({ userId: 'user_' + crypto.randomUUID() });
  }
});

// Listen for content script messages (click, scroll)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.kind === 'tabtrail-activity') {
    const clientId = crypto.randomUUID();
    enqueue({
      id: clientId,
      kind: 'activity',
      payload: {
        clientId,
        type: message.type,
        url: message.payload?.url || '',
        domain: message.payload?.domain || '',
        title: message.payload?.title || null,
        tabId: message.payload?.tabId ?? 0,
        windowId: message.payload?.windowId ?? 0,
        metadata: message.payload?.metadata || null,
        recordedAt: new Date().toISOString(),
      },
      retries: 0,
      nextAt: Date.now(),
      createdAt: Date.now(),
    });
    return;
  }
});