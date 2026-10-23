import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Image as ImageIcon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { PropertyPrice } from '../molecules';
import { Badge } from '../atoms';
import { getImageUrl, truncateText } from '../../utils';

export const PropertyCard = ({ property }) => {
  if (!property) return null;

  // Resolve thumbnail
  const primaryImg =
    property.primaryImagePath ||
    (property.images && property.images.length > 0 ? property.images[0].filePath : null);
  const imageUrl = getImageUrl(primaryImg);
  const totalImages = property.images ? property.images.length : (property.imageCount || 0);

  return (
    <div className="group rounded-3xl bg-white border border-surface-200/80 overflow-hidden shadow-soft hover:shadow-soft-xl hover:border-brand-200 transition-all duration-300 flex flex-col">
      {/* Property Image Container with Luxury Aspect Ratio */}
      <Link
        to={`/properties/${property.id}`}
        className="relative aspect-[16/10] overflow-hidden bg-surface-100 block"
      >
        <img
          src={imageUrl}
          alt={property.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges Bar */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <Badge
            variant="neutral"
            size="sm"
            className="!bg-white/90 !text-surface-900 !border-white/40 backdrop-blur-md shadow-soft font-bold text-[11px]"
          >
            <MapPin className="w-3 h-3 mr-1 text-brand-600" />
            {property.city}
          </Badge>

          {/* Photo Count Pill */}
          {totalImages > 0 && (
            <div className="px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-sm border border-white/20">
              <ImageIcon className="w-3 h-3 text-white/90" />
              <span>{totalImages}</span>
            </div>
          )}
        </div>

        {/* Floating Price Pill on Image */}
        <div className="absolute bottom-3 left-3">
          <div className="px-3 py-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-sm sm:text-base border border-white/10 shadow-soft">
            <PropertyPrice price={property.price} size="sm" className="!text-white" />
          </div>
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-extrabold text-base sm:text-lg text-surface-900 tracking-tight group-hover:text-brand-600 transition-colors line-clamp-1">
            <Link to={`/properties/${property.id}`}>{property.name}</Link>
          </h3>

          {/* Location */}
          <p className="text-xs text-surface-500 flex items-center gap-1.5 line-clamp-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
            <span>{property.location}, {property.city}</span>
          </p>

          {/* Description Excerpt */}
          <p className="text-xs text-surface-600 line-clamp-2 leading-relaxed pt-0.5">
            {truncateText(property.description, 110)}
          </p>
        </div>

        {/* Footer Link & Verification */}
        <div className="pt-3 border-t border-surface-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified Estate</span>
          </div>

          <Link
            to={`/properties/${property.id}`}
            className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group/btn"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
