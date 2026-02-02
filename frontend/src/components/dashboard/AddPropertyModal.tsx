import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Building2, Upload, X } from 'lucide-react';
import { supabase } from "@/lib/supabase";

const propertySchema = z.object({
  name: z.string().min(3, 'Property name must be at least 3 characters').max(100),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200),
  city: z.string().min(2, 'City is required').max(50),
  state: z.string().min(2, 'State is required').max(50),
  zipCode: z.string().min(5, 'Valid zip code required').max(10),
  listing_type: z.enum(['For Rent', 'For Lease']),
  status: z.enum(['available','under maintenance','occupied']),
  due_date: z.date().optional(),
  property_type: z.enum(['Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Commercial', 'Penthouse', 'Cabin', 'Villa']),
  monthly_rent: z.string().min(1, 'Price is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Price must be a positive number'),
  bedrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Must be 0 or more'),
  bathrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Must be 0 or more'),
  otherrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Must be 0 or more'),
  floors: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Must be 0 or more'),
  area: z.string().min(1, 'Area is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Area must be a positive number'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  amenities: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPropertyModal = ({ open, onOpenChange}: AddPropertyModalProps) => {
  const [images, setImages] = useState<(string)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = sessionStorage.getItem('id');

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      listing_type: 'For Rent',
      property_type: 'Apartment',
      status:'available',
      due_date:new Date(),
      monthly_rent: '',
      bedrooms: '0',
      bathrooms: '1',
      otherrooms: '1',
      floors: '1',
      area: '',
      description: '',
      amenities: '',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      // ✅ STRICT TYPE GUARD
      if (typeof result === "string") {
        setImages((prev) => {
          const updated: string[] = [...prev, result];
          return updated.slice(0, 5);
        });
      }
    };

    // ✅ THIS ENSURES BASE64 STRING
    reader.readAsDataURL(file);
  });

  e.target.value = "";
};



  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };



  const onSubmit = async (data: PropertyFormValues) => {
  setIsSubmitting(true);

  const { error } = await supabase.from("properties").insert([
  {
    owner_id: id,
    property_name: data.name,
    address: data.address,
    city: data.city, 
    state: data.state,
    zip_code: data.zipCode,

    listing_type: data.listing_type,
    property_type: data.property_type,

    monthly_rent: Number(data.monthly_rent),
    bedrooms: Number(data.bedrooms),
    bathrooms: Number(data.bathrooms),
    otherrooms:Number(data.otherrooms),
    floors:Number(data.floors),
    total_area: Number(data.area),
    due_date: data.due_date,

    description: data.description,
    amenities: data.amenities ? data.amenities.split(",") : [],

    status: data.status,
    images: images,

    water_available: true,
    electricity_available: true,
  },
]);


  if (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
      console.log("submiting error",error)

  } else {
    toast({
      title: "Property Added",
      description: `${data.name} is now live`,
    });

    form.reset();
    setImages([]);
    onOpenChange(false);
  }

  setIsSubmitting(false);
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="w-5 h-5 text-secondary" />
            Add New Property
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Property Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground border-b border-border pb-2">
                Basic Information
              </h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Modern Downtown Loft" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="listing_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Listing Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* <SelectItem value="For Sale">For Sale</SelectItem> */}
                          <SelectItem value="For Rent">For Rent</SelectItem>
                          <SelectItem value="For Lease">For Lease</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Condo">Condo</SelectItem>
                          <SelectItem value="Townhouse">Townhouse</SelectItem>
                          <SelectItem value="Studio">Studio</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Penthouse">Penthouse</SelectItem>
                          <SelectItem value="Cabin">Cabin</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* <SelectItem value="For Sale">For Sale</SelectItem> */}
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="under maintenance">Under Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monthly_rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Rent per Month
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ₹
                        </span>
                        <Input placeholder="8500" className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Due Date
                  </FormLabel>
                  <FormControl>
                      <Input type="date" placeholder='Enter a date'
                      value={
                        field.value ? new Date(field.value).toISOString().split("T")[0] : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      className="pl-3"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground border-b border-border pb-2">
                Location
              </h3>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Lokmanya Nagar,Panvel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="4413XX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground border-b border-border pb-2">
                Property Details
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area (sqft)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="otherrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Rooms</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="floors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floors</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your property in detail..."
                        className="min-h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Parking, Pool, Gym, Balcony" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground border-b border-border pb-2">
                Property Images
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

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-secondary hover:bg-secondary/90"
              >
                {isSubmitting ? 'Adding Property...' : 'Add Property'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyModal;
