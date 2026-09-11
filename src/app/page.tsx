import Link from "next/link";

export default function LandingPage() {
  return (
    <main id="main" className="mx-auto max-w-5xl px-5 pb-20">
      <header className="flex items-center justify-between py-6">
        <div><p className="text-2xl font-bold text-plum-800">HerCycle AI</p><p className="text-sm text-stone-500">Track. Understand. Ask. Care.</p></div>
        <nav className="flex gap-3" aria-label="Primary">
          <Link className="btn-secondary" href="/login">Sign in</Link>
          <Link className="btn-primary" href="/register">Get started</Link>
        </nav>
      </header>
      <section className="mt-10 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-stone-900 md:text-5xl">UNDERSTAND YOUR CYCLE.<br />UNDERSTAND YOUR BODY.</h1>
          <p className="mt-4 text-lg text-stone-600">Track your menstrual cycle, recognize patterns, ask sensitive questions privately, and stay better informed about your menstrual health.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/register">Get started</Link>
            <Link className="btn-secondary" href="/learn">Learn more</Link>
          </div>
          <p className="mt-6 text-xs text-stone-500">HerCycle AI provides tracking and education — not diagnosis. Predictions are estimates and may not be accurate.</p>
        </div>
        <div className="card" aria-label="Preview">
          <p className="font-bold">Private by design</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-stone-600">
            <li>Cycle tracking + calendar + predictions</li>
            <li>Her Companion AI — supportive, non-judgmental</li>
            <li>Health reports for appointments</li>
            <li>Privacy mode, app lock, neutral reminders</li>
          </ul>
        </div>
      </section>
      <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Features">
        {[["Cycle Tracking","Periods, flow, symptoms, mood, pain."],["AI Companion","Ask without shame — educational guidance."],["Privacy First","You control, export or delete your data."],["Personalized Insights","Trends based only on what you recorded."],["Health Reports","PDF summaries for clinicians."],["Educational Library","Reviewed articles with sources."]].map(([t,d])=>(
          <div key={t} className="card"><h2 className="font-bold text-plum-800">{t}</h2><p className="mt-1 text-sm text-stone-600">{d}</p></div>
        ))}
      </section>
      <section className="card mt-8" aria-label="FAQ">
        <h2 className="font-bold">FAQ</h2>
        <p className="mt-2 text-sm"><strong>Does HerCycle AI diagnose conditions?</strong> No. It offers tracking, education and cautious pattern alerts. It never states you have a disease.</p>
        <p className="mt-2 text-sm"><strong>Is my data private?</strong> Yes — encryption in transit, least-privilege access, export/delete controls, and no sale of health data.</p>
        <p className="mt-2 text-sm"><strong>Can fertility predictions be used for contraception?</strong> No. Cycle-based fertility predictions are estimates and should not be relied upon as the sole method of contraception.</p>
      </section>
    </main>
  );
}
