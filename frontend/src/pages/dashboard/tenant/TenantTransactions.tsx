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
  due_date?: string;
  status: 'completed' | 'pending' | 'overdue' | 'upcoming';
  paymentMethod?: string;
  referenceNo?: string;
}

const TenantTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const formatDate = (d: Date) => d.toISOString().split("T")[0];

const today = new Date();

const completedRentByProperty = transactions
  .filter(tx => tx.type === "rent" && tx.status === "completed")
  .reduce<Record<string, Transaction[]>>((acc, tx) => {
    acc[tx.property_id] ||= [];
    acc[tx.property_id].push(tx);
    return acc;
  }, {});

const derivedRentTransactions: Transaction[] = [];

Object.entries(completedRentByProperty).forEach(([propertyId, rents]) => {
  const lastPaid = rents
    .map(r => new Date(r.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  for (let i = 1; i <= 3; i++) {
    const due = addMonths(lastPaid, i);

    derivedRentTransactions.push({
      id: Number(`999${propertyId.slice(0, 3)}${i}`),
      property_id: propertyId,
      type: "rent",
      amount: rents[0].amount,
      date: formatDate(due),
      due_date: formatDate(due),
      status:
        due < today
          ? "overdue"
          : "upcoming",
    });
  }
});


useEffect(() => {
  const fetchTransactions = async () => {
    const userId = sessionStorage.getItem("id");

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("tenant_id", userId)
      .order("date", { ascending: false });

    if (!error && data) {
      setTransactions(
        data.map((p) => ({
          id: p.id,
          property_id: p.property_id,
          type: p.type,
          amount: p.amount,
          date: p.date,
          due_date: p.due_date,
          status: p.status,
          paymentMethod: p.payment_method,
          referenceNo: p.reference_no,
        }))
      );
      console.log("Fetched transactions:", data);
    }
  };

  fetchTransactions();
}, []);

 const filterTransactions = (txns: Transaction[]) => {
    return txns.filter((tx) => {
      const matchesSearch =
        tx.property_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;

      return matchesSearch && matchesType;
    });
  };

  const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
const prevMonth = prevMonthDate.getMonth();
const prevYear = prevMonthDate.getFullYear();

const nextMonth = new Date(currentYear, currentMonth + 1, 1);


const allTransactions: Transaction[] = [
  ...transactions,
  ...derivedRentTransactions.filter(
    dt =>
      !transactions.some(
        t =>
          t.type === "rent" &&
          t.property_id === dt.property_id &&
          t.due_date === dt.due_date
      )
  ),
];

const pastTabTransactions = allTransactions.filter(tx => {
  if (tx.status !== "completed") return false;

  const txDate = new Date(tx.date);

  return (
    txDate.getMonth() === prevMonth &&
    txDate.getFullYear() === prevYear
  );
});


const currentTabTransactions = allTransactions.filter(tx => {
  const baseDate = tx.due_date ? new Date(tx.due_date) : new Date(tx.date);

  return (
    baseDate.getMonth() === currentMonth &&
    baseDate.getFullYear() === currentYear &&
    ["completed", "pending", "overdue"].includes(tx.status)
  );
});


const upcomingTabTransactions = allTransactions.filter(tx => {
  if (!tx.due_date) return false;
  const due = new Date(tx.due_date);
  return (
    tx.status === "upcoming" &&
    due.getMonth() === nextMonth.getMonth() &&
    due.getFullYear() === nextMonth.getFullYear()
  );
});

 const allTabTransactions = [
  ...pastTabTransactions,
  ...currentTabTransactions,
  ...upcomingTabTransactions,
];

const overdueTransactions = allTransactions.filter(tx => tx.status === "overdue");

const upcomingTransactions = allTransactions
  .filter(tx => tx.status === "upcoming")
  .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
  .slice(0, 3);

const toNumber = (v: string | number | undefined) =>
  Number(v || 0);

const totalPaidThisYear = allTransactions
  .filter(
    (tx) =>
      tx.status === "completed" &&
      new Date(tx.date).getFullYear() === currentYear
  )
  .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

const pendingPayments = allTransactions
  .filter((tx) => tx.status === "pending")
  .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

const overduePayments = allTransactions
  .filter((tx) => tx.status === "overdue")
  .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

  const upcomingPayments = allTransactions
  .filter((tx) => tx.status === "upcoming")
  .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

const threeMonthsFromNow = new Date();
threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

 const stats = [
  {
    label: "Total Paid (This Year)",
    value: `₹${totalPaidThisYear.toLocaleString()}`,
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    label: "Pending Payments",
    value: `₹${pendingPayments.toLocaleString()}`,
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    label: "Overdue",
    value: `₹${overduePayments.toLocaleString()}`,
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    label: "Upcoming (3 months)",
    value: `₹${upcomingPayments.toLocaleString()}`,
    icon: Calendar,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
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
                      You have {overdueTransactions.length} overdue payment{overdueTransactions.length > 1 ? 's' : ''} totaling ₹
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
                            <span className="text-foreground font-medium">₹{tx.amount.toLocaleString()}</span>
                            <span className="text-muted-foreground">Due: {tx.due_date?.split('T')[0] || '-'}</span>
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

                <TabsContent value="all">
                <TransactionTable
                  transactions={filterTransactions(allTabTransactions)}
                  getStatusBadge={getStatusBadge}
                  getTypeBadge={getTypeBadge}
                />
              </TabsContent>

              <TabsContent value="past">
                <TransactionTable
                  transactions={filterTransactions(pastTabTransactions)}
                  getStatusBadge={getStatusBadge}
                  getTypeBadge={getTypeBadge}
                />
              </TabsContent>

              <TabsContent value="current">
                <TransactionTable
                  transactions={filterTransactions(currentTabTransactions)}
                  getStatusBadge={getStatusBadge}
                  getTypeBadge={getTypeBadge}
                />
              </TabsContent>

              <TabsContent value="upcoming">
                <TransactionTable
                  transactions={filterTransactions(upcomingTabTransactions)}
                  getStatusBadge={getStatusBadge}
                  getTypeBadge={getTypeBadge}
                />
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
        onClick={() => setPayModalOpen(true)}
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
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-semibold text-foreground">₹{tx.amount.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{tx.date}</TableCell>
              <TableCell className="text-muted-foreground">{tx.due_date?.split("T")[0] || '-'}</TableCell>
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
