'use client'

import { useState, useEffect } from 'react'
import { Download, ChevronRight, Sun, Moon, Monitor } from 'lucide-react'
import { getExportData } from '@/app/actions/export'

// --- 1. THEME TOGGLE COMPONENT ---
export function AppearanceSection() {
    const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')

    // Simple theme logic (Tailwind class manipulation)
    useEffect(() => {
        const root = window.document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else if (theme === 'light') {
            root.classList.remove('dark')
        } else {
            // System
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }
    }, [theme])

    return (
        <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Sun size={16} className="text-tertiary" />
                    <span className="text-sm font-medium text-foreground">Appearance</span>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all ${theme === 'dark'
                        ? 'bg-elevated border-[#334155] text-foreground'
                        : 'bg-surface border-border text-tertiary hover:text-muted'
                        }`}
                >
                    <Moon size={14} />
                    <span className="text-xs font-medium">Dark</span>
                </button>
                <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all ${theme === 'light'
                        ? 'bg-background border-border text-[#020617]'
                        : 'bg-surface border-border text-tertiary hover:text-muted'
                        }`}
                >
                    <Sun size={14} />
                    <span className="text-xs font-medium">Light</span>
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
            const { data } = await getExportData()
            if (!data) return

            // Convert to CSV
            const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Account']
            const rows = data.map((tx: any) => [
                tx.date,
                `"${tx.description || ''}"`, // Handle commas in description
                tx.amount,
                tx.categories?.type || 'unknown',
                tx.categories?.name || 'Uncategorized',
                tx.accounts?.name || 'Unknown'
            ])

            const csvContent = [
                headers.join(','),
                ...rows.map(r => r.join(','))
            ].join('\n')

            // Trigger Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `auraflow_export_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (e) {
            alert("Failed to export data")
        } finally {
            setLoading(false)
        }
    }

    const handleExportPDF = () => {
        // Native print is the easiest way to generate a PDF without heavy libraries
        window.print()
    }

    return (
        <div className="space-y-3">
            {/* CSV */}
            <button
                onClick={handleExportCSV}
                disabled={loading}
                className="w-full group rounded-xl border border-border bg-surface p-4 hover:border-[#334155] transition-all text-left disabled:opacity-50"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-tertiary group-hover:text-muted">
                            <Download size={16} className={loading ? "animate-bounce" : ""} />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-foreground block">
                                {loading ? 'Generating CSV...' : 'Export to CSV'}
                            </span>
                            <span className="text-xs text-tertiary">Download all transactions</span>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-tertiary" />
                </div>
            </button>

            {/* PDF */}
            <button
                onClick={handleExportPDF}
                className="w-full group rounded-xl border border-border bg-surface p-4 hover:border-[#334155] transition-all text-left"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-tertiary group-hover:text-muted">
                            <Download size={16} />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-foreground block">Print / Save as PDF</span>
                            <span className="text-xs text-tertiary">Generate report via browser</span>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-tertiary" />
                </div>
            </button>
        </div>
    )
}