import React from 'react';

/**
 * BorderBeam component inspired by Magic UI (magicuidesign/magicui) and 21st.dev.
 * Renders an animated traveling beam of light around the container border.
 */
export const BorderBeam = ({
  className = '',
  size = 200,
  duration = 12,
  borderWidth = 1.5,
  colorFrom = '#c59b52',
  colorTo = '#116e65',
  delay = 0,
}) => {
  return (
    <div
      style={{
        '--size': `${size}px`,
        '--duration': `${duration}s`,
        '--delay': `-${delay}s`,
        '--border-width': `${borderWidth}px`,
        '--color-from': colorFrom,
        '--color-to': colorTo,
      }}
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-[borderBeam_var(--duration)_linear_infinite] after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--size)*0.5px)_50%] after:[offset-path:rect(0_auto_auto_0_round_inherit)] ${className}`}
    />
  );
};

export default BorderBeam;
