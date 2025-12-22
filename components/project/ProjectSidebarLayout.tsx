"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/lib/mock-data";
import { RoadmapView } from "@/components/roadmap/RoadmapView";
import { ProFormaView } from "@/components/proforma/ProFormaView";
import { BudgetView } from "@/components/budget/BudgetView";
import { DocumentsView } from "@/components/documents/DocumentsView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Calendar,
    DollarSign,
    LayoutDashboard,
    TrendingUp,
    PiggyBank,
    FileText,
    Users,
    Settings,
    LogOut,
    ArrowLeft,
    UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectSidebarLayoutProps {
    project: Project;
}

type TabValue = "roadmap" | "proforma" | "budget" | "docs" | "team";

export function ProjectSidebarLayout({ project }: ProjectSidebarLayoutProps) {
    const [activeTab, setActiveTab] = useState<TabValue>("roadmap");

    const menuItems = [
        { id: "roadmap", label: "The Path", icon: LayoutDashboard },
        { id: "proforma", label: "Pro Forma", icon: TrendingUp },
        { id: "budget", label: "Budget", icon: PiggyBank },
        { id: "docs", label: "Documents", icon: FileText },
        { id: "team", label: "Team", icon: Users },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-900">
            {/* Sidebar - Fixed Left, Orange Theme */}
            <aside className="w-64 flex-shrink-0 bg-orange-600 dark:bg-orange-700 text-white flex flex-col h-full border-r border-orange-700/50">
                <div className="p-4 border-b border-orange-500/30">
                    <Link href="/" className="flex items-center gap-2 text-orange-50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="font-medium text-sm">Back to Dashboard</span>
                    </Link>
                    <h2 className="text-xl font-bold tracking-tight">ConTech</h2>
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-3 px-2 mb-2 text-orange-100/80 uppercase text-xs font-semibold tracking-wider">
                        Project Menu
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as TabValue)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    activeTab === item.id
                                        ? "bg-white text-orange-700 shadow-sm"
                                        : "text-orange-50 hover:bg-orange-500/50"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-orange-500/30 mt-auto">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-orange-100 hover:bg-orange-500/50 transition-colors mb-1">
                        <Settings className="h-5 w-5" />
                        Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-orange-100 hover:bg-orange-500/50 transition-colors">
                        <UserCircle className="h-5 w-5" />
                        My Profile
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-900 p-8">
                {/* Project Information Header - Only visible on Roadmap view as requested */}
                {activeTab === 'roadmap' && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{project.name}</h1>
                                    <Badge variant="outline" className="text-sm font-medium border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800">
                                        {project.phase}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {project.location}</span>
                                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Completion: {new Date(project.completionDate).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> Budget: ${(project.budget / 1000000).toFixed(1)}M</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline">Share</Button>
                                <Button>Edit Project</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Views */}
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    {activeTab === 'roadmap' && <RoadmapView project={project} />}

                    {activeTab === 'proforma' && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Pro Forma Analysis</h2>
                                <p className="text-muted-foreground">Live financial modeling and projections.</p>
                            </div>
                            <ProFormaView project={project} />
                        </div>
                    )}

                    {activeTab === 'budget' && (
                        <BudgetView project={project} />
                    )}

                    {activeTab === 'docs' && (
                        <DocumentsView project={project} />
                    )}

                    {activeTab === 'team' && (
                        <div className="p-10 border border-dashed rounded-lg text-center text-muted-foreground">
                            <Users className="h-10 w-10 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium">Team Management Coming Soon</h3>
                            <p>Manage access for Architects, GCs, and Stakeholders.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
