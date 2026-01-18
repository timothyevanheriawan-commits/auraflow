'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function AppearanceSwitch() {
    const { theme, setTheme, resolvedTheme } = useTheme()

    // Avoid hydration mismatch WITHOUT local state or useEffect
    if (!resolvedTheme) {
        return (
            <div className="h-26.5 rounded-xl border border-border bg-surface animate-pulse" />
        )
    }

    return (
        <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Sun size={16} className="text-tertiary" />
                    <span className="text-sm font-medium text-foreground">
                        Appearance
                    </span>
                </div>
            </div>

            <div className="flex gap-2">
                {/* Dark */}
                <button
                    type="button"
                    aria-label="Switch to dark mode"
                    title="Dark mode"
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all
                        ${theme === 'dark'
                            ? 'bg-elevated border-[#334155] text-foreground shadow-sm'
                            : 'bg-surface border-border text-tertiary hover:bg-elevated/50 hover:text-muted'
                        }`}
                >
                    <Moon size={14} />
                    <span className="text-xs font-medium">Dark</span>
                </button>

                {/* Light */}
                <button
                    type="button"
                    aria-label="Switch to light mode"
                    title="Light mode"
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all
                        ${theme === 'light'
                            ? 'bg-background border-border text-[#020617] shadow-sm'
                            : 'bg-surface border-border text-tertiary hover:bg-elevated/50 hover:text-muted'
                        }`}
                >
                    <Sun size={14} />
                    <span className="text-xs font-medium">Light</span>
                </button>

                {/* System */}
                <button
                    type="button"
                    aria-label="Use system appearance"
                    title="System appearance"
                    onClick={() => setTheme('system')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all
                        ${theme === 'system'
                            ? 'bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#3B82F6]'
                            : 'bg-surface border-border text-tertiary hover:bg-elevated/50 hover:text-muted'
                        }`}
                >
                    <Monitor size={14} />
                    <span className="text-xs font-medium">Auto</span>
                </button>
            </div>
        </div>
    )
}
