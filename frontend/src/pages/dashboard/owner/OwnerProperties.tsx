import { useState,useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  MapPin,
  Bed,
  Bath,
  Square,
  Search,
  ArrowLeft,
  MoreVertical,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddPropertyModal from '@/components/dashboard/AddPropertyModal';
import EditPropertyModal, { PropertyData } from '@/components/dashboard/EditPropertyModal';
import DeletePropertyDialog from '@/components/dashboard/DeletePropertyDialog';
import PropertyAnalyticsModal from '@/components/dashboard/PropertyAnalyticsModal';
import { useData } from '@/context/dataContext';
import DashboardSkeleton from '@/pages/SkeletonLoading';

interface ExtendedPropertyData extends PropertyData {
  listedDate: string;
  images:string[]
}

const OwnerProperties = () => {
  const {properties,setProperties,id,loading} = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<ExtendedPropertyData | null>(null);
   
  if(loading) return <DashboardSkeleton/>

  const handleEditClick = (property: ExtendedPropertyData) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (property: ExtendedPropertyData) => {
    setSelectedProperty(property);
    setIsDeleteDialogOpen(true);
  };

  const handleAnalyticsClick = (property: ExtendedPropertyData) => {
    setSelectedProperty(property);
    setIsAnalyticsModalOpen(true);
  };

  const handlePropertyUpdated = (updatedProperty: PropertyData) => {
    setProperties(prev => 
      prev.map(p => p.id === updatedProperty.id ? { ...p, ...updatedProperty } : p)
    );
  };

  const handlePropertyDeleted = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };


const extendedProperties: ExtendedPropertyData[] = properties.map(
  (property) => ({
    ...property,
    listedDate:
      (property as ExtendedPropertyData).listedDate ??
      property.created_at ??
      new Date().toISOString(),

    images:
      (property as ExtendedPropertyData).images ??
      [],
  })
);

const ownerProp = extendedProperties.filter((prop) => prop.owner_id === id);

 const filteredProperties = ownerProp.filter((property) => {
  const name = property.property_name || "";        // fallback to empty string
  const location = property.city || ""; // fallback to empty string

  const matchesSearch =
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesType = filterType === "all" || property.property_type === filterType;
  const matchesStatus = filterStatus === "all" || property.status === filterStatus;

  return matchesSearch && matchesType && matchesStatus;
});


  const stats = {
    total: ownerProp.length,
    active: ownerProp.filter(p => p.status === 'active').length,
    rented: ownerProp.filter(p => p.status === 'rented').length,
    sold: ownerProp.filter(p => p.status === 'sold').length,
    totalValue: ownerProp.reduce((sum, p) => sum, 0),
  };

  return (
    <>
      <Helmet>
        <title>My Properties | PropGrowthX Owner Dashboard</title>
        <meta
          name="description"
          content="View and manage all your properties in one place. Track listings, performance, and manage your real estate portfolio."
        />
      </Helmet>

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom">
            {/* Back Link */}
            <Link
              to="/dashboard/owner"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  My Properties
                </h1>
                <p className="text-muted-foreground">
                  Manage and monitor all your property listings
                </p>
              </div>
              <Button 
                className="bg-secondary hover:bg-secondary/90"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Property
              </Button>
            </div>

            <AddPropertyModal 
              open={isAddModalOpen} 
              onOpenChange={setIsAddModalOpen}
            />

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

            <PropertyAnalyticsModal
              open={isAnalyticsModalOpen}
              onOpenChange={setIsAnalyticsModalOpen}
              property={selectedProperty}
            />

            {/* Quick Stats */}
            {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Properties</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="text-2xl font-bold text-success">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="text-2xl font-bold text-secondary">{stats.rented}</div>
                <div className="text-sm text-muted-foreground">Currently Rented</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">{stats.sold}</div>
                <div className="text-sm text-muted-foreground">Sold</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 col-span-2 md:col-span-1">
                <div className="text-2xl font-bold text-foreground">${(stats.totalValue / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Portfolio Value</div>
              </div>
            </div> */}

            {/* Filters */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                    <SelectItem value="For Lease">For Lease</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[200px]">Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Beds/Baths</TableHead>
                      <TableHead className="text-center">Rooms/Floors</TableHead>
                      <TableHead className="text-center">Area</TableHead>
                      {/* <TableHead className="text-center">Views</TableHead> */}
                      <TableHead className="text-center">Inquiries</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id} 
                        className="cursor-pointer hover:bg-muted/30 transition"
                        onClick={() => navigate(`/property/${property.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <img
                              src={
                              property.images && property.images.length > 0
                                ? property.images[0]
                                : "/placeholder-property.jpg"
                            }
                              alt={property.property_name}
                              className="w-16 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium text-foreground">
                                {property.property_name}
                              </div>
                              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {property.city}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{property.property_type}</TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {property.monthly_rent ? property.monthly_rent.toLocaleString() : 0}
                          {property.listing_type !== 'For Sale' && <span className="text-muted-foreground font-normal">/mo</span>}
                        </TableCell>
                        <TableCell>{property.status}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              {property.bedrooms}
                            </span>
                            <span>/</span>
                            <span className="flex items-center gap-1">
                              {property.bathrooms}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              {property.otherrooms}
                            </span>
                            <span>/</span>
                            <span className="flex items-center gap-1">
                              {property.floors}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          {property.total_area ? property.total_area.toLocaleString() : "0"} sqft
                          </div>
                        </TableCell>
                        {/* <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            {property.views}
                          </div>
                        </TableCell> */}
                        <TableCell className="text-center font-medium">
                          {0}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleAnalyticsClick(property)}
                              >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem> */}
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={(e) => {
                                e.stopPropagation()
                                handleEditClick(property)
                                }
                              }
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Property
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer text-destructive"
                                 onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(property)
                                }
                              }
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredProperties.length === 0 && (
                <div className="p-12 text-center">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No properties found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OwnerProperties;
