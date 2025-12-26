'use client'

import { useState } from 'react'
import { Download, FileText, Loader2, Plus } from 'lucide-react'
import { getExportData } from '@/app/actions/export' // Reuse your existing action
import AddTransactionModal from '@/components/transactions/modals/add-transaction-modal'

export default function HeaderActions({ transactionCount }: { transactionCount: number }) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExportCSV = async () => {
        if (transactionCount === 0) return
        setIsExporting(true)
        try {
            const { data } = await getExportData()
            if (!data) return

            // CSV Logic (Reused)
            const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Account']
            const rows = data.map((tx: any) => [
                tx.date, `"${tx.description || ''}"`, tx.amount,
                tx.categories?.type, tx.categories?.name, tx.accounts?.name
            ])
            const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `auraflow_export.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (e) {
            alert("Export failed")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="flex items-center gap-3">
            {/* Compact Export CSV */}
            <button
                onClick={handleExportCSV}
                disabled={isExporting || transactionCount === 0}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-xs font-bold text-muted hover:text-foreground hover:border-foreground transition-all disabled:opacity-50"
                title="Export CSV"
            >
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Compact Export PDF */}
            <button
                onClick={() => window.print()}
                disabled={transactionCount === 0}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-xs font-bold text-muted hover:text-foreground hover:border-foreground transition-all disabled:opacity-50"
                title="Print / Save PDF"
            >
                <FileText size={14} />
                <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Add New Button */}
            <AddTransactionModal buttonLabel="Add New" />
        </div>
    )
}