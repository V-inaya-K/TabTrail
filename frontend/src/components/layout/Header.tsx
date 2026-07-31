interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="h-14 border-b bg-[rgb(var(--color-surface))] flex items-center justify-between px-6 shrink-0">
      <div className="text-sm text-[rgb(var(--color-text-muted))]">Activity Dashboard</div>
      <button
        onClick={onToggleTheme}
        className="px-3 py-1.5 text-xs rounded-md border bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] hover:opacity-80 transition-opacity"
      >
        {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
      </button>
    </header>
  );
}