import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminProjectForm } from "@/components/admin-project-form";

export default function NewProjectPage() {
  return <div className="admin-page"><header className="admin-page-header"><div><Link className="text-link" href="/admin/projects"><ArrowLeft size={16} aria-hidden="true" /> All projects</Link><p className="eyebrow" style={{ marginTop: "25px" }}>New project</p><h1>Create a private draft.</h1><p>The project remains invisible until you select Published and save it.</p></div></header><section className="admin-panel"><AdminProjectForm /></section></div>;
}