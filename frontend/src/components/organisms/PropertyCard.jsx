import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Image as ImageIcon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { PropertyPrice } from '../molecules';
import { Badge, Perspective3DCard } from '../atoms';
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
    <Perspective3DCard maxRotation={6} scale={1.015}>
      <div className="group rounded-3xl bg-white border border-surface-200/80 hover:border-gold-400/60 overflow-hidden shadow-soft hover:shadow-gold-glow transition-all duration-500 flex flex-col h-full relative">
        {/* Top Gold Hairline Highlight on Hover */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />

        {/* Property Image Container with Luxury 16:10 Aspect Ratio */}
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

          {/* Luxury Atmospheric Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/25 opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Top Badges Bar */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
            <Badge
              variant="neutral"
              size="sm"
              className="!bg-white/95 !text-surface-900 !border-white/40 backdrop-blur-md shadow-soft font-bold text-[11px]"
            >
              <MapPin className="w-3 h-3 mr-1 text-brand-600" />
              {property.city}
            </Badge>

            {/* Photo Count Pill */}
            {totalImages > 0 && (
              <div className="px-2.5 py-1 rounded-full bg-slate-950/70 text-gold-300 text-[11px] font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-sm border border-gold-400/25">
                <ImageIcon className="w-3 h-3 text-gold-400" />
                <span>{totalImages} Photos</span>
              </div>
            )}
          </div>

          {/* Floating Price Pill with Gold Backing */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className="px-3.5 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md text-white font-black text-sm sm:text-base border border-gold-400/30 shadow-soft">
              <PropertyPrice price={property.price} size="sm" className="!text-white font-serif" />
            </div>
          </div>
        </Link>

        {/* Card Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="font-extrabold text-base sm:text-lg text-surface-900 tracking-tight group-hover:text-brand-600 transition-colors line-clamp-1 font-serif">
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
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Estate</span>
            </div>

            <Link
              to={`/properties/${property.id}`}
              className="font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 group/btn"
            >
              <span>Explore Estate</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1 text-gold-500" />
            </Link>
          </div>
        </div>
      </div>
    </Perspective3DCard>
  );
};

export default PropertyCard;
