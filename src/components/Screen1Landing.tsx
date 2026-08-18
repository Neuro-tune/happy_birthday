import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SparkleOrbs from './SparkleOrbs';

interface Screen1Props {
  onStart: () => void;
}

export default function Screen1Landing({ onStart }: Screen1Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      labelRef.current,
      { opacity: 0, y: -20, letterSpacing: '0.35em' },
      { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        btnRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
        '-=0.4'
      )
      .fromTo(
        footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.2'
      );
  }, []);

  const handleStart = () => {
    // Call onStart immediately for smooth crossfade with main content
    onStart();

    // Animate own exit (Landing fades out while Main fades in)
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.03,
      duration: 1.0,
      ease: 'power2.inOut',
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      {/* Soft Aurora radial backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 25% 30%, rgba(88,28,135,0.28) 0%, transparent 60%), radial-gradient(ellipse at 75% 70%, rgba(201,169,110,0.16) 0%, transparent 60%), radial-gradient(ellipse at 50% 50%, rgba(13,11,15,0.7) 0%, rgba(10,10,15,0.98) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative vertical lines */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.4), transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.4), transparent)',
        }}
      />

      {/* Decorative corner ornaments */}
      <div style={{ position: 'absolute', top: '30px', left: '30px', opacity: 0.25 }}>
        <div style={{ width: '40px', height: '1px', background: '#C9A96E', marginBottom: '6px' }} />
        <div style={{ width: '1px', height: '40px', background: '#C9A96E' }} />
      </div>
      <div style={{ position: 'absolute', top: '30px', right: '30px', opacity: 0.25 }}>
        <div style={{ width: '40px', height: '1px', background: '#C9A96E', marginBottom: '6px', marginLeft: 'auto' }} />
        <div style={{ width: '1px', height: '40px', background: '#C9A96E', marginLeft: 'auto' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '30px', left: '30px', opacity: 0.25 }}>
        <div style={{ width: '1px', height: '40px', background: '#C9A96E', marginBottom: '6px' }} />
        <div style={{ width: '40px', height: '1px', background: '#C9A96E' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '30px', right: '30px', opacity: 0.25 }}>
        <div style={{ width: '1px', height: '40px', background: '#C9A96E', marginBottom: '6px', marginLeft: 'auto' }} />
        <div style={{ width: '40px', height: '1px', background: '#C9A96E', marginLeft: 'auto' }} />
      </div>

      {/* Sparkle orbs */}
      <SparkleOrbs />

      {/* Main Content */}
      <div style={{ maxWidth: '720px', width: '100%', position: 'relative', zIndex: 2 }}>
        {/* Top Label: — SPECIAL DAY — */}
        <div
          ref={labelRef}
          style={{
            opacity: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(10px, 2vw, 12px)',
            fontWeight: '500',
            letterSpacing: '0.25em',
            color: '#C9A96E',
            textTransform: 'uppercase',
            marginBottom: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
          }}
        >
          <span style={{ display: 'inline-block', width: '32px', height: '1px', background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
          — SPECIAL DAY —
          <span style={{ display: 'inline-block', width: '32px', height: '1px', background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
        </div>

        {/* Main Heading: «День, когда всё вращается вокруг тебя» */}
        <h1
          ref={headingRef}
          style={{
            opacity: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(36px, 6.8vw, 76px)',
            fontWeight: '300',
            lineHeight: '1.15',
            color: '#FAF7F2',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}
        >
          День, когда всё
          <br />
          <span
            style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5A3 45%, #E8B4B8 75%, #C9A96E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            вращается вокруг тебя
          </span>
        </h1>

        {/* Divider */}
        <div
          style={{
            width: '80px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C9A96E, transparent)',
            margin: '0 auto 24px',
          }}
        />

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            opacity: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(14px, 2.2vw, 17px)',
            fontWeight: '300',
            lineHeight: '1.7',
            color: 'rgba(250,247,242,0.7)',
            maxWidth: '520px',
            margin: '0 auto 46px',
          }}
        >
          Немного магии, музыки и лучших моментов в одном месте.
        </p>

        {/* CTA Button: ✦ Начать просмотр */}
        <button
          ref={btnRef}
          onClick={handleStart}
          className="btn-glossy"
          style={{
            opacity: 0,
            padding: '18px 48px',
            fontSize: 'clamp(13px, 2vw, 15px)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: '600',
            color: '#0D0B0F',
          }}
        >
          <span style={{ fontSize: '16px' }}>✦</span>
          Начать просмотр
        </button>
      </div>

      {/* Footer note: 🔊 Включите звук для атмосферы */}
      <div
        ref={footerRef}
        style={{
          opacity: 0,
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '12px',
          color: 'rgba(250,247,242,0.4)',
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '14px' }}>🔊</span>
        Включите звук для атмосферы
      </div>
    </div>
  );
}
