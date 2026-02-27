import React, { useMemo, useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Download, TrendingUp, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

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
  { id: "t1", dateISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),  property: "Sunset Villa",     tenant: "Asha Patel",  type: "Rent", amountUSD: 120000, method: "Bank",    status: "Overdue",   receiptUrl: null },
  { id: "t2", dateISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), property: "Maple Apartments", tenant: "Ravi Kumar",  type: "Rent", amountUSD: 80000,  method: "Card",    status: "Collected", receiptUrl: "https://example.com/receipt_t2.png" },
  { id: "t3", dateISO: new Date().toISOString(),                                        property: "Orchard House",    tenant: "Lina Gomez",  type: "Fee",  amountUSD: 15000,  method: "Offline", status: "Pending",   receiptUrl: null },
  { id: "t4", dateISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), property: "Lotus Heights",    tenant: "Priya Singh", type: "Rent", amountUSD: 95000,  method: "Bank",    status: "Overdue",   receiptUrl: null },
];

function formatUSD(n: number) {
  return `₹${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const BRAND = "#DC2626";

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Start closed on mobile
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  // Mobile nav helper — close drawer then navigate
  const mobileGoTo = (path: string) => {
    if (window.innerWidth < 768) setSidebarOpen(false);
    navigate(path);
  };

  const kpis = useMemo(() => {
    const collected = transactions.filter(t => t.status === "Collected").reduce((s, t) => s + t.amountUSD, 0);
    const overdueList = transactions.filter(t => t.status === "Overdue");
    const pending = transactions.filter(t => t.status === "Pending" || t.status === "Overdue").reduce((s, t) => s + t.amountUSD, 0);
    const total = transactions.reduce((s, t) => s + t.amountUSD, 0);
    return {
      pending,
      overdueAmount: overdueList.reduce((s, t) => s + t.amountUSD, 0),
      overdueCount: overdueList.length,
      collected,
      total,
      successRate: total === 0 ? 100 : Math.round((collected / total) * 100),
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
      `}</style>

      <div className="flex h-screen bg-gray-50 overflow-hidden">

        {/* ═══════════════════════════════════════
            MOBILE ONLY — floating hamburger.
            Visible only when drawer is closed.
        ═══════════════════════════════════════ */}
        {!sidebarOpen && (
          <button
            className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 flex items-center justify-center
              bg-white border border-gray-200 rounded-xl shadow-md hover:bg-gray-50 transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <i className="fas fa-bars text-gray-700 text-sm"></i>
          </button>
        )}

        {/* ═══════════════════════════════════════
            MOBILE ONLY — dark backdrop.
        ═══════════════════════════════════════ */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ═══════════════════════════════════════
            MOBILE ONLY — full drawer, auto-closes on nav.
        ═══════════════════════════════════════ */}
        <aside
          className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 z-50
            flex flex-col transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-md overflow-hidden shadow-sm flex-shrink-0">
              <img src="/logo.png" alt="PropGrowthX Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-gray-900 text-base">PropGrowthX</span>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1.5 rounded-md hover:bg-gray-50 text-gray-500" aria-label="Close menu">
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>
          <nav className="px-2 py-4 flex-1 overflow-y-auto">
            {[
              { id: "dashboard",   label: "Dashboard",   icon: "fa-chart-bar",  onClick: () => navigate("/dashboard-nav") },
              { id: "properties", label: "Properties", icon: "fa-building", path: "/properties-manage" },
              { id: "payments",   label: "Payments",   icon: "fa-receipt",  path: "/payments" },
              { id: "support",    label: "Support",    icon: "fa-headset",  path: "/contact" },
              { id: "complaints", label: "Complaints", icon: "fa-folder",   path: "/dashboard/owner/complaints" },
              { id: "team",       label: "Team",       icon: "fa-users",    path: null },
              { id: "profile",    label: "Profile",    icon: "fa-user",     path: "/profile" },
              { id: "settings",   label: "Settings",   icon: "fa-cog",      path: null },
            ].map((item) => (
              <MobileNavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                active={item.id === "payments"}
                onClick={() => item.path ? mobileGoTo(item.path) : setSidebarOpen(false)}
              />
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
          </div>
        </aside>

        {/* ═══════════════════════════════════════
            DESKTOP / TABLET SIDEBAR — inline.
            Toggles w-64 ↔ w-20. Zero mobile changes.
        ═══════════════════════════════════════ */}
        <aside
          className={`hidden md:flex flex-col flex-shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0 z-40
            transition-all duration-200 ease-in-out ${sidebarOpen ? "w-64" : "w-20"}`}
          aria-label="Sidebar"
        >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-md overflow-hidden shadow-sm flex-shrink-0">
              <img src="/logo.png" alt="PropGrowthX Logo" className="w-full h-full object-contain" />
            </div>
            {sidebarOpen && <span className="font-semibold text-gray-900 text-lg">PropGrowthX</span>}
            <button
              onClick={() => setSidebarOpen(s => !s)}
              className="ml-auto bg-transparent p-2 rounded-md hover:bg-gray-50"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <i className={`fas ${sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"} text-gray-600 text-sm`}></i>
            </button>
          </div>
          <nav className="px-2 py-4 flex-1 overflow-y-auto">
            {[
              { id: "dashboard",   label: "Dashboard",   icon: "fa-chart-bar",  onClick: () => navigate("/dashboard-nav") },
              { id: "properties", label: "Properties", icon: "fa-building", onClick: () => navigate("/properties-manage") },
              { id: "payments",   label: "Payments",   icon: "fa-receipt",  onClick: () => navigate("/payments") },
              { id: "support",    label: "Support",    icon: "fa-headset",  onClick: () => navigate("/contact") },
              { id: "complaints", label: "Complaints", icon: "fa-folder",   onClick: () => navigate("/dashboard/owner/complaints") },
              { id: "team",       label: "Team",       icon: "fa-users",    onClick: undefined },
              { id: "profile",    label: "Profile",    icon: "fa-user",     onClick: () => navigate("/profile") },
              { id: "settings",   label: "Settings",   icon: "fa-cog",      onClick: undefined },
            ].map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                collapsed={!sidebarOpen}
                active={item.id === "payments"}
                onClick={item.onClick}
              />
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-gray-100">
            {sidebarOpen
              ? <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
              : <div className="text-center text-xs text-gray-400">©PG</div>
            }
          </div>
        </aside>

        {/* ═══════════════════════════════════════
            MAIN CONTENT
        ═══════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-white">

            {/* ── Hero Header ── */}
            <div className="border-b border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-14 pb-0 pl-4 md:pl-8">
                <div className="relative p-6 sm:p-8 md:p-10 rounded-2xl mb-8"
                  style={{ background: "linear-gradient(180deg, #FFF5F5 0%, #FFE4E6 100%)", border: "1px solid rgba(220,38,38,0.12)" }}>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 tracking-tight" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>
                    Payment Management
                  </h1>
                  <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
                    Track rental collections, monitor payment status, and manage your property finances with ease.
                  </p>
                  {/* subtle divider */}
                  <div className="absolute bottom-0 left-0 right-0 h-px mx-8" style={{ background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.3) 30%, rgba(220,38,38,0.5) 50%, rgba(220,38,38,0.3) 70%, transparent)" }} />
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 pl-4 md:pl-8">

              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                <KpiCard label="Pending"      value={formatUSD(kpis.pending)}      sub="Awaiting collection"    icon={<Clock className="w-5 h-5 text-orange-600" />}  border="border-gray-200" />
                <KpiCard label="Overdue"      value={formatUSD(kpis.overdueAmount)} sub={`${kpis.overdueCount} tenants`} icon={<AlertCircle className="w-5 h-5 text-red-600" />} border="border-red-200" valueColor="text-red-600" bg="from-red-50 to-white" />
                <KpiCard label="Collected"    value={formatUSD(kpis.collected)}    sub="Successfully received"  icon={<CheckCircle2 className="w-5 h-5 text-green-600" />} border="border-gray-200" valueColor="text-green-600" />
                <KpiCard label="Success Rate" value={`${kpis.successRate}%`}       sub="Collection efficiency"  icon={<TrendingUp className="w-5 h-5 text-blue-600" />}  border="border-gray-200" valueColor="text-blue-600" />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
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

              {/* Transactions Table */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-10">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Transactions</h3>
                  <span className="text-sm text-gray-500">{visibleTx.length} transactions</span>
                </div>
                <div className="overflow-x-auto">
                  {visibleTx.length > 0 ? (
                    <div>
                      <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
                        {["Date","Property","Tenant","Amount","Type","Status"].map((h, i) => (
                          <div key={h} className={`text-xs font-semibold text-gray-600 uppercase tracking-wide ${i === 5 ? "text-right" : ""}`}>{h}</div>
                        ))}
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
                              t.status === 'Pending'   ? 'bg-yellow-100 text-yellow-800' :
                              t.status === 'Overdue'   ? 'bg-red-100 text-red-800' :
                                                         'bg-gray-100 text-gray-800'
                            }`}>
                              {t.status}{t.status === 'Overdue' && ` • ${daysSince(t.dateISO)}d`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center text-gray-400">No transactions found</div>
                  )}
                </div>
              </div>

              {/* Insights */}
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

                {/* Payment Breakdown */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {[
                        { label: "Collected", color: "text-green-600", count: transactions.filter(t => t.status === 'Collected').length },
                        { label: "Pending",   color: "text-yellow-600", count: transactions.filter(t => t.status === 'Pending').length },
                        { label: "Overdue",   color: "text-red-600",    count: transactions.filter(t => t.status === 'Overdue').length },
                      ].map(({ label, color, count }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{label}</span>
                          <span className={`text-sm font-semibold ${color}`}>{count}</span>
                        </div>
                      ))}
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
          </main>
        </div>
      </div>
    </>
  );
}

// ── Small KPI card ──
function KpiCard({ label, value, sub, icon, border = "border-gray-200", valueColor = "text-gray-900", bg = "" }: {
  label: string; value: string; sub: string; icon: React.ReactNode;
  border?: string; valueColor?: string; bg?: string;
}) {
  return (
    <div className={`bg-white border ${border} rounded-xl p-6 hover:shadow-lg transition-shadow ${bg ? `bg-gradient-to-br ${bg}` : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</div>
        {icon}
      </div>
      <div className={`text-2xl sm:text-3xl font-bold mb-2 ${valueColor}`}>{value}</div>
      <div className="text-xs sm:text-sm text-gray-500">{sub}</div>
    </div>
  );
}

// ── Mobile-only nav item ──
function MobileNavItem({ label, icon, active = false, onClick }: { label: string; icon: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150
        ${active ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50"}`}
      aria-label={label}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${active ? "bg-red-100" : "bg-gray-50"}`}>
        <i className={`fas ${icon} text-sm ${active ? "text-red-600" : "text-gray-600"}`}></i>
      </span>
      <span className={`text-sm font-medium ${active ? "font-semibold" : ""}`}>{label}</span>
    </button>
  );
}

// ── Desktop/tablet nav item ──
function NavItem({ label, icon, collapsed = false, active = false, onClick }: { label: string; icon: string; collapsed?: boolean; active?: boolean; onClick?: () => void }) {
  return (
    <button
      className={`group w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150
        ${active ? "bg-red-50" : "hover:bg-gray-50"}`}
      aria-label={label}
      title={collapsed ? label : undefined}
      onClick={onClick}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${active ? "bg-red-100" : "bg-gray-50"}`}>
        <i className={`fas ${icon} text-sm ${active ? "text-red-600" : "text-gray-600"}`}></i>
      </span>
      {!collapsed && (
        <span className={`text-sm font-medium ${active ? "text-red-600 font-semibold" : "text-gray-900"}`}>{label}</span>
      )}
    </button>
  );
}