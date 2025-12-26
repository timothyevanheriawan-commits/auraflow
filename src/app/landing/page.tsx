'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, Shield, Zap, Terminal, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { BrandLogo } from '@/components/ui/logo' // Import your custom logo
import Navbar from '@/components/navbar' // Optional: Use real navbar or the simplified one below

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background overflow-x-hidden">

            {/* 1. SOLID NAVBAR (Landing Specific) */}
            <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <BrandLogo className="w-8 h-8" />
                        <span className="font-display font-bold text-xl tracking-tight">AuraFlow</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-foreground text-background text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
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
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>

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
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
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

                {/* 3. FEATURE GRID */}
                <section className="py-24 bg-surface">
                    <div className="container mx-auto px-6">
                        <div className="mb-16 md:text-center max-w-2xl mx-auto">
                            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                                Precision Tooling
                            </h2>
                            <p className="text-muted">
                                Built for data-driven decision making. No fluff, just raw financial intelligence delivered in real-time.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<BarChart3 size={24} />}
                                title="Real-time Analytics"
                                description="Zero-latency insights into your burn rate, savings rate, and net worth progression."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={<Terminal size={24} />}
                                title="Command Interface"
                                description="Keyboard-first navigation for rapid transaction entry and category management."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={<Shield size={24} />}
                                title="Sovereign Privacy"
                                description="End-to-end encryption. Your data is yours. Export to CSV/JSON at any time."
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* 4. PREVIEW SECTION (The "Terminal" Look) */}
                <section className="py-24 border-t border-border bg-background relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                            <div>
                                <h2 className="font-display text-3xl font-bold text-foreground">
                                    Interface
                                </h2>
                                <p className="text-muted mt-2">
                                    Designed for density and readability.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Badge text="DARK_MODE: ON" />
                                <Badge text="SYSTEM: STABLE" color="text-emerald-500" />
                            </div>
                        </div>

                        {/* MOCK UI */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="rounded-xl border border-border bg-[#0A0A0A] p-3 shadow-2xl"
                        >
                            <div className="rounded-lg border border-white/10 bg-[#0A0A0A] overflow-hidden">
                                {/* Mock Window Controls */}
                                <div className="h-12 border-b border-white/10 flex items-center px-4 gap-4 bg-[#141414]">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                    </div>
                                    <div className="h-4 w-px bg-white/10 mx-2" />
                                    <div className="text-xs font-mono text-gray-500 flex-1 text-center flex items-center justify-center gap-2">
                                        <Zap size={12} /> dashboard.tsx — read-only
                                    </div>
                                </div>

                                {/* Mock Content */}
                                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Mock Card 1 */}
                                    <div className="border border-white/10 rounded-xl p-6 bg-[#141414]">
                                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Net Worth</div>
                                        <div className="text-3xl font-bold font-mono text-white">Rp 124.592.000</div>
                                        <div className="text-xs text-emerald-500 mt-2 font-mono">+4.2% vs last month</div>
                                    </div>
                                    {/* Mock Card 2 */}
                                    <div className="border border-white/10 rounded-xl p-6 bg-[#141414]">
                                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Burn Rate</div>
                                        <div className="text-3xl font-bold font-mono text-white">Rp 3.240.000</div>
                                        <div className="w-full bg-white/5 h-1.5 mt-4 rounded-full overflow-hidden">
                                            <div className="bg-red-500 w-[45%] h-full rounded-full" />
                                        </div>
                                    </div>
                                    {/* Mock List */}
                                    <div className="border border-white/10 rounded-xl p-6 bg-[#141414] flex flex-col gap-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5" />
                                                    <div className="flex flex-col gap-1">
                                                        <div className="h-2 w-24 bg-white/10 rounded" />
                                                        <div className="h-1.5 w-12 bg-white/5 rounded" />
                                                    </div>
                                                </div>
                                                <div className="h-2 w-16 bg-white/10 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
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
                            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
                                Join thousands of engineers and designers using AuraFlow to manage their personal economy with precision and style.
                            </p>
                            <Link
                                href="/signup"
                                className="inline-flex h-14 px-10 items-center justify-center rounded-xl bg-foreground text-background text-lg font-bold hover:scale-105 transition-transform"
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
                            <span className="font-display font-bold text-lg">AuraFlow</span>
                            <span className="text-xs text-muted ml-2">© 2025</span>
                        </div>
                        <div className="flex gap-8 text-sm text-muted font-medium">
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
            className="group p-8 rounded-2xl border border-border bg-background hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        >
            <div className="w-14 h-14 rounded-xl bg-elevated flex items-center justify-center text-foreground mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                {icon}
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
                {description}
            </p>
        </motion.div>
    )
}

function Badge({ text, color = "text-muted" }: { text: string, color?: string }) {
    return (
        <div className={`px-3 py-1.5 rounded border border-border bg-surface text-[10px] font-mono ${color}`}>
            {text}
        </div>
    )
}