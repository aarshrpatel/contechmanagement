export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    avatar_url: string | null
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                }
            }
            projects: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    location: string
                    budget: number
                    spent: number
                    phase: string
                    start_date: string | null
                    completion_date: string | null
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    name: string
                    location: string
                    budget?: number
                    spent?: number
                    phase: string
                    start_date?: string | null
                    completion_date?: string | null
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    location?: string
                    budget?: number
                    spent?: number
                    phase?: string
                    start_date?: string | null
                    completion_date?: string | null
                    image_url?: string | null
                    created_at?: string
                }
            }
            budget_categories: {
                Row: {
                    id: string
                    project_id: string
                    name: string
                    allocated: number
                    status: 'on-track' | 'at-risk' | 'over-budget'
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    name: string
                    allocated?: number
                    status?: 'on-track' | 'at-risk' | 'over-budget'
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    name?: string
                    allocated?: number
                    status?: 'on-track' | 'at-risk' | 'over-budget'
                    created_at?: string
                }
            }
            budget_items: {
                Row: {
                    id: string
                    category_id: string
                    name: string
                    vendor: string | null
                    estimated: number
                    actuals: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    category_id: string
                    name: string
                    vendor?: string | null
                    estimated?: number
                    actuals?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    category_id?: string
                    name?: string
                    vendor?: string | null
                    estimated?: number
                    actuals?: number
                    created_at?: string
                }
            }
            invoices: {
                Row: {
                    id: string
                    budget_item_id: string
                    description: string
                    amount: number
                    date: string
                    status: 'paid' | 'pending'
                    created_at: string
                }
                Insert: {
                    id?: string
                    budget_item_id: string
                    description: string
                    amount: number
                    date: string
                    status?: 'paid' | 'pending'
                    created_at?: string
                }
                Update: {
                    id?: string
                    budget_item_id?: string
                    description?: string
                    amount?: number
                    date?: string
                    status?: 'paid' | 'pending'
                    created_at?: string
                }
            }
            documents: {
                Row: {
                    id: string
                    project_id: string
                    name: string
                    type: string
                    category: string
                    size: string | null
                    date: string | null
                    step_id: string | null
                    file_path: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    name: string
                    type: string
                    category: string
                    size?: string | null
                    date?: string | null
                    step_id?: string | null
                    file_path: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    name?: string
                    type?: string
                    category?: string
                    size?: string | null
                    date?: string | null
                    step_id?: string | null
                    file_path?: string
                    created_at?: string
                }
            }
        }
    }
}
