'use client'

import { useState, useTransition } from 'react'
import { X, Wallet, Landmark, Smartphone, TrendingUp, Save } from 'lucide-react'
import { createAccount } from '@/app/actions/account'
import { toast } from 'sonner'

export default function AddAccountModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [selectedType, setSelectedType] = useState('bank')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.set('type', selectedType)

        startTransition(async () => {
            const result = await createAccount(formData)

            // FIX: Pengecekan tipe yang aman untuk TypeScript
            if (result && typeof result === 'object' && 'error' in result) {
                toast.error("Failed to add account", { description: result.error as string })
            } else {
                toast.success("Account created successfully")
                setIsOpen(false)
                // Reset default type
                setSelectedType('bank')
            }
        })
    }

    const ACCOUNT_TYPES = [
        { id: 'bank', label: 'Bank Account', desc: 'BCA, Mandiri', icon: Landmark },
        { id: 'wallet', label: 'E-Wallet', desc: 'GoPay, OVO', icon: Smartphone },
        { id: 'cash', label: 'Cash', desc: 'Physical cash', icon: Wallet },
        { id: 'investment', label: 'Investment', desc: 'Stocks, Crypto', icon: TrendingUp },
    ]

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-foreground text-background text-sm font-bold rounded-lg hover:opacity-90 shadow-sm transition-all active:scale-95"
            >
                + Add Account
            </button>

            {isOpen && (
                // z-50 untuk konsistensi dengan modal lain
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                    <div className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                            <h2 className="font-display text-lg font-bold text-foreground">Add Account</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close modal" // FIX: A11y
                                type="button"
                                className="h-8 w-8 flex items-center justify-center rounded-full bg-elevated text-muted hover:bg-border hover:text-foreground transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-surface">

                            {/* Type Grid */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">Account Type</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {ACCOUNT_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setSelectedType(type.id)}
                                            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${selectedType === type.id
                                                    ? 'border-foreground bg-background shadow-md ring-1 ring-foreground'
                                                    : 'border-border bg-elevated hover:bg-border hover:border-muted'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg ${selectedType === type.id ? 'bg-foreground text-background' : 'bg-surface text-muted'}`}>
                                                <type.icon size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-foreground">{type.label}</div>
                                                <div className="text-xs text-muted">{type.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Main Wallet"
                                        required
                                        autoFocus
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="balance" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Balance</label>
                                    <input
                                        id="balance"
                                        name="balance"
                                        type="number"
                                        placeholder="0"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={isPending}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3.5 text-sm font-bold text-background hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]">
                                <Save size={16} />
                                {isPending ? 'Creating...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}