'use client'

import { useState, useTransition } from 'react'
import { MoreVertical, Edit2, Trash2, Lock } from 'lucide-react'
import { deleteCategory } from '@/app/actions/category'
// 1. PRINCIPLE 4: Import shared type instead of defining it locally
import EditCategoryModal, { Category } from '@/components/categories/edit-category-modal'

interface CategoryCardProps {
    category: Category
    isSystem?: boolean
}

export default function CategoryCard({ category, isSystem = false }: CategoryCardProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleting, startDeleteTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm(`Delete category "${category.name}"? This cannot be undone.`)) return

        startDeleteTransition(async () => {
            const formData = new FormData()
            formData.append('id', category.id)
            await deleteCategory(formData)
            setShowMenu(false)
        })
    }

    return (
        <>
            {/* PRINCIPLE 2: Solid backgrounds to prevent ghosting */}
            <div className="group relative flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 transition-all duration-150 ease-out hover:border-border/80">
                {/* Category Info */}
                <div className="flex items-center gap-3">
                    {/* 
                        Note: Inline style untuk background color dinamis (user-generated) 
                        adalah praktik standar di Fintech UI untuk kategori unik. 
                    */}
                    <div
                        className="h-3 w-3 rounded-full shadow-sm ring-1 ring-black/5"
                        style={{ backgroundColor: category.color ?? '#64748B' }}
                    />
                    <span className="text-sm font-medium text-foreground">
                        {category.name}
                    </span>
                </div>

                {/* Actions */}
                <div className="relative">
                    {isSystem ? (
                        <div title="System category cannot be modified" className="p-2">
                            <Lock size={14} className="text-tertiary" />
                        </div>
                    ) : (
                        <button
                            type="button"
                            title="Category actions"
                            aria-label="Category actions"
                            onClick={() => setShowMenu((v) => !v)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-tertiary hover:bg-elevated hover:text-foreground transition-colors active:scale-90"
                        >
                            <MoreVertical size={16} />
                        </button>
                    )}

                    {/* PRINCIPLE 2: Solid Dropdown Menu z-index 50 */}
                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 top-10 z-50 w-36 rounded-xl border border-border bg-surface py-1 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditOpen(true)
                                        setShowMenu(false)
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-muted hover:bg-elevated hover:text-foreground transition-colors"
                                >
                                    <Edit2 size={14} />
                                    Edit
                                </button>

                                <div className="my-1 h-px bg-border" />

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={14} />
                                    {isDeleting ? 'Deleting…' : 'Delete'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Render Edit Modal */}
            {isEditOpen && (
                <EditCategoryModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    category={category}
                />
            )}
        </>
    )
}