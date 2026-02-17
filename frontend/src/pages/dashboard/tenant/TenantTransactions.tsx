import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Search,
  Download,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building2,
} from 'lucide-react';
import { useData } from '@/context/dataContext';
import { computeTransactionFilters, TransactionTable } from '@/components/tenant/TenantTransactionsAndFilter';

export interface Transaction {
  id: number;
  tenant_id?: string;
  owner_id?: string;
  property_id: string;
  type: 'rent' | 'deposit' | 'maintenance';
  amount: string | number;
  date: string;
  due_date?: string;
  images?: string[];
  status: 'completed' | 'pending' | 'overdue' | 'upcoming';
  paymentMethod?: string;
  reference_no?: string;
}

const TenantTransactions = () => {
  const navigate = useNavigate();
  const { transactions, properties, loading ,id} = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  const myTxs = transactions.filter(t=>t.tenant_id === id)
  const myProp = properties.find(p => p.buyer_id === id)

  let filterResults = {
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

  try {
    filterResults = computeTransactionFilters(myTxs, searchTerm, typeFilter,myProp);
  } catch (err) {
    console.error("Error computing filters:", err);
  }

  const {
    allTabTransactions,
    pastTabTransactions,
    currentTabTransactions,
    upcomingTabTransactions,
    totalPaidThisYear,
    pendingPayments,
    overduePayments,
    upcomingPayments,
  } = filterResults;

  const stats = [
    {
      icon: TrendingUp,
      label: 'Total Paid This Year',
      value: `₹${totalPaidThisYear.toLocaleString()}`,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Clock,
      label: 'Pending Payments',
      value: `₹${pendingPayments.toLocaleString()}`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: AlertCircle,
      label: 'Overdue',
      value: `₹${overduePayments.toLocaleString()}`,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Calendar,
      label: 'Upcoming (3mo)',
      value: `₹${upcomingPayments.toLocaleString()}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Transactions | PropGrowthX</title>
        <meta name="description" content="View and manage your property transactions, rent payments, and payment history." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');

          :root {
            --brand-red: #DC2626;
            --muted: #6b7280;
            --card-border: rgba(16,24,40,0.06);
            --soft-bg: #fbfbfd;
            --glass: rgba(255,255,255,0.78);
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .tx-page-title {
            font-family: 'Inter', 'Geist', system-ui, sans-serif;
            font-size: clamp(36px, 4.5vw, 56px);
            font-weight: 400;
            letter-spacing: -1.5px;
            line-height: 1.1;
            color: #0b1220;
            margin: 0;
            animation: slideInLeft 0.7s ease-out 0.1s both;
          }

          .tx-title-accent {
            color: var(--brand-red);
            font-weight: 700;
            animation: slideInRight 0.7s ease-out 0.2s both;
            display: inline-block;
          }

          .tx-container-custom {
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px 32px;
          }

          .tx-header-hero {
            position: relative;
            padding: 32px 40px 36px;
            border-radius: 16px;
            background:
              linear-gradient(
                180deg,
                rgba(220, 38, 38, 0.04),
                rgba(255, 255, 255, 0.95)
              );
            border: 1px solid rgba(16, 24, 40, 0.06);
            animation: fadeInUp 0.8s ease-out 0s both;
          }

          .tx-header-hero::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 16px;
            pointer-events: none;
            box-shadow: 0 20px 50px rgba(2, 6, 23, 0.05);
          }

          .tx-header-title-row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 14px;
          }

          .tx-header-subtitle {
            font-size: 16px;
            color: var(--muted);
            font-weight: 400;
            letter-spacing: 0.2px;
            line-height: 1.6;
            margin-top: 12px;
            animation: fadeInUp 0.8s ease-out 0.25s both;
          }

          .tx-divider-line {
            height: 1px;
            background: linear-gradient(90deg, 
              rgba(220, 38, 38, 0),
              rgba(220, 38, 38, 0.3) 20%,
              rgba(220, 38, 38, 0.5) 50%,
              rgba(220, 38, 38, 0.3) 80%,
              rgba(220, 38, 38, 0)
            );
            width: 100%;
            margin-top: 22px;
            animation: fadeInUp 0.8s ease-out 0.35s both;
            position: relative;
          }

          .tx-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: var(--glass);
            border: 1px solid rgba(2,6,23,0.06);
            border-radius: 10px;
            padding: 10px 14px;
            cursor: pointer;
            transition: transform .16s ease, box-shadow .16s ease;
            backdrop-filter: blur(8px);
            font-weight: 600;
            color: #0b1220;
            animation: slideInLeft 0.7s ease-out 0s both;
          }
          
          .tx-back-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 28px rgba(2,6,23,0.06);
          }
          
          .tx-back-btn svg { width: 14px; height: 14px; }

          .tx-export-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--brand-red);
            border: none;
            border-radius: 10px;
            padding: 10px 16px;
            cursor: pointer;
            transition: transform .16s ease, box-shadow .16s ease;
            font-weight: 600;
            color: white;
            animation: slideInRight 0.7s ease-out 0.1s both;
          }
          
          .tx-export-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 28px rgba(220, 38, 38, 0.25);
          }
          
          .tx-export-btn svg { width: 16px; height: 16px; }
        `}</style>

        {/* Hero Header - Matching Complaints Page Style */}
        <section className="relative bg-white pt-8 pb-0 overflow-hidden">
          <div className="tx-container-custom relative z-10">
            <div className="tx-header-section pb-8">
              <div className="tx-header-hero">
                {/* Back button */}
                <div className="flex items-start gap-3 mb-6">
                  <button
                    onClick={() => navigate(-1)}
                    className="tx-back-btn"
                    aria-label="Back to dashboard"
                  >
                    <ArrowLeft />
                    <span>Back</span>
                  </button>
                </div>

                {/* Title + Export Button */}
                <div className="tx-header-title-row">
                  <div className="max-w-3xl flex-1">
                    <h1 className="tx-page-title mb-3">
                      Track your<br />
                      <span className="tx-title-accent">payment history</span>
                    </h1>
                    <p className="tx-header-subtitle">
                      Stay on top of your rent payments. Manage all transactions, monitor payment status,
                      and download receipts with ease.
                    </p>
                  </div>
                  <button className="tx-export-btn flex-shrink-0">
                    <Download />
                    <span>Export</span>
                  </button>
                </div>

                <div className="tx-divider-line" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-6 lg:py-8 bg-gray-50">
          <div className="tx-container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-sm transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Transactions Section */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="tx-container-custom">
            {/* Card Container */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Header with Tabs and Filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="space-y-4">
                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Tab List */}
                      <TabsList className="bg-gray-100 p-1 rounded-lg flex-shrink-0">
                        <TabsTrigger value="all" className="px-4 py-2 text-sm font-medium">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="past" className="px-4 py-2 text-sm font-medium">
                          Past
                        </TabsTrigger>
                        <TabsTrigger value="current" className="px-4 py-2 text-sm font-medium">
                          Current
                        </TabsTrigger>
                        <TabsTrigger value="upcoming" className="px-4 py-2 text-sm font-medium">
                          Upcoming
                        </TabsTrigger>
                      </TabsList>

                      {/* Filters */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-gray-200 focus-visible:ring-red-600 focus-visible:ring-offset-0 rounded-lg h-10 bg-gray-50 hover:bg-white transition-colors"
                          />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                          <SelectTrigger className="border-gray-200 focus:ring-red-600 rounded-lg bg-gray-50 hover:bg-white h-10 w-full sm:w-48 transition-colors">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border-gray-200">
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="rent">Rent</SelectItem>
                            <SelectItem value="deposit">Deposit</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Tabs>
                </div>
              </div>

              {/* Tab Content */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="all" className="mt-0">
                  <TransactionTable transactions={allTabTransactions} />
                </TabsContent>

                <TabsContent value="past" className="mt-0">
                  <TransactionTable transactions={pastTabTransactions} />
                </TabsContent>

                <TabsContent value="current" className="mt-0">
                  <TransactionTable transactions={currentTabTransactions} />
                </TabsContent>

                <TabsContent value="upcoming" className="mt-0">
                  <TransactionTable transactions={upcomingTabTransactions} />
                </TabsContent>
              </Tabs>
            </div>

            {/* No Results Message */}
            {allTabTransactions.length === 0 && (
              <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  You don't have any transactions yet. Once you start renting, your payment history will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section - Only show if there are overdue payments */}
        {overduePayments > 0 && (
          <section className="py-6 lg:py-8 bg-gray-50">
            <div className="tx-container-custom">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-red-900 mb-2">Action Required</h3>
                    <p className="text-red-700 mb-4">
                      You have overdue payments totaling <span className="font-bold">₹{overduePayments.toLocaleString()}</span>. Please make the payment as soon as possible to avoid any issues.
                    </p>
                    <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default TenantTransactions;