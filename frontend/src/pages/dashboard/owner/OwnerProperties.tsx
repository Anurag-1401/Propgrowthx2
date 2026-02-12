import React, { useEffect, useRef, useState } from "react";
import AddPropertyModal from "@/components/dashboard/AddPropertyModal";
import DashboardSkeleton from "@/pages/SkeletonLoading";
import { useData } from "@/context/dataContext";
import Layout from "@/components/layout/Layout";
import EditPropertyModal, { PropertyData } from "@/components/dashboard/EditPropertyModal";
import DeletePropertyDialog from "@/components/dashboard/DeletePropertyDialog";
import PropertyAnalyticsModal from "@/components/dashboard/PropertyAnalyticsModal";
import { useNavigate } from "react-router-dom";

type PropertyRecord = {
  id: string;
  name: string;
  listingType: "For Rent" | "For Sale";
  category: string;
  status: string;
  rentPerMonth?: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number;
  otherRooms?: number;
  floors?: number;
  description?: string;
  amenities?: string[];
  images?: { id: string; url: string; name: string }[];
  createdAt: string;
};

const BRAND = "#DC2626";

interface ExtendedPropertyData extends PropertyData {
  listedDate: string;
  images:string[]
}

export default function PropertiesPage() {
  const {properties,setProperties,id,loading} = useData();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<ExtendedPropertyData | null>(null);


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

  const filtered = ownerProp.filter((p) => {
    const q = query.trim().toLowerCase();
    if (q) {
      if (!`${p.property_name} ${p.city} ${p.state}`.toLowerCase().includes(q)) return false;
    }
    if (typeFilter !== "All Types" && p.listing_type !== typeFilter) return false;
    if (statusFilter !== "All Status" && p.status !== statusFilter) return false;
    return true;
  });

  if(loading) return <DashboardSkeleton/>

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 mt-5">

      {/* Header - BALANCED COMPACT */}
      <div className="bg-white border-b border-gray-100">
       <div className="px-4 sm:px-6 md:px-8 py-3">
          <div className="flex items-center justify-between">

            
            <div className="flex items-center gap-3">
             {/* Back Button – anchored to viewport */}
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-white/95 backdrop-blur-sm border border-gray-200
                           text-gray-700 hover:bg-white hover:text-gray-900
                           shadow-md hover:shadow-lg transition-all duration-200 text-sm"
              >
                <i className="fas fa-arrow-left w-4 h-4"></i>
                <span className="font-medium">Back</span>
              </button>

              {/* <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="PropGrowthX Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Properties</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block -mt-1">Manage your portfolio</p>
              </div> */}
            </div>
            
            <div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #B91C1C 100%)` }}
            >
              <i className="fas fa-plus text-xs sm:text-sm"></i>
              <span className="hidden sm:inline">Add Property</span>
              <span className="sm:hidden">Add</span>
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-3 px-4 sm:px-6 md:px-8">
          {/* Mobile Layout */}
          <div className="xs:hidden space-y-2.5">
            {/* Search */}
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200 text-xs"
              />
            </div>

            {/* Filters & View Toggle Row */}
            <div className="flex gap-2 items-center">
              <select 
                className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-xs font-medium focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200"
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option>All Types</option>
                <option>For Rent</option>
                <option>For Sale</option>
              </select>

              <select 
                className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-xs font-medium focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200"
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Available</option>
                <option>Occupied</option>
                <option>Vacant</option>
                <option>Under Maintenance</option>
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1 flex-shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-2.5 py-2.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Grid view"
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-2.5 py-2.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="List view"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Tablet & Desktop Layout */}
          <div className="hidden xs:flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <i className="fas fa-search absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search properties..."
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Filters & View Toggle */}
            <div className="flex gap-2 sm:gap-3 items-center">
              <select 
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-medium focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200"
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option>All Types</option>
                <option>For Rent</option>
                <option>For Sale</option>
              </select>

              <select 
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-medium focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200"
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Available</option>
                <option>Occupied</option>
                <option>Vacant</option>
                <option>Under Maintenance</option>
              </select>

              <div className="flex bg-gray-100 rounded-lg sm:rounded-xl p-1 flex-shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2.5 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Grid view"
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2.5 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="List view"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        {filtered.length === 0 ? (
          <EmptyState onAddProperty={() => setModalOpen(true)} />
        ) : viewMode === "grid" ? (
          <PropertyGrid properties={filtered} />
        ) : (
          <PropertyList properties={filtered} />
        )}
      </div>

      {/* Modal */}
      <AddPropertyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
    </Layout>
  );
}

