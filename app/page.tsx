import Link from "next/link";
import { getProjects } from "@/lib/actions/project";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ProjectPhase } from "@/lib/mock-data";
import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";

export default async function Dashboard() {
  const dbProjects = await getProjects();

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Active Development Projects</p>
          </div>
          <CreateProjectDialog />
        </div>

        {dbProjects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
            <p className="text-muted-foreground mb-4">No active projects found.</p>
            <p className="text-sm text-muted-foreground">Add a project in the database to see it here.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dbProjects.map((project) => {
              const percentSpent = (project.spent / project.budget) * 100;
              const startDate = project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A';
              const completionDate = project.completion_date ? new Date(project.completion_date).toLocaleDateString() : 'N/A';
              const imageUrl = project.image_url || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2662&auto=format&fit=crop";

              return (
                <Card key={project.id} className="overflow-hidden border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-md">
                  <div className="h-48 w-full relative">
                    <img
                      src={imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-zinc-900 shadow-sm border-0">
                        {project.phase}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="mr-1 h-3 w-3" />
                      {project.location}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Budget Used</span>
                        <span className="font-medium">{Math.round(percentSpent)}%</span>
                      </div>
                      <Progress value={percentSpent} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Start Date</p>
                        <p className="font-medium mt-1">{startDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">Completion</p>
                        <p className="font-medium mt-1">{completionDate}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-zinc-50 dark:bg-zinc-900/50 p-4">
                    <Button asChild className="w-full" variant="outline">
                      <Link href={`/projects/${project.id}`}>
                        View Project <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
