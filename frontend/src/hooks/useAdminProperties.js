import { useState, useEffect, useCallback, useRef } from 'react';
import { propertyService } from '../services';
import { PAGINATION } from '../constants';

export function useAdminProperties() {
  const [properties, setProperties] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 0,
    pageSize: PAGINATION.ADMIN_PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    empty: true,
  });

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isMountedRef = useRef(true);

  const fetchAdminProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await propertyService.getAdminProperties({
        page,
        size: PAGINATION.ADMIN_PAGE_SIZE,
        search,
        city,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      if (isMountedRef.current && data) {
        setProperties(data.content || []);
        setPaginationMeta({
          currentPage: data.currentPage ?? 0,
          pageSize: data.pageSize ?? PAGINATION.ADMIN_PAGE_SIZE,
          totalElements: data.totalElements ?? 0,
          totalPages: data.totalPages ?? 0,
          first: data.first ?? true,
          last: data.last ?? true,
          empty: data.empty ?? true,
        });
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.response?.data?.message || err.message || 'Failed to load administrative listings');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [page, search, city]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchAdminProperties();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchAdminProperties]);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      await propertyService.deleteProperty(itemToDelete.id);
      setItemToDelete(null);
      await fetchAdminProperties();
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to delete property');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
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
    setSearch: (term) => {
      setSearch(term);
      setPage(0);
    },
    setCity: (c) => {
      setCity(c);
      setPage(0);
    },
    refresh: fetchAdminProperties,
  };
}

export default useAdminProperties;
