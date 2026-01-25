import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { useData } from "@/context/dataContext";

interface PayPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PayPaymentModal = ({
  open,
  onOpenChange,
}: PayPaymentModalProps) => {
  const { properties,profile ,id} = useData();
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("id");

  const [propertyId, setPropertyId] = useState("");
  const [type, setType] = useState("rent");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

    const myProperties = properties.filter((p)=>p.buyer_id === id)


  useEffect(() => {
  const selected = myProperties.find(p => p.id === propertyId);
  if (selected) {
    setAmount(String(selected.monthly_rent));
  }
}, [propertyId]);

  const handlePay = async () => {
     if (!propertyId || !amount) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("payments").insert([
      {
        tenant_id: userId,
        owner_id: properties.find(p => p.id === propertyId)?.owner_id,
        property_id: propertyId,
        type: type,
        amount: Number(amount),
        status: "completed",
        date: new Date().toISOString(),
        payment_method: "UPI",
        due_date: myProperties.find(p => p.id === propertyId)?.due_date || null,
        reference_no: `TXN-${Date.now()}`,
      },
    ]);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Your payment has been recorded",
      });

      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <label htmlFor="Select Property"></label>
          <Select value={propertyId} onValueChange={setPropertyId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
          <SelectContent>
            {myProperties.map((property) => (
              <SelectItem key={property.id} value={property.id.toString()}>
                {property.property_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

          <label htmlFor="Payment Type"></label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <label htmlFor="Amount"></label>
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          <label htmlFor="Payment Method"></label>
           <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="Card">Card</SelectItem>
              <SelectItem value="NetBanking">Net Banking</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayPaymentModal;
