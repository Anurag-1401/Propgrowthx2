import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Explore Properties', href: '/properties' },
      { name: 'Analytics & Insights', href: '/analytics' },
      { name: 'Price Prediction', href: '/services' },
      { name: 'Market Reports', href: '/analytics' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Services', href: '/services' },
      { name: 'Contact', href: '/contact' },
    ],
    dashboards: [
      { name: 'Owner Dashboard', href: '/dashboard/owner' },
      { name: 'Tenant Dashboard', href: '/dashboard/tenant' },
      { name: 'Investment Tools', href: '/analytics' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <span className="text-xl font-bold">
                PropGrowthX
              </span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Smart Decisions. Stronger Property Growth. Data-driven real estate platform powered by machine learning and advanced analytics.
            </p>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <a href="mailto:contact@propgrowthx.com" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4" />
                contact@propgrowthx.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4" />
                9876543211
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                India
              </span>
            </div>
          </div>

          {/* Platform Links */}
          {/* <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} PropGrowthX. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
