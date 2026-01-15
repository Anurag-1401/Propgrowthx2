import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Building2 } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary to-secondary">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Make Smarter Property Decisions?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of investors, owners, and tenants who trust PropGrowthX for data-driven real estate insights.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-card text-foreground hover:bg-card/90 shadow-lg"
            >
              <Link to="/properties">
                <Building2 className="w-5 h-5 mr-2" />
                Explore Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
            >
              <Link to="/analytics">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
