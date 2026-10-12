import { describe, it, expect } from 'vitest';
import { validateLogin, validateRegister, validateProperty } from '../validators';

describe('Authentication Form Validators', () => {
  it('should invalidate empty login credentials', () => {
    const res = validateLogin({ email: '', password: '' });
    expect(res.isValid).toBe(false);
    expect(res.errors.email).toBeDefined();
    expect(res.errors.password).toBeDefined();
  });

  it('should invalidate malformed email address in login', () => {
    const res = validateLogin({ email: 'not-an-email', password: 'password123' });
    expect(res.isValid).toBe(false);
    expect(res.errors.email).toContain('valid email');
  });

  it('should invalidate password shorter than 6 characters in login', () => {
    const res = validateLogin({ email: 'user@example.com', password: '123' });
    expect(res.isValid).toBe(false);
    expect(res.errors.password).toBeDefined();
  });

  it('should validate valid login credentials', () => {
    const res = validateLogin({ email: 'admin@example.com', password: 'AdminPassword123!' });
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it('should invalidate registration with mismatched passwords', () => {
    const res = validateRegister({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password123!',
      confirmPassword: 'MismatchPassword123!',
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.confirmPassword).toContain('do not match');
  });

  it('should validate valid registration values', () => {
    const res = validateRegister({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(res.isValid).toBe(true);
  });
});

describe('Property Form Validators', () => {
  it('should invalidate empty property fields on create', () => {
    const res = validateProperty({
      name: '',
      description: '',
      price: '',
      location: '',
      city: '',
      images: [],
    }, true);

    expect(res.isValid).toBe(false);
    expect(res.errors.name).toBeDefined();
    expect(res.errors.description).toBeDefined();
    expect(res.errors.price).toBeDefined();
    expect(res.errors.location).toBeDefined();
    expect(res.errors.city).toBeDefined();
    expect(res.errors.images).toBeDefined();
  });

  it('should invalidate non-positive or negative prices', () => {
    const res = validateProperty({
      name: 'Modern Villa',
      description: 'Long enough luxury description of the villa layout',
      price: -500,
      location: '100 Ocean Dr',
      city: 'Miami',
      images: [new File([], 'img.jpg')],
    }, true);

    expect(res.isValid).toBe(false);
    expect(res.errors.price).toContain('positive number');
  });

  it('should validate valid property creation inputs', () => {
    const res = validateProperty({
      name: 'Sunset Penthouse',
      description: 'High-end penthouse overlooking the bay with private rooftop infinity pool.',
      price: 1850000.00,
      location: '500 Brickell Ave',
      city: 'Miami',
      images: [new File([], 'photo.jpg')],
    }, true);

    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });
});
