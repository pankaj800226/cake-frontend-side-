import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("adminToken");

  if (!token?.value) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/allProduct",
    "/cakes",
    "/AllCakes",
    "/CategoryFilter",
  ],
};