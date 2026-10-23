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

      {/* Luxury Hero Header Section */}
      <section className="mb-10 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 lg:p-12 shadow-soft-xl relative overflow-hidden border border-slate-800">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Curated Architectural Estates &bull; 2026 Collection
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Sort by:</span>
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [newSort, newDir] = e.target.value.split('-');
                  setSort(newSort, newDir);
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-xs font-semibold text-white shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
              >
                <option value="createdAt-desc" className="bg-slate-900">Newest Listings</option>
                <option value="price-asc" className="bg-slate-900">Price: Low to High</option>
                <option value="price-desc" className="bg-slate-900">Price: High to Low</option>
                <option value="name-asc" className="bg-slate-900">Title: A to Z</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Find Your Signature Sanctuary.
            </h1>
            <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal">
              Explore verified private villas, waterfront retreats, and high-yield properties in premier metropolitan destinations.
            </p>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span className="font-semibold text-slate-200">100% Verified Estates</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-2.5">
              <Navigation className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold text-slate-200">Geolocated Discovery</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="font-semibold text-slate-200">Direct Agent Connect</span>
            </div>
          </div>

          {/* Search Bar Container */}
          <div className="pt-2">
            <SearchBar
              initialValue={search}
              onSearch={setSearch}
              placeholder="Search by title, city, architectural features, or lifestyle..."
            />
          </div>
        </div>
      </section>

      {/* City Filter Pills */}
      <section className="mb-6">
        <CityFilter
          selectedCity={city}
          onSelectCity={setCity}
          detectedCity={detectedCity}
          onUseDetectedCity={setCity}
        />
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
