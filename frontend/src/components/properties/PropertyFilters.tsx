import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PropertyFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
}

const PropertyFilters = ({ onFilterChange }: PropertyFiltersProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by location, property name..."
            className="pl-10"
          />
        </div>

        {/* Property Type */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {/* <SelectItem value="buy">For Sale</SelectItem> */}
            <SelectItem value="rent">For Rent</SelectItem>
            <SelectItem value="lease">For Lease</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Price</SelectItem>
            <SelectItem value="0-5000">Under Rs 5K</SelectItem>
            <SelectItem value="5000-10000">Rs 5K - Rs 10K</SelectItem>
            <SelectItem value="10000-15000">Rs 10K - Rs 15K</SelectItem>
            <SelectItem value="15000-20000">Rs 15K - Rs 20K</SelectItem>
            <SelectItem value="20000+">Rs 20k+</SelectItem>
          </SelectContent>
        </Select>

        {/* Bedrooms */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="1">1+ Beds</SelectItem>
            <SelectItem value="2">2+ Beds</SelectItem>
            <SelectItem value="3">3+ Beds</SelectItem>
            <SelectItem value="4">4+ Beds</SelectItem>
            <SelectItem value="5">5+ Beds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
        {/* Area */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Area (sqft)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Size</SelectItem>
            <SelectItem value="0-1000">Under 1,000 sqft</SelectItem>
            <SelectItem value="1000-2000">1,000 - 2,000 sqft</SelectItem>
            <SelectItem value="2000-3000">2,000 - 3,000 sqft</SelectItem>
            <SelectItem value="3000+">3,000+ sqft</SelectItem>
          </SelectContent>
        </Select>

        {/* Location */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Panvel, Maharashtra">Panvel, Maharashtra</SelectItem>
            <SelectItem value="Thane, Maharashtra">Thane, Maharashtra</SelectItem>
            <SelectItem value="Dadar, Maharashtra">Dadar, Maharashtra</SelectItem>
            <SelectItem value="Kalyan, Maharashtra">Kalyan, Maharashtra</SelectItem>
            <SelectItem value="Pune, Maharashtra">Pune, Maharashtra</SelectItem>
          </SelectContent>
        </Select>

        <div className="lg:col-span-3 flex justify-end gap-3">
          <Button variant="outline">Reset Filters</Button>
          <Button className="bg-secondary hover:bg-secondary/90">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
