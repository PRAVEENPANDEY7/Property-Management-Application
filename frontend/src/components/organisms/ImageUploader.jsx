import React, { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { ImagePreview } from '../molecules';
import { getImageUrl } from '../../utils';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageUploader = ({
  existingImages = [],
  retainedImageIds = [],
  onRetainedImageIdsChange,
  newFiles = [],
  onNewFilesChange,
  primaryImageId = null,
  onPrimaryImageIdChange,
  primaryNewIndex = 0,
  onPrimaryNewIndexChange,
  error = null,
  className = '',
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Validate and add files
  const processFiles = (files) => {
    setLocalError(null);
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        setLocalError(`"${file.name}" is not an accepted format. Only JPEG, PNG, and WebP are allowed.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setLocalError(`"${file.name}" exceeds the 10MB file size limit.`);
        return;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onNewFilesChange([...newFiles, ...validFiles]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveExisting = (imgId) => {
    onRetainedImageIdsChange(retainedImageIds.filter((id) => id !== imgId));
    if (primaryImageId === imgId) {
      onPrimaryImageIdChange(null);
    }
  };

  const handleRemoveNew = (index) => {
    const updated = newFiles.filter((_, idx) => idx !== index);
    onNewFilesChange(updated);
    if (primaryNewIndex === index) {
      onPrimaryNewIndexChange(0);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-brand-500 bg-brand-50/50'
            : 'border-surface-300 hover:border-brand-400 bg-surface-50/50 hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) processFiles(e.target.files);
          }}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white border border-surface-200 text-brand-600 flex items-center justify-center shadow-soft">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold text-brand-600 hover:text-brand-700">Click to upload</span>
            <span className="text-surface-500"> or drag and drop images here</span>
          </div>
          <p className="text-xs text-surface-400">
            Accepts JPEG, PNG, WebP up to 10MB per photo
          </p>
        </div>
      </div>

      {/* Errors */}
      {(localError || error) && (
        <div className="flex items-center gap-2 text-xs font-semibold text-accent-rose bg-rose-50 border border-rose-200 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{localError || error}</span>
        </div>
      )}

      {/* Existing Images Gallery */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500">
            Current Property Images ({retainedImageIds.length} retained of {existingImages.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {existingImages
              .filter((img) => retainedImageIds.includes(img.id))
              .map((img) => (
                <ImagePreview
                  key={img.id}
                  src={getImageUrl(img.filePath || img.fileName)}
                  alt="Existing property photo"
                  isPrimary={primaryImageId ? primaryImageId === img.id : img.isPrimary}
                  isExisting={true}
                  onSetPrimary={() => onPrimaryImageIdChange(img.id)}
                  onRemove={() => handleRemoveExisting(img.id)}
                />
              ))}
          </div>
        </div>
      )}

      {/* New Upload Previews */}
      {newFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500">
            New Photos to Upload ({newFiles.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {newFiles.map((file, idx) => {
              const previewUrl = URL.createObjectURL(file);
              const isPrimaryThis = !primaryImageId && primaryNewIndex === idx;

              return (
                <ImagePreview
                  key={idx}
                  src={previewUrl}
                  alt={file.name}
                  isPrimary={isPrimaryThis}
                  isExisting={false}
                  onSetPrimary={() => {
                    onPrimaryImageIdChange(null);
                    onPrimaryNewIndexChange(idx);
                  }}
                  onRemove={() => handleRemoveNew(idx)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
