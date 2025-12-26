// components/dashboard/quick-stats.tsx
import { Calendar, TrendingUp, Hash, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface QuickStatsProps {
    transactionCount: number
    dailyAverage: number
    topCategory: { name: string; value: number } | null
    daysRemaining: number
}

export default function QuickStats({
    transactionCount,
    dailyAverage,
    topCategory,
    daysRemaining,
}: QuickStatsProps) {
    return (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Transaction Count */}
            <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Hash size={14} className="text-tertiary" />
                    <span className="text-xs text-tertiary">Transactions</span>
                </div>
                {/* TYPOGRAPHY: Monospace for numbers */}
                <p className="font-display text-xl font-bold text-foreground data-text">
                    {transactionCount}
                </p>
            </div>

            {/* Daily Average */}
            <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Calendar size={14} className="text-tertiary" />
                    <span className="text-xs text-tertiary">Avg/Day</span>
                </div>
                <p className="font-display text-xl font-bold text-foreground data-text">
                    {formatCurrency(dailyAverage)}
                </p>
            </div>

            {/* Top Category */}
            <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-tertiary" />
                    <span className="text-xs text-tertiary">Top Category</span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate">
                    {topCategory?.name || '—'}
                </p>
                {topCategory && (
                    <p className="text-xs text-tertiary data-text mt-0.5">
                        {formatCurrency(topCategory.value)}
                    </p>
                )}
            </div>

            {/* Days Remaining */}
            <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-tertiary" />
                    <span className="text-xs text-tertiary">Days Left</span>
                </div>
                <p className="font-display text-xl font-bold text-foreground data-text">
                    {daysRemaining}
                </p>
            </div>
        </div>
    )
}