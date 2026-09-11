import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { summarizeCycles, periodDurationDays } from "@/lib/cycle";

function rangeStartOf(range: string): Date {
  const now = new Date();
  if (range === "last_cycle") return new Date(now.getTime() - 60 * 864e5);
  const months = range === "3m" ? 3 : range === "12m" ? 12 : 6;
  return new Date(now.getTime() - months * 30 * 864e5);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;
  const { range } = await req.json().catch(() => ({ range: "3m" }));
  const start = rangeStartOf(String(range || "3m"));
  const cycles = await prisma.cycleRecord.findMany({ where: { userId, startDate: { gte: start } }, orderBy: { startDate: "asc" } });
  const stats = summarizeCycles(cycles.map((c) => c.startDate), cycles.map((c) => (c.endDate ? periodDurationDays(c.startDate, c.endDate) : null)));
  const symptoms = await prisma.dailySymptom.groupBy({ by: ["symptomKey"], where: { userId, date: { gte: start } }, _count: true });
  const pains = await prisma.painLog.findMany({ where: { userId, date: { gte: start } } });
  const avgPain = pains.length ? pains.reduce((a, p) => a + p.score, 0) / pains.length : null;
  const alerts = await prisma.healthAlert.findMany({ where: { userId, createdAt: { gte: start } }, orderBy: { createdAt: "desc" } });
  const summary = {
    range, from: start, to: new Date(),
    cycles: stats, symptomFrequency: symptoms, avgPain,
    notablePatterns: alerts.map((a) => ({ level: a.level, title: a.title, message: a.message })),
    medicalDisclaimer: "HerCycle AI provides tracking and education, not diagnosis. Predictions and alerts are based on information you record and may not be accurate.",
  };
  const report = await prisma.healthReport.create({ data: { userId, rangeStart: start, rangeEnd: new Date(), summaryJson: JSON.stringify(summary) } });
  return NextResponse.json({ id: report.id, summary });
}
