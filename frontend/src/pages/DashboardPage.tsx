import { useActivityStats, useActivities } from '@/hooks/useActivities';
import { useScreenshots } from '@/hooks/useScreenshots';
import StatCards from '@/components/dashboard/StatCards';
import DomainChart from '@/components/dashboard/DomainChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useActivityStats();
  const { data: activities, isLoading: activitiesLoading } = useActivities({ pageSize: 10 });
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

  const topDomain = stats?.topDomains?.[0]?.domain || '—';
  const screenshotCount = screenshots?.total || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Dashboard</h1>

      <StatCards
        total={stats?.totalActivities || 0}
        topDomain={topDomain}
        screenshotCount={screenshotCount}
      />

      <DomainChart domains={stats?.topDomains || []} />

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Recent Activity</h3>
        <ActivityTimeline activities={activities?.items || []} compact />
      </div>
    </div>
  );
}