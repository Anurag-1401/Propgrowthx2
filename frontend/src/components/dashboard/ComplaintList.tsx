/* eslint-disable react-refresh/only-export-components */

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Home,
  Calendar,
  User,
  XCircle,
  Send,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Complaint } from '@/components/tenant/AddComplaintModal';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const getStatusBadge = (status: string) => {
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

  export const getPriorityBadge = (priority: string) => {
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

  export const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-secondary" />;
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-muted-foreground" />;
      default:
        return <MessageSquare className="w-5 h-5 text-muted-foreground" />;
    }
  };



interface ComplaintListProps {
  complaints?: Complaint[];
  setComplaints?: (complaints: Complaint[]) => void;
  onSelect?: (complaint: Complaint) => void;

  searchTerm?: string;
  setSearchTerm?: (v: string) => void;

  statusFilter?: string;
  setStatusFilter?: (v: string) => void;

  priorityFilter?: string;
  setPriorityFilter?: (v: string) => void;
}


export default function ComplaintList({
  complaints,
  setComplaints,
  onSelect,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: ComplaintListProps) {
    const { toast } = useToast();
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');

  const isOwner = sessionStorage.getItem("role") === "owner";

  const safeSearch = searchTerm ?? "";
  const safeStatus = statusFilter ?? "all";
  const safePriority = priorityFilter ?? "all";

const filteredComplaints = (complaints ?? []).filter((complaint) => {
  const subject = complaint.subject ?? "";
  const property = complaint.property_id ?? "";

  const matchesSearch =
    subject.toLowerCase().includes(safeSearch.toLowerCase()) ||
    property.toLowerCase().includes(safeSearch.toLowerCase());

  const matchesStatus =
    safeStatus === "all" || complaint.status === safeStatus;

  const matchesPriority =
    safePriority === "all" || complaint.priority === safePriority;

  return matchesSearch && matchesStatus && matchesPriority;
});

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

  const updated = complaints.map((c) =>
  c.id === data.id ? data : c
);

setComplaints(updated);

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
      from: isOwner ? "Owner" : "Tenant",
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

  const updated = complaints.map((c) =>
  c.id === data.id ? data : c
);

setComplaints(updated);

  setSelectedComplaint(data);
  setResponseText("");

    setResponseText('');
    toast({
      title: 'Response Sent',
      description: 'Your response has been sent to the tenant.',
    });
    setLoading(false);
  };

return(
    <>
    <div className="space-y-4">

         {/* Filters */}
            <div className="bg-card border border-border rounded-2xl p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by subject, property, or tenant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
    {filteredComplaints.length === 0 ? (
      <div className="bg-card border border-border rounded-2xl p-12 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No complaints found</h3>
        <p className="text-muted-foreground">
          {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
            ? 'Try adjusting your filters'
            : 'No complaints have been submitted yet'}
        </p>
      </div>
    ) : (
      filteredComplaints.map((complaint) => (
        <div
          key={complaint.id}
          className="bg-card border border-border rounded-2xl p-6 hover:border-secondary/50 transition-colors cursor-pointer"
          onClick={() => {
          setSelectedComplaint(complaint);
          setIsDetailModalOpen(true);
          onSelect?.(complaint);
        }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                {getStatusIcon(complaint.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{complaint.subject}</h3>
                  {complaint.priority === 'urgent' && (
                    <span className="text-xs text-destructive font-medium">⚠️ URGENT</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {complaint.tenant_id}
                  </span>
                  <span className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    {complaint.property_id}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>
                {complaint.images?.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {complaint.images.slice(0, 3).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`complaint-${idx}`}
                      className="h-16 w-16 rounded-lg object-cover border"
                    />
                  ))}
              
                  {complaint.images.length > 3 && (
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      +{complaint.images.length - 3}
                    </div>
                  )}
                </div>
              )}

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
                  {complaint.responses.length} conversation{complaint.responses.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      ))
    )}
  </div>

    {/* Complaint Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getStatusIcon(selectedComplaint.status)}
                  {selectedComplaint.subject}
                </DialogTitle>
                <DialogDescription>
                  Submitted by {selectedComplaint.tenant_id} - on {selectedComplaint.created_at.split('T')[0]}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Complaint Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Property</Label>
                    <p className="font-medium">{selectedComplaint.property_id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p className="font-medium">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Priority</Label>
                    <div className="mt-1">{getPriorityBadge(selectedComplaint.priority)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Select
                        value={selectedComplaint.status}
                        onValueChange={(value) => handleStatusChange(selectedComplaint.id, value as Complaint['status'])}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{selectedComplaint.description}</p>
                </div>

                {/* Tenant Info */}
                {isOwner && <div className="p-4 bg-accent rounded-lg">
                  <Label className="text-muted-foreground">Tenant Contact</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedComplaint.tenant_id}</p>
                    </div>
                  </div>
                </div>}

                {/* Conversation */}
                  <div>
                    <Label className="text-muted-foreground mb-3 block">Conversation</Label>

                    {selectedComplaint.responses.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        No responses yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {selectedComplaint.responses.map((response, index) => {
                          const isTenant = response.from === "Tenant";
                        
                          return (
                            <div
                              key={index}
                              className={isOwner ?
                                `flex ${isTenant ? "justify-start" :"justify-end" }` : 
                                `flex ${isTenant ? "justify-end" :"justify-start" }`
                              }
                            >
                              <div
                                className={`rounded-xl p-4 max-w-[85%] ${
                                  isTenant
                                    ? "bg-muted"
                                    : "bg-secondary text-secondary-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1 text-xs opacity-80">
                                  <User className="w-4 h-4" />
                                  <span className="font-medium">{response.from}</span>
                                  <span>{new Date(response.date).toLocaleString()}</span>
                                </div>
                              
                                <p className="text-sm">{response.message}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>


                {/* Send Response */}
                {selectedComplaint.status !== 'closed' && (
                  <div className="border-t pt-4">
                    <Label className="mb-2 block">Send Response</Label>
                    <div className="flex gap-2">
                      <Textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response to the tenant..."
                        rows={3}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-3">
                      <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                        Close
                      </Button>
                      <Button
                        className="bg-secondary hover:bg-secondary/90"
                        onClick={handleSendResponse}
                        disabled={!responseText.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {loading ? 'Sending...' : 'Send Response'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </>
  )
}