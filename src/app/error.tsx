'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => { console.error(error) }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
            <div className="mb-6 rounded-2xl border border-negative/20 bg-negative/5 p-4 text-negative">
                <AlertTriangle size={48} />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Something went wrong</h2>
            <p className="mt-2 text-muted max-w-xs">We encountered an unexpected error while processing your financial data.</p>
            <button
                onClick={() => reset()}
                className="mt-8 flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 font-bold text-background hover:opacity-90 transition-all active:scale-95"
            >
                <RefreshCcw size={18} />
                Try Again
            </button>
        </div>
    )
}