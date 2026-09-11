import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const report = await prisma.healthReport.findFirst({ where: { id: params.id, userId: (session as any).userId } });
  if (!report) return new Response("Not found", { status: 404 });
  const s = JSON.parse(report.summaryJson);
  // Server-side minimal PDF via jsPDF (works in Node route).
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  let y = 15;
  const line = (t: string) => { doc.text(t.slice(0, 95), 10, y); y += 7; if (y > 280) { doc.addPage(); y = 15; } };
  line("HerCycle AI — Menstrual Health Report");
  line(`Range: ${new Date(s.from).toDateString()} - ${new Date(s.to).toDateString()}`);
  line(`Cycles recorded: ${s.cycles.count} | Avg cycle: ${s.cycles.avgCycleLength ?? "-"} | Variation: ${s.cycles.variation ?? "-"}`);
  line(`Avg pain: ${s.avgPain ?? "-"}`);
  line("Notable patterns (cautious, not diagnosis):");
  for (const n of s.notablePatterns.slice(0, 10)) line(`- [${n.level}] ${n.title}: ${n.message}`.slice(0, 95));
  line("");
  line("HerCycle AI provides tracking and education, not diagnosis.");
  line("Predictions and alerts are based on recorded information and may not be accurate.");
  const pdf = Buffer.from(doc.output("arraybuffer"));
  return new Response(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="hercycle-report-${params.id}.pdf"` } });
}
