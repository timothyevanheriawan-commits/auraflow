// components/asset-allocation-bar.tsx
interface AllocationData {
    type: string
    label: string
    amount: number
    percentage: number
}

interface AssetAllocationBarProps {
    data: AllocationData[]
}

// Neutral colors for allocation segments
const ALLOCATION_COLORS = [
    '#64748B', // slate-500
    '#475569', // slate-600
    '#334155', // slate-700
    '#1E293B', // slate-800
]

export default function AssetAllocationBar({ data }: AssetAllocationBarProps) {
    if (data.length === 0) return null

    return (
        <div>
            {/* Stacked Bar */}
            <div className="h-3 w-full rounded-full bg-elevated overflow-hidden flex">
                {data.map((item, index) => (
                    <div
                        key={item.type}
                        className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-200"
                        style={{
                            width: `${item.percentage}%`,
                            backgroundColor: ALLOCATION_COLORS[index % ALLOCATION_COLORS.length],
                        }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-4">
                {data.map((item, index) => (
                    <div key={item.type} className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-sm"
                            style={{ backgroundColor: ALLOCATION_COLORS[index % ALLOCATION_COLORS.length] }}
                        />
                        <span className="text-xs text-muted">
                            {item.label}
                        </span>
                        <span className="text-xs text-tertiary data-text">
                            {item.percentage.toFixed(0)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}