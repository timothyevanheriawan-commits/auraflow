'use client'

import { useState, useTransition, useEffect } from 'react'
import { Plus, X, TrendingUp, TrendingDown, Calendar, DollarSign, AlignLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { createTransaction } from '@/app/actions/transaction'
import { toast } from 'sonner'

type TransactionType = 'expense' | 'income'

interface Category { id: string; name: string; type: 'income' | 'expense' }
interface Account { id: string; name: string }
interface AddTransactionModalProps { buttonLabel?: string }

export default function AddTransactionModal({ buttonLabel = "Add New" }: AddTransactionModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [categories, setCategories] = useState<Category[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])
    const [transactionType, setTransactionType] = useState<TransactionType>('expense')

    useEffect(() => {
        const savedType = localStorage.getItem('lastTransactionType') as TransactionType
        if (savedType && (savedType === 'expense' || savedType === 'income')) {
            setTransactionType(savedType)
        }
    }, [])

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                const supabase = createClient()
                const [catRes, accRes] = await Promise.all([
                    supabase.from('categories').select('id, name, type').order('name'),
                    supabase.from('accounts').select('id, name').order('name'),
                ])
                if (catRes.data) setCategories(catRes.data)
                if (accRes.data) setAccounts(accRes.data)
            }
            fetchData()
        }
    }, [isOpen])

    const filteredCategories = categories.filter((c) => c.type === transactionType)

    const handleTypeChange = (type: TransactionType) => {
        setTransactionType(type)
        localStorage.setItem('lastTransactionType', type)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            const result = await createTransaction(formData)

            if (result?.error) {
                // 2. ERROR TOAST
                toast.error("Transaction Failed", {
                })
            } else {
                // 3. SUCCESS TOAST
                toast.success("Transaction Saved", {
                })
                setIsOpen(false)
            }
        })
    }
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all shadow-sm active:scale-95"
            >
                <Plus size={16} />
                <span>{buttonLabel}</span>
            </button>

            {isOpen && (
                // 1. OVERLAY: Solid Dark with Blur (z-100)
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black -sm"
                    onClick={() => setIsOpen(false)}>

                    {/* 2. CARD: bg-surface (Solid) & border-border */}
                    <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface">
                            <h2 className="font-display text-lg font-bold text-foreground tracking-tight">New Transaction</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 flex items-center justify-center rounded-full bg-elevated text-muted hover:bg-border hover:text-foreground transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-surface">

                            {/* TYPE TOGGLE (High Contrast) */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange('expense')}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${transactionType === 'expense'
                                            ? 'bg-red-500 border-red-600 text-white shadow-md'
                                            : 'bg-elevated border-border text-muted hover:bg-border hover:text-foreground'
                                            }`}
                                    >
                                        <TrendingDown size={16} /> Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange('income')}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${transactionType === 'income'
                                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                                            : 'bg-elevated border-border text-muted hover:bg-border hover:text-foreground'
                                            }`}
                                    >
                                        <TrendingUp size={16} /> Income
                                    </button>
                                </div>
                            </div>

                            {/* AMOUNT (Elevated Input) */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                        <DollarSign size={16} />
                                    </span>
                                    <input
                                        type="number"
                                        name="amount"
                                        required
                                        placeholder="0"
                                        autoFocus
                                        className="w-full pl-10 pr-4 py-3 data-text rounded-xl border border-border bg-elevated text-foreground text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-foreground transition-all placeholder:text-muted"
                                    />
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Description</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                        <AlignLeft size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        name="description"
                                        required
                                        placeholder="What was this for?"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground transition-all placeholder:text-muted"
                                    />
                                </div>
                            </div>

                            {/* SELECTS */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Category</label>
                                    <select
                                        name="categoryId"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground appearance-none cursor-pointer hover:bg-border transition-colors"
                                    >
                                        <option value="">Select...</option>
                                        {filteredCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Account</label>
                                    <select
                                        name="accountId"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground appearance-none cursor-pointer hover:bg-border transition-colors"
                                    >
                                        <option value="">Select...</option>
                                        {accounts.map((acc) => (
                                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* DATE */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Date</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                        <Calendar size={16} />
                                    </span>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                            >
                                {isPending ? 'Saving...' : 'Save Transaction'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}