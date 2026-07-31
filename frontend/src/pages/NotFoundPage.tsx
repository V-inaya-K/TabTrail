export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="text-6xl font-bold text-slate-700 mb-4">404</div>
      <h1 className="text-2xl font-semibold text-slate-300 mb-2">Page Not Found</h1>
      <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Go to Dashboard
      </a>
    </div>
  );
}