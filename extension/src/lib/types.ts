export type ActivityType = 'tab_change' | 'navigation' | 'click' | 'scroll';

export interface ActivityRecord {
  clientId: string;
  type: ActivityType;
  url: string;
  domain: string;
  title: string | null;
  tabId: number;
  windowId: number;
  metadata: Record<string, unknown> | null;
  recordedAt: string;
}

export interface ScreenshotRecord {
  clientId: string;
  url: string;
  domain: string;
  tabId: number;
  imageBase64: string;
  imageWidth: number;
  imageHeight: number;
  fileSizeBytes: number;
  recordedAt: string;
}

export interface QueueItem {
  id: string;
  kind: 'activity' | 'screenshot';
  payload: ActivityRecord | ScreenshotRecord;
  retries: number;
  nextAt: number;
  createdAt: number;
}

export interface MonitoringState {
  isRecording: boolean;
  startedAt: string | null;
  userId: string;
  backendUrl: string;
  screenshotIntervalSeconds: number;
}