'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, Suspense } from 'react'
import { Filter, ArrowUpDown, X, Calendar } from 'lucide-react'

// --- PRINCIPLE 4: Strict Type Definitions ---

interface FilterOption {
  id: string
  name: string
}

interface TransactionFiltersProps {
  categories: FilterOption[]
  accounts: FilterOption[]
}

interface FilterSelectProps {
  icon?: React.ReactNode
  value: string
  label: string // For accessibility (Axe audit fix)
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export default function TransactionFilters({ categories, accounts }: TransactionFiltersProps) {
  return (
    <Suspense fallback={<div className="h-10 w-full bg-elevated animate-pulse rounded-lg" />}>
      <FilterContent categories={categories} accounts={accounts} />
    </Suspense>
  )
}

function FilterContent({ categories, accounts }: TransactionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentFilters = {
    range: searchParams.get('range') || 'this-month',
    type: searchParams.get('type') || 'all',
    category: searchParams.get('category') || 'all',
    account: searchParams.get('account') || 'all',
    sort: searchParams.get('sort') || 'newest'
  }

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    router.push(`/transactions?${params.toString()}`)
  }, [router, searchParams])

  const clearFilters = () => router.push('/transactions')

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* PRINCIPLE 3 & 5: Functional, High-Contrast Selectors */}
      <FilterSelect
        label="Date Range"
        icon={<Calendar size={14} />}
        value={currentFilters.range}
        onChange={(val: string) => updateFilter('range', val)}
        options={[
          { value: 'this-month', label: 'This Month' },
          { value: 'last-month', label: 'Last Month' },
          { value: 'this-year', label: 'This Year' },
          { value: 'all-time', label: 'All Time' },
        ]}
      />

      <FilterSelect
        label="Transaction Type"
        icon={<Filter size={14} />}
        value={currentFilters.type}
        onChange={(val: string) => updateFilter('type', val)}
        options={[
          { value: 'all', label: 'All Types' },
          { value: 'expense', label: 'Expenses' },
          { value: 'income', label: 'Income' },
        ]}
      />

      <FilterSelect
        label="Category"
        value={currentFilters.category}
        onChange={(val: string) => updateFilter('category', val)}
        options={[
          { value: 'all', label: 'All Categories' },
          ...categories.map((c) => ({ value: c.id, label: c.name }))
        ]}
      />

      <FilterSelect
        label="Account"
        value={currentFilters.account}
        onChange={(val: string) => updateFilter('account', val)}
        options={[
          { value: 'all', label: 'All Accounts' },
          ...accounts.map((a) => ({ value: a.id, label: a.name }))
        ]}
      />

      <FilterSelect
        label="Sort Order"
        icon={<ArrowUpDown size={14} />}
        value={currentFilters.sort}
        onChange={(val: string) => updateFilter('sort', val)}
        options={[
          { value: 'newest', label: 'Newest First' },
          { value: 'oldest', label: 'Oldest First' },
          { value: 'highest', label: 'Highest Amount' },
          { value: 'lowest', label: 'Lowest Amount' },
        ]}
      />

      {searchParams.toString().length > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-muted hover:text-foreground transition-all active:scale-95"
        >
          <X size={14} /> Clear Filters
        </button>
      )}
    </div>
  )
}

function FilterSelect({ icon, value, label, onChange, options }: FilterSelectProps) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none group-focus-within:text-foreground transition-colors">
          {icon}
        </div>
      )}
      <select
        value={value}
        title={label} // FIX: Axe Accessibility Audit
        aria-label={label} // FIX: Accessibility Name
        onChange={(e) => onChange(e.target.value)}
        // PRINCIPLE 1 & 2: Semantic bg-surface (Solid)
        className={`appearance-none rounded-lg border border-border bg-surface py-2.5 pr-10 text-xs font-bold text-foreground shadow-sm focus:border-foreground focus:ring-1 focus:ring-foreground cursor-pointer outline-none transition-all hover:bg-elevated ${icon ? 'pl-9' : 'pl-3'}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}