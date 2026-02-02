import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
} from 'lucide-react';
import { Complaint } from '@/components/tenant/AddComplaintModal';
import ComplaintList from '@/components/dashboard/ComplaintList';
import { useData } from '@/context/dataContext';
import DashboardSkeleton from '@/pages/SkeletonLoading';

const OwnerComplaints = () => {
  const {complaints,setComplaints,id,loading} = useData();

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  if(loading) return <DashboardSkeleton/>

  const ownerComp = complaints.filter(c => c.owner_id === id);

  const stats = {
    total: ownerComp.length,
    open: ownerComp.filter(c => c.status === 'open').length,
    inProgress: ownerComp.filter(c => c.status === 'in-progress').length,
    resolved: ownerComp.filter(c => c.status === 'resolved').length,
    urgent: ownerComp.filter(c => c.priority === 'urgent' && c.status !== 'resolved' && c.status !== 'closed').length,
  };

  return (
    <>
      <Helmet>
        <title>Manage Complaints | PropGrowthX</title>
        <meta name="description" content="Manage and respond to tenant complaints and maintenance requests." />
      </Helmet>

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/dashboard/owner">
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Manage Complaints</h1>
                  <p className="text-muted-foreground">View and respond to tenant complaints</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-card border border-border rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-warning">{stats.open}</div>
                <div className="text-sm text-muted-foreground">Open</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-secondary">{stats.inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-success">{stats.resolved}</div>
                <div className="text-sm text-muted-foreground">Resolved</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-destructive">{stats.urgent}</div>
                <div className="text-sm text-muted-foreground">Urgent</div>
              </div>
            </div>

 
            {/* Complaints List */}
            <ComplaintList
            complaints={ownerComp}
            setComplaints={setComplaints}
            onSelect={(complaint) => {
              setSelectedComplaint(complaint);
              setIsDetailModalOpen(true);
            }}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />

          </div>
        </div>
      </Layout>
    </>
  );
};

export default OwnerComplaints;
