import React, { useMemo, useState } from "react";

/**
 * Payments & Collections Panel
 * - Tailwind CSS + TypeScript (TSX)
 * - Brand: #DC2626 used for primary CTAs
 *
 * Integration:
 * <PaymentsPanel currency="₹" items={data} onAction={(action, payload)=>...} />
 */

type TenantDue = {
  id: string;
  property: string;
  tenantName: string;
  unit?: string;
  amount: number;
  dueDateISO: string;
  phone?: string; // for WhatsApp/SMS
  email?: string;
  receipts?: { id: string; uploadedAt: string; filename: string }[];
  proofProvided?: boolean;
  note?: string;
};

type Props = {
  currency?: string;
  items?: TenantDue[]; // list of all dues (includes future due + overdue)
  onAction?: (action: string, payload?: any) => void;
  className?: string;
};

const BRAND = "#DC2626";

export default function PaymentsPanel({
  currency = "₹",
  items = SAMPLE_DATA,
  onAction = (a, p) => console.log(a, p),
  className = "",
}: Props) {
  const now = new Date();

  // derive lists
  const dueNext7 = useMemo(
    () =>
      items
        .filter((i) => {
          const d = new Date(i.dueDateISO);
          const days = diffDays(now, d);
          return days >= 0 && days <= 7;
        })
        .sort((a, b) => new Date(a.dueDateISO).getTime() - new Date(b.dueDateISO).getTime()),
    [items]
  );

  const dueNext30 = useMemo(
    () =>
      items
        .filter((i) => {
          const d = new Date(i.dueDateISO);
          const days = diffDays(now, d);
          return days >= 0 && days <= 30;
        })
        .sort((a, b) => new Date(a.dueDateISO).getTime() - new Date(b.dueDateISO).getTime()),
    [items]
  );

  const overdue = useMemo(
    () =>
      items
        .filter((i) => new Date(i.dueDateISO) < now)
        .map((i) => ({ ...i, daysOverdue: diffDays(new Date(i.dueDateISO), now) }))
        .sort((a, b) => b.daysOverdue! - a.daysOverdue!),
    [items]
  );

  const [tab, setTab] = useState<"due7" | "due30" | "overdue">("due7");
  const [sortBy, setSortBy] = useState<"amount" | "age" | "property">("age");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [openReminder, setOpenReminder] = useState<TenantDue | null>(null);
  const [openOffline, setOpenOffline] = useState<TenantDue | null>(null);

  // ledger sparkline data (mock) - replace with API monthly inflow/expected
  const ledgerMonthly = useMemo(() => {
    // return an array of last 12 months { month: "Aug", inflow: number, expected: number }
    const base = [118000, 132000, 142000, 128000, 150000, 160000, 155000, 148000, 170000, 162000, 158000, 152000];
    const expected = base.map((b) => Math.round(b * 1.05));
    return base.map((inflow, idx) => ({ month: idx, inflow, expected: expected[idx] }));
  }, []);

  // sort overdue view
  const sortedOverdue = useMemo(() => {
    const list = [...overdue];
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "amount") list.sort((a, b) => (a.amount - b.amount) * dir);
    if (sortBy === "age") list.sort((a, b) => ((a.daysOverdue ?? 0) - (b.daysOverdue ?? 0)) * dir);
    if (sortBy === "property") list.sort((a, b) => a.property.localeCompare(b.property) * dir);
    return list;
  }, [overdue, sortBy, sortDir]);

  return (
    <>
      {/* Overview Section */}
      <section className={`bg-white rounded-2xl border border-gray-100 p-3 md:p-6 shadow-lg ${className}`}>
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900">Payments Overview</h3>
            <div className="text-xs md:text-sm text-gray-500 mt-1">Track your rental income performance</div>
          </div>
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 rounded-full bg-gray-50">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-gray-600">Live Data</span>
          </div>
        </div>

        <div className="mb-3 md:mb-6">
          <SparklineTile data={ledgerMonthly} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="p-2 md:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Collected (12m)</div>
              <i className="fas fa-chart-line text-blue-600"></i>
            </div>
            <div className="text-base md:text-xl font-bold text-blue-900">{formatCurrency(sum(ledgerMonthly.map((d) => d.inflow)), currency)}</div>
            <div className="text-xs text-blue-600 mt-1">+12.5% from last year</div>
          </div>
          <div className="p-2 md:p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Expected (12m)</div>
              <i className="fas fa-target text-purple-600"></i>
            </div>
            <div className="text-base md:text-xl font-bold text-purple-900">{formatCurrency(sum(ledgerMonthly.map((d) => d.expected)), currency)}</div>
            <div className="text-xs text-purple-600 mt-1">Target achievement</div>
          </div>
        </div>
      </section>

      {/* Reminders modal */}
      {openReminder && (
        <ReminderModal tenant={openReminder} onClose={() => setOpenReminder(null)} onSend={(payload) => { onAction("send-reminder", payload); setOpenReminder(null); }} />
      )}

      {/* Record offline payment modal */}
      {openOffline && (
        <OfflinePaymentModal tenant={openOffline} onClose={() => setOpenOffline(null)} onSave={(payload) => { onAction("record-offline", payload); setOpenOffline(null); }} />
      )}
    </>
  );
}

