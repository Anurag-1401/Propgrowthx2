import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Message sent successfully!",
      description: "Our team will get back to you within 24 hours.",
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'contact@propgrowthx.com',
      href: 'mailto:contact@propgrowthx.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+91 9876543218',
      href: 'tel:+919876543218',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: 'Banglore, Karnataka, India',
      href: 'https://www.google.com/maps/place/Bengaluru,+Karnataka,+India/',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Fri: 9AM - 6PM PST',
      href: '#',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | PropGrowthX</title>
        <meta
          name="description"
          content="Get in touch with PropGrowthX. Talk to our experts about property investments, analytics, or enterprise solutions."
        />
      </Helmet>

      <Layout>
        {/* Header */}
        <section className="bg-gradient-to-br from-primary to-secondary py-16 lg:py-24 mt-5">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium mb-6">
                Get In Touch
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Let's Start a Conversation
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Whether you're looking to invest, list a property, or explore enterprise solutions, our team is here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h2>
                <p className="text-muted-foreground mb-8">
                  Reach out through any of these channels. Our team typically responds within 24 hours.
                </p>

                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-secondary/50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {item.title}
                        </div>
                        <div className="font-medium text-foreground">
                          {item.value}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form below and we'll get back to you shortly.
                  </p>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-success" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. Our team will contact you within 24 hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="Anand"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Sharma"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="anand.sharma@example.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 9876543218"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interest">I'm Interested In</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buying">Buying a Property</SelectItem>
                            <SelectItem value="selling">Selling a Property</SelectItem>
                            <SelectItem value="renting">Renting a Property</SelectItem>
                            <SelectItem value="investing">Investment Advisory</SelectItem>
                            <SelectItem value="analytics">Analytics & Reports</SelectItem>
                            <SelectItem value="enterprise">Enterprise Solutions</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your requirements..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-secondary hover:bg-secondary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to Start Investing Smarter?
              </h2>
              <p className="text-muted-foreground mb-6">
                Explore our platform and discover data-driven real estate opportunities.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-secondary hover:bg-secondary/90">
                  <a href="/properties">Explore Properties</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/analytics">View Analytics</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
