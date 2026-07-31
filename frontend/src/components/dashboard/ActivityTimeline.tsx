import { formatRelative, extractDomain } from '@/lib/utils';
import type { ActivityRecord } from '@/api/activities';

interface TimelineProps {
  activities: ActivityRecord[];
  compact?: boolean;
}

const typeColors: Record<string, string> = {
  tab_change: 'bg-blue-500/20 text-blue-400',
  navigation: 'bg-emerald-500/20 text-emerald-400',
  click: 'bg-amber-500/20 text-amber-400',
  scroll: 'bg-violet-500/20 text-violet-400',
};

const typeLabels: Record<string, string> = {
  tab_change: 'Tab',
  navigation: 'Nav',
  click: 'Click',
  scroll: 'Scroll',
};

export default function ActivityTimeline({ activities, compact }: TimelineProps) {
  if (!activities.length) {
    return <div className="text-center text-[rgb(var(--color-text-muted))] py-12">No activities recorded yet.</div>;
  }

  return (
    <div className="space-y-1">
      {activities.map((a, i) => (
        <div key={a.id || i} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[rgb(var(--color-border))] transition-colors">
          <span className={`inline-flex shrink-0 px-2 py-0.5 rounded text-xs font-medium ${typeColors[a.type] || 'bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))]'}`}>
            {typeLabels[a.type] || a.type}
          </span>
          {!compact && (
            <div className="flex-1 min-w-0">
              <div className="text-sm text-[rgb(var(--color-text))] truncate">{extractDomain(a.url)}</div>
              {a.title && <div className="text-xs text-[rgb(var(--color-text-muted))] truncate mt-0.5">{a.title}</div>}
            </div>
          )}
          <span className="text-xs text-[rgb(var(--color-text-muted))] whitespace-nowrap">{formatRelative(a.recordedAt)}</span>
        </div>
      ))}
    </div>
  );
}