// components/cards/balance-card.tsx
import { Wallet } from 'lucide-react'

interface BalanceCardProps {
    label: string
    value: number
    formatCurrency: (n: number) => string
}

export function BalanceCard({ label, value, formatCurrency }: BalanceCardProps) {
    return (
        <div className="card h-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-bg-elevated">
                    <Wallet size={16} className="text-text-tertiary" />
                </div>
                <span className="text-sm font-medium text-text-secondary">{label}</span>
            </div>

            <p className="font-display text-4xl font-bold tracking-tight text-text-primary data-text">
                {formatCurrency(value)}
            </p>
        </div>
    )
}