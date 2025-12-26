// components/cards/metric-card.tsx
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
    label: string
    value: number
    formatCurrency: (n: number) => string
    variant: 'positive' | 'negative' | 'neutral'
}

export function MetricCard({ label, value, formatCurrency, variant }: MetricCardProps) {
    const Icon = variant === 'positive' ? TrendingUp : TrendingDown

    return (
        <div className="card h-full">
            <div className="flex items-center gap-2 mb-4">
                <div className={`flex items-center justify-center w-6 h-6 rounded-sm ${variant === 'positive'
                        ? 'bg-positive-muted/20'
                        : variant === 'negative'
                            ? 'bg-negative-muted/20'
                            : 'bg-bg-elevated'
                    }`}>
                    <Icon
                        size={12}
                        className={
                            variant === 'positive'
                                ? 'text-positive'
                                : variant === 'negative'
                                    ? 'text-negative'
                                    : 'text-text-tertiary'
                        }
                    />
                </div>
                <span className="text-sm font-medium text-text-secondary">{label}</span>
            </div>

            <p className={`font-display text-2xl font-bold tracking-tight data-text ${variant === 'positive'
                    ? 'value-positive'
                    : variant === 'negative'
                        ? 'value-negative'
                        : 'value-neutral'
                }`}>
                {formatCurrency(value)}
            </p>
        </div>
    )
}