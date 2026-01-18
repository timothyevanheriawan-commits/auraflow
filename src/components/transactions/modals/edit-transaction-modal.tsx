'use client'

import { useState, useTransition, useEffect } from 'react'
import { X, TrendingDown, TrendingUp, Calendar, AlignLeft, DollarSign, Save } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { updateTransaction } from '@/app/actions/transaction'
import { toast } from 'sonner'

// 1. Interface yang ketat (bukan any)
interface Category { id: string; name: string; type: 'income' | 'expense' }
interface Account { id: string; name: string }

interface Transaction {
    id: string
    amount: number
    description: string
    date: string
    category_id: string | null // FIX: Allow null
    account_id: string | null  // FIX: Allow null
    categories?: { type: 'income' | 'expense' } | null
}

interface EditTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: Transaction
}

export default function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
    const [isPending, startTransition] = useTransition()
    const [categories, setCategories] = useState<Category[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])

    // Default type dari transaksi yang ada
    const [currentType, setCurrentType] = useState<'income' | 'expense'>(
        transaction.categories?.type || 'expense'
    )

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                const supabase = createClient()
                const [catRes, accRes] = await Promise.all([
                    supabase.from('categories').select('id, name, type').order('name'),
                    supabase.from('accounts').select('id, name').order('name'),
                ])

                // Type Assertion yang aman karena kita tahu struktur DB
                if (catRes.data) setCategories(catRes.data as Category[])
                if (accRes.data) setAccounts(accRes.data as Account[])
            }
            fetchData()
        }
    }, [isOpen])

    if (!isOpen) return null

    const filteredCategories = categories.filter(c => c.type === currentType)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('id', transaction.id)

        startTransition(async () => {
            const result = await updateTransaction(formData)

            // Cek properti error dengan aman
            if (result && typeof result === 'object' && 'error' in result) {
                toast.error("Update failed", { description: result.error as string })
            } else {
                toast.success("Transaction updated successfully")
                onClose()
            }
        })
    }

    return (
        // z-50 sudah cukup tinggi (standar tailwind)
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>

            <div
                className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                    <h2 className="font-display text-lg font-bold text-foreground">Edit Transaction</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        title="Close modal"
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-elevated text-muted hover:bg-border hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-surface">

                    {/* TYPE TOGGLE */}
                    <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Type</span>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setCurrentType('expense')}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${currentType === 'expense'
                                        ? 'bg-red-500 border-red-600 text-white shadow-md'
                                        : 'bg-elevated border-border text-muted hover:bg-border hover:text-foreground'
                                    }`}
                            >
                                <TrendingDown size={16} /> Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentType('income')}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${currentType === 'income'
                                        ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                                        : 'bg-elevated border-border text-muted hover:bg-border hover:text-foreground'
                                    }`}
                            >
                                <TrendingUp size={16} /> Income
                            </button>
                        </div>
                    </div>

                    {/* AMOUNT */}
                    <div>
                        <label htmlFor="edit-amount" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                <DollarSign size={16} />
                            </span>
                            <input
                                id="edit-amount"
                                name="amount"
                                type="number"
                                required
                                defaultValue={transaction.amount}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                            />
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label htmlFor="edit-desc" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Description</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                <AlignLeft size={16} />
                            </span>
                            <input
                                id="edit-desc"
                                name="description"
                                type="text"
                                required
                                defaultValue={transaction.description}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                            />
                        </div>
                    </div>

                    {/* DROPDOWNS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-category" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Category</label>
                            <select
                                id="edit-category"
                                name="categoryId"
                                defaultValue={transaction.category_id ?? undefined}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground appearance-none cursor-pointer"
                            >
                                {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="edit-account" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Account</label>
                            <select
                                id="edit-account"
                                name="accountId"
                                defaultValue={transaction.account_id ?? undefined}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground appearance-none cursor-pointer"
                            >
                                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* DATE */}
                    <div>
                        <label htmlFor="edit-date" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Date</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                                <Calendar size={16} />
                            </span>
                            <input
                                id="edit-date"
                                name="date"
                                type="date"
                                required
                                defaultValue={transaction.date.split('T')[0]}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3.5 text-sm font-bold text-background hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                    >
                        <Save size={16} />
                        {isPending ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    )
}