function EmptyState({ onAddProperty }: { onAddProperty: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 sm:p-12 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <i className="fas fa-building text-2xl sm:text-3xl text-gray-400"></i>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
        Start building your portfolio by adding your first property. Track rent, manage tenants, and optimize your investments.
      </p>
      <button
        onClick={onAddProperty}
        className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
        style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #B91C1C 100%)` }}
      >
        <i className="fas fa-plus text-sm"></i>
        Add Your First Property
      </button>
    </div>
  );
}

function PropertyGrid({ properties }: { properties: ExtendedPropertyData[] }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}


function PropertyCard({ property }: { property: ExtendedPropertyData }) {
  const statusColors = {
    Available: "bg-green-100 text-green-800",
    Occupied: "bg-blue-100 text-blue-800",
    Vacant: "bg-yellow-100 text-yellow-800",
    "Under Maintenance": "bg-red-100 text-red-800",
  };
  const {properties,setProperties,id,loading} = useData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<ExtendedPropertyData | null>(null);
  const navigate = useNavigate();

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

  return (
    <>
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      {/* Image */}
      <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0]} alt={property.property_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="fas fa-building text-3xl sm:text-4xl text-gray-400"></i>
          </div>
        )}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[property.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
            {property.listing_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200 text-sm sm:text-base line-clamp-2">
          {property.property_name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-1">
          {property.address}, {property.city}
        </p>

        <div className="flex items-baseline justify-between mb-3">
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            {property.monthly_rent ? `₹${property.monthly_rent.toLocaleString()}` : "—"}
            {property.listing_type === "For Rent" && property.monthly_rent && <span className="text-xs sm:text-sm font-normal text-gray-600">/mo</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <i className="fas fa-bed text-xs"></i>
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-bath text-xs"></i>
            <span>{property.bathrooms}</span>
          </div>
          {property.total_area && (
            <div className="flex items-center gap-1">
              <i className="fas fa-ruler-combined text-xs"></i>
              <span>{property.total_area} sqft</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <button onClick={(e)=>handleEditClick(property)}
          className="flex-1 px-3 py-2 sm:py-2.5 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
            Edit
          </button>
          <button onClick={(e)=>handleDeleteClick(property)} className="flex-1 px-3 py-2 sm:py-2.5 rounded-lg text-white text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-lg" style={{ background: BRAND }}>
            Delete
          </button>
          <button onClick={() => navigate(`/property/${property.id}`)}
          className="flex-1 px-3 py-2 sm:py-2.5 rounded-lg text-white text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-lg" style={{ background: BRAND }}>
            View Details
          </button>
        </div>
      </div>
    </div>
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
</>
  );
}

function PropertyList({ properties }: { properties: ExtendedPropertyData[] }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900">Property</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900 hidden xs:table-cell">Type</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900">Rent</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900 hidden sm:table-cell">Status</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900 hidden md:table-cell">Details</th>
              <th className="text-right py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((property) => (
              <PropertyRow key={property.id} property={property} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PropertyRow({ property }: { property: ExtendedPropertyData }) {
  const statusColors = {
    Available: "bg-green-100 text-green-800",
    Occupied: "bg-blue-100 text-blue-800", 
    Vacant: "bg-yellow-100 text-yellow-800",
    "Under Maintenance": "bg-red-100 text-red-800",
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
            {property.images && property.images.length > 0 ? (
              <img src={property.images[0]} alt={property.property_name} className="w-full h-full object-cover" />
            ) : (
              <i className="fas fa-building text-gray-400"></i>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 line-clamp-1 text-xs sm:text-sm">{property.property_name}</div>
            <div className="text-xs text-gray-600 line-clamp-1">{property.address}, {property.city}</div>
          </div>
        </div>
      </td>
      <td className="py-3 sm:py-4 px-4 sm:px-6 hidden xs:table-cell text-gray-600 text-xs sm:text-sm">{property.listing_type}</td>
      <td className="py-3 sm:py-4 px-4 sm:px-6">
        <div className="font-semibold text-gray-900 whitespace-nowrap text-xs sm:text-sm">
          {property.monthly_rent ? `₹${property.monthly_rent.toLocaleString()}` : "—"}
        </div>
        {property.listing_type === "For Rent" && property.monthly_rent && (
          <div className="text-xs text-gray-600">per month</div>
        )}
      </td>
      <td className="py-3 sm:py-4 px-4 sm:px-6 hidden sm:table-cell">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block ${statusColors[property.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
          {property.status}
        </span>
      </td>
      <td className="py-3 sm:py-4 px-4 sm:px-6 hidden md:table-cell text-gray-600 text-xs sm:text-sm">
        {property.bedrooms} bed • {property.bathrooms} bath
        {property.total_area && ` • ${property.total_area} sqft`}
      </td>
      <td className="py-3 sm:py-4 px-4 sm:px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
            Edit
          </button>
          <button className="px-3 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium transition-all duration-200" style={{ background: BRAND }}>
            View
          </button>
        </div>
      </td>
    </tr>
  );
}
