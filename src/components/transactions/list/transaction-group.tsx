// components/transaction-group.tsx
'use client'

import TransactionRowEnhanced from './transaction-row-enhanced'
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

interface TransactionGroupProps {
    dateLabel: string
    transactions: Transaction[]
    totalIncome: number
    totalExpense: number
}

export default function TransactionGroup({
    dateLabel,
    transactions,
    totalIncome,
    totalExpense,
}: TransactionGroupProps) {
    const showIncome = totalIncome > 0
    const showExpense = totalExpense > 0

    return (
        <div className="rounded-xl border border-border bg-surface">
            {/* Date Header - Compact */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">
                        {dateLabel}
                    </span>
                    <span className="text-xs text-tertiary">
                        {transactions.length}
                    </span>
                </div>

                {/* Daily Summary */}
                <div className="flex items-center gap-4">
                    {showIncome && (
                        <span className="text-xs font-medium text-positive data-text">
                            +{formatCompact(totalIncome)}
                        </span>
                    )}
                    {showExpense && (
                        <span className="text-xs font-medium text-negative data-text">
                            −{formatCompact(totalExpense)}
                        </span>
                    )}
                </div>
            </div>

            {/* Transactions - Compact rows */}
            <div className="divide-y divide-[#1E293B]/30">
                {transactions.map((tx) => (
                    <TransactionRowEnhanced key={tx.id} transaction={tx} />
                ))}
            </div>
        </div>
    )
}

// Compact number formatter
function formatCompact(amount: number): string {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}jt`
    }
    if (amount >= 1000) {
        return `${Math.round(amount / 1000)}rb`
    }
    return amount.toString()
}