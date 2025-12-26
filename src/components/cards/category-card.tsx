'use client'

import { useState, useTransition } from 'react'
import { MoreVertical, Edit2, Trash2, Lock } from 'lucide-react'
import { deleteCategory } from '@/app/actions/category'
import EditCategoryModal from '@/components/categories/edit-category-modal'

interface CategoryCardProps {
    category: any
    isSystem?: boolean
}

export default function CategoryCard({ category, isSystem = false }: CategoryCardProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleting, startDeleteTransition] = useTransition()

    // --- FIX 1: DELETE LOGIC ---
    const handleDelete = () => {
        if (confirm(`Delete category "${category.name}"? This cannot be undone.`)) {
            startDeleteTransition(async () => {
                // Create FormData manually because the server expects it
                const formData = new FormData()
                formData.append('id', category.id)

                await deleteCategory(formData)
                setShowMenu(false)
            })
        }
    }

    return (
        <>
            <div className="group relative flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 hover:border-border transition-all duration-150 ease-out">
                {/* Category Info */}
                <div className="flex items-center gap-3">
                    <div
                        className="h-3 w-3 rounded-full shadow-sm ring-1 ring-white/10"
                        style={{ backgroundColor: category.color || '#64748B' }}
                    />
                    <span className="text-sm font-medium text-foreground">
                        {category.name}
                    </span>
                </div>

                {/* Actions */}
                <div className="relative">
                    {isSystem ? (
                        <Lock size={14} className="text-tertiary" />
                    ) : (
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-tertiary hover:bg-elevated hover:text-foreground transition-colors"
                        >
                            <MoreVertical size={16} />
                        </button>
                    )}

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                            <div className="absolute right-0 top-10 z-50 w-36 rounded-xl border border-border bg-surface py-1 shadow-xl animate-in fade-in zoom-in-95 duration-100">

                                {/* Edit Button */}
                                <button
                                    onClick={() => {
                                        setIsEditOpen(true)
                                        setShowMenu(false)
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-secondary hover:bg-elevated hover:text-foreground transition-colors"
                                >
                                    <Edit2 size={14} />
                                    Edit
                                </button>

                                <div className="my-1 h-px bg-border" />

                                {/* Delete Button */}
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={14} />
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* --- FIX 2: EDIT MODAL --- */}
            <EditCategoryModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                category={category}
            />
        </>
    )
}