// components/spending-chart.tsx
'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface ChartData {
    name: string
    value: number
    count?: number
    [key: string]: string | number | undefined
}

interface SpendingChartProps {
    data: ChartData[]
    total: number
}

const COLORS = [
    '#64748B',
    '#475569',
    '#334155',
    '#1E293B',
]

export default function SpendingChart({ data, total }: SpendingChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [showDetails, setShowDetails] = useState(false)

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48">
                <p className="text-sm text-tertiary">No expense data</p>
                <p className="text-xs text-tertiary mt-1">
                    Record expenses to see breakdown
                </p>
            </div>
        )
    }

    // Prepare display data (max 3 + "Other")
    const displayData = data.length > 3
        ? [
            ...data.slice(0, 3),
            {
                name: 'Other',
                value: data.slice(3).reduce((sum, item) => sum + item.value, 0),
                count: data.slice(3).reduce((sum, item) => sum + (item.count || 0), 0)
            }
        ]
        : data

    const handlePieEnter = (_: unknown, index: number) => {
        setActiveIndex(index)
    }

    const handlePieLeave = () => {
        setActiveIndex(null)
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chart */}
            <div
                className="h-32 mb-4 cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={displayData}
                            cx="50%"
                            cy="50%"
                            innerRadius={36}
                            outerRadius={activeIndex !== null ? 60 : 56}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            onMouseEnter={handlePieEnter}
                            onMouseLeave={handlePieLeave}
                        >
                            {displayData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    style={{
                                        filter: activeIndex === index ? 'brightness(1.2)' : 'none',
                                        transition: 'all 150ms ease-out'
                                    }}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend with Details */}
            <div className="space-y-2 flex-1">
                {displayData.map((item, index) => {
                    const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
                    const isActive = activeIndex === index

                    return (
                        <div
                            key={item.name}
                            className={`flex items-center justify-between text-sm p-2 -mx-2 rounded-lg transition-all duration-150 ease-out ${isActive ? 'bg-elevated' : ''
                                }`}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div
                                    className="w-2 h-2 rounded-sm shrink-0"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-muted truncate">
                                    {item.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 ml-2">
                                {(showDetails || isActive) && (
                                    <span className="text-xs text-tertiary data-text">
                                        {formatCurrency(item.value)}
                                    </span>
                                )}
                                <span className="text-tertiary data-text w-8 text-right">
                                    {percentage}%
                                </span>
                            </div>
                        </div>
                    )
                })}

                {data.length > 4 && (
                    <p className="text-xs text-tertiary pt-1">
                        +{data.length - 3} more in `&quot`Other`&quot`
                    </p>
                )}
            </div>
        </div>
    )
}