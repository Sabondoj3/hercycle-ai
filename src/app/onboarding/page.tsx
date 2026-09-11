import Link from "next/link";
export default function OnboardingPage() {
  const steps = ["Welcome to HerCycle AI", "Track your cycle", "Understand your patterns", "Ask questions privately", "Know when something may deserve professional attention", "Your data belongs to you"];
  return (
    <main id="main" className="mx-auto max-w-xl px-5 py-10">
      <h1 className="text-3xl font-bold text-plum-800">Welcome to HerCycle AI</h1>
      <ol className="card mt-4 grid gap-2 text-sm">{steps.map((s, i) => (<li key={s}><strong>{i + 1}.</strong> {s}</li>))}</ol>
      <p className="mt-3 text-xs text-stone-500">HerCycle AI provides tracking and education — not diagnosis, treatment, or emergency services.</p>
      <div className="mt-4 flex gap-2"><Link className="btn-primary" href="/register">Get started</Link><Link className="btn-secondary" href="/log">Skip to logging</Link></div>
    </main>
  );
}
