import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import PropertyCard from '../components/properties/PropertyCart';
import PropertyFilters from '@/components/properties/PropertyFilters';

const properties = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    location: 'Panvel, Maharashtra',
    monthly_rent: 8500,
    type: 'rent' as const,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    isNew: true,
  },
  {
    id: '2',
    title: 'Luxury Beachfront Villa',
    location: 'Panvel, Maharashtra',
    monthly_rent: 25000,
    type: 'rent' as const,
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Cozy Studio Apartment',
    location: 'Panvel, Maharashtra',
    monthly_rent: 3500,
    type: 'rent' as const,
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    isNew: true,
  },
  {
    id: '4',
    title: 'Commercial Office Space',
    location: 'Thane, Maharashtra',
    monthly_rent: 8500,
    type: 'lease' as const,
    bedrooms: 0,
    bathrooms: 2,
    area: 3200,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    title: 'Suburban Family Home',
    location: 'Thane, Maharashtra',
    monthly_rent: 12000,
    type: 'rent' as const,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    title: 'Penthouse Suite',
    location: 'Dadar, Maharashtra',
    monthly_rent: 15000,
    type: 'rent' as const,
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    isNew: true,
  },
  {
    id: '7',
    title: 'Historic Brownstone',
    location: 'Kalyan, Maharashtra',
    monthly_rent: 18000,
    type: 'rent' as const,
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '8',
    title: 'Retail Storefront',
    location: 'Kalyan, Maharashtra',
    monthly_rent: 5500,
    type: 'lease' as const,
    bedrooms: 0,
    bathrooms: 1,
    area: 1800,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '9',
    title: 'Mountain View Cabin',
    location: 'Pune, Maharashtra',
    monthly_rent: 4500,
    type: 'rent' as const,
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '10',
    title: 'Urban Micro-Apartment',
    location: 'Pune, Maharashtra',
    monthly_rent: 5800,
    type: 'rent' as const,
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '11',
    title: 'Waterfront Condo',
    location: 'Pune, Maharashtra',
    monthly_rent: 9500,
    type: 'rent' as const,
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    isNew: true,
  },
  {
    id: '12',
    title: 'Industrial Warehouse',
    location: 'Mulund, Maharashtra',
    monthly_rent: 12000,
    type: 'lease' as const,
    bedrooms: 0,
    bathrooms: 2,
    area: 8000,
    image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80',
  },
];

const Properties = () => {
  return (
    <>
      <Helmet>
        <title>Explore Properties | PropGrowthX</title>
        <meta
          name="description"
          content="Browse verified properties for sale, rent, or lease. Filter by price, location, and more with PropGrowthX's intelligent property search."
        />
      </Helmet>

      <Layout>
        {/* Header */}
        <section className="bg-gradient-to-br from-primary to-secondary py-16 lg:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Explore Properties
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Discover verified properties with detailed analytics, ML-powered valuations, and comprehensive market data.
              </p>
            </div>
          </div>
        </section>

        {/* Filters & Properties */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="container-custom">
            {/* Filters */}
            <div className="mb-8">
              <PropertyFilters />
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{properties.length}</span> properties
              </p>
            </div>

            {/* Properties Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Properties;
