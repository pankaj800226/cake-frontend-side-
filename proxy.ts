// 📁 middleware.ts (Root directory mein)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function proxy(req: NextRequest) {
  const token = req.cookies.get("userToken");

  console.log("Token:", token);

  if (!token?.value) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export default proxy;  // ✅ Bas itna hai, kisi aur file mein import nahi karna