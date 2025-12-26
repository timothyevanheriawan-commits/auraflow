'use client'

import { useState, useTransition } from 'react'
import {
    MoreVertical,
    Edit2,
    Trash2,
    ChevronRight,
    Building2,
    Smartphone,
    Wallet,
    TrendingUp,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { deleteAccount } from '@/app/actions/account'
import EditAccountModal from '@/components/accounts/edit-account-modal' // <--- Import Modal

// Bank brand detection
const BANK_BRANDS: Record<string, { color: string; abbr: string }> = {
    'bca': { color: '#0066AE', abbr: 'BCA' },
    'mandiri': { color: '#003D79', abbr: 'MDR' },
    'bni': { color: '#F15A22', abbr: 'BNI' },
    'bri': { color: '#00529C', abbr: 'BRI' },
    'cimb': { color: '#EC1C24', abbr: 'CMB' },
    'jago': { color: '#E35926', abbr: 'JGO' },
    'seabank': { color: '#FF5C00', abbr: 'SEA' },
}

const WALLET_BRANDS: Record<string, { color: string; abbr: string }> = {
    'gopay': { color: '#00AA13', abbr: 'GPY' },
    'ovo': { color: '#4C3494', abbr: 'OVO' },
    'dana': { color: '#108EE9', abbr: 'DNA' },
    'shopeepay': { color: '#EE4D2D', abbr: 'SPY' },
    'linkaja': { color: '#ED1C24', abbr: 'LNK' },
}

function getBrandInfo(name: string, type: string) {
    const nameLower = name.toLowerCase()

    if (type === 'bank') {
        for (const [key, value] of Object.entries(BANK_BRANDS)) {
            if (nameLower.includes(key)) return value
        }
    }

    if (type === 'wallet') {
        for (const [key, value] of Object.entries(WALLET_BRANDS)) {
            if (nameLower.includes(key)) return value
        }
    }

    return null
}

function getTypeIcon(type: string) {
    switch (type) {
        case 'bank': return Building2
        case 'wallet': return Smartphone
        case 'investment': return TrendingUp
        default: return Wallet
    }
}

interface AccountCardProps {
    account: {
        id: string
        name: string
        type: string
        balance: number
    }
}

export default function AccountCard({ account }: AccountCardProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false) // <--- State for Edit Modal
    const [isDeleting, startDeleteTransition] = useTransition() // <--- Use Transition for Delete

    const brand = getBrandInfo(account.name, account.type)
    const IconComponent = getTypeIcon(account.type)
    const isNegative = account.balance < 0

    const handleDelete = () => {
        if (!confirm(`Delete "${account.name}"? This action cannot be undone.`)) return

        startDeleteTransition(async () => {
            // FIX: Wrap in FormData to match Server Action standard
            const formData = new FormData()
            formData.append('id', account.id)

            await deleteAccount(formData)
            setShowMenu(false)
        })
    }

    return (
        <>
            <div
                className="group relative flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:bg-elevated/50 transition-all duration-200 cursor-pointer"
                onClick={() => setIsEditOpen(true)} // Clicking card opens edit
            >
                {/* Brand Icon / Type Icon */}
                <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0 border border-border"
                    style={{
                        backgroundColor: brand ? `${brand.color}15` : 'var(--bg-elevated)', // Semantic fallback
                    }}
                >
                    {brand ? (
                        <span
                            className="text-xs font-bold tracking-tight"
                            style={{ color: brand.color }}
                        >
                            {brand.abbr}
                        </span>
                    ) : (
                        <IconComponent size={20} className="text-muted" />
                    )}
                </div>

                {/* Account Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                        {account.name}
                    </p>
                    <p className="text-xs text-muted capitalize mt-0.5 font-medium">
                        {account.type === 'wallet' ? 'E-Wallet' : account.type}
                    </p>
                </div>

                {/* Balance */}
                <div className="shrink-0 text-right min-w-[100px]">
                    <p className={`text-sm data-text font-bold tracking-tight ${isNegative ? 'text-red-500' : 'text-emerald-500'
                        }`}>
                        {formatCurrency(account.balance)}
                    </p>
                </div>

                {/* Actions Menu Trigger */}
                <div className="relative shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation() // Prevent card click
                            setShowMenu(!showMenu)
                        }}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-muted opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-elevated transition-all duration-150"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {/* Dropdown Menu (Solid Background) */}
                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowMenu(false)
                                }}
                            />
                            <div className="absolute right-0 top-10 z-50 w-36 rounded-xl border border-border bg-surface py-1 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsEditOpen(true)
                                        setShowMenu(false)
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-muted hover:text-foreground hover:bg-elevated transition-colors"
                                >
                                    <Edit2 size={14} />
                                    Edit
                                </button>
                                <div className="h-px bg-border my-1" />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete()
                                    }}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* --- EDIT MODAL --- */}
            {isEditOpen && (
                <EditAccountModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    account={account}
                />
            )}
        </>
    )
}