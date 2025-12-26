'use client'

import { useState, useTransition, useRef } from 'react'
import { Plus, X, Check, TrendingUp, TrendingDown, Save, Palette } from 'lucide-react'
import { createCategory } from '@/app/actions/category'
import { toast } from 'sonner'

export default function AddCategoryModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    // State Form
    const [type, setType] = useState<'income' | 'expense'>('expense')
    const [selectedColor, setSelectedColor] = useState('#64748B')

    // Ref untuk Custom Color Picker
    const colorInputRef = useRef<HTMLInputElement>(null)

    const COLORS = [
        '#64748B', '#EF4444', '#F97316', '#EAB308', '#22C55E',
        '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
        '#D946EF', '#EC4899'
    ]

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        // Set manual values
        formData.set('type', type)
        formData.set('color', selectedColor)

        startTransition(async () => {
            const result = await createCategory(formData)

            if (result?.error) {
                toast.error("Failed to create category", { description: result.error })
            } else {
                toast.success("Category created successfully")
                setIsOpen(false)
                // Reset form state defaults
                setType('expense')
                setSelectedColor('#64748B')
            }
        })
    }

    return (
        <>
            {/* 1. TRIGGER BUTTON (Solid & Tactile) */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
                <Plus size={16} />
                <span>Add Category</span>
            </button>

            {/* 2. MODAL OVERLAY */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>

                    {/* 3. MODAL CARD (Solid Surface) */}
                    <div
                        className="w-full max-w-md rounded-2xl border border-border bg-surface text-foreground shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface">
                            <h2 className="font-display text-xl font-bold tracking-tight">
                                New Category
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 flex items-center justify-center rounded-full bg-elevated text-muted hover:bg-border hover:text-foreground transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-surface">

                            {/* Type Switcher */}
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

                            {/* Name Input */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="e.g. Groceries, Salary, Netflix..."
                                    required
                                    autoFocus
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                                />
                            </div>

                            {/* Color Picker */}
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

                                    {/* Custom Rainbow Button */}
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
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3.5 text-sm font-bold text-background hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                            >
                                <Save size={16} />
                                {isPending ? 'Creating...' : 'Create Category'}
                            </button>

                        </form>
                    </div>
                </div>
            )}
        </>
    )
}