import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Download,
  CreditCard,
  ArrowUpRight,
  IndianRupee,
  Calendar,
  Wallet,
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
  try {
  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const formatDate = (d: Date) => {
    if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
    return d.toISOString().split("T")[0];
  };

  const today = new Date();
  const validTransactions = Array.isArray(transactions) ? transactions : [];

  const completedRentByProperty = validTransactions
    .filter(tx => tx && tx.type === "rent" && tx.status === "completed" && tx.property_id && tx.date)
    .reduce<Record<string, Transaction[]>>((acc, tx) => {
      acc[tx.property_id] ||= [];
      acc[tx.property_id].push(tx);
      return acc;
    }, {});

  const derivedRentTransactions: Transaction[] = [];

  Object.entries(completedRentByProperty).forEach(([propertyId, rents]) => {
    if (!rents.length) return;
    
    const validDates = rents
      .map(r => {
        const d = new Date(r.date);
        return isNaN(d.getTime()) ? null : d;
      })
      .filter((d): d is Date => d !== null)
      .sort((a, b) => b.getTime() - a.getTime());

    if (!validDates.length) return;
    const lastPaid = validDates[0];

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

  const filteredTransactions = allTransactions.filter(tx => {
    if (!tx || !tx.property_id) return false;
    
    const matchesSearch =
      String(tx.property_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(tx.reference_no || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const nextMonth = new Date(currentYear, currentMonth + 1, 1);

  const pastTabTransactions = allTransactions.filter(tx => {
    if (!tx || tx.status !== "completed" || !tx.date) return false;
    const txDate = new Date(tx.date);
    if (isNaN(txDate.getTime())) return false;
    return txDate.getMonth() === prevMonth && txDate.getFullYear() === prevYear;
  });

  const currentTabTransactions = allTransactions.filter(tx => {
    if (!tx) return false;
    const baseDate = tx.due_date ? new Date(tx.due_date) : new Date(tx.date);
    if (isNaN(baseDate.getTime())) return false;
    return (
      baseDate.getMonth() === currentMonth &&
      baseDate.getFullYear() === currentYear &&
      ["completed", "pending", "overdue"].includes(tx.status)
    );
  });

  const upcomingTabTransactions = allTransactions.filter(tx => {
    if (!tx || !tx.due_date) return false;
    const due = new Date(tx.due_date);
    if (isNaN(due.getTime())) return false;
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

  const toNumber = (v: string | number | undefined) => Number(v || 0);

  const totalPaidThisYear = allTransactions
    .filter(
      tx =>
        tx && tx.status === "completed" && tx.date &&
        !isNaN(new Date(tx.date).getTime()) &&
        new Date(tx.date).getFullYear() === currentYear
    )
    .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

  const pendingPayments = allTransactions
    .filter(tx => tx && tx.status === "pending")
    .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

  const overduePayments = allTransactions
    .filter(tx => tx && tx.status === "overdue")
    .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

  const upcomingPayments = allTransactions
    .filter(tx => tx && tx.status === "upcoming")
    .reduce((sum, tx) => sum + toNumber(tx.amount), 0);

  return {
    completedRentByProperty,
    derivedRentTransactions,
    allTransactions,
    filteredTransactions,
    pastTabTransactions,
    currentTabTransactions,
    upcomingTabTransactions,
    allTabTransactions,
    overdueTransactions: allTransactions.filter(tx => tx && tx.status === "overdue"),
    upcomingTransactions: allTransactions
      .filter(tx => tx && tx.status === "upcoming" && tx.due_date)
      .sort((a, b) => {
        const dateA = new Date(a.due_date!);
        const dateB = new Date(b.due_date!);
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3),
    totalPaidThisYear,
    pendingPayments,
    overduePayments,
    upcomingPayments,
  };
  } catch (error) {
    console.error("Error in computeTransactionFilters:", error);
    return {
      completedRentByProperty: {},
      derivedRentTransactions: [],
      allTransactions: [],
      filteredTransactions: [],
      pastTabTransactions: [],
      currentTabTransactions: [],
      upcomingTabTransactions: [],
      allTabTransactions: [],
      overdueTransactions: [],
      upcomingTransactions: [],
      totalPaidThisYear: 0,
      pendingPayments: 0,
      overduePayments: 0,
      upcomingPayments: 0,
    };
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return {
        badge: <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs">Completed</Badge>,
        color: 'text-green-600',
        bgColor: 'hover:bg-green-50/50'
      };
    case 'pending':
      return {
        badge: <Badge className="bg-amber-100 text-amber-800 border border-amber-200 text-xs">Pending</Badge>,
        color: 'text-amber-600',
        bgColor: 'hover:bg-amber-50/50'
      };
    case 'overdue':
      return {
        badge: <Badge className="bg-red-100 text-red-800 border border-red-200 text-xs">Overdue</Badge>,
        color: 'text-red-600',
        bgColor: 'hover:bg-red-50/50'
      };
    case 'upcoming':
      return {
        badge: <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">Upcoming</Badge>,
        color: 'text-blue-600',
        bgColor: 'hover:bg-blue-50/50'
      };
    default:
      return {
        badge: <Badge className="bg-gray-100 text-gray-800 border border-gray-200 text-xs">{status}</Badge>,
        color: 'text-gray-600',
        bgColor: 'hover:bg-gray-50/50'
      };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'rent':
      return { badge: <Badge className="bg-red-100 text-red-800 border border-red-200 text-xs font-medium">Rent</Badge> };
    case 'deposit':
      return { badge: <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs font-medium">Deposit</Badge> };
    case 'maintenance':
      return { badge: <Badge className="bg-purple-100 text-purple-800 border border-purple-200 text-xs font-medium">Maintenance</Badge> };
    case 'utility':
      return { badge: <Badge className="bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-medium">Utility</Badge> };
    default:
      return { badge: <Badge className="bg-gray-100 text-gray-800 border border-gray-200 text-xs font-medium">{type}</Badge> };
  }
};

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const { properties } = useData();
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const validTransactions = Array.isArray(transactions) ? transactions : [];
  const validProperties = Array.isArray(properties) ? properties : [];

  if (validTransactions.length === 0) {
    return (
      <>
        <PayPaymentModal open={payModalOpen} onOpenChange={setPayModalOpen} />
        
        <div className="py-12 px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
            <Wallet className="w-7 h-7 text-blue-600" strokeWidth={1.5} />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-600 text-sm max-w-xs mx-auto mb-6">
            Once you start paying rent or making other payments, your transaction history will appear here.
          </p>

          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-2 rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
            onClick={() => setPayModalOpen(true)}
          >
            <CreditCard className="w-4 h-4" />
            Make Your First Payment
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PayPaymentModal open={payModalOpen} onOpenChange={setPayModalOpen} />

      <div className="divide-y divide-gray-100">
        {validTransactions.map((tx, idx) => {
          if (!tx) return null;
          
          const property = validProperties.find(p => p?.id === tx.property_id);
          const propertyName = property?.property_name || 'Unknown Property';
          const statusConfig = getStatusConfig(tx.status);
          const typeConfig = getTypeConfig(tx.type);
          const amount = Number(tx.amount || 0);

          return (
            <div
              key={`${tx.id}-${idx}`}
              className={`p-4 transition-colors duration-200 group cursor-default ${statusConfig.bgColor}`}
            >
              {/* Mobile Layout */}
              <div className="lg:hidden">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                      <Home className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{propertyName}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{typeConfig.badge}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-gray-900">₹{amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 mb-2 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {tx.date}
                  </span>
                  {statusConfig.badge}
                </div>

                {(tx.status === 'pending' || tx.status === 'overdue' || tx.status === 'upcoming') && (
                  <Button
                    size="sm"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-8 rounded-lg mt-2"
                    onClick={() => {
                      setSelectedTx(tx);
                      setPayModalOpen(true);
                    }}
                  >
                    Pay Now
                  </Button>
                )}
                {tx.status === 'completed' && (
                  <Button
                    size="sm"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs h-8 rounded-lg mt-2"
                    variant="ghost"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-8 gap-4 items-center text-sm">
                <div className="col-span-2 flex items-center gap-2 min-w-0">
                  <Home className="w-4 h-4 text-red-600 flex-shrink-0" strokeWidth={1.5} />
                  <span className="font-semibold text-gray-900 truncate">{propertyName}</span>
                </div>

                <div className="col-span-1">{typeConfig.badge}</div>

                <div className="col-span-1">
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className={`w-3.5 h-3.5 ${tx.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`} strokeWidth={2.5} />
                    <span className="font-bold text-gray-900">₹{amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="col-span-1 text-gray-600">{tx.date || '-'}</div>

                <div className="col-span-1 text-gray-600">{tx.due_date?.split("T")[0] || '-'}</div>

                <div className="col-span-1">{statusConfig.badge}</div>

                <div className="col-span-1 text-right">
                  {(tx.status === 'pending' || tx.status === 'overdue' || tx.status === 'upcoming') && (
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setSelectedTx(tx);
                        setPayModalOpen(true);
                      }}
                    >
                      Pay
                    </Button>
                  )}
                  {tx.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-600 hover:text-red-600 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};