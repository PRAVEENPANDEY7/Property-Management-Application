import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Search,
  MapPin,
  ShieldCheck,
  Building2,
  KeyRound,
  TrendingUp,
  Award,
  ChevronRight,
  CheckCircle2,
  Phone,
  Compass,
  Star,
  Layers,
  Camera,
  Play,
  ArrowUpRight
} from 'lucide-react';
import { PublicLayout } from '../components/templates';
import { Button, Badge, SpotlightCard, Perspective3DCard, BrandLogo, BorderBeam, Marquee } from '../components/atoms';
import { BentoGrid } from '../components/molecules';
import { PropertyCard } from '../components/organisms';
import { propertyService } from '../services/propertyService';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const data = await propertyService.getPublicProperties({ page: 0, size: 3 });
        if (isMounted && data?.content) {
          setFeaturedProperties(data.content);
        }
      } catch (err) {
        console.warn('Could not load live featured properties:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (selectedCity.trim()) params.append('city', selectedCity.trim());
    navigate(`/properties?${params.toString()}`);
  };

  const selectQuickCity = (city) => {
    navigate(`/properties?city=${encodeURIComponent(city)}`);
  };

  return (
    <PublicLayout>
      {/* =========================================================================
          HERO SECTION: 3D Obsidian & Emerald Atmosphere with Gold Light Beam
          ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden -mt-6 sm:-mt-8 px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-[#031917] to-slate-950 text-white rounded-3xl sm:rounded-[2.5rem] border border-brand-900/40 shadow-soft-xl">
        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 bg-grid-dark opacity-35 pointer-events-none" />

        {/* 21st.dev Style Radial Spotlights */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-radial-spotlight pointer-events-none opacity-80 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-radial-emerald pointer-events-none opacity-40 blur-3xl" />

        <div className="max-w-7xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Vision, Headline & Search Command */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Private Exchange Live Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-soft">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Housio Private Client Exchange &bull; Autumn 2026</span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight font-serif leading-[1.08]">
                Where Architecture Meets <br />
                <span className="text-gold-gradient italic">Ambition.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
                Housio is the premier marketplace for discovering exceptional homes, luxury villas, and exclusive properties. We bring verified listings and property seekers together through a trusted, seamless experience.
              </p>
            </div>

            {/* Interactive Search Command Capsule */}
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-gold-400/30 backdrop-blur-xl shadow-gold-glow max-w-2xl space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2"
            >
              {/* Keyword / Location Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Architectural style, estate title, keywords..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* City Quick Picker */}
              <div className="relative border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
                <MapPin className="w-4 h-4 text-brand-400 absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full sm:w-44 pl-9 pr-6 py-3 bg-transparent text-xs sm:text-sm text-white focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="" className="bg-slate-900 text-white">All Locations</option>
                  <option value="New York" className="bg-slate-900 text-white">New York, NY</option>
                  <option value="Los Angeles" className="bg-slate-900 text-white">Los Angeles, CA</option>
                  <option value="Miami" className="bg-slate-900 text-white">Miami, FL</option>
                  <option value="Aspen" className="bg-slate-900 text-white">Aspen, CO</option>
                  <option value="San Francisco" className="bg-slate-900 text-white">San Francisco, CA</option>
                </select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gold"
                size="md"
                className="w-full sm:w-auto px-6 py-3.5 !rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 flex-shrink-0"
              >
                <span>Find Estates</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Quick Filter City Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider mr-1">Trending:</span>
              {['New York', 'Los Angeles', 'Miami', 'Aspen'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => selectQuickCity(city)}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-gold-500/15 border border-white/10 hover:border-gold-400/40 text-slate-300 hover:text-gold-300 text-[11px] font-medium transition-all"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Perspective Floating Luxury Card with Border Beam */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Perspective3DCard maxRotation={10} scale={1.03} className="max-w-md w-full">
              <div className="relative rounded-3xl overflow-hidden border border-gold-400/40 bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 p-3 shadow-gold-glow-lg group">
                {/* 21st.dev / Magic UI Border Beam */}
                <BorderBeam size={260} duration={8} colorFrom="#c59b52" colorTo="#116e65" />

                {/* 3D Gold Architecture Image Showcase */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src="/housio-hero-luxury.jpg"
                    alt="Housio Luxury Estate"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />

                  {/* Floating Holographic Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-gold-400/40 text-gold-300 text-xs font-bold flex items-center gap-1.5 shadow-soft">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Verified Title #HS-882</span>
                    </div>
                  </div>

                  {/* Bottom Estate Info Capsule */}
                  <div className="absolute bottom-4 inset-x-4 z-20 space-y-2 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest">
                        Premier Landmark
                      </span>
                      <span className="text-sm font-black text-white font-serif">$18,750,000</span>
                    </div>
                    <div className="text-base font-bold text-white font-serif">
                      The Obsidian Crest Pavilion
                    </div>
                    <div className="text-xs text-slate-300 flex items-center justify-between pt-1 border-t border-white/10">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-400" /> Bel Air, Los Angeles
                      </span>
                      <span className="text-emerald-400 font-semibold text-[11px]">Private Showing Only</span>
                    </div>
                  </div>
                </div>
              </div>
            </Perspective3DCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LUXURY MARQUEE: Press & Global Architectural Network
          ========================================================================= */}
      <section className="py-8 bg-slate-950/90 border-y border-brand-900/40 overflow-hidden my-6 rounded-2xl sm:rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gold-400/80">
            Featured In & Partnered With Premier Architectural Authorities
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">Discreet Private Exchange</span>
        </div>
        <Marquee duration="25s" pauseOnHover={true} className="py-2">
          {[
            'ARCHITECTURAL DIGEST',
            'SOTHEBY’S INTERNATIONAL',
            'ROBB REPORT LUXURY',
            'BLOOMBERG PURSUITS',
            'FINANCIAL TIMES MANSIONS',
            'VOGUE LIVING',
            'WALL STREET JOURNAL REAL ESTATE',
            'MONOCLE DESIGN',
          ].map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-serif font-bold text-slate-300 tracking-wider whitespace-nowrap hover:text-gold-300 hover:border-gold-400/40 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-gold-400/70" />
              <span>{brand}</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* =========================================================================
          KEY METRICS STRIP: Glowing Gold & Emerald Stats
          ========================================================================= */}
      <section className="py-12 border-y border-surface-200/80 bg-white/70 backdrop-blur-md my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-surface-900 font-serif text-gold-gradient">
                $450M+
              </div>
              <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                Curated Portfolio Value
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-surface-900 font-serif text-teal-gradient">
                99.8%
              </div>
              <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                Title Verification Rate
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-surface-900 font-serif text-gold-gradient">
                12+
              </div>
              <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                Prime Global Metros
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-surface-900 font-serif text-teal-gradient">
                &lt; 24h
              </div>
              <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                Private Tour Turnaround
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THREE PILLARS OF HOUSIO: Discover Better. Choose Confidently. Live Exceptionally.
          ========================================================================= */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="gold" size="sm">
              The Housio Philosophy
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 font-serif">
              Three Pillars of the <span className="text-gold-gradient">Housio</span> Experience
            </h2>
            <p className="text-xs sm:text-sm text-surface-500">
              Redefining how the world’s most discerning clients acquire and experience fine architectural property.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <SpotlightCard
              spotlightColor="rgba(17, 110, 101, 0.15)"
              borderColor="rgba(17, 110, 101, 0.4)"
              className="p-8 space-y-6 shadow-soft hover:shadow-soft-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 font-serif font-black text-2xl flex items-center justify-center border border-brand-200">
                01
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-surface-900 font-serif">
                  Discover Better
                </h3>
                <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                  Bypass generic aggregator clutter. Experience only vetted architectural landmarks, private off-market listings, and high-yield luxury estates selected by seasoned curators.
                </p>
              </div>
              <div className="pt-4 border-t border-surface-100 text-xs font-bold text-brand-700 flex items-center gap-1">
                <span>Curated Architectural Audits</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </SpotlightCard>

            {/* Pillar 2 */}
            <SpotlightCard
              spotlightColor="rgba(197, 155, 82, 0.2)"
              borderColor="rgba(197, 155, 82, 0.45)"
              className="p-8 space-y-6 shadow-soft hover:shadow-gold-glow"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold-50 text-gold-700 font-serif font-black text-2xl flex items-center justify-center border border-gold-200">
                02
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-surface-900 font-serif">
                  Choose Confidently
                </h3>
                <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                  Every estate is verified through cryptographic magic-byte imaging, local zoning validation, and transparent pricing histories—giving you complete certainty before you negotiate.
                </p>
              </div>
              <div className="pt-4 border-t border-surface-100 text-xs font-bold text-gold-700 flex items-center gap-1">
                <span>Cryptographic Verification Guarantee</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </SpotlightCard>

            {/* Pillar 3 */}
            <SpotlightCard
              spotlightColor="rgba(17, 110, 101, 0.15)"
              borderColor="rgba(17, 110, 101, 0.4)"
              className="p-8 space-y-6 shadow-soft hover:shadow-soft-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface-100 text-surface-900 font-serif font-black text-2xl flex items-center justify-center border border-surface-300">
                03
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-surface-900 font-serif">
                  Live Exceptionally
                </h3>
                <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                  From private chauffeur escort to discreet closing ceremonies, Housio provides a bespoke concierge standard designed around your lifestyle, timeline, and privacy.
                </p>
              </div>
              <div className="pt-4 border-t border-surface-100 text-xs font-bold text-brand-700 flex items-center gap-1">
                <span>Private Residential Concierge</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          21ST.DEV STYLE BENTO GRID: The Exceptional Standard
          ========================================================================= */}
      <BentoGrid />

      {/* =========================================================================
          FEATURED ESTATES SHOWCASE: 3D Perspective Cards
          ========================================================================= */}
      <section className="py-20 bg-surface-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
                <Building2 className="w-4 h-4 text-gold-500" />
                Featured Private Collection
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 font-serif">
                Exceptional Homes Ready for Viewing
              </h2>
            </div>

            <Link to="/properties">
              <Button variant="outline" size="md" className="!border-surface-300 font-bold group">
                <span>Explore Full Portfolio</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-gold-600" />
              </Button>
            </Link>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-3xl bg-surface-200/60 animate-pulse" />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-surface-200 space-y-4">
              <h3 className="text-lg font-bold text-surface-900">Portfolio Refreshing</h3>
              <p className="text-xs text-surface-500 max-w-md mx-auto">
                Explore the complete collection of verified properties in our listings directory.
              </p>
              <Link to="/properties">
                <Button variant="primary" size="md">
                  View All Listings
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          PRIVATE CLIENT TESTIMONIALS: Verified Wealth Accolades
          ========================================================================= */}
      <section className="py-20 relative overflow-hidden bg-slate-950 text-white rounded-3xl sm:rounded-[2.5rem] border border-brand-900/40 my-16 p-8 sm:p-16">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
              Private Client Dispatches
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif">
              Trusted by the Discerning Few
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                quote:
                  'Housio eliminated all the noise and fake photography typical of standard portals. Their magic-byte verification gave our family 100% confidence to acquire our Aspen chalet sight unseen.',
                author: 'Marcus Vance',
                title: 'Family Office Principal',
                location: 'Acquired Aspen Chalet',
                rating: 5,
              },
              {
                quote:
                  'The white-glove tour logistics and privacy adherence were unmatched. The advisor arranged our helicopter landing directly onto the estate grounds without any public exposure.',
                author: 'Elena Rostova',
                title: 'Architectural Collector',
                location: 'Acquired Bel Air Villa',
                rating: 5,
              },
              {
                quote:
                  'Selling a trophy asset requires discretion, verified buyers, and exceptional presentation. Housio delivered a fully verified buyer within 22 days of private listing.',
                author: 'David Sterling',
                title: 'Managing Director',
                location: 'Sold Manhattan Penthouse',
                rating: 5,
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 hover:border-gold-400/40 transition-colors"
              >
                <div className="flex gap-1 text-gold-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="pt-3 border-t border-white/10 text-xs">
                  <div className="font-bold text-white font-serif">{t.author}</div>
                  <div className="text-[11px] text-gold-300 font-medium">{t.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          GRAND CALL TO ACTION: Find Your Exceptional
          ========================================================================= */}
      <section className="py-20 relative text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            Begin Your Journey
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-surface-900 font-serif leading-tight">
            Ready to Discover a Place <br />
            <span className="text-gold-gradient">Worth Calling Home?</span>
          </h2>

          <p className="text-sm sm:text-base text-surface-600 max-w-xl mx-auto leading-relaxed">
            Discover better. Choose confidently. Live exceptionally with Housio’s verified collection of prime residential estates.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/properties">
              <Button variant="gold" size="lg" className="w-full sm:w-auto px-8 font-bold shadow-gold-glow">
                <span>Browse Verified Collection</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 !border-surface-300 font-bold">
                <KeyRound className="w-4 h-4 mr-2 text-brand-600" />
                Sign In to Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;
