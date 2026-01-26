import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';
import { useData } from '@/context/dataContext';
import { computeTransactionFilters, TransactionTable } from '@/components/tenant/TenantTransactionsAndFilter';

export interface Transaction {
  id: number;
  tenant_id?: string;
  owner_id?: string;
  property_id: string;
  type: 'rent' | 'deposit' | 'maintenance';
  amount: string | number;
  date: string;
  due_date?: string;
  images?: string[];
  status: 'completed' | 'pending' | 'overdue' | 'upcoming';
  paymentMethod?: string;
  reference_no?: string;
}

const TenantTransactions = () => {
  const {transactions,id,properties} = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

 const {
  allTransactions,
  filteredTransactions,
  pastTabTransactions,
  currentTabTransactions,
  upcomingTabTransactions,
  allTabTransactions,
  overdueTransactions,
  upcomingTransactions,
  totalPaidThisYear,
  pendingPayments,
  overduePayments,
  upcomingPayments,
} = computeTransactionFilters(transactions, searchTerm, typeFilter);


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
                            <span className="text-muted-foreground">{properties.find(p => p.id === tx.property_id)?.property_name}</span>
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
                  transactions={allTabTransactions}
                />
              </TabsContent>

              <TabsContent value="past">
                <TransactionTable
                  transactions={pastTabTransactions}
                />
              </TabsContent>

              <TabsContent value="current">
                <TransactionTable
                  transactions={currentTabTransactions}
                />
              </TabsContent>

              <TabsContent value="upcoming">
                <TransactionTable
                  transactions={upcomingTabTransactions}
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

export default TenantTransactions;
