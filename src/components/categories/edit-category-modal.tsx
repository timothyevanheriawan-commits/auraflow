'use client'

import { useState, useTransition, useRef } from 'react'
import { X, Check, TrendingUp, TrendingDown, Save, Palette } from 'lucide-react'
import { createCategory, updateCategory } from '@/app/actions/category'
import { toast } from 'sonner'

interface CategoryModalProps {
    isOpen: boolean
    onClose: () => void
    category?: any
}

export default function CategoryModal({ isOpen, onClose, category = null }: CategoryModalProps) {
    const [isPending, startTransition] = useTransition()

    // State Form
    const [type, setType] = useState<'income' | 'expense'>(category?.type || 'expense')
    const [selectedColor, setSelectedColor] = useState(category?.color || '#64748B')

    // Ref untuk Custom Color Picker
    const colorInputRef = useRef<HTMLInputElement>(null)

    // Palette Preset yang lebih lengkap (Tailwind Colors)
    const COLORS = [
        '#64748B', // Slate
        '#EF4444', // Red
        '#F97316', // Orange
        '#EAB308', // Yellow
        '#22C55E', // Green
        '#10B981', // Emerald
        '#06B6D4', // Cyan
        '#3B82F6', // Blue
        '#6366F1', // Indigo
        '#8B5CF6', // Violet
        '#D946EF', // Fuchsia
        '#EC4899', // Pink
    ]

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        formData.set('type', type)
        formData.set('color', selectedColor)
        if (category) formData.set('id', category.id)

        startTransition(async () => {
            const action = category ? updateCategory : createCategory
            const result = await action(formData)

            if (result?.error) {
                toast.error("Operation failed", { description: result.error })
            } else {
                toast.success(category ? "Category updated" : "Category created")
                onClose()
            }
        })
    }

    return (
        // 1. OVERLAY: Solid Dark + Blur (Z-Index Tinggi)
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>

            {/* 2. CARD: Solid bg-surface (Warna Tema) & Border Tegas */}
            <div
                className="w-full max-w-md rounded-2xl border border-border bg-surface text-foreground shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface">
                    <h2 className="font-display text-xl font-bold tracking-tight">
                        {category ? 'Edit Category' : 'New Category'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-elevated text-muted hover:bg-border hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-surface">

                    {/* Type Switcher (Solid & High Contrast) */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setType('expense')}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${type === 'expense'
                                        ? 'bg-red-500 border-red-600 text-white shadow-md'
                                        : 'bg-elevated border-border text-muted hover:bg-border hover:text-foreground'
                                    }`}
                            >
                                <TrendingDown size={16} />
                                <span>Expense</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setType('income')}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${type === 'income'
                                        ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                                        : 'bg-elevated border-border text-muted hover:bg-border hover:text-foreground'
                                    }`}
                            >
                                <TrendingUp size={16} />
                                <span>Income</span>
                            </button>
                        </div>
                    </div>

                    {/* Name Input (Solid Background) */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Name</label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={category?.name}
                            placeholder="e.g. Groceries, Salary, Netflix..."
                            required
                            autoFocus
                            className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                        />
                    </div>

                    {/* Color Picker (Enhanced) */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted">Color</label>
                            <span className="text-[10px] text-muted uppercase font-mono">{selectedColor}</span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {/* Presets */}
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setSelectedColor(c)}
                                    className={`relative h-9 w-9 rounded-full flex items-center justify-center transition-all ${selectedColor === c
                                            ? 'scale-110 ring-2 ring-offset-2 ring-foreground ring-offset-surface shadow-sm'
                                            : 'hover:scale-105 hover:opacity-80'
                                        }`}
                                    style={{ backgroundColor: c }}
                                >
                                    {selectedColor === c && <Check size={14} className="text-white drop-shadow-md" />}
                                </button>
                            ))}

                            {/* Custom Color Button (Rainbow) */}
                            <button
                                type="button"
                                onClick={() => colorInputRef.current?.click()}
                                className={`relative h-9 w-9 rounded-full flex items-center justify-center transition-all bg-gradient-to-br from-red-500 via-green-500 to-blue-500 ${!COLORS.includes(selectedColor)
                                        ? 'scale-110 ring-2 ring-offset-2 ring-foreground ring-offset-surface'
                                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                                    }`}
                                title="Custom Color"
                            >
                                {!COLORS.includes(selectedColor) ? (
                                    <Check size={14} className="text-white drop-shadow-md" />
                                ) : (
                                    <Palette size={14} className="text-white drop-shadow-md" />
                                )}
                            </button>

                            {/* Hidden Native Input */}
                            <input
                                ref={colorInputRef}
                                type="color"
                                className="invisible absolute top-0 left-0"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                    >
                        {isPending ? 'Saving...' : (category ? 'Save Changes' : 'Create Category')}
                    </button>

                </form>
            </div>
        </div>
    )
}