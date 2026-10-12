/**
 * Validation rules for Property creation and editing
 */

export function validateProperty({ name, description, price, location, city, images }, isNew = true) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Property title is required';
  } else if (name.trim().length < 2 || name.trim().length > 150) {
    errors.name = 'Property title must be between 2 and 150 characters';
  }

  if (!description || !description.trim()) {
    errors.description = 'Description is required';
  } else if (description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  } else if (description.trim().length > 4000) {
    errors.description = 'Description cannot exceed 4000 characters';
  }

  if (price === undefined || price === null || price === '') {
    errors.price = 'Price is required';
  } else {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      errors.price = 'Price must be a positive number greater than 0';
    } else if (numPrice > 9999999999.99) {
      errors.price = 'Price exceeds maximum allowed limit';
    }
  }

  if (!location || !location.trim()) {
    errors.location = 'Address / Location is required';
  } else if (location.trim().length < 3 || location.trim().length > 255) {
    errors.location = 'Location must be between 3 and 255 characters';
  }

  if (!city || !city.trim()) {
    errors.city = 'City is required';
  } else if (city.trim().length < 2 || city.trim().length > 100) {
    errors.city = 'City must be between 2 and 100 characters';
  }

  if (isNew && (!images || images.length === 0)) {
    errors.images = 'At least one property image is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
