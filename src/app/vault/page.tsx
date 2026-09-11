import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";

export default async function VaultPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session as any).userId as string;
  const docs = await prisma.healthDocument.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return (
    <div><Nav />
      <main id="main" className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-3xl font-bold text-plum-800">My Health Vault</h1>
        <p className="text-sm text-stone-600">Optional secure storage. You control upload, view, download, delete and sharing. Nothing is shared automatically.</p>
        <form action="/api/vault/upload" method="POST" encType="multipart/form-data" className="card mt-4 grid gap-2">
          <label className="label" htmlFor="file">Upload document (PDF/image, max 10MB)</label>
          <input id="file" name="file" type="file" required />
          <button className="btn-secondary w-fit">Upload</button>
        </form>
        <div className="card mt-4"><h2 className="font-bold">Documents</h2>{docs.length === 0 ? <p className="text-sm">No documents yet.</p> : <ul className="text-sm">{docs.map((d) => (<li key={d.id}>{d.fileName} ({d.category}) — <a className="font-semibold text-plum-700" href={`/api/vault/${d.id}`}>Download</a></li>))}</ul>}</div>
      </main>
    </div>
  );
}
