// Load Font Awesome
import { Link } from "react-router-dom";

if (typeof document !== "undefined") {
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

export default function Footer() {
  return (
    <footer style={{ width: "100%", backgroundColor: "#050505", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
      <style>
        {`
          @media (max-width: 768px) {
            .footer-grid {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
              text-align: center !important;
            }
            .footer-left {
              order: 1 !important;
            }
            .footer-middle {
              order: 2 !important;
              flex-direction: column !important;
              align-items: center !important;
              gap: 24px !important;
            }
            .footer-right {
              order: 3 !important;
            }
            .footer-container {
              padding: 32px 20px 16px 20px !important;
            }
            .footer-contacts {
              align-items: center !important;
            }
          }
          @media (max-width: 480px) {
            .footer-container {
              padding: 24px 16px 12px 16px !important;
            }
            .footer-grid {
              gap: 20px !important;
            }
            .footer-logo {
              flex-direction: column !important;
              align-items: center !important;
              gap: 8px !important;
              margin-left: 0 !important;
            }
            .footer-description {
              text-align: center !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }
            .footer-contacts {
              gap: 12px !important;
            }
          }
        `}
      </style>
      <div className="footer-container" style={{ maxWidth: "1320px", margin: "0 auto", padding: "48px 32px 24px 32px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "32px", alignItems: "start" }}>
          {/* Left column: Logo + description + contacts */}
          <div className="footer-left" style={{ gridColumn: "span 4" }}>
            <div className="footer-logo" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px", marginLeft: "-8px" }}>
              <img src="/logo.png" alt="PropgrowthX" style={{ width: "56px", height: "56px", objectFit: "contain" }} />
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#ffffff", margin: 0 }}>PropgrowthX</h3>
            </div>
            <p className="footer-description" style={{ fontSize: "14px", lineHeight: "24px", maxWidth: "300px", color: "#dfe3e6", margin: "0 0 32px 0" }}>
              The digital twin platform that lets you operate rental properties remotely.
            </p>

            <div className="footer-contacts" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
                {/* location icon */}
                <svg width="18" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#b71c1c" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="9" r="2.2" stroke="#b71c1c" strokeWidth="1.2" fill="none" />
                </svg>
                <div style={{ fontSize: "14px", color: "#e6e6e6", lineHeight: "24px" }}>
                  India
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg width="18" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8.5l9 6 9-6" stroke="#b71c1c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="2" y="4" width="20" height="14" rx="2" stroke="#b71c1c" strokeWidth="1.2" fill="none" />
                </svg>
                <div style={{ fontSize: "14px", color: "#e6e6e6" }}>contact@propgrowthx.com
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V21a1 1 0 0 1-1.11 1 19 19 0 0 1-8.63-3.07 19 19 0 0 1-6-6A19 19 0 0 1 2 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75c.12.62.34 1.6.57 2.22a1 1 0 0 1-.24 1L7.91 8.09a13 13 0 0 0 6 6l1.12-1.12a1 1 0 0 1 1-.24c.62.23 1.6.45 2.22.57a1 1 0 0 1 .75 1V21z" stroke="#b71c1c" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ fontSize: "14px", color: "#e6e6e6" }}>+91 9876543211</div>
              </div>
            </div>
          </div>

          {/* Middle columns: Product and Learn More */}
          <div className="footer-middle" style={{ gridColumn: "span 4", display: "flex", gap: "48px" }}>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", color: "#b71c1c", margin: 0 }}>Product</h4>
              <ul style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "15px", color: "#e6e6e6", lineHeight: "20px", listStyle: "none", padding: 0, margin: "24px 0 0 0" }}>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How it Works</a></li>
                <li><a href="#get-started">Get Started</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", color: "#b71c1c", margin: 0 }}>Learn More</h4>
              <ul style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "15px", color: "#e6e6e6", lineHeight: "20px", listStyle: "none", padding: 0, margin: "24px 0 0 0" }}>
                <li><Link to="/about-us" style={{ color: '#e6e6e6', textDecoration: 'none' }}>About PropGrowthX</Link></li>
                <li>Blog</li>
                <li>Privacy Policy</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>

          {/* Right column: Socials */}
          <div className="footer-right" style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", color: "#b71c1c", margin: 0 }}>Connect with us</h4>
            <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "24px" }}>
              {/* facebook */}
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "transparent", cursor: "pointer" }}>
                <i className="fab fa-facebook-f" style={{ fontSize: "18px", color: "#ffffff" }} />
              </div>

              {/* instagram */}
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "transparent", cursor: "pointer" }}>
                <i className="fab fa-instagram" style={{ fontSize: "18px", color: "#ffffff" }} />
              </div>

              {/* linkedin */}
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "transparent", cursor: "pointer" }}>
                <i className="fab fa-linkedin-in" style={{ fontSize: "18px", color: "#ffffff" }} />
              </div>
            </div>
          </div>

        </div>

        {/* red divider */}
        <div style={{ marginTop: "32px" }}>
          <div style={{ height: "2px", background: "linear-gradient(90deg,#3b0b0b, #b71c1c)", opacity: 0.7 }} />
        </div>

        <div style={{ marginTop: "20px" }}>
          <p style={{ textAlign: "center", fontSize: "14px", color: "#bfbfbf", margin: 0 }}>© 2026 PropGrowthX | All Rights Reserved</p>
        </div>

      </div>
    </footer>
  );
}