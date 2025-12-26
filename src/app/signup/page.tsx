import Link from 'next/link'
import { signup } from './actions'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams
    const error = params.error

    return (
        // PRINCIPLE 1 & 2: Semantic Theme & Solid Backgrounds
        // bg-background handles Light (White) / Dark (Dark Navy) automatically.
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">

            {/* Container Card */}
            {/* PRINCIPLE 3: High Contrast Components
                - bg-surface: Distinct from page background.
                - border-border: Subtle separation.
                - shadow-2xl: Depth without ghosting.
            */}
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface p-8 shadow-2xl">

                {/* Header */}
                <div className="text-center">
                    {/* PRINCIPLE 4: Purposeful Typography */}
                    <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        Join AuraFlow and master your finances.
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center text-sm font-medium text-red-500">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form action={signup} className="space-y-6">
                    <div className="space-y-4">

                        {/* Email */}
                        <div>
                            {/* PRINCIPLE 4: Clear Hierarchy (Uppercase Label) */}
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                // PRINCIPLE 3: Distinct Inputs
                                // - bg-elevated: Clearly defined input area.
                                // - focus:ring-foreground: High contrast focus state.
                                className="block w-full rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="block w-full rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                className="block w-full rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                    </div>

                    <div className="flex flex-col gap-3">
                        {/* PRINCIPLE 3: Solid Tactile Button
                            - bg-foreground text-background: High contrast inverted style.
                            - hover:opacity-90: Visual feedback.
                        */}
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-xl bg-foreground px-4 py-3 text-sm font-bold text-background transition-transform hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                {/* Footer Link */}
                <div className="text-center text-sm text-muted">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-foreground hover:underline transition-all">
                        Log in here
                    </Link>
                </div>

            </div>
        </div>
    )
}