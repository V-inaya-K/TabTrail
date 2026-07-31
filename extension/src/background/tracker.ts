import type { ActivityRecord } from '../lib/types';
import { enqueue } from '../lib/offline-queue';
import { getState } from '../lib/storage';

function generateClientId(): string {
  return crypto.randomUUID();
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname || '';
  } catch {
    return '';
  }
}

function timestamp(): string {
  return new Date().toISOString();
}

async function pushActivity(type: ActivityRecord['type'], overrides: Partial<ActivityRecord> = {}): Promise<void> {
  const state = await getState();
  if (!state.isRecording) return;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab) return;

  const activity: ActivityRecord = {
    clientId: generateClientId(),
    type,
    url: tab.url || '',
    domain: extractDomain(tab.url || ''),
    title: tab.title || null,
    tabId: tab.id ?? 0,
    windowId: tab.windowId ?? 0,
    metadata: null,
    recordedAt: timestamp(),
    ...overrides,
  };

  await enqueue({
    id: generateClientId(),
    kind: 'activity',
    payload: activity,
    retries: 0,
    nextAt: Date.now(),
    createdAt: Date.now(),
  });
}

export function startTracking(): void {
  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    emitActivity('tab_change', {
      url: tab.url || '',
      domain: extractDomain(tab.url || ''),
      title: tab.title || null,
      tabId: tab.id ?? 0,
      windowId: tab.windowId ?? 0,
      metadata: { previousTabId: activeInfo.previousTabId },
    });
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
      emitActivity('navigation', {
        url: tab.url || '',
        domain: extractDomain(tab.url || ''),
        title: tab.title || null,
        tabId: tab.id ?? 0,
        windowId: tab.windowId ?? 0,
      });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.kind === 'tabtrail-activity') {
      emitActivity(message.type as ActivityRecord['type'], message.payload);
    }
  });

  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'tabtrail-activities') {
      port.onMessage.addListener(async (message) => {
        emitActivity(message.type as ActivityRecord['type'], message.payload);
      });
    }
  });
}