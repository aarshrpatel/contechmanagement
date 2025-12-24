'use client'

import { useState } from 'react'
import { createProject } from '@/lib/actions/project'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { CalendarIcon, Plus } from 'lucide-react'

export function CreateProjectDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // We'll wrap the server action to handle loading state and modal closing
    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            await createProject(formData)
            setOpen(false)
        } catch (error) {
            console.error(error)
            alert('Failed to create project')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Add a new development project to your portfolio.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Skyline Tower"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">
                                Location
                            </Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="New York, NY"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="budget" className="text-right">
                                Budget
                            </Label>
                            <Input
                                id="budget"
                                name="budget"
                                type="number"
                                placeholder="50000000"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phase" className="text-right">
                                Phase
                            </Label>
                            <div className="col-span-3">
                                <Select name="phase" defaultValue="Planning" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select phase" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Planning">Planning</SelectItem>
                                        <SelectItem value="Design">Design</SelectItem>
                                        <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                                        <SelectItem value="Construction">Construction</SelectItem>
                                        <SelectItem value="Post-Construction">Post-Construction</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dates" className="text-right">
                                Start Date
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dates" className="text-right">
                                Completion
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="completion_date"
                                    name="completion_date"
                                    type="date"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
