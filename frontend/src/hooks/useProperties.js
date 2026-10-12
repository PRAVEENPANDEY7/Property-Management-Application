import { useState, useEffect, useCallback, useRef } from 'react';
import { propertyService } from '../services';
import { PAGINATION } from '../constants';

export function useProperties(initialCity = '') {
  const [properties, setProperties] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 0,
    pageSize: PAGINATION.DEFAULT_SIZE,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    empty: true,
  });

  const [page, setPage] = useState(0);
  const [city, setCity] = useState(initialCity);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  // Sync initial city if it updates externally (e.g. from geolocation detection)
  useEffect(() => {
    if (initialCity !== undefined) {
      setCity(initialCity);
      setPage(0);
    }
  }, [initialCity]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await propertyService.getPublicProperties({
        page,
        size: PAGINATION.DEFAULT_SIZE,
        city,
        search,
        sortBy,
        sortDir,
      });

      if (isMountedRef.current && data) {
        setProperties(data.content || []);
        setPaginationMeta({
          currentPage: data.currentPage ?? 0,
          pageSize: data.pageSize ?? PAGINATION.DEFAULT_SIZE,
          totalElements: data.totalElements ?? 0,
          totalPages: data.totalPages ?? 0,
          first: data.first ?? true,
          last: data.last ?? true,
          empty: data.empty ?? true,
        });
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error('Failed to fetch properties:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load properties. Please try again.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [page, city, search, sortBy, sortDir]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchProperties();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchProperties]);

  const handleSearchChange = (keyword) => {
    setSearch(keyword);
    setPage(0);
  };

  const handleCityChange = (newCity) => {
    setCity(newCity);
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < paginationMeta.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSortChange = (newSortBy, newSortDir = 'desc') => {
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setPage(0);
  };

  return {
    properties,
    paginationMeta,
    page,
    city,
    search,
    sortBy,
    sortDir,
    loading,
    error,
    setCity: handleCityChange,
    setSearch: handleSearchChange,
    setPage: handlePageChange,
    setSort: handleSortChange,
    retry: fetchProperties,
  };
}

export default useProperties;
