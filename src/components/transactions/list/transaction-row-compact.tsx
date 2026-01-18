// components/transaction-row-compact.tsx
'use client'

import { useState } from 'react'
import {
    MoreVertical,
    Edit2,
    Copy,
    Trash2,
    Utensils,
    Car,
    ShoppingBag,
    Briefcase,
    Home,
    Smartphone,
    Wallet,
    Heart,
    Gamepad2,
    Coffee,
    Zap,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Transaction {
    id: string
    description: string
    amount: number
    date: string
    created_at: string
    categories: {
        name: string
        type: 'income' | 'expense'
    } | null
    accounts: {
        name: string
    } | null
}

/* ─────────────────────────────────────────────── */
/* Stable icon map (NO component creation in render) */
/* ─────────────────────────────────────────────── */
const CATEGORY_ICON_MAP = {
    food: Utensils,
    food_drink: Coffee,
    transport: Car,
    shopping: ShoppingBag,
    work: Briefcase,
    housing: Home,
    health: Heart,
    entertainment: Gamepad2,
    utilities: Zap,
    phone: Smartphone,
    fallback: Wallet,
} as const

type CategoryIconKey = keyof typeof CATEGORY_ICON_MAP

function getCategoryIconKey(name?: string): CategoryIconKey {
    if (!name) return 'fallback'

    const normalized = name.toLowerCase()

    if (normalized.includes('food')) return 'food'
    if (normalized.includes('transport')) return 'transport'
    if (normalized.includes('shop')) return 'shopping'
    if (normalized.includes('salary') || normalized.includes('work')) return 'work'
    if (normalized.includes('house') || normalized.includes('rent')) return 'housing'
    if (normalized.includes('health')) return 'health'
    if (normalized.includes('entertain')) return 'entertainment'
    if (normalized.includes('util')) return 'utilities'
    if (normalized.includes('phone')) return 'phone'

    return 'fallback'
}

interface TransactionRowCompactProps {
    transaction: Transaction
}

export default function TransactionRowCompact({ transaction }: TransactionRowCompactProps) {
    const [showMenu, setShowMenu] = useState(false)

    const isExpense = transaction.categories?.type === 'expense'
    const iconKey = getCategoryIconKey(transaction.categories?.name)
    const IconComponent = CATEGORY_ICON_MAP[iconKey]

    const time = new Date(transaction.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })

    const cleanDescription =
        transaction.description?.replace(/\s*\(Copy\)\s*$/i, '') || 'Untitled'

    return (
        <div className="group flex items-center gap-3 px-4 py-2.5 hover:bg-elevated/20 transition-colors duration-150">
            {/* Category Icon */}
            <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${isExpense ? 'bg-elevated' : 'bg-positive/10'
                    }`}
            >
                <IconComponent
                    size={14}
                    className={isExpense ? 'text-tertiary' : 'text-positive'}
                />
            </div>

            {/* Description */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                    {cleanDescription}
                </p>
                <p className="text-xs text-tertiary truncate">
                    {transaction.categories?.name || 'Uncategorized'} •{' '}
                    {transaction.accounts?.name || 'Unknown'}
                </p>
            </div>

            {/* Amount & Time */}
            <div className="flex flex-col items-end shrink-0">
                <p
                    className={`text-sm font-semibold data-text ${isExpense ? 'text-negative' : 'text-positive'
                        }`}
                >
                    {isExpense ? '−' : '+'}
                    {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-tertiary">{time}</p>
            </div>

            {/* Actions */}
            <div className="relative shrink-0 w-8">
                <button
                    type="button"
                    title="Transaction actions"
                    aria-label="Transaction actions"
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-tertiary opacity-0 group-hover:opacity-100 hover:text-muted hover:bg-elevated transition-all duration-150"
                >
                    <MoreVertical size={14} />
                </button>

                {showMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute right-0 top-8 z-50 w-32 rounded-lg border border-border bg-surface py-1 shadow-xl">
                            <button
                                onClick={() => setShowMenu(false)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted hover:text-foreground hover:bg-elevated"
                            >
                                <Edit2 size={12} /> Edit
                            </button>
                            <button
                                onClick={() => setShowMenu(false)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted hover:text-foreground hover:bg-elevated"
                            >
                                <Copy size={12} /> Duplicate
                            </button>
                            <div className="border-t border-border my-1" />
                            <button
                                onClick={() => setShowMenu(false)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-negative hover:bg-negative/10"
                            >
                                <Trash2 size={12} /> Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
