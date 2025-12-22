"use client";

import { useState } from "react";
import { Project, BudgetLineItem } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, FileText, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BudgetCategoryDetailProps {
    category: Project['budgetBreakdown'][0];
    onBack: () => void;
}

export function BudgetCategoryDetail({ category, onBack }: BudgetCategoryDetailProps) {
    const [items, setItems] = useState<BudgetLineItem[]>(category.items);
    const [isAddingItem, setIsAddingItem] = useState(false);

    // Mock 'Add Item' State
    const [newItemName, setNewItemName] = useState("");
    const [newItemEst, setNewItemEst] = useState("");

    const handleAddItem = () => {
        if (!newItemName || !newItemEst) return;
        const newItem: BudgetLineItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: newItemName,
            estimated: Number(newItemEst),
            actuals: 0,
            invoices: []
        };
        setItems([...items, newItem]);
        setNewItemName("");
        setNewItemEst("");
        setIsAddingItem(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">{category.category}</h2>
                    <p className="text-muted-foreground">Manage line items and invoices.</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button onClick={() => setIsAddingItem(!isAddingItem)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Line Item
                    </Button>
                </div>
            </div>

            {isAddingItem && (
                <Card className="bg-zinc-50 dark:bg-zinc-900 border-dashed border-2">
                    <CardContent className="pt-6 flex items-end gap-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="name">Item Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Concrete Pumping"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                            />
                        </div>
                        <div className="grid w-full max-w-xs items-center gap-1.5">
                            <Label htmlFor="est">Estimated Cost</Label>
                            <Input
                                id="est"
                                type="number"
                                placeholder="0.00"
                                value={newItemEst}
                                onChange={(e) => setNewItemEst(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAddItem}>Save Item</Button>
                        <Button variant="ghost" onClick={() => setIsAddingItem(false)}>Cancel</Button>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Line Items</CardTitle>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No line items yet. Add one to start tracking.
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-800 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Vendor</th>
                                        <th className="p-4 text-right">Estimated</th>
                                        <th className="p-4 text-right">Actuals</th>
                                        <th className="p-4 text-center">Invoices</th>
                                        <th className="p-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                                            <td className="p-4 font-medium">{item.name}</td>
                                            <td className="p-4 text-muted-foreground">{item.vendor || "-"}</td>
                                            <td className="p-4 text-right">${item.estimated.toLocaleString()}</td>
                                            <td className="p-4 text-right font-medium">${item.actuals.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                {item.invoices.length > 0 ? (
                                                    <Badge variant="secondary" className="cursor-pointer hover:bg-zinc-200">
                                                        {item.invoices.length} Inv
                                                    </Badge>
                                                ) : (
                                                    <span className="text-zinc-300">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button size="sm" variant="outline" className="h-8">
                                                    <Plus className="h-3 w-3 mr-1" /> Inv
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
