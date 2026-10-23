import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  PlusCircle,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  KeyRound,
} from 'lucide-react';
import { propertyService } from '../../services';
import { AdminLayout } from '../../components/templates';
import { Button, Badge, Spinner } from '../../components/atoms';
import { formatCurrency, formatDate, getImageUrl } from '../../utils';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalValue: 0,
    citiesCount: 0,
    newInquiries: 0,
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [data, inquiryStats] = await Promise.all([
          propertyService.getAdminProperties({ page: 0, size: 20 }),
          propertyService.getInquiryStats().catch(() => ({ newCount: 0 })),
        ]);

        if (isMounted && data) {
          const content = data.content || [];
          const totalVal = content.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
          const uniqueCities = new Set(content.map((p) => p.city).filter(Boolean));

          setStats({
            totalProperties: data.totalElements ?? content.length,
            totalValue: totalVal,
            citiesCount: uniqueCities.size,
            newInquiries: inquiryStats?.newCount ?? 0,
          });

          setRecentProperties(content.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-8">
        {/* Top Header Hero */}
        <div className="bg-gradient-to-r from-slate-950 via-brand-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-xl border border-brand-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="admin" size="sm" className="!bg-gold-500/20 !text-gold-300 !border-gold-500/40">
              Housio Operations Center
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Housio Property Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Manage live Housio properties, process multi-image uploads with magic-byte security, and oversee customer inquiries in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin/properties/new">
              <Button variant="primary" size="md" className="!bg-brand-600 hover:!bg-brand-500 shadow-soft font-bold">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Property
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="outline" size="md" className="!border-gold-500/40 !text-gold-300 hover:!bg-gold-500/10">
                <KeyRound className="w-4 h-4 mr-2 text-gold-400" />
                Security & Creds
              </Button>
            </Link>
            <Link to="/properties" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="md" className="!border-slate-700 !text-slate-200 hover:!bg-slate-800">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Site
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Properties */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-400">Total Listings</span>
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-surface-900">
                {loading ? '—' : stats.totalProperties}
              </div>
              <div className="text-[11px] text-surface-400 mt-1">Verified on PostgreSQL</div>
            </div>
          </div>

          {/* Portfolio Value */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-400">Portfolio Value</span>
              <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-surface-900">
                {loading ? '—' : formatCurrency(stats.totalValue)}
              </div>
              <div className="text-[11px] text-surface-400 mt-1">Total active listing price</div>
            </div>
          </div>

          {/* Active Cities */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-400">Coverage Cities</span>
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-surface-900">
                {loading ? '—' : stats.citiesCount}
              </div>
              <div className="text-[11px] text-surface-400 mt-1">Geolocated metropolitan zones</div>
            </div>
          </div>

          {/* Customer Inquiries / Leads */}
          <Link
            to="/admin/inquiries"
            className="bg-white p-6 rounded-2xl border border-surface-200 shadow-soft hover:shadow-soft-lg hover:border-gold-400/50 transition-all space-y-3 block group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-400 group-hover:text-gold-600 transition-colors">
                Customer Leads
              </span>
              <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-600 group-hover:bg-gold-600 group-hover:text-white transition-colors flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-surface-900 flex items-center gap-2">
                <span>{loading ? '—' : stats.newInquiries}</span>
                {stats.newInquiries > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-800">
                    NEW
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gold-600 font-semibold mt-1 flex items-center gap-1">
                <span>Manage inquiries</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Listings Section */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-surface-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-surface-900">Recent Properties</h3>
              <p className="text-xs text-surface-500 mt-0.5">Newly created listings in the system.</p>
            </div>
            <Link
              to="/admin/properties"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Spinner size="md" />
            </div>
          ) : recentProperties.length === 0 ? (
            <div className="p-8 text-center text-sm text-surface-500">
              No properties registered yet. Click "Add New Property" to begin.
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {recentProperties.map((prop) => {
                const thumb = getImageUrl(prop.primaryImagePath || prop.images?.[0]?.filePath);

                return (
                  <div key={prop.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-surface-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <img
                        src={thumb}
                        alt={prop.name}
                        className="w-12 h-10 object-cover rounded-lg border border-surface-200 bg-surface-100 flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-sm text-surface-900 hover:text-brand-700">
                          <Link to={`/admin/properties/${prop.id}/edit`}>{prop.name}</Link>
                        </div>
                        <div className="text-xs text-surface-400">
                          {prop.city} &bull; {formatCurrency(prop.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-surface-400 hidden sm:inline">
                        {formatDate(prop.createdAt)}
                      </span>
                      <Link
                        to={`/admin/properties/${prop.id}/edit`}
                        className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
