import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import TransactionFilters from '@/components/transactions/transaction-filters'
import TransactionGroup from '@/components/transactions/list/transaction-group'
import HeaderActions from '@/components/transactions/header-actions' // Pastikan ini sudah dibuat
import { formatCurrency } from '@/lib/utils'

// Helper: Get relative date label
function getRelativeDateLabel(dateString: string): string {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date()

    today.setHours(0, 0, 0, 0)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const dateCheck = new Date(date)
    dateCheck.setHours(0, 0, 0, 0)

    if (dateCheck.getTime() === today.getTime()) return 'Today'
    if (dateCheck.getTime() === yesterday.getTime()) return 'Yesterday'

    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    })
}

interface SearchParams {
    type?: string
    category?: string
    account?: string
    sort?: string
}

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const params = await searchParams

    // Fetch filters data
    const [catRes, accRes] = await Promise.all([
        supabase.from('categories').select('id, name, type').eq('user_id', user.id).order('name'),
        supabase.from('accounts').select('id, name').eq('user_id', user.id).order('name'),
    ])

    // Build query
    let query = supabase
        .from('transactions')
        .select(`
            *,
            categories!inner(*),
            accounts(*)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100)

    // Filters
    if (params.type && params.type !== 'all') query = query.eq('categories.type', params.type)
    if (params.category && params.category !== 'all') query = query.eq('category_id', params.category)
    if (params.account && params.account !== 'all') query = query.eq('account_id', params.account)

    const { data: transactions } = await query

    // Grouping Logic
    const groups: Record<string, any> = {}
    let totalIncome = 0
    let totalExpense = 0

    transactions?.forEach((tx) => {
        const dateKey = tx.date.split('T')[0]
        const isExpense = tx.categories?.type === 'expense'

        if (isExpense) totalExpense += tx.amount
        else totalIncome += tx.amount

        if (!groups[dateKey]) {
            groups[dateKey] = {
                dateLabel: getRelativeDateLabel(tx.date),
                dateRaw: dateKey,
                transactions: [],
                totalIncome: 0,
                totalExpense: 0,
            }
        }
        groups[dateKey].transactions.push(tx)
        if (isExpense) groups[dateKey].totalExpense += tx.amount
        else groups[dateKey].totalIncome += tx.amount
    })

    const sortedGroups = Object.values(groups)
    const netFlow = totalIncome - totalExpense
    const hasFilters = params.type || params.category || params.account

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navbar sudah ada di layout.tsx, jadi kita tidak perlu <nav> di sini lagi */}

            <main className="mx-auto max-w-5xl px-6 py-8">

                {/* --- HEADER SECTION --- */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                            Transaction History
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                            {transactions?.length || 0} transactions total
                        </p>
                    </div>

                    {/* NEW COMPACT ACTIONS (Export & Add) */}
                    <HeaderActions transactionCount={transactions?.length || 0} />
                </div>

                {/* --- SUMMARY CARDS --- */}
                <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-border bg-surface p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Total Income</p>
                        <p className="text-lg data-text font-bold text-emerald-500 tracking-tight">
                            +{formatCurrency(totalIncome)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Total Expenses</p>
                        <p className="text-lg data-text font-bold text-red-500 tracking-tight">
                            -{formatCurrency(totalExpense)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Net Flow</p>
                        <p className={`text-lg data-text font-bold tracking-tight ${netFlow >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow)}
                        </p>
                    </div>
                </div>

                {/* --- FILTER BAR (Solid & Sticky) --- */}
                {/* z-30 agar di bawah Navbar(z-40) dan Modal(z-100) */}
                <div className="sticky top-16 z-30 bg-background border-b border-border py-3 -mx-6 px-6 mb-6">
                    <TransactionFilters
                        categories={catRes.data || []}
                        accounts={accRes.data || []}
                        currentFilters={params}
                    />
                </div>

                {/* --- TRANSACTION LIST --- */}
                <div className="space-y-6">
                    {sortedGroups.length > 0 ? (
                        sortedGroups.map((group, idx) => (
                            <TransactionGroup
                                key={group.dateRaw || idx}
                                dateLabel={group.dateLabel}
                                transactions={group.transactions}
                                totalIncome={group.totalIncome}
                                totalExpense={group.totalExpense}
                            />
                        ))
                    ) : (
                        <EmptyState hasFilters={!!hasFilters} />
                    )}
                </div>
            </main>
        </div>
    )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-border rounded-xl">
            <p className="text-sm font-medium text-muted mb-2">
                {hasFilters ? 'No matching transactions' : 'No transactions yet'}
            </p>
            {hasFilters && (
                <Link href="/transactions" className="text-xs text-muted underline hover:text-foreground">
                    Clear all filters
                </Link>
            )}
        </div>
    )
}