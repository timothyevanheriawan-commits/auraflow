// components/monthly-comparison.tsx
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface MonthlyComparisonProps {
    currentMonth: string
    currentIncome: number
    currentExpense: number
    prevIncome: number
    prevExpense: number
    incomeChange: number
    expenseChange: number
}

export default function MonthlyComparison({
    currentMonth,
    currentIncome,
    currentExpense,
    prevIncome,
    prevExpense,
    incomeChange,
    expenseChange,
}: MonthlyComparisonProps) {
    const hasData = prevIncome > 0 || prevExpense > 0

    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
                Month-over-Month
            </h3>

            {hasData ? (
                <div className="space-y-4">
                    {/* Income Comparison */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-tertiary mb-1">Income</p>
                            <p className="text-lg font-semibold text-positive data-text">
                                {formatCurrency(currentIncome)}
                            </p>
                        </div>
                        <ChangeIndicator value={incomeChange} isPositiveGood={true} />
                    </div>

                    {/* Expense Comparison */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-tertiary mb-1">Expenses</p>
                            <p className="text-lg font-semibold text-negative data-text">
                                {formatCurrency(currentExpense)}
                            </p>
                        </div>
                        <ChangeIndicator value={expenseChange} isPositiveGood={false} />
                    </div>

                    {/* Previous Month Reference */}
                    <div className="pt-4 border-t border-border">
                        <p className="text-xs text-tertiary">
                            Last month: {formatCurrency(prevIncome)} in, {formatCurrency(prevExpense)} out
                        </p>
                    </div>
                </div>
            ) : (
                <div className="py-8 text-center">
                    <p className="text-sm text-tertiary">No previous month data</p>
                    <p className="text-xs text-tertiary mt-1">
                        Comparison will appear next month
                    </p>
                </div>
            )}
        </div>
    )
}

function ChangeIndicator({
    value,
    isPositiveGood
}: {
    value: number
    isPositiveGood: boolean
}) {
    if (value === 0) {
        return (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-elevated text-tertiary">
                <Minus size={12} />
                <span className="text-xs font-medium">0%</span>
            </div>
        )
    }

    const isGood = isPositiveGood ? value > 0 : value < 0
    const Icon = value > 0 ? ArrowUpRight : ArrowDownRight

    return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${isGood
            ? 'bg-positive/10 text-positive'
            : 'bg-negative/10 text-negative'
            }`}>
            <Icon size={12} />
            <span>{Math.abs(value).toFixed(0)}%</span>
        </div>
    )
}