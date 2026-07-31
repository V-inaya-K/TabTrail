export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Settings</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Backend Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Backend URL</label>
              <input
                type="text"
                defaultValue="http://localhost:8000"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                disabled
              />
              <p className="text-xs text-slate-600 mt-1">
                The backend API endpoint. Configured via Vite proxy.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Extension</h3>
          <p className="text-sm text-slate-400 mb-3">
            Install the TabTrail Chrome extension to start tracking your browsing activity.
          </p>
          <ol className="text-xs text-slate-500 space-y-2 list-decimal list-inside">
            <li>Navigate to <code className="text-brand-400">chrome://extensions</code></li>
            <li>Enable "Developer mode" (top-right toggle)</li>
            <li>Click "Load unpacked" and select the <code className="text-brand-400">extension/dist</code> folder</li>
            <li>Click the extension icon and click "Start Monitoring"</li>
          </ol>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Privacy</h3>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>• All data stays on your infrastructure (MongoDB + backend)</li>
            <li>• Password fields and sensitive inputs are never tracked</li>
            <li>• You can delete all activities and screenshots at any time</li>
            <li>• The extension only tracks when you explicitly start monitoring</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">About</h3>
          <p className="text-sm text-slate-400">
            TabTrail v0.1.0 — Visual AI browser activity tracker
          </p>
        </div>
      </div>
    </div>
  );
}