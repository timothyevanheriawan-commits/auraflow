'use client'

import { formatCurrency } from '@/lib/utils'
// FIX: Principle 4 - Import the shared type directly to ensure total synchronization
import TransactionRowEnhanced, { Transaction } from './transaction-row-enhanced'

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
        // Principle 2: Container with border-border and solid background
        <div className="rounded-xl border border-border bg-surface">

            {/* 
                Date Header
                Principle 2: Solid bg-surface ensures no ghosting (text bleeding)
            */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface rounded-t-xl">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-foreground font-display">
                        {dateLabel}
                    </span>
                    <span className="flex h-5 items-center justify-center rounded-full bg-elevated px-2 text-[10px] font-bold text-muted border border-border">
                        {transactions.length}
                    </span>
                </div>

                {/* Daily Summary - Monospace for financial data (Principle 4) */}
                <div className="flex items-center gap-4">
                    {showIncome && (
                        <span className="text-xs font-bold data-text text-emerald-500 font-mono tracking-tight">
                            +{formatCompact(totalIncome)}
                        </span>
                    )}
                    {showExpense && (
                        <span className="text-xs font-bold data-text text-red-500 font-mono tracking-tight">
                            −{formatCompact(totalExpense)}
                        </span>
                    )}
                </div>
            </div>

            {/* Transactions List */}
            <div className="divide-y divide-border bg-surface rounded-b-xl">
                {transactions.map((tx) => (
                    <TransactionRowEnhanced key={tx.id} transaction={tx} />
                ))}
            </div>
        </div>
    )
}

/**
 * Compact number formatter for Indonesian context
 * Principle 4: Specialized for financial readability
 */
function formatCompact(amount: number): string {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}jt`
    }
    if (amount >= 1000) {
        return `${Math.round(amount / 1000)}rb`
    }
    return amount.toString()
}