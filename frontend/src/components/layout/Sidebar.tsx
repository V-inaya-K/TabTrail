import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '◫' },
  { to: '/timeline', label: 'Timeline', icon: '◷' },
  { to: '/screenshots', label: 'Screenshots', icon: '▣' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-[rgb(var(--color-surface))] border-r shrink-0 flex flex-col">
      <div className="h-14 flex items-center px-5 border-b">
        <span className="text-lg font-bold tracking-tight text-[rgb(var(--color-text))]">TabTrail</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-border))] hover:text-[rgb(var(--color-text))]'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
