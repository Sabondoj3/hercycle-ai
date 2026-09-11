import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email = String((creds as any)?.email || "").toLowerCase().trim();
        const password = String((creds as any)?.password || "");
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        await prisma.sessionAudit.create({ data: { userId: user.id, action: "login" } }).catch(() => {});
        return { id: user.id, email: user.email, name: user.displayName || user.fullName } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) { if (user) (token as any).uid = (user as any).id; return token; },
    async session({ session, token }) { (session as any).userId = (token as any).uid; return session; },
  },
  pages: { signIn: "/login" },
});
