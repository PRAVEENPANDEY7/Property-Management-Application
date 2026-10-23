import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BrandLogo Component displaying the official Housio emblem & typography.
 * Supports light/dark themes and responsive sizes.
 */
export const BrandLogo = ({
  size = 'md',
  theme = 'light',
  showTagline = false,
  linkTo = '/properties',
  className = '',
}) => {
  const sizeMap = {
    sm: { img: 'h-8', text: 'text-lg', mark: 'h-7 w-7' },
    md: { img: 'h-9 sm:h-10', text: 'text-xl sm:text-2xl', mark: 'h-9 w-9' },
    lg: { img: 'h-12 sm:h-14', text: 'text-2xl sm:text-3xl', mark: 'h-12 w-12' },
    xl: { img: 'h-16 sm:h-20', text: 'text-4xl', mark: 'h-16 w-16' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Official Housio Vector Emblem */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <img
          src="/housio-logo.png"
          alt="Housio Logo"
          className={`${currentSize.img} w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm`}
        />
      </div>

      {/* Wordmark & Optional Tagline */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center">
          <span
            className={`font-black tracking-tight ${currentSize.text} ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Hous<span className="text-gold-500 font-extrabold">io</span>
          </span>
        </div>

        {showTagline && (
          <span
            className={`text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${
              theme === 'dark' ? 'text-gold-400' : 'text-slate-500'
            }`}
          >
            Find Your Exceptional
          </span>
        )}
      </div>
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
