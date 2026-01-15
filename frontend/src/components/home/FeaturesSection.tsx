import { 
  Building2, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Users, 
  Zap,
  MapPin,
  LineChart
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Building2,
      title: 'Property Discovery',
      description: 'Browse verified properties with detailed analytics, photos, and market comparisons.',
    },
    {
      icon: TrendingUp,
      title: 'ML Price Prediction',
      description: 'Our algorithms analyze 50+ parameters to predict accurate property valuations.',
    },
    {
      icon: BarChart3,
      title: 'Market Analytics',
      description: 'Real-time insights on price trends, locality performance, and investment potential.',
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'End-to-end encrypted transactions with complete documentation transparency.',
    },
    {
      icon: MapPin,
      title: 'Location Intelligence',
      description: 'GIS-powered location analysis with infrastructure, connectivity, and growth metrics.',
    },
    {
      icon: LineChart,
      title: 'Investment Advisory',
      description: 'Data-backed recommendations for portfolio diversification and ROI optimization.',
    },
    {
      icon: Users,
      title: 'Owner & Tenant Portals',
      description: 'Dedicated dashboards for property management, payments, and communications.',
    },
    {
      icon: Zap,
      title: 'Instant Valuations',
      description: 'Get property valuations in seconds using our trained machine learning models.',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need for{' '}
            <span className="text-secondary">Smart Real Estate</span> Decisions
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform combines advanced technology with real estate expertise to deliver unmatched insights and seamless transactions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-secondary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
