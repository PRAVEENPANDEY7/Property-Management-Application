import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth, useNotification } from '../../hooks';
import { AuthLayout } from '../../components/templates';
import { FormField } from '../../components/molecules';
import { Button, Alert } from '../../components/atoms';
import { validateRegister } from '../../validators';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { success, error: notifyError } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const { isValid, errors: validationErrors } = validateRegister(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      success('Account created successfully! Please sign in with your credentials.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed. Please check your information.';
      setSubmitError(message);
      notifyError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join HavenEstate to discover luxury homes, villas, and verified estates."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <Alert type="error" onDismiss={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        <FormField
          label="Full Name"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Jane Doe"
          required
          autoComplete="name"
          error={errors.fullName}
        />

        <FormField
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jane@example.com"
          required
          autoComplete="email"
          error={errors.email}
        />

        <FormField
          label="Password"
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Minimum 8 characters"
          required
          autoComplete="new-password"
          error={errors.password}
        />

        <FormField
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          required
          autoComplete="new-password"
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="w-full shadow-soft"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-surface-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
          Sign in here
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
