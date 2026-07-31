import type { MonitoringState } from './types';

const STORAGE_KEY = 'tabtrail_state';

const DEFAULTS: MonitoringState = {
  isRecording: false,
  startedAt: null,
  userId: '',
  backendUrl: 'http://localhost:8000/api/v1',
  screenshotIntervalSeconds: 30,
};

export async function getState(): Promise<MonitoringState> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  if (result[STORAGE_KEY]) {
    return { ...DEFAULTS, ...result[STORAGE_KEY] };
  }
  const state: MonitoringState = {
    ...DEFAULTS,
    userId: generateUserId(),
  };
  await chrome.storage.local.set({ [STORAGE_KEY]: state });
  return state;
}

export async function saveState(partial: Partial<MonitoringState>): Promise<void> {
  const current = await getState();
  const updated = { ...current, ...partial };
  await chrome.storage.local.set({ [STORAGE_KEY]: updated });
}

function generateUserId(): string {
  return 'user_' + crypto.randomUUID();
}