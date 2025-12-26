'use client'

import { useState } from 'react'
import { Download, FileText, Loader2, ChevronRight } from 'lucide-react'
import { getExportData } from '@/app/actions/export'

interface ExportDataButtonProps {
    transactionCount: number
}

export default function ExportDataButton({ transactionCount }: ExportDataButtonProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExportCSV = async () => {
        setIsExporting(true)
        console.log("Starting export...") // Debugging

        try {
            const { data, error } = await getExportData()

            if (error || !data || data.length === 0) {
                alert("No data found to export or an error occurred.")
                setIsExporting(false)
                return
            }

            // 1. Buat Header CSV
            const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Account']

            // 2. Format Baris Data
            const rows = data.map((tx: any) => [
                tx.date,
                `"${tx.description?.replace(/"/g, '""') || ''}"`, // Escape quotes
                tx.amount,
                tx.categories?.type || 'unknown',
                tx.categories?.name || 'Uncategorized',
                tx.accounts?.name || 'Unknown'
            ])

            // 3. Gabungkan jadi String CSV
            const csvContent = [
                headers.join(','),
                ...rows.map(r => r.join(','))
            ].join('\n')

            // 4. Trigger Download Browser
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `auraflow_export_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            console.log("Export successful")

        } catch (err) {
            console.error("Export Failed:", err)
            alert("Failed to export data.")
        } finally {
            setIsExporting(false)
        }
    }

    const handleExportPDF = () => {
        window.print()
    }

    return (
        <>
            {/* CSV Button */}
            <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="w-full group rounded-xl border border-border bg-surface p-4 hover:border-[#334155] transition-all duration-150 ease-out text-left disabled:opacity-70"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-tertiary group-hover:text-muted border border-border">
                            {isExporting ? <Loader2 size={16} className="animate-spin text-white" /> : <Download size={16} />}
                        </div>
                        <div>
                            <span className="text-sm font-medium text-foreground block">
                                {isExporting ? 'Preparing CSV...' : 'Export to CSV'}
                            </span>
                            <span className="text-xs text-tertiary">
                                {transactionCount > 0 ? `Download ${transactionCount} transactions` : 'Download all data'}
                            </span>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-tertiary group-hover:text-muted" />
                </div>
            </button>

            {/* PDF Button */}
            <button
                onClick={handleExportPDF}
                className="w-full group rounded-xl border border-border bg-surface p-4 hover:border-[#334155] transition-all duration-150 ease-out text-left"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated text-tertiary group-hover:text-muted border border-border">
                            <FileText size={16} />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-foreground block">Export to PDF</span>
                            <span className="text-xs text-tertiary">Save as PDF via Print</span>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-tertiary group-hover:text-muted" />
                </div>
            </button>
        </>
    )
}