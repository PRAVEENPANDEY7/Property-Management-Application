import React, { useState } from 'react';
import { Navigation, X, Sparkles, Building2, SlidersHorizontal } from 'lucide-react';
import { useProperties, useGeolocation, useAuth } from '../../hooks';
import { PublicLayout } from '../../components/templates';
import { SearchBar, CityFilter, Pagination } from '../../components/molecules';
import { PropertyGrid } from '../../components/organisms';
import { Button, Badge } from '../../components/atoms';

export const PropertyListingPage = () => {
  const { detectedCity, isLocating, hasPrompted, requestLocation, dismissPrompt } = useGeolocation();
  const { isAuthenticated } = useAuth();

  const {
    properties,
    paginationMeta,
    page,
    city,
    search,
    sortBy,
    sortDir,
    loading,
    error,
    setCity,
    setSearch,
    setPage,
    setSort,
    retry,
  } = useProperties(detectedCity || '');

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // If user clicks geolocation banner button
  const handleDetectLocation = async () => {
    const resolvedCity = await requestLocation();
    if (resolvedCity) {
      setCity(resolvedCity);
    }
  };

  return (
    <PublicLayout>
      {/* Geolocation Prompt Banner (shown once per session if not prompted yet) */}
      {!hasPrompted && !detectedCity && (
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-700 text-white p-4 sm:p-5 shadow-soft-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">Find properties near you?</h4>
              <p className="text-xs text-white/80">
                Allow location access to automatically highlight properties in your current city.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="px-4 py-2 rounded-xl bg-white text-brand-700 hover:bg-white/90 text-xs font-bold shadow-soft transition-all"
            >
              {isLocating ? 'Detecting Location...' : 'Detect City'}
            </button>
            <button
              type="button"
              onClick={dismissPrompt}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Header & Search Section */}
      <section className="mb-8 space-y-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Curated Architectural Estates
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-surface-900">
              Discover Premier Properties
            </h1>
            <p className="text-sm text-surface-500 max-w-xl">
              Explore verified luxury homes, modern villas, and prime commercial estates.
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-surface-400 font-medium">Sort by:</span>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [newSort, newDir] = e.target.value.split('-');
                setSort(newSort, newDir);
              }}
              className="px-3 py-2 rounded-xl border border-surface-200 bg-white text-xs font-semibold text-surface-700 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="createdAt-desc">Newest Listings</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Title: A to Z</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pt-2">
          <SearchBar
            initialValue={search}
            onSearch={setSearch}
            placeholder="Search by title, keywords, or architectural features..."
          />
        </div>

        {/* City Filter Pills */}
        <div className="pt-2">
          <CityFilter
            selectedCity={city}
            onSelectCity={setCity}
            detectedCity={detectedCity}
            onUseDetectedCity={setCity}
          />
        </div>
      </section>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-surface-200 text-xs text-surface-500 font-medium">
        <div>
          {loading ? (
            <span>Searching inventory...</span>
          ) : (
            <span>
              Showing <strong className="text-surface-900">{paginationMeta.totalElements}</strong>{' '}
              {paginationMeta.totalElements === 1 ? 'property' : 'properties'}
              {city ? (
                <> in <strong className="text-brand-600">{city}</strong></>
              ) : (
                ' across all cities'
              )}
              {search && (
                <> matching "<strong className="text-surface-900">{search}</strong>"</>
              )}
            </span>
          )}
        </div>

        {(city || search) && (
          <button
            type="button"
            onClick={() => {
              setCity('');
              setSearch('');
            }}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Property Cards Grid */}
      <PropertyGrid
        properties={properties}
        loading={loading}
        error={error}
        onRetry={retry}
        onClearFilters={() => {
          setCity('');
          setSearch('');
        }}
      />

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={paginationMeta.totalPages}
          totalElements={paginationMeta.totalElements}
          pageSize={paginationMeta.pageSize}
          onPageChange={setPage}
        />
      </div>
    </PublicLayout>
  );
};

export default PropertyListingPage;
