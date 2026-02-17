import { Helmet } from 'react-helmet-async';
import PropertyFilters from '@/components/properties/PropertyFilters';
import { ArrowLeft, Search } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardSkeleton from './SkeletonLoading';
import { useData } from '@/context/dataContext';
import { PropertyData } from '@/components/dashboard/EditPropertyModal';
import { propertiesData } from '@/context/mockData';

const formatINR = (amount?: number) => {
  if (amount === undefined) return '—';
  return `₹${amount.toLocaleString('en-IN')}`;
};

const ImageCarousel = ({ images, propertyId }: { images: string[]; propertyId: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const scrollBy = (offset: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  if (images.length === 0) {
    return (
      <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-4xl sm:text-5xl text-gray-400">🏢</div>
      </div>
    );
  }

  return (
    <div className="relative h-40 sm:h-48 overflow-hidden">
      <div
        ref={ref}
        className="flex h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {images.map((src, idx) => (
          <div key={idx} className="flex-shrink-0 w-full h-full snap-center">
            <img src={src} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollBy(-320)}
            className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors duration-200 touch-none"
            aria-label="Previous image"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollBy(320)}
            className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors duration-200 touch-none"
            aria-label="Next image"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div key={idx} className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white/60 border border-white/30" />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PropertyCard = ({ property }: { property: PropertyData }) => {
  const navigate = useNavigate();
  const statusColors = {
    Available: 'bg-green-100 text-green-800 border-green-200',
    Occupied: 'bg-blue-100 text-blue-800 border-blue-200',
    Vacant: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full">
      <div className="relative flex-shrink-0">
        <ImageCarousel images={property.images} propertyId={property.id} />
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <span
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold border inline-block ${
              statusColors[property.status]
            }`}
          >
            {property.status}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4 flex-grow-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-1">
              {property.property_name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-1">{property.address}</p>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <div className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">
              {formatINR(property.monthly_rent)}
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">/month</div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 flex-wrap">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2zm0 0V9a2 2 0 012-2h10a2 2 0 012 2v4" />
              </svg>
              <span className="whitespace-nowrap">{property.bedrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4 0h12" />
            </svg>
            <span className="whitespace-nowrap">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2M4 8v8a2 2 0 002 2h12a2 2 0 002-2V8M4 8h16" />
            </svg>
            <span className="whitespace-nowrap">{property.area} sqft</span>
          </div>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button onClick={() => navigate(`/property/${property.id}`)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl py-2 sm:py-2 transition-all duration-200 hover:shadow-lg touch-none">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const Properties = () => {
  const navigate = useNavigate();
   const { properties, transactions, id, loading ,profile} = useData();

  const myProfile = profile?.find(p => p.id === id);
  const myProperties = properties.filter((p) => p.buyer_id === id);
  const myTxs = transactions.filter(t => t.tenant_id === id);
  
  const [filteredProperties, setFilteredProperties] = useState(propertiesData);

    if(loading) return <DashboardSkeleton/>

  const handleFilterChange = (newFilters: Record<string, string>) => {
    let filtered = propertiesData;
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(searchLower) || p.location.toLowerCase().includes(searchLower));
    }
    if (newFilters.type && newFilters.type !== 'all') {
      filtered = filtered.filter((p) => p.type === newFilters.type);
    }
    if (newFilters.price && newFilters.price !== 'all') {
      filtered = filtered.filter((p) => {
        if (newFilters.price === '0-5000') return p.monthly_rent < 5000;
        if (newFilters.price === '5000-10000') return p.monthly_rent >= 5000 && p.monthly_rent < 10000;
        if (newFilters.price === '10000-15000') return p.monthly_rent >= 10000 && p.monthly_rent < 15000;
        if (newFilters.price === '15000-20000') return p.monthly_rent >= 15000 && p.monthly_rent < 20000;
        if (newFilters.price === '20000+') return p.monthly_rent >= 20000;
        return true;
      });
    }
    if (newFilters.bedrooms && newFilters.bedrooms !== 'all') {
      const beds = parseInt(newFilters.bedrooms);
      filtered = filtered.filter((p) => p.bedrooms >= beds);
    }
    if (newFilters.area && newFilters.area !== 'all') {
      filtered = filtered.filter((p) => {
        if (newFilters.area === '0-1000') return p.area < 1000;
        if (newFilters.area === '1000-2000') return p.area >= 1000 && p.area < 2000;
        if (newFilters.area === '2000-3000') return p.area >= 2000 && p.area < 3000;
        if (newFilters.area === '3000+') return p.area >= 3000;
        return true;
      });
    }
    if (newFilters.location && newFilters.location !== 'all') {
      const locationMap: Record<string, string> = {
        panvel: 'Panvel',
        thane: 'Thane',
        dadar: 'Dadar',
        kalyan: 'Kalyan',
        pune: 'Pune',
        mulund: 'Mulund',
      };
      filtered = filtered.filter((p) => p.location.includes(locationMap[newFilters.location]));
    }
    setFilteredProperties(filtered);
  };

  return (
    <>
      <Helmet>
        <title>Explore Properties | PropGrowthX</title>
        <meta name="description" content="Browse verified properties for rent, lease, or sale. Filter by price, location, and amenities with PropGrowthX intelligent property search." />
      </Helmet>
      <div className="min-h-screen bg-white">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');
          :root {
            --brand-red: #DC2626;
            --muted: #6b7280;
            --card-border: rgba(16,24,40,0.06);
            --glass: rgba(255,255,255,0.78);
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .prop-page-title {
            font-family: 'Inter', 'Geist', system-ui, sans-serif;
            font-size: clamp(28px, 3.2vw, 40px);
            font-weight: 500;
            letter-spacing: -0.6px;
            line-height: 1.2;
            color: #0b1220;
            margin: 0;
            animation: slideInLeft 0.7s ease-out 0.1s both;
          }
          .prop-title-accent {
            color: var(--brand-red);
            font-weight: 700;
            animation: slideInRight 0.7s ease-out 0.2s both;
            display: inline-block;
          }
          .prop-container-custom {
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px 32px;
          }
          .prop-header-hero {
            position: relative;
            padding: 32px 40px 36px;
            border-radius: 16px;
            background: linear-gradient(180deg, rgba(220, 38, 38, 0.04), rgba(255, 255, 255, 0.95));
            border: 1px solid rgba(16, 24, 40, 0.06);
            animation: fadeInUp 0.8s ease-out 0s both;
          }
          .prop-header-hero::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 16px;
            pointer-events: none;
            box-shadow: 0 20px 50px rgba(2, 6, 23, 0.05);
          }
          .prop-header-title-row {
            display: flex;
            align-items: flex-start;
            gap: 14px;
          }
          .prop-header-subtitle {
            font-size: 16px;
            color: var(--muted);
            font-weight: 400;
            letter-spacing: 0.2px;
            line-height: 1.6;
            margin-top: 12px;
            animation: fadeInUp 0.8s ease-out 0.25s both;
          }
          .prop-divider-line {
            height: 1px;
            background: linear-gradient(90deg, rgba(220, 38, 38, 0), rgba(220, 38, 38, 0.3) 20%, rgba(220, 38, 38, 0.5) 50%, rgba(220, 38, 38, 0.3) 80%, rgba(220, 38, 38, 0));
            width: 100%;
            margin-top: 22px;
            animation: fadeInUp 0.8s ease-out 0.35s both;
            position: relative;
          }
          .prop-back-btn {
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
          .prop-back-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 28px rgba(2,6,23,0.06);
          }
          .prop-back-btn svg { width: 14px; height: 14px; }
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -50px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(50px, 50px) scale(1.05); }
          }
          .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          <section className="py-10 lg:py-12 bg-gray-50 border-b border-gray-100">
          <div className="prop-container-custom relative z-10">
            <div className="prop-header-section pb-8">
              <div className="prop-header-hero">
                <div className="prop-header-title-row">
                <div className="flex items-start gap-3 mb-6">
                  <button onClick={() => navigate(-1)} className="prop-back-btn" aria-label="Back to dashboard">
                    <ArrowLeft />
                    <span>Back</span>
                  </button>
                </div>
                <div className="prop-header-title-row">
                  <div className="prop-header-title-row">
                <div className="max-w-3xl flex-1">
                  <h1 className="prop-page-title mb-2 text-2xl sm:text-3xl md:text-4xl">
                    Your<br />
                    <span className="prop-title-accent">rented properties</span>
                  </h1>
                      
                  <p className="prop-header-subtitle text-sm sm:text-base">
                    Properties currently linked to your tenant profile
                  </p>
                </div>
              </div>

                </div>
                <div className="prop-divider-line" />
              </div>
              </div>
              </div>

            {myProperties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="animate-in fade-in slide-in-from-bottom duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                <div className="text-4xl mb-2">🏠</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No Active Rentals
                </h3>
                <p className="text-gray-600 text-sm">
                  You currently have no rented properties.
                </p>
              </div>
            )}

          </div>
        </section>
        <section className="relative bg-white pt-8 pb-0 overflow-hidden">
          <div className="prop-container-custom relative z-10">
            <div className="prop-header-section pb-8">
              <div className="prop-header-hero">
                <div className="prop-header-title-row">
                  <div className="max-w-3xl flex-1">
                    <h1 className="prop-page-title mb-3">
                      Explore<br />
                      <span className="prop-title-accent">premium properties</span>
                    </h1>
                    <p className="prop-header-subtitle">
                      Discover verified properties with AI-powered valuations and real-time market insights to find your perfect match.
                    </p>
                  </div>
                </div>
                <div className="prop-divider-line" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-10 lg:py-12 bg-gray-50">
          <div className="prop-container-custom">
            <div className="mb-10 animate-in fade-in slide-in-from-top duration-500">
              <PropertyFilters onFilterChange={handleFilterChange} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Featured Properties</h2>
                <p className="text-gray-600 text-sm">
                  Showing <span className="font-semibold text-red-600">{filteredProperties.length}</span> of <span className="font-semibold">{propertiesData.length}</span> properties
                </p>
              </div>
            </div>
            {filteredProperties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                {filteredProperties.map((property, index) => (
                  <div key={property.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm">
                  Try adjusting your filters to find more properties that match your criteria.
                </p>
              </div>
            )}
            {filteredProperties.length > 0 && (
              <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-10 text-center text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Can't find what you're looking for?</h3>
                <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm md:text-base">
                  Get personalized property recommendations or list your property with PropGrowthX.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button className="px-6 py-2.5 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base">
                    Get Recommendations
                  </button>
                  <button className="px-6 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm text-sm md:text-base">
                    List Property
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Properties;