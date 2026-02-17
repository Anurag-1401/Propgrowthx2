import React, { useMemo, useState } from "react";

type TenantDue = {
  id: string;
  property: string;
  tenantName: string;
  unit?: string;
  amount: number;
  dueDateISO: string;
  phone?: string;
  email?: string;
  receipts?: { id: string; uploadedAt: string; filename: string }[];
  proofProvided?: boolean;
  note?: string;
};

type Props = {
  currency?: string;
  items?: TenantDue[];
  onAction?: (action: string, payload?: any) => void;
  className?: string;
};

export default function PaymentsSections({
  currency = "₹",
  items = SAMPLE_DATA,
  onAction = (a, p) => console.log(a, p),
  className = "",
}: Props) {
  const now = new Date();

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

  const [tab, setTab] = useState<"due7" | "due30">("due7");
  const [sortBy, setSortBy] = useState<"amount" | "age" | "property">("age");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [openReminder, setOpenReminder] = useState<TenantDue | null>(null);
  const [openOffline, setOpenOffline] = useState<TenantDue | null>(null);

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
      <section className={`grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-6 ${className}`}>
        {/* Due soon */}
        <div className="bg-white rounded-xl border border-gray-100 p-3 md:p-6 shadow-sm relative z-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold text-black">Due soon</h3>
            <div className="flex items-center gap-1 md:gap-2 text-sm">
              <button className={`px-2 md:px-4 py-1 md:py-2 rounded-md font-medium text-xs md:text-sm ${tab === "due7" ? "bg-[#FFF1F0] text-[#DC2626]" : "bg-white border border-gray-100"}`} onClick={() => setTab("due7")}>Next 7 days</button>
              <button className={`px-2 md:px-4 py-1 md:py-2 rounded-md font-medium text-xs md:text-sm ${tab === "due30" ? "bg-[#FFF1F0] text-[#DC2626]" : "bg-white border border-gray-100"}`} onClick={() => setTab("due30")}>Next 30 days</button>
            </div>
          </div>

          <div className="mt-3 md:mt-4 space-y-3 md:space-y-4 max-h-[320px] md:max-h-[420px] overflow-auto pr-2 relative z-10">
            {(tab === "due7" ? dueNext7 : dueNext30).map((d) => (
              <div key={d.id} className="flex items-center gap-2 md:gap-3 p-2 md:p-4 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 md:gap-2">
                    <div className="text-xs md:text-base font-semibold text-black truncate">{d.property} {d.unit ? `• ${d.unit}` : ""}</div>
                    <div className="text-xs text-gray-500">{daysLeftText(d.dueDateISO)}</div>
                  </div>

                  <div className="mt-1 md:mt-2 flex flex-col sm:flex-row sm:items-center gap-1 md:gap-3">
                    <div className="text-sm md:text-xl font-bold text-black">{formatCurrency(d.amount, currency)}</div>
                    <div className="text-xs md:text-sm text-gray-600 truncate">{d.tenantName}</div>
                  </div>

                  <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-1 md:gap-2">
                    <QuickContactButtons
                      tenant={d}
                      onSend={() => setOpenReminder(d)}
                      onSms={() => onAction("send-sms", d)}
                      onEmail={() => onAction("send-email", d)}
                    />
                    <button onClick={() => setOpenOffline(d)} className="text-xs px-2 py-1 md:px-3 md:py-2 rounded-md border border-gray-100 font-medium">Record payment</button>
                  </div>
                </div>
              </div>
            ))}

            {((tab === "due7" && dueNext7.length === 0) || (tab === "due30" && dueNext30.length === 0)) && (
              <div className="text-center text-sm text-gray-400 py-8">No upcoming dues in this range.</div>
            )}
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-xl border border-gray-100 p-3 md:p-6 shadow-sm relative z-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold text-black">Overdue</h3>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="text-xs md:text-sm text-gray-500 font-medium">Sort</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs px-2 py-1 md:px-3 md:py-2 border border-gray-100 rounded-md font-medium"
              >
                <option value="age">Age</option>
                <option value="amount">Amount</option>
                <option value="property">Property</option>
              </select>

              <button
                aria-label="Toggle sort direction"
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                className="p-1 md:p-2 rounded-md border border-gray-100 text-sm md:text-lg font-bold"
              >
                {sortDir === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          <div className="mt-3 md:mt-4 divide-y divide-gray-100 max-h-[320px] md:max-h-[520px] overflow-auto relative z-10">
            {sortedOverdue.map((o) => (
              <div key={o.id} className="p-2 md:p-4 flex items-start gap-2 md:gap-3">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 md:gap-2">
                    <div className="text-xs md:text-base font-semibold text-black">{o.property} {o.unit ? `• ${o.unit}` : ""}</div>
                    <div className="text-xs text-gray-500 font-medium">{o.daysOverdue} days</div>
                  </div>

                  <div className="mt-1 md:mt-2 flex flex-col sm:flex-row sm:items-center gap-1 md:gap-3">
                    <div className="text-sm md:text-xl font-bold text-black">{formatCurrency(o.amount, currency)}</div>
                    <div className="text-xs md:text-sm text-gray-600">{o.tenantName}</div>
                  </div>

                  <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-1 md:gap-2">
                    <button onClick={() => setOpenReminder(o)} className="px-2 md:px-4 py-1 md:py-2 rounded-md bg-[#FFF1F0] text-[#DC2626] text-xs font-medium">Send reminder</button>
                    {o.phone && (
                      <a href={`tel:${o.phone}`} className="px-2 md:px-4 py-1 md:py-2 rounded-md border border-gray-100 text-xs hover:bg-gray-50 font-medium">
                        <i className="fas fa-phone text-xs mr-1"></i>{o.phone}
                      </a>
                    )}
                    <button onClick={() => onAction("create-ticket", o)} className="px-2 md:px-4 py-1 md:py-2 rounded-md border border-gray-100 text-xs font-medium">Create ticket</button>
                    <ReceiptBadge receipts={o.receipts} />
                  </div>

                  {o.note && <div className="mt-2 md:mt-3 text-xs text-gray-600 font-medium">{o.note}</div>}
                </div>
              </div>
            ))}

            {sortedOverdue.length === 0 && <div className="text-center text-sm text-gray-400 p-6">No overdue items.</div>}
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

function QuickContactButtons({ tenant, onSend, onSms, onEmail }: { tenant: TenantDue; onSend: () => void; onSms: () => void; onEmail: () => void }) {
  const templateWhatsapp = `Hello ${tenant.tenantName}, this is a reminder that ₹${tenant.amount} is due on ${new Date(tenant.dueDateISO).toLocaleDateString()}. Please confirm payment. - PropGrowthX`;
  const templateSms = `Rent reminder: ₹${tenant.amount} due ${new Date(tenant.dueDateISO).toLocaleDateString()}. Reply to confirm.`;
  const templateEmail = `Hi ${tenant.tenantName},\\n\\nThis is a reminder that rent amounting to ₹${tenant.amount} is due on ${new Date(tenant.dueDateISO).toLocaleDateString()}.\\n\\nPlease complete payment or contact us if there is an issue.\\n\\nThanks,\\nPropGrowthX`;

  function copyToClipboard(text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      alert("Template copied to clipboard");
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => { navigator.clipboard?.writeText(templateWhatsapp); onSend(); }} className="text-sm px-3 py-2 rounded-md bg-[#FFF1F0] text-[#DC2626] font-medium">Send</button>
      <button onClick={() => copyToClipboard(templateSms)} className="text-sm px-3 py-2 rounded-md border border-gray-100 font-medium">SMS</button>
      <button onClick={() => copyToClipboard(templateEmail)} className="text-sm px-3 py-2 rounded-md border border-gray-100 font-medium">Email</button>
    </div>
  );
}

function ReceiptBadge({ receipts }: { receipts?: { id: string; uploadedAt: string; filename: string }[] }) {
  if (!receipts || receipts.length === 0) {
    return <div className="text-sm px-3 py-2 rounded-md border border-gray-100 text-gray-500 font-medium">No receipts</div>;
  }
  return <div className="text-sm px-3 py-2 rounded-md bg-gray-50 border border-gray-100 text-gray-700 font-medium">{receipts.length} receipt(s)</div>;
}

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
          <button onClick={() => onSend({ tenantId: tenant.id, message })} className="px-4 py-2 rounded-md bg-[#DC2626] text-white">Send</button>
        </div>
      </div>
    </div>
  );
}

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
          <button onClick={() => onSave({ tenantId: tenant.id, amount, note })} className="px-4 py-2 rounded-md bg-[#DC2626] text-white">Save</button>
        </div>
      </div>
    </div>
  );
}

function daysLeftText(iso: string) {
  const days = diffDays(new Date(), new Date(iso));
  return days === 0 ? "Due today" : days > 0 ? `${days} days` : `${Math.abs(days)} days past due`;
}

function diffDays(a: Date, b: Date) {
  const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatCurrency(num: number | string, currency = "₹") {
  if (typeof num === "string") return num;
  return `${currency}${num.toLocaleString()}`;
}

function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

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
    dueDateISO: addDaysISO(-4),
    phone: "+919700000111",
    email: "lina@example.com",
    receipts: [],
    proofProvided: false,
    note: "First overdue — send friendly reminder.",
  },
];