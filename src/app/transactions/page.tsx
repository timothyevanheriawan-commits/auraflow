import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import TransactionFilters from '@/components/transactions/transaction-filters'
import TransactionGroup from '@/components/transactions/list/transaction-group'
import HeaderActions from '@/components/transactions/header-actions'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

// FIX: Principle 4 - Import the shared types directly to prevent "unrelated type" errors
import { Transaction } from '@/components/transactions/list/transaction-row-enhanced'

// Interface for the grouping logic only
interface GroupedData {
    dateLabel: string
    dateRaw: string
    transactions: Transaction[]
    totalIncome: number
    totalExpense: number
}

// --- HELPERS ---

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
    searchParams 
}: { 
    searchParams: Promise<{ range?: string; type?: string; category?: string; account?: string; sort?: string }> 
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const params = await searchParams

    // --- 1. DATE RANGE LOGIC ---
    const now = new Date()
    let startDate: string | null = null
    let endDate: string | null = null

    const range = params.range || 'this-month'

    if (range === 'this-month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
    } else if (range === 'last-month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()
    } else if (range === 'this-year') {
        startDate = new Date(now.getFullYear(), 0, 1).toISOString()
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString()
    }

    const [catRes, accRes] = await Promise.all([
        supabase.from('categories').select('id, name, type').eq('user_id', user.id).order('name'),
        supabase.from('accounts').select('id, name').eq('user_id', user.id).order('name'),
    ])


    // --- 2. BUILD QUERY ---
    let query = supabase
        .from('transactions')
        .select(`
            id, description, amount, date, created_at, category_id, account_id,
            categories!inner(id, name, type, color),
            accounts(name)
        `)
        .eq('user_id', user.id)

    // Apply Date Range
    if (startDate && endDate) {
        query = query.gte('date', startDate).lte('date', endDate)
    }

    // Apply Content Filters
    if (params.type && params.type !== 'all') query = query.eq('categories.type', params.type)
    if (params.category && params.category !== 'all') query = query.eq('category_id', params.category)
    if (params.account && params.account !== 'all') query = query.eq('account_id', params.account)

    // --- 3. SORTING LOGIC ---
    const sort = params.sort || 'newest'
    if (sort === 'oldest') {
        query = query.order('date', { ascending: true }).order('created_at', { ascending: true })
    } else if (sort === 'highest') {
        query = query.order('amount', { ascending: false })
    } else if (sort === 'lowest') {
        query = query.order('amount', { ascending: true })
    } else {
        // Default: newest
        query = query.order('date', { ascending: false }).order('created_at', { ascending: false })
    }

    const { data } = await query.limit(200)
    const transactions = (data as unknown as Transaction[]) || []

    // 3. GROUPING LOGIC (Using shared Transaction type)
    const groups: Record<string, GroupedData> = {}
    let totalIncome = 0
    let totalExpense = 0

    transactions.forEach((tx) => {
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
        // Principle 1: bg-background for seamless Dark/Light support
        <div className="min-h-screen bg-background text-foreground">
            <main className="mx-auto max-w-3xl px-6 py-8">

                {/* --- HEADER SECTION --- */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                            Transaction History
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                            {transactions.length} transactions total
                        </p>
                    </div>

                    {/* Compact Actions (Principle 3) */}
                    <HeaderActions transactionCount={transactions.length} />
                </div>

                {/* --- SUMMARY CARDS (Principle 4: Mono Typography) --- */}
                <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Total Income</p>
                        <p className="text-lg font-mono font-bold text-emerald-500 tracking-tight data-text">
                            +{formatCurrency(totalIncome)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Total Expenses</p>
                        <p className="text-lg font-mono font-bold text-red-500 tracking-tight data-text">
                            -{formatCurrency(totalExpense)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Net Flow</p>
                        <p className={`text-lg font-mono font-bold tracking-tight data-text ${netFlow >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow)}
                        </p>
                    </div>
                </div>

                {/* --- FILTER BAR (Principle 2: Solid Background & z-index) --- */}
                <div className="sticky top-16 z-40 bg-background border-b border-border py-4 -mx-6 px-6 mb-6">
                    <TransactionFilters
                        categories={catRes.data || []}
                        accounts={accRes.data || []}
                    />
                </div>

                {/* --- TRANSACTION LIST (Principle 5: Grouped Logic) --- */}
                <div className="space-y-6">
                    {sortedGroups.length > 0 ? (
                        sortedGroups.map((group) => (
                            <TransactionGroup
                                key={group.dateRaw}
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
        <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-border rounded-xl bg-surface/30">
            <p className="text-sm font-medium text-muted mb-2 font-display">
                {hasFilters ? 'No matching transactions' : 'No transactions yet'}
            </p>
            {hasFilters && (
                <Link href="/transactions" className="text-xs text-muted font-bold underline hover:text-foreground transition-colors">
                    Clear all filters
                </Link>
            )}
        </div>
    )
}