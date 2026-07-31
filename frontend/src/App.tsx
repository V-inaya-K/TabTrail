import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Shell from './components/layout/Shell';
import DashboardPage from './pages/DashboardPage';
import TimelinePage from './pages/TimelinePage';
import ScreenshotsPage from './pages/ScreenshotsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import ToastContainer from './components/ui/ToastContainer';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <>
      <Shell theme={theme} onToggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/screenshots" element={<ScreenshotsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Shell>
      <ToastContainer />
    </>
  );
}