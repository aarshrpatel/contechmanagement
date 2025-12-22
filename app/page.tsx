import Link from "next/link";
import { PROJECTS } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Active Development Projects</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => {
            const percentSpent = (project.spent / project.budget) * 100;

            return (
              <Card key={project.id} className="overflow-hidden border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-md">
                <div className="h-48 w-full relative">
                  <img
                    src={project.image}
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
                      <p className="font-medium mt-1">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">Completion</p>
                      <p className="font-medium mt-1">{new Date(project.completionDate).toLocaleDateString()}</p>
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
      </div>
    </>
  );
}
