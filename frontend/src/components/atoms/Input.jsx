import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  hasError = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-2.5 rounded-xl border text-sm text-surface-900 placeholder:text-surface-400 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed';

  const stateClasses = hasError
    ? 'border-accent-rose focus:border-accent-rose focus:ring-rose-200'
    : 'border-surface-200 hover:border-surface-300 focus:border-brand-500 focus:ring-brand-100';

  return (
    <input
      ref={ref}
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses} ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
