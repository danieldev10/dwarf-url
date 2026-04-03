import { type NextRequest, NextResponse } from "next/server";

import { signOutCurrentSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  await signOutCurrentSession();

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = "/login";
  redirectTo.search = "";
  redirectTo.searchParams.set("message", "You have been signed out.");

  return NextResponse.redirect(redirectTo);
}
