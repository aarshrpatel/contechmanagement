'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/lib/types/supabase'

type BudgetCategory = Database['public']['Tables']['budget_categories']['Row'] & {
    items: (Database['public']['Tables']['budget_items']['Row'] & {
        invoices: Database['public']['Tables']['invoices']['Row'][]
    })[]
}

export async function getProjectBudget(projectId: string): Promise<BudgetCategory[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('budget_categories')
        .select(`
      *,
      items:budget_items (
        *,
        invoices:invoices (*)
      )
    `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching budget:', error)
        return []
    }

    // Type assertion or data transformation if needed, usually Supabase types align well
    // but deep nesting can be tricky for automatic inference if not explicit.
    return data as unknown as BudgetCategory[]
}

export async function addBudgetCategory(projectId: string, name: string, allocated: number) {
    const supabase = await createClient()

    const { error } = await supabase.from('budget_categories').insert({
        project_id: projectId,
        name,
        allocated
    })

    if (error) {
        throw new Error('Failed to add category')
    }

    revalidatePath(`/projects/${projectId}`)
}

export async function addBudgetItem(categoryId: string, name: string, estimated: number) {
    const supabase = await createClient()

    // We need to fetch the project_id to revalidate the correct path
    // Or we can just revalidate the layout? Better to be specific.
    // Ideally we pass projectId down, but for now we can fetch the category parent.

    const { error } = await supabase.from('budget_items').insert({
        category_id: categoryId,
        name,
        estimated
    })

    if (error) {
        throw new Error('Failed to add item')
    }

    // In a real app we'd want to know the project ID to revalidate efficiently
    // For now we might just need to rely on the client refreshing or optimistic updates
    // But since this is a server action, let's try to pass projectId if possible or find it.
    // For simplicity in this POC, we will just revalidate the generic projects path or let the client handle it.
    // Actually, let's query the parent project id.

    const { data: category } = await supabase.from('budget_categories').select('project_id').eq('id', categoryId).single()
    if (category) {
        revalidatePath(`/projects/${category.project_id}`)
    }
}
