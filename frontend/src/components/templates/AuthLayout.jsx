import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { ToastContainer } from '../molecules';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-brand-500 selection:text-white">
      {/* Return to Properties */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-xs font-semibold text-surface-500 hover:text-brand-600 transition-colors bg-white px-3 py-1.5 rounded-full border border-surface-200 shadow-soft"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/properties" className="inline-flex items-center gap-2 group mb-6">
          <div className="h-11 w-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-soft group-hover:bg-brand-700 transition-colors">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-surface-900">
            Haven<span className="text-brand-600">Estate</span>
          </span>
        </Link>

        {title && (
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-surface-900">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-2 text-sm text-surface-600 max-w-sm mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-soft-xl rounded-3xl border border-surface-200">
          {children}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-surface-400">
        Protected with BCrypt (Cost 12) & Stateless JWT Authentication
      </div>

      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
