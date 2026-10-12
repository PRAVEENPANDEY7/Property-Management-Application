import { useState, useEffect } from 'react';
import { propertyService } from '../services';

export function usePropertyDetail(id) {
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProperty() {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const data = await propertyService.getPropertyById(id);
        if (isMounted && data) {
          setProperty(data);
          // Set initial primary image or first available image
          if (data.images && data.images.length > 0) {
            const primary = data.images.find((img) => img.isPrimary) || data.images[0];
            setActiveImage(primary);
          } else {
            setActiveImage(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Property not found or unavailable');
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

  return {
    property,
    activeImage,
    setActiveImage,
    loading,
    error,
  };
}

export default usePropertyDetail;
