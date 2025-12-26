import { login } from './actions'
import Link from 'next/link'

export default function LoginPage() {
    return (
        // PRINCIPLE 1: Semantic Theme (bg-background handles both modes)
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">

            {/* Main Container / Card */}
            {/* PRINCIPLE 2 & 3: Solid Backgrounds & High Contrast
                - bg-surface: Distinct from page background.
                - shadow-2xl: Depth without ghosting.
                - border-border: Semantic separation.
            */}
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface p-8 shadow-2xl">

                {/* Brand Header */}
                <header className="text-center">
                    {/* PRINCIPLE 4: Purposeful Typography */}
                    <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                        AuraFlow
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        Financial tracking for the modern era
                    </p>
                </header>

                {/* Form */}
                <form className="space-y-6">
                    {/* Email Field */}
                    <div>
                        {/* PRINCIPLE 4: Clear Hierarchy (Uppercase Bold Label) */}
                        <label
                            htmlFor="email"
                            className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="you@example.com"
                            // PRINCIPLE 3: Distinct Inputs
                            // - bg-elevated: Clearly defined input area separate from surface.
                            // - focus:ring-foreground: High contrast active state.
                            className="block w-full rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            placeholder="••••••••"
                            className="block w-full rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-2">
                        {/* Primary: Sign In 
                            PRINCIPLE 3: Solid Tactile Button
                            - bg-foreground / text-background: High contrast inverted style.
                        */}
                        <button
                            formAction={login}
                            className="flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-3 text-sm font-bold text-background transition-transform hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                        >
                            Sign in
                        </button>

                        {/* Secondary: Create Account link
                            - Uses border-border and text-muted for visual hierarchy.
                        */}
                        <Link
                            href="/signup"
                            className="flex w-full justify-center rounded-xl border border-border bg-transparent px-4 py-3 text-sm font-bold text-muted transition-colors hover:bg-elevated hover:text-foreground"
                        >
                            Create an account
                        </Link>
                    </div>
                </form>

                {/* Footer */}
                <footer className="mt-6 text-center">
                    <p className="text-xs text-muted">
                        By continuing, you agree to our terms of service
                    </p>
                </footer>
            </div>
        </div>
    )
}