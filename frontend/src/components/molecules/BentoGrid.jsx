import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Sparkles, Compass, CheckCircle2, Award, ArrowUpRight, Lock, Eye, Building2 } from 'lucide-react';
import { SpotlightCard } from '../atoms';

/**
 * BentoGrid component inspired by 21st.dev luxury bento patterns.
 * Highlights the four cornerstone engineering standards of Housio.
 */
export const BentoGrid = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial-spotlight opacity-40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            The Housio Standard
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-surface-900 font-serif">
            Engineered for the <span className="text-gold-gradient">Extraordinary</span>
          </h2>
          <p className="text-sm sm:text-base text-surface-500 max-w-2xl mx-auto leading-relaxed">
            Every estate on Housio passes a rigorous multi-tier physical and cryptographic verification protocol before touching our private exchange.
          </p>
        </div>

        {/* 21st.dev Style Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          
          {/* Card 1 (Span 7 cols): Cryptographic Magic-Byte Architectural Scanner */}
          <SpotlightCard
            spotlightColor="rgba(17, 110, 101, 0.18)"
            borderColor="rgba(17, 110, 101, 0.4)"
            className="lg:col-span-7 p-8 flex flex-col justify-between bg-gradient-to-br from-white via-surface-50/50 to-brand-50/30 shadow-soft-lg group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-teal-glow">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Real-Time Verification Active
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-surface-900 tracking-tight">
                  Magic-Byte Architectural Verification
                </h3>
                <p className="text-xs sm:text-sm text-surface-500 mt-1.5 leading-relaxed max-w-md">
                  Every uploaded photograph undergoes rigorous server-side binary magic-byte inspection and EXIF metadata validation to eradicate fake listings and AI synthetic replicas.
                </p>
              </div>

              {/* Interactive Visual Element: Scanner Mockup */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800 shadow-soft">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-gold-400 font-bold">
                    <Lock className="w-3.5 h-3.5" /> SHA-256 Title Authenticity
                  </span>
                  <span className="text-emerald-400 font-bold">100% VERIFIED</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-400">Magic Bytes: <code className="text-brand-300">FF D8 FF E0 (JPEG-JFIF)</code></span>
                  <span className="text-slate-400">Resolution: <code className="text-gold-300">8K Architectural</code></span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-gradient-to-r from-brand-500 to-gold-400 h-full w-[94%] rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between text-xs font-semibold text-brand-700 border-t border-surface-200/60 mt-6">
              <span>Zero fraudulent listings since inception</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Inspect Protocol <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </SpotlightCard>

          {/* Card 2 (Span 5 cols): Real-Time Capital Appreciation & Market Matrix */}
          <SpotlightCard
            spotlightColor="rgba(197, 155, 82, 0.2)"
            borderColor="rgba(197, 155, 82, 0.5)"
            className="lg:col-span-5 p-8 flex flex-col justify-between bg-gradient-to-br from-white via-surface-50/50 to-gold-50/40 shadow-soft-lg group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gold-500 text-slate-950 flex items-center justify-center shadow-gold-glow">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gold-100 text-gold-900 border border-gold-300">
                  +18.4% APPRECIATION
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-surface-900 tracking-tight">
                  Portfolio Valuation Matrix
                </h3>
                <p className="text-xs sm:text-sm text-surface-500 mt-1.5 leading-relaxed">
                  Real-time market intelligence tracking prime luxury sub-markets, rental yield forecasts, and capital preservation indices.
                </p>
              </div>

              {/* Metric Card Preview */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-brand-950 to-slate-900 text-white space-y-2 border border-brand-800/40">
                <div className="text-[11px] text-gold-300 uppercase font-bold tracking-wider">
                  Top Performing Metropolitan Zone
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-white font-serif">Beverly Hills, CA</div>
                  <div className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +21.6% YoY
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">Average days to private closing: 19 days</p>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between text-xs font-semibold text-gold-700 border-t border-surface-200/60 mt-6">
              <span>Backed by proprietary algorithms</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Analytics <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </SpotlightCard>

          {/* Card 3 (Span 5 cols): White-Glove VIP Concierge */}
          <SpotlightCard
            spotlightColor="rgba(197, 155, 82, 0.2)"
            borderColor="rgba(197, 155, 82, 0.4)"
            className="lg:col-span-5 p-8 flex flex-col justify-between bg-gradient-to-br from-white via-surface-50/50 to-gold-50/30 shadow-soft-lg group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-gold-400 flex items-center justify-center shadow-soft">
                <Award className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-surface-900 tracking-tight">
                  White-Glove Private Concierge
                </h3>
                <p className="text-xs sm:text-sm text-surface-500 mt-1.5 leading-relaxed">
                  Dedicated private residential advisors arrange confidential private showings, helicopter arrivals, and bespoke legal conveyance.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {['Direct agent line with <15 min response', 'Chauffeur and helipad logistics arranged', 'Strict NDA & client privacy guarantee'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-surface-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-surface-200/60 mt-6 flex items-center justify-between text-xs font-semibold text-surface-600">
              <span>Available 24/7/365</span>
              <span className="text-gold-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Meet Concierge <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </SpotlightCard>

          {/* Card 4 (Span 7 cols): Global Metropolitan Presence */}
          <SpotlightCard
            spotlightColor="rgba(17, 110, 101, 0.18)"
            borderColor="rgba(17, 110, 101, 0.4)"
            className="lg:col-span-7 p-8 flex flex-col justify-between bg-gradient-to-br from-white via-surface-50/50 to-brand-50/30 shadow-soft-lg group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center shadow-soft">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-700 font-bold bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                  <Building2 className="w-3.5 h-3.5" /> 12 Premier Metros
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-surface-900 tracking-tight">
                  Prime Architectural Hubs
                </h3>
                <p className="text-xs sm:text-sm text-surface-500 mt-1.5 leading-relaxed max-w-lg">
                  Instant geolocation auto-highlights hand-selected properties in your immediate metropolitan radius with intelligent proximity mapping.
                </p>
              </div>

              {/* City Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { city: 'New York', count: '48 Estates', tier: 'Penthouses' },
                  { city: 'Los Angeles', count: '62 Villas', tier: 'Bel Air & Beverly Hills' },
                  { city: 'Miami', count: '39 Waterfront', tier: 'Star Island' },
                  { city: 'Aspen', count: '24 Chalets', tier: 'Mountain Haven' },
                  { city: 'London', count: '31 Manors', tier: 'Mayfair' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-2 rounded-xl bg-white border border-surface-200 shadow-soft-sm flex items-center justify-between gap-3 text-xs hover:border-gold-400 hover:shadow-soft transition-all"
                  >
                    <span className="font-bold text-surface-900">{item.city}</span>
                    <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between text-xs font-semibold text-brand-700 border-t border-surface-200/60 mt-6">
              <span>Automatic browser geolocation supported</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Metros <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
