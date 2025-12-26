export const BrandLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6" /> {/* Blue-500 */}
                    <stop offset="1" stopColor="#8B5CF6" /> {/* Violet-500 */}
                </linearGradient>
            </defs>

            {/* Background Shape (Soft Rounded Squircle) */}
            <rect
                width="32"
                height="32"
                rx="8"
                fill="url(#logo-gradient)"
            />

            {/* The 'A' / Flow Symbol (White/Transparent cutout look) */}
            <path
                d="M16 6L8 24H12.5L16 16L19.5 24H24L16 6Z"
                fill="white"
                fillOpacity="0.9"
            />
            <path
                d="M16 16L10 24H22L16 16Z"
                fill="white"
                fillOpacity="0.4"
            />
        </svg>
    )
}