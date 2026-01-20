import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export interface Complaint {
  id: string;
  tenant_id:string
  property_id: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  responses: { date: string; message: string; from: string }[];
}

const complaintSchema = z.object({
  property_id: z.string().min(1, "Select a property"),
  category: z.string().min(1, "Select category"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  subject: z.string().min(3),
  description: z.string().min(10),
  status: z.enum(["open", "in-progress", "resolved", "closed"]),
});

export type ComplaintFormValues = z.infer<typeof complaintSchema>;

interface AddComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}



  const myProperties = [
    { id: "70040945-305b-471f-936c-a808a0e439c9", name: 'Urban Loft, Seattle' },
    { id: "00000000-0000-0000-0000-000000000111", name: 'Waterfront Condo, Miami' },
  ];

  
const categories = [
  "Maintenance",
  "Appliances",
  "Plumbing",
  "Electrical",
  "Security",
  "Pest Control",
  "Noise Complaint",
  "Other",
];


const AddComplaintModal = ({
  open,
  onOpenChange,
}: AddComplaintModalProps) => {

     const [isSubmitting, setIsSubmitting] = useState(false);
  const tenantId = sessionStorage.getItem("id");

    const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      property_id: "",
      category: "Maintenance",
      priority: "low",
      subject: "",
      description: "",
      status: "open",
    },
  });

   const onSubmit = async (data: ComplaintFormValues) => {
    setIsSubmitting(true);

    const { error } = await supabase.from("complaints").insert([
      {
        tenant_id: tenantId,
        property_id: data.property_id,
        category: data.category,
        priority: data.priority,
        subject: data.subject,
        description: data.description,
        status: "open",
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Complaint Submitted",
        description: "We will respond shortly",
      });

      form.reset();
      onOpenChange(false);
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Complaint</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="property_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {myProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toString()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Water leakage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-secondary">
                {isSubmitting ? (
                  "Submitting..."
              ) : (
                "Submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComplaintModal;
