'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wallet, BarChart3, PieChart, Settings, List } from 'lucide-react'
import AddTransactionModal from '@/components/transactions/modals/add-transaction-modal'
import { BrandLogo } from '@/components/ui/logo' // <--- 1. Import Logo

export default function Navbar() {
    const pathname = usePathname()

    // --- FIX START: HIDE ON AUTH PAGES ---
    // Define paths where the navbar should NOT appear
    const disableNavbar = ['/login', '/signup']

    // If current path matches, return null (render nothing)
    if (disableNavbar.includes(pathname)) {
        return null
    }
    // --- FIX END ---

    const links = [
        // ... keep existing links ...
        { href: '/', label: 'Overview', icon: <BarChart3 size={18} /> },
        { href: '/transactions', label: 'Transactions', icon: <List size={18} /> },
        { href: '/accounts', label: 'Accounts', icon: <Wallet size={18} /> },
        { href: '/categories', label: 'Categories', icon: <PieChart size={18} /> },
        { href: '/settings', label: 'Settings', icon: <Settings size={18} /> },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background transition-colors duration-200">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">

                {/* LOGO SECTION */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
                >
                    {/* 2. Replace the old div with BrandLogo */}
                    <BrandLogo className="h-8 w-8 shadow-sm group-hover:scale-105 transition-transform duration-200" />

                    <span className="font-display text-xl font-bold tracking-tight text-foreground">
                        AuraFlow
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${isActive(link.href)
                                    ? 'text-foreground font-semibold'
                                    : 'text-muted hover:text-foreground'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}