/* -------------------- Helper components -------------------- */

function SparklineTile({ data }: { data: { month: number; inflow: number; expected: number }[] }) {
  const inflows = data.map((d) => d.inflow);
  const expected = data.map((d) => d.expected);
  const currentMonth = inflows[inflows.length - 1];
  const expectedCurrent = expected[expected.length - 1];
  const variance = ((currentMonth - expectedCurrent) / expectedCurrent * 100);
  const isPositive = variance >= 0;

  return (
    <div className="rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-gray-900">Revenue Performance</div>
          <div className="text-xs text-gray-500 mt-1">Actual vs Expected • Last 12 months</div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <i className={`fas ${isPositive ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs`}></i>
          {Math.abs(variance).toFixed(1)}%
        </div>
      </div>

      <div className="mb-4">
        <AdvancedChart seriesA={inflows} seriesB={expected} height={80} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(currentMonth, "₹")}</div>
          <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#DC2626]"></div>
            Actual This Month
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{formatCurrency(expectedCurrent, "₹")}</div>
          <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400 border-2 border-gray-400" style={{backgroundColor: 'transparent'}}></div>
            Expected This Month
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Collection Rate</span>
          <span className={`font-semibold ${
            (currentMonth / expectedCurrent) >= 0.95 ? 'text-green-600' : 
            (currentMonth / expectedCurrent) >= 0.85 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {((currentMonth / expectedCurrent) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              (currentMonth / expectedCurrent) >= 0.95 ? 'bg-green-500' : 
              (currentMonth / expectedCurrent) >= 0.85 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((currentMonth / expectedCurrent) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

/* Advanced chart with area fill and interactive elements */
function AdvancedChart({ seriesA, seriesB, height = 80 }: { seriesA: number[]; seriesB?: number[]; height?: number }) {
  const width = 280;
  const pad = 12;
  const all = [...(seriesA ?? []), ...(seriesB ?? [])];
  const min = Math.min(...all) * 0.95;
  const max = Math.max(...all) * 1.05;
  
  const points = (arr: number[]) =>
    arr.map((v, i) => {
      const x = pad + (i / (arr.length - 1)) * (width - 2 * pad);
      const y = pad + ((max - v) / (max - min || 1)) * (height - 2 * pad);
      return { x, y, value: v };
    });

  const actualPoints = points(seriesA);
  const expectedPoints = seriesB ? points(seriesB) : [];
  
  const actualPath = `M${actualPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const expectedPath = expectedPoints.length ? `M${expectedPoints.map(p => `${p.x},${p.y}`).join(' L ')}` : '';
  
  // Area fill path for actual
  const areaPath = `${actualPath} L ${actualPoints[actualPoints.length - 1].x},${height - pad} L ${actualPoints[0].x},${height - pad} Z`;

  return (
    <div className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.05" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Horizontal grid lines */}
        <g stroke="#F3F4F6" strokeWidth="0.5" opacity="0.7">
          {[0.25, 0.5, 0.75].map(ratio => (
            <line key={ratio} x1={pad} x2={width - pad} y1={height * ratio} y2={height * ratio} />
          ))}
        </g>

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Expected line (dashed) */}
        {expectedPath && (
          <path 
            d={expectedPath} 
            fill="none" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            strokeDasharray="4 4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.8"
          />
        )}

        {/* Actual line */}
        <path 
          d={actualPath} 
          fill="none" 
          stroke="#DC2626" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Data points */}
        {actualPoints.map((point, i) => (
          <g key={i}>
            <circle 
              cx={point.x} 
              cy={point.y} 
              r="4" 
              fill="white" 
              stroke="#DC2626" 
              strokeWidth="2"
              className="hover:r-6 transition-all duration-200 cursor-pointer"
            />
            {i === actualPoints.length - 1 && (
              <circle 
                cx={point.x} 
                cy={point.y} 
                r="6" 
                fill="#DC2626" 
                className="animate-pulse"
              />
            )}
          </g>
        ))}
      </svg>
      
      {/* Month labels */}
      <div className="flex justify-between mt-2 px-3">
        {['Jan', 'Apr', 'Jul', 'Oct', 'Dec'].map((month, i) => (
          <span key={month} className="text-xs text-gray-400 font-medium">{month}</span>
        ))}
      </div>
    </div>
  );
}

