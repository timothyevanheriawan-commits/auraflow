// app/settings/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    User,
    Shield,
    Lock,
    Info,
    ChevronRight,
    AlertTriangle,
    Trash2,
    LogOut,
    Check,
    Moon,
    Bell,
    Download,
    HelpCircle
} from 'lucide-react'
import { SignOutButton, ResetDataButton } from '@/components/settings/settings-buttons'
import ExportDataButton from '@/components/ui/export-data-button'
import AppearanceSwitch from '@/components/ui/appearance-switch'
import PreferencesForm from '@/components/settings/preferences-form'


export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const displayName = user.user_metadata?.full_name || 'User'
    const userEmail = user.email || ''
    const initials = displayName.substring(0, 2).toUpperCase()

    // Get account stats
    const [{ count: txCount }, { count: accCount }, { count: catCount }] = await Promise.all([
        supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('accounts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('categories').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ])

    const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    })

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="mx-auto max-w-2xl px-6 py-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                        Settings
                    </h1>
                    <p className="mt-1 text-sm text-tertiary">
                        Manage your account and app preferences
                    </p>
                </header>

                <div className="space-y-8">
                    {/* Profile Section */}
                    <section>
                        <h2 className="text-xs font-medium uppercase tracking-wider text-tertiary mb-4">
                            Profile
                        </h2>

                        {/* Profile Card - Clickable */}
                        <Link href="/profile">
                            <div className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:bg-elevated/30 transition-colors duration-150">
                                {/* Avatar */}
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-elevated">
                                    <span className="font-display text-lg font-bold text-muted">
                                        {initials}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground">
                                        {displayName}
                                    </p>
                                    <p className="text-xs text-tertiary truncate">
                                        {userEmail}
                                    </p>
                                </div>

                                {/* Chevron - indicates clickable */}
                                <ChevronRight size={16} className="text-[#334155] group-hover:text-tertiary transition-colors duration-150" />
                            </div>
                        </Link>

                        {/* Account Stats */}
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="p-3 rounded-lg border border-border bg-surface">
                                <p className="text-xs text-tertiary">Transactions</p>
                                <p className="text-lg font-bold text-foreground data-text">{txCount || 0}</p>
                            </div>
                            <div className="p-3 rounded-lg border border-border bg-surface">
                                <p className="text-xs text-tertiary">Accounts</p>
                                <p className="text-lg font-bold text-foreground data-text">{accCount || 0}</p>
                            </div>
                            <div className="p-3 rounded-lg border border-border bg-surface">
                                <p className="text-xs text-tertiary">Member Since</p>
                                <p className="text-sm font-semibold text-foreground">{memberSince}</p>
                            </div>
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section>
                        <h3 className="mb-4 text-xs font-medium text-muted uppercase tracking-wider pl-1">
                            Preferences
                        </h3>
                        <div className="space-y-6">
                            {/* Theme Switcher (yang sudah ada) */}
                            <AppearanceSwitch />

                            {/* Form Baru */}
                            <PreferencesForm user={user} />
                        </div>
                    </section>

                    {/* Security Section */}
                    <section>
                        <h2 className="text-xs font-medium uppercase tracking-wider text-tertiary mb-4">
                            Security & Privacy
                        </h2>

                        <div className="space-y-2">
                            {/* Encryption Status - Read Only */}
                            <SettingsRow
                                icon={<Lock size={16} />}
                                label="Data Encryption"
                                value="Active"
                                valueColor="positive"
                                isReadOnly
                            />

                            {/* Security Protocol - Read Only */}
                            <SettingsRow
                                icon={<Shield size={16} />}
                                label="Security Protocol"
                                value="TLS 1.3"
                                isReadOnly
                            />
                        </div>
                    </section>

                    {/* Data Section */}
                    <section>
                        <h2 className="text-xs font-medium uppercase tracking-wider text-tertiary mb-4">
                            Data Management
                        </h2>

                        <div className="space-y-2">
                            {/* Export Data */}
                            <ExportDataButton transactionCount={txCount || 0} />
                        </div>
                    </section>

                    {/* App Info Section */}
                    <section>
                        <h2 className="text-xs font-medium uppercase tracking-wider text-tertiary mb-4">
                            About
                        </h2>

                        <div className="space-y-2">
                            {/* App Version - Read Only */}
                            <SettingsRow
                                icon={<Info size={16} />}
                                label="Application Version"
                                value="v1.0.0"
                                isReadOnly
                            />

                            {/* Help & Support - Clickable */}
                            <Link href="/help">
                                <SettingsRow
                                    icon={<HelpCircle size={16} />}
                                    label="Help & Support"
                                    hasChevron
                                />
                            </Link>
                        </div>
                    </section>

                    {/* Danger Zone - Enhanced Visual Distinction */}
                    <section>
                        <div className="rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-4">
                            <h2 className="text-xs font-medium uppercase tracking-wider text-negative mb-4 flex items-center gap-2">
                                <AlertTriangle size={14} />
                                Danger Zone
                            </h2>

                            <div className="space-y-2">
                                {/* Reset Data */}
                                <ResetDataButton />

                                {/* Sign Out */}
                                <SignOutButton />
                            </div>

                            <p className="mt-4 text-xs text-negative/60">
                                These actions are irreversible. Please proceed with caution.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

// Settings Row Component
interface SettingsRowProps {
    icon: React.ReactNode
    label: string
    value?: string
    valueColor?: 'default' | 'positive' | 'negative'
    hasChevron?: boolean
    isReadOnly?: boolean
}

function SettingsRow({
    icon,
    label,
    value,
    valueColor = 'default',
    hasChevron = false,
    isReadOnly = false
}: SettingsRowProps) {
    const valueColorClass = {
        default: 'text-muted',
        positive: 'text-positive',
        negative: 'text-negative',
    }[valueColor]

    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl border border-border bg-surface ${!isReadOnly ? 'hover:bg-elevated/30 cursor-pointer' : ''
            } transition-colors duration-150`}>
            {/* Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-elevated">
                <div className="text-tertiary">{icon}</div>
            </div>

            {/* Label */}
            <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{label}</p>
            </div>

            {/* Value or Chevron */}
            {value && (
                <span className={`text-xs font-medium ${valueColorClass}`}>
                    {value}
                </span>
            )}

            {hasChevron && (
                <ChevronRight size={16} className="text-[#334155]" />
            )}
        </div>
    )
}