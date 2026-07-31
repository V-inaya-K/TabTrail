import { useActivityStats, useActivities } from '@/hooks/useActivities';
import { useScreenshots } from '@/hooks/useScreenshots';
import StatCards from '@/components/dashboard/StatCards';
import DomainChart from '@/components/dashboard/DomainChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useActivityStats();
  const { data: activities, isLoading: activitiesLoading, error: actError } = useActivities({ pageSize: 10 });
  const { data: screenshots } = useScreenshots({ pageSize: 1 });

  if (statsLoading || activitiesLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 skeleton rounded-xl" />
          ))}
        </div>
        <div className="h-80 skeleton rounded-xl" />
      </div>
    );
  }

  if (statsError || actError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4">⚠</div>
        <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">Unable to load dashboard</h2>
        <p className="text-[rgb(var(--color-text-muted))] mb-4 max-w-md">
          Could not connect to the backend. Make sure the server is running at http://localhost:8000.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const topDomain = stats?.topDomains?.[0]?.domain || '—';
  const screenshotCount = screenshots?.total || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-6">Dashboard</h1>

      <StatCards
        total={stats?.totalActivities || 0}
        topDomain={topDomain}
        screenshotCount={screenshotCount}
      />

      <DomainChart domains={stats?.topDomains || []} />

      <div className="bg-[rgb(var(--color-surface))] border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text))] mb-4">Recent Activity</h3>
        <ActivityTimeline activities={activities?.items || []} compact />
      </div>
    </div>
  );
}