function QuickContactButtons({ tenant, onSend, onSms, onEmail }: { tenant: TenantDue; onSend: () => void; onSms: () => void; onEmail: () => void }) {
  // message templates
  const templateWhatsapp = `Hello ${tenant.tenantName}, this is a reminder that ₹${tenant.amount} is due on ${new Date(tenant.dueDateISO).toLocaleDateString()}. Please confirm payment. - PropGrowthX`;
  const templateSms = `Rent reminder: ₹${tenant.amount} due ${new Date(tenant.dueDateISO).toLocaleDateString()}. Reply to confirm.`;
  const templateEmail = `Hi ${tenant.tenantName},\n\nThis is a reminder that rent amounting to ₹${tenant.amount} is due on ${new Date(tenant.dueDateISO).toLocaleDateString()}.\n\nPlease complete payment or contact us if there is an issue.\n\nThanks,\nPropGrowthX`;

  function copyToClipboard(text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      // small UX feedback — replace with toast in real app
      alert("Template copied to clipboard");
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => { navigator.clipboard?.writeText(templateWhatsapp); onSend(); }} className="text-xs px-2 py-1 rounded-md bg-[#FFF1F0] text-[#DC2626]">Send</button>
      <button onClick={() => copyToClipboard(templateSms)} className="text-xs px-2 py-1 rounded-md border border-gray-100">SMS</button>
      <button onClick={() => copyToClipboard(templateEmail)} className="text-xs px-2 py-1 rounded-md border border-gray-100">Email</button>
    </div>
  );
}

function ReceiptBadge({ receipts }: { receipts?: { id: string; uploadedAt: string; filename: string }[] }) {
  if (!receipts || receipts.length === 0) {
    return <div className="text-xs px-2 py-1 rounded-md border border-gray-100 text-gray-500">No receipts</div>;
  }
  return <div className="text-xs px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-gray-700">{receipts.length} receipt(s)</div>;
}

/* Reminder modal */
function ReminderModal({ tenant, onClose, onSend }: { tenant: TenantDue; onClose: () => void; onSend: (payload: any) => void }) {
  const [message, setMessage] = useState(`Hi ${tenant.tenantName}, this is a rent reminder for ₹${tenant.amount} due ${new Date(tenant.dueDateISO).toLocaleDateString()}. Please confirm payment.`);
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-[640px] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Send reminder</div>
            <div className="text-xs text-gray-500">To: {tenant.tenantName} • {tenant.phone ?? tenant.email}</div>
          </div>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>

        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-4 w-full border border-gray-100 rounded-md p-3 text-sm h-28" />

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-100">Cancel</button>
          <button onClick={() => onSend({ tenantId: tenant.id, message })} className="px-4 py-2 rounded-md" style={{ background: BRAND, color: "#fff" }}>Send</button>
        </div>
      </div>
    </div>
  );
}

/* Offline payment modal */
function OfflinePaymentModal({ tenant, onClose, onSave }: { tenant: TenantDue; onClose: () => void; onSave: (payload: any) => void }) {
  const [amount, setAmount] = useState(tenant.amount);
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-[520px] p-5">
        <div className="text-lg font-semibold">Record offline payment</div>
        <div className="text-xs text-gray-500 mt-1">Tenant: {tenant.tenantName} — {tenant.property}</div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="border border-gray-100 rounded-md px-3 py-2" />
          <select className="border border-gray-100 rounded-md px-3 py-2">
            <option>Cash</option>
            <option>Bank transfer</option>
            <option>Cheque</option>
          </select>
        </div>

        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" className="mt-3 w-full border border-gray-100 rounded-md p-3 text-sm h-24" />

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-100">Cancel</button>
          <button onClick={() => onSave({ tenantId: tenant.id, amount, note })} className="px-4 py-2 rounded-md" style={{ background: BRAND, color: "#fff" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- small utilities -------------------- */

function initials(name: string) {
  return (name || "")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
function daysLeftText(iso: string) {
  const days = diffDays(new Date(), new Date(iso));
  return days === 0 ? "Due today" : days > 0 ? `${days} days` : `${Math.abs(days)} days past due`;
}
function diffDays(a: Date, b: Date) {
  const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}
function sum(arr: number[]) {
  return arr.reduce((s, n) => s + n, 0);
}
function formatCurrency(num: number | string, currency = "₹") {
  if (typeof num === "string") return num;
  return `${currency}${num.toLocaleString()}`;
}

/* -------------------- sample mock data -------------------- */

const SAMPLE_DATA: TenantDue[] = [
  {
    id: "d1",
    property: "Sunset Villa",
    tenantName: "Asha Patel",
    unit: "Apt 2B",
    amount: 12000,
    dueDateISO: addDaysISO(2),
    phone: "+919876543210",
    email: "asha@example.com",
    receipts: [{ id: "r1", uploadedAt: addDaysISO(-3), filename: "receipt_asha.jpg" }],
    proofProvided: true,
    note: "Promised to pay within this week.",
  },
  {
    id: "d2",
    property: "Maple Apartments",
    tenantName: "Ravi Kumar",
    unit: "Apt 4A",
    amount: 8000,
    dueDateISO: addDaysISO(8),
    phone: "+919812345678",
    email: "ravi@example.com",
    receipts: [],
    proofProvided: false,
  },
  {
    id: "d3",
    property: "Orchard House",
    tenantName: "Lina Gomez",
    unit: "Apt 1",
    amount: 8400,
    dueDateISO: addDaysISO(-3), // overdue
    phone: "+919700000111",
    email: "lina@example.com",
    receipts: [],
    proofProvided: false,
    note: "First overdue — send friendly reminder.",
  },
];

function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}