import client from './client';
import { DEFAULT_USER_ID } from '@/lib/constants';

export interface ActivityRecord {
  id?: string;
  clientId?: string;
  type: 'tab_change' | 'navigation' | 'click' | 'scroll';
  url: string;
  domain: string;
  title: string | null;
  tabId: number;
  windowId: number;
  metadata: Record<string, unknown> | null;
  recordedAt: string;
  createdAt?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export interface ActivityStats {
  totalActivities: number;
  topDomains: { domain: string; count: number }[];
  activityByHour: { hour: number; count: number }[];
  typeBreakdown: Record<string, number>;
}

export async function fetchActivities(params: {
  userId?: string;
  page?: number;
  pageSize?: number;
  type?: string;
  domain?: string;
  from?: string;
  to?: string;
} = {}): Promise<PaginatedResponse<ActivityRecord>> {
  const { data } = await client.get('/activities', {
    params: {
      userId: params.userId || DEFAULT_USER_ID,
      page: params.page || 1,
      pageSize: params.pageSize || 50,
      type: params.type,
      domain: params.domain,
      from: params.from,
      to: params.to,
    },
  });
  return data;
}

export async function fetchActivityStats(userId: string = DEFAULT_USER_ID): Promise<ActivityStats> {
  const { data } = await client.get('/activities/stats', { params: { userId } });
  return data;
}

export async function deleteActivity(id: string): Promise<void> {
  await client.delete(`/activities/${id}`);
}