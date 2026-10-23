import React, { useRef, useState } from 'react';

/**
 * Perspective3DCard component inspired by Aceternity 3D Card and 21st.dev.
 * Creates an ultra-smooth physical 3D tilt response as the mouse moves over the card.
 */
export const Perspective3DCard = ({
  children,
  className = '',
  maxRotation = 8,
  scale = 1.02,
  ...props
}) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxRotation;
    const rotateY = ((x - centerX) / centerX) * maxRotation;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      className="perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        ref={cardRef}
        style={{
          transform: isHovered
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${scale}, ${scale}, ${scale})`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        className={`transform-style-3d relative w-full h-full ${className}`}
      >
        {children}

        {/* Ambient Gloss Highlight on 3D Tilt */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl z-30 transition-opacity duration-300 opacity-40 mix-blend-overlay"
            style={{
              background: `linear-gradient(${rotation.y * 12 + 135}deg, rgba(255, 255, 255, 0.4) 0%, rgba(197, 155, 82, 0.2) 50%, transparent 80%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Perspective3DCard;
