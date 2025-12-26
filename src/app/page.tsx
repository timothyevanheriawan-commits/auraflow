// app/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import AddTransactionModal from '@/components/transactions/modals/add-transaction-modal'
import SpendingChart from '@/components/dashboard/spending-chart'
import TransactionRow from '@/components/transactions/list/transaction-row-enhanced'
import InsightBanner from '@/components/dashboard/insight-banner'
import QuickStats from '@/components/dashboard/quick-stats'
import AccountsOverview from '@/components/accounts/accounts-overview'
import BudgetProgress from '@/components/ui/budget-progress'
import MonthlyComparison from '@/components/ui/monthly-comparison'
import PageAnimation from '@/components/ui/page-animation'
import NumberTicker from '@/components/ui/counter'
import { formatCurrency } from '@/lib/utils'

// Helper functions remain the same
function getMonthNav(date: Date) {
  const prevDate = new Date(date.getFullYear(), date.getMonth() - 1, 1)
  const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  const toParam = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

  return {
    prev: toParam(prevDate),
    next: toParam(nextDate),
    currentLabel: date.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    isCurrentMonth: date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()
  }
}

function getPreviousMonthRange(date: Date) {
  const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
  return {
    start: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1).toISOString(),
    end: new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).toISOString()
  }
}

export default async function Dashboard({
  searchParams
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Date logic
  const params = await searchParams
  const now = new Date()

  let selectedDate = now
  if (params.month) {
    const [year, month] = params.month.split('-').map(Number)
    if (!isNaN(year) && !isNaN(month)) {
      selectedDate = new Date(year, month - 1, 1)
    }
  }

  const { prev, next, currentLabel, isCurrentMonth } = getMonthNav(selectedDate)
  const prevMonthRange = getPreviousMonthRange(selectedDate)

  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString()
  const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString()

  // Data fetching
  const { data: monthlyTransactions } = await supabase
    .from('transactions')
    .select(`
    *, 
    categories(name, type, color), 
    accounts(name)
`)
    .eq('user_id', user.id)
    .gte('date', firstDayOfMonth)
    .lte('date', lastDayOfMonth)

  const { data: prevMonthTransactions } = await supabase
    .from('transactions')
    .select(`
    *, 
    categories(name, type, color), 
    accounts(name)
`)
    .eq('user_id', user.id)
    .gte('date', prevMonthRange.start)
    .lte('date', prevMonthRange.end)

  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('balance', { ascending: false })

  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select(`*, categories(*), accounts(*)`)
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculations
  let totalIncome = 0
  let totalExpense = 0
  const expenseByCategory: Record<string, number> = {}
  let transactionCount = 0

  monthlyTransactions?.forEach((tx) => {
    transactionCount++
    if (tx.categories?.type === 'expense') {
      totalExpense += tx.amount
      const catName = tx.categories?.name || 'Uncategorized'
      expenseByCategory[catName] = (expenseByCategory[catName] || 0) + tx.amount
    } else {
      totalIncome += tx.amount
    }
  })

  let prevIncome = 0
  let prevExpense = 0

  prevMonthTransactions?.forEach((tx) => {
    if (tx.categories?.type === 'expense') {
      prevExpense += tx.amount
    } else {
      prevIncome += tx.amount
    }
  })

  const totalNetWorth = accounts?.reduce((acc, curr) => acc + curr.balance, 0) || 0
  const netFlow = totalIncome - totalExpense
  const prevNetFlow = prevIncome - prevExpense
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0
  const burnRate = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : (totalExpense > 0 ? 100 : 0)

  const incomeChange = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0
  const expenseChange = prevExpense > 0 ? ((totalExpense - prevExpense) / prevExpense) * 100 : 0
  const netFlowChange = prevNetFlow !== 0 ? ((netFlow - prevNetFlow) / Math.abs(prevNetFlow)) * 100 : 0

  const chartData = Object.keys(expenseByCategory)
    .map(key => ({ name: key, value: expenseByCategory[key] }))
    .sort((a, b) => b.value - a.value)

  const topCategory = chartData.length > 0 ? chartData[0] : null

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()
  const currentDay = isCurrentMonth ? now.getDate() : daysInMonth
  const daysRemaining = daysInMonth - currentDay

  const dailyAverage = currentDay > 0 ? totalExpense / currentDay : 0
  const projectedMonthlyExpense = dailyAverage * daysInMonth

  return (
    // SEMANTIC: bg-background instead of hardcoded hex
    <div className="min-h-screen bg-background text-foreground pb-24">
      <PageAnimation className="mx-auto max-w-5xl px-6 py-8">

        {/* Header with Month Navigation */}
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {/* Navigation Button - SEMANTIC colors */}
            <Link
              href={`/?month=${prev}`}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-surface text-tertiary hover:bg-elevated hover:text-foreground transition-colors duration-150"
            >
              <ChevronLeft size={16} />
            </Link>

            <div className="flex flex-col text-center min-w-[160px]">
              {/* TYPOGRAPHY: Sans-serif for headings */}
              <span className="text-base font-semibold text-foreground font-display">
                {currentLabel}
              </span>
              <span className="text-xs text-tertiary">
                {isCurrentMonth ? `Day ${currentDay} of ${daysInMonth}` : 'Monthly Overview'}
              </span>
            </div>

            <Link
              href={`/?month=${next}`}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-surface transition-colors duration-150 ${isCurrentMonth
                ? 'text-tertiary opacity-50 cursor-not-allowed pointer-events-none'
                : 'text-tertiary hover:bg-elevated hover:text-foreground'
                }`}
              aria-disabled={isCurrentMonth}
            >
              <ChevronRight size={16} />
            </Link>
          </div>

          <AddTransactionModal buttonLabel="Add Transaction" />
        </header>

        {/* Insight Banner */}
        <InsightBanner
          savingsRate={savingsRate}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          topCategory={topCategory?.name}
          daysRemaining={daysRemaining}
          projectedExpense={projectedMonthlyExpense}
        />

        {/* Quick Stats Row */}
        <QuickStats
          transactionCount={transactionCount}
          dailyAverage={dailyAverage}
          topCategory={topCategory}
          daysRemaining={daysRemaining}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">

          {/* Net Worth Card */}
          <div className="col-span-12 md:col-span-8 card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-elevated">
                  <Wallet size={16} className="text-tertiary" />
                </div>
                {/* TYPOGRAPHY: Uppercase labels */}
                <span className="text-xs font-medium uppercase tracking-wider text-tertiary">
                  Total Net Worth
                </span>
              </div>
              <Link
                href="/accounts"
                className="text-xs text-tertiary hover:text-muted transition-colors duration-150"
              >
                View accounts →
              </Link>
            </div>

            {/* TYPOGRAPHY: Display font + Monospace for numbers */}
            <p className="font-display text-4xl font-bold tracking-tight text-foreground data-text mb-4">
              {formatCurrency(totalNetWorth)}
            </p>

            <AccountsOverview accounts={accounts || []} />
          </div>

          {/* Monthly Flow Card */}
          <div className="col-span-12 md:col-span-4 card p-6 flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wider text-tertiary mb-3">
              Net Flow
            </span>

            <div className="flex items-center gap-2 mb-4">
              {/* SEMANTIC: text-positive/text-negative */}
              <p className={`font-display text-2xl font-bold tracking-tight data-text ${netFlow >= 0 ? 'text-positive' : 'text-negative'
                }`}>
                {netFlow >= 0 ? '+' : '−'}{formatCurrency(Math.abs(netFlow))}
              </p>

              {prevNetFlow !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${netFlowChange >= 0
                  ? 'bg-positive-muted text-positive'
                  : 'bg-negative-muted text-negative'
                  }`}>
                  {netFlowChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(netFlowChange).toFixed(0)}%
                </div>
              )}
            </div>

            {/* Income/Expense Breakdown */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-positive" />
                  <span className="text-xs text-tertiary">Income</span>
                </div>
                {/* TYPOGRAPHY: Monospace for financial data */}
                <span className="text-sm font-semibold text-positive data-text">
                  +{formatCurrency(totalIncome)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-negative" />
                  <span className="text-xs text-tertiary">Expenses</span>
                </div>
                <span className="text-sm font-semibold text-negative data-text">
                  −{formatCurrency(totalExpense)}
                </span>
              </div>
            </div>

            {/* Burn Rate Progress */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-tertiary">Burn Rate</span>
                <span className={`font-medium data-text ${burnRate > 100 ? 'text-negative' : burnRate > 80 ? 'text-warning' : 'text-foreground'
                  }`}>
                  {burnRate.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-elevated overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${burnRate > 100 ? 'bg-negative' : burnRate > 80 ? 'bg-warning' : 'bg-tertiary'
                    }`}
                  style={{ width: `${Math.min(burnRate, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="col-span-12 md:col-span-8 card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
              <Link
                href="/transactions"
                className="flex items-center gap-1 text-xs text-tertiary hover:text-muted transition-colors duration-150"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {/* SOLID divider color */}
            <div className="divide-y divide-border">
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((tx: any) => (
                  <TransactionRow key={tx.id} transaction={tx} />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="col-span-12 md:col-span-4 card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Expense Breakdown</h3>
            <SpendingChart data={chartData} total={totalExpense} />
          </div>

          {/* Month Comparison Card */}
          <div className="col-span-12 md:col-span-6 card p-6">
            <MonthlyComparison
              currentMonth={currentLabel}
              currentIncome={totalIncome}
              currentExpense={totalExpense}
              prevIncome={prevIncome}
              prevExpense={prevExpense}
              incomeChange={incomeChange}
              expenseChange={expenseChange}
            />
          </div>

          {/* Savings Goal / Budget Card */}
          <div className="col-span-12 md:col-span-6 card p-6">
            <BudgetProgress
              savingsRate={savingsRate}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              projectedExpense={projectedMonthlyExpense}
              daysRemaining={daysRemaining}
              isCurrentMonth={isCurrentMonth}
            />
          </div>
        </div>
      </PageAnimation>
    </div>
  )
}

// Empty State Component
function EmptyState() {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-tertiary">No transactions yet</p>
      <p className="text-xs text-tertiary mt-1">
        Add your first transaction to get started
      </p>
    </div>
  )
}