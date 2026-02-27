import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();

  // Start closed on mobile
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  // Mobile nav helper — close drawer then navigate
  const mobileGoTo = (path: string) => {
    if (window.innerWidth < 768) setSidebarOpen(false);
    navigate(path);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Message sent successfully!",
      description: "Our team will get back to you within 24 hours.",
    });
  };

  const contactInfo = [
    { icon: Mail,   title: 'Email',   value: 'contact@propgrowthx.com',             href: 'mailto:contact@propgrowthx.com' },
    { icon: Phone,  title: 'Phone',   value: '+91 9876543218',                       href: 'tel:+919876543218' },
    { icon: MapPin, title: 'Address', value: 'Bengaluru, Karnataka, India',          href: 'https://www.google.com/maps/place/Bengaluru,+Karnataka,+India/' },
    { icon: Clock,  title: 'Hours',   value: 'Mon – Fri • 9:00 AM – 6:00 PM (IST)', href: '#' },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | PropGrowthX</title>
        <meta name="description" content="Get in touch with PropGrowthX. Talk to our experts about property investments, analytics, or enterprise solutions." />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');
        * { font-family: 'Geist', sans-serif; box-sizing: border-box; }
        :root { --brand-red: #DC2626; }

        @keyframes fadeInUp   { from { opacity:0; transform:translateY(16px);  } to { opacity:1; transform:translateY(0);  } }
        @keyframes slideInLeft  { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInRight { from { opacity:0; transform:translateX(20px);  } to { opacity:1; transform:translateX(0); } }
        @keyframes subtleFloat  { 0%,100% { transform:translateY(0);  } 50% { transform:translateY(-8px); } }

        /* ── Hero ── */
        .hero-title {
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #000 0%, #404040 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }
        .gradient-text-accent {
          background: linear-gradient(90deg, var(--brand-red), #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
        }

        /* ── Contact list ── */
        .contact-area {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 1024px) { .contact-area { grid-template-columns: 420px 1fr; gap: 42px; } }

        .contact-list {
          background: linear-gradient(180deg, rgba(255,255,255,1), rgba(250,250,250,1));
          border: 1px solid rgba(16,24,40,0.04);
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.035);
          animation: slideInLeft 0.8s ease-out 0.3s both;
        }
        .contact-row {
          display: flex; gap: 14px; align-items: center; padding: 14px;
          border-radius: 12px;
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
          cursor: pointer;
        }
        .contact-row + .contact-row { margin-top: 10px; }
        .contact-row:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(15,23,42,0.06); background: rgba(255,255,255,0.9); }

        .icon-tile {
          min-width: 56px; height: 56px; border-radius: 12px;
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(180deg, #fcfcfd, #f7f7f8);
          border: 1px solid rgba(15,23,42,0.03);
          box-shadow: 0 6px 18px rgba(16,24,40,0.03);
          transition: all 0.3s ease;
        }
        .contact-row:hover .icon-tile { background: linear-gradient(180deg, rgba(220,38,38,0.05), rgba(220,38,38,0.02)); transform: scale(1.08); }

        .contact-meta { flex: 1; min-width: 0; }
        .contact-title { font-size: 13px; color: #111827; font-weight: 700; margin-bottom: 4px; }
        .contact-value { font-size: 14px; color: #4b5563; line-height: 1.35; word-break: break-word; }

        /* ── Form ── */
        .form-card {
          position: relative; padding: 24px; border-radius: 18px;
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.8));
          border: 1px solid rgba(16,24,40,0.04);
          box-shadow: 0 18px 50px rgba(16,24,40,0.06);
          overflow: hidden;
          animation: slideInRight 0.8s ease-out 0.3s both;
        }
        .form-card::after {
          content: ''; position: absolute; right: -120px; top: -60px;
          width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(220,38,38,0.03), transparent 25%),
                      radial-gradient(circle at 70% 70%, rgba(2,132,199,0.02), transparent 25%);
          pointer-events: none; transform: rotate(8deg);
        }
        .form-row { display: grid; gap: 14px; grid-template-columns: 1fr; }
        @media (min-width: 640px) { .form-row.sm-2 { grid-template-columns: 1fr 1fr; gap: 14px; } }

        .field-label { display:block; font-size:11px; letter-spacing:.6px; color:#374151; margin-bottom:6px; font-weight:700; text-transform:uppercase; }
        .modern-input, .modern-textarea, .modern-select {
          width:100%; border-radius:12px; padding:12px 14px;
          border:1.5px solid #e6e3df; background:#fff;
          transition: box-shadow .16s ease, border-color .16s ease, transform .16s ease; font-size:14px;
        }
        .modern-input:focus, .modern-textarea:focus, .modern-select:focus {
          box-shadow:0 8px 30px rgba(2,6,23,0.06); border-color:rgba(17,24,39,0.12); outline:none; transform:translateY(-2px);
        }
        .form-cta { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:12px; }
        .submit-btn-modern {
          background: linear-gradient(90deg, var(--brand-red), #b91c1c);
          color:#fff; padding:12px 20px; border-radius:12px; font-weight:700;
          display:inline-flex; align-items:center; gap:10px; border:none;
          transition: transform .14s ease, box-shadow .14s ease, opacity .14s ease;
        }
        .submit-btn-modern:hover:not(:disabled) { transform:translateY(-3px); box-shadow:0 12px 34px rgba(220,38,38,0.18); }
        .submit-btn-modern:disabled { opacity:.75; cursor:not-allowed; }
        .note-small { font-size:12px; color:#6b7280; }
        .success-panel { text-align:center; padding:40px 20px; }
        .muted { color:#6b7280; font-size:13px; }
      `}</style>

      <div className="flex h-screen bg-gray-50 overflow-hidden">

        {/* ═══════════════════════════════════════
            MOBILE ONLY — floating hamburger.
        ═══════════════════════════════════════ */}
        {!sidebarOpen && (
          <button
            className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 flex items-center justify-center
              bg-white border border-gray-200 rounded-xl shadow-md hover:bg-gray-50 transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <i className="fas fa-bars text-gray-700 text-sm"></i>
          </button>
        )}

        {/* ═══════════════════════════════════════
            MOBILE ONLY — dark backdrop.
        ═══════════════════════════════════════ */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ═══════════════════════════════════════
            MOBILE ONLY — full drawer, auto-closes on nav.
        ═══════════════════════════════════════ */}
        <aside
          className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 z-50
            flex flex-col transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-md overflow-hidden shadow-sm flex-shrink-0">
              <img src="/logo.png" alt="PropGrowthX Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-gray-900 text-base">PropGrowthX</span>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1.5 rounded-md hover:bg-gray-50 text-gray-500" aria-label="Close menu">
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>
          <nav className="px-2 py-4 flex-1 overflow-y-auto">
            {[
              { id: "dashboard",   label: "Dashboard",   icon: "fa-chart-bar",  path: "/dashboard-nav" },
              { id: "properties", label: "Properties", icon: "fa-building", path: "/properties-manage" },
              { id: "payments",   label: "Payments",   icon: "fa-receipt",  path: "/payments" },
              { id: "support",    label: "Support",    icon: "fa-headset",  path: "/contact" },
              { id: "complaints", label: "Complaints", icon: "fa-folder",   path: "/dashboard/owner/complaints" },
              { id: "team",       label: "Team",       icon: "fa-users",    path: null },
              { id: "profile",    label: "Profile",    icon: "fa-user",     path: "/profile" },
              { id: "settings",   label: "Settings",   icon: "fa-cog",      path: null },
            ].map((item) => (
              <MobileNavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                active={item.id === "support"}
                onClick={() => item.path ? mobileGoTo(item.path) : setSidebarOpen(false)}
              />
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
          </div>
        </aside>

        {/* ═══════════════════════════════════════
            DESKTOP / TABLET SIDEBAR — inline.
            Toggles w-64 ↔ w-20. Zero mobile changes.
        ═══════════════════════════════════════ */}
        <aside
          className={`hidden md:flex flex-col flex-shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0 z-40
            transition-all duration-200 ease-in-out ${sidebarOpen ? "w-64" : "w-20"}`}
          aria-label="Sidebar"
        >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-md overflow-hidden shadow-sm flex-shrink-0">
              <img src="/logo.png" alt="PropGrowthX Logo" className="w-full h-full object-contain" />
            </div>
            {sidebarOpen && <span className="font-semibold text-gray-900 text-lg">PropGrowthX</span>}
            <button
              onClick={() => setSidebarOpen(s => !s)}
              className="ml-auto bg-transparent p-2 rounded-md hover:bg-gray-50"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <i className={`fas ${sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"} text-gray-600 text-sm`}></i>
            </button>
          </div>
          <nav className="px-2 py-4 flex-1 overflow-y-auto">
            {[
              { id: "dashboard",   label: "Dashboard",   icon: "fa-chart-bar",  onClick: () => navigate("/dashboard-nav") },
              { id: "properties", label: "Properties", icon: "fa-building", onClick: () => navigate("/properties-manage") },
              { id: "payments",   label: "Payments",   icon: "fa-receipt",  onClick: () => navigate("/payments") },
              { id: "support",    label: "Support",    icon: "fa-headset",  onClick: () => navigate("/contact") },
              { id: "complaints", label: "Complaints", icon: "fa-folder",   onClick: () => navigate("/dashboard/owner/complaints") },
              { id: "team",       label: "Team",       icon: "fa-users",    onClick: undefined },
              { id: "profile",    label: "Profile",    icon: "fa-user",     onClick: () => navigate("/profile") },
              { id: "settings",   label: "Settings",   icon: "fa-cog",      onClick: undefined },
            ].map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                collapsed={!sidebarOpen}
                active={item.id === "support"}
                onClick={item.onClick}
              />
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-gray-100">
            {sidebarOpen
              ? <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
              : <div className="text-center text-xs text-gray-400">©PG</div>
            }
          </div>
        </aside>

        {/* ═══════════════════════════════════════
            MAIN CONTENT
        ═══════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-white">
            <div className="min-h-screen">

              {/* ── Hero ── */}
              <section className="relative pt-12 pb-12 lg:pt-16 lg:pb-16 px-6 pl-14 md:pl-6">
                <div className="max-w-6xl mx-auto">
                  <div className="max-w-3xl">
                    <h1 className="hero-title text-4xl sm:text-5xl lg:text-7xl font-light mb-6 leading-tight">
                      Let's create something
                      <span className="gradient-text-accent font-medium"> extraordinary</span>
                    </h1>
                    <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-xl font-light" style={{ animation: 'fadeInUp 0.8s ease-out 0.25s both' }}>
                      Have a question about PropGrowthX? We'd love to hear from you. Get in touch with our team and let's discuss how we can help accelerate your property investment journey.
                    </p>
                  </div>
                </div>
              </section>

              {/* Divider */}
              <div className="px-6 pl-14 md:pl-6">
                <div className="max-w-6xl mx-auto border-t border-gray-100" />
              </div>

              {/* ── Contact content ── */}
              <section className="py-8 lg:py-8 px-6 pl-14 md:pl-6">
                <div className="max-w-6xl mx-auto">
                  <div className="grid lg:grid-cols-1 gap-8">
                    <div className="mb-3">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Get in touch</h2>
                      <p className="text-gray-600 text-sm">We're available across multiple channels</p>
                    </div>

                    <div className="contact-area">
                      {/* Left — contact list */}
                      <aside className="contact-list" aria-label="Contact details">
                        {contactInfo.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={index}
                              href={item.href}
                              className="contact-row"
                              onMouseEnter={() => setHoveredCard(index)}
                              onMouseLeave={() => setHoveredCard(null)}
                              rel="noreferrer"
                              style={{ animation: `fadeInUp 0.8s ease-out ${0.35 + index * 0.08}s both` }}
                            >
                              <div className="icon-tile" aria-hidden>
                                <Icon className="w-5 h-5" style={{ color: 'var(--brand-red)' }} />
                              </div>
                              <div className="contact-meta">
                                <div className="contact-title">{item.title}</div>
                                <div className="contact-value">{item.value}</div>
                              </div>
                            </a>
                          );
                        })}
                      </aside>

                      {/* Right — form */}
                      <main className="form-card" aria-label="Contact form">
                        {isSubmitted ? (
                          <div className="success-panel" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                            <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:88, height:88, borderRadius:44, background:'linear-gradient(180deg,#ecfdf5,#eefaf3)', margin:'0 auto 18px' }}>
                              <CheckCircle2 className="w-10 h-10" style={{ color:'#059669', animation:'subtleFloat 2.5s ease-in-out infinite' }} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 mb-2">Message received</h3>
                            <p className="text-gray-600 mb-5 max-w-md mx-auto text-sm leading-relaxed">
                              Thanks for reaching out. Our team will review your message and get back to you within 24 hours.
                            </p>
                            <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
                              <button onClick={() => setIsSubmitted(false)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-sm font-medium transition-all duration-300">
                                Send another message
                              </button>
                              <button onClick={() => navigate('/dashboard-nav')} className="submit-btn-modern">
                                Back to dashboard
                              </button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmit} aria-label="Contact form body">
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                              <div>
                                <div style={{ fontSize:13, fontWeight:700, color:'#111827' }}>Send us a message</div>
                                <div className="muted">Our team typically replies within 24 hours</div>
                              </div>
                            </div>

                            <div className="form-row sm-2">
                              <div>
                                <Label htmlFor="firstName" className="field-label">First name</Label>
                                <Input id="firstName" placeholder="John" required className="modern-input" />
                              </div>
                              <div>
                                <Label htmlFor="lastName" className="field-label">Last name</Label>
                                <Input id="lastName" placeholder="Doe" required className="modern-input" />
                              </div>
                            </div>

                            <div className="form-row sm-2" style={{ marginTop:12 }}>
                              <div>
                                <Label htmlFor="email" className="field-label">Email address</Label>
                                <Input id="email" type="email" placeholder="you@example.com" required className="modern-input" />
                              </div>
                              <div>
                                <Label htmlFor="phone" className="field-label">Phone number</Label>
                                <Input id="phone" type="tel" placeholder="+91 98765 43218" className="modern-input" />
                              </div>
                            </div>

                            <div style={{ marginTop:14 }}>
                              <Label htmlFor="interest" className="field-label">I'm interested in</Label>
                              <Select>
                                <SelectTrigger className="modern-select" aria-label="Interest select">
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-200">
                                  <SelectItem value="buying">Buying a property</SelectItem>
                                  <SelectItem value="selling">Selling a property</SelectItem>
                                  <SelectItem value="renting">Renting a property</SelectItem>
                                  <SelectItem value="investing">Investment advisory</SelectItem>
                                  <SelectItem value="analytics">Analytics & reports</SelectItem>
                                  <SelectItem value="enterprise">Enterprise solutions</SelectItem>
                                  <SelectItem value="other">Other inquiry</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div style={{ marginTop:14 }}>
                              <Label htmlFor="message" className="field-label">Your message</Label>
                              <Textarea id="message" placeholder="Tell us more about your property inquiry, timeline, or specific needs..." rows={6} required className="modern-textarea" style={{ resize:'none' }} />
                            </div>

                            <div className="form-cta">
                              <button type="submit" className="submit-btn-modern" disabled={isSubmitting} aria-busy={isSubmitting} aria-label="Send inquiry">
                                <Send className="w-4 h-4" style={{ color:'#fff' }} />
                                {isSubmitting ? 'Sending...' : 'Send inquiry'}
                              </button>
                              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
                                <div className="note-small">We respond within <span style={{ fontWeight:700, color:'#111827' }}>24 hours</span></div>
                              </div>
                            </div>
                          </form>
                        )}
                      </main>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>
    </>
  );
};

// ── Mobile-only nav item ──
function MobileNavItem({ label, icon, active = false, onClick }: { label: string; icon: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150
        ${active ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50"}`}
      aria-label={label}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${active ? "bg-red-100" : "bg-gray-50"}`}>
        <i className={`fas ${icon} text-sm ${active ? "text-red-600" : "text-gray-600"}`}></i>
      </span>
      <span className={`text-sm font-medium ${active ? "font-semibold" : ""}`}>{label}</span>
    </button>
  );
}

// ── Desktop/tablet nav item ──
function NavItem({ label, icon, collapsed = false, active = false, onClick }: { label: string; icon: string; collapsed?: boolean; active?: boolean; onClick?: () => void }) {
  return (
    <button
      className={`group w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150
        ${active ? "bg-red-50" : "hover:bg-gray-50"}`}
      aria-label={label}
      title={collapsed ? label : undefined}
      onClick={onClick}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${active ? "bg-red-100" : "bg-gray-50"}`}>
        <i className={`fas ${icon} text-sm ${active ? "text-red-600" : "text-gray-600"}`}></i>
      </span>
      {!collapsed && (
        <span className={`text-sm font-medium ${active ? "text-red-600 font-semibold" : "text-gray-900"}`}>{label}</span>
      )}
    </button>
  );
}

export default Contact;