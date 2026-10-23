import React from 'react';

/**
 * Marquee component inspired by Magic UI (magicuidesign/magicui) and 21st.dev.
 * Creates an infinitely scrolling marquee with pause-on-hover and seamless loop.
 */
export const Marquee = ({
  children,
  className = '',
  reverse = false,
  pauseOnHover = true,
  vertical = false,
  repeat = 4,
  duration = '35s',
  ...props
}) => {
  return (
    <div
      {...props}
      style={{ '--duration': duration, '--gap': '2rem' }}
      className={`group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] ${
        vertical ? 'flex-col' : 'flex-row'
      } ${className}`}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`flex shrink-0 justify-around [gap:var(--gap)] ${
              vertical
                ? 'animate-marquee-vertical flex-col'
                : 'animate-marquee flex-row'
            } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''} ${
              reverse ? '[animation-direction:reverse]' : ''
            }`}
          >
            {children}
          </div>
        ))}
    </div>
  );
};

export default Marquee;
