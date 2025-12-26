// components/copy-button.tsx
'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CopyButtonProps {
    text: string
}

export function CopyButton({ text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-tertiary hover:text-muted transition-colors duration-150 ease-out"
        >
            {copied ? (
                <>
                    <Check size={12} className="text-positive" />
                    <span className="text-positive">Copied</span>
                </>
            ) : (
                <>
                    <Copy size={12} />
                    <span>Copy</span>
                </>
            )}
        </button>
    )
}