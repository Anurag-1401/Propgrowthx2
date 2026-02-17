import React, { useMemo, useState } from "react";
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Download, TrendingUp, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

type Transaction = {
  id: string;
  dateISO: string;
  property: string;
  tenant: string;
  type: "Rent" | "Security" | "Fee" | "Refund";
  amountUSD: number;
  method: "Card" | "Bank" | "Cash" | "Offline";
  status: "Collected" | "Pending" | "Overdue" | "Failed";
  receiptUrl?: string | null;
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    dateISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    property: "Sunset Villa",
    tenant: "Asha Patel",
    type: "Rent",
    amountUSD: 120000,
    method: "Bank",
    status: "Overdue",
    receiptUrl: null,
  },
  {
    id: "t2",
    dateISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    property: "Maple Apartments",
    tenant: "Ravi Kumar",
    type: "Rent",
    amountUSD: 80000,
    method: "Card",
    status: "Collected",
    receiptUrl: "https://example.com/receipt_t2.png",
  },
  {
    id: "t3",
    dateISO: new Date().toISOString(),
    property: "Orchard House",
    tenant: "Lina Gomez",
    type: "Fee",
    amountUSD: 15000,
    method: "Offline",
    status: "Pending",
    receiptUrl: null,
  },
  {
    id: "t4",
    dateISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    property: "Lotus Heights",
    tenant: "Priya Singh",
    type: "Rent",
    amountUSD: 95000,
    method: "Bank",
    status: "Overdue",
    receiptUrl: null,
  },
];

function formatUSD(n: number) {
  return `₹${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function daysSince(iso: string) {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function shortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const kpis = useMemo(() => {
    const overdueList = transactions.filter((t) => t.status === "Overdue");
    const collected = transactions.filter(t => t.status === "Collected").reduce((s, t) => s + t.amountUSD, 0);
    const pending = transactions.filter(t => t.status === "Pending" || t.status === "Overdue").reduce((s, t) => s + t.amountUSD, 0);
    const total = transactions.reduce((s, t) => s + t.amountUSD, 0);
    const successRate = total === 0 ? 100 : Math.round((collected / total) * 100);

    return {
      pending,
      overdueAmount: overdueList.reduce((s, t) => s + t.amountUSD, 0),
      overdueCount: overdueList.length,
      collected,
      total,
      successRate,
    };
  }, [transactions]);

  const visibleTx = transactions.filter((t) => {
    const q = query.trim().toLowerCase();
    if (q && ![t.property, t.tenant, t.type].some((x) => x.toLowerCase().includes(q))) return false;
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Payment Management | PropGrowthX</title>
        <meta name="description" content="Manage rental payments, track collections, and monitor tenant transactions." />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');

        * { font-family: 'Geist', sans-serif; box-sizing: border-box; }

        .container-custom {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 32px;
        }

        .payment-hero {
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
          box-shadow: 0 20px 50px rgba(2, 6, 23, 0.05);
        }

        .page-title {
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 600;
          letter-spacing: -1px;
          line-height: 1.2;
          color: #0b1220;
          margin: 0;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(2,6,23,0.08);
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        .back-btn:hover {
          background: rgba(255, 255, 255, 1);
          border-color: rgba(2,6,23,0.12);
          color: #111827;
        }
      `}</style>

        <div className="min-h-screen bg-white">
          {/* Header */}
          <div className="border-b border-gray-100">
            <div className="container-custom py-12">
              <div className="payment-hero">
                <a href="/dashboard-nav" className="back-btn mb-6 inline-flex">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </a>
                <h1 className="page-title mb-4">Payment Management</h1>
                <p className="text-gray-600 max-w-2xl">Track rental collections, monitor payment status, and manage your property finances with ease.</p>
              </div>
            </div>
          </div>

          <div className="container-custom py-12">
            {/* KPI Section */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pending */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending</div>
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{formatUSD(kpis.pending)}</div>
                  <div className="text-sm text-gray-500">Awaiting collection</div>
                </div>

                {/* Overdue */}
                <div className="bg-white border border-red-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Overdue</div>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-2">{formatUSD(kpis.overdueAmount)}</div>
                  <div className="text-sm text-gray-500">{kpis.overdueCount} tenants</div>
                </div>

                {/* Collected */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Collected</div>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{formatUSD(kpis.collected)}</div>
                  <div className="text-sm text-gray-500">Successfully received</div>
                </div>

                {/* Success Rate */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Success Rate</div>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{kpis.successRate}%</div>
                  <div className="text-sm text-gray-500">Collection efficiency</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by property, tenant, or type..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-900 transition-colors"
                >
                  <option>All</option>
                  <option>Collected</option>
                  <option>Pending</option>
                  <option>Overdue</option>
                  <option>Failed</option>
                </select>
                <button className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-12">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Transactions</h3>
                  <span className="text-sm text-gray-500">{visibleTx.length} transactions</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                {visibleTx.length > 0 ? (
                  <div>
                    <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Property</div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tenant</div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount</div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Type</div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">Status</div>
                    </div>

                    {visibleTx.map((t) => (
                      <div key={t.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="text-sm text-gray-700">{shortDate(t.dateISO)}</div>
                        <div className="text-sm font-medium text-gray-900">{t.property}</div>
                        <div className="text-sm text-gray-600">{t.tenant}</div>
                        <div className="text-sm font-semibold text-gray-900">{formatUSD(t.amountUSD)}</div>
                        <div className="text-sm text-gray-600">{t.type}</div>
                        <div className="text-right">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            t.status === 'Collected' ? 'bg-green-100 text-green-800' :
                            t.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            t.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {t.status}
                            {t.status === 'Overdue' && ` • ${daysSince(t.dateISO)}d`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-gray-400">
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Urgent Follow-up */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Urgent Follow-up</h3>
                </div>
                <div className="space-y-3">
                  {transactions
                    .filter(t => t.status === 'Overdue' && daysSince(t.dateISO) > 15)
                    .slice(0, 3)
                    .map((t) => (
                      <div key={t.id} className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-start justify-between mb-1">
                          <div className="text-sm font-medium text-gray-900">{t.property}</div>
                          <div className="text-xs text-red-600 font-semibold">{daysSince(t.dateISO)}d overdue</div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">{t.tenant}</div>
                        <button className="text-xs px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
                          Send Reminder
                        </button>
                      </div>
                    ))}
                  {transactions.filter(t => t.status === 'Overdue').length === 0 && (
                    <p className="text-sm text-gray-500 py-4">All payments are on track!</p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">By Status</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Collected</span>
                        <span className="text-sm font-semibold text-green-600">{transactions.filter(t => t.status === 'Collected').length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Pending</span>
                        <span className="text-sm font-semibold text-yellow-600">{transactions.filter(t => t.status === 'Pending').length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Overdue</span>
                        <span className="text-sm font-semibold text-red-600">{transactions.filter(t => t.status === 'Overdue').length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 font-medium">Total Value</span>
                      <span className="text-sm font-semibold text-gray-900">{formatUSD(kpis.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}