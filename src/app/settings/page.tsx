import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session as any).userId as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const prefs = await prisma.notificationPreference.findUnique({ where: { userId } });
  return (
    <div><Nav />
      <main id="main" className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="text-3xl font-bold text-plum-800">Settings</h1>
        <form action="/api/settings" method="POST" className="card mt-4 grid gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="privacyMode" defaultChecked={!!user?.privacyMode} /> Private mode (hide sensitive dashboard info)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="neutralNotifications" defaultChecked={!!user?.neutralNotifications} /> Neutral notification wording (“You have a HerCycle reminder”)</label>
          <label className="text-sm">App lock PIN (4–8 digits, optional)<input name="pin" className="input mt-1" pattern="[0-9]{4,8}" inputMode="numeric" placeholder="••••" /></label>
          <button className="btn-primary w-fit">Save privacy settings</button>
        </form>
        <form action="/api/settings/notifications" method="POST" className="card mt-4 grid gap-2">
          <h2 className="font-bold">Notifications</h2>
          {[["periodReminder","Upcoming period"],["logReminder","Log symptoms"],["medicationReminder","Medication"],["hydrationReminder","Hydration"]].map(([k,l])=>(
            <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" name={k} defaultChecked={(prefs as any)?.[k] ?? true} /> {l}</label>
          ))}
          <button className="btn-secondary w-fit">Save notifications</button>
          <p className="text-xs text-stone-500">Sensitive notifications require consent and respect neutral wording when enabled.</p>
        </form>
      </main>
    </div>
  );
}
