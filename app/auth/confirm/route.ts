import { type NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = "/signup";
  redirectTo.search = "";
  redirectTo.searchParams.set(
    "message",
    "Email confirmation is no longer required. Create your account directly.",
  );

  return NextResponse.redirect(redirectTo);
}
