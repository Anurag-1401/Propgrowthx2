// Load fonts
if (typeof document !== "undefined") {
    const link = document.createElement("link")
    link.href =
        "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
    link.rel = "stylesheet"
    if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link)
    }
}

interface DigitalTwinShowcaseProps {
    mainHeading?: string
    subHeading?: string
    backgroundColor?: string
    cardBackground?: string
    accentColor?: string
    headingColor?: string
    subheadingColor?: string
    textColor?: string
}

export default function DigitalTwinShowcase(props: DigitalTwinShowcaseProps) {
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
        mainHeading = "Your Property's Digital Twin - Not Just Another Dashboard",
        subHeading = "Every property gets a living, breathing digital presence. Feel connected without being there.",
        backgroundColor = "#FFFFFF",
        cardBackground = "#FAFBFC",
        accentColor = "#EF4444",
        headingColor = "#111827",
        subheadingColor = "#6B7280",
        textColor = "#1F2937",
    } = props

    return (
        <div
            id="features"
            style={{
                width: "100%",
                padding: "40px 16px",
                background: backgroundColor,
                fontFamily: "DM Sans, sans-serif",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <style>
                {`
                    @media (max-width: 768px) {
                        .digital-twin-container {
                            padding: 32px 16px !important;
                        }
                        .section-header {
                            margin-bottom: 32px !important;
                        }
                        .comparison-grid {
                            grid-template-columns: 1fr !important;
                            gap: 16px !important;
                        }
                        .dashboard-container {
                            padding: 3px !important;
                        }
                        .dashboard-image {
                            height: 240px !important;
                        }
                        .feature-grid {
                            grid-template-columns: 1fr !important;
                            gap: 12px !important;
                        }
                    }
                    @media (max-width: 480px) {
                        .digital-twin-container {
                            padding: 28px 12px !important;
                        }
                        .section-header {
                            margin-bottom: 24px !important;
                        }
                        .dashboard-image {
                            height: 200px !important;
                        }
                    }
                    @media (min-width: 769px) and (max-width: 1024px) {
                        .digital-twin-container {
                            padding: 90px 32px !important;
                        }
                        .comparison-grid {
                            gap: 24px !important;
                        }
                    }
                `}
            </style>
            <div
                className="digital-twin-container"
                style={{
                    maxWidth: "1200px",
                    width: "100%",
                }}
            >
                {/* Section Header */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "64px",
                        maxWidth: "720px",
                        margin: "0 auto 64px auto",
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
                            Your core differentiator
                        </span>
                    </div>

                    {/* Heading */}
                    <h2
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
                        style={{
                            fontSize: "clamp(15px, 2vw, 17px)",
                            color: subheadingColor,
                            lineHeight: "1.6",
                            margin: 0,
                            fontWeight: "500",
                        }}
                    >
                        {subHeading}
                    </p>
                </div>

                {/* Before/After Comparison */}
                <BeforeAfterComparison
                    textColor={textColor}
                    accentColor={accentColor}
                    cardBg={cardBackground}
                    hexToRgba={hexToRgba}
                />

                {/* Main Dashboard Showcase */}
                <DashboardShowcase
                    accentColor={accentColor}
                    textColor={textColor}
                    cardBg={cardBackground}
                    hexToRgba={hexToRgba}
                />

                {/* Feature Grid */}
                <FeatureGrid
                    textColor={textColor}
                    accentColor={accentColor}
                    cardBg={cardBackground}
                    hexToRgba={hexToRgba}
                />
            </div>
        </div>
    )
}

// Before/After Comparison Component - Refined
function BeforeAfterComparison({ textColor, accentColor, cardBg, hexToRgba }: {
    textColor: string
    accentColor: string
    cardBg: string
    hexToRgba: (hex: string, alpha?: number) => string
}) {
    return (
        <div
            style={{
                marginBottom: "80px",
            }}
        >
            <div
                className="comparison-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "28px",
                }}
            >
                {/* Before Card */}
                <ComparisonCard
                    type="before"
                    title="Current Reality"
                    items={[
                        "Excel sheets scattered across devices",
                        "WhatsApp threads for payment tracking",
                        "Manual rent reminders every month",
                        "Lost maintenance requests",
                        "No visibility into property performance",
                        "Constant stress and uncertainty",
                    ]}
                    textColor={textColor}
                    accentColor="#DC2626"
                    cardBg={cardBg}
                    image="https://raw.githubusercontent.com/deena19liebert/public/refs/heads/main/images/before.png"
                    hexToRgba={hexToRgba}
                />

                {/* After Card */}
                <ComparisonCard
                    type="after"
                    title="With Digital Twin"
                    items={[
                        "Complete property view in one place",
                        "Automated rent collection & reminders",
                        "Real-time payment & occupancy tracking",
                        "Maintenance workflow with audit trail",
                        "Performance insights & analytics",
                        "Control and peace of mind",
                    ]}
                    textColor={textColor}
                    accentColor={accentColor}
                    cardBg={cardBg}
                    image="https://raw.githubusercontent.com/deena19liebert/public/refs/heads/main/images/after.png"
                    hexToRgba={hexToRgba}
                />
            </div>
        </div>
    )
}

