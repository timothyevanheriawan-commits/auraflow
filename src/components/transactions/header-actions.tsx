'use client'

import { useState } from 'react'
import { Download, FileText, Loader2 } from 'lucide-react'
import { getExportData } from '@/app/actions/export'
import AddTransactionModal from '@/components/transactions/modals/add-transaction-modal'
import { toast } from 'sonner' // PRINCIPLE 5: Better visual feedback

// --- PRINCIPLE 4: Strict Type Definitions ---

interface RawTransaction {
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

interface HeaderActionsProps {
    transactionCount: number
}

export default function HeaderActions({ transactionCount }: HeaderActionsProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExportCSV = async () => {
        if (transactionCount === 0) return

        setIsExporting(true)

        try {
            const result = await getExportData()

            // FIX: Safely cast the response from Server Action
            const raw = result?.data as unknown as RawTransaction[]

            if (!raw || raw.length === 0) {
                toast.error("No data available to export")
                return
            }

            const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Account']

            // PRINCIPLE 5: Functional Logic Mapping
            const rows = raw.map(tx => [
                tx.date,
                `"${tx.description ?? ''}"`,
                tx.amount,
                tx.categories?.type ?? '',
                tx.categories?.name ?? '',
                tx.accounts?.name ?? '',
            ])

            const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

            // Trigger Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)

            const link = document.body.appendChild(document.createElement('a'))
            link.href = url
            link.download = `auraflow_export_${new Date().toISOString().split('T')[0]}.csv`
            link.click()

            // Cleanup
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            toast.success("CSV Exported successfully")
        } catch {
            toast.error("Export failed", {
                description: "Please check your connection and try again."
            })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="flex items-center gap-3">
            {/* Export CSV - PRINCIPLE 3: Solid Tactile Button */}
            <button
                type="button"
                onClick={handleExportCSV}
                disabled={isExporting || transactionCount === 0}
                title="Export all transactions to CSV"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-xs font-bold text-muted hover:text-foreground hover:border-foreground transition-all disabled:opacity-50 active:scale-95 shadow-sm"
            >
                {isExporting ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <Download size={14} />
                )}
                <span className="hidden sm:inline font-body uppercase tracking-wider">CSV</span>
            </button>

            {/* Export PDF - PRINCIPLE 3: Solid Tactile Button */}
            <button
                type="button"
                onClick={() => window.print()}
                disabled={transactionCount === 0}
                title="Generate PDF report via Print"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-xs font-bold text-muted hover:text-foreground hover:border-foreground transition-all disabled:opacity-50 active:scale-95 shadow-sm"
            >
                <FileText size={14} />
                <span className="hidden sm:inline font-body uppercase tracking-wider">PDF</span>
            </button>

            {/* Add Transaction Modal Trigger */}
            <AddTransactionModal buttonLabel="Add New" />
        </div>
    )
}