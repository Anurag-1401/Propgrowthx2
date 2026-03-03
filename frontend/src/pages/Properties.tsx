import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Menu,
  BarChart3,
  Home,
  DollarSign,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  FileCheck,
  AlertCircle,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/dataContext';

const registeredProperty = {
  id: '1',
  title: 'Modern Downtown Loft',
  location: 'Panvel, Maharashtra',
  address: '123 Main Street, Panvel, Maharashtra 410206',
  monthly_rent: 8500,
  bedrooms: 2,
  bathrooms: 2,
  area: 1200,
  images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
  status: 'Active',
  moveInDate: '2023-06-15',
  leaseEndDate: '2025-06-14',
  propertyType: 'Apartment',
  floor: '5',
  totalFloors: '10',
  furnished: 'Semi-Furnished',
  parking: 'Yes (2 slots)',
  amenities: ['Swimming Pool', 'Gym', 'Security', 'Lift', 'Visitor Parking', 'CCTV'],
  owner: {
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@example.com',
    address: 'Same as property',
  },
  documents: [
    { name: 'Lease Agreement', uploadDate: '2023-06-01', verified: true },
    { name: 'Property Photos', uploadDate: '2023-06-01', verified: true },
    { name: 'ID Proof', uploadDate: '2023-06-01', verified: true },
  ],
  maintenanceCharges: 800,
  securityDeposit: 25500,
  registrationNumber: 'PROP-2023-001234',
};

