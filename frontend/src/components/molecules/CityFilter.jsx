import React, { useState } from 'react';
import { MapPin, X, Navigation } from 'lucide-react';
import { Badge } from '../atoms';

const POPULAR_CITIES = ['All Cities', 'Miami', 'Los Angeles', 'New York', 'Dallas', 'Phoenix', 'Chicago'];

export const CityFilter = ({
  selectedCity = '',
  onSelectCity,
  detectedCity = '',
  onUseDetectedCity,
  className = '',
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectCity(customInput.trim());
      setCustomInput('');
      setShowCustom(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Geolocation shortcut badge if detected */}
      {detectedCity && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-50/70 border border-brand-100 text-xs text-brand-900">
          <Navigation className="w-4 h-4 text-brand-600 flex-shrink-0 animate-pulse" />
          <span>
            Current location detected: <strong>{detectedCity}</strong>
          </span>
          {selectedCity?.toLowerCase() !== detectedCity.toLowerCase() ? (
            <button
              type="button"
              onClick={() => onUseDetectedCity(detectedCity)}
              className="ml-auto font-semibold text-brand-600 hover:text-brand-800 underline transition-colors"
            >
              Filter by {detectedCity}
            </button>
          ) : (
            <Badge variant="brand" size="xs" className="ml-auto">Active</Badge>
          )}
        </div>
      )}

      {/* City Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-surface-400 mr-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> City:
        </span>

        {POPULAR_CITIES.map((c) => {
          const isAll = c === 'All Cities';
          const isSelected = isAll ? !selectedCity : selectedCity?.toLowerCase() === c.toLowerCase();

          return (
            <button
              key={c}
              type="button"
              onClick={() => onSelectCity(isAll ? '' : c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-soft font-semibold'
                  : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50 hover:border-surface-300'
              }`}
            >
              {c}
            </button>
          );
        })}

        {/* Selected custom city if not in popular list */}
        {selectedCity && !POPULAR_CITIES.some((c) => c.toLowerCase() === selectedCity.toLowerCase()) && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-600 text-white shadow-soft">
            <span>{selectedCity}</span>
            <button
              type="button"
              onClick={() => onSelectCity('')}
              className="p-0.5 hover:bg-white/20 rounded-full"
              aria-label="Remove custom city filter"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Custom City Input Toggle */}
        {showCustom ? (
          <form onSubmit={handleCustomSubmit} className="inline-flex items-center gap-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter city..."
              className="px-2.5 py-1 text-xs rounded-full border border-surface-300 bg-white text-surface-900 focus:outline-none focus:ring-1 focus:ring-brand-500 w-28"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs bg-brand-600 text-white rounded-full font-medium"
            >
              Set
            </button>
            <button
              type="button"
              onClick={() => setShowCustom(false)}
              className="p-1 text-surface-400 hover:text-surface-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowCustom(true)}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium px-2 py-1 underline-offset-2 hover:underline"
          >
            + Other City
          </button>
        )}

        {/* Active Clear Filter Button */}
        {selectedCity && (
          <button
            type="button"
            onClick={() => onSelectCity('')}
            className="ml-auto inline-flex items-center gap-1 text-xs text-surface-500 hover:text-accent-rose font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear Filter
          </button>
        )}
      </div>
    </div>
  );
};

export default CityFilter;
