// components/budget-progress.tsx
import { Target, PiggyBank, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface BudgetProgressProps {
    savingsRate: number
    totalIncome: number
    totalExpense: number
    projectedExpense: number
    daysRemaining: number
    isCurrentMonth: boolean
}

export default function BudgetProgress({
    savingsRate,
    totalIncome,
    totalExpense,
    projectedExpense,
    daysRemaining,
    isCurrentMonth,
}: BudgetProgressProps) {
    const savedAmount = totalIncome - totalExpense
    const targetSavingsRate = 20 // 20% target
    const targetSavings = totalIncome * (targetSavingsRate / 100)
    const progressToTarget = targetSavings > 0 ? (savedAmount / targetSavings) * 100 : 0

    // Calculate daily budget remaining
    const remainingBudget = totalIncome - totalExpense
    const dailyBudget = daysRemaining > 0 ? remainingBudget / daysRemaining : 0

    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
                Savings & Budget
            </h3>

            <div className="space-y-6">
                {/* Savings Rate */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <PiggyBank size={14} className="text-tertiary" />
                            <span className="text-xs text-tertiary">Savings Rate</span>
                        </div>
                        <span className={`text-sm font-semibold data-text ${savingsRate >= 20 ? 'text-positive' :
                            savingsRate >= 0 ? 'text-foreground' : 'text-negative'
                            }`}>
                            {savingsRate.toFixed(0)}%
                        </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-elevated overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-200 ${savingsRate >= 20 ? 'bg-[#22C55E]' :
                                savingsRate >= 0 ? 'bg-[#64748B]' : 'bg-[#EF4444]'
                                }`}
                            style={{ width: `${Math.max(0, Math.min(savingsRate, 100))}%` }}
                        />
                    </div>

                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-tertiary">
                            {savedAmount >= 0 ? 'Saved' : 'Overspent'}: {formatCurrency(Math.abs(savedAmount))}
                        </span>
                        <span className="text-xs text-tertiary">
                            Target: 20%
                        </span>
                    </div>
                </div>

                {/* Daily Budget (only for current month) */}
                {isCurrentMonth && daysRemaining > 0 && (
                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Target size={14} className="text-tertiary" />
                                <span className="text-xs text-tertiary">Daily Budget Left</span>
                            </div>
                        </div>

                        <p className={`font-display text-xl font-bold data-text ${dailyBudget >= 0 ? 'text-foreground' : 'text-negative'
                            }`}>
                            {formatCurrency(Math.abs(dailyBudget))}
                            <span className="text-sm font-normal text-tertiary"> /day</span>
                        </p>

                        {dailyBudget < 0 && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-negative">
                                <AlertTriangle size={12} />
                                <span>Budget exceeded</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Projection */}
                {isCurrentMonth && daysRemaining > 0 && (
                    <div className="pt-4 border-t border-border">
                        <p className="text-xs text-tertiary mb-1">Projected month-end expense</p>
                        <p className="text-sm font-semibold text-foreground data-text">
                            {formatCurrency(projectedExpense)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}