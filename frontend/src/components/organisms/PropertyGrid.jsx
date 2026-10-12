import React from 'react';
import { Home, AlertCircle, RefreshCw } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { Button } from '../atoms';

export const PropertyGrid = ({
  properties = [],
  loading = false,
  error = null,
  onRetry,
  onClearFilters,
  className = '',
}) => {
  // Loading Skeletons
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white border border-surface-200 overflow-hidden shadow-soft animate-pulse flex flex-col"
          >
            <div className="aspect-[16/10] bg-surface-200" />
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-6 bg-surface-200 rounded-md w-1/3" />
                <div className="h-5 bg-surface-200 rounded-md w-3/4" />
                <div className="h-4 bg-surface-200 rounded-md w-1/2" />
                <div className="h-3 bg-surface-200 rounded-md w-full" />
                <div className="h-3 bg-surface-200 rounded-md w-5/6" />
              </div>
              <div className="pt-4 border-t border-surface-100 flex justify-between items-center">
                <div className="h-4 bg-surface-200 rounded-md w-1/4" />
                <div className="h-4 bg-surface-200 rounded-md w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-4 my-6">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-surface-900">Unable to Load Properties</h3>
          <p className="text-sm text-surface-600 max-w-md mx-auto">{error}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="!border-rose-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  // Empty State
  if (!properties || properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-300 bg-white p-12 text-center space-y-4 my-6">
        <div className="w-14 h-14 rounded-2xl bg-surface-100 text-surface-400 flex items-center justify-center mx-auto">
          <Home className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-surface-900">No Properties Found</h3>
          <p className="text-sm text-surface-500 max-w-sm mx-auto">
            We couldn't find any listings matching your search or city criteria. Try adjusting your filters.
          </p>
        </div>
        {onClearFilters && (
          <Button variant="primary" size="sm" onClick={onClearFilters}>
            Browse All Properties
          </Button>
        )}
      </div>
    );
  }

  // Render Grid
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;
