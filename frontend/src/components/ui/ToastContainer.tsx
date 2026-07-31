import { useToastStore } from '@/hooks/useToast';

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

const colors = {
  success: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400',
  error: 'bg-red-500/10 border-red-500/50 text-red-400',
  info: 'bg-blue-500/10 border-blue-500/50 text-blue-400',
  warning: 'bg-amber-500/10 border-amber-500/50 text-amber-400',
};

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm animate-slide-in ${colors[toast.type]}`}
        >
          <span className="text-lg shrink-0">{icons[toast.type]}</span>
          <p className="text-sm flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-lg opacity-50 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}