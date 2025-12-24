"use client";

import { useState } from "react";
import { Project } from "@/lib/mock-data";
import { uploadDocument } from "@/lib/actions/documents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, File, Image as ImageIcon, FileSpreadsheet } from "lucide-react";

export function DocumentsView({ project }: { project: Project }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "Contracts"); // Default for now, could be a selector
        formData.append("type", file.name.split('.').pop()?.toUpperCase() || "FILE");

        try {
            await uploadDocument(project.id, formData);
            // Revalidation happens on server, page should refresh
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    // Helper for file icons
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
            case 'DWG': return <File className="h-5 w-5 text-blue-500" />;
            case 'Excel': return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
            case 'Image': return <ImageIcon className="h-5 w-5 text-purple-500" />;
            default: return <File className="h-5 w-5 text-gray-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Project Documents</h2>
                    <p className="text-muted-foreground">Central repository for all project files.</p>
                </div>
                <div className="flex items-center gap-2">
                    {isUploading && <span className="text-sm text-muted-foreground animate-pulse">Uploading...</span>}
                    <div className="relative">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                        <Button asChild disabled={isUploading}>
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Document
                            </label>
                        </Button>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>File Explorer</CardTitle>
                </CardHeader>
                <CardContent>
                    {project.documents.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Upload className="h-10 w-10 mx-auto mb-4 opacity-20" />
                            <p>No documents uploaded yet.</p>
                            <label htmlFor="file-upload" className="mt-2 inline-block text-orange-600 hover:text-orange-700 cursor-pointer font-medium">
                                Upload your first file
                            </label>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-800 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 text-right">Size</th>
                                        <th className="p-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {project.documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 group">
                                            <td className="p-4 font-medium flex items-center gap-3">
                                                {getFileIcon(doc.type)}
                                                {doc.name}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="font-normal bg-zinc-50">
                                                    {doc.category}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-muted-foreground">{doc.date}</td>
                                            <td className="p-4 text-right text-muted-foreground">{doc.size}</td>
                                            <td className="p-4 text-right">
                                                <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Download className="h-4 w-4" />
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
    )
}
