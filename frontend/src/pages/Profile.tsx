import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Camera,
  Bell,
  Shield,
  CreditCard,
  Save,
  Globe,
  Briefcase,
  Menu,
  BarChart3,
  Home,
  DollarSign,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useData } from '@/context/dataContext';
import { useNavigate } from 'react-router-dom';

type family_members_details = {
  name: string;
  phone: string;
};

export type ProfileData = {
  id?: string;
  role?: 'tenant' | 'owner';
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  s_link1: string | null;
  s_link2: string | null;
  s_link3: string | null;
  company?: string | null;
  past_residence?: string | null;
  id_proof?: string | null;
  background?: string | null;
  family_members?: number | null;
  family_members_details?: family_members_details[];
  closed_relative?: {
    name: string;
    relation: string;
    phone: string;
    address: string;
  };
};

const Profile = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useData();
  const { id } = useParams<{ id: string }>();
  const sessionId = sessionStorage.getItem('id');
  const profileId = id || sessionId;
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    inquiryNotifications: true,
    paymentReminders: true,
    marketUpdates: false,
  });

  const currProfile = profile?.find(p => p.id === profileId);

  useEffect(() => {
    if (currProfile?.id_proof) {
      setIdPreview(currProfile.id_proof);
    }
  }, [currProfile]);

  if (!profileId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <Button asChild><Link to="/auth">Go to Login</Link></Button>
        </div>
      </div>
    );
  }

  if (!currProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Profile...</h1>
          <p className="text-gray-600">Please wait while we load your profile data.</p>
        </div>
      </div>
    );
  }

  const isOwner = currProfile.role === 'owner';
  const currRole = sessionStorage.getItem('role') === currProfile.role;

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setIdPreview(result);
        setProfile((prev) => prev.map(p => p.id === profileId ? { ...p, id_proof: result } : p));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      if (!prev) return prev;
      return prev.map((p) => {
        if (p.id !== profileId) return p;
        if (name === 'family_members') {
          const count = Number(value);
          return {
            ...p,
            family_members: count,
            family_members_details: Array.from({ length: count }, (_, i) =>
              p.family_members_details?.[i] ?? { name: '', phone: '' }
            ),
          };
        }
        return { ...p, [name]: value };
      });
    });
  };

  const handleClosedRelativeChange = (field: 'name' | 'relation' | 'phone' | 'address', value: string) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return prev.map((p) =>
        p.id === profileId
          ? {
              ...p,
              closed_relative: {
                name: p.closed_relative?.name ?? '',
                relation: p.closed_relative?.relation ?? '',
                phone: p.closed_relative?.phone ?? '',
                address: p.closed_relative?.address ?? '',
                [field]: value,
              },
            }
          : p
      );
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setAvatarPreview(result);
        setProfile((prev) => prev.map(p => p.id === profileId ? { ...p, avatar: result } : p));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        name: currProfile.name,
        phone: currProfile.phone,
        avatar: currProfile.avatar,
        address: currProfile.address,
        city: currProfile.city,
        state: currProfile.state,
        zip_code: currProfile.zip_code,
        s_link1: currProfile.s_link1,
        s_link2: currProfile.s_link2,
        s_link3: currProfile.s_link3,
        company: currProfile.company,
        past_residence: currProfile.past_residence,
        id_proof: currProfile.id_proof,
        background: currProfile.background,
        family_members: currProfile.family_members,
        family_members_details: currProfile.family_members_details,
        closed_relative: currProfile.closed_relative,
      })
      .eq('id', profileId);
    setIsLoading(false);
    if (error) { toast.error('Profile not saved'); return; }
    toast.success('Profile saved!');
  };

  // ─── Owner mobile nav helper ───
  const ownerMobileGoTo = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <>
      <Helmet>
        <title>Profile | PropGrowthX</title>
        <meta name="description" content="Manage your owner profile, settings, and preferences on PropGrowthX." />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');

        .page-title {
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 400;
          letter-spacing: -1.5px;
          background: linear-gradient(135deg, #1f2937 0%, #dc2626 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .page-subtitle { color: #666; font-size: clamp(13px, 3vw, 15px); }
        .profile-card {
          background: #fff;
          border: 1px solid rgba(220, 38, 38, 0.1);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        .profile-card:hover { border-color: rgba(220, 38, 38, 0.2); box-shadow: 0 12px 24px rgba(220, 38, 38, 0.08); }
        .profile-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(220, 38, 38, 0.08);
          background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(254,242,242,0.5) 100%);
        }
        @media (min-width: 768px) { .profile-card-header { padding: 24px; } }
        .profile-card-content { padding: 16px 20px; }
        @media (min-width: 768px) { .profile-card-content { padding: 24px; } }
        .profile-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #dc2626; }
        .avatar-container { position: relative; width: 100px; height: 100px; }
        @media (min-width: 768px) { .avatar-container { width: 120px; height: 120px; } }
        .avatar-img {
          width: 100%; height: 100%;
          border-radius: 50%;
          border: 4px solid rgba(0,0,0,0.08);
          background: #f5f5f5;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .avatar-upload-btn {
          position: absolute; bottom: 0; right: 0;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #ff0000; color: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: 3px solid white;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        @media (min-width: 768px) { .avatar-upload-btn { width: 40px; height: 40px; } }
        .avatar-upload-btn:hover { background: #dc2626; transform: scale(1.08); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: auto !important; appearance: auto !important; opacity: 1; }
        input[type=number] { -moz-appearance: textfield; }
        input::placeholder { color: #9ca3af; opacity: 1; }
        [role="switch"][aria-checked="true"] { background-color: #dc2626 !important; }
        button[role="switch"][aria-checked="true"] { background-color: #dc2626 !important; }
        @media (max-width: 768px) { .profile-card { border-radius: 12px; margin-bottom: 12px; } .page-title { font-size: 24px; } }
      `}</style>

      <div className="flex h-screen bg-gray-50 overflow-hidden">

        {/* ═══════════════════════════════════
            OWNER SIDEBAR — matches DashboardNav style
            (FontAwesome icons, same nav items, same pattern)
        ═══════════════════════════════════ */}
        {isOwner ? (
          <>
            {/* MOBILE — floating hamburger */}
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

            {/* MOBILE — backdrop */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* MOBILE — full drawer, auto-closes on nav */}
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
                  <OwnerMobileNavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    active={item.id === "profile"}
                    onClick={() => item.path ? ownerMobileGoTo(item.path) : setSidebarOpen(false)}
                  />
                ))}
                <OwnerMobileNavItem
                  label="Logout"
                  icon="fa-sign-out-alt"
                  onClick={() => { sessionStorage.clear(); window.location.href = '/'; }}
                />
              </nav>
              <div className="px-3 py-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
              </div>
            </aside>

            {/* DESKTOP/TABLET — inline sidebar, w-64 ↔ w-20 */}
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
                  <OwnerNavItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    collapsed={!sidebarOpen}
                    active={item.id === "profile"}
                    onClick={item.onClick}
                  />
                ))}
                <OwnerNavItem
                  label="Logout"
                  icon="fa-sign-out-alt"
                  collapsed={!sidebarOpen}
                  onClick={() => { sessionStorage.clear(); window.location.href = '/'; }}
                />
              </nav>
              <div className="px-3 py-4 border-t border-gray-100">
                {sidebarOpen
                  ? <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
                  : <div className="text-center text-xs text-gray-400">©PG</div>
                }
              </div>
            </aside>
          </>
        ) : (
          /* ═══════════════════════════════════
              TENANT SIDEBAR — UNCHANGED (original code preserved exactly)
          ═══════════════════════════════════ */
          <>
            {/* MOBILE-ONLY: floating hamburger button */}
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

            {/* MOBILE-ONLY: backdrop */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/40 z-30 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* MOBILE-ONLY: full drawer */}
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
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close menu">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                <SidebarItem icon={BarChart3} label="Dashboard" onClick={() => { navigate('/dashboard/tenant'); setSidebarOpen(false); }} sidebarOpen />
                <SidebarItem icon={Home} label="My Properties" onClick={() => { navigate('/properties'); setSidebarOpen(false); }} sidebarOpen />
                <SidebarItem icon={DollarSign} label="Transactions" onClick={() => { navigate('/dashboard/tenant/transactions'); setSidebarOpen(false); }} sidebarOpen />
                <SidebarItem icon={FileText} label="Complaints" onClick={() => { navigate('/dashboard/tenant/complaints'); setSidebarOpen(false); }} sidebarOpen />
              </nav>
              <div className="px-2 py-4 border-t border-gray-200 space-y-1">
                <SidebarItem icon={User} label="Profile" active onClick={() => setSidebarOpen(false)} sidebarOpen />
                <SidebarItem icon={HelpCircle} label="Support" onClick={() => { navigate('/dashboard/tenant/support'); setSidebarOpen(false); }} sidebarOpen />
                <SidebarItem icon={Settings} label="Settings" onClick={() => { navigate('/settings'); setSidebarOpen(false); }} sidebarOpen />
                <SidebarItem icon={LogOut} label="Logout" onClick={() => { sessionStorage.clear(); window.location.href = '/'; }} sidebarOpen />
              </div>
            </aside>

            {/* DESKTOP / TABLET SIDEBAR */}
            <aside
              className={`hidden md:flex ${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 z-40 flex-col md:relative flex-shrink-0`}
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
                <SidebarItem icon={BarChart3} label="Dashboard" onClick={() => navigate('/dashboard/tenant')} sidebarOpen={sidebarOpen} />
                <SidebarItem icon={Home} label="My Properties" onClick={() => navigate('/properties')} sidebarOpen={sidebarOpen} />
                <SidebarItem icon={DollarSign} label="Transactions" onClick={() => navigate('/dashboard/tenant/transactions')} sidebarOpen={sidebarOpen} />
                <SidebarItem icon={FileText} label="Complaints" onClick={() => navigate('/dashboard/tenant/complaints')} sidebarOpen={sidebarOpen} />
              </nav>
              <div className="px-2 py-4 border-t border-gray-200 space-y-2">
                <SidebarItem icon={User} label="Profile" active sidebarOpen={sidebarOpen} />
                <SidebarItem icon={HelpCircle} label="Support" onClick={() => navigate('/dashboard/tenant/support')} sidebarOpen={sidebarOpen} />
                <SidebarItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} sidebarOpen={sidebarOpen} />
                <SidebarItem icon={LogOut} label="Logout" onClick={() => { sessionStorage.clear(); window.location.href = '/'; }} sidebarOpen={sidebarOpen} />
              </div>
            </aside>
          </>
        )}

        {/* ─── MAIN CONTENT — unchanged ─── */}
        <main className="flex-1 overflow-y-auto min-w-0 transition-all duration-300">
          <div className="min-h-screen bg-white">
            <div className="border-b border-gray-100">
              <div className={`max-w-4xl mx-auto px-4 py-4 md:py-6 ${!sidebarOpen ? 'pl-16 md:pl-8' : ''}`}>
                <h1 className="page-title mb-1">{isOwner ? 'Owner Profile' : 'Tenant Profile'}</h1>
                <p className="page-subtitle">Manage your profile and account settings</p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="space-y-4 md:space-y-6">

                {/* Avatar & Basic Info */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-5 h-5 text-red-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                    </div>
                    <p className="text-sm text-gray-600">Update your personal details and profile picture</p>
                  </div>
                  <div className="profile-card-content space-y-4 md:space-y-6">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="avatar-container">
                        <div className="avatar-img">
                          {avatarPreview || currProfile?.avatar ? (
                            <img src={avatarPreview || currProfile?.avatar || ''} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 md:w-12 h-8 md:h-12 text-gray-400" />
                          )}
                        </div>
                        <label htmlFor="avatar-upload" className="avatar-upload-btn">
                          <Camera className="w-4 md:w-5 h-4 md:h-5" />
                        </label>
                        <input disabled={!currRole} id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">Profile Photo</h3>
                        <p className="text-sm text-gray-600 mt-1">JPG, GIF or PNG. Max size 2MB.</p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="space-y-2">
                      <label className="profile-label">Full Name</label>
                      <Input disabled={!currRole} name="name" value={currProfile?.name ?? ''} onChange={handleInputChange} placeholder="Enter full name" className="border-gray-200" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="profile-label flex items-center gap-2"><Mail className="w-4 h-4" />Email Address</label>
                        <Input name="email" type="email" value={currProfile?.email ?? ''} onChange={handleInputChange} disabled className="border-gray-200 bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <label className="profile-label flex items-center gap-2"><Phone className="w-4 h-4" />Phone Number</label>
                        <Input disabled={!currRole} name="phone" value={currProfile?.phone ?? ''} onChange={handleInputChange} placeholder="Enter phone number" className="border-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {isOwner && (
                  <div className="profile-card">
                    <div className="profile-card-header">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-5 h-5 text-red-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Family Details</h2>
                      </div>
                    </div>
                    <div className="profile-card-content space-y-4">
                      <div className="space-y-2 w-40">
                        <label className="profile-label">Family Members</label>
                        <Input disabled={!currRole} type="number" min={0} name="family_members"
                          value={currProfile?.family_members === undefined || currProfile?.family_members === null || currProfile?.family_members === 0 ? '' : currProfile.family_members}
                          placeholder="0" onChange={handleInputChange} className="border-gray-200" />
                      </div>
                      {currProfile?.family_members_details?.map((member, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-4 border-t border-gray-100">
                          <div className="space-y-2">
                            <label className="profile-label">Member {index + 1} Name</label>
                            <Input disabled={!currRole} type="text" value={member.name}
                              onChange={(e) => { const updated = [...currProfile.family_members_details!]; updated[index] = { ...updated[index], name: e.target.value }; setProfile((prev) => prev.map((p) => p.id === profileId ? { ...p, family_members_details: updated } : p)); }}
                              placeholder="Enter name" className="border-gray-200" />
                          </div>
                          <div className="space-y-2">
                            <label className="profile-label">Member {index + 1} Phone</label>
                            <Input disabled={!currRole} type="tel" value={member.phone ?? ''}
                              onChange={(e) => { const updated = [...currProfile.family_members_details!]; updated[index] = { ...updated[index], phone: e.target.value }; setProfile((prev) => prev.map((p) => p.id === profileId ? { ...p, family_members_details: updated } : p)); }}
                              placeholder="Enter phone number" className="border-gray-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="flex items-center gap-2 mb-1"><MapPin className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Address</h2></div>
                    <p className="text-sm text-gray-600">Your business address for correspondence</p>
                  </div>
                  <div className="profile-card-content space-y-4">
                    <div className="space-y-2">
                      <label className="profile-label">Street Address</label>
                      <Input disabled={!currRole} name="address" value={currProfile?.address ?? ''} onChange={handleInputChange} placeholder="Enter street address" className="border-gray-200" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2"><label className="profile-label">City</label><Input disabled={!currRole} name="city" value={currProfile?.city ?? ''} onChange={handleInputChange} placeholder="Enter city" className="border-gray-200" /></div>
                      <div className="space-y-2"><label className="profile-label">State</label><Input disabled={!currRole} name="state" value={currProfile?.state ?? ''} onChange={handleInputChange} placeholder="Enter state" className="border-gray-200" /></div>
                      <div className="space-y-2"><label className="profile-label">Zip Code</label><Input disabled={!currRole} name="zip_code" value={currProfile?.zip_code ?? ''} onChange={handleInputChange} placeholder="Enter zip code" className="border-gray-200" /></div>
                    </div>
                  </div>
                </div>

                {isOwner && (
                  <div className="profile-card">
                    <div className="profile-card-header">
                      <div className="flex items-center gap-2 mb-1"><Briefcase className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Business & Social Links</h2></div>
                      <p className="text-sm text-gray-600">Manage your business identity and social presence</p>
                    </div>
                    <div className="profile-card-content space-y-4">
                      <div className="space-y-2"><label className="profile-label">Company / Business Name</label><Input disabled={!currRole} name="company" value={currProfile?.company ?? ''} onChange={handleInputChange} placeholder="Enter business name" className="border-gray-200" /></div>
                      <div className="space-y-2"><label className="profile-label">Website</label><Input disabled={!currRole} name="s_link1" value={currProfile?.s_link1 ?? ''} onChange={handleInputChange} placeholder="https://" className="border-gray-200" /></div>
                      <div className="space-y-2"><label className="profile-label">LinkedIn</label><Input disabled={!currRole} name="s_link2" value={currProfile?.s_link2 ?? ''} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." className="border-gray-200" /></div>
                      <div className="space-y-2"><label className="profile-label">Instagram / Twitter</label><Input disabled={!currRole} name="s_link3" value={currProfile?.s_link3 ?? ''} onChange={handleInputChange} placeholder="https://" className="border-gray-200" /></div>
                    </div>
                  </div>
                )}

                {!isOwner && (
                  <div className="profile-card">
                    <div className="profile-card-header">
                      <div className="flex items-center gap-2 mb-1"><Shield className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Tenant Verification Details</h2></div>
                      <p className="text-sm text-gray-600">Residential history and verification information</p>
                    </div>
                    <div className="profile-card-content space-y-4">
                      <div className="space-y-2"><label className="profile-label">Past Residence Address</label><Textarea disabled={!currRole} name="past_residence" value={currProfile?.past_residence ?? ''} onChange={handleInputChange} placeholder="Enter previous residence address" className="border-gray-200" /></div>
                      <div className="space-y-2 pt-4 border-t border-gray-100">
                        <label className="profile-label">ID Proof (Aadhaar / PAN / Passport)</label>
                        <Input disabled={!currRole} type="file" accept="image/*" onChange={handleIdProofChange} className="border-gray-200" />
                        {idPreview && (<div className="mt-4"><img src={idPreview} alt="ID Proof Preview" className="w-48 h-auto rounded-lg border border-gray-200" /></div>)}
                      </div>
                      <div className="space-y-2 pt-4 border-t border-gray-100"><label className="profile-label">Background / Occupation</label><Textarea disabled={!currRole} name="background" value={currProfile?.background ?? ''} onChange={handleInputChange} placeholder="Student / Job / Business / Other" className="border-gray-200" /></div>
                      <div className="space-y-2 w-40 pt-4 border-t border-gray-100">
                        <label className="profile-label">Family Members</label>
                        <Input disabled={!currRole} type="number" min={0} name="family_members"
                          value={currProfile?.family_members === undefined || currProfile?.family_members === null || currProfile?.family_members === 0 ? '' : currProfile.family_members}
                          placeholder="0" onChange={handleInputChange} className="border-gray-200" />
                      </div>
                      {currProfile?.family_members_details?.map((member, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-4 border-t border-gray-100">
                          <div className="space-y-2"><label className="profile-label">Member {index + 1} Name</label><Input disabled={!currRole} type="text" value={member.name} onChange={(e) => { const updated = [...currProfile.family_members_details!]; updated[index] = { ...updated[index], name: e.target.value }; setProfile((prev) => prev.map((p) => p.id === profileId ? { ...p, family_members_details: updated } : p)); }} placeholder="Enter name" className="border-gray-200" /></div>
                          <div className="space-y-2"><label className="profile-label">Member {index + 1} Phone</label><Input disabled={!currRole} type="tel" value={member.phone ?? ''} onChange={(e) => { const updated = [...currProfile.family_members_details!]; updated[index] = { ...updated[index], phone: e.target.value }; setProfile((prev) => prev.map((p) => p.id === profileId ? { ...p, family_members_details: updated } : p)); }} placeholder="Enter phone number" className="border-gray-200" /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isOwner && (
                  <div className="profile-card">
                    <div className="profile-card-header">
                      <div className="flex items-center gap-2 mb-1"><Globe className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Emergency Contact</h2></div>
                    </div>
                    <div className="profile-card-content space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2"><label className="profile-label">Name</label><Input disabled={!currRole} type="text" value={currProfile?.closed_relative?.name ?? ''} onChange={(e) => handleClosedRelativeChange('name', e.target.value)} placeholder="Enter name" className="border-gray-200" /></div>
                        <div className="space-y-2"><label className="profile-label">Phone</label><Input disabled={!currRole} type="tel" value={currProfile?.closed_relative?.phone ?? ''} onChange={(e) => handleClosedRelativeChange('phone', e.target.value)} placeholder="Enter phone number" className="border-gray-200" /></div>
                        <div className="space-y-2"><label className="profile-label">Relation</label><Input disabled={!currRole} type="text" value={currProfile?.closed_relative?.relation ?? ''} onChange={(e) => handleClosedRelativeChange('relation', e.target.value)} placeholder="Father / Mother / Spouse" className="border-gray-200" /></div>
                        <div className="space-y-2 md:col-span-4"><label className="profile-label">Residence Address</label><Textarea disabled={!currRole} value={currProfile?.closed_relative?.address ?? ''} onChange={(e) => handleClosedRelativeChange('address', e.target.value)} placeholder="Enter residence address" className="border-gray-200" /></div>
                      </div>
                    </div>
                  </div>
                )}

                {currRole && (
                  <div className="profile-card">
                    <div className="profile-card-header">
                      <div className="flex items-center gap-2 mb-1"><Bell className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2></div>
                      <p className="text-sm text-gray-600">Choose how you want to receive notifications</p>
                    </div>
                    <div className="profile-card-content space-y-6">
                      {[
                        { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive notifications via email' },
                        { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive notifications via SMS' },
                        { key: 'inquiryNotifications', label: 'Property Inquiries', desc: 'Get notified when someone inquires about your property' },
                        { key: 'paymentReminders', label: 'Payment Reminders', desc: 'Get reminded about upcoming rent payments' },
                        { key: 'marketUpdates', label: 'Market Updates', desc: 'Receive real estate market insights and trends' },
                      ].map(({ key, label, desc }, i) => (
                        <div key={key}>
                          {i > 0 && <div className="h-px bg-gray-100 mb-6" />}
                          <div className="flex items-center justify-between">
                            <div><div className="font-medium text-gray-900">{label}</div><div className="text-sm text-gray-600">{desc}</div></div>
                            <Switch checked={notifications[key as keyof typeof notifications]} onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currRole && (
                  <div className="profile-card">
                    <div className="profile-card-header">
                      <div className="flex items-center gap-2 mb-1"><Shield className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Account Settings</h2></div>
                      <p className="text-sm text-gray-600">Manage your account security and billing</p>
                    </div>
                    <div className="profile-card-content space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Button asChild variant="outline" className="justify-start h-auto py-5 px-5 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                          <Link to="/security-settings"><Shield className="w-5 h-5 mr-3 text-gray-700 flex-shrink-0" /><div className="text-left"><div className="font-medium text-gray-900 text-sm">Security Settings</div><div className="text-xs text-gray-600">Password, 2FA, sessions</div></div></Link>
                        </Button>
                        <Button asChild variant="outline" className="justify-start h-auto py-4 border-gray-200 hover:bg-gray-50">
                          <Link to="/billing"><CreditCard className="w-5 h-5 mr-3 text-gray-700" /><div className="text-left"><div className="font-medium text-gray-900">Billing & Payments</div><div className="text-sm text-gray-600">Payment methods, invoices</div></div></Link>
                        </Button>
                        <Button asChild variant="outline" className="justify-start h-auto py-4 border-gray-200 hover:bg-gray-50">
                          <Link to="/property-settings"><Building2 className="w-5 h-5 mr-3 text-gray-700" /><div className="text-left"><div className="font-medium text-gray-900">Property Settings</div><div className="text-sm text-gray-600">Default listing preferences</div></div></Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {currRole && (
                  <div className="flex justify-end gap-4">
                    <Button className="bg-red-600 hover:bg-red-700" onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? 'Saving...' : (<><Save className="w-4 h-4 mr-2" />Save Changes</>)}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

// ─── Owner desktop nav item (FontAwesome icons, collapses to icon-only) ───
function OwnerNavItem({ label, icon, collapsed = false, active = false, onClick }: { label: string; icon: string; collapsed?: boolean; active?: boolean; onClick?: () => void }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150
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

// ─── Owner mobile nav item (always shows label) ───
function OwnerMobileNavItem({ label, icon, active = false, onClick }: { label: string; icon: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150
        ${active ? "bg-red-50" : "hover:bg-gray-50"}`}
      aria-label={label}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${active ? "bg-red-100" : "bg-gray-50"}`}>
        <i className={`fas ${icon} text-sm ${active ? "text-red-600" : "text-gray-600"}`}></i>
      </span>
      <span className={`text-sm font-medium ${active ? "text-red-600 font-semibold" : "text-gray-700"}`}>{label}</span>
    </button>
  );
}

// ─── Tenant SidebarItem — UNCHANGED from original ───
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

export default Profile;