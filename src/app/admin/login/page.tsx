import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getOptionalOwner } from "@/lib/admin";

type LoginPageProps = { searchParams: Promise<{ configuration?: string; authorization?: string }> };

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const owner = await getOptionalOwner();
  const search = await searchParams;

  if (owner) redirect("/admin");

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <Brand />
        <p className="eyebrow">Owner workspace</p>
        <h1 className="display">Digital Visions, behind the scenes.</h1>
        <p>Sign in with the single owner account created in Supabase. Public signup is intentionally unavailable.</p>
        {search.configuration === "required" && <p className="admin-notice">Add the Supabase environment variables before signing in.</p>}
        {search.authorization === "required" && <p className="admin-notice">This account has not been assigned the owner role.</p>}
        <AdminLoginForm />
      </div>
    </main>
  );
}