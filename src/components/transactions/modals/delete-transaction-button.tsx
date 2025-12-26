'use client'

import { Trash2 } from 'lucide-react'
import { deleteTransaction } from '@/app/actions/transaction'
import { useTransition } from 'react'

interface DeleteButtonProps {
    id: string
    variant?: 'icon' | 'menu'
    onComplete?: () => void
}

export default function DeleteTransactionButton({ id, variant = 'icon', onComplete }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            startTransition(async () => {
                const formData = new FormData()
                formData.append('id', id)
                await deleteTransaction(formData)
                if (onComplete) onComplete()
            })
        }
    }

    if (variant === 'menu') {
        return (
            <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-elevated transition-all duration-150 ease-out disabled:opacity-50"
            >
                <Trash2 size={14} />
                {isPending ? 'Deleting...' : 'Delete'}
            </button>
        )
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-tertiary transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete transaction"
        >
            <Trash2 size={16} className={isPending ? "animate-pulse" : ""} />
        </button>
    )
}