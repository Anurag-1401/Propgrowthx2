import { useState ,useEffect} from 'react';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Home,
  Calendar,
  User,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddComplaintModal from "@/components/tenant/AddComplaintModal";
import { Complaint } from '@/components/tenant/AddComplaintModal';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Layout from '@/components/layout/Layout';



const TenantComplaints = () => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const tenantId = sessionStorage.getItem("id");

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

    // {
    //   id: 1,
    //   property: 'Urban Loft, Seattle',
    //   category: 'Maintenance',
    //   priority: 'high',
    //   subject: 'Water leakage in bathroom',
    //   description: 'There is water leaking from the ceiling in the bathroom. It started yesterday and is getting worse.',
    //   status: 'in-progress',
    //   createdAt: '2025-01-10',
    //   updatedAt: '2025-01-12',
    //   responses: [
    //     { date: '2025-01-11', message: 'We have scheduled a plumber to visit tomorrow.', from: 'Property Manager' },
    //     { date: '2025-01-12', message: 'Plumber visited, issue identified. Repair scheduled for tomorrow.', from: 'Maintenance Team' },
    //   ],
    // },
    // {
    //   id: 2,
    //   property: 'Urban Loft, Seattle',
    //   category: 'Appliances',
    //   priority: 'medium',
    //   subject: 'AC not cooling properly',
    //   description: 'The air conditioning unit is running but not cooling the apartment effectively.',
    //   status: 'open',
    //   createdAt: '2025-01-08',
    //   updatedAt: '2025-01-08',
    //   responses: [],
    // },
    // {
    //   id: 3,
    //   property: 'Waterfront Condo, Miami',
    //   category: 'Security',
    //   priority: 'low',
    //   subject: 'Gate access code not working',
    //   description: 'The community gate access code has stopped working since last week.',
    //   status: 'resolved',
    //   createdAt: '2025-01-01',
    //   updatedAt: '2025-01-05',
    //   responses: [
    //     { date: '2025-01-02', message: 'New access code has been sent to your email.', from: 'Security Team' },
    //   ],
    // },



  
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
  }

  setLoading(false);
};

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-warning text-foreground">Open</Badge>;
      case 'in-progress':
        return <Badge className="bg-secondary text-secondary-foreground">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-success text-primary-foreground">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-destructive text-destructive-foreground">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-destructive/80 text-destructive-foreground">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-foreground">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-secondary" />;
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      default:
        return <MessageSquare className="w-5 h-5 text-muted-foreground" />;
    }
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

            {/* Filters */}
            <div className="bg-card border border-border rounded-2xl p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Complaints List */}
            <div className="space-y-4">
              {filteredComplaints?.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No complaints found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : "You haven't submitted any complaints yet"}
                  </p>
                </div>
              ) : (
                filteredComplaints?.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="bg-card border border-border rounded-2xl p-6 hover:border-secondary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                          {getStatusIcon(complaint.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{complaint.subject}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Home className="w-4 h-4" />
                            {complaint.property_id}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge variant="outline">{complaint.category}</Badge>
                            {getPriorityBadge(complaint.priority)}
                            {getStatusBadge(complaint.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground shrink-0">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {complaint.created_at}
                        </div>
                        {complaint.responses.length > 0 && (
                          <div className="flex items-center gap-1 text-secondary">
                            <MessageSquare className="w-4 h-4" />
                            {complaint.responses.length} response{complaint.responses.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Complaint Detail Modal */}
            <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                {selectedComplaint && (
                  <>
                    <DialogHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <DialogTitle>{selectedComplaint.subject}</DialogTitle>
                          <DialogDescription className="flex items-center gap-2 mt-1">
                            <Home className="w-4 h-4" />
                            {selectedComplaint.property_id}
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{selectedComplaint.category}</Badge>
                        {getPriorityBadge(selectedComplaint.priority)}
                        {getStatusBadge(selectedComplaint.status)}
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-2">Description</h4>
                        <p className="text-muted-foreground">{selectedComplaint.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created: {selectedComplaint.created_at}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Updated: {selectedComplaint.updated_at}
                        </div>
                      </div>

                      {selectedComplaint.responses.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-4">Responses</h4>
                          <div className="space-y-4">
                            {selectedComplaint.responses.map((response, index) => (
                              <div key={index} className="bg-muted rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                                    <User className="w-4 h-4 text-secondary" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-foreground text-sm">{response.from}</div>
                                    <div className="text-xs text-muted-foreground">{response.date}</div>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{response.message}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default TenantComplaints;
