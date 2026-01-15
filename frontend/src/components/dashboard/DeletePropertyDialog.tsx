import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PropertyData } from '@/components/dashboard/EditPropertyModal';
import { supabase } from '../../lib/supabase';

interface DeletePropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: PropertyData | null;
  onPropertyDeleted?: (propertyId: string) => void;
}

const DeletePropertyDialog = ({ 
  open, 
  onOpenChange, 
  property,
  onPropertyDeleted 
}: DeletePropertyDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!property) return;
    
    setIsDeleting(true);
    
    const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', property.id);

  if (error) {
    toast({
      title: 'Error deleting property',
      description: error.message,
      variant: 'destructive',
    });
  } else {
    toast({
      title: 'Property Deleted',
      description: `${property.property_name} has been removed.`,
      variant: 'destructive',
    });
    onPropertyDeleted?.(property.id);
    onOpenChange(false);
  }

  setIsDeleting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete <strong className="text-foreground">{property?.property_name}</strong>?
            </p>
            <div className="bg-muted rounded-lg p-3 text-sm">
              <p><strong>Location:</strong> {property?.city}</p>
              <p><strong>Type:</strong> {property?.property_type}</p>
              <p><strong>Price:</strong> ${property?.monthly_rent?.toLocaleString()}</p>
            </div>
            <p className="text-destructive font-medium">
              This action cannot be undone. All data associated with this property including inquiries, analytics, and transaction history will be permanently removed.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Property'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePropertyDialog;
