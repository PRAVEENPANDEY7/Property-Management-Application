import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BrandLogo Component displaying the official Housio emblem & typography.
 * The logo image already contains the emblem and 'Housio' wordmark,
 * avoiding duplicate text rendering.
 */
export const BrandLogo = ({
  size = 'md',
  theme = 'light',
  showTagline = false,
  linkTo = '/',
  className = '',
}) => {
  const sizeMap = {
    sm: { img: 'h-8 sm:h-9' },
    md: { img: 'h-9 sm:h-10' },
    lg: { img: 'h-12 sm:h-13' },
    xl: { img: 'h-14 sm:h-16' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Official Housio Emblem + Wordmark Image */}
      <img
        src="/housio-logo.png"
        alt="Housio — Find Your Exceptional"
        className={`${currentSize.img} w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm`}
      />

      {/* Optional Tagline separated by elegant divider */}
      {showTagline && (
        <span
          className={`hidden sm:inline-block text-[11px] font-semibold tracking-wider uppercase pl-3 border-l ${
            theme === 'dark' ? 'border-slate-700 text-gold-400' : 'border-surface-300 text-surface-500'
          }`}
        >
          Find Your Exceptional
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;

