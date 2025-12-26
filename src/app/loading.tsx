export default function Loading() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mx-auto max-w-5xl space-y-8 animate-pulse">

                {/* Header Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 rounded-lg bg-elevated"></div>
                    <div className="h-10 w-32 rounded-lg bg-elevated"></div>
                </div>

                {/* Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-40 rounded-2xl bg-surface border border-border"></div>
                    <div className="h-40 rounded-2xl bg-surface border border-border"></div>
                    <div className="h-40 rounded-2xl bg-surface border border-border"></div>
                </div>

                {/* List Skeleton */}
                <div className="space-y-4">
                    <div className="h-12 w-full rounded-xl bg-elevated"></div>
                    <div className="h-12 w-full rounded-xl bg-elevated"></div>
                    <div className="h-12 w-full rounded-xl bg-elevated"></div>
                    <div className="h-12 w-full rounded-xl bg-elevated"></div>
                </div>
            </div>
        </div>
    )
}