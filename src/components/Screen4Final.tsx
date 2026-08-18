import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

// Curated luxury palette: gold, white, and pearlescent / iridescent tones
const LUXURY_PALETTE = [
  '#C9A96E', // Classic Satin Gold
  '#FFDF73', // Radiant Gold
  '#E8D5A3', // Champagne Sparkle
  '#D4AF37', // Metallic Gold
  '#FFFFFF', // Crisp White
  '#FAF7F2', // Pearl White
  '#F0E6D2', // Shimmer Pearl
  '#E8B4B8', // Pearl Rose
  '#C4B5FD', // Pearl Lavender
  '#FDF2F8', // Iridescent Pink
];

export default function Screen4Final() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [celebrating, setCelebrating] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);

  const hasAutoTriggeredRef = useRef(false);
  const autoTimerRef = useRef<number | null>(null);

  const fireGrandConfetti = (source: 'auto' | 'click' = 'auto') => {
    const isEncore = source === 'click';
    const scalarMult = isEncore ? 1.25 : 1.0;

    // 1. Central high-density burst
    confetti({
      particleCount: Math.round(90 * scalarMult),
      spread: 100,
      origin: { x: 0.5, y: 0.55 },
      colors: LUXURY_PALETTE,
      startVelocity: 38,
      gravity: 0.8,
      ticks: 240,
      shapes: ['circle', 'square'],
      scalar: 1.1,
    });

    // 2. Left side upward cannon (60 deg angle)
    setTimeout(() => {
      confetti({
        particleCount: Math.round(55 * scalarMult),
        angle: 60,
        spread: 65,
        origin: { x: 0.02, y: 0.72 },
        colors: LUXURY_PALETTE,
        startVelocity: 48,
        gravity: 0.75,
        ticks: 220,
        scalar: 1.0,
      });
    }, 180);

    // 3. Right side upward cannon (120 deg angle)
    setTimeout(() => {
      confetti({
        particleCount: Math.round(55 * scalarMult),
        angle: 120,
        spread: 65,
        origin: { x: 0.98, y: 0.72 },
        colors: LUXURY_PALETTE,
        startVelocity: 48,
        gravity: 0.75,
        ticks: 220,
        scalar: 1.0,
      });
    }, 180);

    // 4. Floating shimmer pearl & gold stars
    setTimeout(() => {
      const starShape = confetti.shapeFromText({ text: '✦', scalar: 2 });
      const sparkleShape = confetti.shapeFromText({ text: '✨', scalar: 2 });
      confetti({
        particleCount: 30,
        spread: 120,
        origin: { x: 0.5, y: 0.35 },
        shapes: [starShape, sparkleShape],
        colors: LUXURY_PALETTE,
        scalar: 1.6,
        gravity: 0.55,
        ticks: 280,
      });
    }, 400);

    // 5. Encore special extra fountain if triggered by click
    if (isEncore) {
      setTimeout(() => {
        confetti({
          particleCount: 45,
          spread: 140,
          origin: { x: 0.5, y: 0.2 },
          colors: LUXURY_PALETTE,
          startVelocity: 30,
          gravity: 0.65,
          ticks: 220,
        });
      }, 600);
    }
  };

  const triggerCelebration = (source: 'auto' | 'click' = 'click') => {
    setCelebrating(true);
    setHasLaunched(true);

    // Card pulse animation
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        keyframes: [
          { boxShadow: '0 0 60px rgba(201,169,110,0.6), 0 0 120px rgba(232,180,184,0.35)', duration: 0.3 },
          { boxShadow: '0 0 100px rgba(201,169,110,0.9), 0 0 200px rgba(232,180,184,0.5)', duration: 0.35 },
          { boxShadow: '0 0 60px rgba(201,169,110,0.5), 0 0 100px rgba(196,181,253,0.3)', duration: 0.4 },
        ],
        ease: 'power2.inOut',
        repeat: 2,
        yoyo: true,
        onComplete: () => setCelebrating(false),
      });
    }

    fireGrandConfetti(source);
  };

  useEffect(() => {
    const handleAutoTrigger = () => {
      if (hasAutoTriggeredRef.current) return;
      hasAutoTriggeredRef.current = true;

      // Exactly 700ms delay after scrolling into the Grand Wish section
      autoTimerRef.current = window.setTimeout(() => {
        triggerCelebration('auto');
      }, 700);
    };

    const ctx = gsap.context(() => {
      // Auto-confetti ScrollTrigger on Grand Wish section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: handleAutoTrigger,
      });

      // Section animations
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            once: true,
          }
        }
      );

      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
            once: true,
          }
        }
      );

      gsap.fromTo(textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            once: true,
          }
        }
      );

      gsap.fromTo(btnRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: btnRef.current,
            start: 'top 90%',
            once: true,
          }
        }
      );
    }, sectionRef);

    // Fallback IntersectionObserver in case of rapid scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleAutoTrigger();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      ctx.revert();
      observer.disconnect();
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, []);

  const handleEncoreClick = () => {
    triggerCelebration('click');
  };

  return (
    <section
      ref={sectionRef}
      id="grand-wish"
      className="screen-section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pulse when celebrating */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: celebrating
            ? 'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.14) 0%, rgba(232,180,184,0.06) 50%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)',
          transition: 'background 0.5s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Section header */}
      <div ref={titleRef} style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 56px)', opacity: 0 }}>
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.25em',
          color: '#C9A96E',
          textTransform: 'uppercase',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}>
          <span style={{ width: '30px', height: '1px', background: 'rgba(201,169,110,0.5)', display: 'inline-block' }} />
          GRAND WISH • 2026
          <span style={{ width: '30px', height: '1px', background: 'rgba(201,169,110,0.5)', display: 'inline-block' }} />
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(32px, 5vw, 58px)',
          fontWeight: '300',
          color: '#FAF7F2',
          lineHeight: '1.2',
        }}>
          Birthday{' '}
          <span style={{ fontStyle: 'italic', color: '#C9A96E' }}>Manifest</span>
        </h2>
      </div>

      {/* Main card */}
      <div
        ref={cardRef}
        style={{
          width: '100%',
          maxWidth: '720px',
          position: 'relative',
          opacity: 0,
        }}
      >
        {/* Outer glow */}
        <div
          className={hasLaunched ? 'pulse-glow' : ''}
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(201,169,110,0.45) 0%, rgba(232,180,184,0.35) 50%, rgba(196,181,253,0.35) 100%)',
            filter: 'blur(1px)',
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            borderRadius: '22px',
            background: 'linear-gradient(145deg, rgba(26,16,37,0.95) 0%, rgba(13,11,15,0.98) 100%)',
            padding: 'clamp(36px, 6vw, 60px)',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Top ornament */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '32px',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.4))' }} />
            <span style={{
              fontSize: '20px',
              color: '#C9A96E',
              filter: 'drop-shadow(0 0 8px rgba(201,169,110,0.6))',
            }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.4))' }} />
          </div>

          {/* Quote mark */}
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(60px, 10vw, 80px)',
            color: 'rgba(201,169,110,0.2)',
            lineHeight: '0.5',
            marginBottom: '16px',
            fontWeight: '700',
          }}>
            "
          </div>

          {/* Main wish text */}
          <p
            ref={textRef}
            style={{
              opacity: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: '300',
              fontStyle: 'italic',
              lineHeight: '1.8',
              color: '#FAF7F2',
              marginBottom: '28px',
            }}
          >
            Пусть этот год откроет новые горизонты, принесет бесконечный поток вдохновения, гармонии и самых яр[...]
          </p>

          {/* Divider */}
          <div style={{
            width: '80px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C9A96E, transparent)',
            margin: '0 auto 24px',
          }} />

          {/* Subtext */}
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(12px, 1.8vw, 14px)',
            fontWeight: '400',
            letterSpacing: '0.08em',
            color: 'rgba(232,213,163,0.7)',
            marginBottom: '36px',
            textTransform: 'uppercase',
          }}>
            С наилучшими пожеланиями в твой особенный день!
          </p>

          {/* Encore Confetti Button */}
          <button
            ref={btnRef}
            onClick={handleEncoreClick}
            className="btn-glossy"
            style={{
              opacity: 0,
              padding: '18px 48px',
              fontSize: 'clamp(13px, 2vw, 15px)',
              letterSpacing: '0.08em',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: '#0D0B0F',
              boxShadow: celebrating
                ? '0 0 45px rgba(201,169,110,0.65), 0 0 90px rgba(232,180,184,0.35)'
                : '0 8px 30px rgba(201,169,110,0.25)',
              transition: 'all 0.4s ease, transform 0.2s ease',
              fontWeight: '600',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span style={{ fontSize: '18px', filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.2))' }}>
              ✨
            </span>
            <span>✨ На бис! (Ещё искр)</span>
          </button>

          {/* Bottom ornament */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '36px',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.2))' }} />
            <div style={{
              display: 'flex',
              gap: '6px',
              color: 'rgba(201,169,110,0.35)',
              fontSize: '10px',
              letterSpacing: '4px',
            }}>
              ✦ ✦ ✦
            </div>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.2))' }} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: 'clamp(40px, 5vw, 60px)',
        maxWidth: '420px',
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(14px, 2.5vw, 18px)',
          fontStyle: 'italic',
          fontWeight: '300',
          color: 'rgba(250,247,242,0.4)',
          letterSpacing: '0.02em',
          lineHeight: '1.6',
        }}>
          Сделано с любовью и восхищением ✦
        </p>
      </div>
    </section>
  );
}
