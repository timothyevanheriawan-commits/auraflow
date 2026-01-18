'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Shield, Zap, Terminal, Wallet, TrendingUp } from 'lucide-react'
import { BrandLogo } from '@/components/ui/logo'

export default function LandingPageUI() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background overflow-x-hidden">

            {/* 1. NAVBAR (Sticky & Solid) */}
            <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <BrandLogo className="w-8 h-8" />
                        <span className="font-display font-bold text-xl tracking-tight">AuraFlow</span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link href="/login" className="text-sm font-bold text-muted hover:text-foreground transition-colors">
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-foreground text-background text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
                        >
                            Get Access
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                {/* 2. HERO SECTION */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 border-b border-border overflow-hidden">

                    {/* Dynamic Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">

                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/50 text-xs font-bold text-muted mb-8"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                v2.0 Now Available
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
                            >
                                The Operating System for <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-violet-500">
                                    Personal Finance.
                                </span>
                            </motion.h1>

                            {/* Subheadline */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
                            >
                                Stop using spreadsheets. AuraFlow is a high-performance terminal designed for speed, clarity, and total sovereign control over your assets.
                            </motion.p>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            >
                                <Link
                                    href="/signup"
                                    className="h-12 px-8 rounded-xl bg-foreground text-background text-base font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    Start Tracking
                                    <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="/demo"
                                    className="h-12 px-8 rounded-xl border border-border bg-surface text-foreground text-base font-bold flex items-center gap-2 hover:bg-elevated transition-colors"
                                >
                                    View Live Demo
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 3. APP PREVIEW (The "Terminal" Look) */}
                <section className="py-24 bg-surface border-b border-border">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="font-display text-3xl font-bold text-foreground">
                                Precision Interface
                            </h2>
                            <p className="text-muted mt-2">
                                Designed for density and readability. Dark mode native.
                            </p>
                        </div>

                        {/* MOCKUP CONTAINER */}
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative mx-auto max-w-5xl rounded-2xl border border-border bg-background p-2 shadow-2xl"
                        >
                            {/* The "Screen" */}
                            <div className="rounded-xl border border-border bg-background overflow-hidden relative">
                                {/* Fake Navbar */}
                                <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-background">
                                    <div className="flex gap-6 text-xs font-bold text-muted">
                                        <span className="text-foreground">Overview</span>
                                        <span>Transactions</span>
                                        <span>Accounts</span>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-elevated"></div>
                                </div>

                                {/* Fake Content */}
                                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-100">
                                    {/* Card 1: Net Worth */}
                                    <div className="col-span-2 rounded-xl border border-border bg-surface p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-20">
                                            <Wallet className="w-12 h-12 text-blue-500" />
                                        </div>
                                        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Total Net Worth</div>
                                        <div className="text-4xl font-mono font-bold text-foreground">Rp 124.592.000</div>
                                        <div className="mt-4 inline-flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                                            <TrendingUp size={12} /> +12% vs last month
                                        </div>
                                    </div>

                                    {/* Card 2: Burn Rate */}
                                    <div className="rounded-xl border border-border bg-surface p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Monthly Expenses</div>
                                            <div className="text-2xl font-mono font-bold text-foreground">Rp 8.240.000</div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="h-2 w-full bg-elevated rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500 w-[45%]"></div>
                                            </div>
                                            <div className="mt-2 text-[10px] text-muted text-right">45% of budget</div>
                                        </div>
                                    </div>

                                    {/* Card 3: Recent List */}
                                    <div className="col-span-3 rounded-xl border border-border bg-surface p-6">
                                        <div className="text-sm font-bold text-foreground mb-4">Recent Activity</div>
                                        <div className="space-y-0 divide-y divide-border">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center justify-between py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-elevated flex items-center justify-center text-muted">
                                                            <Zap size={16} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-foreground">AWS Server Cost</div>
                                                            <div className="text-xs text-muted">Infrastructure</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-mono font-bold text-red-500">-Rp 450.000</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 4. FEATURES GRID */}
                <section className="py-24 bg-background">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<BarChart3 size={24} />}
                                title="Real-time Analytics"
                                description="Zero-latency insights into your burn rate, savings rate, and net worth progression."
                                delay={0}
                            />
                            <FeatureCard
                                icon={<Terminal size={24} />}
                                title="Command Interface"
                                description="Keyboard-first navigation for rapid transaction entry and category management."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={<Shield size={24} />}
                                title="Sovereign Privacy"
                                description="End-to-end encryption. Your data is yours. Export to CSV/JSON at any time."
                                delay={0.2}
                            />
                        </div>
                    </div>
                </section>

                {/* 5. CTA SECTION */}
                <section className="py-32 border-t border-border bg-surface text-center">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                                Take control of your wealth.
                            </h2>
                            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto font-medium">
                                Join thousands of engineers and designers using AuraFlow to manage their personal economy.
                            </p>
                            <Link
                                href="/signup"
                                className="inline-flex h-14 px-10 items-center justify-center rounded-xl bg-foreground text-background text-lg font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl"
                            >
                                Create Free Account
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* 6. FOOTER */}
                <footer className="py-12 border-t border-border bg-background">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <BrandLogo className="w-6 h-6" />
                            <span className="font-display font-bold text-lg text-foreground">AuraFlow</span>
                            <span className="text-xs text-muted ml-2">© 2025</span>
                        </div>
                        <div className="flex gap-8 text-sm text-muted font-bold">
                            <Link href="#" className="hover:text-foreground transition-colors">Manifesto</Link>
                            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    )
}

// --- SUB COMPONENTS ---

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="group p-8 rounded-2xl border border-border bg-surface hover:border-foreground/20 hover:shadow-lg transition-all duration-300"
        >
            <div className="w-14 h-14 rounded-xl bg-elevated flex items-center justify-center text-foreground mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                {icon}
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {title}
            </h3>
            <p className="text-sm text-muted leading-relaxed font-medium">
                {description}
            </p>
        </motion.div>
    )
}