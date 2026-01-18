// components/date-range-picker.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar } from 'lucide-react'

interface DateRangePickerProps {
    currentRange?: string
}

const DATE_RANGES = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
]

export default function DateRangePicker({ currentRange }: DateRangePickerProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value && value !== 'all') {
            params.set('range', value)
            // Clear custom date params when using preset
            params.delete('from')
            params.delete('to')
        } else {
            params.delete('range')
        }

        router.push(`/transactions?${params.toString()}`)
    }

    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none">
                <Calendar size={12} />
            </div>
            <select
                title='date range'
                value={currentRange || 'all'}
                onChange={(e) => handleChange(e.target.value)}
                className="appearance-none rounded-lg border border-border bg-surface pl-8 pr-8 py-2 text-xs font-medium text-muted focus:outline-none focus:border-[#334155] cursor-pointer transition-colors duration-150"
            >
                {DATE_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                        {range.label}
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