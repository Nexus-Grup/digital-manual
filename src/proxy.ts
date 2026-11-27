import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

async function isLoggedIn(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loggedIn = await isLoggedIn(req);

  if (pathname.startsWith("/painel") && !loggedIn) {
    return NextResponse.redirect(new URL("/entrar", req.url));
  }

  if (pathname === "/entrar" && loggedIn) {
    return NextResponse.redirect(new URL("/painel", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*", "/entrar"],
};