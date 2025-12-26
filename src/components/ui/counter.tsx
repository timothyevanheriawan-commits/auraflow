'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'

export default function NumberTicker({ value, currency = 'IDR' }: { value: number, currency?: string }) {
    // Spring physics setup (Snappy but smooth)
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 })

    // Transform number to currency string
    const display = useTransform(spring, (current) => formatCurrency(Math.floor(current), currency))

    useEffect(() => {
        spring.set(value)
    }, [spring, value])

    return <motion.span>{display}</motion.span>
}