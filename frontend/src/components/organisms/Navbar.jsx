import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Shield, User, LogOut, Menu, X, Navigation, Compass } from 'lucide-react';
import { useAuth, useGeolocation } from '../../hooks';
import { Button, Badge, BrandLogo } from '../atoms';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { detectedCity, isLocating, requestLocation, clearLocation } = useGeolocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-200 shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Housio Official Brand Logo */}
          <BrandLogo size="md" showTagline={false} linkTo="/" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-xs sm:text-sm font-semibold text-surface-700 hover:text-brand-600 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-gold-500" />
              Explore Estates
            </Link>

            {/* Geolocation Quick Trigger / Badge */}
            {detectedCity ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-100 text-surface-700 text-xs font-medium border border-surface-200">
                <Navigation className="w-3.5 h-3.5 text-brand-600" />
                <span>{detectedCity}</span>
                <button
                  type="button"
                  onClick={clearLocation}
                  className="ml-1 text-surface-400 hover:text-surface-700 text-xs font-bold"
                  title="Clear detected location"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={requestLocation}
                disabled={isLocating}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 hover:bg-brand-100/70 border border-brand-200/60 transition-colors"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Detecting...' : 'Near Me'}
              </button>
            )}
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm" className="!rounded-xl border border-surface-200 hover:border-gold-300">
                      <Shield className="w-4 h-4 mr-1.5 text-gold-600" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}

                {/* User Info Capsule */}
                <div className="flex items-center gap-2 pl-2 border-l border-surface-200">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <div className="font-semibold text-surface-900 leading-tight">
                      {user?.fullName || user?.email?.split('@')[0]}
                    </div>
                    <Badge variant={isAdmin ? 'admin' : 'neutral'} size="xs">
                      {user?.role}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="!text-surface-500 hover:!text-rose-600"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="gold" size="sm" className="!rounded-xl font-bold shadow-soft">
                    Join Housio
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-soft-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-surface-700 hover:text-brand-600"
          >
            Browse Properties
          </Link>

          {detectedCity ? (
            <div className="flex items-center justify-between py-2 text-xs text-surface-600 bg-surface-50 px-3 rounded-xl">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-brand-600" />
                Location: <strong>{detectedCity}</strong>
              </span>
              <button
                type="button"
                onClick={clearLocation}
                className="text-xs text-rose-600 font-semibold"
              >
                Clear
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                requestLocation();
                setMobileMenuOpen(false);
              }}
              disabled={isLocating}
              className="w-full text-left py-2 text-xs font-semibold text-brand-600 flex items-center gap-1.5"
            >
              <Navigation className="w-4 h-4" /> Detect Current City
            </button>
          )}

          <div className="pt-2 border-t border-surface-200">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-surface-900">{user?.fullName}</div>
                    <div className="text-xs text-surface-500">{user?.email}</div>
                  </div>
                  <Badge variant={isAdmin ? 'admin' : 'neutral'} size="xs" className="ml-auto">
                    {user?.role}
                  </Badge>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full p-2.5 rounded-xl bg-gold-50 text-gold-800 border border-gold-200/60 text-xs font-semibold"
                  >
                    <Shield className="w-4 h-4 text-gold-600" /> Admin Dashboard
                  </Link>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full !text-rose-600 hover:!bg-rose-50 border-rose-200"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
