import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Search,
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
import { useData } from '@/context/dataContext';
import { Transaction } from '../tenant/TenantTransactions';

const OwnerTransactions = () => {
  const {transactions,profile,properties,id} = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [payments,setPayments] = useState<Transaction[]>(transactions.filter((tx) => tx.owner_id === id));
  // Auto-check for overdue payments and send reminders
  useEffect(() => {
    const checkOverduePayments = () => {
      const today = new Date();
      setPayments(prevPayments =>
        prevPayments.map(payment => {
          const dueDate = new Date(payment.due_date);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let newStatus: 'completed' | 'pending' | 'overdue' | 'upcoming' = payment.status;
          if (payment.status !== 'completed') {
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
      description: `Payment reminder sent to ${payment?.tenant_id} at ${profile.find(p=>p.id === payment?.tenant_id)?.email}`,
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

  const filteredTransactions = payments.filter((tx) => {
    const matchesSearch = tx.property_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    totalRevenue: payments.filter(t => t.status === 'completed').reduce((sum, t) => sum + Number(t.amount), 0),
    rentalIncome: payments.filter(t => (t.type === 'rent' || t.type === 'deposit') && t.status === 'completed').reduce((sum, t) => sum + Number(t.amount), 0),
    pendingAmount: payments.filter(t => t.status === 'pending').reduce((sum, t) => sum + Number(t.amount), 0),
    overduePayments: payments.filter(p => p.status === 'overdue').length,
    expectedMonthlyRent: payments.reduce((sum, p) => sum + Number(p.amount), 0),
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
                        {filteredTransactions.map((tx) => {
                            const property = properties.find(p=>p.id === tx.property_id);
                          return(
                          <TableRow key={tx.id} className="hover:bg-muted/30">
                            <TableCell>
                              <div className="flex items-center gap-4">
                                <img
                                  src={property?.images[0] || '../../../../public/placeholder-property.jpg'}
                                  alt={tx.property_id}
                                  className="w-16 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <div className="font-medium text-foreground">{property?.property_name}</div>
                                  <div className="text-sm text-muted-foreground">{property?.address|| ''}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{tx.type}</TableCell>
                            <TableCell className="font-semibold text-foreground">
                              ₹{tx.amount.toLocaleString()}
                              {tx.type === 'rent' && <span className="text-muted-foreground font-normal">/mo</span>}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                            <TableCell className="text-foreground">{profile.find(p=>p.id === tx.tenant_id)?.name}</TableCell>
                            <TableCell>{tx.status}</TableCell>
                          </TableRow>
                        );
                      })}
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
