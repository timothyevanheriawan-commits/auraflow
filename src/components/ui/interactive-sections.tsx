'use client'

import { useState, useEffect } from 'react'
import { Download, ChevronRight, Sun, Moon } from 'lucide-react'
import { getExportData } from '@/app/actions/export'
import { toast } from 'sonner' // Principle 5: Feedback interactivity

// --- PRINCIPLE 4: Strict Type Definitions ---
interface ExportTransaction {
    date: string
    description: string | null
    amount: number
    categories: { name: string; type: string } | null
    accounts: { name: string } | null
}

// --- 1. THEME TOGGLE COMPONENT ---
export function AppearanceSection() {
    const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')

    useEffect(() => {
        const root = window.document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else if (theme === 'light') {
            root.classList.remove('dark')
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }
    }, [theme])

    return (
        // Principle 2: Solid bg-surface
        <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Sun size={16} className="text-tertiary" />
                    <span className="text-sm font-bold text-foreground font-display">Appearance</span>
                </div>
            </div>
            <div className="flex gap-2">
                {/* Principle 3: High-Contrast Active States */}
                <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all active:scale-95 ${theme === 'dark'
                            ? 'bg-foreground border-border text-background shadow-md font-bold'
                            : 'bg-elevated border-border text-muted hover:text-foreground'
                        }`}
                >
                    <Moon size={14} />
                    <span className="text-xs">Dark</span>
                </button>
                <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all active:scale-95 ${theme === 'light'
                            ? 'bg-foreground border-border text-background shadow-md font-bold'
                            : 'bg-elevated border-border text-muted hover:text-foreground'
                        }`}
                >
                    <Sun size={14} />
                    <span className="text-xs">Light</span>
                </button>
            </div>
        </div>
    )
}

// --- 2. EXPORT BUTTONS COMPONENT ---
export function DataManagementSection() {
    const [loading, setLoading] = useState(false)

    const handleExportCSV = async () => {
        setLoading(true)
        try {
            const result = await getExportData()
            // FIX: Principle 4 - Cast the data to the correct interface
            const transactions = (result?.data as unknown as ExportTransaction[]) || []

            if (transactions.length === 0) {
                toast.error("No data found to export")
                setLoading(false)
                return
            }

            const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Account']
            const rows = transactions.map((tx) => [
                tx.date,
                `"${tx.description || ''}"`,
                tx.amount,
                tx.categories?.type || 'unknown',
                tx.categories?.name || 'Uncategorized',
                tx.accounts?.name || 'Unknown'
            ])

            const csvContent = [
                headers.join(','),
                ...rows.map(r => r.join(','))
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `auraflow_export_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success("CSV Downloaded successfully")
        } catch (error) {
            // FIX: Principle 5 - Log error and provide toast feedback instead of alert
            console.error("Export Error:", error)
            toast.error("Failed to export data", { description: "Please check your permissions and try again." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-3">
            {/* CSV */}
            <button
                onClick={handleExportCSV}
                disabled={loading}
                className="w-full group rounded-xl border border-border bg-surface p-4 hover:border-foreground transition-all text-left disabled:opacity-50 active:scale-[0.98]"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-elevated text-foreground border border-border group-hover:scale-105 transition-transform">
                            <Download size={18} className={loading ? "animate-bounce" : ""} />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-foreground block font-display">
                                {loading ? 'Processing...' : 'Export to CSV'}
                            </span>
                            <span className="text-xs text-muted font-medium">Download transaction spreadsheet</span>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-tertiary group-hover:translate-x-1 transition-transform" />
                </div>
            </button>

            {/* PDF */}
            <button
                onClick={() => window.print()}
                className="w-full group rounded-xl border border-border bg-surface p-4 hover:border-foreground transition-all text-left active:scale-[0.98]"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-elevated text-foreground border border-border group-hover:scale-105 transition-transform">
                            <Download size={18} />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-foreground block font-display">Print / Save as PDF</span>
                            <span className="text-xs text-muted font-medium">Generate formatted monthly report</span>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-tertiary group-hover:translate-x-1 transition-transform" />
                </div>
            </button>
        </div>
    )
}