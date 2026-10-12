import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import { AdminLayout } from '../../components/templates';
import { Button, Badge, Spinner } from '../../components/atoms';
import { Pagination } from '../../components/molecules';
import { useNotification } from '../../hooks';
import { formatDate } from '../../utils';

export const AdminInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const { success, error: notifyError } = useNotification();

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await propertyService.getAdminInquiries({ page, size: 10 });
      if (data) {
        setInquiries(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      }
    } catch (err) {
      notifyError('Failed to load inquiries. Please check network connection.');
    } finally {
      setLoading(false);
    }
  }, [page, notifyError]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const handleStatusChange = async (inquiryId, newStatus) => {
    setUpdatingId(inquiryId);
    try {
      const updated = await propertyService.updateInquiryStatus(inquiryId, newStatus);
      setInquiries((prev) =>
        prev.map((item) => (item.id === inquiryId ? { ...item, status: updated.status } : item))
      );
      success(`Inquiry status updated to ${newStatus}`);
    } catch (err) {
      notifyError('Failed to update inquiry status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    if (statusFilter === 'ALL') return true;
    return item.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return (
          <Badge variant="admin" size="sm" className="!bg-purple-100 !text-purple-800 !border-purple-200">
            <Clock className="w-3 h-3 mr-1" /> New Lead
          </Badge>
        );
      case 'CONTACTED':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Contacted
          </Badge>
        );
      case 'CLOSED':
        return (
          <Badge variant="neutral" size="sm">
            <Archive className="w-3 h-3 mr-1" /> Closed
          </Badge>
        );
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Customer Inquiries">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-surface-200 shadow-soft">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-surface-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              Customer Inquiry Desk
            </h1>
            <p className="text-xs sm:text-sm text-surface-500 mt-1">
              Real-time incoming customer tour requests and leads persisted in PostgreSQL.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadInquiries}
              className="!border-surface-300 text-surface-700"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'NEW', 'CONTACTED', 'CLOSED'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab
                  ? 'bg-purple-700 text-white shadow-soft'
                  : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50'
              }`}
            >
              {tab === 'ALL' ? `All Inquiries (${totalElements})` : tab}
            </button>
          ))}
        </div>

        {/* Inquiries Content */}
        {loading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-surface-200 shadow-soft">
            <Spinner size="lg" />
            <p className="mt-3 text-xs text-surface-500 font-medium">Fetching customer inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-surface-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-surface-900">No Inquiries Found</h3>
            <p className="text-xs text-surface-500 max-w-sm mx-auto">
              {statusFilter === 'ALL'
                ? 'No customer inquiries have been submitted yet. Inquiries submitted on property listing pages will appear here.'
                : `No inquiries with status ${statusFilter} found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-surface-200 shadow-soft hover:shadow-soft-lg transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-black text-sm flex items-center justify-center">
                      {inquiry.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-surface-900">{inquiry.name}</h3>
                      <div className="text-[11px] text-surface-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(inquiry.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(inquiry.status)}
                    <select
                      value={inquiry.status}
                      disabled={updatingId === inquiry.id}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-surface-200 bg-surface-50 text-surface-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      <option value="NEW">Mark as NEW</option>
                      <option value="CONTACTED">Mark as CONTACTED</option>
                      <option value="CLOSED">Mark as CLOSED</option>
                    </select>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Property Info */}
                  <div className="space-y-1">
                    <span className="font-semibold text-surface-400 uppercase tracking-wider text-[10px]">
                      Target Property
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-surface-900">
                      <Building className="w-3.5 h-3.5 text-brand-600" />
                      <span>{inquiry.propertyName || `Property #${inquiry.propertyId}`}</span>
                    </div>
                    {inquiry.propertyId && (
                      <Link
                        to={`/properties/${inquiry.propertyId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:text-brand-800 font-semibold"
                      >
                        <span>View Listing Page</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1">
                    <span className="font-semibold text-surface-400 uppercase tracking-wider text-[10px]">
                      Contact Details
                    </span>
                    <div className="space-y-1">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="flex items-center gap-1.5 text-surface-700 hover:text-purple-700 font-medium"
                      >
                        <Mail className="w-3.5 h-3.5 text-purple-600" />
                        <span>{inquiry.email}</span>
                      </a>
                      {inquiry.phone && (
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="flex items-center gap-1.5 text-surface-700 hover:text-purple-700 font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{inquiry.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Customer Message */}
                  <div className="space-y-1">
                    <span className="font-semibold text-surface-400 uppercase tracking-wider text-[10px]">
                      Inquiry Message
                    </span>
                    <p className="text-surface-700 bg-surface-50 p-2.5 rounded-xl border border-surface-100 italic">
                      "{inquiry.message || 'No additional message provided.'}"
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInquiriesPage;
