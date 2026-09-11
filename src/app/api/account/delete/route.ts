import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.sessionAudit.create({ data: { userId: (session as any).userId, action: "delete" } }).catch(() => {});
  await prisma.user.delete({ where: { id: (session as any).userId } });
  return NextResponse.json({ ok: true });
}
