interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
      <div className="text-sm text-slate-400">Activity Dashboard</div>
      <button
        onClick={onToggleTheme}
        className="px-3 py-1.5 text-xs rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
      >
        {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
      </button>
    </header>
  );
}