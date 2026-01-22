export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '800px',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '50px',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <img
          src="/logo.png"
          alt="PropGrowthX Logo"
          style={{
            width: '36px',
            height: '36px',
            objectFit: 'contain',
          }}
        />
        <span
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1F2937',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          PropgrowthX
        </span>
      </div>

      {/* Navigation Links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        <a
          href="/how-it-works"
          style={{
            fontSize: '15px',
            fontWeight: '500',
            color: '#1F2937',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
            fontFamily: 'DM Sans, sans-serif',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#1F2937')}
        >
          How it Works
        </a>
        <a
          href="/properties"
          style={{
            fontSize: '15px',
            fontWeight: '500',
            color: '#EF4444',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Properties
        </a>
        <a
          href="/services"
          style={{
            fontSize: '15px',
            fontWeight: '500',
            color: '#1F2937',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
            fontFamily: 'DM Sans, sans-serif',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#1F2937')}
        >
          Services
        </a>
      </div>

      {/* Join Now Button */}
      <button
        onClick={() => window.location.href = '/auth'}
        style={{
          background: '#EF4444',
          color: '#FFFFFF',
          fontSize: '15px',
          fontWeight: '600',
          padding: '8px 24px',
          borderRadius: '100px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
          fontFamily: 'DM Sans, sans-serif',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#DC2626'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.35)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#EF4444'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)'
        }}
      >
        Join Now
      </button>
    </nav>
  )
}