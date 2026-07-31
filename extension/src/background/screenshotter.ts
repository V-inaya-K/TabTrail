import type { ScreenshotRecord } from '../lib/types';
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

export async function captureScreenshot(): Promise<void> {
  const state = await getState();
  if (!state.isRecording) return;

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab) return;

    const dataUrl = await chrome.tabs.captureVisibleTab(undefined, {
      format: 'jpeg',
      quality: 60,
    });

    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const estimatedBytes = Math.ceil((base64.length * 3) / 4);

    const screenshot: ScreenshotRecord = {
      id: generateClientId(),
      url: tab.url || '',
      domain: extractDomain(tab.url || ''),
      tabId: tab.id ?? 0,
      imageBase64: base64,
      imageWidth: tab.width ?? 0,
      imageHeight: tab.height ?? 0,
      fileSizeBytes: estimatedBytes,
      recordedAt: timestamp(),
    };

    await enqueue({
      id: generateClientId(),
      kind: 'screenshot',
      payload: screenshot,
      retries: 0,
      nextAt: Date.now(),
      createdAt: Date.now(),
    });
  } catch {
    // captureVisibleTab may fail on internal pages like chrome://
  }
}

export function startScreenshotAlarm(intervalSeconds: number): void {
  chrome.alarms.create('tabtrail-screenshot', {
    periodInMinutes: Math.max(intervalSeconds / 60, 0.5),
  });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'tabtrail-screenshot') {
      captureScreenshot();
    }
  });
}

export function stopScreenshotAlarm(): void {
  chrome.alarms.clear('tabtrail-screenshot');
}