import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  User,
  Send,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Complaint } from '@/components/tenant/AddComplaintModal';
import { supabase } from "@/lib/supabase";
import ComplaintList from '@/components/dashboard/ComplaintList';
import { getPriorityBadge,getStatusIcon } from '@/components/dashboard/ComplaintList';
import { set } from 'date-fns';

const OwnerComplaints = () => {
  const { toast } = useToast();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [responseText, setResponseText] = useState('');
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

  const handleStatusChange = async (
  complaintId: string,
  newStatus: Complaint["status"]
) => {

  setLoading(true);
  const { data, error } = await supabase
    .from("complaints")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", complaintId)
    .select()
    .single();

  if (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    setLoading(false);
    return;
  }

  setComplaints((prev) =>
    prev.map((c) => (c.id === data.id ? data : c))
  );

  setSelectedComplaint((prev) =>
    prev?.id === data.id ? data : prev
  );

  toast({
    title: "Status Updated",
    description: `Complaint status changed to ${newStatus}`,
  });
  setLoading(false);
};


  const handleSendResponse =async  () => {
    if (!responseText.trim() || !selectedComplaint) return;

    setLoading(true);
    const newResponse = {
      date: new Date().toISOString(),
      message: responseText,
      from: 'Property Owner',
    };

     const { data, error } = await supabase
    .from("complaints")
    .update({
      responses: [...(selectedComplaint.responses || []), newResponse],
      status:
        selectedComplaint.status === "open"
          ? "in-progress"
          : selectedComplaint.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", selectedComplaint.id)
    .select()
    .single();

  if (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    setLoading(false);
    return;
  }

  setComplaints((prev) =>
    prev.map((c) => (c.id === data.id ? data : c))
  );

  setSelectedComplaint(data);
  setResponseText("");

    setResponseText('');
    toast({
      title: 'Response Sent',
      description: 'Your response has been sent to the tenant.',
    });
    setLoading(false);
  };

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    urgent: complaints.filter(c => c.priority === 'urgent' && c.status !== 'resolved' && c.status !== 'closed').length,
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

export default OwnerComplaints;
