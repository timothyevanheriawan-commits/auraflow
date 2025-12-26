'use client'

import { useState, useTransition } from 'react'
import { Save, Globe, Calendar, Wallet } from 'lucide-react'
import { updatePreferences } from '@/app/actions/settings' // Pastikan path benar
import { toast } from 'sonner'

interface PreferencesProps {
    user: any
}

export default function PreferencesForm({ user }: PreferencesProps) {
    const [isPending, startTransition] = useTransition()

    // Ambil data dari metadata user (atau default)
    const defaultCurrency = user.user_metadata?.currency || 'IDR'
    const defaultBudget = user.user_metadata?.budget_limit || 0
    const defaultDate = user.user_metadata?.start_date || 1

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            const result = await updatePreferences(formData)
            if (result?.error) {
                toast.error("Failed to update settings")
            } else {
                toast.success("Preferences saved successfully")
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Currency Selection */}
            <div className="rounded-xl border border-border bg-surface p-4">
                

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                            Currency Symbol
                        </label>
                        <select
                            name="currency"
                            defaultValue={defaultCurrency}
                            className="w-full rounded-lg border border-border bg-elevated px-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                        >
                            <option value="IDR">IDR (Rp)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="JPY">JPY (¥)</option>
                        </select>
                    </div>

                    {/* 2. Monthly Budget */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                            Monthly Budget Limit
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                                <Wallet size={14} />
                            </span>
                            <input
                                name="budgetLimit"
                                type="number"
                                defaultValue={defaultBudget}
                                placeholder="e.g. 5000000"
                                className="w-full rounded-lg border border-border bg-elevated pl-10 pr-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                            />
                        </div>
                        <p className="mt-1 text-[10px] text-muted">Used for dashboard progress bar calculation.</p>
                    </div>

                    {/* 3. Start Date */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                            Month Start Date
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                                <Calendar size={14} />
                            </span>
                            <input
                                name="startDate"
                                type="number"
                                min="1" max="28"
                                defaultValue={defaultDate}
                                className="w-full rounded-lg border border-border bg-elevated pl-10 pr-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                            />
                        </div>
                        <p className="mt-1 text-[10px] text-muted">Day of the month when your financial cycle begins (e.g., Payday).</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        <Save size={16} />
                        {isPending ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </form>
    )
}