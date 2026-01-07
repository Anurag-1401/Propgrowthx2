import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BarChart3, Eye, MessageSquare, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar }
 from 'recharts';
 import { PropertyData } from '@/components/dashboard/EditPropertyModal';
import { supabase } from '../../lib/supabase';


interface PropertyAnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: PropertyData | null;
}

const PropertyAnalyticsModal = ({ open, onOpenChange, property }: PropertyAnalyticsModalProps) => {
  const [viewsData, setViewsData] = useState<{ date: string; views: number }[]>([]);
  const [inquiriesData, setInquiriesData] = useState<{ week: string; inquiries: number }[]>([]);
  const [stats, setStats] = useState([]);

  // Fetch analytics from Supabase
  const fetchAnalytics = async () => {
    if (!property) return;

    // Increment property views
    await supabase
      .from('properties')
      .update({ views: (property.views || 0) + 1 })
      .eq('id', property.id);

    // Fetch latest property data
    const { data: propData, error } = await supabase
      .from('properties')
      .select('views, inquiries, price')
      .eq('id', property.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    // Example: generate last 7 days views (replace with actual daily analytics table if exists)
    const last7Days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const viewsArray = last7Days.map((day, i) => ({
      date: day,
      views: Math.floor(Math.random() * 100) + 10, // random for demo
    }));

    // Example: generate last 4 weeks inquiries
    const last4Weeks = ['Week 1','Week 2','Week 3','Week 4'];
    const inquiriesArray = last4Weeks.map((week) => ({
      week,
      inquiries: Math.floor(Math.random() * 10),
    }));

    setViewsData(viewsArray);
    setInquiriesData(inquiriesArray);

    // Update stats
    setStats([
      { 
        label: 'Total Views', 
        value: propData.views || 0, 
        icon: Eye, 
        change: '+18%',
        changePositive: true 
      },
      { 
        label: 'Total Inquiries', 
        value: propData.inquiries || 0, 
        icon: MessageSquare, 
        change: '+24%',
        changePositive: true 
      },
      { 
        label: 'Avg. Time on Page', 
        value: '2:34', 
        icon: Calendar, 
        change: '+5%',
        changePositive: true 
      },
      { 
        label: 'Conversion Rate', 
        value: '3.5%', 
        icon: TrendingUp, 
        change: '-2%',
        changePositive: false 
      },
    ]);
  };

  // Fetch analytics when modal opens
  useEffect(() => {
    if (open && property) {
      fetchAnalytics();
    }
  }, [open, property]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="w-5 h-5 text-secondary" />
            Property Analytics
          </DialogTitle>
          {property && (
            <p className="text-muted-foreground text-sm mt-1">
              {property.property_name} • {property.city}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className={`text-sm ${stat.changePositive ? 'text-success' : 'text-destructive'}`}>
                  {stat.change} vs last month
                </div>
              </div>
            ))}
          </div>

          {/* Views Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Daily Views (Last 7 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    fill="url(#colorViews)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inquiries Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Weekly Inquiries (Last Month)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inquiriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="inquiries" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Price Insights */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-secondary" />
              Price Insights
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Your Price</div>
                <div className="text-xl font-bold text-foreground">
                  ${property?.price?.toLocaleString() || '850,000'}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Market Average</div>
                <div className="text-xl font-bold text-foreground">$892,000</div>
                <div className="text-sm text-success">4.7% below market</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">ML Predicted Value</div>
                <div className="text-xl font-bold text-foreground">$875,000</div>
                <div className="text-sm text-muted-foreground">Based on 50+ factors</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyAnalyticsModal;
