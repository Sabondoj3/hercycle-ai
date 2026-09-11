"use client";
import { useState } from "react";

const SYMPTOMS = ["cramps","back_pain","headache","migraine","breast_tenderness","bloating","fatigue","nausea","acne","dizziness","constipation","diarrhea","sleep_problems","appetite_changes"];
const MOODS = ["happy","calm","energetic","sad","irritable","anxious","stressed","low"];
const PAINLOC = ["lower_abdomen","back","legs","pelvic","headache"];

export default function LogPage() {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body: any = {
      date: String(fd.get("date")), flow: String(fd.get("flow") || ""),
      symptoms: fd.getAll("symptoms").map(String),
      mood: String(fd.get("mood") || "") || undefined,
      painScore: fd.get("painScore") ? Number(fd.get("painScore")) : undefined,
      painLocations: fd.getAll("painLocations").map(String),
      medication: String(fd.get("medication") || "") || undefined,
      notes: String(fd.get("notes") || "") || undefined,
    };
    if (!body.flow) delete body.flow;
    const res = await fetch("/api/log-day", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      form.reset();
      window.location.href = "/dashboard";
      return;
    }

    setMsg("Could not save — check the date and try again.");
  }
  const today = new Date().toISOString().slice(0, 10);
  return (
    <main id="main" className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="text-3xl font-bold text-plum-800">Log today</h1>
      <form onSubmit={submit} className="card mt-4 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="date">Date *</label><input id="date" name="date" type="date" defaultValue={today} className="input" required /></div>
          <div><label className="label" htmlFor="flow">Flow</label><select id="flow" name="flow" className="input"><option value="">No bleeding</option><option value="spotting">Spotting</option><option value="light">Light</option><option value="medium">Medium</option><option value="heavy">Heavy</option></select></div>
        </div>
        <fieldset><legend className="label">Symptoms</legend><div className="flex flex-wrap gap-2">{SYMPTOMS.map((s) => (<label key={s} className="rounded-full border px-3 py-1 text-sm"><input type="checkbox" name="symptoms" value={s} className="mr-1" />{s.replace(/_/g, " ")}</label>))}</div></fieldset>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="mood">Mood</label><select id="mood" name="mood" className="input"><option value="">—</option>{MOODS.map((m) => (<option key={m} value={m}>{m}</option>))}</select></div>
          <div><label className="label" htmlFor="painScore">Pain 0–10</label><input id="painScore" name="painScore" type="number" min={0} max={10} className="input" /></div>
        </div>
        <fieldset><legend className="label">Pain locations</legend><div className="flex flex-wrap gap-2">{PAINLOC.map((p) => (<label key={p} className="rounded-full border px-3 py-1 text-sm"><input type="checkbox" name="painLocations" value={p} className="mr-1" />{p.replace(/_/g, " ")}</label>))}</div></fieldset>
        <div><label className="label" htmlFor="medication">Medication / supplement</label><input id="medication" name="medication" className="input" placeholder="e.g. ibuprofen 200mg" /></div>
        <div><label className="label" htmlFor="notes">Notes</label><textarea id="notes" name="notes" className="input" rows={3} maxLength={2000} /></div>
        <button className="btn-primary">Save entry</button>
        {msg && <p role="status" className="text-sm font-semibold">{msg}</p>}
      </form>
      <div className="card mt-4">
        <h2 className="font-bold">New period?</h2>
        <form action="/api/cycles" method="POST" className="mt-2 flex flex-wrap gap-2" onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const r = await fetch("/api/cycles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ startDate: String(fd.get("startDate")) }) }); setMsg(r.ok ? "Period recorded." : "Could not record period."); }}>
          <input name="startDate" type="date" defaultValue={today} className="input !w-auto" required aria-label="Period start date" />
          <button className="btn-secondary">Record period start</button>
        </form>
      </div>
    </main>
  );
}
