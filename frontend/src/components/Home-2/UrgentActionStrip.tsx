import React, { useCallback, useEffect, useRef, useState } from "react";

export type Priority = "urgent" | "high" | "normal";

export type UrgentItem = {
  id: string;
  property: string;
  tenant: string;
  unit?: string;
  amount?: number;
  daysOverdue?: number;
  note?: string;
  priority?: Priority;
  createdAt?: string;
  phone?: string;
  email?: string;
};

type Props = {
  items?: UrgentItem[];
  currency?: string;
  onAction?: (action: string, item: UrgentItem) => void;
  className?: string;
};

const BRAND = "#DC2626";

export default function UrgentActionStrip({
  items = SAMPLE_URGENT_ITEMS,
  currency = "₹",
  onAction = (a, i) => console.log("action", a, i),
  className = "",
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigateToIndex = useCallback((newIndex: number) => {
    if (newIndex === currentIndex || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  }, [currentIndex, isAnimating]);

  const nextCard = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    navigateToIndex(nextIndex);
  };

  const prevCard = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    navigateToIndex(prevIndex);
  };

  return (
    <section className={`w-full ${className}`} role="region" aria-label="Action Queue">
      <style>
        {`
          @media (max-width: 768px) {
            .urgent-cards-container {
              height: 360px !important;
              padding-top: 140px !important;
            }
            .urgent-card {
              width: 280px !important;
            }
            .urgent-header {
              text-align: center !important;
            }
            .urgent-title {
              font-size: 24px !important;
            }
            .urgent-subtitle {
              font-size: 14px !important;
            }
          }
          @media (max-width: 480px) {
            .urgent-cards-container {
              height: 320px !important;
              padding-top: 120px !important;
            }
            .urgent-card {
              width: 260px !important;
            }
            .urgent-title {
              font-size: 20px !important;
            }
          }
        `}
      </style>
      <div className="urgent-header flex items-center justify-between mb-2">
        <div>
          <h3 className="urgent-title text-2xl font-bold text-gray-900">Pending Actions</h3>
          <p className="urgent-subtitle text-base text-gray-500 mt-1">What needs your attention now</p>
        </div>
        <div className="text-sm text-gray-400">
          {currentIndex + 1} of {items.length}
        </div>
      </div>

      <div className="urgent-cards-container relative h-[520px] flex items-start justify-center overflow-hidden" style={{paddingTop: '216px'}}>
        <div className="flex items-center justify-center w-full relative">
          {items.map((item, index) => {
            const offset = index - currentIndex;
            const isActive = index === currentIndex;
            const isVisible = Math.abs(offset) <= 1;
            
            if (!isVisible) return null;

            return (
              <ActionCard
                key={item.id}
                item={item}
                currency={currency}
                onAction={onAction}
                isActive={isActive}
                offset={offset}
                onNext={nextCard}
                onPrev={prevCard}
                canGoNext={currentIndex < items.length - 1}
                canGoPrev={currentIndex > 0}
              />
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-gray-900 scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to item ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActionCard({
  item,
  currency,
  onAction,
  isActive,
  offset,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev
}: {
  item: UrgentItem;
  currency: string;
  onAction: (action: string, item: UrgentItem) => void;
  isActive: boolean;
  offset: number;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}) {
  const urgencyColors = {
    urgent: '#DC2626',
    high: '#F59E0B',
    normal: '#E5E7EB'
  };

  const timeAgo = item.createdAt ? getTimeAgo(item.createdAt) : '2d ago';
  
  const scale = isActive ? 1.0 : 0.91;
  const opacity = isActive ? 1 : 0.6;
  const zIndex = isActive ? 20 : 10;
  const translateX = offset * 280;
  const shadow = isActive ? 'shadow-2xl' : 'shadow-lg';

  return (
    <div
      className={`urgent-card absolute w-80 bg-white rounded-2xl border-0 cursor-pointer transition-all duration-500 ease-out ${shadow}`}
      style={{
        transform: `translateX(${translateX}px) scale(${scale})`,
        opacity,
        zIndex,
        background: 'linear-gradient(145deg, #ffffff 0%, #fef2f2 50%, #fee2e2 100%)',
        boxShadow: isActive 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)'
      }}
      onClick={() => onAction('open-detail', item)}
    >
      <div className="p-4 md:p-8">
        {/* Navigation buttons - only show on active card */}
        {isActive && (
          <>
            {canGoPrev && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-0 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 z-30 hover:scale-110"
                style={{ boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.1)' }}
              >
                <i className="fas fa-chevron-left text-gray-700 text-xs"></i>
              </button>
            )}
            {canGoNext && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-0 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 z-30 hover:scale-110"
                style={{ boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.1)' }}
              >
                <i className="fas fa-chevron-right text-gray-700 text-xs"></i>
              </button>
            )}
          </>
        )}

        {/* Header with better spacing */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 leading-tight mb-1">
              {item.property}
            </h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600 font-medium">Active Property</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
              {timeAgo}
            </span>
          </div>
        </div>

        {/* Tenant info with enhanced styling */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {item.tenant.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-base font-bold text-gray-900">{item.tenant}</div>
            {item.unit && <div className="text-sm text-gray-600 font-medium mt-0.5">{item.unit}</div>}
          </div>
        </div>

        {/* Amount with better visual hierarchy */}
        <div className="mb-6">
          <div className="text-3xl font-black text-gray-900 mb-1">
            {currency}{item.amount?.toLocaleString()}
          </div>
          {item.daysOverdue && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-base text-red-600 font-bold">
                {item.daysOverdue} days overdue
              </span>
            </div>
          )}
        </div>

        {/* Actions with improved styling - only fully interactive on active card */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction('send-reminder', item);
            }}
            disabled={!isActive}
            className={`flex-1 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-200 ${
              isActive 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Send Reminder
          </button>
          <a
            href={isActive ? `tel:${item.phone || '+919876543210'}` : '#'}
            onClick={(e) => {
              e.stopPropagation();
              if (!isActive) e.preventDefault();
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-gray-200 flex items-center justify-center ${
              isActive 
                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md' 
                : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <i className="fas fa-phone mr-1.5 text-xs"></i>
            Call
          </a>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1d ago';
  return `${diffDays}d ago`;
}

const SAMPLE_URGENT_ITEMS: UrgentItem[] = [
  {
    id: "u1",
    property: "Sunset Villa",
    tenant: "Asha Patel",
    unit: "Apt 2B",
    amount: 120000,
    daysOverdue: 12,
    note: "Payment pending despite reminder. Tenant responded and promised to pay by end of week.",
    priority: "urgent",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    phone: "+91 98765 43210",
    email: "asha@example.com",
  },
  {
    id: "u2",
    property: "Maple Apartments",
    tenant: "Ravi Kumar",
    unit: "Apt 4A",
    amount: 80000,
    daysOverdue: 9,
    note: "Tenant reported maintenance issue with AC not working.",
    priority: "high",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    phone: "+91 98123 45678",
    email: "ravi@example.com",
  },
  {
    id: "u3",
    property: "Orchard House",
    tenant: "Lina Gomez",
    unit: "Apt 1",
    amount: 84000,
    daysOverdue: 3,
    note: "First overdue. Send a friendly reminder.",
    priority: "normal",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    phone: "+91 97000 00111",
    email: "lina@example.com",
  },
];