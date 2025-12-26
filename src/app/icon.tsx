import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Replicating your gradient: Blue-500 (#3B82F6) to Violet-500 (#8B5CF6)
                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                    borderRadius: '8px', // Matches your rx="8" relative to size
                }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* The 'A' Symbol */}
                    <path
                        d="M16 6L8 24H12.5L16 16L19.5 24H24L16 6Z"
                        fill="white"
                        fill-opacity="0.9"
                    />
                    {/* The Flow Cutout */}
                    <path
                        d="M16 16L10 24H22L16 16Z"
                        fill="white"
                        fill-opacity="0.4"
                    />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}