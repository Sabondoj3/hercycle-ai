import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await req.formData().catch(() => null);
  const keys = ["periodReminder", "logReminder", "medicationReminder", "hydrationReminder"];
  const data: any = {};
  // checkboxes: present=on means true; absent means false (form posts only checked)
  if (fd) for (const k of keys) data[k] = fd.get(k) === "on";
  else Object.assign(data, await req.json().catch(() => ({})));
  await prisma.notificationPreference.upsert({
    where: { userId: (session as any).userId },
    update: data, create: { userId: (session as any).userId, ...data },
  });
  return NextResponse.redirect(new URL("/settings", req.url));
}
