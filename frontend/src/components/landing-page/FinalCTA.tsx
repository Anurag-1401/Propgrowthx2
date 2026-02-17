import { ReactNode } from 'react'

// Import DM Sans font
if (typeof document !== "undefined") {
    const link = document.createElement("link")
    link.href =
        "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
    link.rel = "stylesheet"
    if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link)
    }
}

interface FinalCTAProps {
    mainHeading?: string
    subHeading?: string
    primaryCTA?: string
    secondaryCTA?: string
    backgroundColor?: string
    cardBackground?: string
    accentColor?: string
    headingColor?: string
    subheadingColor?: string
    textColor?: string
}

export default function FinalCTA(props: FinalCTAProps) {
    // Helper function
    function hexToRgba(hex: string, alpha: number = 1): string {
        if (hex.startsWith("rgba")) return hex
        if (!hex.startsWith("#")) return `rgba(0, 0, 0, ${alpha})`

        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)

        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    // Default props
    const {
        mainHeading = "Ready to Transform How You Manage Properties?",
        subHeading = "Join 12,500+ properties already using digital twins. Setup takes 15 minutes.",
        primaryCTA = "Upload Your Excel - Get Started Free",
        secondaryCTA = "Schedule a Demo",
        backgroundColor = "#FFFFFF",
        cardBackground = "#FAFBFC",
        accentColor = "#EF4444",
        headingColor = "#111827",
        subheadingColor = "#6B7280",
        textColor = "#1F2937",
    } = props

    return (
        <div
            id="get-started"
            style={{
                width: "100%",
                padding: "40px 16px",
                background: backgroundColor,
                fontFamily: "DM Sans, sans-serif",
                display: "flex",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <style>
                {`
                    @media (max-width: 768px) {
                        .final-cta-container {
                            padding: 32px 16px !important;
                        }
                        .cta-card {
                            padding: 32px 16px !important;
                            border-radius: 16px !important;
                        }
                        .cta-buttons {
                            flex-direction: column !important;
                            gap: 12px !important;
                        }
                        .primary-cta, .secondary-cta {
                            width: 100% !important;
                            max-width: none !important;
                        }
                        .trust-badges {
                            flex-direction: column !important;
                            gap: 12px !important;
                            align-items: center !important;
                        }
                        .avatar-section {
                            flex-direction: column !important;
                            gap: 8px !important;
                        }
                    }
                    @media (max-width: 480px) {
                        .final-cta-container {
                            padding: 28px 12px !important;
                        }
                        .cta-card {
                            padding: 24px 12px !important;
                        }
                        .main-heading {
                            font-size: 22px !important;
                        }
                        .sub-heading {
                            font-size: 14px !important;
                        }
                    }
                `}
            </style>
            {/* Subtle background accent */}
            <div
                style={{
                    position: "absolute",
                    top: "-50%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "800px",
                    height: "800px",
                    background: `radial-gradient(circle, ${hexToRgba(accentColor, 0.04)}, transparent 70%)`,
                    pointerEvents: "none",
                }}
            />

            <div
                className="final-cta-container"
                style={{
                    maxWidth: "1200px",
                    width: "100%",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Main CTA Container */}
                <div
                    className="cta-card"
                    style={{
                        background: cardBackground,
                        borderRadius: "24px",
                        padding: "64px 40px",
                        border: `1px solid ${hexToRgba(textColor, 0.06)}`,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
                        textAlign: "center",
                        maxWidth: "900px",
                        margin: "0 auto",
                    }}
                >
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <div
                            style={{
                                width: "32px",
                                height: "2px",
                                background: accentColor,
                            }}
                        />
                        <span
                            style={{
                                fontSize: "18px",
                                fontWeight: "500",
                                color: hexToRgba(textColor, 0.6),
                                letterSpacing: "0.02em",
                            }}
                        >
                            Get Started Today
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h2
                        className="main-heading"
                        style={{
                            fontSize: "clamp(28px, 5vw, 42px)",
                            fontWeight: "800",
                            color: headingColor,
                            marginBottom: "16px",
                            lineHeight: "1.15",
                            letterSpacing: "-0.03em",
                        }}
                    >
                        {mainHeading}
                    </h2>

                    {/* Subheading */}
                    <p
                        className="sub-heading"
                        style={{
                            fontSize: "clamp(16px, 2vw, 18px)",
                            color: subheadingColor,
                            lineHeight: "1.6",
                            margin: "0 0 40px 0",
                            fontWeight: "500",
                            maxWidth: "680px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        {subHeading}
                    </p>

                    {/* CTA Buttons */}
                    <div
                        className="cta-buttons"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            alignItems: "center",
                            marginBottom: "40px",
                        }}
                    >
                        {/* Primary CTA */}
                        <button
                            className="primary-cta"
                            style={{
                                background: accentColor,
                                color: "#FFFFFF",
                                fontSize: "16px",
                                fontWeight: "700",
                                padding: "18px 48px",
                                borderRadius: "12px",
                                border: "none",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: `0 8px 24px ${hexToRgba(accentColor, 0.3)}`,
                                fontFamily: "DM Sans, sans-serif",
                                letterSpacing: "-0.01em",
                                width: "100%",
                                maxWidth: "400px",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-2px)"
                                e.currentTarget.style.boxShadow = `0 12px 32px ${hexToRgba(accentColor, 0.4)}`
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)"
                                e.currentTarget.style.boxShadow = `0 8px 24px ${hexToRgba(accentColor, 0.3)}`
                            }}
                        >
                            {primaryCTA}
                        </button>

                        {/* Secondary CTA */}
                        <button
                            className="secondary-cta"
                            style={{
                                background: "transparent",
                                color: textColor,
                                fontSize: "15px",
                                fontWeight: "600",
                                padding: "16px 40px",
                                borderRadius: "12px",
                                border: `2px solid ${hexToRgba(textColor, 0.15)}`,
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                fontFamily: "DM Sans, sans-serif",
                                letterSpacing: "-0.01em",
                                width: "100%",
                                maxWidth: "400px",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                    accentColor
                                e.currentTarget.style.color = accentColor
                                e.currentTarget.style.transform =
                                    "translateY(-2px)"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = hexToRgba(
                                    textColor,
                                    0.15
                                )
                                e.currentTarget.style.color = textColor
                                e.currentTarget.style.transform =
                                    "translateY(0)"
                            }}
                        >
                            {secondaryCTA}
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div
                        className="trust-badges"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "32px",
                            paddingTop: "32px",
                            borderTop: `1px solid ${hexToRgba(textColor, 0.06)}`,
                        }}
                    >
                        <TrustBadge
                            icon={renderIcon("check", accentColor)}
                            text="No credit card required"
                            textColor={textColor}
                            hexToRgba={hexToRgba}
                        />
                        <TrustBadge
                            icon={renderIcon("clock", accentColor)}
                            text="Setup in 15 minutes"
                            textColor={textColor}
                            hexToRgba={hexToRgba}
                        />
                        <TrustBadge
                            icon={renderIcon("shield", accentColor)}
                            text="14-day free trial"
                            textColor={textColor}
                            hexToRgba={hexToRgba}
                        />
                        <TrustBadge
                            icon={renderIcon("x", accentColor)}
                            text="Cancel anytime"
                            textColor={textColor}
                            hexToRgba={hexToRgba}
                        />
                    </div>
                </div>

                {/* Social Proof Strip */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "48px",
                        padding: "0 20px",
                    }}
                >
                    <p
                        style={{
                            fontSize: "14px",
                            color: hexToRgba(textColor, 0.6),
                            margin: "0 0 16px 0",
                            fontWeight: "500",
                        }}
                    >
                        Join 12,500+ properties already using PropGrowthX
                    </p>

                    {/* Avatar Strip */}
                    <div
                        className="avatar-section"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "16px",
                            flexWrap: "wrap",
                        }}
                    >
                        <AvatarGroup />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                            }}
                        >
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 20 20"
                                    fill={accentColor}
                                >
                                    <path d="M10 1l2.5 6.5L19 8l-5 4.5L15.5 19 10 15.5 4.5 19 6 12.5 1 8l6.5-.5L10 1z" />
                                </svg>
                            ))}
                            <span
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: textColor,
                                    marginLeft: "8px",
                                }}
                            >
                                4.9/5
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Trust Badge Component
function TrustBadge({ icon, text, textColor, hexToRgba }: {
    icon: ReactNode
    text: string
    textColor: string
    hexToRgba: (hex: string, alpha?: number) => string
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {icon}
            </div>
            <span
                style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: hexToRgba(textColor, 0.7),
                }}
            >
                {text}
            </span>
        </div>
    )
}

// Avatar Group Component
function AvatarGroup() {
    const avatars = [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    ]

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
            }}
        >
            {avatars.map((avatar, index) => (
                <div
                    key={index}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "3px solid #FFFFFF",
                        marginLeft: index > 0 ? "-12px" : "0",
                        position: "relative",
                        zIndex: avatars.length - index,
                    }}
                >
                    <img
                        src={avatar}
                        alt={`User ${index + 1}`}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </div>
            ))}
        </div>
    )
}

// Professional SVG Icons
function renderIcon(type: string, color: string): ReactNode {
    const size = 20
    const strokeWidth = 2.5

    switch (type) {
        case "check":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M5 13l4 4L19 7"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )

        case "clock":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke={color}
                        strokeWidth={strokeWidth}
                    />
                    <path
                        d="M12 6v6l4 2"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                </svg>
            )

        case "shield":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )

        case "x":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                </svg>
            )

        default:
            return null
    }
}