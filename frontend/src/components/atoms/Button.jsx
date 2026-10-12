import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-soft focus:ring-brand-500',
    secondary: 'bg-surface-100 hover:bg-surface-200 text-surface-900 focus:ring-surface-300',
    outline: 'border border-surface-300 bg-transparent hover:bg-surface-50 text-surface-700 focus:ring-brand-500',
    ghost: 'bg-transparent hover:bg-surface-100 text-surface-600 hover:text-surface-900 focus:ring-surface-300',
    danger: 'bg-accent-rose hover:bg-rose-600 text-white shadow-soft focus:ring-rose-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
