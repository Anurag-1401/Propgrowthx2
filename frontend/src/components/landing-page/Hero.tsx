export default function Hero() {
  return (
    <section
      style={{
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <style>
        {`
          @media (max-width: 768px) {
            .hero-section {
              height: 100vh !important;
              min-height: 500px !important;
              padding-top: 60px !important;
            }
            .hero-content {
              padding: 0 16px !important;
            }
            .hero-heading {
              font-size: 32px !important;
              line-height: 1.1 !important;
              margin-bottom: 16px !important;
            }
            .hero-subheading {
              font-size: 14px !important;
              margin-bottom: 24px !important;
            }
            .hero-button {
              font-size: 12px !important;
              padding: 12px 24px !important;
              width: 100% !important;
              max-width: 260px !important;
            }
          }
          @media (max-width: 480px) {
            .hero-section {
              min-height: 450px !important;
            }
            .hero-content {
              padding: 0 12px !important;
            }
            .hero-heading {
              font-size: 28px !important;
            }
            .hero-subheading {
              font-size: 13px !important;
            }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .hero-content {
              padding: 0 32px !important;
            }
            .hero-heading {
              font-size: 56px !important;
            }
          }
        `}
      </style>
      
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
        }}
      >
        <img
          src="/hero-bg.jpg"
          alt="Modern Property Interior"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        {/* Dark overlay for better text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.15))',
          }}
        />
      </div>

      {/* Content */}
      <div
        className="hero-content"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 60px',
          width: '100%',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: '850px' }}>
          {/* Main Heading - EXACT match to Framer */}
          <h1
            className="hero-heading"
            style={{
              fontSize: '72px',
              fontWeight: '700',
              color: '#FFFFFF',
              lineHeight: '0.95',
              marginBottom: '20px',
              letterSpacing: '-0.03em',
              fontFamily: 'Inter, sans-serif',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            Manage Your Properties<br />
            Like You're Standing<br />
            Right There.
          </h1>

          {/* Subheading */}
          <p
            className="hero-subheading"
            style={{
              fontSize: '17px',
              color: '#FFFFFF',
              lineHeight: '1.5',
              marginBottom: '36px',
              opacity: 0.92,
              fontWeight: '400',
              fontFamily: 'DM Sans, sans-serif',
              maxWidth: '580px',
            }}
          >
            Control every property from anywhere. Real-time visibility,
            automated workflows, zero spreadsheets.
          </p>

          {/* CTA Button */}
          <button
            className="hero-button"
            style={{
              background: '#FFFFFF',
              color: '#EF4444',
              fontSize: '14px',
              fontWeight: '700',
              padding: '16px 40px',
              borderRadius: '100px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.18)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)'
            }}
          >
            REGISTER YOUR PROPERTY
          </button>
        </div>
      </div>
    </section>
  )
}