import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import rules from "../src/data/health-rules.json";

async function main() {
  for (const r of rules as any[]) {
    await prisma.healthRule.upsert({
      where: { id: r.rule_id },
      update: { name: r.rule_name, description: r.description, evidenceSource: r.evidence_source, thresholdJson: JSON.stringify(r.threshold), severity: r.severity, recommendation: r.recommendation_text },
      create: { id: r.rule_id, name: r.rule_name, description: r.description, evidenceSource: r.evidence_source, thresholdJson: JSON.stringify(r.threshold), severity: r.severity, recommendation: r.recommendation_text },
    });
  }
  await prisma.symptomCatalog.createMany({
    data: ["cramps","back_pain","headache","migraine","breast_tenderness","bloating","fatigue","nausea","acne","dizziness","constipation","diarrhea","sleep_problems","appetite_changes"].map((k) => ({ key: k, label: k.replace(/_/g, " ") })),
    skipDuplicates: true,
  });
  const articles = [
    { slug: "understanding-menstruation", title: "Understanding menstruation", category: "basics", bodyMd: "The menstrual cycle is counted from the first day of one period to the first day of the next. Length varies between people and over time. This is educational information, not a diagnosis.", sources: ["https://www.acog.org/womens-health/faqs"] },
    { slug: "when-to-see-a-doctor", title: "When to see a doctor", category: "safety", bodyMd: "Consider professional advice for very heavy or prolonged bleeding, severe or worsening pain, large pattern changes, or anything that worries you. Severe bleeding, fainting, or sudden severe pain need urgent care. Educational only.", sources: ["https://www.nhs.uk/conditions/periods/"] },
  ];
  for (const a of articles) await prisma.educationArticle.upsert({ where: { slug: a.slug }, update: a, create: a });

  if (process.env.DEMO_SEED === "true") {
    const email = "demo@hercycle.ai";
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      const u = await prisma.user.create({
        data: { email, passwordHash: await bcrypt.hash("DemoPass123", 10), fullName: "Demo Account", displayName: "Demo", dateOfBirth: new Date("1998-04-12"), country: "Sierra Leone", locale: "en", typicalCycleLength: 28, typicalPeriodLength: 5, profile: { create: { onboardingDone: true } }, notifPrefs: { create: {} } },
      });
      const base = new Date("2026-05-10");
      for (let i = 0; i < 4; i++) {
        const s = new Date(base.getTime() - i * 28 * 864e5);
        await prisma.cycleRecord.create({ data: { userId: u.id, startDate: s, endDate: new Date(s.getTime() + 4 * 864e5) } });
      }
      console.log("Demo account: demo@hercycle.ai / DemoPass123 (DEMO DATA ONLY)");
    }
  }
}
main().finally(() => process.exit(0));
