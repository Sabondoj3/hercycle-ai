import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { summarizeCycles, predictNext } from "@/lib/cycle";

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session as any).userId as string;
  const cycles = await prisma.cycleRecord.findMany({ where: { userId }, orderBy: { startDate: "asc" }, include: { days: true } });
  const starts = cycles.map((c) => c.startDate);
  const stats = summarizeCycles(starts, cycles.map((c) => (c.endDate ? 5 : null)));
  const pred = predictNext(starts, stats.avgCycleLength, 5);
  return (
    <div><Nav />
      <main id="main" className="mx-auto max-w-5xl px-5 py-8">
        <a href="/dashboard" className="inline-block mb-4 font-semibold text-plum-700 hover:underline">
          ← Back to Home
        </a>
        <h1 className="text-3xl font-bold text-plum-800">Calendar</h1>
        <p className="text-sm text-stone-600">Period days ● · Predicted ◐ · Fertile window (estimate) ◑ — labels included, not color alone.</p>
        <div className="card mt-4">
          <h2 className="font-bold">Recorded periods</h2>
          <ul className="mt-2 text-sm">{cycles.map((c) => (<li key={c.id}>Period: {new Date(c.startDate).toDateString()}{c.endDate ? ` – ${new Date(c.endDate).toDateString()}` : " (ongoing)"} · {c.days.length} flow entries</li>))}</ul>
          {cycles.length === 0 && <p className="text-sm">No periods recorded yet. Log your first period to begin.</p>}
        </div>
        <div className="card mt-4">
          <h2 className="font-bold">Upcoming (estimates)</h2>
          <p className="text-sm">Next period: {pred.nextPeriodStart ? pred.nextPeriodStart.toDateString() : "Not enough data"} · Confidence: {pred.confidence}</p>
          <p className="text-sm">Fertile window (estimate): {pred.fertileStart && pred.fertileEnd ? `${pred.fertileStart.toDateString()} – ${pred.fertileEnd.toDateString()}` : "—"}</p>
          <p className="mt-2 text-xs text-stone-500">Cycle-based fertility predictions are estimates and should not be relied upon as the sole method of contraception.</p>
        </div>
      </main>
    </div>
  );
}
