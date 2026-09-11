import Link from "next/link";
export function Nav() {
  const links = [["Home","/dashboard"],["Calendar","/calendar"],["Log","/log"],["Insights","/insights"],["AI Companion","/companion"],["Reports","/reports"],["Learn","/learn"],["Vault","/vault"],["Profile","/profile"],["Settings","/settings"]];
  return (
    <nav aria-label="App" className="sticky bottom-0 z-10 border-t bg-white/95 backdrop-blur md:static md:border-0">
      <ul className="mx-auto flex max-w-5xl gap-1 overflow-x-auto p-2">
        {links.map(([l,h])=>(<li key={h}><Link href={h} className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-plum-800 hover:bg-plum-50">{l}</Link></li>))}
      </ul>
    </nav>
  );
}
export function QuickHide({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <form action="/api/settings/quickhide" method="POST" className="mb-3">
        <button className="btn-secondary text-sm" formAction="/api/settings/quickhide">Quick hide (privacy screen)</button>
      </form>
      {children}
    </div>
  );
}
