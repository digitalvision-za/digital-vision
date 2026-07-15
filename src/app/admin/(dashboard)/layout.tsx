import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin-shell";
import { getAdminContext } from "@/lib/admin";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { email } = await getAdminContext();
  return <AdminShell email={email}>{children}</AdminShell>;
}