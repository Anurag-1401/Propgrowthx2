import { Search, X, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface PropertyFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
}

const PropertyFilters = ({ onFilterChange }: PropertyFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    price: 'all',
    bedrooms: 'all',
    area: 'all',
    location: 'all',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      type: 'all',
      price: 'all',
      bedrooms: 'all',
      area: 'all',
      location: 'all',
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const isFilterActive = Object.values(filters).some(v => v !== 'all' && v !== '');

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by location, name..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-11 border-gray-200 focus-visible:ring-red-600 focus-visible:ring-offset-0 rounded-xl h-11 bg-gray-50 hover:bg-white transition-colors"
            />
          </div>

          {/* Property Type */}
          <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger className="border-gray-200 focus:ring-red-600 rounded-xl bg-gray-50 hover:bg-white h-11 transition-colors">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="lease">For Lease</SelectItem>
              <SelectItem value="buy">For Sale</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Range */}
          <Select value={filters.price} onValueChange={(value) => handleFilterChange('price', value)}>
            <SelectTrigger className="border-gray-200 focus:ring-red-600 rounded-xl bg-gray-50 hover:bg-white h-11 transition-colors">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200">
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="0-5000">Under ₹5K</SelectItem>
              <SelectItem value="5000-10000">₹5K — ₹10K</SelectItem>
              <SelectItem value="10000-15000">₹10K — ₹15K</SelectItem>
              <SelectItem value="15000-20000">₹15K — ₹20K</SelectItem>
              <SelectItem value="20000+">₹20K+</SelectItem>
            </SelectContent>
          </Select>

          {/* Bedrooms */}
          <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
            <SelectTrigger className="border-gray-200 focus:ring-red-600 rounded-xl bg-gray-50 hover:bg-white h-11 transition-colors">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200">
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="1">1+ Beds</SelectItem>
              <SelectItem value="2">2+ Beds</SelectItem>
              <SelectItem value="3">3+ Beds</SelectItem>
              <SelectItem value="4">4+ Beds</SelectItem>
              <SelectItem value="5">5+ Beds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors font-medium"
          >
            <Sliders className="w-4 h-4" />
            {showAdvanced ? 'Hide' : 'More'} Filters
          </button>

          <div className="flex items-center gap-2">
            {isFilterActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="mr-1 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Area */}
            <Select value={filters.area} onValueChange={(value) => handleFilterChange('area', value)}>
              <SelectTrigger className="border-gray-200 focus:ring-red-600 rounded-xl bg-gray-50 hover:bg-white h-11 transition-colors">
                <SelectValue placeholder="Area (sqft)" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                <SelectItem value="all">Any Size</SelectItem>
                <SelectItem value="0-1000">Under 1,000 sqft</SelectItem>
                <SelectItem value="1000-2000">1,000 — 2,000 sqft</SelectItem>
                <SelectItem value="2000-3000">2,000 — 3,000 sqft</SelectItem>
                <SelectItem value="3000+">3,000+ sqft</SelectItem>
              </SelectContent>
            </Select>

            {/* Location */}
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger className="border-gray-200 focus:ring-red-600 rounded-xl bg-gray-50 hover:bg-white h-11 transition-colors">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="panvel">Panvel, Maharashtra</SelectItem>
                <SelectItem value="thane">Thane, Maharashtra</SelectItem>
                <SelectItem value="dadar">Dadar, Maharashtra</SelectItem>
                <SelectItem value="kalyan">Kalyan, Maharashtra</SelectItem>
                <SelectItem value="pune">Pune, Maharashtra</SelectItem>
                <SelectItem value="mulund">Mulund, Maharashtra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;