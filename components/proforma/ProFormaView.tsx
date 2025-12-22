"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import { Project } from "@/lib/mock-data";

export function ProFormaView({ project }: { project: Project }) {
    // Initial state logic (mocked default values or from project)
    const [landCost, setLandCost] = useState(2500000);
    const [gla, setGla] = useState(25000); // Gross Leasable Area in sqft
    const [hardCostPerSqft, setHardCostPerSqft] = useState(250);
    const [softCostPercent, setSoftCostPercent] = useState(20); // % of Hard Cost

    const [rentPerSqft, setRentPerSqft] = useState(32); // Annual NNN
    const [vacancyRate, setVacancyRate] = useState(5); // %
    const [capRate, setCapRate] = useState(6.5); // Exit Cap Rate

    // Calculations
    const hardCosts = gla * hardCostPerSqft;
    const softCosts = hardCosts * (softCostPercent / 100);
    const totalProjectCost = landCost + hardCosts + softCosts;

    const grossPotentialRent = gla * rentPerSqft;
    const vacancyLoss = grossPotentialRent * (vacancyRate / 100);
    const effectiveGrossIncome = grossPotentialRent - vacancyLoss;
    const noi = effectiveGrossIncome; // Assuming NNN (Net Lease), so expenses passed to tenant usually

    const yieldOnCost = (noi / totalProjectCost) * 100;
    const exitValue = noi / (capRate / 100);
    const projectedProfit = exitValue - totalProjectCost;
    const profitMargin = (projectedProfit / totalProjectCost) * 100;

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Cost Assumptions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Land Acquisition Cost ($)</Label>
                            <Input
                                type="number"
                                value={landCost}
                                onChange={(e) => setLandCost(Number(e.target.value))}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Building Size (GLA sqft)</Label>
                                <Input
                                    type="number"
                                    value={gla}
                                    onChange={(e) => setGla(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Hard Costs ($/sqft)</Label>
                                <Input
                                    type="number"
                                    value={hardCostPerSqft}
                                    onChange={(e) => setHardCostPerSqft(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Soft Costs (% of Hard)</Label>
                                <span className="text-sm text-muted-foreground">${(softCosts).toLocaleString()}</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Input
                                    type="number"
                                    value={softCostPercent}
                                    onChange={(e) => setSoftCostPercent(Number(e.target.value))}
                                    className="w-24"
                                />
                                <div className="h-2 flex-1 bg-zinc-100 rounded overflow-hidden">
                                    <div className="h-full bg-blue-200" style={{ width: `${softCostPercent}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center font-semibold pt-2">
                            <span>Total Project Cost</span>
                            <span>${totalProjectCost.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Income Assumptions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Rent ($/sqft NNN)</Label>
                                <Input
                                    type="number"
                                    value={rentPerSqft}
                                    onChange={(e) => setRentPerSqft(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Vacancy Reserve (%)</Label>
                                <Input
                                    type="number"
                                    value={vacancyRate}
                                    onChange={(e) => setVacancyRate(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Exit Cap Rate (%)</Label>
                            <Input
                                type="number"
                                value={capRate}
                                step="0.1"
                                onChange={(e) => setCapRate(Number(e.target.value))}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="bg-zinc-50 border-blue-200 dark:bg-blue-950/10 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="text-blue-900 dark:text-blue-100">Financial Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Yield on Cost (ROC)</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{yieldOnCost.toFixed(2)}%</span>
                                <span className="text-sm text-zinc-500">Target: 7.00%</span>
                            </div>
                        </div>

                        <Separator className="bg-blue-200 dark:bg-blue-800" />

                        <div className="grid grid-cols-2 gap-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Net Operating Income</p>
                                <p className="text-xl font-semibold">${noi.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Projected Exit Value</p>
                                <p className="text-xl font-semibold">${Math.round(exitValue).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="pt-4 bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Projected Profit</span>
                                <span className="font-bold text-green-600 dark:text-green-400 text-lg">+${Math.round(projectedProfit).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Profit Margin</span>
                                <span className="font-medium">{profitMargin.toFixed(1)}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sensitivity / Charts placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sensitivity Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            What happens if Cap Rates expand by 50bps?
                        </p>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Base Case ({capRate}%)</span>
                                <span className="font-medium text-green-600">${Math.round(projectedProfit).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Stressed (+0.5%)</span>
                                {/* Calculate stress logic inline for display */}
                                <span className="font-medium text-amber-600">
                                    ${Math.round((noi / ((capRate + 0.5) / 100)) - totalProjectCost).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Stressed (+1.0%)</span>
                                <span className="font-medium text-red-600">
                                    ${Math.round((noi / ((capRate + 1.0) / 100)) - totalProjectCost).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
