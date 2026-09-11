import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { recomputeAlerts } from "@/lib/recompute-alerts";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;
  const { startDate, endDate } = await req.json().catch(() => ({}));
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return NextResponse.json({ error: "Invalid start date." }, { status: 400 });
  const existing = await prisma.cycleRecord.findFirst({
    where: {
      userId,
      startDate: start,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "A period with this start date has already been recorded." },
      { status: 409 }
    );
  }

  const cycle = await prisma.cycleRecord.create({
    data: {
      userId,
      startDate: start,
      endDate: endDate ? new Date(endDate) : undefined,
    },
  });
  await recomputeAlerts(userId);
  return NextResponse.json({ ok: true, id: cycle.id });
}
