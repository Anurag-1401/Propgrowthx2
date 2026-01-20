// Load fonts
if (typeof document !== "undefined") {
    const existing = document.querySelector(
        'link[href*="fonts.googleapis.com"]'
    )
    const href =
        "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap"
    if (!existing || existing.getAttribute("href") !== href) {
        const link = document.createElement("link")
        link.href = href
        link.rel = "stylesheet"
        document.head.appendChild(link)
    }
    const faHref =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    const existingFA =
        document.querySelector(`link[href="${faHref}"]`) ||
        document.querySelector(
            'link[href*="font-awesome"], link[href*="fontawesome"]'
        )
    if (!existingFA) {
        const faLink = document.createElement("link")
        faLink.href = faHref
        faLink.rel = "stylesheet"
        document.head.appendChild(faLink)
    }
}

interface HowItWorksCardsProps {
    mainHeading?: string
    subHeading?: string
    card1Title?: string
    card1Description?: string
    card2Title?: string
    card2Description?: string
    card3Title?: string
    card3Description?: string
    card4Title?: string
    card4Description?: string
    backgroundColor?: string
    cardBackground?: string
    accentColor?: string
    headingColor?: string
    subheadingColor?: string
    textColor?: string
}

const cardIcons = {
    card1: (color: string) => (
        <i
            className="fa-solid fa-house"
            aria-hidden="true"
            style={{ fontSize: 22, color: color, lineHeight: 1 }}
        />
    ),
    card2: (color: string) => (
        <i
            className="fa-solid fa-arrows-rotate"
            aria-hidden="true"
            style={{ fontSize: 22, color: color, lineHeight: 1 }}
        />
    ),
    card3: (color: string) => (
        <i
            className="fa-solid fa-heart-pulse"
            aria-hidden="true"
            style={{ fontSize: 22, color: color, lineHeight: 1 }}
        />
    ),
    card4: (color: string) => (
        <i
            className="fa-solid fa-dollar-sign"
            aria-hidden="true"
            style={{ fontSize: 22, color: color, lineHeight: 1 }}
        />
    ),
}

