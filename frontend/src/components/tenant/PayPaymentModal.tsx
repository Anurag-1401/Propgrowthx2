import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Transaction } from "@/pages/dashboard/tenant/TenantTransactions";

interface PayPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

const PayPaymentModal = ({
  open,
  onOpenChange,
  transaction,
}: PayPaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("id");

  if (!transaction) return null;

  const handlePay = async () => {
    setLoading(true);

    const { error } = await supabase.from("payments").insert([
      {
        user_id: userId,
        property_id: transaction.property_id,
        type: transaction.type,
        amount: Number(transaction.amount),
        status: "completed",
        date: new Date().toISOString(),
        payment_method: "UPI",
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
          <div className="text-sm text-muted-foreground">
            Property: <span className="text-foreground">{transaction.property_id}</span>
          </div>

          <div className="text-sm text-muted-foreground">
            Type: <span className="capitalize text-foreground">{transaction.type}</span>
          </div>

          <div className="text-xl font-bold text-foreground">
            ₹{Number(transaction.amount).toLocaleString()}
          </div>

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
