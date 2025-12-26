'use client'

import { useState, useTransition } from 'react'
import { X, Wallet, Landmark, Smartphone, TrendingUp } from 'lucide-react'
import { createAccount } from '@/app/actions/account'
import { toast } from 'sonner' // Import Toast

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
            if (result?.error) {
                toast.error("Failed to add account", { description: result.error })
            } else {
                toast.success("Account created successfully")
                setIsOpen(false)
            }
        })
    }

    const ACCOUNT_TYPES = [
        { id: 'bank', label: 'Bank', desc: 'BCA, Mandiri', icon: Landmark },
        { id: 'wallet', label: 'E-Wallet', desc: 'GoPay, OVO', icon: Smartphone },
        { id: 'cash', label: 'Cash', desc: 'Physical cash', icon: Wallet },
        { id: 'investment', label: 'Invest', desc: 'Stocks, Crypto', icon: TrendingUp },
    ]

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-foreground text-background text-sm font-bold rounded-lg hover:opacity-90 shadow-sm transition-all active:scale-95">
                + Add Account
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                    <div className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                            <h2 className="text-lg font-bold text-foreground">Add Account</h2>
                            <button onClick={() => setIsOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-full bg-elevated text-muted hover:bg-border hover:text-foreground transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-surface">

                            {/* Type Grid */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">Account Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {ACCOUNT_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setSelectedType(type.id)}
                                            className={`flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all ${selectedType === type.id
                                                    ? 'border-foreground bg-background shadow-md ring-1 ring-foreground'
                                                    : 'border-border bg-elevated hover:bg-border hover:border-muted'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg ${selectedType === type.id ? 'bg-foreground text-background' : 'bg-surface text-muted'}`}>
                                                <type.icon size={18} />
                                            </div>
                                            <div className="text-sm font-bold text-foreground">{type.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Name</label>
                                    <input name="name" type="text" placeholder="e.g. Main Wallet" required autoFocus
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Balance</label>
                                    <input name="balance" type="number" placeholder="0" required
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground transition-all" />
                                </div>
                            </div>

                            <button type="submit" disabled={isPending}
                                className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-95">
                                {isPending ? 'Creating...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}