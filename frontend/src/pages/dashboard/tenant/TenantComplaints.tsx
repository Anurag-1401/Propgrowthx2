import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddComplaintModal from "@/components/tenant/AddComplaintModal";
import { Complaint } from '@/components/tenant/AddComplaintModal';
import ComplaintList from '@/components/dashboard/ComplaintList';
import { useData } from '@/context/dataContext';
import DashboardSkeleton from '@/pages/SkeletonLoading';

const TenantComplaints = () => {
  const { complaints, setComplaints, id, loading } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  if(loading) return <DashboardSkeleton/>

  const tenantComplaints = complaints.filter(c => c.tenant_id === id);

  const stats = {
    total: tenantComplaints.length,
    open: tenantComplaints.filter(c => c.status === 'open').length,
    inProgress: tenantComplaints.filter(c => c.status === 'in-progress').length,
    resolved: tenantComplaints.filter(c => c.status === 'resolved').length,
    urgent: tenantComplaints.filter(c => c.priority === 'urgent' && c.status !== 'resolved' && c.status !== 'closed').length,
  };

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>My Complaints | PropGrowthX</title>
        <meta name="description" content="Submit and track your property complaints and maintenance requests." />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');

        :root {
          --brand-red: #DC2626;
          --muted: #6b7280;
          --card-border: rgba(16,24,40,0.06);
          --soft-bg: #fbfbfd;
          --glass: rgba(255,255,255,0.78);
        }

        * { box-sizing: border-box; font-family: 'Geist', sans-serif; }

        /* Professional entrance animations */
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Page title */
        .page-title {
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          font-size: clamp(36px, 4.5vw, 56px);
          font-weight: 400;
          letter-spacing: -1.5px;
          line-height: 1.1;
          color: #0b1220;
          margin: 0;
          animation: slideInLeft 0.7s ease-out 0.1s both;
        }

        .title-accent {
          color: var(--brand-red);
          font-weight: 700;
          animation: slideInRight 0.7s ease-out 0.2s both;
          display: inline-block;
        }

        /* Layout utilities */
        .container-custom {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 32px;
        }

        .header-hero {
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

        .header-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          pointer-events: none;
          box-shadow: 0 20px 50px rgba(2, 6, 23, 0.05);
        }

        .header-title-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .header-left {
          flex: 1;
          min-width: 300px;
        }

        .header-subtitle {
          font-size: 16px;
          color: var(--muted);
          font-weight: 400;
          letter-spacing: 0.2px;
          line-height: 1.6;
          margin-top: 12px;
          animation: fadeInUp 0.8s ease-out 0.25s both;
        }

        .divider-line {
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

        /* Back button */
        .back-btn {
          display:inline-flex;
          align-items:center;
          gap:10px;
          background: var(--glass);
          border: 1px solid rgba(2,6,23,0.06);
          border-radius: 10px;
          padding: 10px 14px;
          cursor:pointer;
          transition: transform .16s ease, box-shadow .16s ease;
          backdrop-filter: blur(8px);
          font-weight: 600;
          color: #0b1220;
          animation: slideInLeft 0.7s ease-out 0s both;
        }
        .back-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(2,6,23,0.06);
        }
        .back-btn svg { width: 14px; height: 14px; }

        /* New complaint button */
        .new-complaint-btn {
          animation: slideInRight 0.7s ease-out 0.1s both;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0,1fr));
          gap: 16px;
        }
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
        }
        @media (min-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(5, minmax(0,1fr)); }
        }

        .stat-card {
          position:relative;
          border-radius: 12px;
          overflow: hidden;
          padding: 16px;
          background: linear-gradient(180deg,#fff,#fbfcfd);
          border: 1px solid var(--card-border);
          box-shadow: 0 8px 24px rgba(2,6,23,0.03);
          transition: transform .18s cubic-bezier(.2,.9,.2,1), box-shadow .18s ease, border-color .18s ease;
          display:flex;
          flex-direction:column;
          gap:10px;
          min-height:120px;
          animation: fadeInUp 0.7s ease-out both;
        }

        /* Stagger animations for stat cards */
        .stat-card:nth-child(1) { animation-delay: 0.4s; }
        .stat-card:nth-child(2) { animation-delay: 0.5s; }
        .stat-card:nth-child(3) { animation-delay: 0.6s; }
        .stat-card:nth-child(4) { animation-delay: 0.7s; }
        .stat-card:nth-child(5) { animation-delay: 0.8s; }

        /* left accent bar */
        .stat-card::before {
          content:'';
          position:absolute;
          left:0;
          top:0;
          bottom:0;
          width:6px;
          background: linear-gradient(180deg, rgba(220,38,38,0.12), rgba(220,38,38,0.06));
          opacity:0.95;
        }

        .stat-top {
          display:flex;
          gap:12px;
          align-items:center;
        }

        .stat-icon {
          width:48px;
          height:48px;
          border-radius:10px;
          background: linear-gradient(180deg,#fff,#f7f8fb);
          display:inline-flex;
          align-items:center;
          justify-content:center;
          border: 1px solid rgba(2,6,23,0.03);
          box-shadow: 0 6px 18px rgba(2,6,23,0.03);
          flex-shrink:0;
          animation: scaleIn 0.6s cubic-bezier(.2,.9,.2,1) both;
        }

        .stat-card:nth-child(1) .stat-icon { animation-delay: 0.5s; }
        .stat-card:nth-child(2) .stat-icon { animation-delay: 0.6s; }
        .stat-card:nth-child(3) .stat-icon { animation-delay: 0.7s; }
        .stat-card:nth-child(4) .stat-icon { animation-delay: 0.8s; }
        .stat-card:nth-child(5) .stat-icon { animation-delay: 0.9s; }

        .stat-icon svg { width:20px; height:20px; color: var(--brand-red); }

        .stat-number { font-size:22px; font-weight:800; color:#0b1220; }
        .stat-label { font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing: .7px; }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(2,6,23,0.08);
          border-color: rgba(2,6,23,0.09);
        }

        /* Specific color variants (subtle) */
        .stat-card.open::before { background: linear-gradient(180deg, rgba(255,193,7,0.15), rgba(255,193,7,0.06)); }
        .stat-card.progress::before { background: linear-gradient(180deg, rgba(14,165,164,0.12), rgba(14,165,164,0.05)); }
        .stat-card.resolved::before { background: linear-gradient(180deg, rgba(5,150,105,0.12), rgba(5,150,105,0.04)); }
        
        /* URGENT CARD - ENHANCED WITH RED */
        .stat-card.urgent {
          background: linear-gradient(180deg, rgba(220,38,38,0.06) 0%, #fff9f9 100%);
          border: 1.2px solid rgba(220,38,38,0.18);
          box-shadow: 0 8px 24px rgba(220,38,38,0.09);
        }

        .stat-card.urgent::before { 
          background: linear-gradient(180deg, rgba(220,38,38,0.22), rgba(220,38,38,0.08)); 
        }

        .stat-card.urgent:hover {
          border-color: rgba(220,38,38,0.28);
          box-shadow: 0 20px 48px rgba(220,38,38,0.12);
        }

        .stat-card.urgent .stat-icon {
          background: rgba(220,38,38,0.1);
          border-color: rgba(220,38,38,0.15);
        }

        .stat-card.urgent .stat-icon svg {
          color: #dc2626;
          font-weight: 700;
        }

        .stat-card.urgent .stat-number {
          color: #991b1b;
        }

        .stat-card.urgent .stat-label {
          color: #7f1d1d;
          font-weight: 800;
        }

        /* Resolution card */
        .resolution-card {
          margin-top:18px;
          border-radius:12px;
          padding:16px;
          display:flex;
          gap:16px;
          align-items:center;
          justify-content:space-between;
          border: 1px solid rgba(2,6,23,0.04);
          background: linear-gradient(180deg,#fff,#fcfcfc);
          box-shadow: 0 14px 40px rgba(2,6,23,0.03);
          animation: fadeInUp 0.8s ease-out 0.9s both;
        }

        .resolution-left { flex:1; min-width:0; }
        .resolution-title { font-size:12px; font-weight:800; color:#111827; text-transform:uppercase; letter-spacing:.8px; margin-bottom:6px; }
        .resolution-stat { font-size:30px; font-weight:800; color:var(--brand-red); margin-bottom:6px; }
        .resolution-desc { color:var(--muted); font-size:13px; margin-bottom:10px; }

        .progress-bar {
          height: 8px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--brand-red), #ff6b6b);
          width: 0%;
          transition: width 900ms cubic-bezier(.2,.9,.2,1);
        }

        /* Circular progress element */
        .progress-circle {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background: conic-gradient(var(--brand-red) 0deg, #e6eef6 0deg);
          position: relative;
          box-shadow: 0 8px 20px rgba(2,6,23,0.04);
          flex-shrink: 0;
          animation: scaleIn 0.7s cubic-bezier(.2,.9,.2,1) 0.95s both;
        }

        .progress-circle .inner {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight: 700;
          color: #0b1220;
          box-shadow: 0 2px 8px rgba(2,6,23,0.04);
        }

        /* Complaint list container tweak */
        .complaint-section {
          margin-top: 18px;
          animation: fadeInUp 0.8s ease-out 1s both;
        }

        @media (max-width: 768px) {
          .header-title-row {
            flex-direction: column;
            gap: 20px;
          }

          .container-custom {
            padding: 16px 20px;
          }

          .page-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white">
        <div className="container-custom">
          {/* Header Section */}
          <div className="header-section pb-8">
            <div className="header-hero">
              {/* Back button */}
              <div className="flex items-start gap-3 mb-6">
                <Link to="/dashboard/tenant">
                  <button className="back-btn" aria-label="Back to dashboard">
                    <ArrowLeft />
                    <span>Back</span>
                  </button>
                </Link>
              </div>

              {/* Title + Button */}
              <div className="header-title-row">
                <div className="header-left">
                  <h1 className="page-title mb-3">
                    Report issues,<br />
                    <span className="title-accent">get resolutions</span>
                  </h1>

                  <p className="header-subtitle">
                    Submit maintenance requests and complaints. Track resolution
                    status in real-time and communicate with property management.
                  </p>
                </div>

                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#DC2626] hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg new-complaint-btn h-fit whitespace-nowrap"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Complaint
                </Button>
              </div>

              <div className="divider-line" />
            </div>
          </div>

          {/* Stats Grid */}
          <section className="py-6">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon" aria-hidden><BarChart3 /></div>
                  <div>
                    <div className="stat-number">{stats.total}</div>
                    <div className="stat-label">Total</div>
                  </div>
                </div>
              </div>

              <div className="stat-card open">
                <div className="stat-top">
                  <div className="stat-icon" aria-hidden><AlertCircle /></div>
                  <div>
                    <div className="stat-number">{stats.open}</div>
                    <div className="stat-label">Open</div>
                  </div>
                </div>
              </div>

              <div className="stat-card progress">
                <div className="stat-top">
                  <div className="stat-icon" aria-hidden><Clock /></div>
                  <div>
                    <div className="stat-number">{stats.inProgress}</div>
                    <div className="stat-label">In Progress</div>
                  </div>
                </div>
              </div>

              <div className="stat-card resolved">
                <div className="stat-top">
                  <div className="stat-icon" aria-hidden><CheckCircle /></div>
                  <div>
                    <div className="stat-number">{stats.resolved}</div>
                    <div className="stat-label">Resolved</div>
                  </div>
                </div>
              </div>

              <div className="stat-card urgent">
                <div className="stat-top">
                  <div className="stat-icon" aria-hidden><TrendingUp /></div>
                  <div>
                    <div className="stat-number">{stats.urgent}</div>
                    <div className="stat-label">Urgent</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution Rate */}
            {stats.total > 0 && (
              <div className="resolution-card">
                <div className="resolution-left">
                  <div className="resolution-title">You've resolved</div>
                  <div className="resolution-stat">{resolutionRate}%</div>
                  <p className="resolution-desc">{stats.resolved} out of {stats.total} complaints</p>

                  <div className="progress-bar" aria-hidden>
                    <div
                      className="progress-fill"
                      style={{ width: `${resolutionRate}%` }}
                    />
                  </div>
                </div>

                <div
                  className="progress-circle"
                  aria-hidden
                  style={{
                    background: `conic-gradient(var(--brand-red) 0deg ${resolutionRate * 3.6}deg, #eef2f7 ${resolutionRate * 3.6}deg 360deg)`
                  }}
                >
                  <div className="inner">{resolutionRate}%</div>
                </div>
              </div>
            )}
          </section>

          {/* Add Complaint Modal */}
          <AddComplaintModal
            open={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
          />

          {/* Complaints List Section */}
          <div className="complaint-section pb-8">
            <ComplaintList
              complaints={tenantComplaints}
              setComplaints={setComplaints}
              onSelect={(complaint) => {
                setSelectedComplaint(complaint);
                setIsDetailModalOpen(true);
              }}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TenantComplaints;