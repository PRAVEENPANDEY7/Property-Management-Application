import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { ToastContainer } from '../molecules';
import { BrandLogo } from '../atoms';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-surface-50 flex selection:bg-brand-500 selection:text-white">
      {/* Left Showcase Hero Panel (Hidden on mobile, shown on lg+) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white flex-col justify-between p-12 xl:p-16 overflow-hidden border-r border-slate-800">
        {/* Background Atmosphere Image with Luxury Dark Tint */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
          style={{ backgroundImage: "url('/housio-hero-luxury.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 pointer-events-none" />

        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-gold-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />

        {/* Top Brand Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <BrandLogo size="md" theme="dark" showTagline={false} />
        </div>

        {/* Middle Hero Statement - Minimal Luxury */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Premier Residences
          </div>

          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.15]">
            Curated spaces for <br />
            <span className="text-gold-400">extraordinary living.</span>
          </h2>

          <p className="text-sm xl:text-base text-slate-300 leading-relaxed font-normal max-w-md">
            Exclusive residences, private estates, and luxury villas curated with uncompromising privacy and verification.
          </p>
        </div>

        {/* Bottom Feature Badges - Luxury Trust Signals */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 text-xs">
          <div>
            <div className="text-xl font-black text-white tracking-tight">$180M+</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Portfolio Value</div>
          </div>
          <div>
            <div className="text-xl font-black text-emerald-400 tracking-tight">100%</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Vetted Properties</div>
          </div>
          <div>
            <div className="text-xl font-black text-gold-400 tracking-tight">256-Bit</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Private & Encrypted</div>
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
          <div className="lg:hidden">
            <BrandLogo size="sm" showTagline={false} />
          </div>
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
          <span>Housio &bull; End-to-end encrypted & verified privacy</span>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
