import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Wallet, ArrowRight } from 'lucide-react'
import AddTransactionModal from '@/components/transactions/modals/add-transaction-modal'
import SpendingChart from '@/components/dashboard/spending-chart'
import TransactionRowEnhanced, { Transaction } from '@/components/transactions/list/transaction-row-enhanced'
import InsightBanner from '@/components/dashboard/insight-banner'
import PageAnimation from '@/components/ui/page-animation'
import NumberTicker from '@/components/ui/counter'
import { formatCurrency } from '@/lib/utils'


function getFinancialDateRange(targetDate: Date, startDay: number) {
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth()
    const day = targetDate.getDate()

    let startDate: Date
    let endDate: Date

    if (day >= startDay) {
        startDate = new Date(year, month, startDay)
        endDate = new Date(year, month + 1, startDay - 1)
    } else {
        startDate = new Date(year, month - 1, startDay)
        endDate = new Date(year, month, startDay - 1)
    }

    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    return {
        start: startDate,
        end: endDate,
        label: startDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    }
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ month?: string }> }) {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const userCurrency = user.user_metadata?.currency || 'IDR'
    const budgetLimit = user.user_metadata?.budget_limit || 0
    const startDay = user.user_metadata?.start_date || 1

    const params = await searchParams
    const now = new Date()
    let selectedDate = now
    if (params.month) {
        const [y, m] = params.month.split('-').map(Number)
        if (!isNaN(y) && !isNaN(m)) selectedDate = new Date(y, m - 1, (startDay + 1))
    }

    const { start, end, label } = getFinancialDateRange(selectedDate, startDay)
    const prevDate = new Date(start); prevDate.setMonth(prevDate.getMonth() - 1);
    const nextDate = new Date(start); nextDate.setMonth(nextDate.getMonth() + 1);
    const toParam = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    // 2. PRINCIPLE 5: Functional Data Fetching
    const { data: monthlyTransactions } = await supabase
        .from('transactions')
        .select(`*, categories(name, type, color)`)
        .eq('user_id', user.id)
        .gte('date', start.toISOString())
        .lte('date', end.toISOString())

    const { data: accounts } = await supabase.from('accounts').select('balance').eq('user_id', user.id)
    const totalNetWorth = accounts?.reduce((acc, curr) => acc + curr.balance, 0) || 0

    const { data: recentTransactionsRaw } = await supabase
        .from('transactions')
        .select(`
            id, 
            amount, 
            description, 
            date, 
            created_at, 
            category_id, 
            account_id, 
            categories(name, type, color), 
            accounts(name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5)

    const recentTransactions = (recentTransactionsRaw as unknown as Transaction[]) || []

    let totalIncome = 0
    let totalExpense = 0
    const expenseByCategory: Record<string, number> = {}

    monthlyTransactions?.forEach((tx) => {
        if (tx.categories?.type === 'expense') {
            totalExpense += tx.amount
            const catName = tx.categories?.name || 'Uncategorized'
            expenseByCategory[catName] = (expenseByCategory[catName] || 0) + tx.amount
        } else {
            totalIncome += tx.amount
        }
    })

    const netFlow = totalIncome - totalExpense
    const limitBase = budgetLimit > 0 ? budgetLimit : totalIncome
    const progressPercent = limitBase > 0 ? (totalExpense / limitBase) * 100 : 0
    const budgetStatus = budgetLimit > 0
        ? `of ${formatCurrency(budgetLimit, userCurrency)} Budget`
        : `of Income (No budget set)`

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

    const chartData = Object.keys(expenseByCategory)
        .map(key => ({ name: key, value: expenseByCategory[key] }))
        .sort((a, b) => b.value - a.value)

    const today = new Date()
    const daysInPeriod = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    let daysPassed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    if (daysPassed < 1) daysPassed = 1
    if (daysPassed > daysInPeriod) daysPassed = daysInPeriod

    const daysRemaining = Math.max(0, daysInPeriod - daysPassed)
    const dailyAverage = totalExpense / daysPassed
    const projectedExpense = dailyAverage * daysInPeriod

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <PageAnimation className="mx-auto max-w-5xl px-6 py-8">

                <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={`/dashboard?month=${toParam(prevDate)}`} className="rounded-lg border border-border bg-surface p-2 text-muted hover:bg-elevated hover:text-foreground transition-colors">
                            <ChevronLeft size={16} />
                        </Link>
                        {/* Principle 3: Standard Min-W */}
                        <div className="flex flex-col text-center min-w-40">
                            <span className="text-sm font-bold text-foreground">{label}</span>
                            <span className="text-xs text-muted">
                                {start.getDate()} {start.toLocaleString('default', { month: 'short' })} - {end.getDate()} {end.toLocaleString('default', { month: 'short' })}
                            </span>
                        </div>
                        <Link href={`/dashboard?month=${toParam(nextDate)}`} className="rounded-lg border border-border bg-surface p-2 text-muted hover:bg-elevated hover:text-foreground transition-colors">
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                    <AddTransactionModal buttonLabel="Add New" />
                </header>

                <InsightBanner
                    savingsRate={savingsRate}
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                    daysRemaining={daysRemaining}
                    projectedExpense={projectedExpense}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Net Worth */}
                    <div className="relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-40 w-40 rounded-full bg-blue-500/10 blur-[60px]"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-muted mb-2">
                                <Wallet size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Total Net Worth</span>
                            </div>
                            <h2 className="font-mono data-text text-4xl font-bold text-foreground tracking-tight">
                                <NumberTicker value={totalNetWorth} currency={userCurrency} />
                            </h2>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-500">Live</span>
                                <span className="text-xs text-muted">Real-time balance</span>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Flow */}
                    <div className="col-span-1 rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted">Net Flow</span>
                            <div className={`mt-2 font-mono text-2xl data-text font-bold ${netFlow >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {netFlow >= 0 ? '+' : ''}
                                <NumberTicker value={netFlow} currency={userCurrency} />
                            </div>
                            <div className="mt-1 flex justify-between text-xs text-muted">
                                <span>In: <span className="text-emerald-500 font-bold">{formatCurrency(totalIncome, userCurrency)}</span></span>
                                <span>Out: <span className="text-red-500 font-bold">{formatCurrency(totalExpense, userCurrency)}</span></span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-foreground font-medium">Budget Used</span>
                                <span className={progressPercent > 100 ? 'text-red-500 font-bold' : 'text-foreground'}>
                                    {Math.round(progressPercent)}%
                                </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-elevated">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${progressPercent > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                                ></div>
                            </div>
                            <p className="mt-2 text-[10px] text-muted text-right">
                                {budgetStatus}
                            </p>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="col-span-1 md:col-span-2 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="font-display font-bold text-foreground">Recent Activity</h3>
                            <Link href="/transactions" className="flex items-center gap-1 text-xs font-bold text-muted hover:text-foreground transition-colors">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="flex flex-col divide-y divide-border">
                            {recentTransactions && recentTransactions.length > 0 ? (
                                recentTransactions.map((tx) => (
                                    <div key={tx.id} className="-mx-4">
                                        <TransactionRowEnhanced transaction={tx} />
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-xs text-muted">No recent activity</div>
                            )}
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="col-span-1 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                        <h3 className="mb-4 font-display font-bold text-foreground">Where it went</h3>
                        <SpendingChart data={chartData} total={totalExpense} />
                    </div>
                </div>
            </PageAnimation>
        </div>
    )
}