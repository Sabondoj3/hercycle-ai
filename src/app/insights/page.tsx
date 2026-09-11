import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { summarizeCycles, periodDurationDays } from "@/lib/cycle";

export default async function InsightsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session as any).userId as string;
  const cycles = await prisma.cycleRecord.findMany({ where: { userId }, orderBy: { startDate: "asc" } });
  const starts = cycles.map((c) => c.startDate);
  const durations = cycles.map((c) => (c.endDate ? periodDurationDays(c.startDate, c.endDate) : null));
  const stats = summarizeCycles(starts, durations);
  const alerts = await prisma.healthAlert.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 });
  const symptoms = await prisma.dailySymptom.groupBy({ by: ["symptomKey"], where: { userId }, _count: true, orderBy: { _count: { symptomKey: "desc" } }, take: 8 });
  return (
    <div><Nav />
      <main id="main" className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-3xl font-bold text-plum-800">My Cycle Insights</h1>
        <p className="text-sm text-stone-600">Based only on what you recorded. Never fabricated.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card"><h2 className="font-bold">Cycle summary</h2><p className="text-sm">Recorded cycles: {cycles.length} · Completed gaps: {stats.count}</p><p className="text-sm">Range: {stats.shortest ?? "—"}–{stats.longest ?? "—"} days · Variation: {stats.variation ?? "—"} days</p></div>
          <div className="card"><h2 className="font-bold">Top symptoms</h2>{symptoms.length === 0 ? <p className="text-sm">No symptoms logged yet.</p> : <ul className="text-sm">{symptoms.map((s) => (<li key={s.symptomKey}>{s.symptomKey.replace(/_/g, " ")} — {s._count} days</li>))}</ul>}</div>
        </div>
        <div className="card mt-4"><h2 className="font-bold">Notable patterns (cautious)</h2>{alerts.length === 0 ? <p className="text-sm">No concerning pattern detected from currently available records.</p> : alerts.map((a) => (<div key={a.id} className="mt-2 border-t pt-2 text-sm"><span className="badge bg-amber-100 text-amber-900">{a.level}</span> <strong>{a.title}</strong><p>{a.message}</p><p className="text-xs text-stone-500">Evidence: {a.evidenceSummary}</p></div>))}</div>
      </main>
    </div>
  );
}
