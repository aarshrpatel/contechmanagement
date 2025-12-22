export type ProjectPhase =
    | "Acquisition"
    | "Entitlement"
    | "Pre-Construction"
    | "Construction"
    | "Lease-up";

export interface Invoice {
    id: string;
    description: string;
    amount: number;
    date: string;
    status: "paid" | "pending";
}

export interface BudgetLineItem {
    id: string;
    name: string;
    vendor?: string;
    estimated: number;
    actuals: number;
    invoices: Invoice[];
}

export interface ProjectDocument {
    id: string;
    name: string;
    type: "PDF" | "DWG" | "Image" | "Excel";
    category: "Contracts" | "Permits" | "Drawings" | "Financials";
    size: string;
    date: string;
    stepId?: string; // Links to roadmap step
}

export interface Project {
    id: string;
    name: string;
    location: string;
    budget: number;
    spent: number;
    phase: ProjectPhase;
    startDate: string;
    completionDate: string;
    image: string;
    budgetBreakdown: {
        id: string;
        category: string;
        allocated: number;
        spent: number;
        status: "on-track" | "at-risk" | "over-budget";
        items: BudgetLineItem[];
    }[];
    documents: ProjectDocument[];
}

export const PROJECTS: Project[] = [
    {
        id: "1",
        name: "Sunset Plaza Development",
        location: "Austin, TX",
        budget: 12500000, // $12.5m
        spent: 450000,
        phase: "Acquisition",
        startDate: "2024-01-15",
        completionDate: "2025-08-01",
        image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=2626&auto=format&fit=crop",
        documents: [
            { id: "d1", name: "Purchase Agreement_Final.pdf", type: "PDF", category: "Contracts", size: "2.4 MB", date: "2024-01-10", stepId: "psa" },
            { id: "d2", name: "Phase 1 Environmental.pdf", type: "PDF", category: "Permits", size: "15.0 MB", date: "2023-12-15", stepId: "dd_env" },
            { id: "d3", name: "Site Plan V3.dwg", type: "DWG", category: "Drawings", size: "4.2 MB", date: "2024-02-01", stepId: "concept" },
            { id: "d4", name: "Pro Forma Mode.xlsx", type: "Excel", category: "Financials", size: "1.2 MB", date: "2024-01-20" },
        ],
        budgetBreakdown: [
            {
                id: "land",
                category: "Land Acquisition",
                allocated: 2500000,
                spent: 450000,
                status: "on-track",
                items: [
                    { id: "l1", name: "Purchase Price", estimated: 2400000, actuals: 0, invoices: [] },
                    { id: "l2", name: "Closing Costs", estimated: 100000, actuals: 45000, invoices: [{ id: "inv1", description: "Earnest Money", amount: 45000, date: "2024-01-10", status: "paid" }] },
                ]
            },
            {
                id: "hard",
                category: "Hard Costs (Construction)",
                allocated: 8000000,
                spent: 0,
                status: "on-track",
                items: [
                    { id: "h1", name: "Site Work & Grading", vendor: "TexExcavation", estimated: 800000, actuals: 0, invoices: [] },
                    { id: "h2", name: "Concrete Foundation", estimated: 1200000, actuals: 0, invoices: [] },
                    { id: "h3", name: "Steel / Framing", estimated: 1500000, actuals: 0, invoices: [] },
                ]
            },
            {
                id: "soft",
                category: "Soft Costs (A&E, Legal)",
                allocated: 1500000,
                spent: 0,
                status: "on-track",
                items: []
            },
            {
                id: "finance",
                category: "Financing & Interest",
                allocated: 500000,
                spent: 0,
                status: "on-track",
                items: []
            }
        ]
    },
    {
        id: "2",
        name: "Oak Creek Strip Center",
        location: "Round Rock, TX",
        budget: 8500000,
        spent: 2100000,
        phase: "Construction",
        startDate: "2023-06-01",
        completionDate: "2024-12-01",
        image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?q=80&w=2070&auto=format&fit=crop",
        budgetBreakdown: [
            {
                id: "land",
                category: "Land Acquisition",
                allocated: 1500000,
                spent: 1500000,
                status: "on-track",
                items: []
            },
            {
                id: "hard",
                category: "Hard Costs (Construction)",
                allocated: 5500000,
                spent: 1500000,
                status: "at-risk",
                items: []
            },
            {
                id: "soft",
                category: "Soft Costs (A&E, Legal)",
                allocated: 1000000,
                spent: 500000,
                status: "over-budget",
                items: []
            },
            {
                id: "finance",
                category: "Financing & Interest",
                allocated: 500000,
                spent: 100000,
                status: "on-track",
                items: []
            }
        ],
        documents: []
    },
];
