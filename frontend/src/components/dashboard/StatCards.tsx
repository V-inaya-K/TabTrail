interface StatCardsProps {
  total: number;
  topDomain: string;
  screenshotCount: number;
}

export default function StatCards({ total, topDomain, screenshotCount }: StatCardsProps) {
  const cards = [
    { label: 'Total Activities', value: total.toLocaleString(), color: 'text-blue-400' },
    { label: 'Top Domain', value: topDomain || '—', color: 'text-emerald-400' },
    { label: 'Screenshots', value: screenshotCount.toLocaleString(), color: 'text-violet-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((c) => (
        <div key={c.label} className="bg-[rgb(var(--color-surface))] border rounded-xl p-5">
          <div className="text-xs uppercase tracking-wider text-[rgb(var(--color-text-muted))] mb-1">{c.label}</div>
          <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}