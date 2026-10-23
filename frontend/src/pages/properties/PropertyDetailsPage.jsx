import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Share2,
  CheckCircle,
  Building,
  Image as ImageIcon,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { usePropertyDetail, useNotification } from '../../hooks';
import { PublicLayout } from '../../components/templates';
import { PropertyPrice } from '../../components/molecules';
import { Button, Badge, Spinner } from '../../components/atoms';
import { formatCurrency, formatDate, getImageUrl } from '../../utils';
import { propertyService } from '../../services/propertyService';

export const PropertyDetailsPage = () => {
  const { id } = useParams();
  const { property, activeImage, setActiveImage, loading, error } = usePropertyDetail(id);
  const { success, error: notifyError } = useNotification();
  const [inquirySent, setInquirySent] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Property link copied to clipboard!');
    }
  };

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!property?.id) return;

    setIsSubmittingInquiry(true);
    try {
      await propertyService.submitInquiry(property.id, inquiryForm);
      setInquirySent(true);
      success('Thank you! Your inquiry has been submitted and an agent will contact you shortly.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit inquiry. Please try again.';
      notifyError(msg);
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="py-24 text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-surface-500 font-medium">Loading property details...</p>
        </div>
      </PublicLayout>
    );
  }

  if (error || !property) {
    return (
      <PublicLayout>
        <div className="max-w-xl mx-auto py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Building className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900">Property Not Found</h2>
          <p className="text-sm text-surface-500">
            {error || "The property listing you are looking for doesn't exist or has been removed."}
          </p>
          <Link to="/properties">
            <Button variant="primary" size="md">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Listings
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const images = property.images || [];
  const activeImageUrl = activeImage
    ? getImageUrl(activeImage.filePath || activeImage.fileName)
    : getImageUrl(property.primaryImagePath);

  return (
    <PublicLayout>
      {/* Top Breadcrumb & Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-xs font-semibold text-surface-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-1.5" /> Share Listing
          </Button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Gallery + Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Gallery Display */}
          <div className="space-y-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 shadow-soft-xl border border-surface-200">
              <img
                src={activeImageUrl}
                alt={property.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              <div className="absolute top-4 left-4">
                <Badge variant="neutral" size="sm" className="!bg-white/95 !text-surface-900 backdrop-blur-md shadow-soft font-bold">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-brand-600" />
                  {property.city}
                </Badge>
              </div>

              {images.length > 0 && (
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-slate-900/70 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5 shadow-soft">
                  <ImageIcon className="w-4 h-4" />
                  {images.length} {images.length === 1 ? 'photo' : 'photos'}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img) => {
                  const thumbUrl = getImageUrl(img.filePath || img.fileName);
                  const isSelected = activeImage?.id === img.id;

                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        isSelected
                          ? 'border-brand-600 ring-2 ring-brand-500/30 scale-105'
                          : 'border-surface-200 hover:border-surface-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      {img.isPrimary && (
                        <span className="absolute bottom-1 right-1 text-[9px] bg-brand-600 text-white font-bold px-1 rounded">
                          ★
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Property Metadata Header */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-200 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-100 pb-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight">
                  {property.name}
                </h1>
                <p className="text-sm text-surface-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  {property.location}, {property.city}
                </p>
              </div>

              <div>
                <PropertyPrice price={property.price} size="lg" />
              </div>
            </div>

            {/* Quick Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-surface-50 border border-surface-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400 block">Status</span>
                <span className="text-sm font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-4 h-4" /> Available
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-50 border border-surface-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400 block">Listed Date</span>
                <span className="text-sm font-semibold text-surface-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-4 h-4 text-surface-400" /> {formatDate(property.createdAt)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-50 border border-surface-100 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400 block">Verification</span>
                <span className="text-sm font-semibold text-brand-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-4 h-4" /> Verified Estate
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-6 space-y-3">
              <h2 className="text-lg font-bold text-surface-900">About this Property</h2>
              <div className="text-sm text-surface-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Contact Agent Card */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-3xl border border-surface-200 shadow-soft-xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                Direct Inquiry
              </span>
              <h3 className="text-xl font-extrabold text-surface-900">
                Interested in this Estate?
              </h3>
              <p className="text-xs text-surface-500 mt-1">
                Connect with our premium residential concierge to arrange a private private showing or receive detailed prospectus materials.
              </p>
            </div>

            {inquirySent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Inquiry Submitted
                </div>
                <p>Our advisor has received your request and will reach out shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-3">
                <div>
                  <label htmlFor="inquiryName" className="block text-xs font-semibold text-surface-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="inquiryName"
                    name="name"
                    type="text"
                    required
                    value={inquiryForm.name}
                    onChange={handleInquiryChange}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 text-xs text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="inquiryEmail" className="block text-xs font-semibold text-surface-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="inquiryEmail"
                    name="email"
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={handleInquiryChange}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 text-xs text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="inquiryPhone" className="block text-xs font-semibold text-surface-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="inquiryPhone"
                    name="phone"
                    type="tel"
                    required
                    value={inquiryForm.phone}
                    onChange={handleInquiryChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-200 text-xs text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="inquiryMessage" className="block text-xs font-semibold text-surface-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="inquiryMessage"
                    name="message"
                    rows="2"
                    value={inquiryForm.message}
                    onChange={handleInquiryChange}
                    placeholder="I am interested in scheduling a tour or receiving more details..."
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-200 text-xs text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmittingInquiry}
                  className="w-full shadow-soft mt-2"
                >
                  Request Private Tour
                </Button>
              </form>
            )}

            <div className="pt-4 border-t border-surface-100 space-y-2 text-xs text-surface-500">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                <span>Concierge Desk: +1 (800) 555-0199</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-600" />
                <span>concierge@housio.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PropertyDetailsPage;
