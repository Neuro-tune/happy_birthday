import { useRef, useCallback } from 'react';

interface PhotoCardProps {
  src: string;
  index: number;
  offset: number;
  isActive: boolean;
  isMobile: boolean;
  onClick: () => void;
}

export default function PhotoCard({
  src,
  offset,
  isActive,
  isMobile,
  onClick,
}: PhotoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle mouse tilt for central active card on desktop
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isActive || isMobile || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;

      const baseZ = isMobile ? 40 : 80;
      cardRef.current.style.transform = `translate3d(0px, 0px, ${baseZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    },
    [isActive, isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isActive || isMobile || !cardRef.current) return;
    const baseZ = isMobile ? 40 : 80;
    cardRef.current.style.transform = `translate3d(0px, 0px, ${baseZ}px) rotateX(0deg) rotateY(0deg)`;
  }, [isActive, isMobile]);

  // 3D perspective with amplified contrast & depth
  const getTransformStyles = () => {
    const absOffset = Math.abs(offset);

    // Rotation angle: 22° on desktop, 16° on mobile
    const rotAngle = isMobile ? 16 : 24;
    const rotY = offset === 0 ? 0 : offset < 0 ? rotAngle : -rotAngle;

    // Translate Z depth
    const centralZ = isMobile ? 40 : 80;
    const sideZStep = isMobile ? 70 : 140;
    const translateZ = centralZ - absOffset * sideZStep;

    // Horizontal Spacing
    const spacing = isMobile ? 175 : 280;
    const translateX = offset * spacing;

    // Scale: Central 1.0 (no upscale = pixel-perfect), Sides 0.73, Distant 0.58
    let scale = 1.0;
    if (absOffset === 1) scale = 0.73;
    else if (absOffset >= 2) scale = 0.58;

    // Opacity: Central 1, Sides 0.5, Distant 0.25
    let opacity = 1.0;
    if (absOffset === 1) opacity = 0.5;
    else if (absOffset >= 2) opacity = 0.25;

    // Blur: Central 0, Sides 2px, Distant 4px
    let blur = 0;
    if (absOffset === 1) blur = 2;
    else if (absOffset >= 2) blur = 4;

    // Z-Index for proper layering
    const zIndex = 10 - absOffset;

    // Box shadow: Golden glow for active central, darker shadow for sides
    const boxShadow = isActive
      ? '0 20px 50px rgba(0,0,0,0.8), 0 0 35px rgba(212,175,55,0.2)'
      : '0 10px 30px rgba(0, 0, 0, 0.5)';

    // Clean luxury border
    const border = isActive
      ? '1px solid rgba(201, 169, 110, 0.85)'
      : '1px solid rgba(255, 255, 255, 0.1)';

    return {
      transform: `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotY}deg) scale(${scale})`,
      opacity,
      filter: blur > 0 ? `blur(${blur}px)` : 'none',
      zIndex,
      boxShadow,
      border,
    };
  };

  const styleProps = getTransformStyles();

  return (
    <div
      ref={cardRef}
      className="photo-card"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: isMobile ? 'clamp(240px, 68vw, 280px)' : '360px',
        height: isMobile ? 'clamp(330px, 85vw, 390px)' : '480px',
        marginLeft: isMobile
          ? 'calc(-1 * clamp(240px, 68vw, 280px) / 2)'
          : '-180px',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'rgba(20, 16, 26, 0.7)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        outline: '1px solid transparent',
        WebkitFontSmoothing: 'antialiased',
        transition:
          'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease, filter 0.6s ease, box-shadow 0.6s ease, border 0.6s ease',
        ...styleProps,
      }}
    >
      {/* Background photo - pure art object with NO overlay badges or counters */}
      <img
        src={src}
        alt="Moment"
        loading="eager"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)',
          outline: '1px solid transparent',
          imageRendering: 'high-quality',
        }}
      />

      {/* Subtle bottom glass gradient for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isActive
            ? 'linear-gradient(to top, rgba(13,11,15,0.4) 0%, transparent 60%)'
            : 'linear-gradient(to top, rgba(13,11,15,0.7) 0%, rgba(13,11,15,0.25) 60%)',
          zIndex: 1,
          transition: 'background 0.6s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
