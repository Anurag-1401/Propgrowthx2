import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import KpiTiles from "./KpiTiles";
import UrgentActionStrip from "./UrgentActionStrip";
import PaymentsPanel from "./PaymentsPanel";
import PaymentsSections from "./PaymentsSections";
import PropertiesOverview from "./PropertiesOverview";

type PropertyStatus = "occupied" | "vacant" | "high-risk";

type Property = {
  id: string;
  name: string;
  portfolio?: string;
  region?: string;
  address?: string;
  monthlyRent?: number;
  status?: PropertyStatus;
  leaseExpires?: string;
  isPinned?: boolean;
};

function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const sampleProperties: Property[] = [
  { id: "all", name: "All Properties", portfolio: "Global", region: "All" },
  { id: "sunset", name: "Sunset Villa", portfolio: "Coastal Portfolio", region: "South Gate", address: "8819 Ohio St., South Gate", monthlyRent: 42000, status: "occupied", leaseExpires: addDaysISO(30), isPinned: true },
  { id: "maple", name: "Maple Apartments", portfolio: "Urban Portfolio", region: "Downtown", address: "12 Maple Ave", monthlyRent: 18000, status: "vacant", leaseExpires: addDaysISO(90) },
  { id: "orchard", name: "Orchard House", portfolio: "Coastal Portfolio", region: "Harbor", address: "45 Orchard Lane", monthlyRent: 25000, status: "high-risk", leaseExpires: addDaysISO(20) },
];

