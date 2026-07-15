import { ArrowRight, Save } from "lucide-react";
import { createProjectAction, updateProjectAction } from "@/app/admin/actions";

type ProjectEditor = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  challenge: string | null;
  approach: string | null;
  outcome: string | null;
  project_url: string | null;
  services: string[] | null;
  status: "draft" | "published";
  is_featured: boolean;
  display_order: number;
  testimonial_quote: string | null;
  testimonial_author: string | null;
  testimonial_role: string | null;
};

type AdminProjectFormProps = { project?: ProjectEditor };

export function AdminProjectForm({ project }: AdminProjectFormProps) {
  const action = project ? updateProjectAction.bind(null, project.id) : createProjectAction;
  const services = project?.services?.join(", ") ?? "";

  return (
    <form action={action} className="admin-form">
      <div className="admin-form-row">
        <div className="field"><label htmlFor="title">Project title</label><input defaultValue={project?.title} id="title" name="title" required /></div>
        <div className="field"><label htmlFor="slug">URL slug</label><input defaultValue={project?.slug} id="slug" name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" required /></div>
      </div>
      <div className="field"><label htmlFor="summary">Public summary</label><textarea defaultValue={project?.summary} id="summary" name="summary" required rows={4} /></div>
      <div className="admin-form-row">
        <div className="field"><label htmlFor="status">Publication status</label><select defaultValue={project?.status ?? "draft"} id="status" name="status"><option value="draft">Draft</option><option value="published">Published</option></select></div>
        <div className="field"><label htmlFor="displayOrder">Display order</label><input defaultValue={project?.display_order ?? 0} id="displayOrder" min="0" name="displayOrder" type="number" /></div>
      </div>
      <label className="admin-check"><input defaultChecked={project?.is_featured} name="isFeatured" type="checkbox" /> Feature this project on the home page</label>
      <div className="field"><label htmlFor="services">Services <span>Comma-separated</span></label><input defaultValue={services} id="services" name="services" placeholder="Strategy, Design, Development" /></div>
      <div className="field"><label htmlFor="projectUrl">Live project URL <span>Optional</span></label><input defaultValue={project?.project_url ?? ""} id="projectUrl" name="projectUrl" placeholder="https://" type="url" /></div>
      <div className="field"><label htmlFor="challenge">The brief <span>Optional</span></label><textarea defaultValue={project?.challenge ?? ""} id="challenge" name="challenge" rows={5} /></div>
      <div className="field"><label htmlFor="approach">The approach <span>Optional</span></label><textarea defaultValue={project?.approach ?? ""} id="approach" name="approach" rows={5} /></div>
      <div className="field"><label htmlFor="outcome">The outcome <span>Optional</span></label><textarea defaultValue={project?.outcome ?? ""} id="outcome" name="outcome" rows={5} /></div>
      <div className="field"><label htmlFor="testimonialQuote">Approved testimonial <span>Optional</span></label><textarea defaultValue={project?.testimonial_quote ?? ""} id="testimonialQuote" name="testimonialQuote" rows={4} /></div>
      <div className="admin-form-row">
        <div className="field"><label htmlFor="testimonialAuthor">Testimonial author <span>Optional</span></label><input defaultValue={project?.testimonial_author ?? ""} id="testimonialAuthor" name="testimonialAuthor" /></div>
        <div className="field"><label htmlFor="testimonialRole">Author role/company <span>Optional</span></label><input defaultValue={project?.testimonial_role ?? ""} id="testimonialRole" name="testimonialRole" /></div>
      </div>
      <div className="admin-form-actions">
        <button className="button button--primary" type="submit">{project ? <Save size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}{project ? "Save project" : "Create project"}</button>
      </div>
    </form>
  );
}