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
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card"><h2 className="font-bold">Pattern alerts (cautious, not diagnosis)</h2>{alerts.length === 0 ? <p className="text-sm text-stone-600">No concerning pattern detected from currently available records.</p> : alerts.map((a) => (<p key={a.id} className="mt-2 text-sm"><span className="badge bg-amber-100 text-amber-900">{a.level}</span> {a.message}</p>))}<Link href="/insights" className="mt-2 inline-block text-sm font-semibold text-plum-700">View insights →</Link></div>
          <div className="card"><h2 className="font-bold">Quick actions</h2><div className="mt-2 flex flex-wrap gap-2"><Link className="btn-primary" href="/log">+ Log today</Link><Link className="btn-secondary" href="/companion">Ask HerCycle AI</Link><Link className="btn-secondary" href="/reports">Reports</Link></div><p className="mt-3 text-xs text-stone-500">Cycle-based fertility predictions are estimates and should not be relied upon as the sole method of contraception.</p></div>
        </div>
      </main>
    </div>
  );
}
