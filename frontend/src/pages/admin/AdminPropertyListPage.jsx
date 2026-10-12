import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, MapPin, X } from 'lucide-react';
import { useAdminProperties, useNotification } from '../../hooks';
import { AdminLayout } from '../../components/templates';
import { PropertyTable } from '../../components/organisms';
import { Pagination, ConfirmDialog } from '../../components/molecules';
import { Button } from '../../components/atoms';

export const AdminPropertyListPage = () => {
  const {
    properties,
    paginationMeta,
    page,
    search,
    city,
    loading,
    error,
    itemToDelete,
    isDeleting,
    setItemToDelete,
    confirmDelete,
    setPage,
    setSearch,
    setCity,
  } = useAdminProperties();

  const { success, error: notifyError } = useNotification();

  const handleDeleteConfirm = async () => {
    try {
      await confirmDelete();
      success('Property and all associated media files were deleted successfully.');
    } catch (err) {
      notifyError(err.message || 'Failed to delete property.');
    }
  };

  return (
    <AdminLayout title="Property Management">
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-surface-900 tracking-tight">
              Manage Properties
            </h1>
            <p className="text-xs text-surface-500 mt-1">
              {paginationMeta.totalElements} registered properties in database
            </p>
          </div>

          <Link to="/admin/properties/new">
            <Button variant="primary" size="md" className="!bg-purple-600 hover:!bg-purple-500 shadow-soft">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Property
            </Button>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-soft flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-surface-200 text-xs text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="relative w-full sm:w-60">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Filter by city..."
              className="w-full pl-10 pr-8 py-2 rounded-xl border border-surface-200 text-xs text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {city && (
              <button
                type="button"
                onClick={() => setCity('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Table View */}
        <PropertyTable
          properties={properties}
          loading={loading}
          onDeleteClick={(prop) => setItemToDelete(prop)}
        />

        {/* Server-Side Pagination */}
        <Pagination
          currentPage={page}
          totalPages={paginationMeta.totalPages}
          totalElements={paginationMeta.totalElements}
          pageSize={paginationMeta.pageSize}
          onPageChange={setPage}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={Boolean(itemToDelete)}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDeleteConfirm}
          isConfirming={isDeleting}
          title="Delete Property Record"
          message={`Are you sure you want to permanently delete "${itemToDelete?.name}"? All associated database entries and physical image files on disk will be removed immediately.`}
          confirmText="Yes, Delete Property"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPropertyListPage;
