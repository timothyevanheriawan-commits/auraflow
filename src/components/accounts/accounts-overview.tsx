// components/accounts-overview.tsx
import { Building2, Smartphone, Wallet, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Account {
    id: string
    name: string
    type: string
    balance: number
}

interface AccountsOverviewProps {
    accounts: Account[]
}

const typeIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    bank: Building2,
    wallet: Smartphone,
    investment: TrendingUp,
    cash: Wallet,
}

export default function AccountsOverview({ accounts }: AccountsOverviewProps) {
    if (accounts.length === 0) {
        return (
            <p className="text-xs text-tertiary">
                No accounts added yet
            </p>
        )
    }

    // Show top 4 accounts by balance
    const topAccounts = accounts.slice(0, 4)

    return (
        <div className="grid grid-cols-2 gap-3">
            {topAccounts.map((account) => {
                const IconComponent = typeIcons[account.type] || Wallet
                const isNegative = account.balance < 0

                return (
                    <div
                        key={account.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-elevated/30"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-elevated">
                            <IconComponent size={14} className="text-tertiary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">
                                {account.name}
                            </p>
                            <p className={`text-xs data-text ${isNegative ? 'text-negative' : 'text-tertiary'
                                }`}>
                                {formatCurrency(account.balance)}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}