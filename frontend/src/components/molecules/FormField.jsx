import React from 'react';
import { Label, Input } from '../atoms';

export const FormField = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  helperText,
  as = 'input',
  rows = 4,
  className = '',
  ...props
}) => {
  const fieldId = id || name;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}

      {as === 'textarea' ? (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-surface-900 placeholder:text-surface-400 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed ${
            error
              ? 'border-accent-rose focus:border-accent-rose focus:ring-rose-200'
              : 'border-surface-200 hover:border-surface-300 focus:border-brand-500 focus:ring-brand-100'
          }`}
          {...props}
        />
      ) : (
        <Input
          type={type}
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          hasError={Boolean(error)}
          disabled={disabled}
          {...props}
        />
      )}

      {error ? (
        <p className="text-xs text-accent-rose font-medium pt-0.5" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-surface-500 pt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormField;
