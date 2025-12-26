// app/profile/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Calendar, Hash, Lock, Check } from 'lucide-react'
import { updateProfile } from '@/app/actions/profile'
import { CopyButton } from '@/components/ui/copy-button' // Assumed reusable component

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch Stats
    const { count: txCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const { count: accCount } = await supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // Data Formatting
    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    })

    const displayName = user.user_metadata?.full_name || 'User'
    const userEmail = user.email || ''
    const initials = displayName
        ? displayName.substring(0, 2).toUpperCase()
        : userEmail.substring(0, 2).toUpperCase()

    return (
        <div className="min-h-screen bg-background text-foreground">
        
            <main className="mx-auto max-w-2xl px-6 py-10 space-y-8">

                {/* HERO SECTION */}
                <header className="flex items-center gap-6">
                    {/* Avatar - Solid, Bordered */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-surface text-2xl font-bold font-display text-foreground">
                        {initials}
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                            {displayName}
                        </h1>
                        <p className="text-sm text-tertiary mt-1">{userEmail}</p>
                        <div className="flex items-center gap-2 mt-3">
                            
                            <span className="text-xs text-tertiary">Member since {joinDate}</span>
                        </div>
                    </div>
                </header>

                {/* STATS GRID - Neo-Brutalist Cards */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="card p-4 flex flex-col justify-between h-24">
                        <div className="flex items-center gap-2 text-tertiary">
                            <Hash size={14} />
                            <span className="text-xs font-medium uppercase tracking-wider">Transactions</span>
                        </div>
                        <p className="font-display text-3xl font-bold text-foreground data-text">
                            {txCount || 0}
                        </p>
                    </div>

                    <div className="card p-4 flex flex-col justify-between h-24">
                        <div className="flex items-center gap-2 text-tertiary">
                            <Calendar size={14} />
                            <span className="text-xs font-medium uppercase tracking-wider">Accounts</span>
                        </div>
                        <p className="font-display text-3xl font-bold text-foreground data-text">
                            {accCount || 0}
                        </p>
                    </div>
                </section>

                {/* EDIT FORM */}
                <section className="card overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-surface">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <User size={16} /> Personal Information
                        </h2>
                    </div>

                    <form action={updateProfile} className="p-6 space-y-6 bg-background">
                        {/* Name Input */}
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider text-tertiary mb-2">
                                Display Name
                            </label>
                            <input
                                name="fullName"
                                type="text"
                                defaultValue={displayName}
                                className="input-field w-full px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-foreground transition-all"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Read-Only Email */}
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider text-tertiary mb-2">
                                Email Address
                            </label>
                            <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-surface/50 cursor-not-allowed opacity-70">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-tertiary" />
                                    <span className="text-sm text-tertiary font-medium">{userEmail}</span>
                                </div>
                                <Lock size={14} className="text-tertiary" />
                            </div>
                            <p className="text-[10px] text-tertiary mt-2">
                                Email changes require email verification. Contact support.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button className="btn-primary w-full flex items-center justify-center gap-2">
                                <Check size={16} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </section>

                {/* SYSTEM ID */}
                <section>
                    <div className="card p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-tertiary">
                                System ID
                            </span>
                            <span className="text-xs font-mono text-muted mt-1">
                                {user.id}
                            </span>
                        </div>
                        {/* Assuming CopyButton handles the clipboard logic */}
                        <CopyButton text={user.id} />
                    </div>
                </section>

            </main>
        </div>
    )
}