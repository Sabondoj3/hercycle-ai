import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { chatSchema } from "@/lib/validation";
import { getProvider } from "@/lib/ai-provider";
import { summarizeCycles } from "@/lib/cycle";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;
  const parsed = chatSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  const { message, conversationId, shameFree } = parsed.data;

  let convo = conversationId
    ? await prisma.aiConversation.findFirst({ where: { id: conversationId, userId } })
    : null;
  if (!convo) convo = await prisma.aiConversation.create({ data: { userId, title: message.slice(0, 60), shameFree: !!shameFree } });
  const history = await prisma.aiMessage.findMany({ where: { conversationId: convo.id }, orderBy: { createdAt: "asc" }, take: 20 });
  await prisma.aiMessage.create({ data: { conversationId: convo.id, role: "user", content: message } });

  // Minimal context only: counts + averages, never full notes/vault docs.
  const cycles = await prisma.cycleRecord.findMany({ where: { userId }, orderBy: { startDate: "asc" }, take: 12 });
  const stats = summarizeCycles(cycles.map((c) => c.startDate), [null]);
  const contextSummary = cycles.length
    ? `${cycles.length} period(s) recorded; average cycle ${stats.avgCycleLength ? Math.round(stats.avgCycleLength) + " days" : "unknown"}.`
    : undefined;

  const reply = await getProvider().respond({ message, history: history.map((h) => ({ role: h.role, content: h.content })), contextSummary, shameFree });
  await prisma.aiMessage.create({ data: { conversationId: convo.id, role: "assistant", content: reply } });
  return NextResponse.json({ reply, conversationId: convo.id });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const convos = await prisma.aiConversation.findMany({ where: { userId: (session as any).userId }, orderBy: { updatedAt: "desc" }, take: 20, include: { messages: { orderBy: { createdAt: "asc" } } } });
  return NextResponse.json(convos);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.aiConversation.deleteMany({ where: { id, userId: (session as any).userId } });
  return NextResponse.json({ ok: true });
}
