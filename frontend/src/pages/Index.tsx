import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
// import PropertyCard from '@/components/properties/PropertyCard';
import { Link, replace, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, BarChart3, Shield } from 'lucide-react';
import { useEffect } from 'react';

const featuredProperties = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    location: 'San Francisco, CA',
    price: 850000,
    type: 'buy' as const,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    isNew: true,
  },
  {
    id: '2',
    title: 'Luxury Beachfront Villa',
    location: 'Miami, FL',
    price: 2500000,
    type: 'buy' as const,
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Cozy Studio Apartment',
    location: 'New York, NY',
    price: 3500,
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
    location: 'Austin, TX',
    price: 8500,
    type: 'lease' as const,
    bedrooms: 0,
    bathrooms: 2,
    area: 3200,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
];

const analyticsHighlights = [
  {
    icon: TrendingUp,
    title: 'Market Trends',
    description: 'Real-time price movements and demand patterns across neighborhoods.',
  },
  {
    icon: BarChart3,
    title: 'Price Predictions',
    description: 'ML models analyzing 50+ parameters for accurate valuations.',
  },
  {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Comprehensive investment risk scoring based on market data.',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
      if (!token) {
        navigate('/auth', { replace: true });
      }
    }, [token, navigate]);

    if (!token) return null;
  
  return (
    <>
      <Helmet>
        <title>PropGrowthX | Data-Driven Real Estate Platform</title>
        <meta
          name="description"
          content="Make smarter property decisions with PropGrowthX. ML-powered price predictions, verified properties, and transparent transactions for buying, selling, renting, or investing."
        />
      </Helmet>

      <Layout>
        {/* Hero */}
        <HeroSection />

        {/* Features */}
        <FeaturesSection />

        {/* Featured Properties */}
        {/* <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-medium mb-4">
                  Featured Listings
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Discover Top Properties
                </h2>
              </div>
              <Button variant="outline" asChild>
                <Link to="/properties">
                  View All Properties
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </section> */}

        {/* Analytics Preview */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-medium mb-4">
                  Analytics & Insights
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Make Informed Decisions with{' '}
                  <span className="text-secondary">Real-Time Data</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Our analytics engine processes millions of data points to deliver actionable insights for your real estate investments.
                </p>

                <div className="space-y-6">
                  {analyticsHighlights.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button asChild className="mt-8 bg-secondary hover:bg-secondary/90">
                  <Link to="/analytics">
                    Explore Analytics
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Analytics Preview Card */}
              <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Market Performance
                  </h3>
                  <span className="text-sm text-success font-medium">+12.4% YTD</span>
                </div>
                
                {/* Simulated Chart */}
                <div className="h-48 relative mb-6">
                  <svg viewBox="0 0 400 150" className="w-full h-full">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(221, 83%, 53%)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(221, 83%, 53%)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,120 Q50,110 100,90 T200,70 T300,50 T400,30"
                      fill="none"
                      stroke="hsl(221, 83%, 53%)"
                      strokeWidth="3"
                    />
                    <path
                      d="M0,120 Q50,110 100,90 T200,70 T300,50 T400,30 L400,150 L0,150 Z"
                      fill="url(#chartGradient)"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">$485</div>
                    <div className="text-xs text-muted-foreground">Avg. Price/sqft</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">24</div>
                    <div className="text-xs text-muted-foreground">Days on Market</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">98%</div>
                    <div className="text-xs text-muted-foreground">Sale/List Ratio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
