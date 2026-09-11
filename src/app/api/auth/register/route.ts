import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  const d = parsed.data;
  const email = d.email.toLowerCase().trim();
  if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  const age = (Date.now() - new Date(d.dateOfBirth).getTime()) / 3.15576e10;
  if (age < 13) return NextResponse.json({ error: "You must be at least 13 (or local age of consent) to register." }, { status: 400 });
  const passwordHash = await bcrypt.hash(d.password, 12);
  const user = await prisma.user.create({
    data: {
      email, passwordHash, fullName: d.fullName, displayName: d.displayName, dateOfBirth: new Date(d.dateOfBirth),
      country: d.country, locale: d.locale || "en", phone: d.phone, heightCm: d.heightCm, weightKg: d.weightKg,
      typicalCycleLength: d.typicalCycleLength, typicalPeriodLength: d.typicalPeriodLength,
      profile: { create: {} },
      consents: { create: [{ type: "privacy_policy", granted: true }, { type: "terms", granted: true }, { type: "tracking", granted: true }] },
      notifPrefs: { create: {} },
    },
  });
  return NextResponse.json({ ok: true, id: user.id });
}
