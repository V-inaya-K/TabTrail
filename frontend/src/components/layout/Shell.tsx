import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface ShellProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Shell({ children, theme, onToggleTheme }: ShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header theme={theme} onToggleTheme={onToggleTheme} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}