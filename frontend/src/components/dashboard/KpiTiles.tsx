import { useData } from "@/context/dataContext";
import { log } from "console";
import React, { useEffect, useState } from "react";
import { Complaint } from "../tenant/AddComplaintModal";
import { unknown } from "zod";

type KPIKey =
  | "monthlyDue"
  | "overdue"
  | "occupancy"
  | "netCashflow"
  | "maintenance"
  | "expirations"
  | "aiOpportunities";

type KpiItem = {
  key: KPIKey;
  title: string;
  value: number;
  sub?: string;
  hint?: string;
  color?: string;
  metric?: number;
};

type Props = {
  currency?: string;
  className?: string;
  onAction?: (action: string, payload) => void;
};

const BRAND = "#DC2626";

export default function KpiTiles({
  currency = "₹",
  className = "",
  onAction,
}: Props) {
  const { complaints,transactions} = useData();

  const totalRentAmount = React.useMemo(() => {
    const now = new Date();
    const today = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - now.getDay());

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    let sum = 0;
    let sumToday = 0;
    let sumWeek = 0;

    transactions?.forEach((t) => {
      if (t.type?.toLowerCase() === "rent" && t.due_date) {
        const amount = Number(t.amount) || 0;
        sum += amount;

        const [day, month, year] = t.due_date.split("-").map(Number);

        if (day === today && month === currentMonth && year === currentYear) {
          sumToday += amount;
        }

        const dueDate = new Date(year, month - 1, day);
        if (dueDate >= firstDayOfWeek && dueDate <= lastDayOfWeek) {
          sumWeek += amount;
        }
      }
    });

    return { total: sum, today: sumToday, week: sumWeek };
  }, [transactions]);

  let count = 0;
  complaints.map((val) => {
    if (val.priority == "urgent") count++;
  });

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<KpiItem | null>(null);

  const items: KpiItem[] = [
    {
      key: "monthlyDue",
      title: "Monthly Rent Due",
      value: totalRentAmount.total,
      sub: "Expected this month",
      metric: 152400,
    },
    {
      key: "overdue",
      title: "Overdue Payments",
      value: 0,
      sub: ` ${complaints?.length} action needed`,
      hint: "urgent",
      metric: 28400,
      color: "#DC2626",
    },
    {
      key: "maintenance",
      title: "Open Tickets",
      value: complaints?.length,
      sub: `${count} urgent •  ${complaints.length - count} routine `,
      metric: 14,
    },
    {
      key: "expirations",
      title: "Lease Renewals",
      value: 0,
      sub: "Expiring in 30 days",
      metric: 0,
    },
    {
      key: "aiOpportunities",
      title: "Price Optimization",
      value: 8,
      sub: "AI-suggested increases",
      metric: 8,
    },
  ];

  function openPanel(item: KpiItem) {
    setActive(item);
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
    setTimeout(() => setActive(null), 220);
  }

  return (
    <>
      <section className={`w-full ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Portfolio Overview
          </h2>
          <div className="text-sm text-gray-500">Real-time insights</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => openPanel(it)}
              className={`group relative bg-white border rounded-xl p-2 md:p-4 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 ${
                it.hint
                  ? "border-red-200 bg-red-50/30"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between mb-2 md:mb-4">
                <div className="flex-1">
                  <div className="text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                    {it.title}
                  </div>
                  <div
                    className={`text-sm md:text-2xl font-bold leading-tight mb-1 md:mb-2 ${
                      it.hint ? "text-red-900" : "text-gray-900"
                    }`}
                  >
                    {it.value}
                  </div>
                  {it.sub && (
                    <div className="text-xs md:text-sm font-medium text-gray-600">
                      {it.sub}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 md:gap-2 ml-1 md:ml-4">
                  <KpiIcon
                    type={it.key}
                    accent={it.color ?? (it.hint ? "#DC2626" : "#6B7280")}
                  />
                  {it.hint && (
                    <div className="text-xs px-1 py-0.5 md:px-2 md:py-1 rounded-md font-semibold text-red-700 bg-red-100 border border-red-200 whitespace-nowrap">
                      {it.hint}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center text-xs md:text-sm text-gray-400 group-hover:text-red-600 transition-colors duration-200 font-medium">
                View details
                <i className="fas fa-chevron-right ml-2 text-sm transform group-hover:translate-x-0.5 transition-transform duration-200"></i>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Slide-over panel */}
      <div
        className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity ${open ? "pointer-events-auto" : ""}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={closePanel}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-4 md:p-6 h-full flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4 md:mb-6">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  {active?.title}
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                  {active?.value}
                </div>
                {active?.sub && (
                  <div className="text-sm text-gray-500 mt-1">{active.sub}</div>
                )}
              </div>

              <button
                onClick={closePanel}
                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]"
              >
                <i className="fas fa-times w-5 h-5 text-gray-600"></i>
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {active?.key === "monthlyDue" && (
                <MonthlyDuePanel
                  currency={currency}
                  rentTotalToday={totalRentAmount.today}
                  rentTotalWeek={totalRentAmount.week}
                />
              )}
              {active?.key === "overdue" && (
                <OverduePanel currency={currency} onAction={onAction} />
              )}
              {active?.key === "occupancy" && <OccupancyPanel />}
              {active?.key === "netCashflow" && (
                <CashflowPanel currency={currency} />
              )}
              {active?.key === "maintenance" && (
                <MaintenancePanel onAction={onAction} complaints={complaints} />
              )}
              {active?.key === "expirations" && (
                <ExpirationsPanel onAction={onAction} />
              )}
              {active?.key === "aiOpportunities" && (
                <AiOpportunitiesPanel onAction={onAction} />
              )}
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                onClick={closePanel}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]"
              >
                Close
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

/* Detail Panels */
function MonthlyDuePanel({
  currency,
  rentTotalToday,
  rentTotalWeek,
}: {
  currency: string;
  rentTotalToday: number;
  rentTotalWeek: number;
}) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Monthly rent collection breakdown across your portfolio.
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
          <div className="text-sm text-gray-500">Due today</div>
          <div className="mt-1 text-xl font-bold text-gray-900">
            {rentTotalToday}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-200">
          <div className="text-sm text-gray-500">Due this week</div>
          <div className="mt-1 text-xl font-bold text-gray-900">
            {rentTotalWeek}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverduePanel({
  currency,
  onAction,
}: {
  currency: string;
  onAction?: (a: string, p) => void;
}) {
  const list = [
    { id: "t1", name: "Sunset Villa — Apt 2B", amount: 12000, days: 12 },
    { id: "t2", name: "Maple Apartments — Apt 4A", amount: 8000, days: 9 },
    { id: "t3", name: "Orchard House — Apt 1", amount: 8400, days: 3 },
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Overdue tenants requiring immediate attention.
      </div>
      <ul className="space-y-3">
        {list.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {t.name}
              </div>
              <div className="text-xs text-gray-500">{t.days} days overdue</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-bold text-gray-900">
                {formatCurrency(t.amount, currency)}
              </div>
              <button
                onClick={() => onAction?.("send-reminder", { tenantId: t.id })}
                className="px-3 py-1.5 rounded-md bg-[#DC2626] text-white text-sm font-medium hover:bg-red-700"
              >
                Send Reminder
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OccupancyPanel() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Current occupancy metrics and vacancy details.
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Current Occupancy
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-1">92%</div>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Vacant Units
          </div>
          <div className="text-xl font-bold text-gray-900 mt-1">12 units</div>
        </div>
      </div>
    </div>
  );
}

function CashflowPanel({ currency }: { currency: string }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Monthly cashflow analysis with projections.
      </div>
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 space-y-3">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Expected
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(152400, currency)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Actual
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(124000, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}

function MaintenancePanel({
  onAction,
  complaints = [],
}: {
  onAction?: (a: string, p) => void;
  complaints: Complaint[];
}) {
  const [tickets] = useState<Complaint[]>(complaints);

  const getDaysOpen = (date: string) => {
    const created = new Date(date);
    const today = new Date();
    const diff = today.getTime() - created.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-50 text-red-700";
      case "high":
        return "bg-orange-50 text-orange-700";
      case "medium":
        return "bg-yellow-50 text-yellow-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-50 text-blue-700";
      case "in progress":
        return "bg-purple-50 text-purple-700";
      case "resolved":
        return "bg-green-50 text-green-700";
      case "closed":
        return "bg-gray-200 text-gray-700";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Active maintenance requests across properties.
      </div>

      <ul className="space-y-3">
        {tickets.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white"
          >
            {/* LEFT SIDE */}
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {t.subject}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {t.tenant_name || "unknown"} • {t.property_name || "unknown"}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                {t.category} • {getDaysOpen(t.created_at)} days open
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {/* Priority */}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
                  t.priority,
                )}`}
              >
                {t.priority}
              </span>

              {/* Status */}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                  t.status,
                )}`}
              >
                {t.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExpirationsPanel({
  onAction,
}: {
  onAction?: (a: string, p) => void;
}) {
  const list = [
    { id: "e1", name: "Sunset Villa — Apt 2B", expiresIn: 10 },
    { id: "e2", name: "Orchard House — Apt 1", expiresIn: 28 },
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Leases requiring renewal attention.
      </div>
      <ul className="space-y-3">
        {list.map((l) => (
          <li
            key={l.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white"
          >
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {l.name}
              </div>
              <div className="text-xs text-gray-500">
                {l.expiresIn} days remaining
              </div>
            </div>
            <button
              onClick={() => onAction?.("offer-renewal", { leaseId: l.id })}
              className="px-3 py-1.5 rounded-md bg-[#DC2626] text-white font-medium hover:bg-red-700"
            >
              Offer Renewal
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AiOpportunitiesPanel({
  onAction,
}: {
  onAction?: (a: string, p) => void;
}) {
  const suggestions = [
    { id: "a1", name: "Maple Apartments — Apt 4A", improvement: "+6%" },
    { id: "a2", name: "Orchard House — Apt 1", improvement: "+9%" },
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        AI-powered pricing recommendations to optimize revenue.
      </div>
      <ul className="space-y-3">
        {suggestions.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white"
          >
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {s.name}
              </div>
              <div className="text-xs text-gray-500">
                Potential increase: {s.improvement}
              </div>
            </div>
            <button
              onClick={() => onAction?.("apply-price", { id: s.id })}
              className="px-3 py-1.5 rounded-md bg-[#DC2626] text-white font-medium hover:bg-red-700"
            >
              Apply
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Icons */
function KpiIcon({ type, accent }: { type: KPIKey; accent?: string }) {
  const fill = accent ?? BRAND;
  const iconProps = { className: "w-5 h-5", style: { color: fill } };

  switch (type) {
    case "monthlyDue":
      return <i className="fas fa-rupee-sign" {...iconProps}></i>;
    case "overdue":
      return <i className="fas fa-exclamation-triangle" {...iconProps}></i>;
    case "occupancy":
      return <i className="fas fa-th-large" {...iconProps}></i>;
    case "netCashflow":
      return <i className="fas fa-chart-line" {...iconProps}></i>;
    case "maintenance":
      return <i className="fas fa-wrench" {...iconProps}></i>;
    case "expirations":
      return <i className="fas fa-calendar-check" {...iconProps}></i>;
    case "aiOpportunities":
      return <i className="fas fa-chart-line-up" {...iconProps}></i>;
    default:
      return <i className="fas fa-chart-bar" {...iconProps}></i>;
  }
}

function formatCurrency(amount: number | string, currency = "₹") {
  if (typeof amount === "string") return amount;
  return `${currency}${amount.toLocaleString()}`;
}