export default function DashboardNav() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [propOpen, setPropOpen] = useState<boolean>(false);
  const [userOpen, setUserOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property>(sampleProperties[0]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [recent, setRecent] = useState<Property[]>([]);
  const [localProps, setLocalProps] = useState<Property[]>(sampleProperties);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState<number>(-1);
  
  const propRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // keep local properties in sync
  useEffect(() => setLocalProps(sampleProperties), []);

  // Group properties by portfolio
  const grouped = useMemo(() => {
    const map = new Map<string, Property[]>();
    localProps.forEach((p) => {
      const key = p.portfolio ?? "Ungrouped";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries()).map(([k, arr]) => ({
      group: k,
      items: arr.sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [localProps]);

  // Filtering logic
  const flattenedList = useMemo(() => {
    const q = query.trim().toLowerCase();
    const activeFilters = new Set(filters);
    const items: Property[] = [];
    grouped.forEach(({ items: arr }) => {
      arr.forEach((p) => {
        const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.address ?? "").toLowerCase().includes(q) || (p.region ?? "").toLowerCase().includes(q);
        let matchesFilters = true;
        if (activeFilters.has("vacant")) matchesFilters = p.status === "vacant";
        if (activeFilters.has("high-risk")) matchesFilters = p.status === "high-risk" && matchesFilters;
        if (activeFilters.has("expiring")) matchesFilters = !!p.leaseExpires && daysUntil(p.leaseExpires) <= 60 && matchesFilters;
        if (matchesQuery && matchesFilters) items.push(p);
      });
    });
    return items;
  }, [grouped, query, filters]);

  function daysUntil(iso?: string) {
    if (!iso) return Infinity;
    const now = new Date();
    const dt = new Date(iso);
    return Math.ceil((dt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  function toggleFilter(tag: string) {
    setFilters((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function selectProperty(p: Property | null) {
    if (p) {
      setSelectedProperty(p);
      setRecent((r) => [p].concat(r.filter((x) => x.id !== p.id)).slice(0, 6));
    }
    setPropOpen(false);
    setFocusedIdx(-1);
  }

  function togglePin(p: Property) {
    setLocalProps((prev) => prev.map((x) => (x.id === p.id ? { ...x, isPinned: !x.isPinned } : x)));
  }

  function createGroup(name: string) {
    if (!name.trim()) return;
    setLocalProps((prev) => prev.map((p, i) => (i === 0 ? { ...p, portfolio: name } : p)));
    setShowCreateGroup(false);
  }

  // close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (propRef.current && !propRef.current.contains(e.target as Node)) {
        setPropOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex min-h-[64px]">
      <style>
        {`
          @media (max-width: 1024px) {
            .dashboard-sidebar {
              position: fixed !important;
              left: ${sidebarOpen ? '0' : '-100%'} !important;
              width: 280px !important;
              z-index: 50 !important;
              transition: left 0.3s ease !important;
            }
            .dashboard-main {
              margin-left: 0 !important;
              width: 100% !important;
            }
          }
          @media (max-width: 768px) {
            .dashboard-header {
              height: 64px !important;
              padding: 0 16px !important;
            }
          }
          @media (min-width: 1025px) {
            .mobile-menu-toggle {
              display: none !important;
            }
          }
        `}
      </style>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar flex-shrink-0 bg-white border-r border-gray-100 transition-width duration-200 ease-in-out
          ${sidebarOpen ? "w-64" : "w-20"} h-screen sticky top-0 z-40`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col">
          {/* Brand */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-md overflow-hidden shadow-sm">
              <img 
                src="/logo.png" 
                alt="PropGrowthX Logo" 
                className="w-full h-full object-contain"
              />
            </div>

            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-lg">PropGrowthX</span>
              </div>
            )}

            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="ml-auto bg-transparent p-2 rounded-md hover:bg-gray-50"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              title={sidebarOpen ? "Collapse" : "Expand"}
            >
              <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-gray-600`}></i>
            </button>
          </div>

          {/* Nav items */}
          <nav className="px-2 py-4 flex-1 overflow-y-auto">
            {[
              { id: "properties", label: "Properties", icon: "fa-building", onClick: () => navigate("/properties-manage") },
              { id: "payments", label: "Payments", icon: "fa-receipt", onClick: () => navigate("/payments") },
              { id: "support", label: "Support", icon: "fa-headset", onClick: () => navigate("/contact") },
              { id: "complaints", label: "Complaints", icon: "fa-folder", onClick: () => navigate("/dashboard/owner/complaints") },
              { id: "team", label: "Team", icon: "fa-users" },
              { id: "profile", label: "Profile", icon: "fa-user", onClick: () => navigate("/profile") },
              { id: "settings", label: "Settings", icon: "fa-cog" },
            ].map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                collapsed={!sidebarOpen}
                onClick={item.onClick}
              />
            ))}
          </nav>

          {/* footer small */}
          <div className="px-3 py-4 border-t border-gray-100">
            {sidebarOpen ? (
              <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
            ) : (
              <div className="text-center text-xs text-gray-400">©PG</div>
            )}
          </div>
        </div>
      </aside>

      {/* Main header + content container */}
      <div className="dashboard-main flex-1 min-h-screen">
        <header className="dashboard-header h-16 bg-white border-b border-gray-100 flex items-center px-6 sticky top-0 z-30">
          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-toggle p-2 rounded-md hover:bg-gray-50 mr-3 xl:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars w-4 h-4 text-gray-600"></i>
          </button>

          {/* Property selector - always visible */}
          <div className="property-selector flex items-center gap-2 md:gap-4 flex-1 md:flex-initial">
            <div ref={propRef} className="relative">
              <button
                onClick={() => {
                  setPropOpen((s) => !s);
                  setTimeout(() => searchRef.current?.focus(), 80);
                }}
                aria-haspopup="listbox"
                aria-expanded={propOpen}
                className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]"
              >
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-sm md:text-base font-semibold text-black truncate">{selectedProperty.name}</span>
                  <span className="text-xs md:text-sm text-gray-500 truncate">{selectedProperty.region ? `${selectedProperty.region} • ${selectedProperty.portfolio ?? ""}` : "View & manage"}</span>
                </div>
                <i className="fas fa-chevron-down ml-1 w-3 h-3 text-gray-400"></i>
              </button>

              {/* Advanced Dropdown */}
              {propOpen && (
                <div className="property-dropdown absolute left-0 mt-2 w-[520px] bg-white rounded-xl shadow-lg border border-gray-100 z-[60]">
                  {/* Header: search + create group */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          ref={searchRef}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search properties, tenants or region..."
                          className="w-full rounded-full border border-gray-100 px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]"
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                      </div>
                      <button
                        onClick={() => setShowCreateGroup(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white"
                        style={{ background: "#DC2626" }}
                      >
                        <i className="fas fa-plus w-4 h-4"></i>
                        Create Group
                      </button>
                    </div>

                    {/* Quick filters */}
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {[
                        { key: "vacant", label: "Vacant" },
                        { key: "high-risk", label: "High-Risk" },
                        { key: "expiring", label: "Expiring <=60d" },
                      ].map((t) => {
                        const active = filters.includes(t.key);
                        return (
                          <button
                            key={t.key}
                            onClick={() => toggleFilter(t.key)}
                            className={`text-xs px-3 py-1 rounded-full border ${active ? "border-[#DC2626] bg-[#FFEDEB]" : "border-gray-100 bg-white"}`}
                            style={active ? { color: "#DC2626" } : undefined}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 max-h-72 overflow-auto">
                    {/* Recently viewed */}
                    {recent.length > 0 && (
                      <>
                        <div className="text-xs text-gray-400 px-1 mb-2">Recently viewed</div>
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {recent.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => selectProperty(r)}
                              className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 text-sm"
                            >
                              <div className="w-6 h-6 rounded-sm bg-white border border-gray-200 flex items-center justify-center text-xs font-medium">{r.name.charAt(0)}</div>
                              <div className="text-left">
                                <div className="text-sm text-black">{r.name}</div>
                                <div className="text-xs text-gray-400">{r.portfolio ?? r.region}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* When nothing matches */}
                    {flattenedList.length === 0 && (
                      <div className="text-center py-8 text-gray-400">No properties match your search or filters.</div>
                    )}

                    {/* Grouped list */}
                    <div ref={listRef} className="space-y-2">
                      {query.trim() === "" ? (
                        grouped.map(({ group, items }) => (
                          <div key={group}>
                            <div className="text-xs text-gray-400 px-1 py-1">{group}</div>
                            <div className="grid grid-cols-1 gap-2">
                              {items.map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    if (p.id === "all") {
                                      navigate("/all-properties");
                                    } else {
                                      selectProperty(p);
                                    }
                                  }}
                                  className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-gray-50 focus:outline-none"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-sm font-medium">
                                      {p.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                      <div className="text-sm text-black">{p.name}</div>
                                      <div className="text-xs text-gray-400">{p.address ?? p.region}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="text-xs text-gray-500">{p.monthlyRent ? `$${p.monthlyRent}` : ""}</div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        togglePin(p);
                                      }}
                                      className="p-1 rounded-md hover:bg-gray-100"
                                    >
                                      <i className={`fas fa-thumbtack w-4 h-4 ${p.isPinned ? "text-[#DC2626]" : "text-gray-500"}`}></i>
                                    </button>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        flattenedList.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              if (p.id === "all") {
                                navigate("/all-properties");
                              } else {
                                selectProperty(p);
                              }
                            }}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-gray-50 focus:outline-none"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-sm font-medium">
                                {p.name.charAt(0)}
                              </div>
                              <div className="text-left">
                                <div className="text-sm text-black">{p.name}</div>
                                <div className="text-xs text-gray-400">{p.portfolio ?? p.region}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-xs text-gray-500">{p.monthlyRent ? `₹${p.monthlyRent}` : ""}</div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePin(p);
                                }}
                                className="p-1 rounded-md hover:bg-gray-100"
                              >
                                <i className={`fas fa-thumbtack w-4 h-4 ${p.isPinned ? "text-[#DC2626]" : "text-gray-500"}`}></i>
                              </button>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-400">Tip: Pin important properties to access them quickly.</div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate("/all-properties")} className="text-sm px-3 py-1 rounded-md border border-gray-100 bg-white">View All</button>
                      <button onClick={() => setPropOpen(false)} className="text-sm px-3 py-1 rounded-md bg-white border border-gray-100">Close</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search - hidden on mobile, visible on tablet+ */}
          <div className="hidden md:flex flex-1 px-6 max-w-md">
            <label htmlFor="globalSearch" className="sr-only">Search properties</label>
            <div className="relative w-full">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
              <input
                id="globalSearch"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-gray-100 rounded-full px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]"
                placeholder="Search properties..."
                aria-label="Search properties"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Upload Excel - desktop only */}
            <button
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]"
              style={{ background: "#DC2626" }}
              aria-label="Upload Excel"
            >
              <i className="fas fa-upload w-4 h-4 text-white"></i>
              <span className="text-sm">Upload Excel</span>
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setNotifOpen((s) => !s); setUserOpen(false); setPropOpen(false); }}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className="p-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]"
              >
                <i className="fas fa-bell w-4 h-4 text-gray-600"></i>
                <span className="sr-only">Open notifications</span>
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white rounded-full bg-[#DC2626]">3</span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white border rounded-md shadow-lg z-40 p-3">
                  <div className="text-sm font-medium mb-2">Notifications</div>
                  <div className="text-xs text-gray-500">You have 3 unread items</div>
                  <ul className="mt-3 space-y-2">
                    <li className="px-2 py-2 rounded hover:bg-gray-50">
                      <div className="text-sm">2 overdue payments</div>
                      <div className="text-xs text-gray-400">Sunset Villa • 2 days</div>
                    </li>
                    <li className="px-2 py-2 rounded hover:bg-gray-50">
                      <div className="text-sm">New maintenance request</div>
                      <div className="text-xs text-gray-400">Maple Apartments • 6 hrs</div>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* User menu */}
            <div ref={userRef} className="relative">
              <button
                onClick={() => { setUserOpen((s) => !s); setNotifOpen(false); setPropOpen(false); }}
                aria-expanded={userOpen}
                aria-label="User menu"
                className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                  S
                </div>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900">Sarah Johnson</span>
                  <span className="text-xs text-gray-500">Owner</span>
                </div>
                <i className="fas fa-chevron-down w-3 h-3 text-gray-400 ml-1"></i>
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-40 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-xs text-gray-500">sarah.johnson@gmail.com</div>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <i className="fas fa-user w-4 h-4 text-gray-400"></i>
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <i className="fas fa-cog w-4 h-4 text-gray-400"></i>
                    Account Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <i className="fas fa-question-circle w-4 h-4 text-gray-400"></i>
                    Help & Support
                  </button>
                  <div className="border-t border-gray-100 mt-2 pt-2" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                    <i className="fas fa-sign-out-alt w-4 h-4 text-red-500"></i>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Create Group Modal */}
        {showCreateGroup && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg w-[420px] p-5">
              <div className="text-lg font-semibold">Create Property Group</div>
              <div className="text-sm text-gray-500 mt-1">Group properties for quick switching.</div>
              <div className="mt-4">
                <input
                  placeholder="e.g. South Gate Portfolio"
                  className="w-full rounded-md border border-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowCreateGroup(false)} className="px-3 py-2 rounded-md border border-gray-100">Cancel</button>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="px-4 py-2 rounded-md text-white"
                  style={{ background: "#DC2626" }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="p-4 md:p-8 bg-gray-50 min-h-screen relative z-10">
          <KpiTiles 
            currency="₹" 
            onAction={(action, payload) => {
              console.log('KPI Action:', action, payload);
            }}
            className="mb-6 md:mb-8"
          />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <PaymentsPanel 
                currency="₹"
                onAction={(action, payload) => {
                  console.log('Payment Action:', action, payload);
                }}
              />
            </div>
            
            <UrgentActionStrip 
              currency="₹"
              onAction={(action, item) => {
                console.log('Urgent Action:', action, item);
              }}
            />
          </div>
          
          <PaymentsSections 
            currency="₹"
            onAction={(action, payload) => {
              console.log('Payment Sections Action:', action, payload);
            }}
            className="mb-6 md:mb-8"
          />
          
          <PropertiesOverview className="mb-6 md:mb-8" />
        </main>
      </div>
    </div>
  );
}

function NavItem({ label, icon, collapsed = false, onClick }: { label: string; icon: string; collapsed?: boolean; onClick?: () => void }) {
  return (
    <button
      className={`group w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]`}
      style={{ transition: "background-color .12s ease" }}
      aria-label={label}
      onClick={onClick}
    >
      <span className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-50">
        <i className={`fas ${icon} w-5 h-5 text-gray-600`}></i>
      </span>
      <span className={`text-sm font-medium text-black ${collapsed ? "hidden" : "block"}`}>{label}</span>
    </button>
  );
}