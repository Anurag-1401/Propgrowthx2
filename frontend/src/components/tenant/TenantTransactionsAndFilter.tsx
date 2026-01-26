import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Home,
  Download,
  CreditCard,
  ArrowUpRight,
  IndianRupee,
} from 'lucide-react';
import PayPaymentModal from '@/components/tenant/PayPaymentModal';
import { Transaction } from '@/pages/dashboard/tenant/TenantTransactions';
import { useData } from '@/context/dataContext';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const computeTransactionFilters = (
  transactions: Transaction[],
  searchTerm: string,
  typeFilter: string
) => {
  /* ---------------- helpers ---------------- */
  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const today = new Date();

  /* ---------------- completed rent ---------------- */
  const completedRentByProperty = transactions
    .filter(tx => tx.type === "rent" && tx.status === "completed")
    .reduce<Record<string, Transaction[]>>((acc, tx) => {
      acc[tx.property_id] ||= [];
      acc[tx.property_id].push(tx);
      return acc;
    }, {});

  const derivedRentTransactions: Transaction[] = [];

  Object.entries(completedRentByProperty).forEach(([propertyId, rents]) => {
    const lastPaid = rents
      .map(r => new Date(r.date))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    for (let i = 1; i <= 3; i++) {
      const due = addMonths(lastPaid, i);

      derivedRentTransactions.push({
        id: Number(`999${propertyId.slice(0, 3)}${i}`),
        property_id: propertyId,
        type: "rent",
        amount: rents[0].amount,
        date: formatDate(due),
        due_date: formatDate(due),
        status: due < today ? "overdue" : "upcoming",
      });
    }
  });

  /* ---------------- merged ---------------- */
  const allTransactions: Transaction[] = [
    ...transactions,
    ...derivedRentTransactions.filter(
      dt =>
        !transactions.some(
          t =>
            t.type === "rent" &&
            t.property_id === dt.property_id &&
            t.due_date === dt.due_date
        )
    ),
  ];

  /* ---------------- text + type filter ---------------- */
  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch =
      tx.property_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.reference_no?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  /* ---------------- date helpers ---------------- */
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const nextMonth = new Date(currentYear, currentMonth + 1, 1);

  /* ---------------- tabs ---------------- */
  const pastTabTransactions = allTransactions.filter(tx => {
    if (tx.status !== "completed") return false;
    const txDate = new Date(tx.date);
    return txDate.getMonth() === prevMonth && txDate.getFullYear() === prevYear;
  });

  const currentTabTransactions = allTransactions.filter(tx => {
    const baseDate = tx.due_date ? new Date(tx.due_date) : new Date(tx.date);
    return (
      baseDate.getMonth() === currentMonth &&
      baseDate.getFullYear() === currentYear &&
      ["completed", "pending", "overdue"].includes(tx.status)
    );
  });

  const upcomingTabTransactions = allTransactions.filter(tx => {
    if (!tx.due_date) return false;
    const due = new Date(tx.due_date);
    return (
      tx.status === "upcoming" &&
      due.getMonth() === nextMonth.getMonth() &&
      due.getFullYear() === nextMonth.getFullYear()
    );
  });

  const allTabTransactions = [
    ...pastTabTransactions,
    ...currentTabTransactions,
    ...upcomingTabTransactions,
  ];

  /* ---------------- payments ---------------- */
  const toNumber = (v: string | number | undefined) => Number(v || 0);

  const totalPaidThisYear = allTransactions
    .filter(
      tx =>
        tx.status === "completed" &&
        new Date(tx.date).getFullYear() === currentYear
    )
    .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

  const pendingPayments = allTransactions
    .filter(tx => tx.status === "pending")
    .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

  const overduePayments = allTransactions
    .filter(tx => tx.status === "overdue")
    .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

  const upcomingPayments = allTransactions
    .filter(tx => tx.status === "upcoming")
    .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  /* ---------------- RETURN EVERYTHING ---------------- */
  return {
    completedRentByProperty,
    derivedRentTransactions,
    allTransactions,
    filteredTransactions,
    pastTabTransactions,
    currentTabTransactions,
    upcomingTabTransactions,
    allTabTransactions,
    overdueTransactions: allTransactions.filter(tx => tx.status === "overdue"),
    upcomingTransactions: allTransactions
      .filter(tx => tx.status === "upcoming")
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
      .slice(0, 3),
    totalPaidThisYear,
    pendingPayments,
    overduePayments,
    upcomingPayments,
    threeMonthsFromNow,
  };
};

const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-primary-foreground">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-foreground">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive text-destructive-foreground">Overdue</Badge>;
      case 'upcoming':
        return <Badge className="bg-secondary text-secondary-foreground">Upcoming</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'rent':
        return <Badge variant="outline" className="border-secondary text-secondary">Rent</Badge>;
      case 'purchase':
        return <Badge variant="outline" className="border-success text-success">Purchase</Badge>;
      case 'deposit':
        return <Badge variant="outline" className="border-primary text-primary">Deposit</Badge>;
      case 'maintenance':
        return <Badge variant="outline">Maintenance</Badge>;
      case 'utility':
        return <Badge variant="outline">Utility</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

export const TransactionTable = ({ transactions}: TransactionTableProps) => {
  const {properties} = useData();
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return(
    <>
     <PayPaymentModal
        open={payModalOpen}
        onOpenChange={setPayModalOpen}
      />

  {transactions.length === 0 ? (
      <div>
      <div className="p-12 text-center">
        <IndianRupee className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No transactions found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search term</p>
      </div>
      <div className='text-center p-12'>
      <h4 className="text-md font-semibold text-foreground mb-2">Make your 1st Payment</h4>
      <Button
        className="bg-secondary hover:bg-secondary/90"
        onClick={() => setPayModalOpen(true)}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Pay Rent
      </Button>

      </div>
      </div>) : (
        <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{properties.find(p => p.id === tx.property_id)?.property_name}</span>
                </div>
              </TableCell>
              <TableCell>{getTypeBadge(tx.type)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {tx.status === 'completed' ? (
                    <ArrowUpRight className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-semibold text-foreground">₹{tx.amount.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{tx.date}</TableCell>
              <TableCell className="text-muted-foreground">{tx.due_date?.split("T")[0] || '-'}</TableCell>
              <TableCell>{getStatusBadge(tx.status)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{tx.reference_no || '-'}</TableCell>
              <TableCell className="text-right">
                {(tx.status === 'pending' || tx.status === 'overdue' || tx.status === 'upcoming') && (
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90" 
                  onClick={() => {
                      setSelectedTx(tx);
                      setPayModalOpen(true);
                    }}>
                    Pay Now
                  </Button>
                )}
                {tx.status === 'completed' && (
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )}
  </>
  )
};