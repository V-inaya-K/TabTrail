import { useState } from 'react';

interface FilterPanelProps {
  onFilter: (filters: { type?: string; domain?: string }) => void;
}

const activityTypes = [
  { value: '', label: 'All Types' },
  { value: 'tab_change', label: 'Tab Changes' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'click', label: 'Clicks' },
  { value: 'scroll', label: 'Scrolls' },
];

export default function FilterPanel({ onFilter }: FilterPanelProps) {
  const [type, setType] = useState('');
  const [domain, setDomain] = useState('');

  function handleApply() {
    onFilter({ type: type || undefined, domain: domain || undefined });
  }

  function handleReset() {
    setType('');
    setDomain('');
    onFilter({});
  }

  return (
    <div className="bg-[rgb(var(--color-surface))] border rounded-xl p-4 mb-4">
      <h3 className="text-sm font-semibold text-[rgb(var(--color-text))] mb-3">Filters</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-[rgb(var(--color-text-muted))] mb-1.5">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 bg-[rgb(var(--color-bg))] border rounded-md text-sm text-[rgb(var(--color-text))] focus:outline-none focus:ring-2 focus:ring-blue-500">
            {activityTypes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[rgb(var(--color-text-muted))] mb-1.5">Domain</label>
          <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. github.com" className="w-full px-3 py-2 bg-[rgb(var(--color-bg))] border rounded-md text-sm text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-muted))] focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={handleApply} className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">Apply</button>
          <button type="button" onClick={handleReset} className="px-3 py-1.5 bg-[rgb(var(--color-border))] hover:opacity-80 text-[rgb(var(--color-text))] text-sm font-medium rounded-md transition-colors">Reset</button>
        </div>
      </div>
    </div>
  );
}