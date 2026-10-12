import React, { createContext, useState, useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '../constants';
import { getCoordinates, reverseGeocodeToCity } from '../utils/geolocation';

export const GeolocationContext = createContext(null);

export function GeolocationProvider({ children }) {
  const [detectedCity, setDetectedCity] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.GEO_CITY) || '';
  });
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [hasPrompted, setHasPrompted] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEYS.GEO_PROMPTED) === 'true';
  });

  const requestLocation = useCallback(async () => {
    setIsLocating(true);
    setGeoError(null);
    sessionStorage.setItem(STORAGE_KEYS.GEO_PROMPTED, 'true');
    setHasPrompted(true);

    try {
      const coords = await getCoordinates();
      const city = await reverseGeocodeToCity(coords.latitude, coords.longitude);
      if (city) {
        setDetectedCity(city);
        localStorage.setItem(STORAGE_KEYS.GEO_CITY, city);
        return city;
      }
    } catch (err) {
      console.warn('Geolocation resolution failed:', err.message);
      setGeoError(err.message || 'Location unavailable');
      return null;
    } finally {
      setIsLocating(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setDetectedCity('');
    setGeoError(null);
    localStorage.removeItem(STORAGE_KEYS.GEO_CITY);
  }, []);

  const dismissPrompt = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEYS.GEO_PROMPTED, 'true');
    setHasPrompted(true);
  }, []);

  const value = useMemo(
    () => ({
      detectedCity,
      isLocating,
      geoError,
      hasPrompted,
      requestLocation,
      clearLocation,
      dismissPrompt,
    }),
    [detectedCity, isLocating, geoError, hasPrompted, requestLocation, clearLocation, dismissPrompt]
  );

  return <GeolocationContext.Provider value={value}>{children}</GeolocationContext.Provider>;
}

export default GeolocationContext;
