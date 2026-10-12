import React from 'react';

export const Label = ({
  children,
  htmlFor,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-semibold uppercase tracking-wider text-surface-700 mb-1.5 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-accent-rose ml-1" aria-hidden="true">*</span>}
    </label>
  );
};

export default Label;
