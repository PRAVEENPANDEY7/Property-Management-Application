import React, { useState } from 'react';
import { FormField } from '../molecules';
import { Button, Alert } from '../atoms';
import ImageUploader from './ImageUploader';
import { validateProperty } from '../../validators';

export const PropertyForm = ({
  initialValues = {
    name: '',
    description: '',
    price: '',
    location: '',
    city: '',
    images: [],
  },
  existingImages = [],
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  submitButtonText = isEdit ? 'Update Property' : 'Create Property',
  className = '',
}) => {
  const [values, setValues] = useState({
    name: initialValues.name || '',
    description: initialValues.description || '',
    price: initialValues.price !== undefined ? String(initialValues.price) : '',
    location: initialValues.location || '',
    city: initialValues.city || '',
  });

  const [retainedImageIds, setRetainedImageIds] = useState(() =>
    existingImages.map((img) => img.id)
  );
  const [primaryImageId, setPrimaryImageId] = useState(() => {
    const primary = existingImages.find((img) => img.isPrimary);
    return primary ? primary.id : existingImages[0]?.id || null;
  });

  const [newFiles, setNewFiles] = useState([]);
  const [primaryNewIndex, setPrimaryNewIndex] = useState(0);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate
    const totalRemainingImages = retainedImageIds.length + newFiles.length;
    const { isValid, errors: validationErrors } = validateProperty(
      {
        ...values,
        images: newFiles,
      },
      !isEdit // require image on new property
    );

    // If editing and user removed all existing and uploaded 0 new files
    if (isEdit && totalRemainingImages === 0) {
      validationErrors.images = 'A property must have at least one image.';
    }

    if (!isValid || (isEdit && totalRemainingImages === 0)) {
      setErrors(validationErrors);
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append('name', values.name.trim());
    formData.append('description', values.description.trim());
    formData.append('price', values.price);
    formData.append('location', values.location.trim());
    formData.append('city', values.city.trim());

    if (isEdit) {
      newFiles.forEach((file) => {
        formData.append('newImages', file);
      });
    } else {
      newFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      await onSubmit({
        formData,
        retainedImageIds,
        primaryImageId,
      });
    } catch (err) {
      setSubmitError(err.message || 'An error occurred while saving the property.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {submitError && (
        <Alert type="error" title="Submission Error" onDismiss={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      {/* Modern 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Core Property Details (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-surface-200 shadow-soft space-y-5">
            <div className="border-b border-surface-100 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-surface-900">
                Property Overview
              </h3>
              <span className="text-xs text-surface-400">Core listing details</span>
            </div>

            <FormField
              label="Property Title"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="e.g. Modern Sunset Penthouse"
              required
              error={errors.name}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Price (USD)"
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={values.price}
                onChange={handleChange}
                placeholder="e.g. 1250000.00"
                required
                error={errors.price}
              />

              <FormField
                label="City"
                id="city"
                name="city"
                value={values.city}
                onChange={handleChange}
                placeholder="e.g. Miami"
                required
                error={errors.city}
              />
            </div>

            <FormField
              label="Street Address / Location"
              id="location"
              name="location"
              value={values.location}
              onChange={handleChange}
              placeholder="e.g. 100 Ocean Drive, Suite 400"
              required
              error={errors.location}
            />

            <FormField
              as="textarea"
              label="Description"
              id="description"
              name="description"
              rows={4}
              value={values.description}
              onChange={handleChange}
              placeholder="Comprehensive description of the architectural layout, amenities, square footage, and key features..."
              required
              error={errors.description}
            />
          </div>
        </div>

        {/* Right Column: Sticky Action & Media Uploader (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* Action / Publishing Card */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-soft space-y-4">
            <h3 className="text-base font-bold text-surface-900 border-b border-surface-100 pb-3">
              Listing Actions
            </h3>
            <p className="text-xs text-surface-500 leading-relaxed">
              Once published, this property will immediately appear in the public catalog and search listings.
            </p>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full shadow-soft"
            >
              {submitButtonText}
            </Button>
          </div>

          {/* Media & Photography Card */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-soft space-y-4">
            <div className="border-b border-surface-100 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-surface-900">
                Media & Photography
              </h3>
              <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                {retainedImageIds.length + newFiles.length} photos
              </span>
            </div>

            <ImageUploader
              existingImages={existingImages}
              retainedImageIds={retainedImageIds}
              onRetainedImageIdsChange={setRetainedImageIds}
              newFiles={newFiles}
              onNewFilesChange={setNewFiles}
              primaryImageId={primaryImageId}
              onPrimaryImageIdChange={setPrimaryImageId}
              primaryNewIndex={primaryNewIndex}
              onPrimaryNewIndexChange={setPrimaryNewIndex}
              error={errors.images}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;
