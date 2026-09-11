import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Forms post FormData; accept both JSON and form.
  let privacyMode = false, neutral = false, pin = "";
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) { const j = await req.json(); privacyMode = !!j.privacyMode; neutral = !!j.neutralNotifications; pin = String(j.pin || ""); }
  else { const fd = await req.formData(); privacyMode = fd.get("privacyMode") === "on"; neutral = fd.get("neutralNotifications") === "on"; pin = String(fd.get("pin") || ""); }
  const data: any = { privacyMode, neutralNotifications: neutral };
  if (pin && /^[0-9]{4,8}$/.test(pin)) data.appLockPinHash = await bcrypt.hash(pin, 10);
  await prisma.user.update({ where: { id: (session as any).userId }, data });
  return NextResponse.redirect(new URL("/settings", req.url));
}
