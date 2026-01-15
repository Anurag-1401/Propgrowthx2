import { useState,useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Plus,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  FileText,
  LogOut
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
import AddPropertyModal from '@/components/dashboard/AddPropertyModal';
import EditPropertyModal, { PropertyData } from '@/components/dashboard/EditPropertyModal';
import DeletePropertyDialog from '@/components/dashboard/DeletePropertyDialog';
import PropertyAnalyticsModal from '@/components/dashboard/PropertyAnalyticsModal';
import { supabase } from '@/lib/supabase';

const OwnerDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const id = sessionStorage.getItem('id');



  const stats = [
    { label: 'Total Properties', value: '8', icon: Building2, change: '+2 this month' },
    { label: 'Total Value', value: '$4.2M', icon: DollarSign, change: '+12% YoY' },
    { label: 'Monthly Views', value: '2,847', icon: Eye, change: '+18% vs last month' },
    { label: 'Active Inquiries', value: '24', icon: TrendingUp, change: '6 new today' },
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      console.log(data)
      setProperties(data as PropertyData[]);
    }

    setLoading(false);
  };


  const handleEditClick = (property: PropertyData) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (property: PropertyData) => {
    setSelectedProperty(property);
    setIsDeleteDialogOpen(true);
  };

  const handleAnalyticsClick = (property: PropertyData) => {
    setSelectedProperty(property);
    setIsAnalyticsModalOpen(true);
  };

  const handlePropertyUpdated = (updatedProperty: PropertyData) => {
    setProperties(prev => 
      prev.map(p => p.id === updatedProperty.id ? updatedProperty : p)
    );
  };

  const handlePropertyDeleted = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const transactions = [
    {
      id: 1,
      property: 'Beachfront Condo',
      type: 'Sale', 
      amount: 650000,
      date: '2024-12-15',
      status: 'completed',
    },
    {
      id: 2,
      property: 'Downtown Studio',
      type: 'Rental',
      amount: 2800,
      date: '2024-12-10',
      status: 'completed',
    },
    {
      id: 3,
      property: 'Office Building',
      type: 'Lease',
      amount: 12000,
      date: '2024-12-01',
      status: 'pending',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-primary-foreground">Active</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-foreground">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-secondary text-secondary-foreground">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Owner Dashboard | PropGrowthX</title>
        <meta
          name="description"
          content="Manage your properties, track performance, and handle transactions with PropGrowthX Owner Dashboard."
        />
      </Helmet>

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Owner Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage your properties and track performance
                </p>
              </div>

              <button className='mr-7 bg-destructive rounded p-1'
                onClick={()=>{ 
                  sessionStorage.removeItem('token')
                  sessionStorage.removeItem('id')
                  sessionStorage.removeItem('role')
                  navigate("/auth", { replace: true });
                }
              }
              >
                <LogOut/>
              </button>
            </div>

            <AddPropertyModal 
              open={isAddModalOpen} 
              onOpenChange={setIsAddModalOpen}
              onPropertyAdded={fetchProperties}
            />

            <EditPropertyModal
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
              property={selectedProperty}
              onPropertyUpdated={handlePropertyUpdated}
            />

            <DeletePropertyDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              property={selectedProperty}
              onPropertyDeleted={handlePropertyDeleted}
            />

            <PropertyAnalyticsModal
              open={isAnalyticsModalOpen}
              onOpenChange={setIsAnalyticsModalOpen}
              property={selectedProperty}
            />

            {/* Quick Navigation Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Link
                to="/dashboard/owner/properties"
                className="bg-card border border-border rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <Building2 className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">All Properties</h3>
                      <p className="text-sm text-muted-foreground">View and manage all your listings</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>
              </Link>
              <Link
                to="/dashboard/owner/transactions"
                className="bg-card border border-border rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <FileText className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Transactions & Payments</h3>
                      <p className="text-sm text-muted-foreground">Track sales, rentals & rent payments</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>
              </Link>
            </div>

            {/* Stats Grid */}
            {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <div className="text-xs text-success mt-2">{stat.change}</div>
                </div>
              ))}
            </div> */}

            {/* Properties Table */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  My Properties
                </h2>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search properties..."
                    className="max-w-xs"
                  />
                  <Button variant="outline" asChild>
                    <Link to="/dashboard/owner/properties">View All</Link>
                  </Button>
                </div>
              </div>

              {properties.length > 0 ? (
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rent</TableHead>
                      <TableHead>Status</TableHead>
                      {/* <TableHead>Views</TableHead> */}
                      <TableHead>Inquiries</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">
                              {property.property_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {property.city}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{property.property_type}</TableCell>
                        <TableCell className="font-medium">
                          {property.monthly_rent ? property.monthly_rent.toLocaleString() : 0}
                          {property.listing_type !== 'For Sale' && '/mo'}
                        </TableCell>
                        <TableCell>{property.status}</TableCell>
                        {/* <TableCell>{property.views}</TableCell> */}
                        <TableCell>{0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleAnalyticsClick(property)}
                              title="View Analytics"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Button> */}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditClick(property)}
                              title="Edit Property"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive"
                              onClick={() => handleDeleteClick(property)}
                              title="Delete Property"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>)
              :
              (
                <p className='text-center'>You have no properties listed</p>
              )}
            </div>

            {/* Transaction History */}
            {/* <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Recent Transactions
                </h2>
                <Button variant="outline" asChild>
                  <Link to="/dashboard/owner/transactions">View All</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        {tx.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Clock className="w-5 h-5 text-warning" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {tx.property}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tx.type} • {tx.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">
                        ${tx.amount.toLocaleString()}
                      </div>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OwnerDashboard;
