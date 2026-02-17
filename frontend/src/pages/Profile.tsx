import { useState,useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  ArrowLeft,
  Save,
  Globe,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useData } from '@/context/dataContext';

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

  closed_relative?:{
    name: string;
    relation: string;
    phone: string;
    address: string;
  }
};



const Profile = () => {
  const {profile,setProfile} = useData();
  const { id } = useParams<{ id: string }>();
  const sessionId = sessionStorage.getItem('id');
  const profileId = id || sessionId;
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    inquiryNotifications: true,
    paymentReminders: true,
    marketUpdates: false,
  });

  const currProfile = profile?.find(p=>p.id === profileId);
  
   useEffect(() => {
  if (currProfile?.id_proof) {
    setIdPreview(currProfile.id_proof);
  }
  }, [currProfile]);

  if (!profileId) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
            <Button asChild>
              <Link to="/auth">Go to Login</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currProfile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading Profile...</h1>
            <p className="text-gray-600">Please wait while we load your profile data.</p>
          </div>
        </div>
      </Layout>
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

      setProfile((prev) =>
        prev.map(p=>
          p.id === profileId ?
           {...p,id_proof: result} : 
           p
        )
         
      );
    }
  };

  reader.readAsDataURL(file);
  e.target.value = '';
};



  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
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
          family_members_details: Array.from(
            { length: count },
            (_, i) =>
              p.family_members_details?.[i] ?? {
                name: '',
                phone: '',
              }
          ),
        };
      }

      return { ...p, [name]: value };
    });
  });
};
  
  const handleClosedRelativeChange = (
    field: 'name' | 'relation' | 'phone' | 'address',
    value: string
  ) => {
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
      setProfile((prev) =>
        prev.map(p=>
          p.id === profileId ?
          {...p,avatar:result} :
          p
        )
      );
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

  if (error) {
    toast.error('Profile not save')
    return;
  }
  toast.success('Profile saved!')
  
  };

  return (
    <>
      <Helmet>
        <title>Profile | PropGrowthX</title>
        <meta
          name="description"
          content="Manage your owner profile, settings, and preferences on PropGrowthX."
        />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');

        .page-title {
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          font-size: 48px;
          font-weight: 400;
          letter-spacing: -1.5px;
          background: linear-gradient(135deg, #1f2937 0%, #dc2626 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          color: #666;
          font-size: 15px;
        }

        .profile-card {
          background: #fff;
          border: 1px solid rgba(220, 38, 38, 0.1);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .profile-card:hover {
          border-color: rgba(220, 38, 38, 0.2);
          box-shadow: 0 12px 24px rgba(220, 38, 38, 0.08);
        }

        .profile-card-header {
          padding: 24px;
          border-bottom: 1px solid rgba(220, 38, 38, 0.08);
          background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(254, 242, 242, 0.5) 100%);
        }

        .profile-card-content {
          padding: 24px;
        }

        .profile-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #dc2626;
        }

        .avatar-container {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid rgba(0, 0, 0, 0.08);
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .avatar-upload-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ff0000;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 3px solid white;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .avatar-upload-btn:hover {
          background: #dc2626;
          transform: scale(1.08);
        }

        /* Ensure number input spin/toggle controls are visible */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: auto !important;
          appearance: auto !important;
          opacity: 1;
        }

        input[type=number] {
          -moz-appearance: textfield; /* allow firefox default */
        }

        /* Placeholder styling: light grey and full opacity */
        input::placeholder {
          color: #9ca3af;
          opacity: 1;
        }

        /* Red Switch toggle styling */
        [role="switch"][aria-checked="true"] {
          background-color: #dc2626 !important;
        }

        /* Fallback for button-based switch */
        button[role="switch"][aria-checked="true"] {
          background-color: #dc2626 !important;
        }
      `}</style>

      <Layout>
        <div className="min-h-screen bg-white">
          {/* Header */}
          <div className="border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <h1 className="page-title mb-1">
                {isOwner ? "Owner Profile" : "Tenant Profile"}
              </h1>
              <p className="page-subtitle">
                Manage your profile and account settings
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-6">
              {/* Avatar & Basic Info */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                  </div>
                  <p className="text-sm text-gray-600">Update your personal details and profile picture</p>
                </div>
                <div className="profile-card-content space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="avatar-container">
                      <div className="avatar-img">
                        {avatarPreview || currProfile?.avatar ? (
                          <img
                            src={avatarPreview || currProfile?.avatar || ''}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <label
                        htmlFor="avatar-upload"
                        className="avatar-upload-btn"
                      >
                        <Camera className="w-5 h-5" />
                      </label>
                      <input
                        disabled={!currRole}
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Profile Photo
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        JPG, GIF or PNG. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Name Fields */}
                  <div className="space-y-2">
                    <label className="profile-label">Full Name</label>
                    <Input
                      disabled={!currRole}
                      name="name"
                      value={currProfile?.name ?? ''}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="border-gray-200"
                    />
                  </div>

                  {/* Contact Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="profile-label flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={currProfile?.email ?? ''}
                        onChange={handleInputChange}
                        disabled
                        className="border-gray-200 bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="profile-label flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <Input
                        disabled={!currRole}
                        name="phone"
                        value={currProfile?.phone ?? ''}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="border-gray-200"
                      />
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
                  {/* Family Count */}
                  <div className="space-y-2 w-40">
                    <label className="profile-label">Family Members</label>
                    <Input
                      disabled={!currRole}
                      type="number"
                      min={0}
                      name="family_members"
                      value={(currProfile?.family_members === undefined || currProfile?.family_members === null || currProfile?.family_members === 0) ? '' : currProfile.family_members}
                      placeholder="0"
                      onChange={handleInputChange}
                      className="border-gray-200"
                    />
                  </div>

                  {/* Family Member Details */}
                  {currProfile?.family_members_details?.map((member, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-4 border-t border-gray-100"
                      >
                        <div className="space-y-2">
                          <label className="profile-label">Member {index + 1} Name</label>
                          <Input
                            disabled={!currRole}
                            type="text"
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...currProfile.family_members_details!];
                              updated[index] = {
                                ...updated[index],
                                name: e.target.value,
                              };
                            
                              setProfile((prev) =>
                            prev.map(p=>
                              p.id === profileId?
                               { ...p, family_members_details: updated } 
                              : p
                            )
                          );
                            }}
                            placeholder="Enter name"
                            className="border-gray-200"
                          />
                        </div>
                          
                        <div className="space-y-2">
                          <label className="profile-label">Member {index + 1} Phone</label>
                          <Input
                            disabled={!currRole}
                            type="tel"
                            value={member.phone ?? ''}
                            onChange={(e) => {
                              const updated = [...currProfile.family_members_details!];
                              updated[index] = {
                                ...updated[index],
                                phone: e.target.value,
                              };
                            
                              setProfile((prev) =>
                            prev.map(p=>
                              p.id === profileId?
                               { ...p, family_members_details: updated } 
                              : p
                            )
                          );
                            }}
                            placeholder="Enter phone number"
                            className="border-gray-200"
                          />
                        </div>
                      </div>
                    ))}

                </div>
              </div>
              )}  

              {/* Address */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Address</h2>
                  </div>
                  <p className="text-sm text-gray-600">Your business address for correspondence</p>
                </div>
                <div className="profile-card-content space-y-4">
                  <div className="space-y-2">
                    <label className="profile-label">Street Address</label>
                    <Input
                      disabled={!currRole}
                      name="address"
                      value={currProfile?.address ?? ''}
                      onChange={handleInputChange}
                      placeholder="Enter street address"
                      className="border-gray-200"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="profile-label">City</label>
                      <Input
                        disabled={!currRole}
                        name="city"
                        value={currProfile?.city ?? ''}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        className="border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="profile-label">State</label>
                      <Input
                        disabled={!currRole}
                        name="state"
                        value={currProfile?.state ?? ''}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        className="border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="profile-label">Zip Code</label>
                      <Input
                        disabled={!currRole}
                        name="zip_code"
                        value={currProfile?.zip_code ?? ''}
                        onChange={handleInputChange}
                        placeholder="Enter zip code"
                        className="border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {isOwner && (
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Business & Social Links</h2>
                  </div>
                  <p className="text-sm text-gray-600">Manage your business identity and social presence</p>
                </div>

                <div className="profile-card-content space-y-4">
                  <div className="space-y-2">
                    <label className="profile-label">Company / Business Name</label>
                    <Input
                      disabled={!currRole}
                      name="company"
                      value={currProfile?.company ?? ''}
                      onChange={handleInputChange}
                      placeholder="Enter business name"
                      className="border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="profile-label">Website</label>
                    <Input
                      disabled={!currRole}
                      name="s_link1"
                      value={currProfile?.s_link1 ?? ''}
                      onChange={handleInputChange}
                      placeholder="https://"
                      className="border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="profile-label">LinkedIn</label>
                    <Input
                      disabled={!currRole}
                      name="s_link2"
                      value={currProfile?.s_link2 ?? ''}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/..."
                      className="border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="profile-label">Instagram / Twitter</label>
                    <Input
                      disabled={!currRole}
                      name="s_link3"
                      value={currProfile?.s_link3 ?? ''}
                      onChange={handleInputChange}
                      placeholder="https://"
                      className="border-gray-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {!isOwner && (
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Tenant Verification Details</h2>
                  </div>
                  <p className="text-sm text-gray-600">Residential history and verification information</p>
                </div>

                <div className="profile-card-content space-y-4">
                  <div className="space-y-2">
                    <label className="profile-label">Past Residence Address</label>
                    <Textarea
                      disabled={!currRole}
                      name="past_residence"
                      value={currProfile?.past_residence ?? ''}
                      onChange={handleInputChange}
                      placeholder="Enter previous residence address"
                      className="border-gray-200"
                    />
                  </div>

                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <label className="profile-label">ID Proof (Aadhaar / PAN / Passport)</label>
                    <Input
                      disabled={!currRole}
                      type="file"
                      accept="image/*"
                      onChange={handleIdProofChange}
                      className="border-gray-200"
                    />
                  
                    {idPreview && (
                      <div className="mt-4">
                        <img
                          src={idPreview}
                          alt="ID Proof Preview"
                          className="w-48 h-auto rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                  

                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <label className="profile-label">Background / Occupation</label>
                    <Textarea
                      disabled={!currRole}
                      name="background"
                      value={currProfile?.background ?? ''}
                      onChange={handleInputChange}
                      placeholder="Student / Job / Business / Other"
                      className="border-gray-200"
                    />
                  </div>

                  <div className="space-y-2 w-40 pt-4 border-t border-gray-100">
                    <label className="profile-label">Family Members</label>
                    <Input
                      disabled={!currRole}
                      type="number"
                      min={0}
                      name="family_members"
                      value={(currProfile?.family_members === undefined || currProfile?.family_members === null || currProfile?.family_members === 0) ? '' : currProfile.family_members}
                      placeholder="0"
                      onChange={handleInputChange}
                      className="border-gray-200"
                    />
                  </div>
                              
                 {currProfile?.family_members_details?.map((member, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-4 border-t border-gray-100"
                  >
                    <div className="space-y-2">
                      <label className="profile-label">Member {index + 1} Name</label>
                      <Input
                        disabled={!currRole}
                        type="text"
                        value={member.name}
                        onChange={(e) => {
                          const updated = [...currProfile.family_members_details!];
                          updated[index] = {
                            ...updated[index],
                            name: e.target.value,
                          };
                        
                          setProfile((prev) =>
                            prev.map(p=>
                              p.id === profileId?
                               { ...p, family_members_details: updated } 
                              : p
                            )
                          );
                        }}
                        placeholder="Enter name"
                        className="border-gray-200"
                      />
                    </div>
                      
                    <div className="space-y-2">
                      <label className="profile-label">Member {index + 1} Phone</label>
                      <Input
                        disabled={!currRole}
                        type="tel"
                        value={member.phone ?? ''}
                        onChange={(e) => {
                          const updated = [...currProfile.family_members_details!];
                          updated[index] = {
                            ...updated[index],
                            phone: e.target.value,
                          };
                        
                          setProfile((prev) =>
                            prev.map(p=>
                              p.id === profileId?
                               { ...p, family_members_details: updated } 
                              : p
                            )
                          );
                        }}
                        placeholder="Enter phone number"
                        className="border-gray-200"
                      />
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}

              {!isOwner && <div className="profile-card">
               <div className="profile-card-header">
                 <div className="flex items-center gap-2 mb-1">
                   <Globe className="w-5 h-5 text-red-600" />
                   <h2 className="text-lg font-semibold text-gray-900">Emergency Contact</h2>
                 </div>
               </div>
             
               <div className="profile-card-content space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                   <div className="space-y-2">
                     <label className="profile-label">Name</label>
                     <Input
                       disabled={!currRole}
                       type="text"
                       value={currProfile?.closed_relative?.name ?? ''}
                       onChange={(e) =>
                         handleClosedRelativeChange('name', e.target.value)
                       }
                       placeholder="Enter name"
                       className="border-gray-200"
                     />
                   </div>
             
                   <div className="space-y-2">
                     <label className="profile-label">Phone</label>
                     <Input
                       disabled={!currRole}
                       type="tel"
                       value={currProfile?.closed_relative?.phone ?? ''}
                       onChange={(e) =>
                         handleClosedRelativeChange('phone', e.target.value)
                       }
                       placeholder="Enter phone number"
                       className="border-gray-200"
                     />
                   </div>
             
                   <div className="space-y-2">
                     <label className="profile-label">Relation</label>
                     <Input
                       disabled={!currRole}
                       type="text"
                       value={currProfile?.closed_relative?.relation ?? ''}
                       onChange={(e) =>
                         handleClosedRelativeChange('relation', e.target.value)
                       }
                       placeholder="Father / Mother / Spouse"
                       className="border-gray-200"
                     />
                   </div>
             
                   <div className="space-y-2 md:col-span-4">
                     <label className="profile-label">Residence Address</label>
                     <Textarea
                       disabled={!currRole}
                       value={currProfile?.closed_relative?.address ?? ''}
                       onChange={(e) =>
                         handleClosedRelativeChange('address', e.target.value)
                       }
                       placeholder="Enter residence address"
                       className="border-gray-200"
                     />
                   </div>
                 </div>
               </div>
             </div>
             }

              {/* Account Settings */}
              {currRole && <div className="profile-card">
                <div className="profile-card-header">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                  </div>
                  <p className="text-sm text-gray-600">Manage your account security and billing</p>
                </div>
                <div className="profile-card-content space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                      <Button asChild variant="outline" className="justify-start h-auto py-5 px-5 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                      <Link to="/security-settings">
                          <Shield className="w-5 h-5 mr-3 text-gray-700 flex-shrink-0" />
                        <div className="text-left">
                            <div className="font-medium text-gray-900 text-sm">Security Settings</div>
                            <div className="text-xs text-gray-600">
                            Password, 2FA, sessions
                          </div>
                        </div>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start h-auto py-4 border-gray-200 hover:bg-gray-50">
                      <Link to="/billing">
                        <CreditCard className="w-5 h-5 mr-3 text-gray-700" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Billing & Payments</div>
                          <div className="text-sm text-gray-600">
                            Payment methods, invoices
                          </div>
                        </div>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start h-auto py-4 border-gray-200 hover:bg-gray-50">
                      <Link to="/property-settings">
                        <Building2 className="w-5 h-5 mr-3 text-gray-700" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Property Settings</div>
                          <div className="text-sm text-gray-600">
                            Default listing preferences
                          </div>
                        </div>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>}

              {/* Notification Settings */}
              {currRole && <div className="profile-card">
                <div className="profile-card-header">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                  </div>
                  <p className="text-sm text-gray-600">Choose how you want to receive notifications</p>
                </div>
                <div className="profile-card-content space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        Email Alerts
                      </div>
                      <div className="text-sm text-gray-600">
                        Receive notifications via email
                      </div>
                    </div>
                    <Switch
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          emailAlerts: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        SMS Alerts
                      </div>
                      <div className="text-sm text-gray-600">
                        Receive notifications via SMS
                      </div>
                    </div>
                    <Switch
                      checked={notifications.smsAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          smsAlerts: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        Property Inquiries
                      </div>
                      <div className="text-sm text-gray-600">
                        Get notified when someone inquires about your property
                      </div>
                    </div>
                    <Switch
                      checked={notifications.inquiryNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          inquiryNotifications: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        Payment Reminders
                      </div>
                      <div className="text-sm text-gray-600">
                        Get reminded about upcoming rent payments
                      </div>
                    </div>
                    <Switch
                      checked={notifications.paymentReminders}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          paymentReminders: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        Market Updates
                      </div>
                      <div className="text-sm text-gray-600">
                        Receive real estate market insights and trends
                      </div>
                    </div>
                    <Switch
                      checked={notifications.marketUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          marketUpdates: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>}

              {/* Save Button */}
              {currRole && <div className="flex justify-end gap-4">
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile;