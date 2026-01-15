import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Shield, CheckCircle2, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    { value: '15K+', label: 'Properties Listed' },
    { value: '98%', label: 'Prediction Accuracy' },
    { value: '$2.5B', label: 'Transaction Volume' },
    { value: '12K+', label: 'Happy Clients' },
  ];

  const trustIndicators = [
    { icon: BarChart3, text: 'ML-Powered Pricing' },
    { icon: Shield, text: 'Verified Properties' },
    { icon: CheckCircle2, text: 'Transparent Transactions' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary min-h-[90vh] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-custom relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-primary-foreground animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Real Estate Platform</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Data-Driven Real Estate Decisions for{' '}
              <span className="text-secondary">Smarter Growth</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl">
              Leverage machine learning algorithms and comprehensive market analytics to buy, sell, rent, or invest in properties with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Button
                size="lg"
                asChild
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/properties">
                  Explore Properties
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20"
              >
                <Link to="/analytics">View Analytics</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6">
              {trustIndicators.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <item.icon className="w-5 h-5 text-secondary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 animate-slide-up delay-200">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-6 lg:p-8 text-center hover:bg-primary-foreground/15 transition-colors"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
