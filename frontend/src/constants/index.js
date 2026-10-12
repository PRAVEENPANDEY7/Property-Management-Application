// API constants and application configuration
const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '' : 'https://property-management-application.onrender.com');
// Strip trailing slash and trailing /api to guarantee no duplicate /api/api path segments
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '');

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  ROLE_USER: 'ROLE_USER',
  ROLE_ADMIN: 'ROLE_ADMIN',
};

export const STORAGE_KEYS = {
  TOKEN: 'haven_estate_token',
  USER: 'haven_estate_user',
  GEO_CITY: 'haven_estate_geo_city',
  GEO_PROMPTED: 'haven_estate_geo_prompted',
};

export const GEOCODING = {
  NOMINATIM_URL: 'https://nominatim.openstreetmap.org/reverse',
  PROVIDER: import.meta.env.VITE_GEOCODING_PROVIDER || 'nominatim',
  API_KEY: import.meta.env.VITE_GEOCODING_API_KEY || '',
};

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 9,
  ADMIN_PAGE_SIZE: 10,
};
