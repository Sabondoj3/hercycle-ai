"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const r = useRouter();
  const [err, setErr] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr("");
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", { email: String(fd.get("email")), password: String(fd.get("password")), redirect: false });
    if (res?.error) setErr("Invalid email or password.");
    else r.push("/dashboard");
  }
  return (
    <main id="main" className="mx-auto max-w-md px-5 py-10">
      <h1 className="text-3xl font-bold text-plum-800">Welcome back</h1>
      <form onSubmit={onSubmit} className="card mt-6 grid gap-4">
        <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" className="input" required /></div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" className="input" required /></div>
        {err && <p role="alert" className="text-sm font-semibold text-red-700">{err}</p>}
        <button className="btn-primary">Sign in</button>
        <p className="text-sm">No account? <Link href="/register" className="font-semibold text-plum-700">Create one</Link></p>
      </form>
    </main>
  );
}
