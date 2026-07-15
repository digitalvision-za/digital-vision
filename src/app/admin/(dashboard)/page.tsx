import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { getAdminDashboardData } from "@/lib/admin";

export default async function AdminDashboardPage() {
  const { projects, services, pricing, inquiries } = await getAdminDashboardData();
  const publishedProjects = projects.filter((project) => project.status === "published").length;
  const newInquiries = inquiries.filter((inquiry) => inquiry.status === "new").length;

  return (
    <div className="admin-page">
      <header className="admin-page-header"><div><p className="eyebrow">Owner workspace</p><h1>Good to see you.</h1><p>Manage the public story from here. Drafts stay private until you intentionally publish them.</p></div><Link className="button button--primary" href="/admin/projects/new"><Plus size={17} aria-hidden="true" /> New project</Link></header>
      <section className="admin-summary-grid" aria-label="Content summary">
        <article className="admin-summary-card"><span>Published work</span><strong>{publishedProjects}</strong><Link href="/admin/projects">Manage projects</Link></article>
        <article className="admin-summary-card"><span>Services</span><strong>{services.length}</strong><Link href="/admin/services">Edit services</Link></article>
        <article className="admin-summary-card"><span>New inquiries</span><strong>{newInquiries}</strong><Link href="/admin/inquiries">Open inbox</Link></article>
      </section>
      <section className="admin-panel"><h2>Recently changed projects</h2>{projects.length ? <table className="admin-table"><thead><tr><th>Project</th><th>Status</th><th>Updated</th><th /></tr></thead><tbody>{projects.slice(0, 5).map((project) => <tr key={project.id}><td><strong>{project.title}</strong><br /><span>{project.slug}</span></td><td><span className={`admin-status ${project.status === "draft" ? "admin-status--draft" : ""}`}>{project.status}</span></td><td>{new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(new Date(project.updated_at))}</td><td><Link href={`/admin/projects/${project.id}`}><ArrowUpRight size={17} aria-label={`Edit ${project.title}`} /></Link></td></tr>)}</tbody></table> : <div className="admin-empty">No projects yet. Create a draft, add approved media, then publish it when the case study is ready.</div>}</section>
      {!pricing.length && <section className="admin-panel"><h2>Pricing is not configured</h2><p>Public pricing guidance currently uses the intentional no-price fallback. Add approved starting figures when you are ready.</p><Link className="text-link" href="/admin/pricing">Set pricing guidance <ArrowUpRight size={17} aria-hidden="true" /></Link></section>}
    </div>
  );
}