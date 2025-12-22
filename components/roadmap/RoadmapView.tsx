"use client";

import { Project } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, AlertCircle, ChevronDown, ChevronRight, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type LifecyclePhase = {
    id: string;
    title: string;
    description: string;
    steps: {
        id: string;
        title: string;
        details?: string;
        status: "completed" | "in-progress" | "pending";
    }[];
};

const LIFECYCLE_DATA: LifecyclePhase[] = [
    {
        id: "acquisition",
        title: "Phase 1: Acquisition & Due Diligence",
        description: "Securing land and verifying feasibility.",
        steps: [
            { id: "site_id", title: "Site Identification & Selection", status: "completed" },
            { id: "loi", title: "Letter of Intent (LOI)", status: "completed" },
            { id: "psa", title: "Purchase & Sale Agreement (PSA)", status: "completed" },
            { id: "dd_env", title: "Environmental (Phase I)", status: "completed" },
            { id: "dd_geo", title: "Geotechnical & Survey", status: "in-progress" },
            { id: "closing", title: "Closing", status: "pending" },
        ]
    },
    {
        id: "entitlement",
        title: "Phase 2: Entitlements & Design",
        description: "Legal permissions and design approvals.",
        steps: [
            { id: "concept", title: "Concept Site Plan", status: "pending" },
            { id: "muni_meet", title: "Municipal Pre-App Meetings", status: "pending" },
            { id: "civil_eng", title: "Civil Engineering & Architecture", status: "pending" },
            { id: "site_approval", title: "Site Plan Approval", status: "pending" },
        ]
    },
    {
        id: "precon",
        title: "Phase 3: Pre-Construction & Financing",
        description: "Permitting, Bidding, and Capital.",
        steps: [
            { id: "permits", title: "Building Permits", status: "pending" },
            { id: "bidding", title: "GC Bidding & Selection", status: "pending" },
            { id: "cap_stack", title: "Finalize Capital Stack (Equity/Debt)", status: "pending" },
        ]
    },
    {
        id: "construction",
        title: "Phase 4: Construction",
        description: "Vertical execution.",
        steps: [
            { id: "mobilization", title: "Mobilization & Site Work", status: "pending" },
            { id: "foundation", title: "Foundation & Framing", status: "pending" },
            { id: "systems", title: "Systems & Rough-ins", status: "pending" },
            { id: "finishes", title: "Finishes", status: "pending" },
        ]
    },
    {
        id: "leaseup",
        title: "Phase 5: Post-Construction & Lease-up",
        description: "Occupancy and Turnover.",
        steps: [
            { id: "co", title: "Certificate of Occupancy", status: "pending" },
            { id: "turnover", title: "Tenant Turnover", status: "pending" },
            { id: "opening", title: "Grand Opening", status: "pending" },
        ]
    },
];

export function RoadmapView({ project }: { project: Project }) {
    // Mock logic: If project phase matches, mark some items as in progress.

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl font-semibold">Development Roadmap</h2>
                    <p className="text-sm text-muted-foreground">Detailed status of all project milestones</p>
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> Done</div>
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4 text-blue-500" /> In Progress</div>
                    <div className="flex items-center gap-1"><Circle className="h-4 w-4 text-zinc-300" /> Pending</div>
                </div>
            </div>

            <div className="grid gap-4">
                {LIFECYCLE_DATA.map((phase) => (
                    <PhaseItem key={phase.id} phase={phase} project={project} />
                ))}
            </div>
        </div>
    );
}

function PhaseItem({ phase, project }: { phase: LifecyclePhase, project: Project }) {
    const [isOpen, setIsOpen] = useState(true);

    // Simple mock logic for expanded state visualization
    const isCompletedPhase = false; // Logic to determine if whole phase is done

    // Calculate progress for demo
    const completedCount = phase.steps.filter(s => s.status === 'completed').length;
    const progress = (completedCount / phase.steps.length) * 100;

    return (
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    {isOpen ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                    <div>
                        <h3 className="font-semibold text-lg">{phase.title}</h3>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="w-32 hidden md:block">
                        <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                    </div>
                    <Badge variant="secondary">{phase.steps.length} Steps</Badge>
                </div>
            </div>

            <CardContent className="border-t pt-4 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="space-y-6 pl-8 border-l-2 border-zinc-200 ml-2">
                    {phase.steps.map((step) => {
                        // Find linked docs
                        const stepDocs = project.documents.filter(d => d.stepId === step.id);

                        return (
                            <div key={step.id} className="relative group">
                                {/* Timeline Connector Dot */}
                                <div className="absolute -left-[39px] top-0 bg-white dark:bg-zinc-950 p-1 rounded-full border border-zinc-200 dark:border-zinc-800">
                                    {step.status === 'completed' ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : step.status === 'in-progress' ? (
                                        <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-zinc-300" />
                                    )}
                                </div>

                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "text-sm font-medium",
                                            step.status === 'completed' && "text-zinc-500 line-through",
                                            step.status === 'in-progress' && "text-blue-700 dark:text-blue-300"
                                        )}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {step.status === 'in-progress' && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">Active</Badge>}
                                </div>

                                {/* Linked Documents */}
                                {stepDocs.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {stepDocs.map(doc => (
                                            <Badge key={doc.id} variant="outline" className="pl-1 pr-2 py-1 h-auto gap-1 text-xs cursor-pointer hover:bg-zinc-100 text-muted-foreground">
                                                <FileText className="h-3 w-3" />
                                                {doc.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
