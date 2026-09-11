"use client";
import { useState } from "react";

export default function ReportsPage() {
  const [out, setOut] = useState("");
  async function gen(range: string) {
    const res = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ range }) });
    const j = await res.json();
    setOut(JSON.stringify(j, null, 2));
    if (j.id) window.open(`/api/reports/${j.id}/pdf`, "_blank");
  }
  return (
    <main id="main" className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="text-3xl font-bold text-plum-800">Health reports</h1>
      <p className="text-sm text-stone-600">You choose when to view, download, or share. Nothing is sent automatically.</p>
      <div className="card mt-4 flex flex-wrap gap-2">
        {["last_cycle", "3m", "6m", "12m"].map((r) => (<button key={r} onClick={() => gen(r)} className="btn-secondary text-sm">{r}</button>))}
      </div>
      {out && <pre className="card mt-4 overflow-auto text-xs" aria-label="Report summary">{out}</pre>}
      <div className="card mt-4"><h2 className="font-bold">Prepare for my appointment</h2><p className="text-sm">From Reports, bring: last period, averages, frequent symptoms, pain pattern, medications, and “My questions for my doctor”. Ask Her Companion to help draft the list.</p></div>
    </main>
  );
}
