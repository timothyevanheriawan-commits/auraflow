// components/settings-buttons.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Trash2, Download, AlertTriangle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

// Sign Out Button
export function SignOutButton() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSignOut = () => {
        startTransition(async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push('/login')
            router.refresh()
        })
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={isPending}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:bg-elevated/30 disabled:opacity-50 transition-colors duration-150 text-left"
        >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-elevated">
                <LogOut size={16} className="text-tertiary" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Sign Out</p>
                <p className="text-xs text-tertiary mt-0.5">End your current session</p>
            </div>
            {isPending && (
                <span className="text-xs text-tertiary">Signing out...</span>
            )}
        </button>
    )
}

// Reset Data Button with Confirmation Modal
export function ResetDataButton() {
    const [showConfirm, setShowConfirm] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [confirmText, setConfirmText] = useState('')

    const handleReset = () => {
        if (confirmText !== 'DELETE') return

        startTransition(async () => {
            // Add your reset logic here
            console.log('Resetting all data...')
            setShowConfirm(false)
            setConfirmText('')
        })
    }

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/5 hover:bg-negative/10 transition-colors duration-150 text-left"
            >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-negative/10">
                    <Trash2 size={16} className="text-negative" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-negative">Reset All Data</p>
                    <p className="text-xs text-negative/60 mt-0.5">
                        Permanently delete all transactions, accounts, and categories
                    </p>
                </div>
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4  -sm"
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        className="w-full max-w-md rounded-xl border border-[#EF4444]/30 bg-surface overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-negative/10">
                                    <AlertTriangle size={20} className="text-negative" />
                                </div>
                                <h2 className="font-display text-lg font-semibold text-foreground">
                                    Confirm Data Reset
                                </h2>
                            </div>
                            <p className="text-sm text-muted">
                                This action will permanently delete:
                            </p>
                            <ul className="mt-3 space-y-1 text-sm text-tertiary">
                                <li>• All transactions</li>
                                <li>• All accounts and balances</li>
                                <li>• All categories</li>
                            </ul>
                            <p className="mt-4 text-sm text-negative">
                                This action cannot be undone.
                            </p>
                        </div>

                        {/* Confirmation Input */}
                        <div className="p-6">
                            <label className="block text-xs font-medium text-tertiary mb-2">
                                Type <span className="text-negative font-bold">DELETE</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                                placeholder="DELETE"
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-[#334155] focus:outline-none focus:border-[#EF4444]/50 transition-colors duration-150"
                            />

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowConfirm(false)
                                        setConfirmText('')
                                    }}
                                    className="flex-1 py-3 rounded-lg border border-border text-muted text-sm font-medium hover:bg-elevated transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={confirmText !== 'DELETE' || isPending}
                                    className="flex-1 py-3 rounded-lg bg-[#EF4444] text-white text-sm font-semibold hover:bg-[#DC2626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                                >
                                    {isPending ? 'Deleting...' : 'Delete Everything'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// Export Data Button
export function ExportDataButton({ transactionCount }: { transactionCount: number }) {
    const [isPending, startTransition] = useTransition()
    const [exported, setExported] = useState(false)

    const handleExport = () => {
        startTransition(async () => {
            // Add your export logic here
            console.log('Exporting data...')

            // Simulate export
            await new Promise(resolve => setTimeout(resolve, 1000))

            setExported(true)
            setTimeout(() => setExported(false), 3000)
        })
    }

    return (
        <button
            onClick={handleExport}
            disabled={isPending || transactionCount === 0}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:bg-elevated/30 disabled:opacity-50 transition-colors duration-150 text-left"
        >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-elevated">
                <Download size={16} className="text-tertiary" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Export Data</p>
                <p className="text-xs text-tertiary mt-0.5">
                    Download all your data as CSV
                </p>
            </div>
            {isPending && (
                <span className="text-xs text-tertiary">Exporting...</span>
            )}
            {exported && (
                <span className="text-xs text-positive">Downloaded!</span>
            )}
        </button>
    )
}