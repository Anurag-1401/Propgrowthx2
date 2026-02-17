import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Home,
  Bell,
  ChevronDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
  Menu,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Phone,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from "../../../context/dataContext";
import DashboardSkeleton from '@/pages/SkeletonLoading';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { properties, transactions, id, loading ,profile} = useData();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if(loading) return <DashboardSkeleton/>

  const myProfile = profile?.find(p => p.id === id);
  const myProperties = properties.filter((p) => p.buyer_id === id);
  const myTxs = transactions.filter(t => t.tenant_id === id);

  const totalRent = myTxs.reduce((sum, t) => sum + Number(t.amount), 0);
  const overdueAmount = myTxs
    .filter(t => t.status === 'pending' || t.status === 'overdue')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const kpiItems = [
    {
      key: "totalDue",
      title: "Total Rent Paid",
      value: `₹${totalRent.toLocaleString()}`,
      sub: "All transactions",
      color: "#DC2626",
      icon: DollarSign,
      details: myTxs.map(t => ({
        property: properties.find(p => p.id === t.property_id)?.property_name,
        amount: t.amount,
        date: t.date,
        status: t.status,
      })),
    },
    {
      key: "pending",
      title: "Pending Payments",
      value: `₹${overdueAmount.toLocaleString()}`,
      sub: `${myTxs.filter(t => t.status === 'pending').length} payments`,
      hint: overdueAmount > 0 ? "pending" : undefined,
      color: overdueAmount > 0 ? "#DC2626" : "#6B7280",
      icon: AlertCircle,
      details: myTxs.filter(t => t.status === 'pending').map(t => ({
        property: properties.find(p => p.id === t.property_id)?.property_name,
        amount: t.amount,
        date: t.date,
        daysOverdue: Math.floor((new Date().getTime() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24)),
      })),
    },
    {
      key: "properties",
      title: "Active Properties",
      value: myProperties.length.toString(),
      sub: "Rented units",
      color: "#DC2626",
      icon: Home,
      details: myProperties,
    },
    {
      key: "transactions",
      title: "Total Transactions",
      value: myTxs.length.toString(),
      sub: "Payment history",
      color: "#DC2626",
      icon: FileText,
      details: myTxs,
    },
  ];

  const pendingActions = myTxs
    .filter(t => t.status === 'pending' || t.status === 'overdue')
    .map((tx, idx) => ({
      id: `action-${idx}`,
      property: properties.find(p => p.id === tx.property_id)?.property_name || 'Unknown',
      tenant: 'You',
      amount: tx.amount,
      daysOverdue: Math.floor((new Date().getTime() - new Date(tx.date).getTime()) / (1000 * 60 * 60 * 24)),
      note: `Payment due for ${tx.type}`,
      priority: tx.status === 'overdue' ? 'urgent' : 'high',
      createdAt: tx.date,
      phone: '+91 9876543210',
    }));

  const nextAction = () => {
    if (pendingActions.length > 0) {
      setCurrentActionIndex((prev) => (prev + 1) % pendingActions.length);
    }
  };

  const prevAction = () => {
    if (pendingActions.length > 0) {
      setCurrentActionIndex((prev) => (prev - 1 + pendingActions.length) % pendingActions.length);
    }
  };

  const selectedKpiData = kpiItems.find(item => item.key === selectedKpi);

  return (
    <>
      <Helmet>
        <title>Tenant Dashboard | PropGrowthX</title>
        <meta
          name="description"
          content="Manage your rental properties and track payments with PropGrowthX."
        />
      </Helmet>

      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 flex flex-col`}
        >
          {/* Logo Section */}
          <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
            {sidebarOpen ? (
              <div className="flex items-center gap-3 flex-1">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 flex-shrink-0" />
                <span className="text-lg font-bold text-gray-900 whitespace-nowrap">PropGrowthX</span>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Expand sidebar"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
            <SidebarItem
              icon={BarChart3}
              label="Dashboard"
              active
              sidebarOpen={sidebarOpen}
            />
            <SidebarItem
              icon={Home}
              label="My Properties"
              onClick={() => navigate('/properties')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarItem
              icon={DollarSign}
              label="Transactions"
              onClick={() => navigate('/dashboard/tenant/transactions')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarItem
              icon={FileText}
              label="Complaints"
              onClick={() => navigate('/dashboard/tenant/complaints')}
              sidebarOpen={sidebarOpen}
            />
          </nav>

          {/* Bottom Menu */}
          <div className="px-2 py-4 border-t border-gray-200 space-y-2">
            <SidebarItem
              icon={HelpCircle}
              label="Support"
              onClick={() => navigate('/contact')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              sidebarOpen={sidebarOpen}
            />
            <div className='border border-red-200 bg-red-50 rounded-xl'>
              <SidebarItem
              icon={LogOut}
              label="Logout"
              onClick={() => {
                sessionStorage.clear();
                window.location.href = '/';
              }}
              sidebarOpen={sidebarOpen}
            />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300 overflow-y-auto`}>
          {/* Header */}
          <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
            <div className="px-4 md:px-8 py-4 flex items-center justify-between">
              {/* Left - Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Welcome back, Tenant</p>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* Search */}
                <div className="hidden md:block relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 border border-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]"
                  />
                </div>


                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => { setNotifOpen((s) => !s); setUserOpen(false); }}
                    className="p-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626] relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white rounded-full bg-[#DC2626]">
                      {myTxs.filter(t => t.status === 'pending').length}
                    </span>
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white border rounded-md shadow-lg z-40 p-3">
                      <div className="text-sm font-medium mb-2">Notifications</div>
                      <div className="text-xs text-gray-500">
                        {myTxs.filter(t => t.status === 'pending').length} pending payments
                      </div>
                      <ul className="mt-3 space-y-2">
                        {myTxs.filter(t => t.status === 'pending').slice(0, 2).map((tx) => (
                          <li key={tx.id} className="px-2 py-2 rounded hover:bg-gray-50">
                            <div className="text-sm">Payment due</div>
                            <div className="text-xs text-gray-400">
                              ₹{tx.amount.toLocaleString()} • {tx.date.split('T')[0]}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => { setUserOpen((s) => !s); setNotifOpen(false); }}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#DC2626]"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center font-semibold text-sm">
                      {myProfile?.name ? myProfile.name.charAt(0) : 'U'}
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900">{myProfile?.name}</span>
                      {/* <span className="text-xs text-gray-500">User</span> */}
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-40 py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-semibold text-gray-900">{myProfile?.name}</div>
                        <div className="text-sm font-semibold text-gray-900">{myProfile?.role}</div>
                        <div className="text-xs text-gray-500">{myProfile?.email}</div>
                      </div>
                      <button
                        onClick={() => { setUserOpen(false); navigate(`/profile/${myProfile?.id}`); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <FileText className="w-4 h-4 text-gray-400" />
                        My Profile
                      </button>
                      <div className="border-t border-gray-100 mt-2 pt-2" />
                      <button
                        onClick={() => {
                          sessionStorage.clear();
                          window.location.href = '/';
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-4 md:p-8">
            {/* KPI Tiles */}
            <section className="w-full mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {kpiItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setSelectedKpi(item.key)}
                      className={`group relative bg-white border rounded-xl p-2 md:p-4 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 ${
                        item.hint ? 'border-red-200 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2 md:mb-4">
                        <div className="flex-1">
                          <div className="text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                            {item.title}
                          </div>
                          <div
                            className={`text-sm md:text-2xl font-bold leading-tight mb-1 md:mb-2 ${
                              item.hint ? 'text-red-900' : 'text-gray-900'
                            }`}
                          >
                            {item.value}
                          </div>
                          {item.sub && (
                            <div className="text-xs md:text-sm font-medium text-gray-600">
                              {item.sub}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1 md:gap-2 ml-1 md:ml-4">
                          <div
                            className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-50 flex items-center justify-center"
                            style={{ color: item.color }}
                          >
                            <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          {item.hint && (
                            <div className="text-xs px-1 py-0.5 md:px-2 md:py-1 rounded-md font-semibold text-red-700 bg-red-100 border border-red-200 whitespace-nowrap">
                              {item.hint}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center text-xs md:text-sm text-gray-400 group-hover:text-red-600 transition-colors duration-200 font-medium">
                        View details
                        <ChevronRight className="w-3 h-3 ml-2" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Payments Overview & Pending Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mb-8">
              {/* Payments Overview */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mb-6 md:mb-8">
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900">Payment Summary</h3>
                  <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
                    Track your rental payments
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                      <div className="text-xs text-blue-600 uppercase tracking-wide font-semibold">
                        Total Paid
                      </div>
                      <div className="mt-2 text-2xl font-bold text-blue-900">
                        ₹{totalRent.toLocaleString()}
                      </div>
                      {myTxs.length > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          {myTxs.length} transactions
                        </div>
                      )}
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                      <div className="text-xs text-red-600 uppercase tracking-wide font-semibold">
                        Pending
                      </div>
                      <div className="mt-2 text-2xl font-bold text-red-900">
                        ₹{overdueAmount.toLocaleString()}
                      </div>
                      {pendingActions.length > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          {pendingActions.length} payments
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-4">Recent Transactions</div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {myTxs.slice(0, 5).map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                        >
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {properties.find(p => p.id === tx.property_id)?.property_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {tx.date ? tx.date.split("T")[0] : '-'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">
                              ₹{tx.amount.toLocaleString()}
                            </div>
                            <div
                              className={`text-xs font-semibold mt-1 ${
                                tx.status === 'completed'
                                  ? 'text-green-600'
                                  : 'text-yellow-600'
                              }`}
                            >
                              {tx.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg md:text-2xl font-bold text-gray-900">Pending Actions</h3>
                    <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
                      What needs your attention
                    </p>
                  </div>
                  {pendingActions.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {currentActionIndex + 1} of {pendingActions.length}
                    </div>
                  )}
                </div>

                {pendingActions.length > 0 ? (
                  <div className="relative h-80 flex items-center justify-center">
                    <div className="absolute w-full bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {pendingActions[currentActionIndex].property}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-sm text-gray-600 font-medium">
                              {pendingActions[currentActionIndex].priority === 'urgent'
                                ? 'Urgent'
                                : 'Action Needed'}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {Math.floor(
                            (new Date().getTime() -
                              new Date(
                                pendingActions[currentActionIndex].createdAt
                              ).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}
                          d ago
                        </span>
                      </div>

                      <div className="mb-6 p-4 bg-white rounded-xl border border-red-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                            {pendingActions[currentActionIndex].tenant.charAt(0)}
                          </div>
                          <div>
                            <div className="text-base font-bold text-gray-900">
                              {pendingActions[currentActionIndex].tenant}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-3xl font-black text-gray-900">
                          ₹{pendingActions[currentActionIndex].amount.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-200">
                          Pay Now
                        </button>
                        <a
                          href={`tel:${pendingActions[currentActionIndex].phone}`}
                          className="px-4 py-3 text-sm font-bold rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </a>
                      </div>
                    </div>

                    {pendingActions.length > 1 && (
                      <>
                        <button
                          onClick={prevAction}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-10"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={nextAction}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-10"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                      </>
                    )}

                    {pendingActions.length > 1 && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {pendingActions.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentActionIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentActionIndex
                                ? 'bg-gray-900 scale-125'
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">All payments are up to date!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Properties Grid */}
            <section className="w-full" id="properties-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Properties</h2>
                <button
                  onClick={() => navigate('/properties')}
                  className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors flex items-center gap-2"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {myProperties.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
                  {myProperties.map((property) => (
                    <div
                      key={property.id}
                      className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 md:p-6 hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                      onClick={() => navigate(`/property/${property.id}`)}
                    >
                      <div className="space-y-3 md:space-y-4">
                        <div className="relative w-full h-32 md:h-40 rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                          <div className="w-full h-full flex items-center justify-center">
                            {property.images? (
                              <img
                                src={property.images[0]}
                                alt={property.property_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Home className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                          <div className="absolute top-2 md:top-3 right-2 md:right-3">
                            <span className="px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-700 border-green-200">
                              {property.status === 'occupied' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1 md:space-y-2">
                          <h3 className="font-bold text-base md:text-lg text-gray-900 group-hover:text-red-600 transition-colors">
                            {property.property_name}
                          </h3>
                          <p className="text-gray-600 text-xs md:text-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {property.address}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-gray-100">
                          <div>
                            <div className="text-sm text-gray-600">Type</div>
                            <div className="text-base md:text-lg font-bold text-gray-900">
                              {property.property_type}
                            </div>
                          </div>
                          {property.since && (
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Since</div>
                              <div className="text-base md:text-lg font-bold text-gray-900">
                                {property.since}
                              </div>
                            </div>
                          )}
                          <div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center mb-8">
                  <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">No properties yet</p>
                </div>
              )}
            </section>
          </div>
        </main>

        {/* Detail Panel - Slides from Right */}
        {selectedKpi && selectedKpiData && (
          <DetailPanel
            item={selectedKpiData}
            onClose={() => setSelectedKpi(null)}
          />
        )}
      </div>
    </>
  );
};

// Sidebar Item Component
const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  sidebarOpen = true,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  sidebarOpen?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-base ${
        active
          ? 'bg-red-50 text-red-600 font-semibold'
          : 'text-gray-700 hover:bg-gray-50 font-medium'
      }`}
      title={!sidebarOpen ? label : ''}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      {sidebarOpen && <span
    className={`text-sm font-medium ${
    label === "Logout" ? "text-red-500" : "text-gray-700"
      }`}
    >
      {label}
    </span>}
    </button>
  );
};

// Detail Panel Component
const DetailPanel = ({
  item,
  onClose,
}: {
  item;
  onClose: () => void;
}) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
          <p className="text-gray-600 mb-6">{item.sub}</p>
          <div className="space-y-3">
            {Array.isArray(item.details) && item.details.length > 0 ? (
              item.details.map((detail, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                >
                  {detail.property_name || detail.property ? (
                    <>
                      <div className="font-semibold text-gray-900">
                        {detail.property_name || detail.property}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {detail.address && `${detail.address}`}
                        {detail.amount && `₹${detail.amount.toLocaleString()}`}
                      </div>
                      {detail.date && (
                        <div className="text-xs text-gray-500 mt-2">
                          {detail.date.split('T')[0]}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-900">
                      {JSON.stringify(detail)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No details available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TenantDashboard;