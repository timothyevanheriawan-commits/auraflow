'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AppearanceSwitch() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Hindari Hydration Mismatch (Wajib di Next.js)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        // Render skeleton/loading state agar layout tidak loncat
        return <div className="h-[106px] rounded-xl border border-border bg-surface animate-pulse"></div>
    }

    return (
        <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Sun size={16} className="text-tertiary" />
                    <span className="text-sm font-medium text-foreground">Appearance</span>
                </div>
            </div>

            <div className="flex gap-2">
                {/* Dark Mode Button */}
                <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all duration-200 ${theme === 'dark'
                        ? 'bg-elevated border-[#334155] text-foreground shadow-sm'
                        : 'bg-surface border-border text-tertiary hover:bg-elevated/50 hover:text-muted'
                        }`}
                >
                    <Moon size={14} />
                    <span className="text-xs font-medium">Dark</span>
                </button>

                {/* Light Mode Button */}
                <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all duration-200 ${theme === 'light'
                        ? 'bg-background border-border text-[#020617] shadow-sm' // Light mode active style
                        : 'bg-surface border-border text-tertiary hover:bg-elevated/50 hover:text-muted'
                        }`}
                >
                    <Sun size={14} />
                    <span className="text-xs font-medium">Light</span>
                </button>

                {/* System/Auto Button */}
                <button
                    onClick={() => setTheme('system')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all duration-200 ${theme === 'system'
                        ? 'bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#3B82F6]' // System active style
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