export default function HowItWorksCards(props: HowItWorksCardsProps) {
    // Helper function to convert hex to rgba
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
        mainHeading = "Everything You Need. Nothing to Excellence in Minutes",
        subHeading = "Four powerful modules that work together seamlessly to give you complete control over your properties.",
        card1Title = "See All Your Properties in One Place",
        card1Description = "No more Excel sheets. View every property, tenant, and payment instantly.",
        card2Title = "Upload Excel, Get Your Digital Twin",
        card2Description = "Drag your spreadsheet. We'll build your entire property system in 60 seconds.",
        card3Title = "Sit Back While It Runs Itself",
        card3Description = "Automatic rent reminders, payment tracking, and maintenance - no manual work.",
        card4Title = "Maximize Your Profits with AI",
        card4Description = "Get pricing alerts, vacancy warnings, and ROI insights that boost your income.",
        backgroundColor = "#FFFFFF",
        cardBackground = "#FFFFFF",
        accentColor = "#DC2626",
        headingColor = "#0F172A",
        subheadingColor = "#64748B",
        textColor = "#1E293B",
    } = props

    const cardData = [
        {
            number: "01",
            title: card1Title,
            description: card1Description,
            icon: cardIcons.card1,
        },
        {
            number: "02",
            title: card2Title,
            description: card2Description,
            icon: cardIcons.card2,
        },
        {
            number: "03",
            title: card3Title,
            description: card3Description,
            icon: cardIcons.card3,
        },
        {
            number: "04",
            title: card4Title,
            description: card4Description,
            icon: cardIcons.card4,
        },
    ]

    return (
        <div
            style={{
                width: "100%",
                minHeight: "600px",
                padding: "100px 20px",
                background: backgroundColor,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                fontFamily: `"DM Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
            }}
        >
            {/* Section Header */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "70px",
                    maxWidth: "900px",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Modern badge - bigger text, less gap */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "5px",
                    }}
                >
                    <div
                        style={{
                            width: "30px",
                            height: "2px",
                            background: accentColor,
                        }}
                    />
                    <span
                        style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: hexToRgba(textColor, 0.65),
                            letterSpacing: "0.01em",
                        }}
                    >
                        How it works
                    </span>
                </div>

                <h2
                    style={{
                        fontSize: "clamp(32px, 5vw, 52px)",
                        fontWeight: "800",
                        color: headingColor,
                        marginBottom: "18px",
                        lineHeight: "1.15",
                        margin: "0 0 18px 0",
                        letterSpacing: "-0.03em",
                    }}
                >
                    {mainHeading}
                </h2>
                <p
                    style={{
                        fontSize: "clamp(17px, 2vw, 20px)",
                        color: subheadingColor,
                        lineHeight: "1.7",
                        margin: "0",
                        fontWeight: "500",
                    }}
                >
                    {subHeading}
                </p>
            </div>

            {/* Cards Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "24px",
                    maxWidth: "1400px",
                    width: "100%",
                    position: "relative",
                    zIndex: 1,
                }}
                className="cards-grid"
            >
                <style>{`
                    @media (max-width: 1024px) {
                        .cards-grid {
                            grid-template-columns: repeat(2, 1fr) !important;
                        }
                    }
                    @media (max-width: 640px) {
                        .cards-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}</style>
                {cardData.map((card, index) => (
                    <Card
                        key={index}
                        card={card}
                        accentColor={accentColor}
                        cardBg={cardBackground}
                        textColor={textColor}
                        hexToRgba={hexToRgba}
                    />
                ))}
            </div>
        </div>
    )
}

function Card({ card, accentColor, cardBg, textColor, hexToRgba }: {
    card: any
    accentColor: string
    cardBg: string
    textColor: string
    hexToRgba: (hex: string, alpha?: number) => string
}) {
    return (
        <div
            className="card-wrapper"
            style={{
                position: "relative",
                height: "100%",
            }}
        >
            <div
                className="card-inner"
                style={{
                    background: `linear-gradient(135deg, ${cardBg} 0%, ${hexToRgba(accentColor, 0.02)} 100%)`,
                    borderRadius: "16px",
                    padding: "40px 32px",
                    height: "100%",
                    minHeight: "340px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "visible",
                    border: `1px solid ${hexToRgba(textColor, 0.12)}`,
                    boxShadow: `0 8px 20px ${hexToRgba(accentColor, 0.12)}, 0 2px 8px ${hexToRgba(accentColor, 0.08)}`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                    const cardEl = e.currentTarget
                    // Card lift with STRONG red shadow
                    cardEl.style.transform = "translateY(-8px)"
                    cardEl.style.boxShadow = `0 20px 48px ${hexToRgba(
                        accentColor,
                        0.2
                    )}, 0 0 0 1px ${hexToRgba(accentColor, 0.15)}`
                    cardEl.style.borderColor = accentColor

                    // Icon background becomes more vibrant red
                    const iconContainer = cardEl.querySelector(".card-icon") as HTMLElement
                    if (iconContainer) {
                        iconContainer.style.background = accentColor
                        iconContainer.style.boxShadow = `0 6px 20px ${hexToRgba(accentColor, 0.4)}`
                    }

                    // Icon SVG turns white for contrast
                    const iconEl = cardEl.querySelector(".card-icon i") as HTMLElement
                    if (iconEl) {
                        iconEl.style.color = "#FFFFFF"
                    }

                    // Number turns BRIGHT red
                    const number = cardEl.querySelector(".card-number") as HTMLElement
                    if (number) {
                        number.style.color = accentColor
                        number.style.opacity = "1"
                    }

                    // Title turns BRIGHT red - IMPORTANT!
                    const title = cardEl.querySelector(".card-title") as HTMLElement
                    if (title) {
                        title.style.color = accentColor
                    }

                    // Decorative line appears and expands
                    const line = cardEl.querySelector(".decorative-line") as HTMLElement
                    if (line) {
                        line.style.width = "60px"
                        line.style.opacity = "1"
                    }
                }}
                onMouseLeave={(e) => {
                    const cardEl = e.currentTarget
                    // Reset everything
                    cardEl.style.transform = "translateY(0)"
                    cardEl.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)"
                    cardEl.style.borderColor = hexToRgba(textColor, 0.12)

                    const iconContainer = cardEl.querySelector(".card-icon") as HTMLElement
                    if (iconContainer) {
                        iconContainer.style.background = `linear-gradient(135deg, ${hexToRgba(accentColor, 0.12)} 0%, ${hexToRgba(accentColor, 0.06)} 100%)`
                        iconContainer.style.boxShadow = `0 4px 12px ${hexToRgba(accentColor, 0.15)}`
                    }

                    // Reset icon color to red (default state)
                    const iconEl = cardEl.querySelector(".card-icon i") as HTMLElement
                    if (iconEl) {
                        iconEl.style.color = accentColor
                    }

                    const number = cardEl.querySelector(".card-number") as HTMLElement
                    if (number) {
                        number.style.color = hexToRgba(textColor, 0.3)
                        number.style.opacity = "1"
                    }

                    const title = cardEl.querySelector(".card-title") as HTMLElement
                    if (title) {
                        title.style.color = textColor
                    }

                    const line = cardEl.querySelector(".decorative-line") as HTMLElement
                    if (line) {
                        line.style.width = "0px"
                        line.style.opacity = "0"
                    }
                }}
            >
                {/* Card Content */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    {/* Top Section: Number + Icon */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "28px",
                        }}
                    >
                        {/* Number - More visible in default state */}
                        <div
                            className="card-number"
                            style={{
                                fontSize: "56px",
                                fontWeight: "800",
                                color: hexToRgba(textColor, 0.3),
                                lineHeight: "1",
                                transition: "all 0.3s ease",
                            }}
                        >
                            {card.number}
                        </div>

                        {/* Icon - More visible background with red tint */}
                        <div
                            className="card-icon"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "56px",
                                height: "56px",
                                borderRadius: "14px",
                                background: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.12)} 0%, ${hexToRgba(accentColor, 0.06)} 100%)`,
                                boxShadow: `0 4px 12px ${hexToRgba(accentColor, 0.15)}`,
                                transition: "all 0.3s ease",
                            }}
                        >
                            {card.icon(accentColor)}
                        </div>
                    </div>

                    {/* Decorative Line - Appears only on hover */}
                    <div
                        className="decorative-line"
                        style={{
                            width: "0px",
                            height: "3px",
                            background: accentColor,
                            borderRadius: "2px",
                            marginBottom: "20px",
                            opacity: "0",
                            display: "block",
                            transition: "all 0.3s ease",
                        }}
                    />

                    {/* Title - Turns RED on hover */}
                    <h3
                        className="card-title"
                        style={{
                            fontSize: "clamp(18px, 2.5vw, 21px)",
                            fontWeight: "700",
                            color: textColor,
                            marginBottom: "12px",
                            lineHeight: "1.4",
                            letterSpacing: "-0.01em",
                            transition: "color 0.3s ease",
                        }}
                    >
                        {card.title}
                    </h3>

                    {/* Description */}
                    <p
                        style={{
                            fontSize: "15px",
                            color: hexToRgba(textColor, 0.6),
                            lineHeight: "1.6",
                            marginBottom: "0",
                            flex: 1,
                        }}
                    >
                        {card.description}
                    </p>
                </div>
            </div>
        </div>
    )
}