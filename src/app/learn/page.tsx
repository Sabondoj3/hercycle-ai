import { prisma } from "@/lib/db";
import { Nav } from "@/components/Nav";

export default async function LearnPage() {
  const articles = await prisma.educationArticle.findMany({ orderBy: { title: "asc" } }).catch(() => []);
  const fallback = [
    { title: "Understanding menstruation", body: "The menstrual cycle is counted from the first day of one period to the first day of the next. Educational only — not diagnosis." },
    { title: "When to see a doctor", body: "Consider professional advice for very heavy/prolonged bleeding, severe pain, large changes, or any symptom that worries you. Urgent symptoms need emergency care." },
  ];
  return (
    <div><Nav />
      <main id="main" className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-3xl font-bold text-plum-800">Learn</h1>
        {(articles.length ? articles.map((a) => ({ title: a.title, body: a.bodyMd })) : fallback).map((a) => (
          <article key={a.title} className="card mt-4"><h2 className="font-bold">{a.title}</h2><p className="mt-1 text-sm text-stone-600">{a.body}</p><p className="mt-1 text-xs text-stone-500">Educational information, not a diagnosis. Sources reviewed by health content reviewers.</p></article>
        ))}
      </main>
    </div>
  );
}
