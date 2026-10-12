import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Badge, Button, Spinner } from '../atoms';
import { formatCurrency, formatDate, getImageUrl } from '../../utils';

export const PropertyTable = ({
  properties = [],
  loading = false,
  onDeleteClick,
  className = '',
}) => {
  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-surface-200">
        <Spinner size="lg" />
        <p className="mt-3 text-sm text-surface-500 font-medium">Loading properties...</p>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-surface-200">
        <div className="w-12 h-12 rounded-2xl bg-surface-100 text-surface-400 flex items-center justify-center mx-auto mb-3">
          <ImageIcon className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-surface-900">No Properties Found</h3>
        <p className="text-sm text-surface-500 mt-1 max-w-sm mx-auto">
          No records match your criteria. Click "Create Property" to add a new listing.
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-2xl border border-surface-200 bg-white shadow-soft ${className}`}>
      <table className="w-full text-left text-sm text-surface-700">
        <thead className="bg-surface-50/80 text-xs font-bold uppercase tracking-wider text-surface-500 border-b border-surface-200">
          <tr>
            <th scope="col" className="px-6 py-4">Property</th>
            <th scope="col" className="px-6 py-4">Location</th>
            <th scope="col" className="px-6 py-4">Price</th>
            <th scope="col" className="px-6 py-4 text-center">Photos</th>
            <th scope="col" className="px-6 py-4">Added</th>
            <th scope="col" className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {properties.map((prop) => {
            const thumbUrl = getImageUrl(prop.primaryImagePath || prop.images?.[0]?.filePath);
            const photoCount = prop.images ? prop.images.length : (prop.imageCount || 0);

            return (
              <tr key={prop.id} className="hover:bg-surface-50/60 transition-colors">
                {/* Thumbnail & Title */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={thumbUrl}
                      alt={prop.name}
                      className="w-14 h-11 object-cover rounded-xl border border-surface-200 bg-surface-100 flex-shrink-0"
                    />
                    <div>
                      <div className="font-bold text-surface-900 hover:text-brand-600 transition-colors">
                        <Link to={`/admin/properties/${prop.id}/edit`}>{prop.name}</Link>
                      </div>
                      <span className="text-xs text-surface-400">ID: #{prop.id}</span>
                    </div>
                  </div>
                </td>

                {/* City & Address */}
                <td className="px-6 py-4">
                  <div className="font-medium text-surface-800">{prop.city}</div>
                  <div className="text-xs text-surface-400 truncate max-w-xs">{prop.location}</div>
                </td>

                {/* Price */}
                <td className="px-6 py-4 font-bold text-surface-900">
                  {formatCurrency(prop.price)}
                </td>

                {/* Photos */}
                <td className="px-6 py-4 text-center">
                  <Badge variant="neutral" size="xs">
                    {photoCount} {photoCount === 1 ? 'image' : 'images'}
                  </Badge>
                </td>

                {/* Date Added */}
                <td className="px-6 py-4 text-xs text-surface-500 whitespace-nowrap">
                  {formatDate(prop.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Live Public Link */}
                    <Link
                      to={`/properties/${prop.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
                      title="View live listing"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    {/* Edit */}
                    <Link
                      to={`/admin/properties/${prop.id}/edit`}
                      className="p-2 rounded-xl text-brand-600 hover:text-brand-800 hover:bg-brand-50 transition-colors"
                      title="Edit property"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDeleteClick(prop)}
                      className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Delete property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable;
