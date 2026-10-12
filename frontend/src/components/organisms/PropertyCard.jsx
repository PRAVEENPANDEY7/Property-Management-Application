import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { PropertyPrice } from '../molecules';
import { Badge } from '../atoms';
import { getImageUrl, truncateText } from '../../utils';

export const PropertyCard = ({ property }) => {
  if (!property) return null;

  // Resolve thumbnail
  const primaryImg = property.primaryImagePath || 
    (property.images && property.images.length > 0 ? property.images[0].filePath : null);
  const imageUrl = getImageUrl(primaryImg);
  const totalImages = property.images ? property.images.length : (property.imageCount || 0);

  return (
    <div className="group rounded-2xl bg-white border border-surface-200 overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col">
      {/* Property Image Container */}
      <Link to={`/properties/${property.id}`} className="relative aspect-[16/10] overflow-hidden bg-surface-100 block">
        <img
          src={imageUrl}
          alt={property.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* City Tag Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="neutral" size="sm" className="!bg-white/90 !text-surface-900 !border-white/50 backdrop-blur-md shadow-soft font-semibold">
            <MapPin className="w-3 h-3 mr-1 text-brand-600" />
            {property.city}
          </Badge>
        </div>

        {/* Photo Count Pill */}
        {totalImages > 0 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-slate-900/70 text-white text-[11px] font-medium backdrop-blur-sm flex items-center gap-1 shadow-sm">
            <ImageIcon className="w-3 h-3" />
            {totalImages} {totalImages === 1 ? 'photo' : 'photos'}
          </div>
        )}
      </Link>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Price */}
          <PropertyPrice price={property.price} size="md" />

          {/* Title */}
          <h3 className="font-bold text-base text-surface-900 tracking-tight group-hover:text-brand-600 transition-colors line-clamp-1">
            <Link to={`/properties/${property.id}`}>{property.name}</Link>
          </h3>

          {/* Location */}
          <p className="text-xs text-surface-500 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
            {property.location}, {property.city}
          </p>

          {/* Description Excerpt */}
          <p className="text-xs text-surface-600 line-clamp-2 leading-relaxed pt-1">
            {truncateText(property.description, 110)}
          </p>
        </div>

        {/* Footer Link */}
        <div className="pt-4 mt-3 border-t border-surface-100 flex items-center justify-between text-xs">
          <span className="text-surface-400">HavenEstate Verified</span>
          <Link
            to={`/properties/${property.id}`}
            className="font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
