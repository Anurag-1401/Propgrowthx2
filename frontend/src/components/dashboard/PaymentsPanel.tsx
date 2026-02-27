import { useData } from "@/context/dataContext";
import React, { useMemo, useState } from "react";

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

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const BRAND = "#DC2626";

export default function PaymentsPanel() {
  const { transactions } = useData();
  const today = new Date();

  /* ================================
     SAFE NUMBER CONVERTER
  ================================= */
  const toNumber = (val: any) => {
    return Number(val) || 0;
  };

  /* ================================
     OVERDUE LOGIC
  ================================= */
  const overdue = useMemo(() => {
    return transactions
      ?.filter((t: any) => new Date(t.due_date) < today)
      .map((t: any) => ({
        ...t,
        amount: toNumber(t.amount),
        daysOverdue: Math.ceil(
          (today.getTime() - new Date(t.due_date).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      }))
      .sort((a: any, b: any) => b.daysOverdue - a.daysOverdue);
  }, [transactions]);

  /* ================================
     UPCOMING LOGIC (Next 30 Days)
  ================================= */
  const upcoming = useMemo(() => {
    return transactions?.filter((t: any) => {
      const due = new Date(t.due_date);
      const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    });
  }, [transactions]);

  /* ================================
     MONTHLY GRAPH DATA
  ================================= */
  const monthlyData = useMemo(() => {
    const months: any = {};

    transactions?.forEach((t: any) => {
      const d = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;

      if (!months[key]) {
        months[key] = {
          month: d.toLocaleString("default", { month: "short" }),
          total: 0,
        };
      }

      // 🔥 FIXED HERE
      months[key].total += toNumber(t.amount);
    });

    return Object.values(months);
  }, [transactions]);

  /* ================================
     TOTAL COLLECTION
  ================================= */
  const totalCollected = useMemo(() => {
    return transactions?.reduce(
      (sum: number, t: any) => sum + toNumber(t.amount),
      0,
    );
  }, [transactions]);

  /* ================================
     UI
  ================================= */

  return (
    <div className="space-y-6">
      {/* OVERVIEW */}
      <section className="bg-white rounded-2xl p-6 shadow border border-gray-100">
        <h2 className="text-lg font-bold mb-4">Payments Overview</h2>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke={BRAND}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-xl font-semibold">
          Total Collected: ₹{totalCollected?.toLocaleString()}
        </div>
      </section>

      {/* OVERDUE */}
      <section className="bg-white rounded-2xl p-6 shadow border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-red-600">
          Overdue Payments
        </h3>

        {overdue?.length === 0 ? (
          <div className="text-gray-500 text-sm">No overdue properties 🎉</div>
        ) : (
          <div className="space-y-3">
            {overdue.map((t: any) => (
              <div
                key={t._id}
                className="p-4 rounded-xl border border-red-100 bg-red-50 flex justify-between"
              >
                <div>
                  <div className="font-semibold">{t.propertyName}</div>
                  <div className="text-sm text-gray-600">
                    Tenant: {t.tenantName}
                  </div>
                  <div className="text-sm text-red-600">
                    {t.daysOverdue} days overdue
                  </div>
                </div>

                <div className="font-bold">₹{t.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* UPCOMING */}
      <section className="bg-white rounded-2xl p-6 shadow border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Upcoming (Next 30 Days)</h3>

        {upcoming?.length === 0 ? (
          <div className="text-gray-500 text-sm">No upcoming dues</div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((t: any) => (
              <div
                key={t._id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex justify-between"
              >
                <div>
                  <div className="font-semibold">{t.propertyName}</div>
                  <div className="text-sm text-gray-600">
                    Tenant: {t.tenantName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Due: {new Date(t.due_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="font-bold">
                  ₹{toNumber(t.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AdvancedChart({
  seriesA,
  seriesB,
  height = 80,
}: {
  seriesA: number[];
  seriesB?: number[];
  height?: number;
}) {
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

  const actualPath = `M${actualPoints.map((p) => `${p.x},${p.y}`).join(" L ")}`;
  const expectedPath = expectedPoints.length
    ? `M${expectedPoints.map((p) => `${p.x},${p.y}`).join(" L ")}`
    : "";

  // Area fill path for actual
  const areaPath = `${actualPath} L ${actualPoints[actualPoints.length - 1].x},${height - pad} L ${actualPoints[0].x},${height - pad} Z`;

  return (
    <div className="relative">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.05" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        <g stroke="#F3F4F6" strokeWidth="0.5" opacity="0.7">
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={pad}
              x2={width - pad}
              y1={height * ratio}
              y2={height * ratio}
            />
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
        {["Jan", "Apr", "Jul", "Oct", "Dec"].map((month, i) => (
          <span key={month} className="text-xs text-gray-400 font-medium">
            {month}
          </span>
        ))}
      </div>
    </div>
  );
}

function QuickContactButtons({
  tenant,
  onSend,
  onSms,
  onEmail,
}: {
  tenant: TenantDue;
  onSend: () => void;
  onSms: () => void;
  onEmail: () => void;
}) {
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
      <button
        onClick={() => {
          navigator.clipboard?.writeText(templateWhatsapp);
          onSend();
        }}
        className="text-xs px-2 py-1 rounded-md bg-[#FFF1F0] text-[#DC2626]"
      >
        Send
      </button>
      <button
        onClick={() => copyToClipboard(templateSms)}
        className="text-xs px-2 py-1 rounded-md border border-gray-100"
      >
        SMS
      </button>
      <button
        onClick={() => copyToClipboard(templateEmail)}
        className="text-xs px-2 py-1 rounded-md border border-gray-100"
      >
        Email
      </button>
    </div>
  );
}

function ReceiptBadge({
  receipts,
}: {
  receipts?: { id: string; uploadedAt: string; filename: string }[];
}) {
  if (!receipts || receipts.length === 0) {
    return (
      <div className="text-xs px-2 py-1 rounded-md border border-gray-100 text-gray-500">
        No receipts
      </div>
    );
  }
  return (
    <div className="text-xs px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-gray-700">
      {receipts.length} receipt(s)
    </div>
  );
}

/* Reminder modal */
function ReminderModal({
  tenant,
  onClose,
  onSend,
}: {
  tenant: TenantDue;
  onClose: () => void;
  onSend: (payload: any) => void;
}) {
  const [message, setMessage] = useState(
    `Hi ${tenant.tenantName}, this is a rent reminder for ₹${tenant.amount} due ${new Date(tenant.dueDateISO).toLocaleDateString()}. Please confirm payment.`,
  );
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-[640px] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Send reminder</div>
            <div className="text-xs text-gray-500">
              To: {tenant.tenantName} • {tenant.phone ?? tenant.email}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400">
            ✕
          </button>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-4 w-full border border-gray-100 rounded-md p-3 text-sm h-28"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend({ tenantId: tenant.id, message })}
            className="px-4 py-2 rounded-md"
            style={{ background: BRAND, color: "#fff" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* Offline payment modal */
function OfflinePaymentModal({
  tenant,
  onClose,
  onSave,
}: {
  tenant: TenantDue;
  onClose: () => void;
  onSave: (payload: any) => void;
}) {
  const [amount, setAmount] = useState(tenant.amount);
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-[520px] p-5">
        <div className="text-lg font-semibold">Record offline payment</div>
        <div className="text-xs text-gray-500 mt-1">
          Tenant: {tenant.tenantName} — {tenant.property}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border border-gray-100 rounded-md px-3 py-2"
          />
          <select className="border border-gray-100 rounded-md px-3 py-2">
            <option>Cash</option>
            <option>Bank transfer</option>
            <option>Cheque</option>
          </select>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note"
          className="mt-3 w-full border border-gray-100 rounded-md p-3 text-sm h-24"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ tenantId: tenant.id, amount, note })}
            className="px-4 py-2 rounded-md"
            style={{ background: BRAND, color: "#fff" }}
          >
            Save
          </button>
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
  return days === 0
    ? "Due today"
    : days > 0
      ? `${days} days`
      : `${Math.abs(days)} days past due`;
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

function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
