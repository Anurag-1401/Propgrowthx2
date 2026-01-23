import { useState ,useEffect} from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  ArrowLeft,
  Plus,
  Home,
  Calendar,
  User,
  Send,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddComplaintModal from "@/components/tenant/AddComplaintModal";
import { Complaint } from '@/components/tenant/AddComplaintModal';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Layout from '@/components/layout/Layout';
import ComplaintList from '@/components/dashboard/ComplaintList';
import { getPriorityBadge, getStatusBadge} from '@/components/dashboard/ComplaintList';
import { Textarea } from '@/components/ui/textarea';



const TenantComplaints = () => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const tenantId = sessionStorage.getItem("id");
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchComplaints();
    }, []);
  
  const fetchComplaints = async () => {
  setLoading(true);

  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    toast({
      title: "Error fetching complaints",
      description: error.message,
      variant: "destructive",
    });
  } else {
    setComplaints(data ?? []);
    console.log("Fetched complaints:", data);
  }

  setLoading(false);
};

const handleTenantReply = async () => {
  if (!replyText.trim() || !selectedComplaint) return;

  const newReply = {
    from: 'Tenant',
    message: replyText.trim(),
    date: new Date().toISOString().split('T')[0],
  };

  setSending(true);

  const { error } = await supabase
    .from('complaints')
    .update({
      responses: [...selectedComplaint.responses, newReply],
      updated_at: new Date().toISOString(),
    })
    .eq('id', selectedComplaint.id);

  if (!error) {
    setSelectedComplaint(prev =>
      prev
        ? { ...prev, responses: [...prev.responses, newReply] }
        : prev
    );

    setReplyText('');
  }

  setSending(false);
};


  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.property_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              complaints={complaints}
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

export default TenantComplaints;
