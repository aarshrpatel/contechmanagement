export type ProjectPhase =
    | "Acquisition"
    | "Entitlement"
    | "Pre-Construction"
    | "Construction"
    | "Lease-up";

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
        category: string;
        allocated: number;
        spent: number;
        status: "on-track" | "at-risk" | "over-budget";
    }[];
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
        budgetBreakdown: [
            { category: "Land Acquisition", allocated: 2500000, spent: 450000, status: "on-track" },
            { category: "Hard Costs (Construction)", allocated: 8000000, spent: 0, status: "on-track" },
            { category: "Soft Costs (A&E, Legal)", allocated: 1500000, spent: 0, status: "on-track" },
            { category: "Financing & Interest", allocated: 500000, spent: 0, status: "on-track" }
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
            { category: "Land Acquisition", allocated: 1500000, spent: 1500000, status: "on-track" },
            { category: "Hard Costs (Construction)", allocated: 5500000, spent: 1500000, status: "at-risk" },
            { category: "Soft Costs (A&E, Legal)", allocated: 1000000, spent: 500000, status: "over-budget" },
            { category: "Financing & Interest", allocated: 500000, spent: 100000, status: "on-track" }
        ]
    },
];
