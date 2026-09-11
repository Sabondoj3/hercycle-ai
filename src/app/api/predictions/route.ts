import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { summarizeCycles, predictNext } from "@/lib/cycle";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;
  const cycles = await prisma.cycleRecord.findMany({ where: { userId }, orderBy: { startDate: "asc" } });
  const starts = cycles.map((c) => c.startDate);
  const stats = summarizeCycles(starts, [null]);
  const pred = predictNext(starts, stats.avgCycleLength, null);
  return NextResponse.json({ stats, prediction: { ...pred, fertilityDisclaimer: "Cycle-based fertility predictions are estimates and should not be relied upon as the sole method of contraception." } });
}
