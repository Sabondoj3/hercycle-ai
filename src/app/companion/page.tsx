"use client";
import { useState } from "react";

const QUICK = ["My period is late", "I have severe cramps", "My bleeding is heavy", "My cycle is irregular", "I feel emotionally low", "Explain my report", "What should I ask my doctor?"];

export default function CompanionPage() {
  const [msgs, setMsgs] = useState<{ role: string; content: string }[]>([{ role: "assistant", content: "Hi, I'm Her Companion — a private AI assistant for menstrual-health questions. There are no embarrassing questions here. I provide educational information, not diagnosis. How can I help today?" }]);
  const [input, setInput] = useState("");
  const [shameFree, setShameFree] = useState(true);
  const [busy, setBusy] = useState(false);

  async function send(text: string) {
    const t = text.trim(); if (!t || busy) return;
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", content: t }]); setInput("");
    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: t, shameFree }) });
    const j = await res.json();
    setMsgs((m) => [...m, { role: "assistant", content: j.reply || "Sorry — I could not respond just now." }]);
    setBusy(false);
  }

  return (
    <main id="main" className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="text-3xl font-bold text-plum-800">Ask HerCycle AI</h1>
      <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={shameFree} onChange={(e) => setShameFree(e.target.checked)} /> Ask Without Shame mode (hides display name, gentlest tone)</label>
      <div className="mt-2 flex flex-wrap gap-2" aria-label="Suggested questions">{QUICK.map((q) => (<button key={q} onClick={() => send(q)} className="rounded-full border border-plum-300 px-3 py-1 text-sm text-plum-800 hover:bg-plum-50">{q}</button>))}</div>
      <div className="card mt-4 grid gap-3" aria-live="polite">
        {msgs.map((m, i) => (<p key={i} className={`rounded-xl p-3 text-sm ${m.role === "user" ? "bg-plum-50" : "bg-stone-50"}`}><strong>{m.role === "user" ? "You" : "Her Companion"}: </strong>{m.content}</p>))}
        {busy && <p className="text-sm text-stone-500">Her Companion is thinking…</p>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="input" placeholder="Ask in your own words…" aria-label="Message Her Companion" maxLength={4000} />
        <button className="btn-primary">Send</button>
      </form>
      <p className="mt-2 text-xs text-stone-500">Private to your account. You can delete conversations anytime from Settings → Privacy.</p>
    </main>
  );
}
