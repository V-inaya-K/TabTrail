import { useState } from 'react';
import { useActivities } from '@/hooks/useActivities';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import FilterPanel from '@/components/search/FilterPanel';
import SearchBar from '@/components/search/SearchBar';

export default function TimelinePage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ type?: string; domain?: string }>({});
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useActivities({
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
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Timeline</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <FilterPanel onFilter={handleFilter} />
        </aside>

        <main className="lg:col-span-3">
          <SearchBar onSearch={handleSearch} />

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 skeleton rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
                <ActivityTimeline activities={data?.items || []} />
              </div>

              {data && data.pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 text-sm font-medium rounded-md transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-500">
                    Page {page} of {data.pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                    disabled={page === data.pages}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 text-sm font-medium rounded-md transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}