import { useState} from 'react';
import {
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddComplaintModal from "@/components/tenant/AddComplaintModal";
import { Complaint } from '@/components/tenant/AddComplaintModal';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ComplaintList from '@/components/dashboard/ComplaintList';
import { useData } from '@/context/dataContext';



const TenantComplaints = () => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const {complaints,id} = useData();



  return (
    <>
      <Helmet>
        <title>My Complaints | PropGrowthX</title>
        <meta name="description" content="Submit and track your property complaints and maintenance requests." />
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
                  <h1 className="text-3xl font-bold text-foreground">My Complaints</h1>
                  <p className="text-muted-foreground">Submit and track your complaints</p>
                </div>
              </div>
                  <Button onClick={() => setIsAddModalOpen(true)}
                    className="bg-secondary hover:bg-secondary/90">
                    <Plus className="w-5 h-5 mr-2" />
                    New Complaint
                  </Button>
            </div>

            <AddComplaintModal
            open={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            />

             <ComplaintList
              complaints={complaints.filter((c)=> c.tenant_id === id)}
              setComplaints={useData().setComplaints}
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

export default TenantComplaints;
