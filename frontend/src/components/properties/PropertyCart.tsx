import { MapPin, Bed, Bath, Square, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

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
  id,
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const typeConfig = {
    buy: { label: 'For Sale', color: 'bg-emerald-500 text-white' },
    rent: { label: 'For Rent', color: 'bg-red-600 text-white' },
    lease: { label: 'For Lease', color: 'bg-blue-500 text-white' },
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
    return type === 'buy' ? formatted : `${formatted}/mo`;
  };

  return (
    <div className="group h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {/* Image */}
        <img
          src={image}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className={`${typeConfig[type].color} border-0 px-3 py-1 text-xs font-semibold shadow-md`}>
            {typeConfig[type].label}
          </Badge>
          {isNew && (
            <Badge className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-md">
              New
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all duration-300 ${
            isFavorite
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/95 text-gray-600 hover:bg-white hover:scale-110'
          }`}
        >
          <Heart className={`h-5 w-5 transition-all ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="truncate text-gray-600 font-medium">{location}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Features Grid */}
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4 flex-wrap">
          {bedrooms > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Bed className="w-4 h-4 text-red-600" />
              <span className="font-medium">{bedrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
            <Bath className="w-4 h-4 text-red-600" />
            <span className="font-medium">{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
            <Square className="w-4 h-4 text-red-600" />
            <span className="font-medium">{area}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4 flex-1" />

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Price</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(monthly_rent, type)}
            </p>
          </div>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all group/btn rounded-lg"
          >
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;