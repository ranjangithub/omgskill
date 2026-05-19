"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
const MAX_PIN = 8;

interface Props {
  redirectTo: string;
  noPinRequired?: boolean;
}

export function PinEntry({ redirectTo, noPinRequired = false }: Props) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-submit when PIN reaches max length
  useEffect(() => {
    if (pin.length >= MAX_PIN) submit(pin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  // Keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (loading) return;
      if (e.key >= "0" && e.key <= "9") setPin((p) => (p.length < MAX_PIN ? p + e.key : p));
      if (e.key === "Backspace") setPin((p) => p.slice(0, -1));
      if (e.key === "Enter" && pin.length > 0) submit(pin);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, loading]);

  async function submit(value: string) {
    if (loading || !value) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: value }),
    });

    if (res.ok) {
      router.push(redirectTo);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setPin("");
      setError(data.error ?? "Incorrect PIN");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setLoading(false);
    }
  }

  function press(key: string) {
    if (loading) return;
    if (key === "⌫") {
      setPin((p) => p.slice(0, -1));
      setError("");
    } else if (key !== "") {
      setPin((p) => (p.length < MAX_PIN ? p + key : p));
      setError("");
    }
  }

  return (
    <div className="w-full max-w-xs">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50">
          <span className="text-2xl">🔐</span>
        </div>
        <h1 className="text-xl font-black text-white">Admin Access</h1>
        <p className="mt-1 text-sm text-slate-400">
          {noPinRequired ? "Dev mode — no PIN configured" : "Enter your admin PIN to continue"}
        </p>
      </div>

      {noPinRequired ? (
        /* Dev bypass — no PIN configured */
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-900/20 p-4 text-center">
            <p className="text-xs text-amber-400 leading-relaxed">
              <strong className="block mb-1">Development mode</strong>
              <code className="text-amber-300">ADMIN_PIN</code> is not set in <code className="text-amber-300">.env.local</code>.
              <br />Click below to enter without a PIN.
            </p>
          </div>

          <button
            onClick={() => submit("dev-bypass")}
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-600 py-4 text-base font-black text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50"
          >
            {loading
              ? <span className="flex items-center justify-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-300 border-t-white" /> Unlocking…</span>
              : "Enter Admin →"
            }
          </button>

          <p className="text-center text-xs text-slate-600">
            Set <code className="text-slate-500">ADMIN_PIN</code> in <code className="text-slate-500">.env.local</code> to enable PIN auth.
          </p>
        </div>
      ) : (
        <>
          {/* PIN dots */}
          <div className={`mb-8 flex justify-center gap-3 ${shake ? "animate-shake" : ""}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full transition-all duration-150 ${
                  i < pin.length ? "bg-indigo-400 scale-110" : "bg-slate-700"
                }`}
              />
            ))}
          </div>

          {/* Error message */}
          <div className="mb-4 h-5 text-center">
            {error && <p className="text-sm font-bold text-red-400">{error}</p>}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {KEYS.map((key, i) => (
              <button
                key={i}
                onClick={() => press(key)}
                disabled={loading || key === ""}
                className={`
                  flex h-16 items-center justify-center rounded-2xl text-xl font-bold transition-all
                  active:scale-95 select-none
                  ${key === "" ? "invisible" : ""}
                  ${key === "⌫"
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-slate-800 text-white hover:bg-slate-700 shadow-sm shadow-black/20"
                  }
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {loading && i === 11
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-white" />
                  : key}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            PIN is verified server-side · Session lasts 4 hours
          </p>
        </>
      )}
    </div>
  );
}