const Properties = () => {
  const navigate = useNavigate();
  const { id, loading } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile: closed by default
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  // Handle screen resize for sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // mobile: closed
      } else {
        setSidebarOpen(true);  // desktop: open (collapsible)
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  const formatINR = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <>
      <Helmet>
        <title>My Property | PropGrowthX</title>
        <meta name="description" content="View details of your registered rental property." />
      </Helmet>

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

        {/* ─── MOBILE-ONLY: full-width drawer (slides in from left) ─── */}
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
            <SidebarItem icon={BarChart3}  label="Dashboard"     sidebarOpen onClick={() => { navigate('/dashboard/tenant'); setSidebarOpen(false); }} />
            <SidebarItem icon={Home}       label="My Properties" sidebarOpen active onClick={() => setSidebarOpen(false)} />
            <SidebarItem icon={DollarSign} label="Transactions"  sidebarOpen onClick={() => { navigate('/dashboard/tenant/transactions'); setSidebarOpen(false); }} />
            <SidebarItem icon={FileText}   label="Complaints"    sidebarOpen onClick={() => { navigate('/dashboard/tenant/complaints'); setSidebarOpen(false); }} />
          </nav>
          <div className="px-2 py-4 border-t border-gray-200 space-y-1">
            <SidebarItem icon={User}       label="Profile"  sidebarOpen onClick={() => {navigate(`/profile/${id}`); setSidebarOpen(false); }} />
            <SidebarItem icon={HelpCircle} label="Support"  sidebarOpen onClick={() => { navigate('/dashboard/tenant/support'); setSidebarOpen(false); }} />
            <SidebarItem icon={Settings}   label="Settings" sidebarOpen onClick={() => setSidebarOpen(false)} />
            <SidebarItem icon={LogOut}     label="Logout"   sidebarOpen onClick={() => { sessionStorage.clear(); window.location.href = '/'; }} />
          </div>
        </aside>

        {/* ─── DESKTOP / TABLET SIDEBAR (hidden on mobile) ─── */}
        <aside
          className={`hidden md:flex ${sidebarOpen ? 'w-64' : 'w-20'}
            bg-white border-r border-gray-200 transition-all duration-300
            flex-col md:relative flex-shrink-0 z-40`}
        >
          <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
            {sidebarOpen ? (
              <div className="flex items-center gap-3 flex-1">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 flex-shrink-0" />
                <span className="text-lg font-bold text-gray-900 whitespace-nowrap">PropGrowthX</span>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Expand sidebar"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                aria-label="Collapse sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
          <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
            <SidebarItem icon={BarChart3}  label="Dashboard"     sidebarOpen={sidebarOpen} onClick={() => navigate('/dashboard/tenant')} />
            <SidebarItem icon={Home}       label="My Properties" sidebarOpen={sidebarOpen} active />
            <SidebarItem icon={DollarSign} label="Transactions"  sidebarOpen={sidebarOpen} onClick={() => navigate('/dashboard/tenant/transactions')} />
            <SidebarItem icon={FileText}   label="Complaints"    sidebarOpen={sidebarOpen} onClick={() => navigate('/dashboard/tenant/complaints')} />
          </nav>
          <div className="px-2 py-4 border-t border-gray-200 space-y-2">
            <SidebarItem icon={User}       label="Profile"  sidebarOpen={sidebarOpen} onClick={() => navigate(`/profile/${id}`)} />
            <SidebarItem icon={HelpCircle} label="Support"  sidebarOpen={sidebarOpen} onClick={() => navigate('/dashboard/tenant/support')} />
            <SidebarItem icon={Settings}   label="Settings" sidebarOpen={sidebarOpen} />
            <SidebarItem icon={LogOut}     label="Logout"   sidebarOpen={sidebarOpen} onClick={() => { sessionStorage.clear(); window.location.href = '/'; }} />
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="min-h-screen bg-white">
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');
              :root { --brand-red: #DC2626; --muted: #6b7280; }
              @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
              @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
              .page-title { font-family: 'Inter','Geist',system-ui,sans-serif; font-size: clamp(24px,5vw,56px); font-weight: 400; letter-spacing: -1.5px; line-height: 1.1; color: #0b1220; margin: 0; animation: slideInLeft 0.7s ease-out 0.1s both; }
              .title-accent { color: var(--brand-red); font-weight: 700; animation: slideInRight 0.7s ease-out 0.2s both; display: inline-block; }
              .container-custom { max-width: 1400px; margin: 0 auto; padding: 16px 20px; }
              @media (min-width: 768px) { .container-custom { padding: 24px 32px; } }
              @media (max-width: 767px) { .container-custom { padding: 56px 16px 16px; } } /* extra top padding for floating button */
              @media (max-width: 640px) { .container-custom { padding: 56px 16px 16px; } }
              .header-hero { position: relative; padding: 20px 24px 24px; border-radius: 16px; background: linear-gradient(180deg,#FFF5F5 0%,#FFE4E6 100%); border: 1px solid rgba(220,38,38,0.12); animation: fadeInUp 0.8s ease-out 0s both; }
              @media (min-width: 768px) { .header-hero { padding: 32px 40px 36px; border-radius: 20px; } }
              @media (max-width: 640px) { .header-hero { padding: 16px 18px 20px; border-radius: 12px; } }
              .header-hero::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; box-shadow: 0 20px 50px rgba(2,6,23,0.05); }
              .header-subtitle { font-size: clamp(13px,3vw,16px); color: var(--muted); font-weight: 400; letter-spacing: 0.2px; line-height: 1.6; margin-top: 8px; animation: fadeInUp 0.8s ease-out 0.25s both; }
              @media (max-width: 640px) { .header-subtitle { font-size: 12px; margin-top: 6px; line-height: 1.5; } }
              .divider-line { height: 1px; background: linear-gradient(90deg,rgba(220,38,38,0),rgba(220,38,38,0.3) 20%,rgba(220,38,38,0.5) 50%,rgba(220,38,38,0.3) 80%,rgba(220,38,38,0)); width: 100%; margin-top: 16px; animation: fadeInUp 0.8s ease-out 0.35s both; }
              @media (max-width: 640px) { .divider-line { margin-top: 12px; } }
              .back-btn { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.78); border: 1px solid rgba(2,6,23,0.06); border-radius: 8px; padding: 8px 12px; cursor: pointer; transition: transform .16s ease,box-shadow .16s ease; backdrop-filter: blur(8px); font-weight: 600; font-size: 13px; color: #0b1220; animation: slideInLeft 0.7s ease-out 0s both; }
              @media (max-width: 640px) { .back-btn { padding: 6px 10px; font-size: 12px; } }
              .back-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(2,6,23,0.06); }
              .back-btn svg { width: 12px; height: 12px; }
              .section-card { background: white; border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; overflow: hidden; transition: all 0.2s ease; margin-bottom: 16px; }
              @media (min-width: 768px) { .section-card { border-radius: 16px; margin-bottom: 24px; } }
              @media (max-width: 640px) { .section-card { border-radius: 10px; margin-bottom: 12px; } }
              .section-header { padding: 14px 16px; background: linear-gradient(180deg,#fff,#fbfbfd); border-bottom: 1px solid rgba(0,0,0,0.04); cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
              @media (min-width: 768px) { .section-header { padding: 20px 24px; } }
              @media (max-width: 640px) { .section-header { padding: 12px 14px; } }
              .section-header:hover { background: linear-gradient(180deg,#fbfbfd,#f7f8fb); }
              .section-header h3 { margin: 0; font-weight: 600; font-size: clamp(14px,3vw,16px); color: #0b1220; }
              @media (max-width: 640px) { .section-header h3 { font-size: 13px; } }
              .section-content { padding: 16px; }
              @media (min-width: 768px) { .section-content { padding: 24px; } }
              @media (max-width: 640px) { .section-content { padding: 12px; } }
              .info-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
              @media (min-width: 640px) { .info-grid { grid-template-columns: repeat(2,1fr); } }
              @media (min-width: 1024px) { .info-grid { grid-template-columns: repeat(auto-fit,minmax(250px,1fr)); gap: 24px; } }
              @media (max-width: 640px) { .info-grid { gap: 12px; } }
              .info-item { display: flex; gap: 12px; }
              @media (max-width: 640px) { .info-item { gap: 10px; } }
              .info-icon { flex-shrink: 0; width: 36px; height: 36px; border-radius: 8px; background: rgba(220,38,38,0.1); display: flex; align-items: center; justify-content: center; color: var(--brand-red); }
              @media (min-width: 768px) { .info-icon { width: 40px; height: 40px; border-radius: 10px; } }
              @media (max-width: 640px) { .info-icon { width: 32px; height: 32px; } }
              .info-icon svg { width: 18px; height: 18px; }
              @media (min-width: 768px) { .info-icon svg { width: 20px; height: 20px; } }
              @media (max-width: 640px) { .info-icon svg { width: 16px; height: 16px; } }
              .info-content h4 { margin: 0; font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
              .info-content p { margin: 3px 0 0 0; font-size: clamp(14px,3vw,16px); font-weight: 600; color: #0b1220; word-break: break-word; }
              @media (max-width: 640px) { .info-content h4 { font-size: 10px; } .info-content p { font-size: 13px; margin-top: 2px; } }
              .badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
              @media (max-width: 640px) { .badges { gap: 6px; margin-top: 10px; } }
              .badge { display: inline-flex; align-items: center; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; background: rgba(220,38,38,0.1); color: var(--brand-red); border: 1px solid rgba(220,38,38,0.2); }
              @media (max-width: 640px) { .badge { padding: 5px 8px; font-size: 10px; } }
              .property-image { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 16px; }
              @media (min-width: 768px) { .property-image { height: 300px; border-radius: 12px; margin-bottom: 24px; } }
              @media (max-width: 640px) { .property-image { height: 160px; border-radius: 8px; margin-bottom: 12px; } }
              .property-title { font-size: clamp(18px,4vw,24px); font-weight: 700; color: #0b1220; margin: 0 0 8px 0; }
              @media (max-width: 640px) { .property-title { font-size: 16px; margin-bottom: 6px; } }
              .property-address { font-size: clamp(13px,3vw,15px); color: #6b7280; display: flex; align-items: flex-start; gap: 8px; margin-bottom: 16px; }
              @media (min-width: 768px) { .property-address { margin-bottom: 24px; } }
              @media (max-width: 640px) { .property-address { font-size: 12px; margin-bottom: 12px; } }
              .property-address svg { width: 16px; height: 16px; margin-top: 2px; flex-shrink: 0; }
              @media (max-width: 640px) { .property-address svg { width: 14px; height: 14px; } }
              .property-specs-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
              @media (min-width: 640px) { .property-specs-grid { grid-template-columns: repeat(3,1fr); gap: 12px; } }
              @media (min-width: 768px) { .property-specs-grid { gap: 16px; } }
              @media (max-width: 640px) { .property-specs-grid { gap: 8px; } }
              .spec-box { padding: 12px; background: #f9fafb; border-radius: 10px; border: 1px solid rgba(0,0,0,0.04); }
              @media (min-width: 768px) { .spec-box { padding: 16px; } }
              @media (max-width: 640px) { .spec-box { padding: 10px; border-radius: 8px; } }
              .spec-label { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
              @media (max-width: 640px) { .spec-label { font-size: 9px; margin-bottom: 4px; } }
              .spec-value { font-size: clamp(14px,3vw,18px); font-weight: 700; color: #0b1220; }
              @media (max-width: 640px) { .spec-value { font-size: 13px; } }
              .document-list { display: flex; flex-direction: column; gap: 10px; }
              @media (min-width: 768px) { .document-list { gap: 12px; } }
              @media (max-width: 640px) { .document-list { gap: 8px; } }
              .document-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f9fafb; border-radius: 8px; border: 1px solid rgba(0,0,0,0.04); gap: 12px; }
              @media (min-width: 768px) { .document-item { padding: 14px 16px; border-radius: 10px; } }
              @media (max-width: 640px) { .document-item { padding: 10px; border-radius: 8px; gap: 8px; } }
              .document-name { display: flex; align-items: flex-start; gap: 8px; flex: 1; min-width: 0; }
              @media (max-width: 640px) { .document-name { gap: 6px; } }
              .document-name svg { width: 16px; height: 16px; margin-top: 2px; flex-shrink: 0; }
              @media (min-width: 768px) { .document-name svg { width: 18px; height: 18px; } }
              @media (max-width: 640px) { .document-name svg { width: 14px; height: 14px; margin-top: 1px; } }
              .document-info p { margin: 0; }
              .document-info p:first-child { font-size: clamp(13px,3vw,14px); font-weight: 600; color: #0b1220; }
              .document-info p:last-child { font-size: 11px; color: #6b7280; margin-top: 2px; }
              @media (max-width: 640px) { .document-info p:first-child { font-size: 12px; } .document-info p:last-child { font-size: 10px; margin-top: 1px; } }
              .document-status { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #10b981; flex-shrink: 0; }
              @media (min-width: 768px) { .document-status { font-size: 12px; gap: 6px; } }
              @media (max-width: 640px) { .document-status { font-size: 10px; gap: 3px; } }
              .document-status svg { width: 14px; height: 14px; }
              @media (min-width: 768px) { .document-status svg { width: 16px; height: 16px; } }
              @media (max-width: 640px) { .document-status svg { width: 12px; height: 12px; } }
              .financial-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
              @media (min-width: 640px) { .financial-grid { grid-template-columns: repeat(2,1fr); } }
              @media (min-width: 768px) { .financial-grid { grid-template-columns: repeat(3,1fr); gap: 16px; } }
              @media (max-width: 640px) { .financial-grid { gap: 10px; } }
              .financial-card { padding: 14px; border-radius: 10px; border: 1px solid; }
              @media (min-width: 768px) { .financial-card { padding: 16px; border-radius: 12px; } }
              @media (max-width: 640px) { .financial-card { padding: 12px; border-radius: 8px; } }
              .financial-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
              @media (max-width: 640px) { .financial-label { font-size: 10px; margin-bottom: 6px; } }
              .financial-value { font-size: clamp(16px,4vw,20px); font-weight: 800; }
              @media (max-width: 640px) { .financial-value { font-size: 15px; } }
              .alert-box { padding: 12px; border-radius: 10px; border: 1px solid; margin-top: 12px; }
              @media (min-width: 768px) { .alert-box { padding: 16px; border-radius: 12px; margin-top: 16px; } }
              @media (max-width: 640px) { .alert-box { padding: 10px; border-radius: 8px; margin-top: 10px; } }
              .alert-content { display: flex; gap: 10px; }
              @media (max-width: 640px) { .alert-content { gap: 8px; } }
              .alert-content svg { width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px; }
              @media (min-width: 768px) { .alert-content svg { width: 20px; height: 20px; } }
              @media (max-width: 640px) { .alert-content svg { width: 16px; height: 16px; margin-top: 1px; } }
              .alert-text p { margin: 0; }
              .alert-text p:first-child { font-size: clamp(13px,3vw,14px); font-weight: 700; margin-bottom: 4px; }
              .alert-text p:last-child { font-size: 12px; margin-top: 6px; }
              @media (max-width: 640px) { .alert-text p:first-child { font-size: 12px; margin-bottom: 3px; } .alert-text p:last-child { font-size: 11px; margin-top: 3px; } }
            `}</style>

            <section className="relative bg-white pt-4 md:pt-8 pb-0 overflow-hidden">
              <div className="container-custom relative z-10">
                <div className="pb-0 md:pb-0">
                  <div className="header-hero">
                    <div className="max-w-3xl">
                      <h1 className="page-title mb-2 md:mb-3"><span className="title-accent">Registered Property</span></h1>
                      <p className="header-subtitle">View complete details of your registered property including lease information, owner contact, amenities, and important documents.</p>
                    </div>
                    <div className="divider-line" />
                  </div>
                </div>
              </div>
            </section>

            <section className="py-0 md:py-0 bg-gray-50">
              <div className="container-custom">
                <img src={registeredProperty.images[0]} alt={registeredProperty.title} className="property-image" />

                <div className="section-card">
                  <div className="section-content">
                    <h2 className="property-title">{registeredProperty.title}</h2>
                    <div className="property-address"><MapPin /><span>{registeredProperty.address}</span></div>
                    <div className="info-grid mb-6 md:mb-8">
                      <div className="info-item"><div className="info-icon"><DollarSign /></div><div className="info-content"><h4>Monthly Rent</h4><p>{formatINR(registeredProperty.monthly_rent)}</p></div></div>
                      <div className="info-item"><div className="info-icon"><Calendar /></div><div className="info-content"><h4>Move In Date</h4><p>{new Date(registeredProperty.moveInDate).toLocaleDateString()}</p></div></div>
                      <div className="info-item"><div className="info-icon"><Calendar /></div><div className="info-content"><h4>Lease Ends</h4><p>{new Date(registeredProperty.leaseEndDate).toLocaleDateString()}</p></div></div>
                      <div className="info-item"><div className="info-icon"><Home /></div><div className="info-content"><h4>Status</h4><p>{registeredProperty.status}</p></div></div>
                    </div>
                    <div className="property-specs-grid">
                      <div className="spec-box"><p className="spec-label">Bedrooms</p><p className="spec-value">{registeredProperty.bedrooms}</p></div>
                      <div className="spec-box"><p className="spec-label">Bathrooms</p><p className="spec-value">{registeredProperty.bathrooms}</p></div>
                      <div className="spec-box"><p className="spec-label">Area</p><p className="spec-value">{registeredProperty.area} sqft</p></div>
                      <div className="spec-box"><p className="spec-label">Type</p><p className="spec-value">{registeredProperty.propertyType}</p></div>
                      <div className="spec-box"><p className="spec-label">Floor</p><p className="spec-value">{registeredProperty.floor}/{registeredProperty.totalFloors}</p></div>
                      <div className="spec-box"><p className="spec-label">Furnished</p><p className="spec-value">{registeredProperty.furnished}</p></div>
                    </div>
                  </div>
                </div>

                <div className="section-card">
                  <div className="section-header" onClick={() => toggleSection('amenities')}>
                    <h3>Amenities & Features</h3>
                    <svg className={`w-4 h-4 md:w-5 md:h-5 transition-transform flex-shrink-0 ${expandedSections.has('amenities') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                  {expandedSections.has('amenities') && (
                    <div className="section-content border-t border-gray-100">
                      <div className="badges">{registeredProperty.amenities.map((a, i) => <div key={i} className="badge">{a}</div>)}</div>
                      <div className="alert-box bg-blue-50 border-blue-100"><p className="text-xs md:text-sm text-blue-800"><strong>Parking:</strong> {registeredProperty.parking}</p></div>
                    </div>
                  )}
                </div>

                <div className="section-card">
                  <div className="section-header" onClick={() => toggleSection('financial')}>
                    <h3>Financial Details</h3>
                    <svg className={`w-4 h-4 md:w-5 md:h-5 transition-transform flex-shrink-0 ${expandedSections.has('financial') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                  {expandedSections.has('financial') && (
                    <div className="section-content border-t border-gray-100">
                      <div className="financial-grid">
                        <div className="financial-card bg-gradient-to-br from-red-50 to-orange-50 border-red-100"><p className="financial-label text-gray-600">Monthly Rent</p><p className="financial-value text-red-600">{formatINR(registeredProperty.monthly_rent)}</p></div>
                        <div className="financial-card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100"><p className="financial-label text-gray-600">Maintenance</p><p className="financial-value text-blue-600">{formatINR(registeredProperty.maintenanceCharges)}/m</p></div>
                        <div className="financial-card bg-gradient-to-br from-green-50 to-emerald-50 border-green-100"><p className="financial-label text-gray-600">Security Deposit</p><p className="financial-value text-green-600">{formatINR(registeredProperty.securityDeposit)}</p></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="section-card">
                  <div className="section-header" onClick={() => toggleSection('owner')}>
                    <h3>Property Owner Details</h3>
                    <svg className={`w-4 h-4 md:w-5 md:h-5 transition-transform flex-shrink-0 ${expandedSections.has('owner') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                  {expandedSections.has('owner') && (
                    <div className="section-content border-t border-gray-100">
                      <div className="info-grid">
                        <div className="info-item"><div className="info-icon"><User /></div><div className="info-content"><h4>Owner Name</h4><p>{registeredProperty.owner.name}</p></div></div>
                        <div className="info-item"><div className="info-icon"><Phone /></div><div className="info-content"><h4>Phone Number</h4><p><a href={`tel:${registeredProperty.owner.phone}`} className="text-red-600 hover:text-red-700 break-all">{registeredProperty.owner.phone}</a></p></div></div>
                        <div className="info-item"><div className="info-icon"><Mail /></div><div className="info-content"><h4>Email Address</h4><p><a href={`mailto:${registeredProperty.owner.email}`} className="text-red-600 hover:text-red-700 break-all">{registeredProperty.owner.email}</a></p></div></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="section-card">
                  <div className="section-header" onClick={() => toggleSection('documents')}>
                    <h3>Documents & Verification</h3>
                    <svg className={`w-4 h-4 md:w-5 md:h-5 transition-transform flex-shrink-0 ${expandedSections.has('documents') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                  {expandedSections.has('documents') && (
                    <div className="section-content border-t border-gray-100">
                      <div className="document-list">
                        {registeredProperty.documents.map((doc, idx) => (
                          <div key={idx} className="document-item">
                            <div className="document-name"><FileCheck className="text-gray-400" /><div className="document-info"><p>{doc.name}</p><p>Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</p></div></div>
                            {doc.verified && <div className="document-status"><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg><span>Verified</span></div>}
                          </div>
                        ))}
                      </div>
                      <div className="alert-box bg-green-50 border-green-100">
                        <div className="alert-content"><AlertCircle className="text-green-600" /><div className="alert-text"><p className="text-green-900">Registration ID: {registeredProperty.registrationNumber}</p><p className="text-green-700">All documents are verified and your property registration is complete.</p></div></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

const IconOnlyBtn = ({ icon: Icon, label, active = false, onClick }: { icon: React.ElementType; label: string; active?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} title={label} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${active ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
    <Icon className="w-5 h-5" />
  </button>
);

const SidebarItem = ({ icon: Icon, label, active = false, onClick, sidebarOpen = true }: { icon: React.ElementType; label: string; active?: boolean; onClick?: () => void; sidebarOpen?: boolean }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-base ${active ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50 font-medium'}`} title={!sidebarOpen ? label : ''}>
    <Icon className="w-6 h-6 flex-shrink-0" />
    {sidebarOpen && <span>{label}</span>}
  </button>
);

export default Properties;