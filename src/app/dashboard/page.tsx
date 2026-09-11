import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { summarizeCycles, predictNext, regularityLabel, periodDurationDays } from "@/lib/cycle";
import { Nav } from "@/components/Nav";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session as any).userId as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const cycles = await prisma.cycleRecord.findMany({ where: { userId }, orderBy: { startDate: "asc" } });
  const starts = cycles.map((c) => c.startDate);
  const durations = cycles.map((c) => (c.endDate ? periodDurationDays(c.startDate, c.endDate) : null));
  const stats = summarizeCycles(starts, durations);
  const pred = predictNext(starts, stats.avgCycleLength, stats.avgPeriodLength);
  const alerts = await prisma.healthAlert.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 3 });
  const last = cycles.at(-1);
  const name = user?.displayName || user?.fullName?.split(" ")[0] || "there";
  const hidden = user?.privacyMode;

  return (
    <div>
      <Nav />
      <main id="main" className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-3xl font-bold">Hello, {hidden ? "• • •" : name}</h1>
        {hidden && <p className="mt-1 text-sm text-stone-500">Private mode is on — details hidden.</p>}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="card"><p className="text-sm font-semibold text-stone-500">NEXT PERIOD</p><p className="text-xl font-bold">{hidden ? "Hidden" : pred.nextPeriodStart ? `${pred.nextPeriodStart.toDateString()} (${pred.confidence})` : "Not enough data"}</p><p className="text-xs text-stone-500">Estimates improve with more records.</p></div>
          <div className="card"><p className="text-sm font-semibold text-stone-500">AVERAGE CYCLE</p><p className="text-xl font-bold">{stats.avgCycleLength ? `${Math.round(stats.avgCycleLength)} days` : "—"}</p><p className="text-xs">{regularityLabel(stats.variation, stats.count)}</p></div>
          <div className="card"><p className="text-sm font-semibold text-stone-500">AVERAGE PERIOD</p><p className="text-xl font-bold">{stats.avgPeriodLength ? `${stats.avgPeriodLength.toFixed(1)} days` : "—"}</p><p className="text-xs">Last: {last ? new Date(last.startDate).toDateString() : "—"}</p></div>
        </div>
        <div className="card mt-4 overflow-hidden bg-gradient-to-br from-rose2-50 via-white to-lavender-50">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-rose2-600">Your Cycle Guide</p>
              <h2 className="mt-1 text-2xl font-bold text-plum-900">Understand where you are in your cycle</h2>
              <p className="mt-2 max-w-2xl text-sm text-stone-600">
                HerCycle uses your recorded cycle history to estimate upcoming cycle events. Estimates improve as you add more complete cycles.
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm shadow-sm ring-1 ring-rose2-100">
              <p className="font-semibold text-plum-800">Prediction confidence</p>
              <p className="capitalize text-stone-600">{pred.confidence}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-blush-50 p-4">
              <p className="text-2xl">🩸</p>
              <p className="mt-2 text-sm font-semibold text-plum-800">Last period start</p>
              <p className="font-bold">{last ? new Date(last.startDate).toDateString() : "No period recorded"}</p>
            </div>

            <div className="rounded-2xl bg-rose2-50 p-4">
              <p className="text-2xl">🌸</p>
              <p className="mt-2 text-sm font-semibold text-plum-800">Next period</p>
              <p className="font-bold">
                {pred.nextPeriodStart ? pred.nextPeriodStart.toDateString() : "More cycle history needed"}
              </p>
            </div>

            <div className="rounded-2xl bg-lavender-50 p-4">
              <p className="text-2xl">🥚</p>
              <p className="mt-2 text-sm font-semibold text-plum-800">Estimated ovulation</p>
              <p className="font-bold">
                {pred.ovulationDate ? pred.ovulationDate.toDateString() : "Not enough data"}
              </p>
            </div>

            <div className="rounded-2xl bg-peach-50 p-4">
              <p className="text-2xl">🌱</p>
              <p className="mt-2 text-sm font-semibold text-plum-800">Estimated fertile window</p>
              <p className="font-bold">
                {pred.fertileStart && pred.fertileEnd
                  ? `${pred.fertileStart.toDateString()} – ${pred.fertileEnd.toDateString()}`
                  : "Not enough data"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white/75 p-4 ring-1 ring-rose2-100">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-plum-800">Cycle phases</p>
                <p className="text-sm text-stone-600">
                  A simple guide to the main stages of the menstrual cycle.
                </p>
              </div>
              <span className="text-2xl">🌺</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-rose2-50 p-4">
                <p className="text-xl">🩸</p>
                <p className="mt-2 font-semibold text-plum-800">Menstrual phase</p>
                <p className="mt-1 text-sm text-stone-600">Bleeding begins. This is Day 1 of a new cycle.</p>
              </div>

              <div className="rounded-2xl bg-blush-50 p-4">
                <p className="text-xl">🌱</p>
                <p className="mt-2 font-semibold text-plum-800">Follicular phase</p>
                <p className="mt-1 text-sm text-stone-600">The body prepares an egg for possible ovulation.</p>
              </div>

              <div className="rounded-2xl bg-lavender-50 p-4">
                <p className="text-xl">🥚</p>
                <p className="mt-2 font-semibold text-plum-800">Ovulation</p>
                <p className="mt-1 text-sm text-stone-600">An egg may be released. Timing varies from cycle to cycle.</p>
              </div>

              <div className="rounded-2xl bg-peach-50 p-4">
                <p className="text-xl">🌙</p>
                <p className="mt-2 font-semibold text-plum-800">Luteal phase</p>
                <p className="mt-1 text-sm text-stone-600">The body transitions toward the next period if pregnancy does not occur.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/80 p-4 text-sm text-stone-600 ring-1 ring-rose2-100">
            <p className="font-semibold text-plum-800">Fertility guidance</p>
            <p className="mt-1">
              Days outside the estimated fertile window may have lower estimated fertility, but they are not guaranteed “safe days.”
              Cycle-based predictions should not be used as the sole method of contraception.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card"><h2 className="font-bold">Pattern alerts (cautious, not diagnosis)</h2>{alerts.length === 0 ? <p className="text-sm text-stone-600">No concerning pattern detected from currently available records.</p> : alerts.map((a) => (<p key={a.id} className="mt-2 text-sm"><span className="badge bg-amber-100 text-amber-900">{a.level}</span> {a.message}</p>))}<Link href="/insights" className="mt-2 inline-block text-sm font-semibold text-plum-700">View insights →</Link></div>
          <div className="card"><h2 className="font-bold">Quick actions</h2><div className="mt-2 flex flex-wrap gap-2"><Link className="btn-primary" href="/log">+ Log today</Link><Link className="btn-secondary" href="/companion">Ask HerCycle AI</Link><Link className="btn-secondary" href="/reports">Reports</Link></div><p className="mt-3 text-xs text-stone-500">Cycle-based fertility predictions are estimates and should not be relied upon as the sole method of contraception.</p></div>
        </div>
      </main>
    </div>
  );
}
