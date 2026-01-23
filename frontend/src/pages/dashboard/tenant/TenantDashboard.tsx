import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Home,
  Heart,
  Clock,
  CheckCircle2,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  X,
  WrenchIcon,
  Building2,
  FileText,
  LogOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState ,useEffect} from 'react';
import { Transaction } from './TenantTransactions';
import { supabase } from '@/lib/supabase';

const TenantDashboard = () => {
  const stats = [
    // { label: 'Saved Properties', value: '2', icon: Heart },
    { label: 'Active Applications', value: '3', icon: Clock },
    { label: 'Rented', value: '2', icon: CheckCircle2 },
    { label: 'Property Views', value: '6', icon: Search },
  ];

  const savedProperties = [
    {
      id: 1,
      name: 'Modern Downtown Loft',
      location: 'Panvel, Maharashtra',
      monthly_rent: 8500,
      type: 'rent',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      name: 'Cozy Studio Apartment',
      location: 'Dadar, Maharashtra',
      monthly_rent: 6500,
      type: 'rent',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 3,
      name: 'Suburban Family Home',
      location: 'Pune, Maharashtra',
      monthly_rent: 10500,
      type: 'rent',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const myProperties = [
    {
      id: 1,
      name: 'Waterfront Condo',
      location: 'Pune, Maharashtra',
      type: 'Rented',
      date: '2024-06-15',
      monthly_rent: 6500,
      status: 'active',
      endDate: '2025-08-32',
    },
    {
      id: 2,
      name: 'Urban Loft',
      location: 'Goregoan, Maharashtra',
      type: 'Rented',
      date: '2024-09-01',
      monthly_rent: 7800,
      status: 'active',
      endDate: '2025-08-31',
    },
  ];

  // const transactions = [
  //   {
  //     id: 1,
  //     property: 'Waterfront Condo',
  //     type: 'Purchase',
  //     amount: 6500,
  //     date: '2024-06-15',
  //     status: 'completed',
  //   },
  //   {
  //     id: 2,
  //     property: 'Urban Loft',
  //     type: 'Rental Payment',
  //     amount: 2800,
  //     date: '2024-12-01',
  //     status: 'completed',
  //   },
  //   {
  //     id: 3,
  //     property: 'Urban Loft',
  //     type: 'Rental Payment',
  //     amount: 2800,
  //     date: '2024-11-01',
  //     status: 'completed',
  //   },
  // ];
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

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
    }
  };

  fetchTransactions();
}, []);  

  return (
    <>
      <Helmet>
        <title>Tenant Dashboard | PropGrowthX</title>
        <meta
          name="description"
          content="Explore properties, manage rentals, and track your real estate transactions with PropGrowthX Tenant Dashboard."
        />
      </Helmet>

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Tenant Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Explore, save, and manage your properties
                </p>
              </div>
              {/* <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link to="/properties">
                  <Search className="w-5 h-5 mr-2" />
                  Explore Properties
                </Link>
              </Button>  */}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
             <Link
               to="/dashboard/tenant/complaints"
               className="bg-card border border-border rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all group"
             >
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                     <WrenchIcon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-foreground">Manage Complaints</h3>
                     <p className="text-sm text-muted-foreground">View and manage all your complaints</p>
                   </div>
                 </div>
                 <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
               </div>
             </Link>
             <Link
               to="/dashboard/tenant/transactions"
               className="bg-card border border-border rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all group"
             >
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                     <FileText className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-foreground">Transactions & Payments</h3>
                     <p className="text-sm text-muted-foreground">Track your rentals & rent payments</p>
                   </div>
                 </div>
                 <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
               </div>
             </Link>
           </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Saved Properties */}
                {/* <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      Saved Properties
                    </h2>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/properties">
                        View All
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {savedProperties.map((property) => (
                      <div
                        key={property.id}
                        className="bg-muted rounded-xl overflow-hidden group"
                      >
                        <div className="relative h-32">
                          <img
                            src={property.image}
                            alt={property.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                          <Badge
                            className={`absolute bottom-2 left-2 ${
                              property.type === 'buy'
                                ? 'bg-success text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            {property.type === 'buy' ? 'For Sale' : 'For Rent'}
                          </Badge>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-foreground text-sm line-clamp-1">
                            {property.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            {property.location}
                          </div>
                          <div className="font-bold text-foreground mt-2">
                            Rs{" "+property.monthly_rent?.toLocaleString()}
                            {property.type === 'rent' && '/mo'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* My Properties */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    My Properties
                  </h2>

                  <div className="space-y-4">
                    {myProperties.map((property) => (
                      <div
                        key={property.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted rounded-xl gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                            <Home className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {property.name}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {property.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-sm">
                            <div className="text-muted-foreground">Type</div>
                            <div className="font-medium text-foreground">
                              {property.type}
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="text-muted-foreground">Since</div>
                            <div className="font-medium text-foreground">
                              {property.date}
                            </div>
                          </div>
                          {property.endDate && (
                            <div className="text-sm">
                              <div className="text-muted-foreground">Until</div>
                              <div className="font-medium text-foreground">
                                {property.endDate}
                              </div>
                            </div>
                          )}
                          <Badge
                            className={
                              property.status === 'owned'
                                ? 'bg-success text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }
                          >
                            {property.status === 'owned' ? 'Owned' : 'Active Rental'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Transaction History */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Recent Transactions
                  </h2>

                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-start justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                      >
                        <div>
                          <div className="font-medium text-foreground text-sm">
                            {tx.property_id}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tx.type}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3" />
                            {tx.date.split("T")[0]}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground text-sm">
                            Rs{" "+tx.amount.toLocaleString()}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4" size="sm"
                  onClick={() => navigate('/dashboard/tenant/transactions')}
                  >
                    View All Transactions
                  </Button>
                </div>

                {/* Quick Actions */}
                {/* <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Quick Actions
                  </h2>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/properties">
                        <Search className="w-4 h-4 mr-2" />
                        Browse Properties
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/analytics">
                        <IndianRupee className="w-4 h-4 mr-2" />
                        View Market Insights
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/contact">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Consultation
                      </Link>
                    </Button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default TenantDashboard;
