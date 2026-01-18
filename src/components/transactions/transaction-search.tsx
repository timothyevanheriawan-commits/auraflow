// components/transaction-search.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'

interface TransactionSearchProps {
    currentSearch?: string
}

export default function TransactionSearch({ currentSearch }: TransactionSearchProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(currentSearch || '')
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

    const updateSearch = useCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (term.trim()) {
            params.set('search', term.trim())
        } else {
            params.delete('search')
        }

        router.push(`/transactions?${params.toString()}`)
    }, [router, searchParams])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setValue(newValue)

        // Clear previous timeout
        if (timeoutId) clearTimeout(timeoutId)

        // Debounce search
        const id = setTimeout(() => {
            updateSearch(newValue)
        }, 400)

        setTimeoutId(id)
    }

    const handleClear = () => {
        setValue('')
        updateSearch('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (timeoutId) clearTimeout(timeoutId)
            updateSearch(value)
        }
    }

    return (
        <div className="relative w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary" />
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search by description..."
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-[#334155] bg-surface text-sm text-foreground placeholder:text-tertiary focus:outline-none focus:border-[#64748B] focus:ring-1 focus:ring-[#64748B]/20 transition-all duration-150"
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search"
                    title="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary hover:text-muted transition-colors duration-150"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    )
}