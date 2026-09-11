import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;
  const [cycles, moods, pains, meds, notes, convos, reports] = await Promise.all([
    prisma.cycleRecord.findMany({ where: { userId }, include: { days: true } }),
    prisma.moodLog.findMany({ where: { userId } }),
    prisma.painLog.findMany({ where: { userId } }),
    prisma.medicationLog.findMany({ where: { userId } }),
    prisma.userNote.findMany({ where: { userId } }),
    prisma.aiConversation.findMany({ where: { userId }, include: { messages: true } }),
    prisma.healthReport.findMany({ where: { userId } }),
  ]);
  await prisma.sessionAudit.create({ data: { userId, action: "export" } }).catch(() => {});
  return NextResponse.json({ exportedAt: new Date(), cycles, moods, pains, meds, notes, convos, reports });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.user.delete({ where: { id: (session as any).userId } });
  return NextResponse.json({ ok: true });
}
