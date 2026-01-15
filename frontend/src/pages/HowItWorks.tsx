import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Upload,
  Database,
  Brain,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Search,
  BarChart3,
  FileCheck,
} from 'lucide-react';

const HowItWorks = () => {
  const ownerSteps = [
    {
      icon: Upload,
      title: 'Upload Your Property',
      description: 'Add property details, photos, and documentation through our intuitive owner dashboard.',
    },
    {
      icon: Database,
      title: 'Data Processing',
      description: 'Our system validates, enriches, and indexes your property data for optimal visibility.',
    },
    {
      icon: Brain,
      title: 'ML Price Prediction',
      description: 'Get instant, accurate price recommendations based on 50+ market parameters.',
    },
    {
      icon: FileCheck,
      title: 'Verification & Listing',
      description: 'After verification, your property goes live with verified badge and analytics.',
    },
    {
      icon: CreditCard,
      title: 'Transaction Execution',
      description: 'Secure, transparent transactions with complete documentation and tracking.',
    },
    {
      icon: CheckCircle2,
      title: 'Ownership Transfer',
      description: 'Seamless ownership transfer with legal documentation and confirmation.',
    },
  ];

  const tenantSteps = [
    {
      icon: Search,
      title: 'Discover Properties',
      description: 'Browse verified listings with advanced filters, analytics, and neighborhood insights.',
    },
    {
      icon: BarChart3,
      title: 'Analyze & Compare',
      description: 'Use our analytics tools to compare properties, check valuations, and assess investment potential.',
    },
    {
      icon: FileCheck,
      title: 'Schedule & Verify',
      description: 'Schedule visits, verify documentation, and get detailed property reports.',
    },
    {
      icon: CreditCard,
      title: 'Secure Transaction',
      description: 'Complete purchase or rental with secure payment processing and escrow protection.',
    },
    {
      icon: CheckCircle2,
      title: 'Confirmation',
      description: 'Receive ownership/rental confirmation with all necessary documentation.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>How It Works | PropGrowthX</title>
        <meta
          name="description"
          content="Learn how PropGrowthX works for property owners and tenants. Step-by-step guide to buying, selling, and renting properties."
        />
      </Helmet>

      <Layout>
        {/* Header */}
        <section className="bg-gradient-to-br from-primary to-secondary py-16 lg:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium mb-6">
                Step-by-Step Guide
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                How PropGrowthX Works
              </h1>
              <p className="text-lg text-primary-foreground/80">
                A seamless, data-driven process from property discovery to transaction completion.
              </p>
            </div>
          </div>
        </section>

        {/* For Property Owners */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-medium mb-4">
                For Property Owners
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                List & Sell Your Property
              </h2>
              <p className="text-lg text-muted-foreground">
                From listing to transaction, we handle everything with data-backed precision.
              </p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-border" />
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ownerSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="feature-card text-center">
                      <div className="relative inline-flex">
                        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
                          <step.icon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                <Link to="/dashboard/owner">
                  Access Owner Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* For Buyers/Tenants */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-medium mb-4">
                For Buyers & Tenants
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Find & Secure Your Property
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover, analyze, and transact with confidence using our intelligent platform.
              </p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-border" />
              
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {tenantSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="feature-card text-center h-full">
                      <div className="relative inline-flex">
                        <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                          <step.icon className="w-7 h-7 text-primary" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                <Link to="/properties">
                  Start Exploring
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium mb-6">
                  Our Technology
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Engineering-Backed Platform
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8">
                  PropGrowthX is built on a foundation of advanced technology, ensuring accuracy, security, and reliability.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: 'Machine Learning Pipeline',
                      desc: 'Gradient boosting models trained on 10M+ transactions for 98% prediction accuracy.',
                    },
                    {
                      title: 'Real-Time Data Processing',
                      desc: 'Stream processing architecture handling 1M+ data points daily.',
                    },
                    {
                      title: 'GIS & Location Analytics',
                      desc: 'Spatial analysis for neighborhood scoring, connectivity, and growth metrics.',
                    },
                    {
                      title: 'Secure Transaction Layer',
                      desc: 'End-to-end encryption with escrow protection and audit trails.',
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-6">Technical Specifications</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Model Accuracy', value: '98%' },
                    { label: 'Data Points Analyzed', value: '50+' },
                    { label: 'Response Time', value: '<200ms' },
                    { label: 'Uptime SLA', value: '99.9%' },
                    { label: 'Encryption', value: 'AES-256' },
                    { label: 'Data Freshness', value: 'Real-time' },
                  ].map((spec, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-primary-foreground/10 last:border-0">
                      <span className="text-primary-foreground/70">{spec.label}</span>
                      <span className="font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default HowItWorks;
