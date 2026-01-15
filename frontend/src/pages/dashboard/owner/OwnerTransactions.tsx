import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Home,
  Building,
} from 'lucide-react';
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

const OwnerTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Auto-check for overdue payments and send reminders
  useEffect(() => {
    const checkOverduePayments = () => {
      const today = new Date();
      setPayments(prevPayments =>
        prevPayments.map(payment => {
          const dueDate = new Date(payment.nextDueDate);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let newStatus: 'paid' | 'pending' | 'overdue' = payment.status;
          if (payment.status !== 'paid') {
            if (diffDays < 0) {
              newStatus = 'overdue';
            } else {
              newStatus = 'pending';
            }
          }

          return {
            ...payment,
            daysUntilDue: diffDays,
            status: newStatus,
          };
        })
      );
    };

    checkOverduePayments();
  }, []);

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

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-primary-foreground">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-foreground">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success text-primary-foreground">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-foreground">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sale':
        return <Badge variant="outline" className="border-primary text-primary">Sale</Badge>;
      case 'rental':
        return <Badge variant="outline" className="border-secondary text-secondary">Rental</Badge>;
      case 'lease':
        return <Badge variant="outline" className="border-warning text-warning">Lease</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    totalRevenue: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    salesRevenue: transactions.filter(t => t.type === 'sale' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    rentalIncome: transactions.filter(t => (t.type === 'rental' || t.type === 'lease') && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pendingAmount: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    overduePayments: payments.filter(p => p.status === 'overdue').length,
    expectedMonthlyRent: payments.reduce((sum, p) => sum + p.monthlyRent, 0),
  };

  return (
    <>
      <Helmet>
        <title>Transactions | PropGrowthX Owner Dashboard</title>
        <meta
          name="description"
          content="Track all your property transactions, sales, rentals, and manage rent payments with automatic reminders."
        />
      </Helmet>

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom">
            {/* Back Link */}
            <Link
              to="/dashboard/owner"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Transactions
                </h1>
                <p className="text-muted-foreground">
                  Track sales, rentals, and manage payment schedules
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                </div>
                <div className="text-2xl font-bold text-foreground">${(stats.totalRevenue / 1000000).toFixed(2)}M</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Sales Revenue</span>
                </div>
                <div className="text-2xl font-bold text-foreground">${(stats.salesRevenue / 1000000).toFixed(2)}M</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-muted-foreground">Rental Income</span>
                </div>
                <div className="text-2xl font-bold text-foreground">${stats.rentalIncome.toLocaleString()}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-warning" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <div className="text-2xl font-bold text-foreground">${(stats.pendingAmount / 1000000).toFixed(2)}M</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="text-sm text-muted-foreground">Overdue</span>
                </div>
                <div className="text-2xl font-bold text-destructive">{stats.overduePayments}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-muted-foreground">Monthly Rent</span>
                </div>
                <div className="text-2xl font-bold text-foreground">${stats.expectedMonthlyRent.toLocaleString()}</div>
              </div>
            </div> */}

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="bg-card border border-border">
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                {/* <TabsTrigger value="rentals">Rent Payments</TabsTrigger> */}
              </TabsList>

              {/* All Transactions Tab */}
              <TabsContent value="all">
                {/* Filters */}
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

                {/* Transactions Table */}
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
              </TabsContent>

              {/* <TabsContent value="rentals">
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

                <div className="bg-accent border border-border rounded-2xl p-6 mt-6">
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
                </div>
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OwnerTransactions;
