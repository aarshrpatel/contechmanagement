"use client";

import { Project } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BudgetView({ project }: { project: Project }) {
    const percentTotal = (project.spent / project.budget) * 100;
    const remaining = project.budget - project.spent;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Project Budget</h2>
                <p className="text-muted-foreground">Detailed breakdown of project financials and draw requests.</p>
            </div>

            {/* High Level Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(project.budget / 1000000).toFixed(2)}M</div>
                        <p className="text-xs text-muted-foreground">Original Committed Amount</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Spent to Date</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(project.spent).toLocaleString()}</div>
                        <Progress value={percentTotal} className="mt-2 h-2" />
                        <p className="text-xs text-muted-foreground mt-2">{percentTotal.toFixed(1)}% Deployed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">${(remaining).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Available to draw</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Breakdown Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {project.budgetBreakdown.map((item, index) => {
                            const percent = (item.spent / item.allocated) * 100;
                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium text-sm">{item.category}</div>
                                            <div className="text-xs text-muted-foreground">
                                                ${item.spent.toLocaleString()} spent of ${item.allocated.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <span className="text-sm font-bold">{Math.round(percent)}%</span>
                                            </div>
                                            {item.status === 'on-track' && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Good</Badge>}
                                            {item.status === 'at-risk' && <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0"><AlertCircle className="w-3 h-3 mr-1" /> Watch</Badge>}
                                            {item.status === 'over-budget' && <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 border-0"><AlertCircle className="w-3 h-3 mr-1" /> Over</Badge>}
                                        </div>
                                    </div>
                                    <Progress
                                        value={percent}
                                        className={cn("h-2",
                                            item.status === 'over-budget' ? "bg-red-100 [&>div]:bg-red-600" :
                                                item.status === 'at-risk' ? "bg-amber-100 [&>div]:bg-amber-500" :
                                                    "bg-zinc-100 [&>div]:bg-green-600"
                                        )}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-blue-900 dark:text-blue-100">Pending Change Orders</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300">3 items requiring approval</p>
                            </div>
                            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-200">Review</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Next Draw Request</h4>
                                <p className="text-sm text-muted-foreground">Due in 5 days (Dec 27)</p>
                            </div>
                            <Button variant="outline">Prepare Draw</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
