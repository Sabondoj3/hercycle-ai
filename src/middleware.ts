export { auth as middleware } from "@/auth";
export const config = { matcher: ["/dashboard/:path*", "/calendar/:path*", "/log/:path*", "/insights/:path*", "/companion/:path*", "/reports/:path*", "/vault/:path*", "/profile/:path*", "/settings/:path*"] };
