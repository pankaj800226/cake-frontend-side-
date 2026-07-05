import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function proxy(req: NextRequest) {
  const token = req.cookies.get("userToken");


  if (!token?.value) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export default proxy; 

export const config = {
  matcher: [
    // "/",
    "/cakes",
  ],
};