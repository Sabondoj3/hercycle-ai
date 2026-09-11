import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;
  const { startDate, endDate } = await req.json().catch(() => ({}));
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return NextResponse.json({ error: "Invalid start date." }, { status: 400 });
  const cycle = await prisma.cycleRecord.create({ data: { userId, startDate: start, endDate: endDate ? new Date(endDate) : undefined } });
  await recomputeAlerts(userId);
  return NextResponse.json({ ok: true, id: cycle.id });
}

export async function recomputeAlerts(userId: string) {
  const { evaluateRules } = await import("@/lib/health-rules");
  const { cycleLengths, periodDurationDays } = await import("@/lib/cycle");
  const cycles = await prisma.cycleRecord.findMany({ where: { userId }, orderBy: { startDate: "asc" } });
  const lengths = cycleLengths(cycles.map((c) => c.startDate));
  const durations = cycles.map((c) => (c.endDate ? periodDurationDays(c.startDate, c.endDate) : null));
  const pains = await prisma.painLog.findMany({ where: { userId } });
  const symptoms = await prisma.dailySymptom.findMany({ where: { userId } });
  const byDate = new Map<string, { heavy: boolean; dizzy: boolean }>();
  for (const s of symptoms) {
    const k = new Date(s.date).toDateString();
    const e = byDate.get(k) || { heavy: false, dizzy: false };
    if (s.symptomKey === "dizziness") e.dizzy = true;
    byDate.set(k, e);
  }
  const days = await prisma.periodDay.findMany({ where: { cycle: { userId } } });
  for (const d of days) {
    if (d.flow === "heavy") { const k = new Date(d.date).toDateString(); const e = byDate.get(k) || { heavy: false, dizzy: false }; e.heavy = true; byDate.set(k, e); }
  }
  const heavyPlusDizzy = [...byDate.values()].filter((v) => v.heavy && v.dizzy).length;
  const alerts = evaluateRules({
    cycleLengths: lengths,
    periodDurations: durations,
    heavyDays: days.filter((d) => d.flow === "heavy").length,
    severePainDays: pains.filter((p) => p.score >= 8).length,
    heavyPlusDizzyDays: heavyPlusDizzy,
    spottingBetween: days.filter((d) => d.spottingBetweenPeriods).length,
  });
  for (const a of alerts) {
    const recent = await prisma.healthAlert.findFirst({ where: { userId, ruleId: a.ruleId }, orderBy: { createdAt: "desc" } });
    if (recent && Date.now() - recent.createdAt.getTime() < 7 * 864e5) continue; // avoid spam
    await prisma.healthAlert.create({ data: { userId, ruleId: a.ruleId, level: a.level, title: a.title, message: a.message, evidenceSummary: a.evidence } });
  }
}
