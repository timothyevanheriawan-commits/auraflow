// app/accounts/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import AddAccountModal from '@/components/accounts/add-account-modal'
import AccountCard from '@/components/cards/account-card'
import AssetAllocationBar from '@/components/ui/asset-allocation-bar'
import { formatCurrency } from '@/lib/utils'
import EditAccountModal from '@/components/accounts/edit-account-modal'

// Account type configuration
const ACCOUNT_TYPES: Record<string, { label: string; order: number }> = {
    bank: { label: 'Bank Accounts', order: 1 },
    wallet: { label: 'E-Wallets', order: 2 },
    cash: { label: 'Cash', order: 3 },
    investment: { label: 'Investments', order: 4 },
}

export default async function AccountsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) redirect('/login')

    // Fetch accounts
    const { data: accounts } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('balance', { ascending: false })

    // Calculate totals
    const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0
    const accountCount = accounts?.length || 0

    // Separate assets and liabilities
    const totalAssets = accounts?.filter(a => a.balance >= 0).reduce((sum, a) => sum + a.balance, 0) || 0
    const totalLiabilities = accounts?.filter(a => a.balance < 0).reduce((sum, a) => sum + Math.abs(a.balance), 0) || 0

    // Group accounts by type with totals for allocation
    const accountsByType: Record<string, { accounts: any[]; total: number }> = {}

    accounts?.forEach((account) => {
        const type = account.type || 'cash'
        if (!accountsByType[type]) {
            accountsByType[type] = { accounts: [], total: 0 }
        }
        accountsByType[type].accounts.push(account)
        if (account.balance > 0) {
            accountsByType[type].total += account.balance
        }
    })

    // Calculate allocation percentages for chart
    const allocationData = Object.entries(accountsByType)
        .filter(([_, data]) => data.total > 0)
        .map(([type, data]) => ({
            type,
            label: ACCOUNT_TYPES[type]?.label || type,
            amount: data.total,
            percentage: totalAssets > 0 ? (data.total / totalAssets) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount)

    // Sort account types by order
    const sortedTypes = Object.entries(accountsByType)
        .sort(([a], [b]) => (ACCOUNT_TYPES[a]?.order || 99) - (ACCOUNT_TYPES[b]?.order || 99))

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="mx-auto max-w-3xl px-6 py-8">
                {/* Header */}
                <header className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                            Accounts
                        </h1>
                        <p className="mt-1 text-sm text-tertiary">
                            {accountCount} account{accountCount !== 1 ? 's' : ''} tracked
                        </p>
                    </div>

                    {/* CONSISTENT BUTTON STYLE */}
                    <AddAccountModal />
                </header>

                {/* Net Worth Summary Card */}
                <div className="mb-8 rounded-xl border border-border bg-surface p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-tertiary mb-2">
                                Net Worth
                            </p>
                            <p className={`font-display text-3xl font-bold tracking-tight data-text ${totalBalance >= 0 ? 'text-foreground' : 'text-negative'
                                }`}>
                                {formatCurrency(totalBalance)}
                            </p>
                        </div>
                    </div>

                    {/* Asset vs Liability Breakdown - Only show if there are liabilities */}
                    {totalLiabilities > 0 && (
                        <div className="flex items-center gap-6 pb-6 border-b border-border">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-positive/10">
                                    <TrendingUp size={12} className="text-positive" />
                                </div>
                                <div>
                                    <p className="text-xs text-tertiary">Assets</p>
                                    <p className="text-sm font-semibold text-positive data-text">
                                        {formatCurrency(totalAssets)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-negative/10">
                                    <TrendingDown size={12} className="text-negative" />
                                </div>
                                <div>
                                    <p className="text-xs text-tertiary">Liabilities</p>
                                    <p className="text-sm font-semibold text-negative data-text">
                                        {formatCurrency(totalLiabilities)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Asset Allocation Bar - Replaces redundant "Assets" line */}
                    {allocationData.length > 0 && (
                        <div className={totalLiabilities > 0 ? 'pt-6' : ''}>
                            <p className="text-xs font-medium text-tertiary mb-3">
                                Asset Allocation
                            </p>
                            <AssetAllocationBar data={allocationData} />
                        </div>
                    )}
                </div>

                {/* Accounts List */}
                {accountCount > 0 ? (
                    <div className="space-y-6">
                        {sortedTypes.map(([type, data]) => {
                            if (data.accounts.length === 0) return null

                            return (
                                <section key={type}>
                                    {/* Section Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-xs font-medium uppercase tracking-wider text-tertiary">
                                            {ACCOUNT_TYPES[type]?.label || type}
                                        </h2>
                                        <span className="text-xs text-tertiary data-text">
                                            {data.accounts.length} account{data.accounts.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {/* Account Cards */}
                                    <div className="space-y-2">
                                        {data.accounts.map((account: any) => (
                                            <AccountCard key={account.id} account={account} />
                                        ))}
                                    </div>
                                </section>
                            )
                        })}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </main>
        </div>
    )
}

// Empty State Component
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border border-dashed border-border bg-surface/50">
            <div className="w-12 h-12 rounded-xl border border-border bg-elevated/50 flex items-center justify-center mb-4">
                <Plus size={20} className="text-tertiary" />
            </div>
            <p className="text-sm font-medium text-muted mb-1">
                No accounts yet
            </p>
            <p className="text-xs text-tertiary text-center max-w-[240px]">
                Add your bank accounts, e-wallets, and cash to start tracking
            </p>
        </div>
    )
}