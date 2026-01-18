'use client'

import { useTransition } from 'react'
import { Mail, Lock, Check } from 'lucide-react'
import { updateProfile } from '@/app/actions/profile'
import { toast } from 'sonner'

interface ProfileFormProps {
    displayName: string
    userEmail: string
}

export default function ProfileForm({ displayName, userEmail }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await updateProfile(formData)

            if (result?.error) {
                toast.error("Profile update failed", { description: result.error })
            } else {
                toast.success("Profile updated successfully")
            }
        })
    }

    return (
        <form action={handleSubmit} className="p-6 space-y-6 bg-background">
            {/* Name Input */}
            <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-tertiary mb-2">
                    Display Name
                </label>
                <input
                    name="fullName"
                    type="text"
                    defaultValue={displayName}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-elevated text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                    placeholder="Enter your full name"
                />
            </div>

            {/* Read-Only Email */}
            <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-tertiary mb-2">
                    Email Address
                </label>
                <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-surface/50 cursor-not-allowed opacity-70">
                    <div className="flex items-center gap-3">
                        <Mail size={16} className="text-tertiary" />
                        <span className="text-sm text-tertiary font-medium">{userEmail}</span>
                    </div>
                    <Lock size={14} className="text-tertiary" />
                </div>
                <p className="text-[10px] text-tertiary mt-2">
                    Email changes require verification. Contact support.
                </p>
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-sm font-bold text-background hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    <Check size={16} />
                    <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>
        </form>
    )
}