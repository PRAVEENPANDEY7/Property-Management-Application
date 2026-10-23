import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, ShieldCheck, Sparkles, Star, Award, CheckCircle2 } from 'lucide-react';
import { ToastContainer } from '../molecules';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-surface-50 flex selection:bg-brand-500 selection:text-white">
      {/* Left Showcase Hero Panel (Hidden on mobile, shown on lg+) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        {/* Top Brand Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/properties" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-soft-lg group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Haven<span className="text-brand-400">Estate</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-slate-300 border border-white/10">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Premier Luxury Portal
          </div>
        </div>

        {/* Middle Hero Statement */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Curated Architectural Living
          </div>

          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight">
            Elevating Real Estate with Precision & Elegance.
          </h2>

          <p className="text-sm xl:text-base text-slate-300 leading-relaxed font-normal">
            Gain verified access to private architectural portfolios, direct owner inquiries, and high-yield properties with enterprise-grade data security.
          </p>

          {/* Testimonial Quote Capsule */}
          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-3 shadow-soft-lg">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "HavenEstate delivered a seamless transaction experience for our waterfront villa portfolio. The verification process is unmatched."
            </p>
            <div className="text-[11px] font-bold text-slate-400">
              Marcus Vance &bull; Private Portfolio Investor
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs">
          <div>
            <div className="text-lg font-black text-white">$180M+</div>
            <div className="text-[11px] text-slate-400 font-medium">Portfolio Inventory</div>
          </div>
          <div>
            <div className="text-lg font-black text-emerald-400">100%</div>
            <div className="text-[11px] text-slate-400 font-medium">Verified Listings</div>
          </div>
          <div>
            <div className="text-lg font-black text-brand-400">BCrypt-12</div>
            <div className="text-[11px] text-slate-400 font-medium">Stateless JWT Security</div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16 relative overflow-y-auto">
        {/* Return to Public Site Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold text-surface-600 hover:text-brand-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-surface-200 shadow-soft"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties
          </Link>

          {/* Mobile Brand Logo */}
          <Link to="/properties" className="lg:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-soft">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-surface-900">
              Haven<span className="text-brand-600">Estate</span>
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-4">
          <div className="mb-6 space-y-1.5 text-center sm:text-left">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-surface-900">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-surface-500 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-200 shadow-soft-xl">
            {children}
          </div>
        </div>

        {/* Footer Security Pill */}
        <div className="mt-8 text-center text-xs text-surface-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Stateless JWT & PostgreSQL Enterprise Security</span>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
