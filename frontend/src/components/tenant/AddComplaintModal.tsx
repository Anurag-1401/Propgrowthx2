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
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useData } from "@/context/dataContext";
import { PropertyData } from "../dashboard/EditPropertyModal";

export interface Complaint {
  id: string;
  tenant_id:string
  owner_id?:string
  property_id: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  images:string[];
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
  const {properties,id} = useData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const tenantId = sessionStorage.getItem("id");
  const [images, setImages] = useState<(string)[]>([]);
  const [myProperties,setMyProperties] = useState<PropertyData[]>([]);
  
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

  useEffect(()=>{
    setMyProperties(properties.filter((p)=>p.buyer_id === id));
  },[id, properties])
  
 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setImages((prev) => {
          const updated: string[] = [...prev, result];
          return updated.slice(0, 5);
        });
      }
    };

    reader.readAsDataURL(file);
  });

  e.target.value = "";
};



  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };


   const onSubmit = async (data: ComplaintFormValues) => {
    setIsSubmitting(true);

    const { error } = await supabase.from("complaints").insert([
      {
        tenant_id: tenantId,
        owner_id: properties.find((p) => p.id === data.property_id)?.owner_id || null,
        property_id: data.property_id,
        category: data.category,
        priority: data.priority,
        subject: data.subject,
        description: data.description,
        status: "open",
        images: images,
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
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add New Complaint</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
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
                          {property.property_name}
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

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground border-b border-border pb-2">
                Complaint Images
              </h3>

                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-secondary/50 transition-colors">
                  <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload images (max 5)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB each
                  </p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        className="h-32 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>removeImage(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

              )}
            </div>

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
