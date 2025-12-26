'use client'

import { motion } from 'framer-motion'

export default function PageAnimation({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.5
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}