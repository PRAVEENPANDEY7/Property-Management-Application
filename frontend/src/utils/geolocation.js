import axios from 'axios';
import { GEOCODING } from '../constants';

/**
 * Request device geolocation coordinates via browser navigator API.
 * @param {number} timeoutMs
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export function getCoordinates(timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let msg = 'Unable to retrieve location';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: false,
        timeout: timeoutMs,
        maximumAge: 600000, // 10 minutes cache
      }
    );
  });
}

/**
 * Reverse geocode latitude and longitude to a city name using OpenStreetMap Nominatim or configured provider.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<string>}
 */
export async function reverseGeocodeToCity(lat, lon) {
  try {
    const url = `${GEOCODING.NOMINATIM_URL}?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'Accept-Language': 'en',
      },
    });

    const addr = response.data?.address;
    if (!addr) {
      throw new Error('No address information returned from geocoder');
    }

    // Resolving city, town, village, or municipality
    const resolvedCity = addr.city || addr.town || addr.municipality || addr.village || addr.county || '';
    if (!resolvedCity) {
      throw new Error('Could not identify a city from current coordinates');
    }

    return resolvedCity;
  } catch (error) {
    console.warn('Reverse geocoding error:', error.message);
    throw error;
  }
}