// Comparison Card Component - Professional Design
function ComparisonCard({
    type,
    title,
    items,
    textColor,
    accentColor,
    cardBg,
    image,
    hexToRgba,
}: {
    type: string
    title: string
    items: string[]
    textColor: string
    accentColor: string
    cardBg: string
    image: string
    hexToRgba: (hex: string, alpha?: number) => string
}) {
    return (
        <div
            className="comparison-card"
            style={{
                background: cardBg,
                borderRadius: "20px",
                overflow: "hidden",
                border: `1px solid ${type === "after" ? hexToRgba(accentColor, 0.2) : hexToRgba(textColor, 0.06)}`,
                boxShadow:
                    type === "after"
                        ? `0 8px 32px ${hexToRgba(accentColor, 0.12)}`
                        : "0 2px 12px rgba(0, 0, 0, 0.06)",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "default",
                position: "relative",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)"
                if (type === "after") {
                    e.currentTarget.style.boxShadow = `0 16px 48px ${hexToRgba(accentColor, 0.18)}`
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                if (type === "after") {
                    e.currentTarget.style.boxShadow = `0 8px 32px ${hexToRgba(accentColor, 0.12)}`
                }
            }}
        >
            {/* Badge */}
            <div
                style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    padding: "6px 14px",
                    background:
                        type === "after"
                            ? accentColor
                            : hexToRgba(textColor, 0.08),
                    color: type === "after" ? "#FFFFFF" : textColor,
                    borderRadius: "100px",
                    fontSize: "11px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    zIndex: 2,
                }}
            >
                {type === "before" ? "Before" : "With PropGrowthX"}
            </div>

            {/* Image */}
            <div
                style={{
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                    position: "relative",
                    background: "#F3F4F6",
                }}
            >
                <img
                    src={image}
                    alt={title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: type === "before" ? "grayscale(20%)" : "none",
                    }}
                />
            </div>

            {/* Content */}
            <div style={{ padding: "28px" }}>
                <h4
                    style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: textColor,
                        marginBottom: "20px",
                        letterSpacing: "-0.01em",
                    }}
                >
                    {title}
                </h4>

                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    {items.map((item, index) => (
                        <li
                            key={index}
                            style={{
                                fontSize: "14px",
                                color: hexToRgba(textColor, 0.7),
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                                lineHeight: "1.5",
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background:
                                        type === "after"
                                            ? accentColor
                                            : hexToRgba(textColor, 0.3),
                                    marginTop: "6px",
                                    flexShrink: 0,
                                }}
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

// Dashboard Showcase Component - Clean & Professional
function DashboardShowcase({ accentColor, textColor, cardBg, hexToRgba }: {
    accentColor: string
    textColor: string
    cardBg: string
    hexToRgba: (hex: string, alpha?: number) => string
}) {
    return (
        <div
            style={{
                marginBottom: "80px",
                position: "relative",
            }}
        >
            {/* Section Title */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "40px",
                }}
            >
                <h3
                    style={{
                        fontSize: "clamp(22px, 3.5vw, 28px)",
                        fontWeight: "700",
                        color: textColor,
                        marginBottom: "8px",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Complete Property Intelligence
                </h3>
                <p
                    style={{
                        fontSize: "15px",
                        color: hexToRgba(textColor, 0.6),
                        margin: 0,
                    }}
                >
                    Everything you need to know, in one unified view
                </p>
            </div>

            {/* Main Dashboard Container */}
            <div
                style={{
                    position: "relative",
                    maxWidth: "100%",
                }}
            >
                <div
                    className="dashboard-container"
                    style={{
                        background: cardBg,
                        borderRadius: "16px",
                        padding: "6px",
                        border: `1px solid ${hexToRgba(textColor, 0.06)}`,
                        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08)`,
                        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)"
                        e.currentTarget.style.boxShadow = `0 16px 48px ${hexToRgba(accentColor, 0.12)}`
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow =
                            "0 8px 32px rgba(0, 0, 0, 0.08)"
                    }}
                >
                    {/* Browser Chrome - Minimal */}
                    <div
                        style={{
                            background: "#F9FAFB",
                            borderRadius: "12px 12px 0 0",
                            padding: "10px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            borderBottom: "1px solid #E5E7EB",
                        }}
                    >
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: "#FF5F57",
                            }}
                        />
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: "#FFBD2E",
                            }}
                        />
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: "#28CA42",
                            }}
                        />
                        <div
                            style={{
                                marginLeft: "12px",
                                flex: 1,
                                height: "24px",
                                background: "#FFFFFF",
                                borderRadius: "6px",
                                border: "1px solid #E5E7EB",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 10px",
                                fontSize: "11px",
                                color: "#9CA3AF",
                                fontWeight: "500",
                            }}
                        >
                            propgrowthx.com/properties/sunset-villa
                        </div>
                    </div>

                    {/* Dashboard Screenshot */}
                    <div
                        className="dashboard-image"
                        style={{
                            width: "100%",
                            height: "500px",
                            borderRadius: "0 0 10px 10px",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <img
                            src="https://raw.githubusercontent.com/deena19liebert/public/refs/heads/main/images/main_dashboard.png"
                            alt="Digital Twin Dashboard"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                </div>

                {/* Key Features Callouts - Subtle */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px",
                        marginTop: "32px",
                    }}
                >
                    <FeatureCallout
                        label="Live Data"
                        value="Real-time updates"
                        textColor={textColor}
                        hexToRgba={hexToRgba}
                    />
                    <FeatureCallout
                        label="Complete History"
                        value="All transactions"
                        textColor={textColor}
                        hexToRgba={hexToRgba}
                    />
                    <FeatureCallout
                        label="Smart Alerts"
                        value="Automated reminders"
                        textColor={textColor}
                        hexToRgba={hexToRgba}
                    />
                    <FeatureCallout
                        label="Document Vault"
                        value="Secure storage"
                        textColor={textColor}
                        hexToRgba={hexToRgba}
                    />
                </div>
            </div>
        </div>
    )
}

// Feature Callout - Minimal Design
function FeatureCallout({ label, value, textColor, hexToRgba }: {
    label: string
    value: string
    textColor: string
    hexToRgba: (hex: string, alpha?: number) => string
}) {
    return (
        <div
            style={{
                textAlign: "center",
                padding: "16px",
            }}
        >
            <div
                style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: textColor,
                    marginBottom: "4px",
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontSize: "12px",
                    color: hexToRgba(textColor, 0.5),
                    fontWeight: "500",
                }}
            >
                {value}
            </div>
        </div>
    )
}

function FeatureGrid({ textColor, accentColor, cardBg, hexToRgba }: {
    textColor: string
    accentColor: string
    cardBg: string
    hexToRgba: (hex: string, alpha?: number) => string
}) {
    const features = [
        {
            iconClass: "fas fa-user-circle",
            title: "Tenant Profiles",
            description:
                "Contact info, lease details, payment history, and communication logs",
        },
        {
            iconClass: "fas fa-calendar-alt",
            title: "Lease Timeline",
            description:
                "Track start dates, renewals, expirations, and critical milestones",
        },
        {
            iconClass: "fas fa-credit-card",
            title: "Payment Tracking",
            description:
                "Automated collection, receipt storage, and overdue management",
        },
        {
            iconClass: "fas fa-tools",
            title: "Maintenance Log",
            description:
                "Request tracking, vendor coordination, and completion verification",
        },
        {
            iconClass: "fas fa-folder-open",
            title: "Document Storage",
            description:
                "Secure vault for leases, contracts, inspection reports, and files",
        },
        {
            iconClass: "fas fa-bell",
            title: "Smart Notifications",
            description:
                "Rent reminders, maintenance alerts, lease renewals, and updates",
        },
    ]

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
            }}
        >
            {features.map((feature, index) => (
                <FeatureCard
                    key={index}
                    feature={feature}
                    textColor={textColor}
                    accentColor={accentColor}
                    cardBg={cardBg}
                    index={index + 1}
                    hexToRgba={hexToRgba}
                />
            ))}
        </div>
    )
}

// Feature Card Component
function FeatureCard({ feature, textColor, accentColor, cardBg, index, hexToRgba }: {
    feature: any
    textColor: string
    accentColor: string
    cardBg: string
    index: number
    hexToRgba: (hex: string, alpha?: number) => string
}) {
    return (
        <div
            className="feature-card"
            style={{
                background: "#FFFFFF",
                padding: "0",
                borderRadius: "20px",
                border: `1px solid ${hexToRgba(textColor, 0.08)}`,
                position: "relative",
                overflow: "hidden",
                transition:
                    "transform 0.36s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.36s ease, border-color 0.36s ease",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)"
                e.currentTarget.style.boxShadow = `0 22px 48px ${hexToRgba(accentColor, 0.15)}`
                e.currentTarget.style.borderColor = hexToRgba(accentColor, 0.2)

                const header = e.currentTarget.querySelector(".card-header") as HTMLElement
                if (header) {
                    header.style.backgroundColor = hexToRgba(accentColor, 0.25)
                    header.style.backgroundImage = `
                        linear-gradient(135deg, ${hexToRgba(accentColor, 0.25)} 0%, ${hexToRgba(accentColor, 0.16)} 100%),
                        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                    `
                }

                const iconContainer = e.currentTarget.querySelector(".icon-container") as HTMLElement
                if (iconContainer) {
                    iconContainer.style.transform = "scale(1.1) rotate(5deg)"
                    iconContainer.style.boxShadow = `0 12px 32px ${hexToRgba(accentColor, 0.2)}`
                }

                const arrow = e.currentTarget.querySelector(".arrow-icon") as HTMLElement
                if (arrow) {
                    arrow.style.transform = "translate(6px, -6px)"
                    arrow.style.opacity = "1"
                }

                const featureIndex = e.currentTarget.querySelector(".feature-index") as HTMLElement
                if (featureIndex) {
                    featureIndex.style.color = hexToRgba(accentColor, 0.2)
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.04)"
                e.currentTarget.style.borderColor = hexToRgba(textColor, 0.08)

                const header = e.currentTarget.querySelector(".card-header") as HTMLElement
                if (header) {
                    header.style.backgroundColor = hexToRgba(accentColor, 0.12)
                    header.style.backgroundImage = `
                        linear-gradient(135deg, ${hexToRgba(accentColor, 0.12)} 0%, ${hexToRgba(accentColor, 0.04)} 100%),
                        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                    `
                }

                const iconContainer = e.currentTarget.querySelector(".icon-container") as HTMLElement
                if (iconContainer) {
                    iconContainer.style.transform = "scale(1) rotate(0deg)"
                    iconContainer.style.boxShadow = `0 10px 26px ${hexToRgba(accentColor, 0.1)}`
                }

                const arrow = e.currentTarget.querySelector(".arrow-icon") as HTMLElement
                if (arrow) {
                    arrow.style.transform = "translate(0, 0)"
                    arrow.style.opacity = "0"
                }

                const featureIndex = e.currentTarget.querySelector(".feature-index") as HTMLElement
                if (featureIndex) {
                    featureIndex.style.color = hexToRgba(accentColor, 0.1)
                }
            }}
            onFocus={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)"
                e.currentTarget.style.boxShadow = `0 22px 48px ${hexToRgba(accentColor, 0.15)}`
            }}
            onBlur={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.04)"
            }}
            tabIndex={0}
            role="button"
            aria-label={feature.title}
        >
            <div
                className="card-header"
                style={{
                    backgroundColor: hexToRgba(accentColor, 0.08),
                    backgroundImage: `
                        linear-gradient(135deg, ${hexToRgba(accentColor, 0.08)} 0%, ${hexToRgba(accentColor, 0.04)} 100%),
                        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                    `,
                    backgroundRepeat: "no-repeat",
                    padding: "32px 28px",
                    position: "relative",
                    transition: "background 0.36s cubic-bezier(0.4, 0, 0.2, 1)",
                    minHeight: "160px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {/* Icon Container with FONT AWESOME */}
                <div
                    className="icon-container"
                    style={{
                        width: "64px",
                        height: "64px",
                        background: "#FFFFFF",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                        boxShadow: `0 10px 26px ${hexToRgba(accentColor, 0.1)}`,
                        transition: "all 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <i
                        className={feature.iconClass}
                        style={{
                            fontSize: "28px",
                            color: accentColor,
                        }}
                    />
                </div>

                {/* Title */}
                <h4
                    style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: textColor,
                        marginBottom: "0",
                        letterSpacing: "-0.02em",
                        lineHeight: "1.28",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {feature.title}
                </h4>
            </div>

            {/* Card Body */}
            <div
                style={{
                    padding: "28px",
                    background: "#FFFFFF",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                {/* Description */}
                <p
                    style={{
                        fontSize: "15px",
                        color: hexToRgba(textColor, 0.65),
                        lineHeight: "1.7",
                        margin: "0 0 20px 0",
                        fontWeight: "500",
                    }}
                >
                    {feature.description}
                </p>
            </div>

            {/* Bottom Accent Bar */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${accentColor} 0%, ${hexToRgba(accentColor, 0.28)} 100%)`,
                }}
            />
        </div>
    )
}