import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";

const PROTECTED_PREFIXES = [
  "/admin/produits",
  "/admin/commandes",
  "/admin/categories",
  "/admin/boutiques",
];

export async function middleware(req: NextRequest) {
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  );
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = token ? await verifyAdminSessionToken(token) : false;

  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/produits/:path*",
    "/admin/commandes/:path*",
    "/admin/categories/:path*",
    "/admin/boutiques/:path*",
  ],
};
