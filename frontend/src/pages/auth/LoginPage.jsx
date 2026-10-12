import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, KeyRound } from 'lucide-react';
import { useAuth, useNotification, useGeolocation } from '../../hooks';
import { AuthLayout } from '../../components/templates';
import { FormField } from '../../components/molecules';
import { Button, Alert } from '../../components/atoms';
import { validateLogin } from '../../validators';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success, error: notifyError } = useNotification();
  const { requestLocation, hasPrompted } = useGeolocation();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const { isValid, errors: validationErrors } = validateLogin({ email, password });
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      success(`Welcome back, ${user.fullName || user.email}!`);

      // Request geolocation if user hasn't answered the prompt yet
      if (!hasPrompted) {
        requestLocation().catch(() => {});
      }

      // Navigate to destination or default to properties
      const destination = location.state?.from?.pathname || '/properties';
      navigate(destination, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Invalid email or password';
      setSubmitError(message);
      notifyError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper buttons for testing demo accounts
  const fillDemoAdmin = () => {
    setEmail('admin@example.com');
    setPassword('AdminSecure123!');
    setErrors({});
    setSubmitError(null);
  };

  const fillDemoUser = () => {
    setEmail('jane@example.com');
    setPassword('SecurePassword123!');
    setErrors({});
    setSubmitError(null);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to browse exclusive properties and manage listings."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <Alert type="error" onDismiss={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        <FormField
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
          }}
          placeholder="name@example.com"
          required
          autoComplete="email"
          error={errors.email}
        />

        <FormField
          label="Password"
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
          }}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          error={errors.password}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="w-full shadow-soft"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </form>

      {/* Demo Credentials Section (Development only) */}
      {import.meta.env.DEV && (
        <div className="mt-6 pt-5 border-t border-surface-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-2.5 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-brand-600" /> Quick Demo Credentials (Dev Only):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-1.5 px-2.5 text-xs font-semibold rounded-xl border border-purple-200 bg-purple-50/70 text-purple-700 hover:bg-purple-100/70 transition-colors"
            >
              Fill Admin Credentials
            </button>
            <button
              type="button"
              onClick={fillDemoUser}
              className="py-1.5 px-2.5 text-xs font-semibold rounded-xl border border-surface-200 bg-surface-50 text-surface-700 hover:bg-surface-100 transition-colors"
            >
              Fill User Credentials
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-surface-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
