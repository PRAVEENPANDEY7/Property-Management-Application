import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { ToastContainer } from '../molecules';
import { BrandLogo } from '../atoms';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-surface-50 flex selection:bg-brand-500 selection:text-white">
      {/* Left Showcase Hero Panel (Pure clean dark luxury, no background images) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white flex-col justify-between p-8 xl:p-12 overflow-hidden border-r border-slate-800/80">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-600/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-950 to-slate-950 pointer-events-none" />

        {/* Top Spacer for perfect vertical alignment */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-gold-300 tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-gold-400" /> Premier Residences
          </div>
        </div>

        {/* Middle Hero Statement - Small Symmetrical Logo + Typography */}
        <div className="relative z-10 max-w-md space-y-4 my-auto">
          {/* Small, refined Housio logo with crisp white backing for dark mode */}
          <div>
            <div className="inline-flex items-center bg-white px-3.5 py-1.5 rounded-xl shadow-soft border border-white/20 transition-transform duration-200 hover:scale-[1.02]">
              <img
                src="/housio-logo.png"
                alt="Housio"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-[1.18]">
              Curated spaces for <br />
              <span className="text-gold-400">extraordinary living.</span>
            </h2>

            <p className="text-xs xl:text-sm text-slate-300 leading-relaxed font-normal">
              Exclusive residences, private estates, and luxury villas curated with uncompromising privacy and verification.
            </p>
          </div>
        </div>

        {/* Bottom Feature Badges - Luxury Trust Signals */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-5 border-t border-slate-800/80 text-xs">
          <div>
            <div className="text-lg xl:text-xl font-black text-white tracking-tight">$180M+</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Portfolio Value</div>
          </div>
          <div>
            <div className="text-lg xl:text-xl font-black text-emerald-400 tracking-tight">100%</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Vetted Properties</div>
          </div>
          <div>
            <div className="text-lg xl:text-xl font-black text-gold-400 tracking-tight">256-Bit</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Private & Encrypted</div>
          </div>
        </div>
      </div>

      {/* Right Form Panel - Compact & Zero-Scroll */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-4 sm:p-6 lg:p-6 xl:p-8 relative h-full overflow-y-auto lg:overflow-hidden">
        {/* Return to Public Site Navigation */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-600 hover:text-brand-600 transition-colors bg-white px-3 py-1.5 rounded-xl border border-surface-200 shadow-soft"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties
          </Link>

          {/* Mobile Brand Logo */}
          <div className="lg:hidden">
            <BrandLogo size="sm" showTagline={false} />
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-1">
          <div className="mb-3 sm:mb-4 space-y-1 text-center sm:text-left">
            {title && (
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-surface-900">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-surface-500 leading-normal">
                {subtitle}
              </p>
            )}
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-surface-200 shadow-soft-lg">
            {children}
          </div>
        </div>

        {/* Footer Security Pill */}
        <div className="mt-3 text-center text-[11px] text-surface-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Housio &bull; End-to-end encrypted & verified privacy</span>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
