"use client";

import { useState } from "react";
import type { PendingChange } from "@/lib/admin";

interface Industry {
  id: string;
  label: string;
  emoji: string;
}

interface Props {
  initialChanges: PendingChange[];
  industries: Industry[];
}

export function PendingReviewClient({ initialChanges, industries }: Props) {
  const [changes, setChanges] = useState(initialChanges);
  const [processing, setProcessing] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  async function handle(id: string, action: "approve" | "reject") {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/pending/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.ok) {
        setChanges((prev) => prev.filter((c) => c.id !== id));
        showToast(action === "approve" ? "✓ Approved & applied" : "✗ Rejected");
      } else {
        showToast("Error — try again");
      }
    } finally {
      setProcessing(null);
    }
  }

  const grouped = industries
    .map((industry) => ({
      industry,
      changes: changes.filter((c) => c.domain === industry.id),
    }))
    .filter((g) => g.changes.length > 0);

  if (changes.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
        <span className="text-3xl block mb-3">✅</span>
        <p className="text-sm font-black text-slate-700">All clear</p>
        <p className="text-xs text-slate-400 mt-1">No pending changes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(({ industry, changes: domainChanges }) => (
        <div key={industry.id}>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">{industry.emoji}</span>
            <h2 className="text-sm font-black text-slate-800">{industry.label}</h2>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              {domainChanges.length}
            </span>
          </div>

          <div className="space-y-3">
            {domainChanges.map((change) => (
              <PendingCard
                key={change.id}
                change={change}
                processing={processing === change.id}
                onApprove={() => handle(change.id, "approve")}
                onReject={() => handle(change.id, "reject")}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-xl">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

function PendingCard({
  change,
  processing,
  onApprove,
  onReject,
}: {
  change: PendingChange;
  processing: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const operationLabel = {
    add: { label: "Add", color: "bg-emerald-100 text-emerald-700" },
    edit: { label: "Edit", color: "bg-blue-100 text-blue-700" },
    delete: { label: "Delete", color: "bg-red-100 text-red-700" },
  }[change.operation];

  const submittedAt = new Date(change.submittedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${operationLabel.color}`}>
            {operationLabel.label}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 leading-tight truncate">{change.entry || "entry"}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              in <span className="font-medium text-slate-600">{change.section}</span> · {submittedAt}
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{change.file}</p>
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex-shrink-0 text-xs text-slate-400 hover:text-indigo-600 font-bold transition-colors"
          >
            {expanded ? "hide" : "preview"}
          </button>
        </div>

        {/* Content preview */}
        {expanded && (
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3 font-mono text-[11px] text-slate-600 whitespace-pre-wrap max-h-48 overflow-y-auto">
            {change.content}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex border-t border-slate-100">
        <button
          onClick={onReject}
          disabled={processing}
          className="flex-1 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 border-r border-slate-100"
        >
          ✗ Reject
        </button>
        <button
          onClick={onApprove}
          disabled={processing}
          className="flex-1 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-40"
        >
          {processing ? "…" : "✓ Approve & Apply"}
        </button>
      </div>
    </div>
  );
}
