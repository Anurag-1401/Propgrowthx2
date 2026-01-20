import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Home,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
} from 'lucide-react';
import PayPaymentModal from '@/components/tenant/PayPaymentModal';
import { supabase } from '@/lib/supabase';

export interface Transaction {
  id: number;
  property_id: string;
  type: 'rent' | 'deposit' | 'maintenance';
  amount: string | number;
  date: string;
  dueDate?: string;
  status: 'completed' | 'pending' | 'overdue' | 'upcoming';
  paymentMethod?: string;
  referenceNo?: string;
}

const TenantTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  const [transactions, setTransactions] = useState<Transaction[]>([]);

useEffect(() => {
  const fetchTransactions = async () => {
    const userId = sessionStorage.getItem("id");

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (!error && data) {
      setTransactions(
        data.map((p) => ({
          id: p.id,
          property_id: p.property_id,
          type: p.type,
          amount: p.amount,
          date: p.date,
          dueDate: p.due_date,
          status: p.status,
          paymentMethod: p.payment_method,
          referenceNo: p.reference_no,
        }))
      );
    }
  };

  fetchTransactions();
}, []);

  const stats = [
    {
      label: 'Total Paid (This Year)',
      value: '14,150',
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Pending Payments',
      value: '180',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Overdue',
      value: '2,800',
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Upcoming (3 months)',
      value: '8,400',
      icon: Calendar,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-primary-foreground">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-foreground">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive text-destructive-foreground">Overdue</Badge>;
      case 'upcoming':
        return <Badge className="bg-secondary text-secondary-foreground">Upcoming</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'rent':
        return <Badge variant="outline" className="border-secondary text-secondary">Rent</Badge>;
      case 'purchase':
        return <Badge variant="outline" className="border-success text-success">Purchase</Badge>;
      case 'deposit':
        return <Badge variant="outline" className="border-primary text-primary">Deposit</Badge>;
      case 'maintenance':
        return <Badge variant="outline">Maintenance</Badge>;
      case 'utility':
        return <Badge variant="outline">Utility</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filterTransactions = (txns: Transaction[]) => {
    return txns.filter((tx) => {
      const matchesSearch =
        tx.property_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;

      let matchesTab = true;
      const today = new Date();
      const txDate = new Date(tx.date);

      switch (activeTab) {
        case 'past':
          matchesTab = tx.status === 'completed';
          break;
        case 'current':
          matchesTab = tx.status === 'pending' || tx.status === 'overdue';
          break;
        case 'upcoming':
          matchesTab = tx.status === 'upcoming';
          break;
      }

      return matchesSearch && matchesType && matchesTab;
    });
  };

  const filteredTransactions = filterTransactions(transactions);

  const overdueTransactions = transactions.filter((tx) => tx.status === 'overdue');
  const upcomingTransactions = transactions.filter((tx) => tx.status === 'upcoming').slice(0, 3);

  return (
    <>
      <Helmet>
        <title>My Transactions | PropGrowthX</title>
        <meta name="description" content="View and manage your property transactions, rent payments, and payment history." />
      </Helmet>

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/dashboard/tenant" replace>
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">My Transactions</h1>
                  <p className="text-muted-foreground">Track all your payments and transactions</p>
                </div>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export History
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alerts Section */}
            {overdueTransactions.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-destructive mb-1">Overdue Payments</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      You have {overdueTransactions.length} overdue payment{overdueTransactions.length > 1 ? 's' : ''} totaling $
                      {overdueTransactions.reduce((sum, tx) => sum + Number(tx.amount||0), 0).toLocaleString()}.
                    </p>
                    <Button size="sm" className="bg-destructive hover:bg-destructive/90">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Payments Reminder */}
            {upcomingTransactions.length > 0 && (
              <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">Upcoming Payments</h3>
                    <div className="space-y-2">
                      {upcomingTransactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{tx.property_id}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground capitalize">{tx.type}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-foreground font-medium">${tx.amount.toLocaleString()}</span>
                            <span className="text-muted-foreground">Due: {tx.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs and Filters */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <div className="border-b border-border p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="past">Past</TabsTrigger>
                      <TabsTrigger value="current">Current</TabsTrigger>
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    </TabsList>
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search transactions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full md:w-64"
                        />
                      </div>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full md:w-40">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="purchase">Purchase</SelectItem>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="utility">Utility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <TabsContent value="all" className="m-0">
                  <TransactionTable transactions={filterTransactions(transactions)} getStatusBadge={getStatusBadge} getTypeBadge={getTypeBadge} />
                </TabsContent>
                <TabsContent value="past" className="m-0">
                  <TransactionTable transactions={filteredTransactions} getStatusBadge={getStatusBadge} getTypeBadge={getTypeBadge} />
                </TabsContent>
                <TabsContent value="current" className="m-0">
                  <TransactionTable transactions={filteredTransactions} getStatusBadge={getStatusBadge} getTypeBadge={getTypeBadge} />
                </TabsContent>
                <TabsContent value="upcoming" className="m-0">
                  <TransactionTable transactions={filteredTransactions} getStatusBadge={getStatusBadge} getTypeBadge={getTypeBadge} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

interface TransactionTableProps {
  transactions: Transaction[];
  getStatusBadge: (status: string) => JSX.Element;
  getTypeBadge: (type: string) => JSX.Element;
}

const TransactionTable = ({ transactions, getStatusBadge, getTypeBadge }: TransactionTableProps) => {

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return(
    <>
     <PayPaymentModal
        open={payModalOpen}
        onOpenChange={setPayModalOpen}
        transaction={selectedTx}
      />

  {transactions.length === 0 ? (
      <div>
      <div className="p-12 text-center">
        <IndianRupee className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No transactions found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search term</p>
      </div>
      <div className='text-center p-12'>
      <h4 className="text-md font-semibold text-foreground mb-2">Make your 1st Payment</h4>
      <Button
        className="bg-secondary hover:bg-secondary/90"
        onClick={() => {
          setSelectedTx({
            id: Date.now(),
            property_id: "DEFAULT_PROPERTY",
            type: "rent",
            amount: 8500,
            date: new Date().toISOString(),
            status: "pending",
          });
          setPayModalOpen(true);
        }}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Pay Rent
      </Button>

      </div>
      </div>) : (
        <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{tx.property_id}</span>
                </div>
              </TableCell>
              <TableCell>{getTypeBadge(tx.type)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {tx.status === 'completed' ? (
                    <ArrowUpRight className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-semibold text-foreground">${tx.amount.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{tx.date}</TableCell>
              <TableCell className="text-muted-foreground">{tx.dueDate || '-'}</TableCell>
              <TableCell>{getStatusBadge(tx.status)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{tx.referenceNo || '-'}</TableCell>
              <TableCell className="text-right">
                {(tx.status === 'pending' || tx.status === 'overdue') && (
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90" 
                  onClick={() => {
                      setSelectedTx(tx);
                      setPayModalOpen(true);
                    }}>
                    Pay Now
                  </Button>
                )}
                {tx.status === 'completed' && (
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )}
  </>
  )
};

export default TenantTransactions;
