'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '@/lib/types/supabase'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']

export async function getProjects(): Promise<Project[]> {
    const supabase = await createClient()

    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return projects
}

export async function getProject(id: string): Promise<Project | null> {
    const supabase = await createClient()

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching project:', error)
        return null
    }

    return project
}

export async function createProject(formData: FormData) {
    const supabase = await createClient()

    const rawData: ProjectInsert = {
        name: formData.get('name') as string,
        location: formData.get('location') as string,
        phase: formData.get('phase') as string,
        budget: Number(formData.get('budget')),
        start_date: formData.get('start_date') as string,
        completion_date: formData.get('completion_date') as string,
        image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2662&auto=format&fit=crop', // Default placeholder
    }

    const { data, error } = await supabase
        .from('projects')
        .insert(rawData)
        .select()
        .single()

    if (error) {
        console.error('Error creating project:', error)
        throw new Error('Failed to create project')
    }

    revalidatePath('/')
    redirect(`/projects/${data.id}`)
}
