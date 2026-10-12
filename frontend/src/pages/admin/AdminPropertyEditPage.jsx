import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { propertyService } from '../../services';
import { useNotification } from '../../hooks';
import { AdminLayout } from '../../components/templates';
import { PropertyForm } from '../../components/organisms';
import { Spinner, Button } from '../../components/atoms';

export const AdminPropertyEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotification();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProperty() {
      try {
        const data = await propertyService.getPropertyById(id);
        if (isMounted) {
          setProperty(data);
        }
      } catch (err) {
        if (isMounted) {
          setFetchError(err.response?.data?.message || err.message || 'Property not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProperty();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async ({ formData, retainedImageIds, primaryImageId }) => {
    setIsSubmitting(true);
    try {
      const updated = await propertyService.updateProperty(
        id,
        formData,
        retainedImageIds,
        primaryImageId
      );
      success(`Property "${updated.name}" updated successfully!`);
      navigate('/admin/properties');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update property';
      notifyError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Property">
        <div className="py-24 text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-surface-500 font-medium">Loading property data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (fetchError || !property) {
    return (
      <AdminLayout title="Edit Property">
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-surface-900">Unable to load property</h2>
          <p className="text-sm text-surface-500">{fetchError}</p>
          <Link to="/admin/properties">
            <Button variant="primary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties List
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit Property #${property.id}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb & Actions Bar */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/admin/properties"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-purple-700 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties List
            </Link>
            <h1 className="text-2xl font-black text-surface-900 tracking-tight">
              Edit Property Listing
            </h1>
            <p className="text-xs text-surface-500">
              Update attributes, retain or delete current photos, and upload new image files.
            </p>
          </div>

          <Link
            to={`/properties/${property.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200"
          >
            <span>View Public View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <PropertyForm
          initialValues={{
            name: property.name,
            description: property.description,
            price: property.price,
            location: property.location,
            city: property.city,
          }}
          existingImages={property.images || []}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEdit={true}
          submitButtonText="Save Changes"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPropertyEditPage;
