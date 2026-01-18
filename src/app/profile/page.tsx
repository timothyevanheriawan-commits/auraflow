import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, Calendar, Hash } from 'lucide-react'
import { CopyButton } from '@/components/ui/copy-button'
import ProfileForm from '@/components/profile/profile-form' // Import the new client component

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

                {/* STATS GRID */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border bg-surface p-4 flex flex-col justify-between h-24">
                        <div className="flex items-center gap-2 text-tertiary">
                            <Hash size={14} />
                            <span className="text-xs font-medium uppercase tracking-wider">Transactions</span>
                        </div>
                        <p className="font-display text-3xl font-bold text-foreground font-mono">
                            {txCount || 0}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface p-4 flex flex-col justify-between h-24">
                        <div className="flex items-center gap-2 text-tertiary">
                            <Calendar size={14} />
                            <span className="text-xs font-medium uppercase tracking-wider">Accounts</span>
                        </div>
                        <p className="font-display text-3xl font-bold text-foreground font-mono">
                            {accCount || 0}
                        </p>
                    </div>
                </section>

                {/* EDIT FORM SECTION */}
                <section className="rounded-xl border border-border bg-surface overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-surface">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <User size={16} /> Personal Information
                        </h2>
                    </div>

                    {/* Use the new Client Component here */}
                    <ProfileForm displayName={displayName} userEmail={userEmail} />
                </section>

                {/* SYSTEM ID */}
                <section>
                    <div className="rounded-xl border border-border bg-surface p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-tertiary">
                                System ID
                            </span>
                            <span className="text-xs font-mono text-muted mt-1">
                                {user.id}
                            </span>
                        </div>
                        <CopyButton text={user.id} />
                    </div>
                </section>

            </main>
        </div>
    )
}