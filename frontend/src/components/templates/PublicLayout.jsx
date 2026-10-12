import React from 'react';
import { Navbar } from '../organisms';
import { ToastContainer } from '../molecules';
import { Building2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-surface-900 selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-surface-200 bg-white text-surface-600 text-sm py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg text-surface-900 tracking-tight">
                  Haven<span className="text-brand-600">Estate</span>
                </span>
              </div>
              <p className="text-xs text-surface-500 leading-relaxed">
                Premium property management and curated real estate marketplace. Verified architectural listings with modern security and transparent records.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-surface-900 mb-3">Marketplace</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/properties" className="hover:text-brand-600">Featured Properties</Link></li>
                <li><Link to="/properties?city=Miami" className="hover:text-brand-600">Miami Estates</Link></li>
                <li><Link to="/properties?city=Los%20Angeles" className="hover:text-brand-600">Los Angeles Mansions</Link></li>
                <li><Link to="/properties?city=New%20York" className="hover:text-brand-600">New York Penthouses</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-surface-900 mb-3">Architecture</h4>
              <ul className="space-y-2 text-xs text-surface-500">
                <li>Spring Boot 3 REST Services</li>
                <li>Spring Security 6 Stateless JWT</li>
                <li>PostgreSQL 18 & Flyway Migrations</li>
                <li>Atomic Design React Architecture</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-surface-900 mb-3">Security & Storage</h4>
              <p className="text-xs text-surface-500 leading-relaxed">
                Images are stored outside the database with strict path traversal validation and magic-byte header inspection.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-surface-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-400">
            <div>
              HavenEstate &copy; 2026. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for Enterprise Scalability
            </div>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default PublicLayout;
