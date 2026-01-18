'use client'

import { useState } from 'react'
import { Download, FileText, Loader2, ChevronRight } from 'lucide-react'
import { getExportData } from '@/app/actions/export'
import { toast } from 'sonner' // PRINCIPLE 5: Better visual feedback

// --- PRINCIPLE 4: Shared Strict Types ---
interface ExportTransaction {
    date: string
    description: string | null
    amount: number
    categories: {
        type: 'income' | 'expense' | null
        name: string | null
    } | null
    accounts: {
        name: string | null
    } | null
}

interface ExportDataButtonProps {
    transactionCount: number
}

export default function ExportDataButton({ transactionCount }: ExportDataButtonProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExportCSV = async () => {
        setIsExporting(true)

        try {
            // FIX: Principle 4 - Handle the union type response safely without force-casting during destructuring
            const result = await getExportData()

            if ('error' in result || !result.data || result.data.length === 0) {
                toast.error('Export Failed', {
                    description: 'No data found to export or a system error occurred.'
                })
                setIsExporting(false)
                return
            }

            // Safely cast the successful data to our interface
            const data = result.data as unknown as ExportTransaction[]

            const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Account']

            const rows = data.map((tx) => [
                tx.date,
                `"${tx.description?.replace(/"/g, '""') ?? ''}"`,
                tx.amount,
                tx.categories?.type ?? 'unknown',
                tx.categories?.name ?? 'Uncategorized',
                tx.accounts?.name ?? 'Unknown',
            ])

            const csvContent = [
                headers.join(','),
                ...rows.map((r) => r.join(',')),
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `auraflow_export_${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            toast.success('Export Successful', { description: 'CSV file has been downloaded.' })

        } catch (err) {
            console.error('Export failed:', err)
            toast.error('Export failed', { description: 'A browser error prevented the download.' })
        } finally {
            setIsExporting(false)
        }
    }

    const handleExportPDF = () => {
        if (transactionCount === 0) {
            toast.error("Nothing to print", { description: "You don't have any transactions yet." })
            return
        }
        window.print()
    }

    return (
        <div className="space-y-3">
            {/* CSV Button - PRINCIPLE 3: Solid Neo-Brutalist Component */}
            <button
                type="button"
                onClick={handleExportCSV}
                disabled={isExporting}
                className="w-full group rounded-xl border border-border bg-surface p-4 hover:border-foreground transition-all text-left disabled:opacity-70 active:scale-[0.98]"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-elevated border border-border text-foreground group-hover:scale-105 transition-transform">
                            {isExporting
                                ? <Loader2 size={18} className="animate-spin" />
                                : <Download size={18} />
                            }
                        </div>
                        <div>
                            <span className="text-sm font-bold text-foreground block font-display">
                                {isExporting ? 'Generating CSV...' : 'Export to CSV'}
                            </span>
                            <span className="text-xs text-muted font-medium">
                                {transactionCount > 0
                                    ? `Download ${transactionCount} transactions`
                                    : 'No data to export'}
                            </span>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
            </button>

            {/* PDF Button - PRINCIPLE 3: Solid Neo-Brutalist Component */}
            <button
                type="button"
                onClick={handleExportPDF}
                className="w-full group rounded-xl border border-border bg-surface p-4 hover:border-foreground transition-all text-left active:scale-[0.98]"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-elevated border border-border text-foreground group-hover:scale-105 transition-transform">
                            <FileText size={18} />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-foreground block font-display">
                                Export to PDF
                            </span>
                            <span className="text-xs text-muted font-medium">
                                Save as formatted document
                            </span>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
            </button>
        </div>
    )
}