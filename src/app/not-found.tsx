import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface border border-border shadow-xl mb-6">
                <FileQuestion size={40} className="text-muted" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight">404</h1>
            <p className="mt-2 text-muted">Page not found in AuraFlow</p>

            <Link
                href="/"
                className="mt-8 px-6 py-3 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity"
            >
                Return Home
            </Link>
        </div>
    )
}