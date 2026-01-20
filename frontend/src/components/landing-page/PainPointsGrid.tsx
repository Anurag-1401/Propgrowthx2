// Component props with defaults
interface PainPointsGridProps {
  sectionBg?: string
  cardBg?: string
  textColor?: string
  titleColor?: string
  accentColor?: string
  badgeColor?: string
  eyebrowColor?: string
}

export default function PainPointsGrid(props: PainPointsGridProps) {
  // Helper function
  function hexToRgba(hex: string, alpha: number = 1): string {
    if (!hex) return `rgba(0,0,0,${alpha})`
    if (hex.startsWith('rgba')) return hex
    if (!hex.startsWith('#')) return `rgba(0,0,0,${alpha})`

    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Default props
  const {
    sectionBg = '#FFFFFF',
    cardBg = '#FAFBFC',
    textColor = '#1F2937',
    titleColor = '#111827',
    accentColor = '#DC2626',
    badgeColor = '#DC2626',
    eyebrowColor = '#DC2626',
  } = props

  const painPoints = [
    {
      badge: '30% LATE PAYMENTS',
      title: 'Chasing rent on WhatsApp',
      description:
        'Payment threads, missed receipts and unclear confirmations - you lose time and money every month.',
      color: accentColor,
    },
    {
      badge: 'REVENUE LEAKS',
      title: 'Underpriced listings',
      description:
        'No market intelligence means pricing mistakes - tenants pay less, and you lose thousands.',
      color: accentColor,
    },
    {
      badge: 'BROKEN WORKFLOW',
      title: 'Missed repairs & follow-ups',
      description:
        'Small maintenance grows into big problems - angry tenants, bad reviews and more churn.',
      color: accentColor,
    },
    {
      badge: '24/7 STRESS',
      title: `Always worrying about what's next`,
      description:
        'Notifications you miss, deadlines you forget - managing feels like firefighting, not running a business.',
      color: accentColor,
    },
  ]

  return (
    <section
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '80px 40px',
        background: sectionBg,
        fontFamily:
          "DM Sans, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        color: textColor,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <style>
        {`
          /* Professional centered container with proper spacing */
          .pp-container { 
            max-width: 1200px; 
            width: 100%;
            margin: 0 auto; 
            display: grid; 
            gap: 48px; 
            grid-template-columns: 1fr 1.4fr; 
            align-items: start; 
          }
          
          .pp-headline { 
            padding-right: 24px; 
            position: sticky;
            top: 100px;
          }
          
          .pp-eyebrow { 
            font-size: 13px; 
            font-weight: 700; 
            text-transform: uppercase; 
            color: ${eyebrowColor}; 
            letter-spacing: 0.08em; 
            margin-bottom: 16px; 
          }
          
          .pp-title { 
            font-size: clamp(28px, 4vw, 36px); 
            line-height: 1.2; 
            margin: 0 0 16px 0; 
            font-weight: 800; 
            color: ${titleColor}; 
            letter-spacing: -0.02em;
          }
          
          .pp-sub { 
            margin: 0; 
            color: ${hexToRgba(textColor, 0.7)}; 
            font-size: 16px; 
            line-height: 1.65; 
          }
          
          .pp-grid { 
            display: grid; 
            gap: 24px; 
            grid-template-columns: repeat(2, 1fr); 
          }
          
          .pp-card { 
            background: ${cardBg}; 
            border-radius: 16px; 
            padding: 28px 24px; 
            border: 1px solid ${hexToRgba(titleColor, 0.06)}; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.04); 
            transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; 
            cursor: default; 
            min-height: 160px; 
            display: flex; 
            flex-direction: column; 
            justify-content: space-between; 
          }
          
          .pp-card:hover { 
            transform: translateY(-4px); 
            box-shadow: 0 12px 32px rgba(0,0,0,0.08); 
            border-color: ${hexToRgba(accentColor, 0.15)};
          }
          
          .pp-badge { 
            font-size: 11px; 
            font-weight: 800; 
            text-transform: uppercase; 
            letter-spacing: 0.06em; 
            color: ${badgeColor}; 
          }
          
          .pp-card-title { 
            margin: 12px 0 8px 0; 
            font-size: 19px; 
            font-weight: 700; 
            color: ${titleColor}; 
            line-height: 1.3;
            letter-spacing: -0.01em;
          }
          
          .pp-desc { 
            margin: 0; 
            color: ${hexToRgba(textColor, 0.65)}; 
            font-size: 14px; 
            line-height: 1.6; 
          }
          
          /* Responsive breakpoints */
          @media (max-width: 1024px) {
            .pp-container { 
              max-width: 960px;
              gap: 40px;
            }
          }
          
          @media (max-width: 900px) {
            .pp-container { 
              grid-template-columns: 1fr; 
              gap: 48px;
            }
            .pp-headline {
              position: relative;
              top: 0;
              padding-right: 0;
            }
            .pp-grid { 
              grid-template-columns: repeat(2, 1fr); 
            }
          }
          
          @media (max-width: 640px) {
            .pp-grid { 
              grid-template-columns: 1fr; 
            }
            .pp-container {
              gap: 32px;
            }
          }
          
          @media (max-width: 480px) {
            section {
              padding: 60px 20px !important;
            }
          }
        `}
      </style>

      <div className="pp-container">
        {/* Left: Headline - sticky on desktop */}
        <div className="pp-headline">
          <div className="pp-eyebrow">
            Managing properties shouldn't be this hard
          </div>
          <h2 className="pp-title">
            These daily challenges drain your time, money and peace of mind
          </h2>
          <p className="pp-sub">
            No one should manage properties by hopping between chats and
            spreadsheets. Here are the real problems owners face and why they
            need a single, trusted system.
          </p>
        </div>

        {/* Right: Grid of pain cards */}
        <div
          className="pp-grid"
          role="list"
          aria-label="Property management pain points"
        >
          {painPoints.map((p, i) => (
            <article
              className="pp-card"
              role="listitem"
              key={i}
              aria-labelledby={`pp-title-${i}`}
            >
              <div>
                <div className="pp-badge">{p.badge}</div>
                <h3 id={`pp-title-${i}`} className="pp-card-title">
                  {p.title}
                </h3>
                <p className="pp-desc">{p.description}</p>
              </div>

              {/* Footer indicator */}
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: p.color,
                    boxShadow: `0 4px 12px ${hexToRgba(p.color, 0.25)}`,
                  }}
                />
                <div
                  style={{
                    fontSize: 12,
                    color: hexToRgba(textColor, 0.5),
                    fontWeight: 500,
                  }}
                >
                  Common problem - needs a system
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}