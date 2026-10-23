import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, KeyRound, Eye, EyeOff } from 'lucide-react';
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

  const [showPassword, setShowPassword] = useState(false);

  // Helper buttons for testing demo accounts
  const fillDemoAdmin = (chosenEmail = 'praveen@admin.com') => {
    setEmail(chosenEmail);
    setPassword('praveen@1234');
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

        <div>
          <label htmlFor="password" className="block text-xs font-bold text-surface-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-surface-900 bg-white transition-all duration-200 focus:outline-none focus:ring-2 pr-10 ${
                errors.password
                  ? 'border-accent-rose focus:ring-rose-200'
                  : 'border-surface-200 hover:border-surface-300 focus:border-brand-500 focus:ring-brand-100'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-surface-400 hover:text-surface-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-accent-rose font-medium pt-1" role="alert">
              {errors.password}
            </p>
          )}
        </div>

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
              onClick={() => fillDemoAdmin('praveen@admin.com')}
              className="py-1.5 px-2.5 text-xs font-semibold rounded-xl border border-gold-300/60 bg-gold-50/70 text-gold-800 hover:bg-gold-100/70 transition-colors"
            >
              Fill Admin Creds
            </button>
            <button
              type="button"
              onClick={fillDemoUser}
              className="py-1.5 px-2.5 text-xs font-semibold rounded-xl border border-surface-200 bg-surface-50 text-surface-700 hover:bg-surface-100 transition-colors"
            >
              Fill User Creds
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
