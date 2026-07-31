import { useState } from 'react';
import { useScreenshots } from '@/hooks/useScreenshots';
import ScreenshotGallery from '@/components/dashboard/ScreenshotGallery';

export default function ScreenshotsPage() {
  const [page, setPage] = useState(1);
  const [domain, setDomain] = useState('');

  const { data, isLoading, error } = useScreenshots({
    page,
    pageSize: 48,
    domain: domain || undefined,
  });

  function handleDomainFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-6">Screenshots</h1>

      <form onSubmit={handleDomainFilter} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Filter by domain..."
            className="flex-1 px-4 py-2.5 bg-[rgb(var(--color-surface))] border rounded-lg text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-muted))] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Filter</button>
          {domain && (
            <button type="button" onClick={() => { setDomain(''); setPage(1); }} className="px-4 py-2.5 bg-[rgb(var(--color-border))] hover:opacity-80 text-[rgb(var(--color-text))] text-sm font-medium rounded-lg transition-colors">Clear</button>
          )}
        </div>
      </form>

      {error && (
        <div className="bg-red-500/10 border-red-500/50 border rounded-lg p-4 text-red-400 mb-4">
          Failed to load screenshots. <button onClick={() => window.location.reload()} className="underline ml-2">Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => <div key={i} className="aspect-video skeleton rounded-lg" />)}
        </div>
      ) : (
        <>
          <ScreenshotGallery screenshots={data?.items || []} />

          {data && data.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-[rgb(var(--color-surface))] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-[rgb(var(--color-text))] text-sm font-medium rounded-md transition-colors">Previous</button>
              <span className="text-sm text-[rgb(var(--color-text-muted))]">Page {page} of {data.pages}</span>
              <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="px-4 py-2 bg-[rgb(var(--color-surface))] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-[rgb(var(--color-text))] text-sm font-medium rounded-md transition-colors">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}