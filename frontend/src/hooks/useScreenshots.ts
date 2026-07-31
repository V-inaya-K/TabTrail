import { useQuery } from '@tanstack/react-query';
import { fetchScreenshots, fetchScreenshotWithImage } from '@/api/screenshots';

export function useScreenshots(params?: {
  userId?: string;
  page?: number;
  pageSize?: number;
  domain?: string;
}) {
  return useQuery({
    queryKey: ['screenshots', params],
    queryFn: () => fetchScreenshots(params),
    placeholderData: (prev) => prev,
  });
}

export function useScreenshotImage(id: string | null) {
  return useQuery({
    queryKey: ['screenshot-image', id],
    queryFn: () => fetchScreenshotWithImage(id!),
    enabled: !!id,
  });
}