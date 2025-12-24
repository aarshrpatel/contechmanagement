import { notFound } from "next/navigation";
import { ProjectSidebarLayout } from "@/components/project/ProjectSidebarLayout";
import { getProject } from "@/lib/actions/project";
import { getProjectBudget } from "@/lib/actions/budget";
import { getProjectDocuments } from "@/lib/actions/documents";
import { Project, ProjectPhase } from "@/lib/mock-data";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;

    // 1. Fetch all data in parallel
    const [dbProject, dbBudget, dbDocs] = await Promise.all([
        getProject(id),
        getProjectBudget(id),
        getProjectDocuments(id)
    ]);

    if (!dbProject) {
        notFound();
    }

    // 2. Map Database structure to Frontend Interface (Adapter Pattern)
    const project: Project = {
        id: dbProject.id,
        name: dbProject.name,
        location: dbProject.location,
        budget: dbProject.budget,
        spent: dbProject.spent,
        phase: dbProject.phase as ProjectPhase,
        startDate: dbProject.start_date || "",
        completionDate: dbProject.completion_date || "",
        image: dbProject.image_url || "",

        // Map Budget Categories
        budgetBreakdown: dbBudget.map(cat => ({
            id: cat.id,
            category: cat.name,
            allocated: cat.allocated,
            spent: cat.items.reduce((sum, item) => sum + item.actuals, 0), // Calculate spent from items
            status: cat.status as "on-track" | "at-risk" | "over-budget",
            items: cat.items.map(item => ({
                id: item.id,
                name: item.name,
                vendor: item.vendor || undefined,
                estimated: item.estimated,
                actuals: item.actuals,
                invoices: item.invoices.map(inv => ({
                    id: inv.id,
                    description: inv.description,
                    amount: inv.amount,
                    date: inv.date,
                    status: inv.status as "paid" | "pending"
                }))
            }))
        })),

        // Map Documents
        documents: dbDocs.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type as "PDF" | "DWG" | "Image" | "Excel",
            category: doc.category as "Contracts" | "Permits" | "Drawings" | "Financials",
            size: doc.size || "",
            date: doc.date ? new Date(doc.date).toISOString().split('T')[0] : "",
            stepId: doc.step_id || undefined
        }))
    };

    return <ProjectSidebarLayout project={project} />;
}
