export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-900 px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-900/50">
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
          <circle cx="12" cy="16" r="0.5" fill="currentColor" />
        </svg>
      </div>

      <h1 className="mb-3 text-2xl font-black text-white">You're offline</h1>
      <p className="mb-8 max-w-xs text-sm text-slate-400 leading-relaxed">
        Your last briefing is cached and available. Reconnect to load fresh signals.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-500 active:scale-95"
      >
        Try again
      </button>

      <p className="mt-10 text-xs text-slate-600">omgskill.ai — cached content available below</p>
    </div>
  );
}
