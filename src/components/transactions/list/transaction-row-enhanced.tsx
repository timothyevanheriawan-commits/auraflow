'use client'

import { useState, useTransition } from 'react'
import {
    MoreVertical, Edit2, Copy, Wallet, DollarSign,
    Utensils, Car, Home, ShoppingBag, Briefcase, Heart, Gamepad2, GraduationCap,
    Plane, Coffee, Zap, Smartphone, Gift
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import DeleteTransactionButton from '@/components/transactions/modals/delete-transaction-button'
import { duplicateTransaction } from '@/app/actions/transaction'
import EditTransactionModal from '@/components/transactions/modals/edit-transaction-modal'

// --- PRINCIPLE 4: Shared Strict Types ---
export interface Category {
    id: string
    name: string
    type: 'income' | 'expense'
    color: string | null
}

export interface Account {
    id: string
    name: string
}

export interface Transaction {
    id: string
    description: string
    amount: number
    date: string
    created_at: string
    category_id: string | null
    account_id: string | null
    categories: Category | null
    accounts: Account | null
}

interface TransactionRowEnhancedProps {
    transaction: Transaction
}

// Moved mapping outside to ensure components aren't "created" during render
const categoryIcons: Record<string, React.ElementType> = {
    'Food': Utensils, 'Food & Drink': Coffee, 'Transport': Car, 'Transportation': Car,
    'Housing': Home, 'Rent': Home, 'Shopping': ShoppingBag, 'Work': Briefcase, 'Salary': Briefcase,
    'Income': DollarSign, 'Health': Heart, 'Healthcare': Heart, 'Entertainment': Gamepad2,
    'Education': GraduationCap, 'Travel': Plane, 'Utilities': Zap, 'Phone': Smartphone, 'Gift': Gift
}

export default function TransactionRowEnhanced({ transaction }: TransactionRowEnhancedProps) {
    const [showActions, setShowActions] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const isExpense = transaction.categories?.type === 'expense'
    const isIncome = transaction.categories?.type === 'income'

    // FIX: Access the component class directly from the mapping
    const IconComponent = (transaction.categories?.name && categoryIcons[transaction.categories.name]) || Wallet

    const categoryColor = transaction.categories?.color || '#64748B'

    const handleDuplicate = () => {
        if (confirm("Duplicate this transaction?")) {
            startTransition(async () => {
                await duplicateTransaction(transaction.id)
                setShowActions(false)
            })
        }
    }

    const handleEdit = () => {
        setIsEditOpen(true)
        setShowActions(false)
    }

    return (
        <>
            <div className={`group relative flex items-center gap-4 px-4 py-3 hover:bg-elevated/30 transition-all duration-150 ease-out border-b border-border/50 last:border-0 ${showActions ? 'z-50 bg-elevated' : 'z-0'}`}>
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 border border-border"
                    style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                >
                    {/* PRINCIPLE 5: Render component reference directly */}
                    <IconComponent size={18} />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                        {transaction.description || transaction.categories?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
                        <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryColor }}></span>
                            {transaction.categories?.name}
                        </span>
                        <span>•</span>
                        <span>{transaction.accounts?.name}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                    <p className={`text-sm font-mono data-text font-bold tracking-tight ${isIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isExpense ? '−' : '+'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted mt-0.5 font-normal">
                        {new Date(transaction.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                </div>

                <div className="relative shrink-0">
                    <button
                        title="Actions"
                        onClick={() => setShowActions(!showActions)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-muted opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-elevated transition-all"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {showActions && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
                            <div className="absolute right-0 top-8 z-50 w-44 rounded-xl border border-border bg-surface py-1 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={handleEdit} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-elevated transition-all">
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={handleDuplicate} disabled={isPending} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-elevated transition-all disabled:opacity-50">
                                    {isPending ? 'Copying...' : <><Copy size={14} /> Duplicate</>}
                                </button>
                                <div className="border-t border-border my-1" />
                                <DeleteTransactionButton id={transaction.id} variant="menu" onComplete={() => setShowActions(false)} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {isEditOpen && (
                <EditTransactionModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    transaction={transaction}
                />
            )}
        </>
    )
}