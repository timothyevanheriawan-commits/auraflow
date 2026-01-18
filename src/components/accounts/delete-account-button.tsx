'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteAccount } from '@/app/actions/account'

interface DeleteAccountButtonProps {
    id: string
    onComplete?: () => void
}

export default function DeleteAccountButton({ id, onComplete }: DeleteAccountButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm('Are you sure? This will delete the account and all associated transactions.')) return

        startTransition(async () => {
            const formData = new FormData()
            formData.append('id', id)

            await deleteAccount(formData)
            onComplete?.()
        })
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-negative hover:bg-negative/10 transition-colors disabled:opacity-50"
        >
            <Trash2 size={12} />
            {isPending ? 'Deleting...' : 'Delete'}
        </button>
    )
}
