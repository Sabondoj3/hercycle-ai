import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: (session as any).userId } });
  if (!user) redirect("/login");
  const age = Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / 3.15576e10);
  return (
    <div><Nav />
      <main id="main" className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="text-3xl font-bold text-plum-800">Profile</h1>
        <div className="card mt-4 text-sm">
          <p><strong>{user.displayName || user.fullName}</strong> · {user.email} · Age {age} · {user.country}</p>
          <p>Typical cycle: {user.typicalCycleLength ?? "—"} days · Period: {user.typicalPeriodLength ?? "—"} days</p>
        </div>
        <div className="card mt-4 grid gap-2">
          <h2 className="font-bold">Your data rights</h2>
          <div className="flex flex-wrap gap-2">
            <a className="btn-secondary text-sm" href="/api/account/export">Export my data (JSON)</a>
            <form action="/api/account/delete" method="POST" onSubmit={(e) => { if (!confirm("Delete your account and all data? This cannot be undone.")) e.preventDefault(); }}><button className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">Delete account</button></form>
          </div>
        </div>
      </main>
    </div>
  );
}
