import { MapPin, Bed, Bath, Square, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  monthly_rent: number;
  type: 'buy' | 'rent' | 'lease';
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  isNew?: boolean;
}

const PropertyCard = ({
  title,
  location,
  monthly_rent,
  type,
  bedrooms,
  bathrooms,
  area,
  image,
  isNew,
}: PropertyCardProps) => {
  const typeLabels = {
    buy: { label: 'For Sale', color: 'bg-success text-primary-foreground' },
    rent: { label: 'For Rent', color: 'bg-secondary text-secondary-foreground' },
    lease: { label: 'For Lease', color: 'bg-warning text-foreground' },
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
    return type === 'buy' ? formatted : `${formatted}/mo`;
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={typeLabels[type].color}>
            {typeLabels[type].label}
          </Badge>
          {isNew && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              New
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-1">
          {title}
        </h3>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{area} sqft</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4 text-secondary" />
            <span className="text-md font-bold text-foreground">
              {formatPrice(monthly_rent, type)}
            </span>
          </div>
          <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
