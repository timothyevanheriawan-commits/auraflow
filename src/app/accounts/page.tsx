import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, Wallet } from 'lucide-react'
import AddAccountModal from '@/components/accounts/add-account-modal'
import AccountCard from '@/components/cards/account-card'

// 1. Definisi Interface (Menghilangkan error 'Unexpected any')
interface Account {
    id: string
    name: string
    type: string
    balance: number
    created_at: string
    user_id: string
}

export default async function AccountsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. Fetch Data
    const { data } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

    // Casting tipe data secara eksplisit
    const accounts = (data as Account[]) || []

    // Hitung Total Aset
    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0)

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="mx-auto max-w-5xl px-6 py-8">

                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                            Accounts
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                            Manage your wallets, banks, and investments.
                        </p>
                    </div>
                    {/* Add Button */}
                    <AddAccountModal />
                </div>

                {/* Total Balance Card */}
                <div className="mb-8 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-muted mb-2">
                        <Wallet size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">Total Assets</span>
                    </div>
                    <p className="font-mono data-text text-4xl font-bold text-foreground tracking-tight">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalBalance)}
                    </p>
                </div>

                {/* Account List Grid */}
                {accounts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {accounts.map((account) => (
                            // 'key' wajib unik, passing data account ke komponen Client
                            <AccountCard key={account.id} account={account} />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </main>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-border rounded-xl">
            <div className="w-12 h-12 rounded-xl border border-border bg-elevated flex items-center justify-center mb-4">
                <Plus size={20} className="text-muted" />
            </div>
            <p className="text-sm font-medium text-muted mb-1">
                No accounts yet
            </p>
            {/* 3. FIX: Ganti max-w-[240px] menjadi max-w-60 */}
            <p className="text-xs text-muted text-center max-w-60">
                Add your first bank account or wallet to start tracking.
            </p>
        </div>
    )
}