import { PROJECTS } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { ProjectSidebarLayout } from "@/components/project/ProjectSidebarLayout";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const project = PROJECTS.find((p) => p.id === id);

    if (!project) {
        notFound();
    }

    return <ProjectSidebarLayout project={project} />;
}
