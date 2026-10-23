import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { propertyService } from '../../services';
import { useNotification } from '../../hooks';
import { AdminLayout } from '../../components/templates';
import { PropertyForm } from '../../components/organisms';

export const AdminPropertyCreatePage = () => {
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async ({ formData }) => {
    setIsSubmitting(true);
    try {
      const created = await propertyService.createProperty(formData);
      success(`Property "${created.name}" created successfully!`);
      navigate('/admin/properties');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create property';
      notifyError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Create New Property">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/admin/properties"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-brand-700 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties List
            </Link>
            <h1 className="text-2xl font-black text-surface-900 tracking-tight">
              Create New Property
            </h1>
            <p className="text-xs text-surface-500">
              Provide comprehensive details and upload high-resolution architectural photography.
            </p>
          </div>
        </div>

        <PropertyForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEdit={false}
          submitButtonText="Publish Property Listing"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPropertyCreatePage;
