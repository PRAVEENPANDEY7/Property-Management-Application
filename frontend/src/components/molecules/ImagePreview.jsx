import React from 'react';
import { X, Star } from 'lucide-react';
import { Badge } from '../atoms';

export const ImagePreview = ({
  src,
  alt = 'Property preview',
  isPrimary = false,
  isExisting = false,
  onSetPrimary,
  onRemove,
  className = '',
}) => {
  return (
    <div
      className={`group relative rounded-xl overflow-hidden border border-surface-200 bg-surface-100 aspect-video shadow-soft transition-all ${
        isPrimary ? 'ring-2 ring-brand-500 ring-offset-2' : ''
      } ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Badges Overlay */}
      <div className="absolute top-2 left-2 flex items-center gap-1">
        {isPrimary && (
          <Badge variant="brand" size="xs" className="!bg-brand-600 !text-white font-bold shadow-sm">
            <Star className="w-3 h-3 mr-1 fill-current" /> Primary
          </Badge>
        )}
        {isExisting && (
          <Badge variant="neutral" size="xs" className="!bg-surface-900/70 !text-white !border-0 backdrop-blur-sm">
            Existing
          </Badge>
        )}
      </div>

      {/* Action Controls Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
        {!isPrimary && onSetPrimary && (
          <button
            type="button"
            onClick={onSetPrimary}
            className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-surface-800 text-xs font-semibold shadow-sm transition-all"
            title="Set as primary thumbnail"
          >
            <Star className="w-4 h-4 text-amber-500 inline mr-1" />
            Set Primary
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white shadow-sm transition-all"
            aria-label="Remove image"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
