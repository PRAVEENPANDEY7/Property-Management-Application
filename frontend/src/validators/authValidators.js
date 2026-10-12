/**
 * Validation rules for authentication forms
 */

export function validateLogin({ email, password }) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRegister({ fullName, email, password, confirmPassword }) {
  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  } else if (fullName.trim().length > 100) {
    errors.fullName = 'Full name must not exceed 100 characters';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
