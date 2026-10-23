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
    primary: 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white shadow-soft focus:ring-brand-500 active:scale-[0.98]',
    secondary: 'bg-surface-100 hover:bg-surface-200 text-surface-900 focus:ring-surface-300 active:scale-[0.98]',
    outline: 'border border-surface-300 bg-transparent hover:bg-surface-50 text-surface-700 focus:ring-brand-500 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-surface-100 text-surface-600 hover:text-surface-900 focus:ring-surface-300',
    danger: 'bg-accent-rose hover:bg-rose-600 text-white shadow-soft focus:ring-rose-400',
    gold: 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-slate-950 font-bold hover:shadow-gold-glow hover:brightness-105 active:scale-[0.98] focus:ring-gold-400',
    goldOutline: 'border border-gold-400/50 text-gold-400 hover:bg-gold-500/10 hover:border-gold-300 font-semibold focus:ring-gold-400 active:scale-[0.98]',
    glass: 'bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-soft active:scale-[0.98] focus:ring-white/40',
    dark: 'bg-slate-950 hover:bg-slate-900 text-white border border-slate-800 shadow-soft active:scale-[0.98] focus:ring-slate-700',
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
