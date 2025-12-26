'use client'

import { useState, useTransition, useEffect } from 'react'
import { X, TrendingDown, TrendingUp, Calendar, AlignLeft, DollarSign } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { updateTransaction } from '@/app/actions/transaction'
import { toast } from 'sonner' // Import Toast

interface EditTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: any
}

export default function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
    const [isPending, startTransition] = useTransition()
    const [categories, setCategories] = useState<any[]>([])
    const [accounts, setAccounts] = useState<any[]>([])

    // Tipe transaksi saat ini (untuk menentukan warna toggle)
    const [currentType, setCurrentType] = useState(transaction.categories?.type || 'expense')

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

    if (!isOpen) return null

    // Filter kategori berdasarkan tipe yang dipilih (agar user tidak salah pilih)
    const filteredCategories = categories.filter(c => c.type === currentType)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('id', transaction.id)

        startTransition(async () => {
            const result = await updateTransaction(formData)
            if (result?.error) {
                toast.error("Update failed", { description: result.error })
            } else {
                toast.success("Transaction updated successfully")
                onClose()
            }
        })
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                    <h2 className="font-display text-lg font-bold text-foreground">Edit Transaction</h2>
                    <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full bg-elevated text-muted hover:bg-border hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-surface">

                    {/* INFO TYPE (Read Only for Context, or Toggle if you allow changing type logic) */}
                    {/* Kita biarkan user mengubah tipe, tapi ini akan mengubah saldo secara kompleks. 
                        Untuk MVP, lebih aman membiarkan user memilih kategori yang sesuai dengan tipe. */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Type</label>
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

                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"><DollarSign size={16} /></span>
                            <input name="amount" type="number" required defaultValue={transaction.amount}
                                className="w-full pl-10 pr-4 py-3 data-text rounded-xl border border-border bg-elevated text-foreground text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-foreground transition-all" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Description</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"><AlignLeft size={16} /></span>
                            <input name="description" type="text" required defaultValue={transaction.description}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground transition-all" />
                        </div>
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Category</label>
                            <select name="categoryId" defaultValue={transaction.category_id}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground appearance-none cursor-pointer">
                                {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Account</label>
                            <select name="accountId" defaultValue={transaction.account_id}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground appearance-none cursor-pointer">
                                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Date</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"><Calendar size={16} /></span>
                            <input name="date" type="date" required defaultValue={transaction.date.split('T')[0]}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer" />
                        </div>
                    </div>

                    <button type="submit" disabled={isPending}
                        className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-95">
                        {isPending ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    )
}