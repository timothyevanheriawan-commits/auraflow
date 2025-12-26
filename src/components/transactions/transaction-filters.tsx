// components/transaction-filters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Filter, ArrowUpDown, Calendar } from 'lucide-react'

interface Category {
  id: string
  name: string
  type: string
}

interface Account {
  id: string
  name: string
}

interface TransactionFiltersProps {
  categories: Category[]
  accounts: Account[]
  currentFilters?: {
    type?: string
    category?: string
    account?: string
    sort?: string
    range?: string
  }
}

const DATE_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
]

export default function TransactionFilters({
  categories,
  accounts,
  currentFilters = {},
}: TransactionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      router.push(`/transactions?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Date Range */}
      <FilterSelect
        icon={<Calendar size={12} />}
        value={currentFilters.range || 'all'}
        onChange={(value) => updateFilter('range', value)}
        options={DATE_RANGES}
      />

      {/* Type Filter */}
      <FilterSelect
        icon={<Filter size={12} />}
        value={currentFilters.type || 'all'}
        onChange={(value) => updateFilter('type', value)}
        options={[
          { value: 'all', label: 'All Types' },
          { value: 'expense', label: 'Expenses' },
          { value: 'income', label: 'Income' },
        ]}
      />

      {/* Category Filter */}
      <FilterSelect
        value={currentFilters.category || 'all'}
        onChange={(value) => updateFilter('category', value)}
        options={[
          { value: 'all', label: 'All Categories' },
          ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
        ]}
      />

      {/* Account Filter */}
      <FilterSelect
        value={currentFilters.account || 'all'}
        onChange={(value) => updateFilter('account', value)}
        options={[
          { value: 'all', label: 'All Accounts' },
          ...accounts.map((acc) => ({ value: acc.id, label: acc.name })),
        ]}
      />

      {/* Sort */}
      <FilterSelect
        icon={<ArrowUpDown size={12} />}
        value={currentFilters.sort || 'newest'}
        onChange={(value) => updateFilter('sort', value)}
        options={[
          { value: 'newest', label: 'Newest' },
          { value: 'oldest', label: 'Oldest' },
        ]}
      />
    </div>
  )
}

function FilterSelect({
  icon,
  value,
  onChange,
  options,
}: {
  icon?: React.ReactNode
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const isActive = value !== 'all' && value !== 'newest'

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none">
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-lg border py-2 pr-8 text-xs font-medium focus:outline-none cursor-pointer transition-colors duration-150 ${icon ? 'pl-8' : 'pl-3'
          } ${isActive
            ? 'border-[#334155] bg-elevated text-foreground'
            : 'border-border bg-surface text-muted'
          }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-tertiary">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}