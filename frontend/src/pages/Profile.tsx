import { useState,useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
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
  const {profile,setProfile,id} = useData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const role = sessionStorage.getItem('role');
  const isOwner = role === 'owner';
  const currProfile = profile?.find(p=>p.id === id);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    inquiryNotifications: true,
    paymentReminders: true,
    marketUpdates: false,
  });

  useEffect(() => {
  if (currProfile?.id_proof) {
    setIdPreview(currProfile.id_proof);
  }
  }, [currProfile]);

const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;

  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const result = reader.result;

    if (typeof result === 'string') {
      setIdPreview(result);

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              id_proof: result,
            }
          : prev
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
      if (p.id !== id) return p;

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
        p.id === id
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

    // ✅ strict type guard
    if (typeof result === 'string') {
      setAvatarPreview(result);
      setProfile((prev) =>
        prev ? { ...prev, avatar: result } : prev
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
      ...profile,
    })
    .eq('id', id);

  setIsLoading(false);

  if (error) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
    return;
  }

  toast({
    title: 'Profile Updated',
    description: 'Your profile has been successfully updated.',
  });
  };

  return (
    <>
      <Helmet>
        <title>Owner Profile | PropGrowthX</title>
        <meta
          name="description"
          content="Manage your owner profile, settings, and preferences on PropGrowthX."
        />
      </Helmet>

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard/owner">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {isOwner ? "Owner Profile" : "Tenant Profile"}
                </h1>
                <p className="text-muted-foreground">
                  Manage your profile and account settings
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Avatar & Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center overflow-hidden border-4 border-secondary/20">
                        {avatarPreview || currProfile?.avatar ? (
                          <img
                            src={avatarPreview || currProfile?.avatar || ''}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center cursor-pointer hover:bg-secondary/90 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Profile Photo
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        JPG, GIF or PNG. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Name Fields */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        name="name"
                        value={currProfile?.name ?? ''}
                        onChange={handleInputChange}
                        placeholder="Enter name"
                      />
                    </div>

                  {/* Contact Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={currProfile?.email ?? ''}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={currProfile?.phone ?? ''}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Family Details
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Family Count */}
                  <div className="space-y-2 w-40">
                    <Label>Family Members</Label>
                    <Input
                      type="number"
                      min={0}
                      name="family_members"
                      value={currProfile?.family_members ?? ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Family Member Details */}
                    {currProfile?.family_members_details?.map((member, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
                      >
                        {/* Name */}
                        <div className="space-y-2">
                          <Label>Family Member {index + 1} Name</Label>
                          <Input
                            type="text"
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...currProfile.family_members_details!];
                              updated[index] = {
                                ...updated[index],
                                name: e.target.value,
                              };
                            
                              setProfile((prev) =>
                                prev ? { ...prev, family_members_details: updated } : prev
                              );
                            }}
                            placeholder="Enter name"
                          />
                        </div>
                          
                        {/* Phone */}
                        <div className="space-y-2">
                          <Label>Family Member {index + 1} Phone</Label>
                          <Input
                            type="tel"
                            value={member.phone ?? ''}
                            onChange={(e) => {
                              const updated = [...currProfile.family_members_details!];
                              updated[index] = {
                                ...updated[index],
                                phone: e.target.value,
                              };
                            
                              setProfile((prev) =>
                                prev ? { ...prev, family_members_details: updated } : prev
                              );
                            }}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                    ))}

                </CardContent>
              </Card>
              )}  

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address
                  </CardTitle>
                  <CardDescription>
                    Your business address for correspondence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={currProfile?.address ?? ''}
                      onChange={handleInputChange}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={currProfile?.city ?? ''}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={currProfile?.state ?? ''}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">Zip Code</Label>
                      <Input
                        id="zip_code"
                        name="zip_code"
                        value={currProfile?.zip_code ?? ''}
                        onChange={handleInputChange}
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Business & Social Links
                  </CardTitle>
                  <CardDescription>
                    Manage your business identity and social presence
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company / Business Name</Label>
                    <Input
                      name="company"
                      value={currProfile?.company ?? ''}
                      onChange={handleInputChange}
                      placeholder="Enter business name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      name="s_link1"
                      value={currProfile?.s_link1 ?? ''}
                      onChange={handleInputChange}
                      placeholder="https://"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      name="s_link2"
                      value={currProfile?.s_link2 ?? ''}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instagram / Twitter</Label>
                    <Input
                      name="s_link3"
                      value={currProfile?.s_link3 ?? ''}
                      onChange={handleInputChange}
                      placeholder="https://"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {!isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Tenant Verification Details
                  </CardTitle>
                  <CardDescription>
                    Residential history and verification information
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Past Residence */}
                  <div className="space-y-2">
                    <Label>Past Residence Address</Label>
                    <Textarea
                      name="past_residence"
                      value={currProfile?.past_residence ?? ''}
                      onChange={handleInputChange}
                      placeholder="Enter previous residence address"
                    />
                  </div>

                  {/* ID Proof */}
                  <div className="space-y-2">
                    <Label>ID Proof (Aadhaar / PAN / Passport)</Label>
                              
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleIdProofChange}
                    />
                  
                    {idPreview && (
                      <div className="mt-2">
                        <img
                          src={idPreview}
                          alt="ID Proof Preview"
                          className="w-48 h-auto rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                  

                  {/* Background */}
                  <div className="space-y-2">
                    <Label>Background / Occupation</Label>
                    <Textarea
                      name="background"
                      value={currProfile?.background ?? ''}
                      onChange={handleInputChange}
                      placeholder="Student / Job / Business / Other"
                    />
                  </div>

                  {/* Family Members */}
                  <div className="space-y-2 w-40">
                    <Label>Family Members</Label>
                    <Input
                      type="number"
                      min={0}
                      name="family_members"
                      value={currProfile?.family_members ?? ''}
                      onChange={handleInputChange}
                    />
                  </div>
                              
                 {/* Family Member Details */}
                {currProfile?.family_members_details?.map((member, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
                  >
                    {/* Name */}
                    <div className="space-y-2">
                      <Label>Family Member {index + 1} Name</Label>
                      <Input
                        type="text"
                        value={member.name}
                        onChange={(e) => {
                          const updated = [...currProfile.family_members_details!];
                          updated[index] = {
                            ...updated[index],
                            name: e.target.value,
                          };
                        
                          setProfile((prev) =>
                            prev ? { ...prev, family_members_details: updated } : prev
                          );
                        }}
                        placeholder="Enter name"
                      />
                    </div>
                      
                    {/* Phone */}
                    <div className="space-y-2">
                      <Label>Family Member {index + 1} Phone</Label>
                      <Input
                        type="tel"
                        value={member.phone ?? ''}
                        onChange={(e) => {
                          const updated = [...currProfile.family_members_details!];
                          updated[index] = {
                            ...updated[index],
                            phone: e.target.value,
                          };
                        
                          setProfile((prev) =>
                            prev ? { ...prev, family_members_details: updated } : prev
                          );
                        }}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                ))}
                </CardContent>
              </Card>
            )}

              {!isOwner && <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Globe className="w-5 h-5" />
                   Emergency Contact
                 </CardTitle>
               </CardHeader>
             
               <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                   {/* Name */}
                   <div className="space-y-2">
                     <Label>Name</Label>
                     <Input
                       type="text"
                       value={currProfile?.closed_relative?.name ?? ''}
                       onChange={(e) =>
                         handleClosedRelativeChange('name', e.target.value)
                       }
                       placeholder="Enter name"
                     />
                   </div>
             
                   {/* Phone */}
                   <div className="space-y-2">
                     <Label>Phone</Label>
                     <Input
                       type="tel"
                       value={currProfile?.closed_relative?.phone ?? ''}
                       onChange={(e) =>
                         handleClosedRelativeChange('phone', e.target.value)
                       }
                       placeholder="Enter phone number"
                     />
                   </div>
             
                   {/* Relation */}
                   <div className="space-y-2">
                     <Label>Relation</Label>
                     <Input
                       type="text"
                       value={currProfile?.closed_relative?.relation ?? ''}
                       onChange={(e) =>
                         handleClosedRelativeChange('relation', e.target.value)
                       }
                       placeholder="Father / Mother / Spouse / Brother"
                     />
                   </div>
             
                   {/* Address */}
                   <div className="space-y-2 md:col-span-4">
                     <Label>Residence Address</Label>
                     <Textarea
                       value={currProfile?.closed_relative?.address ?? ''}
                       onChange={(e) =>
                         handleClosedRelativeChange('address', e.target.value)
                       }
                       placeholder="Enter residence address"
                     />
                   </div>
                 </div>
               </CardContent>
             </Card>
             }


              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        Email Alerts
                      </div>
                      <div className="text-sm text-muted-foreground">
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
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        SMS Alerts
                      </div>
                      <div className="text-sm text-muted-foreground">
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
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        Property Inquiries
                      </div>
                      <div className="text-sm text-muted-foreground">
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
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        Payment Reminders
                      </div>
                      <div className="text-sm text-muted-foreground">
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
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        Market Updates
                      </div>
                      <div className="text-sm text-muted-foreground">
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
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and billing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-auto py-4">
                      <Shield className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Security Settings</div>
                        <div className="text-sm text-muted-foreground">
                          Password, 2FA, sessions
                        </div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-4">
                      <CreditCard className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Billing & Payments</div>
                        <div className="text-sm text-muted-foreground">
                          Payment methods, invoices
                        </div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-4">
                      <Building2 className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Property Settings</div>
                        <div className="text-sm text-muted-foreground">
                          Default listing preferences
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link to="/dashboard/owner">Cancel</Link>
                </Button>
                <Button
                  className="bg-secondary hover:bg-secondary/90"
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
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
