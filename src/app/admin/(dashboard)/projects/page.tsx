import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminDashboardData } from "@/lib/admin";

export default async function AdminProjectsPage() {
  const { projects } = await getAdminDashboardData();
  return <div className="admin-page"><header className="admin-page-header"><div><p className="eyebrow">Portfolio</p><h1>Projects</h1><p>Create the archive at a pace that respects client permission and the quality of each story.</p></div><Link className="button button--primary" href="/admin/projects/new"><Plus size={17} aria-hidden="true" /> New project</Link></header><section className="admin-panel">{projects.length ? <table className="admin-table"><thead><tr><th>Project</th><th>Publication</th><th>Featured</th><th /></tr></thead><tbody>{projects.map((project) => <tr key={project.id}><td><strong>{project.title}</strong><br /><span>{project.slug}</span></td><td><span className={`admin-status ${project.status === "draft" ? "admin-status--draft" : ""}`}>{project.status}</span></td><td>{project.is_featured ? "Yes" : "No"}</td><td><Link href={`/admin/projects/${project.id}`}>Edit</Link></td></tr>)}</tbody></table> : <div className="admin-empty">There are no project drafts yet.</div>}</section></div>;
}