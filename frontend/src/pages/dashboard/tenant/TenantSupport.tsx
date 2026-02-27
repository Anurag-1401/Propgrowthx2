import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { 
  Mail, User, Phone, MapPin, Clock, Send, CheckCircle2, ArrowLeft,
  Menu, BarChart3, Home, DollarSign, FileText, HelpCircle, Settings, LogOut, X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // will be overridden
  const { toast } = useToast();

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // mobile: drawer closed
      } else {
        setSidebarOpen(true);  // desktop: sidebar open
      }
    };
    handleResize(); // set on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

        :root { --brand-red: #DC2626; --muted: #6b7280; --glass: rgba(255,255,255,0.78); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }

        /* ── Hero — exact TenantTransactions style ── */
        .sp-page-title {
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          font-size: clamp(36px, 4.5vw, 56px);
          font-weight: 400;
          letter-spacing: -1.5px;
          line-height: 1.1;
          color: #0b1220;
          margin: 0;
          animation: slideInLeft 0.7s ease-out 0.1s both;
        }
        @media (max-width: 640px) { .sp-page-title { font-size: clamp(24px, 5vw, 42px); } }

        .sp-title-accent {
          color: var(--brand-red);
          font-weight: 700;
          animation: slideInRight 0.7s ease-out 0.2s both;
          display: inline-block;
        }

        .sp-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 32px;
        }
        @media (max-width: 768px) { .sp-container { padding: 16px 20px; } }
        @media (max-width: 640px) { .sp-container { padding: 12px 16px; } }

        .sp-header-hero {
          position: relative;
          padding: 32px 40px 36px;
          border-radius: 20px;
          background: linear-gradient(180deg, #FFF5F5 0%, #FFE4E6 100%);
          border: 1px solid rgba(220, 38, 38, 0.12);
          animation: fadeInUp 0.8s ease-out 0s both;
        }
        @media (max-width: 768px) { .sp-header-hero { padding: 20px 24px 24px; border-radius: 16px; } }
        @media (max-width: 640px) { .sp-header-hero { padding: 16px 18px 20px; border-radius: 12px; } }
        .sp-header-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          box-shadow: 0 20px 50px rgba(2, 6, 23, 0.05);
        }

        .sp-header-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }
        @media (max-width: 640px) { .sp-header-title-row { flex-direction: column; gap: 12px; } }

        .sp-header-subtitle {
          font-size: 16px;
          color: var(--muted);
          font-weight: 400;
          letter-spacing: 0.2px;
          line-height: 1.6;
          margin-top: 12px;
          animation: fadeInUp 0.8s ease-out 0.25s both;
        }
        @media (max-width: 768px) { .sp-header-subtitle { font-size: 14px; margin-top: 10px; } }
        @media (max-width: 640px) { .sp-header-subtitle { font-size: 12px; margin-top: 8px; line-height: 1.5; } }

        .sp-divider-line {
          height: 1px;
          background: linear-gradient(90deg, rgba(220,38,38,0), rgba(220,38,38,0.3) 20%, rgba(220,38,38,0.5) 50%, rgba(220,38,38,0.3) 80%, rgba(220,38,38,0));
          width: 100%;
          margin-top: 22px;
          animation: fadeInUp 0.8s ease-out 0.35s both;
        }
        @media (max-width: 640px) { .sp-divider-line { margin-top: 14px; } }

        .sp-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--glass);
          border: 1px solid rgba(2,6,23,0.06);
          border-radius: 10px;
          padding: 10px 14px;
          cursor: pointer;
          transition: transform .16s ease, box-shadow .16s ease;
          backdrop-filter: blur(8px);
          font-weight: 600;
          color: #0b1220;
          animation: slideInLeft 0.7s ease-out 0s both;
        }
        @media (max-width: 640px) { .sp-back-btn { padding: 8px 10px; font-size: 12px; gap: 6px; } }
        .sp-back-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(2,6,23,0.06); }
        .sp-back-btn svg { width: 14px; height: 14px; }

        /* Contact area unchanged */
        .contact-area {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 1024px) { .contact-area { grid-template-columns: 380px 1fr; gap: 32px; } }

        .contact-list {
          background: linear-gradient(180deg, rgba(255,255,255,1), rgba(250,250,250,1));
          border: 1px solid rgba(16,24,40,0.04);
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.035);
          animation: slideInLeft 0.8s ease-out 0.3s both;
        }

        .contact-row {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          border-radius: 10px;
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
          cursor: pointer;
          position: relative;
        }
        .contact-row + .contact-row { margin-top: 8px; }
        .contact-row:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(15,23,42,0.06); background: rgba(255,255,255,0.9); }

        .icon-tile {
          min-width: 48px; height: 48px;
          border-radius: 10px;
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(180deg, #fcfcfd, #f7f7f8);
          border: 1px solid rgba(15,23,42,0.03);
          box-shadow: 0 6px 18px rgba(16,24,40,0.03);
          transition: all 0.3s ease;
        }
        .contact-row:hover .icon-tile { background: linear-gradient(180deg, rgba(220,38,38,0.05), rgba(220,38,38,0.02)); transform: scale(1.08); }

        .contact-meta { flex: 1; min-width: 0; }
        .contact-title { font-size: 12px; color: #111827; font-weight: 700; margin-bottom: 3px; }
        .contact-value { font-size: 13px; color: #4b5563; line-height: 1.3; word-break: break-word; }
        .contact-arrow { color: rgba(75,85,99,0.45); transition: all 0.3s ease; }
        .contact-row:hover .contact-arrow { color: var(--brand-red); transform: translateX(4px); }

        .form-card {
          position: relative;
          padding: 20px;
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.8));
          border: 1px solid rgba(16,24,40,0.04);
          box-shadow: 0 18px 50px rgba(16,24,40,0.06);
          overflow: hidden;
          animation: slideInRight 0.8s ease-out 0.3s both;
        }
        @media (min-width: 768px) { .form-card { padding: 24px; } }
        .form-card::after {
          content: '';
          position: absolute; right: -120px; top: -60px;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(220,38,38,0.03), transparent 25%), radial-gradient(circle at 70% 70%, rgba(2,132,199,0.02), transparent 25%);
          pointer-events: none; transform: rotate(8deg);
        }

        .form-row { display: grid; gap: 12px; grid-template-columns: 1fr; }
        @media (min-width: 640px) { .form-row.sm-2 { grid-template-columns: 1fr 1fr; gap: 12px; } }

        .field-label { display: block; font-size: 11px; letter-spacing: .6px; color: #374151; margin-bottom: 6px; font-weight: 700; text-transform: uppercase; }

        .modern-input, .modern-textarea, .modern-select {
          width: 100%; border-radius: 10px; padding: 10px 12px;
          border: 1.5px solid #e6e3df; background: #fff;
          transition: box-shadow .16s ease, border-color .16s ease, transform .16s ease;
          font-size: 13px;
        }
        .modern-input:focus, .modern-textarea:focus, .modern-select:focus {
          box-shadow: 0 8px 30px rgba(2,6,23,0.06); border-color: rgba(17,24,39,0.12); outline: none; transform: translateY(-2px);
        }

        .form-cta { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 12px; flex-wrap: wrap; }

        .submit-btn-modern {
          background: linear-gradient(90deg, var(--brand-red), #b91c1c);
          color: #fff; padding: 10px 16px; border-radius: 10px; font-weight: 700;
          display: inline-flex; align-items: center; gap: 8px;
          border: none; font-size: 13px;
          transition: transform .14s ease, box-shadow .14s ease, opacity .14s ease;
        }
        .submit-btn-modern:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 34px rgba(220,38,38,0.18); }
        .submit-btn-modern:disabled { opacity: .75; cursor: not-allowed; }

        .note-small { font-size: 12px; color: #6b7280; }
        .success-panel { text-align: center; padding: 30px 20px; }
        .muted { color: #6b7280; font-size: 12px; }
        .section-heading { animation: fadeInUp 0.8s ease-out 0.2s both; }
        .section-subheading { animation: fadeInUp 0.8s ease-out 0.3s both; }

        /* Mobile adjustments for floating button */
        @media (max-width: 767px) {
          main {
            transition: padding-left 0.3s ease;
          }
        }
      `}</style>

      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* ─── MOBILE-ONLY: floating hamburger button ─── */}
        <button
          className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 flex items-center justify-center
            bg-white border border-gray-200 rounded-xl shadow-md
            transition-all duration-200 hover:bg-gray-50"
          style={{ display: sidebarOpen ? 'none' : undefined }}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* ─── MOBILE-ONLY: backdrop (closes drawer on tap) ─── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── MOBILE-ONLY: full drawer (slides in over content) ─── */}
        <aside
          className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40
            flex flex-col transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 flex-shrink-0" />
              <span className="text-base font-bold text-gray-900 whitespace-nowrap">PropGrowthX</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <SidebarItem
              icon={BarChart3}
              label="Dashboard"
              onClick={() => { navigate('/dashboard/tenant'); setSidebarOpen(false); }}
              sidebarOpen
            />
            <SidebarItem
              icon={Home}
              label="My Properties"
              onClick={() => { navigate('/properties'); setSidebarOpen(false); }}
              sidebarOpen
            />
            <SidebarItem
              icon={DollarSign}
              label="Transactions"
              onClick={() => { navigate('/dashboard/tenant/transactions'); setSidebarOpen(false); }}
              sidebarOpen
            />
            <SidebarItem
              icon={FileText}
              label="Complaints"
              onClick={() => { navigate('/dashboard/tenant/complaints'); setSidebarOpen(false); }}
              sidebarOpen
            />
          </nav>
          <div className="px-2 py-4 border-t border-gray-200 space-y-1">
            <SidebarItem
              icon={User}
              label="Profile"
              onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
              sidebarOpen
            />
            <SidebarItem
              icon={HelpCircle}
              label="Support"
              active
              onClick={() => setSidebarOpen(false)} // close drawer even on active link
              sidebarOpen
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              onClick={() => { navigate('/profile'); setSidebarOpen(false); }}
              sidebarOpen
            />
            <SidebarItem
              icon={LogOut}
              label="Logout"
              onClick={() => { sessionStorage.clear(); window.location.href = '/'; }}
              sidebarOpen
            />
          </div>
        </aside>

        {/* ─── DESKTOP / TABLET SIDEBAR (hidden on mobile) ─── */}
        <aside
          className={`hidden md:flex ${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-gray-200 transition-all duration-300 z-40 flex-col md:relative flex-shrink-0`}
        >
          <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
            {sidebarOpen ? (
              <div className="flex items-center gap-3 flex-1">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 flex-shrink-0" />
                <span className="text-lg font-bold text-gray-900 whitespace-nowrap">PropGrowthX</span>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Expand sidebar">
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2" aria-label="Toggle sidebar">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
          <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
            <SidebarItem icon={BarChart3}  label="Dashboard"    onClick={() => navigate('/dashboard/tenant')} sidebarOpen={sidebarOpen} />
            <SidebarItem icon={Home}       label="My Properties" onClick={() => navigate('/properties')} sidebarOpen={sidebarOpen} />
            <SidebarItem icon={DollarSign} label="Transactions"  onClick={() => navigate('/dashboard/tenant/transactions')} sidebarOpen={sidebarOpen} />
            <SidebarItem icon={FileText}   label="Complaints"   onClick={() => navigate('/dashboard/tenant/complaints')} sidebarOpen={sidebarOpen} />
          </nav>
          <div className="px-2 py-4 border-t border-gray-200 space-y-2">
            <SidebarItem icon={User}       label="Profile"  onClick={() => navigate('/profile')} sidebarOpen={sidebarOpen} />
            <SidebarItem icon={HelpCircle} label="Support"  active onClick={() => navigate('/dashboard/tenant/support')} sidebarOpen={sidebarOpen} />
            <SidebarItem icon={Settings}   label="Settings" onClick={() => navigate('/profile')} sidebarOpen={sidebarOpen} />
            <SidebarItem icon={LogOut}     label="Logout"   onClick={() => { sessionStorage.clear(); window.location.href = '/'; }} sidebarOpen={sidebarOpen} />
          </div>
        </aside>

        {/* ─── MAIN CONTENT — flex-1 ─── */}
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="min-h-screen bg-white">
            {/* ── HERO — with left padding adjustment on mobile ── */}
            <section className="relative bg-white pt-12 pb-0 overflow-hidden">
              <div className={`sp-container relative z-10 ${!sidebarOpen ? 'pl-16 md:pl-8' : ''}`}>
                <div className="pb-8">
                  <div className="sp-header-hero">
                    <div className="sp-header-title-row">
                      <div className="max-w-3xl flex-1">
                        <h1 className="sp-page-title mb-3">
                          Let's create something<br />
                          <span className="sp-title-accent">extraordinary</span>
                        </h1>
                        <p className="sp-header-subtitle">
                          Have a question about PropGrowthX? We'd love to hear from you. Get in touch
                          with our team and let's discuss how we can help accelerate your property investment journey.
                        </p>
                      </div>
                    </div>
                    <div className="sp-divider-line" />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Everything below is unchanged ── */}
            <section className="py-6 md:py-0 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-1 gap-6 md:gap-8">
                  <div className="section-heading mb-2 md:mb-3">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1 md:mb-2">Get in touch</h2>
                    <p className="text-gray-600 text-xs md:text-sm">We're available across multiple channels</p>
                  </div>

                  <div className="contact-area">
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
                              <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--brand-red)' }} />
                            </div>
                            <div className="contact-meta">
                              <div className="contact-title">{item.title}</div>
                              <div className="contact-value">{item.value}</div>
                            </div>
                            <div className="contact-arrow" aria-hidden>
                              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" style={{ transform: 'rotate(180deg)', opacity: 0.6 }} />
                            </div>
                          </a>
                        );
                      })}
                    </aside>

                    <main className="form-card" aria-label="Contact form">
                      {isSubmitted ? (
                        <div className="success-panel" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 36, background: 'linear-gradient(180deg,#ecfdf5,#eefaf3)', margin: '0 auto 14px' }}>
                            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" style={{ color: '#059669', animation: 'subtleFloat 2.5s ease-in-out infinite' }} />
                          </div>
                          <h3 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900 mb-2">Message received</h3>
                          <p className="text-gray-600 mb-4 max-w-md mx-auto text-xs md:text-sm leading-relaxed">
                            Thanks for reaching out. Our team will review your message and get back to you within 24 hours.
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <button onClick={() => setIsSubmitted(false)} className="px-4 md:px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-10 text-xs md:text-sm font-medium transition-all duration-300">
                              Send another message
                            </button>
                            <button onClick={() => navigate('/dashboard/tenant')} className="submit-btn-modern">
                              Back to dashboard
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} aria-label="Contact form body">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>Send us a message</div>
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

                          <div className="form-row sm-2" style={{ marginTop: 12 }}>
                            <div>
                              <Label htmlFor="email" className="field-label">Email address</Label>
                              <Input id="email" type="email" placeholder="you@example.com" required className="modern-input" />
                            </div>
                            <div>
                              <Label htmlFor="phone" className="field-label">Phone number</Label>
                              <Input id="phone" type="tel" placeholder="+91 98765 43218" className="modern-input" />
                            </div>
                          </div>

                          <div style={{ marginTop: 14 }}>
                            <Label htmlFor="interest" className="field-label">I'm interested in</Label>
                            <Select>
                              <SelectTrigger className="modern-select" aria-label="Interest select">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent className="rounded-14 border-gray-200">
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

                          <div style={{ marginTop: 14 }}>
                            <Label htmlFor="message" className="field-label">Your message</Label>
                            <Textarea id="message" placeholder="Tell us more about your property inquiry, timeline, or specific needs..." rows={5} required className="modern-textarea" style={{ resize: 'none' }} />
                          </div>

                          <div className="form-cta">
                            <button type="submit" className="submit-btn-modern" disabled={isSubmitting} aria-busy={isSubmitting} aria-label="Send inquiry">
                              <Send className="w-3 h-3 md:w-4 md:h-4" style={{ color: '#fff' }} />
                              {isSubmitting ? 'Sending...' : 'Send inquiry'}
                            </button>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="note-small">We respond within <span style={{ fontWeight: 700, color: '#111827' }}>24 hours</span></div>
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
    </>
  );
};

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  sidebarOpen = true,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  sidebarOpen?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-base ${
        active ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium'
      }`}
      title={!sidebarOpen ? label : ''}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      {sidebarOpen && <span>{label}</span>}
    </button>
  );
};

export default Contact;