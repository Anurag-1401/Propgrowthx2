import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
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
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

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
    {
      icon: Mail,
      title: 'Email Us',
      value: 'contact@propgrowthx.com',
      href: 'mailto:contact@propgrowthx.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+91 9876543218',
      href: 'tel:+919876543218',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: 'Banglore, Karnataka, India',
      href: 'https://www.google.com/maps/place/Bengaluru,+Karnataka,+India/',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Fri: 9AM - 6PM PST',
      href: '#',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | PropGrowthX</title>
        <meta
          name="description"
          content="Get in touch with PropGrowthX. Talk to our experts about property investments, analytics, or enterprise solutions."
        />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');

        * { font-family: 'Geist', sans-serif; box-sizing: border-box; }

        /* Smooth entrance animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes subtleFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.1);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(220, 38, 38, 0);
          }
        }

        .hero-title {
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #000 0%, #404040 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        /* Brand accent */
        :root { --brand-red: #DC2626; }

        .contact-hero {
          position: relative;
          padding: 48px 24px 56px;
          border-radius: 14px;
          background:
            linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,1)),
            linear-gradient(90deg, rgba(220,38,38,0.03) 0%, rgba(255,255,255,0) 38%);
          overflow: visible;
          border: 1px solid rgba(16,24,40,0.03);
          box-shadow: 0 10px 30px rgba(2,6,23,0.03);
        }

        /* Enhanced decorative accent */
        .contact-hero::before{
          content: '';
          position: absolute;
          right: -8%;
          top: -10%;
          width: 540px;
          height: 540px;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle at 35% 35%, rgba(220,38,38,0.08) 0%, rgba(220,38,38,0.04) 12%, transparent 30%);
          filter: blur(14px);
          opacity: 0.95;
          transform: translateZ(0);
          animation: subtleFloat 6s ease-in-out infinite;
        }

        .contact-hero::after {
          content:'';
          position:absolute;
          left:-6%;
          bottom:-6%;
          width:420px;
          height:420px;
          border-radius:50%;
          background: radial-gradient(circle at 40% 40%, rgba(2,132,199,0.02), transparent 30%);
          filter: blur(18px);
          pointer-events:none;
        }

        .contact-hero .hero-title { 
          color: #0b1220;
        }

        .contact-hero .gradient-text-accent {
          background: linear-gradient(90deg, var(--brand-red), #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
        }

        .contact-hero .gradient-text-accent::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--brand-red), #ff6b6b);
          border-radius: 2px;
          opacity: 0;
          animation: fadeInUp 1.2s ease-out 0.4s both;
        }

        .contact-hero p {
          color: #4b5563;
          font-size: 1.06rem;
          line-height: 1.7;
          animation: fadeInUp 0.8s ease-out 0.25s both;
        }

        .header-subtitle {
          font-size: 0.95rem;
          color: #6b7280;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 20px;
          animation: slideInLeft 0.8s ease-out 0s both;
        }


        @media (max-width: 768px) {
          .contact-hero {
            padding: 36px 18px 40px;
          }
          .contact-hero::before, .contact-hero::after { display: none; }
          .header-subtitle {
            font-size: 0.85rem;
          }
        }

        .gradient-text-accent {
          background: linear-gradient(135deg, var(--brand-red), #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Back button styling */
        .back-btn {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(2,6,23,0.06);
          border-radius: 12px;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.22s ease;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(2,6,23,0.08);
        }

        /* Layout */
        .contact-area {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 1024px) {
          .contact-area { grid-template-columns: 420px 1fr; gap: 42px; }
        }

        /* Contact list */
        .contact-list {
          background: linear-gradient(180deg, rgba(255,255,255,1), rgba(250,250,250,1));
          border: 1px solid rgba(16,24,40,0.04);
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.035);
          animation: slideInLeft 0.8s ease-out 0.3s both;
        }

        .contact-row {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 14px;
          border-radius: 12px;
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
          cursor: pointer;
          position: relative;
        }

        .contact-row::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, var(--brand-red), rgba(220,38,38,0));
          border-radius: 12px 0 0 12px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .contact-row + .contact-row { margin-top: 10px; }
        .contact-row:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15,23,42,0.06);
          background: rgba(255,255,255,0.9);
        }

        .contact-row:hover::before {
          opacity: 1;
        }

        /* Icon tile */
        .icon-tile {
          min-width: 56px;
          height: 56px;
          border-radius: 12px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          background: linear-gradient(180deg, #fcfcfd, #f7f7f8);
          border: 1px solid rgba(15,23,42,0.03);
          box-shadow: 0 6px 18px rgba(16,24,40,0.03);
          transition: all 0.3s ease;
        }

        .contact-row:hover .icon-tile {
          background: linear-gradient(180deg, rgba(220,38,38,0.05), rgba(220,38,38,0.02));
          transform: scale(1.08);
        }

        .contact-meta { flex: 1; min-width: 0; }
        .contact-title { font-size: 13px; color: #111827; font-weight: 700; margin-bottom: 4px; }
        .contact-value { font-size: 14px; color: #4b5563; line-height: 1.35; word-break: break-word; }

        .contact-arrow { color: rgba(75,85,99,0.45); transition: all 0.3s ease; }
        .contact-row:hover .contact-arrow { 
          color: var(--brand-red);
          transform: translateX(4px);
        }

        /* Form card */
        .form-card {
          position: relative;
          padding: 24px;
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.8));
          border: 1px solid rgba(16,24,40,0.04);
          box-shadow: 0 18px 50px rgba(16,24,40,0.06);
          overflow: hidden;
          animation: slideInRight 0.8s ease-out 0.3s both;
        }

        .form-card::after {
          content: '';
          position: absolute;
          right: -120px;
          top: -60px;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(220,38,38,0.03), transparent 25%),
                      radial-gradient(circle at 70% 70%, rgba(2,132,199,0.02), transparent 25%);
          pointer-events: none;
          transform: rotate(8deg);
        }

        .form-row { display: grid; gap: 14px; grid-template-columns: 1fr; }
        @media (min-width: 640px) {
          .form-row.sm-2 { grid-template-columns: 1fr 1fr; gap: 14px; }
        }

        .field-label { display:block; font-size: 11px; letter-spacing: .6px; color:#374151; margin-bottom:6px; font-weight:700; text-transform:uppercase; }

        .modern-input, .modern-textarea, .modern-select {
          width:100%;
          border-radius:12px;
          padding:12px 14px;
          border:1.5px solid #e6e3df;
          background:#fff;
          transition: box-shadow .16s ease, border-color .16s ease, transform .16s ease;
          font-size:14px;
        }

        .modern-input:focus, .modern-textarea:focus, .modern-select:focus {
          box-shadow: 0 8px 30px rgba(2,6,23,0.06);
          border-color: rgba(17,24,39,0.12);
          outline:none;
          transform: translateY(-2px);
        }

        .form-cta { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:12px; }

        /* Brand-red send button */
        .submit-btn-modern {
          background: linear-gradient(90deg, var(--brand-red), #b91c1c);
          color: #fff;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 700;
          display:inline-flex;
          align-items:center;
          gap:10px;
          border:none;
          transition: transform .14s ease, box-shadow .14s ease, opacity .14s ease;
        }
        .submit-btn-modern:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 34px rgba(220,38,38,0.18);
        }
        .submit-btn-modern:disabled { opacity: .75; cursor: not-allowed; filter: grayscale(.02); }

        .note-small { font-size:12px; color:#6b7280; }

        .success-panel { text-align:center; padding:40px 20px; }

        .muted { color:#6b7280; font-size:13px; }

        /* Section heading animation */
        .section-heading {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .section-subheading {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

      `}</style>

        <div className="min-h-screen bg-white">

          {/* Enhanced Header */}
          <section className="contact-hero relative pt-20 pb-20 lg:pt-15 lg:pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              
              <h1 className="hero-title text-5xl lg:text-7xl font-light mb-6 leading-tight">
                Let's create something
                <span className="gradient-text-accent font-medium"> extraordinary</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl font-light">
                Have a question about PropGrowthX? We'd love to hear from you. Get in touch with our team and let's discuss how we can help accelerate your property investment journey.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="px-6">
          <div className="max-w-6xl mx-auto border-t border-gray-100" />
        </div>

        {/* Main Content */}
        <section className="py-8 lg:py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-1 gap-8">
              <div className="section-heading mb-3">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Get in touch</h2>
                <p className="text-gray-600 text-sm">We're available across multiple channels</p>
              </div>

              <div className="contact-area">
                {/* Left - Contact list */}
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
                        style={{
                          animation: `fadeInUp 0.8s ease-out ${0.35 + (index * 0.08)}s both`
                        }}
                      >
                        <div className="icon-tile" aria-hidden>
                          <Icon className="w-5 h-5" style={{ color: 'var(--brand-red)' }} />
                        </div>

                        <div className="contact-meta">
                          <div className="contact-title">{item.title}</div>
                          <div className="contact-value">{item.value}</div>
                        </div>

                        <div className="contact-arrow" aria-hidden>
                          <ArrowLeft className="w-4 h-4" style={{ transform: 'rotate(180deg)', opacity: 0.6 }} />
                        </div>
                      </a>
                    );
                  })}
                </aside>

                {/* Right - Form card */}
                <main className="form-card" aria-label="Contact form">
                  {isSubmitted ? (
                    <div className="success-panel" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 88, height: 88, borderRadius: 44, background: 'linear-gradient(180deg,#ecfdf5,#eefaf3)' , margin: '0 auto 18px' }}>
                        <CheckCircle2 className="w-10 h-10" style={{ color: '#059669', animation: 'subtleFloat 2.5s ease-in-out infinite' }} />
                      </div>
                      <h3 className="text-[22px] font-semibold tracking-tight text-gray-900 mb-2">Message received</h3>
                      <p className="text-gray-600 mb-5 max-w-md mx-auto text-sm leading-relaxed">
                        Thanks for reaching out. Our team will review your message and get back to you within 24 hours.
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-12 text-sm font-medium transition-all duration-300"
                        >
                          Send another message
                        </button>
                        <button
                          onClick={() => window.location.href = '/dashboard/owner'}
                          className="submit-btn-modern"
                        >
                          Back to dashboard
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} aria-label="Contact form body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Send us a message</div>
                          <div className="muted">Our team typically replies within 24 hours</div>
                        </div>
                      </div>

                      <div className="form-row sm-2">
                        <div>
                          <Label htmlFor="firstName" className="field-label">First name</Label>
                          <Input id="firstName" placeholder="Anand" required className="modern-input" />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="field-label">Last name</Label>
                          <Input id="lastName" placeholder="Sharma" required className="modern-input" />
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
                        <div>
                          <Select>
                            <SelectTrigger className="modern-select" aria-label="Interest select">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent className="rounded-16 border-gray-200">
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
                      </div>

                      <div style={{ marginTop: 14 }}>
                        <Label htmlFor="message" className="field-label">Your message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your property inquiry, timeline, or specific needs..."
                          rows={6}
                          required
                          className="modern-textarea"
                          style={{ resize: 'none' }}
                        />
                      </div>

                      <div className="form-cta">
                        <button
                          type="submit"
                          className="submit-btn-modern"
                          disabled={isSubmitting}
                          aria-busy={isSubmitting}
                          aria-label="Send inquiry"
                        >
                          <Send className="w-4 h-4" style={{ color: '#fff' }} />
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
    </>
  );
};

export default Contact;