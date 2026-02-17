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
import { PropertyData } from "../dashboard/EditPropertyModal";
import { Home, CreditCard, Banknote, Smartphone, Building2, CheckCircle2, AlertCircle, X } from "lucide-react";

interface PayPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PayPaymentModal = ({
  open,
  onOpenChange,
}: PayPaymentModalProps) => {
  const { properties, id } = useData();
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("id");

  const [propertyId, setPropertyId] = useState("");
  const [type, setType] = useState("rent");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [myProperties, setMyProperties] = useState<PropertyData[]>([]);

  useEffect(() => {
    setMyProperties(properties.filter((p) => p.buyer_id === id));
  }, [id, properties]);

  useEffect(() => {
    const selected = myProperties.find(p => p.id === propertyId);
    if (selected) {
      setAmount(String(selected.monthly_rent));
    }
  }, [myProperties, propertyId]);

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
        payment_method: paymentMethod,
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
        title: "Success!",
        description: "Payment recorded successfully",
      });

      setPropertyId("");
      setType("rent");
      setAmount("");
      setPaymentMethod("UPI");
      onOpenChange(false);
    }

    setLoading(false);
  };

  const selectedProperty = myProperties.find(p => p.id === propertyId);
  const paymentAmount = Number(amount) || 0;
  const isFormValid = propertyId && amount;

  const paymentMethods = [
    { value: "UPI", label: "UPI", icon: Smartphone },
    { value: "Card", label: "Card", icon: CreditCard },
    { value: "NetBanking", label: "Net Banking", icon: Building2 },
    { value: "Cash", label: "Cash", icon: Banknote },
  ];

  const transactionTypes = [
    { value: "rent", label: "Rent", color: "bg-red-100 text-red-700 border-red-200" },
    { value: "deposit", label: "Deposit", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { value: "maintenance", label: "Maintenance", color: "bg-purple-100 text-purple-700 border-purple-200" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white gap-0">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-5 border-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-white">Make a Payment</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Property Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
              <Home className="w-3.5 h-3.5 text-red-600" />
              Property
            </label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger className="border-gray-200 focus:ring-red-600 focus:ring-offset-0 rounded-lg h-10 bg-gray-50 hover:bg-white transition-colors text-sm">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-gray-200">
                {myProperties.length === 0 ? (
                  <div className="p-3 text-center text-xs text-gray-600">
                    No properties available
                  </div>
                ) : (
                  myProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()} className="text-sm">
                      {property.property_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-red-600" />
              Payment Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {transactionTypes.map((tx) => (
                <button
                  key={tx.value}
                  onClick={() => setType(tx.value)}
                  className={`px-3 py-2 rounded-lg border-2 font-medium text-xs transition-all duration-300 ${
                    type === tx.value
                      ? `${tx.color} border-current`
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {tx.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
              <Banknote className="w-3.5 h-3.5 text-red-600" />
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-red-600">₹</span>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 h-10 border-gray-200 focus:ring-red-600 focus:ring-offset-0 rounded-lg bg-gray-50 hover:bg-white transition-colors text-sm font-semibold"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Payment Method</label>
            <div className="grid grid-cols-4 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      paymentMethod === method.value
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${
                      paymentMethod === method.value
                        ? "text-red-600"
                        : "text-gray-600"
                    }`} strokeWidth={1.5} />
                    <p className="text-xs font-medium text-gray-900">{method.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Info */}
          {isFormValid && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-green-900">Ready to pay</p>
                  <p className="text-xs text-green-700 mt-1">
                    ₹{paymentAmount.toLocaleString()} for {selectedProperty?.property_name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-gray-200 text-gray-900 hover:bg-gray-50 rounded-lg font-semibold text-sm h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePay}
              disabled={loading || !isFormValid}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm h-10 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Pay ₹${paymentAmount.toLocaleString() || "0"}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayPaymentModal;