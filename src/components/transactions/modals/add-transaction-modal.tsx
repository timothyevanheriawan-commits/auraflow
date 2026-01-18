'use client'

import { useState, useTransition, useEffect } from 'react'
import {
    Plus,
    X,
    TrendingUp,
    TrendingDown,
    DollarSign,
    AlignLeft,
    Save,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { createTransaction } from '@/app/actions/transaction'
import { toast } from 'sonner'

type TransactionType = 'expense' | 'income'

interface Category {
    id: string
    name: string
    type: 'income' | 'expense'
}
interface Account {
    id: string
    name: string
}
interface AddTransactionModalProps {
    buttonLabel?: string
}

export default function AddTransactionModal({ buttonLabel = 'Add New' }: AddTransactionModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [categories, setCategories] = useState<Category[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])

    /**
     * ✅ FIX: Lazy initialization from localStorage
     * No effect, no cascading renders, no lint warning
     */
    const [transactionType, setTransactionType] = useState<TransactionType>(() => {
        if (typeof window === 'undefined') return 'expense'
        const saved = localStorage.getItem('lastTransactionType')
        return saved === 'income' || saved === 'expense' ? saved : 'expense'
    })

    useEffect(() => {
        if (!isOpen) return

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
                toast.error('Failed to add transaction', { description: result.error })
            } else {
                toast.success('Transaction saved successfully')
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
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface">
                            <h2 className="text-lg font-bold text-foreground tracking-tight">
                                New Transaction
                            </h2>
                            <button
                                type="button"
                                title="Close modal"
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 flex items-center justify-center rounded-full bg-elevated text-muted hover:bg-border hover:text-foreground transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-surface">
                            {/* TYPE */}
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                                    Type
                                </span>
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

                            {/* AMOUNT */}
                            <div>
                                <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                                    Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                                        <DollarSign size={16} />
                                    </span>
                                    <input
                                        id="amount"
                                        type="number"
                                        name="amount"
                                        required
                                        autoFocus
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-lg font-mono font-bold"
                                    />
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                                    Description
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                                        <AlignLeft size={16} />
                                    </span>
                                    <input
                                        id="description"
                                        type="text"
                                        name="description"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated"
                                    />
                                </div>
                            </div>

                            {/* CATEGORY + ACCOUNT */}
                            <div className="grid grid-cols-2 gap-4">
                                <select title="-" name="categoryId" required className="rounded-xl border border-border bg-elevated px-4 py-3">
                                    <option value="">Category</option>
                                    {filteredCategories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                <select title="-" name="accountId" required className="rounded-xl border border-border bg-elevated px-4 py-3">
                                    <option value="">Account</option>
                                    {accounts.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* DATE */}
                            <input
                                title="-" 
                                type="date"
                                name="date"
                                required
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="w-full rounded-xl border border-border bg-elevated px-4 py-3"
                            />

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-foreground py-3.5 text-background font-bold disabled:opacity-50"
                            >
                                <Save size={16} />
                                {isPending ? 'Saving...' : 'Save Transaction'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
