import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DomainChartProps {
  domains: { domain: string; count: number }[];
}

const COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'];

export default function DomainChart({ domains }: DomainChartProps) {
  if (!domains.length) {
    return <div className="text-center text-slate-500 py-12">No domain data yet.</div>;
  }

  const chartData = domains.map((d) => ({ name: d.domain, count: d.count }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Top Domains</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
          <XAxis type="number" stroke="#64748b" fontSize={12} />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#64748b"
            fontSize={12}
            width={120}
            tick={{ fill: '#94a3b8' }}
          />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#e2e8f0' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}