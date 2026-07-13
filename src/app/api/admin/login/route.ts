import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, getAdminPassword, isAdminAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  return NextResponse.json({ success: true });
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}
