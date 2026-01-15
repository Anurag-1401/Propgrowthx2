import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Building2,
  TrendingUp,
  Home,
  Key,
  Brain,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Calendar,
  Search,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';



const Services = () => {
  const services = [
    {
      icon: Building2,
      title: 'Property Buying',
      description: 'Find your perfect property with data-driven search, ML-powered valuations, and comprehensive market analysis.',
      features: [
        'Advanced property search with 20+ filters',
        'ML-powered price recommendations',
        'Neighborhood analytics & scores',
        'Investment potential assessment',
        'Document verification assistance',
      ],
      cta: 'Start Searching',
      href: '/properties',
    },
    {
      icon: TrendingUp,
      title: 'Property Selling',
      description: 'Maximize your property value with accurate pricing, market timing insights, and exposure to verified buyers.',
      features: [
        'Instant property valuation',
        'Optimal listing price recommendation',
        'Market timing analysis',
        'Professional listing creation',
        'Buyer matching & verification',
      ],
      cta: 'List Your Property',
      href: '/dashboard/owner',
    },
    {
      icon: Key,
      title: 'Rental & Leasing',
      description: 'Streamlined rental process for both landlords and tenants with transparent pricing and verified listings.',
      features: [
        'Rental yield optimization',
        'Tenant screening & verification',
        'Lease agreement management',
        'Rent collection automation',
        'Maintenance request tracking',
      ],
      cta: 'Explore Rentals',
      href: '/properties',
    },
    {
      icon: Home,
      title: 'Investment Advisory',
      description: 'Data-backed investment recommendations for portfolio building, diversification, and ROI optimization.',
      features: [
        'Portfolio performance tracking',
        'Market opportunity alerts',
        'Risk assessment & scoring',
        'ROI projections & modeling',
        'Tax optimization guidance',
      ],
      cta: 'Get Advisory',
      href: '/contact',
    },
    {
      icon: Brain,
      title: 'Price Prediction Engine',
      description: 'Our proprietary ML models analyze 50+ parameters to deliver 98% accurate property valuations.',
      features: [
        'Real-time price predictions',
        'Historical trend analysis',
        'Comparative market analysis',
        'Future value forecasting',
        'Renovation ROI calculator',
      ],
      cta: 'Try Prediction Tool',
      href: '/analytics',
    },
    {
      icon: BarChart3,
      title: 'Market Insights & Reports',
      description: 'Comprehensive market reports, trend analysis, and actionable insights for informed decision-making.',
      features: [
        'Monthly market reports',
        'Locality comparison tools',
        'Demand-supply analysis',
        'Price per sqft trends',
        'Custom analytics dashboards',
      ],
      cta: 'View Reports',
      href: '/analytics',
    },
  ];

  interface RentalPayment {
  id: number;
  property: string;
  propertyImage: string;
  location: string;
  tenant: string;
  tenantEmail: string;
  monthlyRent: number;
  nextDueDate: string;
  lastPaymentDate: string;
  status: 'paid' | 'pending' | 'overdue';
  daysUntilDue: number;
  reminderSent: boolean;
}

interface Transaction {
  id: number;
  property: string;
  propertyImage: string;
  location: string;
  type: 'sale' | 'rental' | 'lease';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  buyer?: string;
  tenant?: string;
}

const transactions: Transaction[] = [
    {
      id: 1,
      property: 'Historic Brownstone',
      propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
      location: 'Boston, MA',
      type: 'sale',
      amount: 1850000,
      date: '2024-12-20',
      status: 'completed',
      buyer: 'John Smith',
    },
    {
      id: 2,
      property: 'Luxury Penthouse',
      propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
      location: 'Miami, FL',
      type: 'sale',
      amount: 2500000,
      date: '2024-12-18',
      status: 'pending',
      buyer: 'Sarah Johnson',
    },
    {
      id: 3,
      property: 'Cozy Studio Apartment',
      propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      location: 'New York, NY',
      type: 'rental',
      amount: 3500,
      date: '2024-12-01',
      status: 'completed',
      tenant: 'Michael Chen',
    },
    {
      id: 4,
      property: 'Mountain Retreat Cabin',
      propertyImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
      location: 'Denver, CO',
      type: 'rental',
      amount: 2800,
      date: '2024-11-15',
      status: 'completed',
      tenant: 'Emily Davis',
    },
    {
      id: 5,
      property: 'Commercial Office Space',
      propertyImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      location: 'Austin, TX',
      type: 'lease',
      amount: 8500,
      date: '2024-10-01',
      status: 'completed',
      tenant: 'TechStart Inc.',
    },
    {
      id: 6,
      property: 'Waterfront Condo',
      propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
      location: 'Seattle, WA',
      type: 'rental',
      amount: 4200,
      date: '2024-09-20',
      status: 'completed',
      tenant: 'David Wilson',
    },
  ];

  const rentalPayments: RentalPayment[] = [
    {
      id: 1,
      property: 'Cozy Studio Apartment',
      propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      location: 'New York, NY',
      tenant: 'Michael Chen',
      tenantEmail: 'michael.chen@email.com',
      monthlyRent: 3500,
      nextDueDate: '2025-01-01',
      lastPaymentDate: '2024-12-01',
      status: 'pending',
      daysUntilDue: 2,
      reminderSent: false,
    },
    {
      id: 2,
      property: 'Mountain Retreat Cabin',
      propertyImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
      location: 'Denver, CO',
      tenant: 'Emily Davis',
      tenantEmail: 'emily.davis@email.com',
      monthlyRent: 2800,
      nextDueDate: '2024-12-15',
      lastPaymentDate: '2024-11-15',
      status: 'overdue',
      daysUntilDue: -15,
      reminderSent: true,
    },
    {
      id: 3,
      property: 'Waterfront Condo',
      propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
      location: 'Seattle, WA',
      tenant: 'David Wilson',
      tenantEmail: 'david.wilson@email.com',
      monthlyRent: 4200,
      nextDueDate: '2025-01-20',
      lastPaymentDate: '2024-12-20',
      status: 'paid',
      daysUntilDue: 21,
      reminderSent: false,
    },
    {
      id: 4,
      property: 'Commercial Office Space',
      propertyImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      location: 'Austin, TX',
      tenant: 'TechStart Inc.',
      tenantEmail: 'billing@techstart.com',
      monthlyRent: 8500,
      nextDueDate: '2025-01-01',
      lastPaymentDate: '2024-12-01',
      status: 'pending',
      daysUntilDue: 2,
      reminderSent: false,
    },
  ];
  
    const [payments, setPayments] = useState(rentalPayments);

  const stats = {
    totalRevenue: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    salesRevenue: transactions.filter(t => t.type === 'sale' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    rentalIncome: transactions.filter(t => (t.type === 'rental' || t.type === 'lease') && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pendingAmount: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    overduePayments: payments.filter(p => p.status === 'overdue').length,
    expectedMonthlyRent: payments.reduce((sum, p) => sum + p.monthlyRent, 0),
  };

   const handleSendReminder = (paymentId: number) => {
      setPayments(prevPayments =>
        prevPayments.map(payment =>
          payment.id === paymentId
            ? { ...payment, reminderSent: true }
            : payment
        )
      );
      
      const payment = payments.find(p => p.id === paymentId);
      toast({
        title: "Reminder Sent",
        description: `Payment reminder sent to ${payment?.tenant} at ${payment?.tenantEmail}`,
      });
    };

  return (
    <>
      <Helmet>
        <title>Services | PropGrowthX - Real Estate Solutions</title>
        <meta
          name="description"
          content="Explore PropGrowthX services: property buying, selling, rental, investment advisory, ML price prediction, and market insights."
        />
      </Helmet>

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom">

        {/* <section className="bg-gradient-to-br from-primary to-secondary py-20 lg:py-32">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium mb-6">
                Our Services
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Comprehensive Real Estate{' '}
                <span className="text-secondary">Solutions</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80">
                From property discovery to investment optimization, we provide end-to-end services powered by data and machine learning.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-32 bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-8 hover:border-secondary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {service.description}
                      </p>

                      <ul className="space-y-3 mb-6">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button asChild variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                        <Link to={service.href}>
                          {service.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}


        <Tabs defaultValue="rentals" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="rentals">Rent Payments</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
          
            {/* Rent Payments Tab */}
            <TabsContent value="rentals">
              {/* Overdue Alert */}
              {stats.overduePayments > 0 && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                    <div>
                      <h3 className="font-semibold text-destructive">
                        {stats.overduePayments} Overdue Payment{stats.overduePayments > 1 ? 's' : ''}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Some tenants have missed their payment due dates. Send reminders to follow up.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Rental Payments Table */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[250px]">Property</TableHead>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Monthly Rent</TableHead>
                        <TableHead>Next Due Date</TableHead>
                        <TableHead>Last Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow 
                          key={payment.id} 
                          className={`hover:bg-muted/30 ${payment.status === 'overdue' ? 'bg-destructive/5' : ''}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <img
                                src={payment.propertyImage}
                                alt={payment.property}
                                className="w-14 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <div className="font-medium text-foreground">{payment.property}</div>
                                <div className="text-sm text-muted-foreground">{payment.location}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-foreground">{payment.tenant}</div>
                              <div className="text-sm text-muted-foreground">{payment.tenantEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">
                            ${payment.monthlyRent.toLocaleString()}<span className="text-muted-foreground font-normal">/mo</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="text-foreground">{payment.nextDueDate}</div>
                                <div className={`text-xs ${
                                  payment.daysUntilDue < 0 
                                    ? 'text-destructive' 
                                    : payment.daysUntilDue <= 7 
                                      ? 'text-warning' 
                                      : 'text-muted-foreground'
                                }`}>
                                  {payment.daysUntilDue < 0 
                                    ? `${Math.abs(payment.daysUntilDue)} days overdue`
                                    : payment.daysUntilDue === 0
                                      ? 'Due today'
                                      : `In ${payment.daysUntilDue} days`
                                  }
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{payment.lastPaymentDate}</TableCell>
                          <TableCell>{payment.status}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {(payment.status === 'overdue' || payment.status === 'pending') && (
                                <Button
                                  variant={payment.reminderSent ? "outline" : "default"}
                                  size="sm"
                                  onClick={() => handleSendReminder(payment.id)}
                                  disabled={payment.reminderSent}
                                  className={payment.reminderSent ? "" : "bg-secondary hover:bg-secondary/90"}
                                >
                                  <Mail className="w-4 h-4 mr-1" />
                                  {payment.reminderSent ? 'Sent' : 'Send Reminder'}
                                </Button>
                              )}
                              {payment.status === 'paid' && (
                                <Badge variant="outline" className="border-success text-success">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Received
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {/* Auto-Reminder Info */}
              {/* <div className="bg-accent border border-border rounded-2xl p-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Auto-Reminder System</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Our system automatically monitors payment due dates and sends reminders when payments are overdue. 
                      You can also manually send reminders using the button in the actions column.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Automatic overdue detection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Email reminders to tenants
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Payment status tracking
                      </li>
                    </ul>
                  </div>
                </div>
              </div> */}
            </TabsContent>

             {/* <TabsContent value="all">
              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sale">Sales</SelectItem>
                      <SelectItem value="rental">Rentals</SelectItem>
                      <SelectItem value="lease">Leases</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {filteredTransactions.length > 0 ? (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[300px]">Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx) => (
                        <TableRow key={tx.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <img
                                src={tx.propertyImage}
                                alt={tx.property}
                                className="w-16 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <div className="font-medium text-foreground">{tx.property}</div>
                                <div className="text-sm text-muted-foreground">{tx.location}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{tx.type}</TableCell>
                          <TableCell className="font-semibold text-foreground">
                            ${tx.amount.toLocaleString()}
                            {tx.type !== 'sale' && <span className="text-muted-foreground font-normal">/mo</span>}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                          <TableCell className="text-foreground">{tx.buyer || tx.tenant}</TableCell>
                          <TableCell>{tx.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>)
                :(
                  <p className='text-center'>No properties for transactions</p>
                )
              }
            </TabsContent> */}
          </Tabs>

        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Need a Custom Solution?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our team can create tailored solutions for enterprise clients, large portfolios, and unique requirements.
              </p>
              <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90">
                <Link to="/contact">
                  Talk to Our Experts
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        </div>
        </div>
      </Layout>
    </>
  );
};

export default Services;
