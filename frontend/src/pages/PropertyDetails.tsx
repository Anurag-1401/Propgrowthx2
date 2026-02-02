import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Tag,
  Calendar,
  Eye,
  MessageSquare,
  Building2,
  Home,
  CheckCircle,
  Phone,
  Mail,
  Share2,
  Heart,
  Printer,
  Edit,
  Trash2,
  QrCode,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useData } from '@/context/dataContext';
import EditPropertyModal, { PropertyData } from '@/components/dashboard/EditPropertyModal';
import DeletePropertyDialog from '@/components/dashboard/DeletePropertyDialog';
import { generateInvite } from '@/hooks/GenerateInvite';

const PropertyDetails = () => {
  const {properties,profile,setProperties} = useData();
  const { id } = useParams<{ id: string }>();
  const isOwner = sessionStorage.getItem('role') === 'owner';
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);


    const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
  
    return () => clearInterval(interval);
  }, [timeLeft]);


  const handleGenerate = async (propertyId:string,id:string) => {
    setLoading(true);
    try {
      const url = await generateInvite(propertyId,id);
      setInviteUrl(url);
      setTimeLeft(600);
    } catch (err) {
      alert('Failed to generate invite');
    } finally {
      setLoading(false);
    }
  };

  const property = id ? properties.find(p => p.id === id) : null;

  if (!property) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
    return type === 'For Sale' ? formatted : `${formatted}/mo`;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'For Sale':
        return <Badge className="bg-success text-primary-foreground">{type}</Badge>;
      case 'For Rent':
        return <Badge className="bg-secondary text-secondary-foreground">{type}</Badge>;
      case 'For Lease':
        return <Badge className="bg-warning text-foreground">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="border-success text-success">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-warning text-warning">Pending</Badge>;
      case 'rented':
        return <Badge variant="outline" className="border-secondary text-secondary">Rented</Badge>;
      case 'sold':
        return <Badge variant="outline" className="border-primary text-primary">Sold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEditClick = (property: PropertyData) => {
      setSelectedProperty(property);
      setIsEditModalOpen(true);
    };

    const handleDeleteClick = (property: PropertyData) => {
        setSelectedProperty(property);
        setIsDeleteDialogOpen(true);
      };

    const handlePropertyUpdated = (updatedProperty: PropertyData) => {
    setProperties(prev => 
      prev.map(p => p.id === updatedProperty.id ? updatedProperty : p)
    );
  };

  const handlePropertyDeleted = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  return (
    <>
      <Helmet>
        <title>{property.property_name} | PropGrowthX</title>
        <meta
          name="description"
          content={`${property.property_name} - ${property.bedrooms} bed, ${property.bathrooms} bath, ${property.total_area} sqft ${property.listing_type} ${property.property_type} in ${property.address}`}
        />
      </Helmet>

      <EditPropertyModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        property={selectedProperty}
        onPropertyUpdated={handlePropertyUpdated}
      />

      <DeletePropertyDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        property={selectedProperty}
        onPropertyDeleted={handlePropertyDeleted}
      />

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Carousel */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {property.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video">
                            <img
                              src={image}
                              alt={`${property.property_name} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                              {index + 1} / {property.images.length}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                </div>

                {/* Property Header */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getTypeBadge(property.property_type)}
                    {getStatusBadge(property.status)}
                    <Badge variant="outline">{property.listing_type}</Badge>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {property.property_type}
                  </h1>

                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}, {property.city}, {property.state} {property.zip_code}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{property.total_area.toLocaleString()} sqft</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Listed {new Date(property.since).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Tag className="w-5 h-5 text-secondary" />
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(property.monthly_rent, property.property_type)}
                    </span>
                  </div>
                </div>

                {/* Tabs for Details */}
                <Tabs defaultValue="overview" className="bg-card border border-border rounded-2xl">
                  <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent px-6 py-4"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="amenities"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent px-6 py-4"
                    >
                      Amenities
                    </TabsTrigger>
                    <TabsTrigger
                      value="location"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent px-6 py-4"
                    >
                      Location
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-6 mt-0">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Description</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {property.description}
                    </p>

                    <h3 className="text-lg font-semibold text-foreground mb-4">Property Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Building2 className="w-5 h-5 text-secondary" />
                        <div>
                          <div className="text-xs text-muted-foreground">Category</div>
                          <div className="font-medium text-foreground">{property.listing_type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Bed className="w-5 h-5 text-secondary" />
                        <div>
                          <div className="text-xs text-muted-foreground">Bedrooms</div>
                          <div className="font-medium text-foreground">{property.bedrooms}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Bath className="w-5 h-5 text-secondary" />
                        <div>
                          <div className="text-xs text-muted-foreground">Bathrooms</div>
                          <div className="font-medium text-foreground">{property.bathrooms}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Square className="w-5 h-5 text-secondary" />
                        <div>
                          <div className="text-xs text-muted-foreground">Area</div>
                          <div className="font-medium text-foreground">{property.total_area.toLocaleString()} sqft</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Eye className="w-5 h-5 text-secondary" />
                        <div>
                          <div className="text-xs text-muted-foreground">Views</div>
                          <div className="font-medium text-foreground">{property.views}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-secondary" />
                        <div>
                          <div className="text-xs text-muted-foreground">Inquiries</div>
                          <div className="font-medium text-foreground">{property.inquiries}</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="amenities" className="p-6 mt-0">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Amenities & Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="p-6 mt-0">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Location</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">Full Address</div>
                          <div className="text-muted-foreground">
                            {property.address}<br />
                            {property.city}, {property.state} {property.zip_code}
                          </div>
                        </div>
                      </div>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Map integration coming soon</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a href={`mailto:${profile.find(p=>p.id === property.owner_id)?.email}`}>
                    <Button className="w-full bg-secondary hover:bg-secondary/90">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Owner
                    </Button>
                    </a>
                    <Button variant="outline" className="w-full" onClick={() => setIsFavorite(!isFavorite)}>
                      <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
                      {isFavorite ? 'Saved' : 'Save Property'}
                    </Button>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" className="flex-1" size="sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                    {isOwner && <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" size="sm"
                        onClick={() => handleEditClick(property)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" className="flex-1 text-destructive" size="sm"
                        onClick={() => handleDeleteClick(property)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>}
                  </CardContent>
                </Card>

                {isOwner && <div className="space-y-4">

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Invite Tenant</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">

                    <Button onClick={()=>handleGenerate(id,property.owner_id)} disabled={loading}
                    className="w-full bg-secondary hover:bg-secondary/90">
                      <QrCode className="w-4 h-4 mr-2" />
                      {loading ? 'Generating...' : 'Generate QR'}
                    </Button>
                          
                {inviteUrl && (
                <div className="flex flex-col items-center space-y-2">
                  <QRCodeCanvas value={inviteUrl} size={200} />

                  {timeLeft !== null && timeLeft > 0 ? (
                    <p className="text-sm text-gray-600">
                      Expires in{' '}
                      <span className="font-semibold text-black">
                        {formatTime(timeLeft)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-red-500 font-semibold">
                      QR Expired
                    </p>
                  )}
                </div>
              )}

                </CardContent>
                </Card>
              </div>}

                {/* Owner Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={()=>navigate(`/profile/${property.owner_id}`,{state : {fromProperty:true}})}>
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Home className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{profile.find(p=>p.id === property.owner_id)?.name}</div>
                        <div className="text-sm text-muted-foreground">Property Owner</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{profile.find(p=>p.id === property.owner_id)?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{profile.find(p=>p.id === property.owner_id)?.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {isOwner && property.buyer_id && <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tenant Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={()=>navigate(`/profile/${property.buyer_id}`,{state : {fromProperty:true}})}>
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Home className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{profile.find(p=>p.id === property.buyer_id)?.name}</div>
                        <div className="text-sm text-muted-foreground">Property Tenant</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{profile.find(p=>p.id === property.buyer_id)?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{profile.find(p=>p.id === property.buyer_id)?.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>}


                {/* Property Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Property Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Past Tenants</span>
                        <span className="font-semibold text-foreground">{property?.past ?? 'NA'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Inquiries</span>
                        <span className="font-semibold text-foreground">{property?.inquiries ?? 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Days Listed</span>
                        <span className="font-semibold text-foreground">
                        {property?.since
                                ? Math.floor(
                                    (Date.now() - new Date(property.since).getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  )
                                : 'NA'}                        
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Price per sqft</span>
                        <span className="font-semibold text-foreground">
                        {property?.monthly_rent && property?.total_area
                                ? `Rs. ${Math.round(
                                    property.monthly_rent / property.total_area
                                  ).toLocaleString()}`
                                : 'NA'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PropertyDetails;
