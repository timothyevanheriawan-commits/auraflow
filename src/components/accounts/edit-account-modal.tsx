'use client'

import { useState, useTransition } from 'react'
import { X, Wallet, Landmark, Smartphone, TrendingUp, Save } from 'lucide-react'
import { updateAccount } from '@/app/actions/account'
import { toast } from 'sonner'

interface EditAccountModalProps {
    isOpen: boolean
    onClose: () => void
    account: any
}

export default function EditAccountModal({ isOpen, onClose, account }: EditAccountModalProps) {
    const [isPending, startTransition] = useTransition()
    // Initialize state with existing account data
    const [selectedType, setSelectedType] = useState(account?.type || 'bank')

    if (!isOpen || !account) return null

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('id', account.id)
        formData.set('type', selectedType)

        startTransition(async () => {
            const result = await updateAccount(formData)
            if (result?.error) {
                toast.error("Update failed", { description: result.error })
            } else {
                toast.success("Account updated successfully")
                onClose()
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
        // 1. OVERLAY: Solid Dark with Blur (z-[100])
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>

            {/* 2. CARD: Solid bg-surface */}
            <div
                className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                    <h2 className="font-display text-lg font-bold text-foreground">Edit Account</h2>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-elevated text-muted hover:bg-border hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-surface">

                    {/* Account Type Grid */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
                            Account Type
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {ACCOUNT_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setSelectedType(type.id)}
                                    // Active State: Border Foreground & Ring
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
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Name</label>
                            <input
                                name="name"
                                type="text"
                                defaultValue={account.name}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground transition-all placeholder:text-muted"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Current Balance</label>
                            <input
                                name="balance"
                                type="number"
                                defaultValue={account.balance}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border bg-elevated text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground transition-all placeholder:text-muted"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3.5 text-sm font-bold text-background hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                    >
                        <Save size={16} />
                        {isPending ? 'Updating...' : 'Save Changes'}
                    </button>

                </form>
            </div>
        </div>
    )
}