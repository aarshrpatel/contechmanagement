'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/lib/types/supabase'

type Document = Database['public']['Tables']['documents']['Row'] & {
    signedUrl?: string
}

export async function getProjectDocuments(projectId: string): Promise<Document[]> {
    const supabase = await createClient()

    const { data: documents, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error || !documents) {
        return []
    }

    // Generate signed URLs for each document
    const docsWithUrls = await Promise.all(documents.map(async (doc) => {
        const { data } = await supabase
            .storage
            .from('project_files')
            .createSignedUrl(doc.file_path, 3600) // 1 hour expiry

        return {
            ...doc,
            signedUrl: data?.signedUrl
        }
    }))

    return docsWithUrls
}

export async function uploadDocument(projectId: string, formData: FormData) {
    const supabase = await createClient()

    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const type = formData.get('type') as string // PDF, DWG, etc.

    if (!file) throw new Error('No file provided')

    // 1. Upload to Supabase Storage
    const path = `${projectId}/${category}/${file.name}`

    const { error: uploadError } = await supabase
        .storage
        .from('project_files')
        .upload(path, file)

    if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error('Failed to upload file')
    }

    // 2. Insert metadata into Database
    const { error: dbError } = await supabase.from('documents').insert({
        project_id: projectId,
        name: file.name,
        type: type || 'Unknown',
        category: category,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        date: new Date().toISOString(),
        file_path: path
    })

    if (dbError) {
        console.error('Database error:', dbError)
        throw new Error('Failed to save document metadata')
    }

    revalidatePath(`/projects/${projectId}`)
}
