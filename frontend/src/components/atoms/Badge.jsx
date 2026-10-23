import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    neutral: 'bg-surface-100 text-surface-700 border border-surface-200',
    brand: 'bg-brand-50 text-brand-700 border border-brand-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    admin: 'bg-gold-50 text-gold-800 border border-gold-300/60 font-semibold',
    gold: 'bg-gold-500/10 text-gold-700 border border-gold-400/40 font-semibold',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
