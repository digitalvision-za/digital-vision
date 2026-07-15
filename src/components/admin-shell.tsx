import Link from "next/link";
import { ArrowLeft, FolderKanban, LayoutDashboard, ListTodo, LogOut, MessageSquareText, Settings2, WalletCards } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { Brand } from "./brand";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: ListTodo },
  { href: "/admin/pricing", label: "Pricing", icon: WalletCards },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquareText },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
];

type AdminShellProps = { children: React.ReactNode; email: string };

export function AdminShell({ children, email }: AdminShellProps) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand />
        <nav aria-label="Owner navigation">
          {navigation.map(({ href, label, icon: Icon }) => <Link href={href} key={href}><Icon size={17} aria-hidden="true" /> {label}</Link>)}
        </nav>
        <div className="admin-sidebar-bottom">
          <p>{email}</p>
          <Link href="/" target="_blank"><ArrowLeft size={15} aria-hidden="true" /> View public site</Link>
          <form action={logoutAction}><button type="submit"><LogOut size={15} aria-hidden="true" /> Sign out</button></form>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}