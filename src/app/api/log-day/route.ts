import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { dayLogSchema } from "@/lib/validation";
import { recomputeAlerts } from "@/lib/recompute-alerts";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;
  const parsed = dayLogSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid log entry." }, { status: 400 });
  const d = parsed.data;
  const date = new Date(d.date);
  if (d.flow) {
    let cycle = await prisma.cycleRecord.findFirst({ where: { userId, startDate: { lte: date } }, orderBy: { startDate: "desc" } });
    if (!cycle) cycle = await prisma.cycleRecord.create({ data: { userId, startDate: date } });
    await prisma.periodDay.upsert({
      where: {
        cycleId_date: {
          cycleId: cycle.id,
          date,
        },
      },
      update: {
        flow: d.flow,
      },
      create: {
        cycleId: cycle.id,
        date,
        flow: d.flow,
      },
    });
  }
  for (const s of d.symptoms) await prisma.dailySymptom.create({ data: { userId, date, symptomKey: s } });
  if (d.mood) await prisma.moodLog.create({ data: { userId, date, mood: d.mood } });
  if (typeof d.painScore === "number") await prisma.painLog.create({ data: { userId, date, score: d.painScore, locations: d.painLocations } });
  if (d.medication) await prisma.medicationLog.create({ data: { userId, date, name: d.medication } });
  if (d.notes) await prisma.userNote.create({ data: { userId, date, text: d.notes } });
  await recomputeAlerts(userId).catch(() => {});
  return NextResponse.json({ ok: true });
}
