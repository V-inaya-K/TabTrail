import { useState } from 'react';
import { useActivities } from '@/hooks/useActivities';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import FilterPanel from '@/components/search/FilterPanel';
import SearchBar from '@/components/search/SearchBar';

export default function TimelinePage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ type?: string; domain?: string }>({});
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useActivities({
    page,
    pageSize: 50,
    type: filters.type,
    domain: filters.domain || searchQuery || undefined,
  });

  function handleSearch(query: string) {
    setSearchQuery(query);
    setPage(1);
  }

  function handleFilter(newFilters: { type?: string; domain?: string }) {
    setFilters(newFilters);
    setPage(1);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-6">Timeline</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <FilterPanel onFilter={handleFilter} />
        </aside>

        <main className="lg:col-span-3">
          <SearchBar onSearch={handleSearch} />

          {error && (
            <div className="bg-red-500/10 border-red-500/50 border rounded-lg p-4 text-red-400 mb-4">
              Failed to load activities. <button onClick={() => window.location.reload()} className="underline ml-2">Retry</button>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 skeleton rounded-lg" />)}
            </div>
          ) : (
            <>
              <div className="bg-[rgb(var(--color-surface))] border rounded-xl p-4 mb-4">
                <ActivityTimeline activities={data?.items || []} />
              </div>

              {data && data.pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-[rgb(var(--color-surface))] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-[rgb(var(--color-text))] text-sm font-medium rounded-md transition-colors">Previous</button>
                  <span className="text-sm text-[rgb(var(--color-text-muted))]">Page {page} of {data.pages}</span>
                  <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="px-4 py-2 bg-[rgb(var(--color-surface))] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-[rgb(var(--color-text))] text-sm font-medium rounded-md transition-colors">Next</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}