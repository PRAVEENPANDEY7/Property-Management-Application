import React from 'react';
import { formatCurrency } from '../../utils';

export const PropertyPrice = ({
  price,
  size = 'md',
  className = '',
}) => {
  const formatted = formatCurrency(price);

  const sizes = {
    sm: 'text-base font-bold text-brand-700',
    md: 'text-xl font-extrabold text-brand-700 tracking-tight',
    lg: 'text-3xl font-extrabold text-brand-700 tracking-tight',
  };

  return (
    <div className={`inline-flex items-baseline gap-1 ${sizes[size]} ${className}`}>
      <span>{formatted}</span>
    </div>
  );
};

export default PropertyPrice;
