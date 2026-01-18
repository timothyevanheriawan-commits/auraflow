// components/dashboard/insight-banner.tsx
'use client'

import { Info, Sparkles, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface InsightBannerProps {
    savingsRate: number
    totalIncome: number
    totalExpense: number
    topCategory?: string
    daysRemaining: number
    projectedExpense: number
}

export default function InsightBanner({
    savingsRate,
    totalIncome,
    totalExpense,
    topCategory,
}: InsightBannerProps) {
    const getInsight = (): { message: string; type: 'positive' | 'warning' | 'neutral' } => {
        if (totalIncome === 0 && totalExpense > 0) {
            return {
                message: `You've spent ${formatCurrency(totalExpense)} with no income recorded this month.`,
                type: 'warning'
            }
        }

        if (totalIncome === 0 && totalExpense === 0) {
            return {
                message: 'No transactions recorded this month. Start tracking to see insights.',
                type: 'neutral'
            }
        }

        if (savingsRate < 0) {
            const overspend = totalExpense - totalIncome
            return {
                message: `Spending exceeds income by ${formatCurrency(overspend)}. Consider reducing expenses.`,
                type: 'warning'
            }
        }

        if (savingsRate >= 30) {
            return {
                message: `Excellent! You're saving ${savingsRate.toFixed(0)}% of your income this month.`,
                type: 'positive'
            }
        }

        if (savingsRate >= 20) {
            return {
                message: `Good progress! ${savingsRate.toFixed(0)}% savings rate. ${topCategory ? `${topCategory} is your top expense.` : ''}`,
                type: 'positive'
            }
        }

        if (topCategory) {
            return {
                message: `${topCategory} is your biggest expense category this month.`,
                type: 'neutral'
            }
        }

        return {
            message: 'Track more transactions to unlock detailed insights.',
            type: 'neutral'
        }
    }

    const insight = getInsight()

    // SEMANTIC: Using semantic color classes
    const styles = {
        positive: {
            container: 'border-positive/20 bg-positive-muted',
            icon: <Sparkles size={16} className="text-positive" />,
        },
        warning: {
            container: 'border-negative/20 bg-negative-muted',
            icon: <AlertTriangle size={16} className="text-negative" />,
        },
        neutral: {
            container: 'border-border bg-surface',
            icon: <Info size={16} className="text-tertiary" />,
        },
    }

    const style = styles[insight.type]

    return (
        <div className={`mb-6 rounded-xl border px-4 py-3 ${style.container}`}>
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                    {style.icon}
                </div>
                <p className="text-sm text-muted">
                    {insight.message}
                </p>
            </div>
        </div>
    )
}