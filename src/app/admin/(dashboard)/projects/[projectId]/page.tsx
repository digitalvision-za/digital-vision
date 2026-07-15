import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminProjectForm } from "@/components/admin-project-form";
import { deleteProjectAction, deleteProjectImageAction, uploadProjectImageAction } from "@/app/admin/actions";
import { getAdminContext, getAdminProject } from "@/lib/admin";

type ProjectEditorPageProps = { params: Promise<{ projectId: string }> };
type ProjectImageRecord = { id: string; storage_path: string; alt: string };

export default async function ProjectEditorPage({ params }: ProjectEditorPageProps) {
  const { projectId } = await params;
  const [project, { supabase }] = await Promise.all([getAdminProject(projectId), getAdminContext()]);
  if (!project) notFound();
  const uploadAction = uploadProjectImageAction.bind(null, projectId);
  const removeAction = deleteProjectAction.bind(null, projectId);
  const images = await Promise.all(project.project_images.map(async (image: ProjectImageRecord) => {
    const { data } = await supabase.storage.from("project-media").createSignedUrl(image.storage_path, 60 * 60);
    return { ...image, url: data?.signedUrl ?? "" };
  }));

  return <div className="admin-page"><header className="admin-page-header"><div><Link className="text-link" href="/admin/projects"><ArrowLeft size={16} aria-hidden="true" /> All projects</Link><p className="eyebrow" style={{ marginTop: "25px" }}>Project editor</p><h1>{project.title}</h1><p>{project.status === "published" ? "This project is public." : "This project is a private draft."}</p></div></header><section className="admin-panel"><AdminProjectForm project={project} /></section><section className="admin-panel"><h2>Project media</h2><p>Only upload client-approved JPG, PNG, or WebP files. Useful alternative text is required.</p><form action={uploadAction} className="admin-form" style={{ marginTop: "22px" }}><div className="admin-form-row"><div className="field"><label htmlFor="image">Image file</label><input accept="image/jpeg,image/png,image/webp" id="image" name="image" required type="file" /></div><div className="field"><label htmlFor="alt">Alternative text</label><input id="alt" name="alt" required /></div></div><div className="field"><label htmlFor="sortOrder">Display order</label><input defaultValue="0" id="sortOrder" min="0" name="sortOrder" type="number" /></div><div className="admin-form-actions"><button className="button button--secondary" type="submit"><ImagePlus size={17} aria-hidden="true" /> Upload image</button></div></form>{images.length ? <div className="admin-image-list">{images.map((image) => { const deleteImage = deleteProjectImageAction.bind(null, image.id, projectId); return <article className="admin-image-card" key={image.id}>{image.url && <Image alt={image.alt} height={360} src={image.url} width={480} />}<p>{image.alt}</p><form action={deleteImage}><button type="submit">Remove image</button></form></article>; })}</div> : <div className="admin-empty" style={{ marginTop: "20px" }}>No images have been uploaded for this project.</div>}</section><section className="admin-danger"><h2>Delete this project</h2><p>Removing a project also removes its uploaded media. Type DELETE to confirm.</p><form action={removeAction}><div className="field"><label htmlFor="confirmation">Confirmation</label><input id="confirmation" name="confirmation" placeholder="DELETE" /></div><div className="admin-form-actions"><button className="button" type="submit">Delete project</button></div></form></section></div>;
}