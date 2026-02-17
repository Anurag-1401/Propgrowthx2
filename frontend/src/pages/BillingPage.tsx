import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Download,
  Trash2,
  AlertCircle,
  Check,
  Clock,
  AlertTriangle,
  FileText,
  Eye,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

type PaymentMethod = {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand: string;
  expiryMonth?: number;
  expiryYear?: number;
  accountHolderName: string;
  isDefault: boolean;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  items?: Array<{ name: string; amount: number; quantity: number }>;
};

type TabType = 'overview' | 'invoices' | 'payment-methods' | 'billing-settings';

const BillingPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2026,
      accountHolderName: 'Asha Patel',
      isDefault: true,
    },
    {
      id: '2',
      type: 'bank',
      last4: '5678',
      brand: 'HDFC Bank',
      accountHolderName: 'Asha Patel',
      isDefault: false,
    },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      amount: 5000,
      date: '2024-02-01',
      dueDate: '2024-02-15',
      status: 'paid',
      description: 'Monthly subscription - February 2024',
      items: [
        { name: 'Property Management Fee', amount: 3000, quantity: 1 },
        { name: 'Premium Features', amount: 2000, quantity: 1 },
      ],
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      amount: 5000,
      date: '2024-03-01',
      dueDate: '2024-03-15',
      status: 'paid',
      description: 'Monthly subscription - March 2024',
      items: [
        { name: 'Property Management Fee', amount: 3000, quantity: 1 },
        { name: 'Premium Features', amount: 2000, quantity: 1 },
      ],
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      amount: 5000,
      date: '2024-04-01',
      dueDate: '2024-04-15',
      status: 'pending',
      description: 'Monthly subscription - April 2024',
      items: [
        { name: 'Property Management Fee', amount: 3000, quantity: 1 },
        { name: 'Premium Features', amount: 2000, quantity: 1 },
      ],
    },
  ]);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paid = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const pending = invoices
      .filter((inv) => inv.status === 'pending' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
    return { total, paid, pending };
  }, [invoices]);

  const { total: totalSpent, paid: paidAmount, pending: pendingAmount } = stats;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isCardExpiringsSoon = (expiryMonth: number, expiryYear: number) => {
    const expiryDate = new Date(expiryYear, expiryMonth - 1, 28);
    const daysUntilExpiry = (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry < 60 && daysUntilExpiry > 0;
  };

  const handleDeletePaymentMethod = (id: string) => {
    if (!window.confirm('Are you sure you want to remove this payment method?')) {
      return;
    }
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    toast.success('Payment method removed');
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
    toast.success('Default payment method updated');
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success('Invoice downloaded');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Overview', icon: <Check className="w-4 h-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="w-4 h-4" /> },
    { id: 'payment-methods', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'billing-settings', label: 'Settings', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <>
      <Helmet>
        <title>Billing & Payments | PropGrowthX</title>
        <meta name="description" content="Manage your billing, payments, and invoices." />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');

        .page-title {
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          font-size: 48px;
          font-weight: 400;
          letter-spacing: -1.5px;
        }

        .page-subtitle {
          color: #666;
          font-size: 15px;
        }

        .tab-button {
          padding: 12px 16px;
          border-bottom: 2px solid transparent;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
        }

        .tab-button.active {
          color: #dc2626;
          border-bottom-color: #dc2626;
        }

        .tab-button:hover {
          color: #333;
        }

        .stat-card {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          padding: 20px;
          text-align: center;
        }

        .stat-card.featured {
          border: 2px solid #dc2626;
          background: linear-gradient(135deg, #fff 0%, rgba(220, 38, 38, 0.02) 100%);
        }

        .stat-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #666;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #000;
          margin-bottom: 6px;
        }

        .stat-value.red {
          color: #dc2626;
        }

        .invoice-item {
          background: #f9fafb;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .invoice-item:hover {
          background: #f3f4f6;
          border-color: rgba(220, 38, 38, 0.2);
        }

        .payment-method-card {
          background: #f9fafb;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 18px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .payment-method-card:hover {
          background: #f3f4f6;
          border-color: rgba(220, 38, 38, 0.2);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y-auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-body {
          padding: 24px;
        }

        .summary-card {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          padding: 24px;
          position: sticky;
          top: 20px;
        }

        .summary-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .summary-section:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .summary-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #333;
          margin-bottom: 12px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .summary-item-label {
          font-size: 14px;
          color: #666;
        }

        .summary-item-value {
          font-weight: 600;
          color: #000;
        }

        .red-accent {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
        }

        @media (max-width: 1024px) {
          .summary-card {
            position: static;
          }
        }
      `}</style>

        <div className="min-h-screen bg-white">
          {/* Header */}
          <div className="border-b border-gray-100">
            <div className="container-custom py-6">
              <div className="flex items-start gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild 
                  className="hover:bg-gray-100 mt-1 flex-shrink-0"
                  aria-label="Go back to profile"
                >
                  <Link to="/profile">
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
                <div className="flex-1">
                  <h1 className="page-title mb-1">Billing & Payments</h1>
                  <p className="page-subtitle">Manage your accounts, invoices, and payment methods</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="container-custom">
              <div className="flex gap-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    aria-selected={activeTab === tab.id}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="container-custom py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="stat-card">
                        <div className="stat-label">Total Spent</div>
                        <div className="stat-value">{formatCurrency(totalSpent)}</div>
                        <p className="text-xs text-gray-500">{invoices.length} invoices</p>
                      </div>
                      <div className="stat-card featured">
                        <div className="stat-label">Pending Payment</div>
                        <div className="stat-value red">{formatCurrency(pendingAmount)}</div>
                        <p className="text-xs text-red-600">{invoices.filter((i) => i.status !== 'paid').length} due</p>
                      </div>
                    </div>

                    {/* Recent Invoices */}
                    <div className="bg-white border border-gray-100 rounded-16 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Invoices</h2>
                      <div className="space-y-3">
                        {invoices.slice(0, 5).map((invoice) => (
                          <div key={invoice.id} className="invoice-item flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                              <div className="text-sm text-gray-600 mt-1">{invoice.date}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</div>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(invoice.status)}`}>
                                  {getStatusIcon(invoice.status)}
                                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedInvoice(invoice)}
                                className="text-gray-600 hover:text-gray-900"
                                aria-label={`View invoice ${invoice.invoiceNumber}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Invoices Tab */}
                {activeTab === 'invoices' && (
                  <div className="bg-white border border-gray-100 rounded-16 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">All Invoices</h2>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {invoices.map((invoice) => (
                        <div key={invoice.id} className="invoice-item flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                            <div className="text-sm text-gray-600 mt-1">{invoice.description}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</div>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(invoice.status)}`}>
                                {getStatusIcon(invoice.status)}
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedInvoice(invoice)}
                                className="text-gray-600 hover:text-gray-900"
                                aria-label={`View invoice ${invoice.invoiceNumber}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDownloadInvoice(invoice.id)}
                                className="text-gray-600 hover:text-gray-900"
                                aria-label={`Download invoice ${invoice.invoiceNumber}`}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Methods Tab */}
                {activeTab === 'payment-methods' && (
                  <div className="bg-white border border-gray-100 rounded-16 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white gap-2"
                        aria-label="Add new payment method"
                      >
                        <Plus className="w-4 h-4" />
                        Add Method
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {paymentMethods.length > 0 ? (
                        paymentMethods.map((pm) => (
                          <div key={pm.id} className="payment-method-card">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {pm.brand} •••• {pm.last4}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-0.5">
                                    {pm.accountHolderName}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {pm.type === 'card' && pm.expiryMonth && pm.expiryYear && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  Expires {String(pm.expiryMonth).padStart(2, '0')}/{pm.expiryYear}
                                </span>
                                {isCardExpiringsSoon(pm.expiryMonth, pm.expiryYear) && (
                                  <span 
                                    className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded flex items-center gap-1"
                                    role="alert"
                                  >
                                    <AlertTriangle className="w-3 h-3" />
                                    Expiring soon
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              {pm.isDefault && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                  Default
                                </span>
                              )}
                              {!pm.isDefault && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSetDefaultPaymentMethod(pm.id)}
                                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                                >
                                  Set Default
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeletePaymentMethod(pm.id)}
                                className="text-red-600 hover:bg-red-50"
                                aria-label={`Delete ${pm.brand} •••• ${pm.last4}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-600">No payment methods added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'billing-settings' && (
                  <div className="space-y-6">
                    <div className="bg-white border border-gray-100 rounded-16 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing Preferences</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-12">
                          <div>
                            <div className="font-medium text-gray-900">Automatic Renewal</div>
                            <div className="text-sm text-gray-600 mt-1">Your subscription will renew automatically each month</div>
                          </div>
                          <input type="checkbox" defaultChecked className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-12">
                          <div>
                            <div className="font-medium text-gray-900">Email Receipts</div>
                            <div className="text-sm text-gray-600 mt-1">Receive invoice copies via email</div>
                          </div>
                          <input type="checkbox" defaultChecked className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-12">
                          <div>
                            <div className="font-medium text-gray-900">Payment Reminders</div>
                            <div className="text-sm text-gray-600 mt-1">Get notified before payment is due</div>
                          </div>
                          <input type="checkbox" defaultChecked className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Summary */}
              <div className="space-y-6">
                <div className="summary-card">
                  <div className="summary-section">
                    <div className="summary-title">Current Plan</div>
                    <div className="summary-item">
                      <span className="summary-item-label">Plan Type</span>
                      <span className="summary-item-value">Premium</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-item-label">Billing Cycle</span>
                      <span className="summary-item-value">Monthly</span>
                    </div>
                  </div>

                  <div className="summary-section">
                    <div className="summary-title">Next Billing</div>
                    <div className="summary-item">
                      <span className="summary-item-label">Due Date</span>
                      <span className="summary-item-value text-red-600">15 Apr 2024</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-item-label">Amount</span>
                      <span className="summary-item-value">{formatCurrency(5000)}</span>
                    </div>
                  </div>

                  <div className="summary-section">
                    <div className="summary-title">Account Status</div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Active</span>
                    </div>
                  </div>

                  <Button 
                    className="red-accent w-full"
                    aria-label="Upgrade your plan"
                  >
                    Upgrade Plan
                  </Button>
                </div>

                {/* Help Card */}
                <div className="bg-blue-50 border border-blue-100 rounded-14 p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Need Help?</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Check our billing FAQ or contact support for assistance with your account.
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Detail Modal */}
          {selectedInvoice && (
            <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedInvoice.invoiceNumber}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedInvoice.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedInvoice(null)}
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="modal-body">
                  {/* Invoice Items */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Invoice Items</h3>
                    <div className="space-y-3">
                      {selectedInvoice.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Invoice Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Invoice Date</span>
                        <span className="font-medium text-gray-900">{selectedInvoice.date}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Due Date</span>
                        <span className="font-medium text-gray-900">{selectedInvoice.dueDate}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                          {getStatusIcon(selectedInvoice.status)}
                          {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gray-50 rounded-12 p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                      <span className="text-lg font-bold text-red-600">{formatCurrency(selectedInvoice.amount)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-200"
                      onClick={() => {
                        handleDownloadInvoice(selectedInvoice.id);
                        setSelectedInvoice(null);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </>
  );
};

export default BillingPage;