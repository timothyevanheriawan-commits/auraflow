// components/transaction-stats.tsx
import { TrendingUp, Hash, DollarSign, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface TransactionStatsProps {
  transactionCount: number
  avgDailyExpense: number
  avgTransactionAmount: number
  largestExpense: number
  topCategory: { name: string; amount: number } | null
}

export default function TransactionStats({
  transactionCount,
  avgDailyExpense,
  avgTransactionAmount,
  largestExpense,
  topCategory,
}: TransactionStatsProps) {
  // Safe formatting to prevent NaN
  const safeAvgDaily = isNaN(avgDailyExpense) ? 0 : avgDailyExpense
  const safeLargest = isNaN(largestExpense) ? 0 : largestExpense

  if (transactionCount === 0) return null

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Transaction Count */}
      <div className="rounded-lg border border-border bg-elevated/30 p-3">
        <div className="flex items-center gap-2 mb-1">
          <Hash size={12} className="text-tertiary" />
          <span className="text-xs text-tertiary">Count</span>
        </div>
        <p className="text-sm font-semibold text-foreground data-text">
          {transactionCount}
        </p>
      </div>

      {/* Average Daily Expense */}
      <div className="rounded-lg border border-border bg-elevated/30 p-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={12} className="text-tertiary" />
          <span className="text-xs text-tertiary">Avg/Day (Exp)</span>
        </div>
        <p className="text-sm font-semibold text-foreground data-text">
          {formatCurrency(safeAvgDaily)}
        </p>
      </div>

      {/* Largest Expense */}
      <div className="rounded-lg border border-border bg-elevated/30 p-3">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle size={12} className="text-tertiary" />
          <span className="text-xs text-tertiary">Largest Exp</span>
        </div>
        <p className="text-sm font-semibold text-negative data-text">
          {formatCurrency(safeLargest)}
        </p>
      </div>

      {/* Top Category */}
      <div className="rounded-lg border border-border bg-elevated/30 p-3">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign size={12} className="text-tertiary" />
          <span className="text-xs text-tertiary">Top Category</span>
        </div>
        <p className="text-sm font-semibold text-foreground truncate" title={topCategory?.name}>
          {topCategory?.name || '—'}
        </p>
      </div>
    </div>
  )
}