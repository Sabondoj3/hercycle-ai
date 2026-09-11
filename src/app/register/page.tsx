"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const r = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body: any = Object.fromEntries(fd.entries());
    body.consentPrivacy = fd.get("consentPrivacy") === "on";
    body.consentTerms = fd.get("consentTerms") === "on";
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) { setErr(j.error || "Registration failed."); return; }
    r.push("/login?registered=1");
  }
  return (
    <main id="main" className="mx-auto max-w-xl px-5 py-10">
      <h1 className="text-3xl font-bold text-plum-800">Create your HerCycle account</h1>
      <p className="mt-1 text-sm text-stone-600">Your data belongs to you. You can export or delete it anytime.</p>
      <form onSubmit={onSubmit} className="card mt-6 grid gap-4" aria-label="Registration form">
        <div><label className="label" htmlFor="fullName">Full name *</label><input id="fullName" name="fullName" className="input" required /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="email">Email *</label><input id="email" name="email" type="email" className="input" required /></div>
          <div><label className="label" htmlFor="password">Password (min 10 chars, upper+lower+number) *</label><input id="password" name="password" type="password" className="input" required minLength={10} /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="dateOfBirth">Date of birth *</label><input id="dateOfBirth" name="dateOfBirth" type="date" className="input" required /></div>
          <div><label className="label" htmlFor="country">Country *</label><input id="country" name="country" className="input" required /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="displayName">Preferred display name</label><input id="displayName" name="displayName" className="input" /></div>
          <div><label className="label" htmlFor="locale">Preferred language</label><select id="locale" name="locale" className="input" defaultValue="en"><option value="en">English</option><option value="fr">French (soon)</option><option value="es">Spanish (soon)</option><option value="pt">Portuguese (soon)</option><option value="ar">Arabic (soon)</option><option value="hi">Hindi (soon)</option></select></div>
        </div>
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="consentPrivacy" required className="mt-1" /> I consent to the privacy policy and menstrual-health data storage. *</label>
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="consentTerms" required className="mt-1" /> I agree to the terms of service. *</label>
        {err && <p role="alert" className="text-sm font-semibold text-red-700">{err}</p>}
        <button className="btn-primary" disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
        <p className="text-sm">Have an account? <Link href="/login" className="font-semibold text-plum-700">Sign in</Link></p>
      </form>
    </main>
  );
}
