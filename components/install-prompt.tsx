"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // User previously dismissed
    if (localStorage.getItem("pwa-install-dismissed")) return;

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!prompt || dismissed) return null;

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setPrompt(null);
      setDismissed(true);
    }
  }

  function dismiss() {
    localStorage.setItem("pwa-install-dismissed", "1");
    setDismissed(true);
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-6 md:left-auto md:right-6 md:w-80">
      <div className="flex items-start gap-3 rounded-2xl border border-indigo-500/20 bg-slate-900/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600">
          <svg viewBox="0 0 512 512" className="h-6 w-6" fill="white">
            <text x="256" y="340" fontFamily="system-ui" fontSize="280" fontWeight="900" textAnchor="middle" fill="white">omg</text>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Add to Home Screen</p>
          <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
            Get your daily AI briefing as an app — instant access, works offline.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={install}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
            >
              Install
            </button>
            <button
              onClick={dismiss}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-300 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
