import { useQuery } from '@tanstack/react-query';
import { fetchActivities, fetchActivityStats } from '@/api/activities';
import { DEFAULT_USER_ID } from '@/lib/constants';

export function useActivities(params?: {
  userId?: string;
  page?: number;
  pageSize?: number;
  type?: string;
  domain?: string;
}) {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => fetchActivities(params),
    placeholderData: (prev) => prev,
  });
}

export function useActivityStats(userId: string = DEFAULT_USER_ID) {
  return useQuery({
    queryKey: ['activity-stats', userId],
    queryFn: () => fetchActivityStats(userId),
    refetchInterval: 30_000,
  });
}