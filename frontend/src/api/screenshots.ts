import client from './client';
import { DEFAULT_USER_ID } from '@/lib/constants';
import type { PaginatedResponse } from './activities';

export interface ScreenshotRecord {
  id?: string;
  userId?: string;
  url: string;
  domain: string;
  tabId: number;
  imageWidth: number;
  imageHeight: number;
  fileSizeBytes: number;
  recordedAt: string;
  createdAt?: string;
}

export interface ScreenshotWithImage extends ScreenshotRecord {
  imageBase64: string;
}

export async function fetchScreenshots(params: {
  userId?: string;
  page?: number;
  pageSize?: number;
  domain?: string;
  from?: string;
  to?: string;
} = {}): Promise<PaginatedResponse<ScreenshotRecord>> {
  const { data } = await client.get('/screenshots', {
    params: {
      userId: params.userId || DEFAULT_USER_ID,
      page: params.page || 1,
      pageSize: params.pageSize || 48,
      domain: params.domain,
      from: params.from,
      to: params.to,
    },
  });
  return data;
}

export async function fetchScreenshotWithImage(id: string): Promise<ScreenshotWithImage> {
  const { data } = await client.get(`/screenshots/${id}`);
  return data;
}

export async function deleteScreenshot(id: string): Promise<void> {
  await client.delete(`/screenshots/${id}`);
}