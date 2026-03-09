import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminProjectsPage() {
  await requireRole(['ADMIN']);
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Projects</h1>
      {projects.map((project) => (
        <article key={project.id} className="rounded bg-white p-3 shadow">
          <h2 className="font-medium">{project.name}</h2>
          <p className="text-sm text-slate-600">{project.projectNumber} · {project.clientName}</p>
        </article>
      ))}
    </div>
  );
}
