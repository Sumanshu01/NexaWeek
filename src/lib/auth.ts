import { cookies } from "next/headers";

const ADMIN_COOKIE = "nexasoul_admin_session";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "nexasoul2026";
}

export { ADMIN_COOKIE };
