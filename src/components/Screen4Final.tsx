import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

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
  const contentRef = useRef<HTMLDivElement>(null);

  const [celebrating, setCelebrating] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const hasAutoTriggeredRef = useRef(false);

  const fireGrandConfetti = (source: 'auto' | 'click' = 'auto') => {
    const isEncore = source === 'click';
    const scalarMult = isEncore ? 1.25 : 1.0;

    // 1. Центральный взрыв
    confetti({
      particleCount: Math.round(80 * scalarMult),
      spread: 90,
      origin: { x: 0.5, y: 0.5 },
      colors: LUXURY_PALETTE,
      startVelocity: 35,
      gravity: 0.8,
      ticks: 220,
      shapes: ['circle', 'square'],
      scalar: 1.05,
    });

    // 2. Левый фейерверк
    setTimeout(() => {
      confetti({
        particleCount: Math.round(45 * scalarMult),
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.7 },
        colors: LUXURY_PALETTE,
        startVelocity: 42,
        gravity: 0.75,
        ticks: 200,
      });
    }, 150);

    // 3. Правый фейерверк
    setTimeout(() => {
      confetti({
        particleCount: Math.round(45 * scalarMult),
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.7 },
        colors: LUXURY_PALETTE,
        startVelocity: 42,
        gravity: 0.75,
        ticks: 200,
      });
    }, 150);

    // 4. Золотые искры и звезды
    setTimeout(() => {
      const starShape = confetti.shapeFromText({ text: '✦', scalar: 2 });
      const sparkleShape = confetti.shapeFromText({ text: '✨', scalar: 2 });
      confetti({
        particleCount: 25,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        shapes: [starShape, sparkleShape],
        colors: LUXURY_PALETTE,
        scalar: 1.5,
        gravity: 0.55,
        ticks: 240,
      });
    }, 350);
  };

  const triggerCelebration = (source: 'auto' | 'click' = 'click') => {
    setCelebrating(true);
    setHasLaunched(true);

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        keyframes: [
          { boxShadow: '0 0 40px rgba(201,169,110,0.6), 0 0 80px rgba(232,180,184,0.35)', duration: 0.25 },
          { boxShadow: '0 0 70px rgba(201,169,110,0.8), 0 0 140px rgba(232,180,184,0.45)', duration: 0.3 },
          { boxShadow: '0 0 30px rgba(201,169,110,0.4)', duration: 0.35 },
        ],
        ease: 'power2.inOut',
        onComplete: () => setCelebrating(false),
      });
    }

    fireGrandConfetti(source);
  };

  // Надежная анимация появления через IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoTriggeredRef.current) {
            hasAutoTriggeredRef.current = true;

            if (contentRef.current) {
              gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
              );
            }

            setTimeout(() => {
              triggerCelebration('auto');
            }, 500);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="grand-wish"
      className="screen-section"
      style={{
        minHeight: '100dvh',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Фоновый свет */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: celebrating
            ? 'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.15) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)',
          transition: 'background 0.5s ease',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={contentRef}
        style={{
          width: '100%',
          maxWidth: '520px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: 1, // Базово 1, чтобы не было черного экрана
        }}
      >
        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.25em',
              color: '#C9A96E',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            — ГЛАВНОЕ ПОЖЕЛАНИЕ —
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px, 6vw, 44px)',
              fontWeight: '300',
              color: '#FAF7F2',
              lineHeight: '1.15',
              margin: 0,
            }}
          >
            Сияй и{' '}
            <span style={{ fontStyle: 'italic', color: '#C9A96E' }}>вдохновляй</span>
          </h2>
        </div>

        {/* Главная карточка */}
        <div
          ref={cardRef}
          style={{
            width: '100%',
            position: 'relative',
            borderRadius: '22px',
            background: 'linear-gradient(145deg, rgba(26,16,37,0.92) 0%, rgba(13,11,15,0.96) 100%)',
            border: '1px solid rgba(201,169,110,0.3)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
            padding: '24px 20px',
            textAlign: 'center',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxSizing: 'border-box',
          }}
        >
          {/* Верхний орнамент */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3))' }} />
            <span style={{ fontSize: '16px', color: '#C9A96E' }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.3))' }} />
          </div>

          {/* Текст пожелания */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(17px, 3.4vw, 21px)',
              fontWeight: '300',
              fontStyle: 'italic',
              lineHeight: '1.55',
              color: '#FAF7F2',
              margin: '0 0 16px 0',
              padding: '0 4px',
            }}
          >
            «Пусть этот год откроет новые горизонты, принесет бесконечный поток вдохновения, гармонии и самых ярких событий. Сияй, мечтай и наслаждайся каждым моментом!»
          </p>

          {/* Разделитель */}
          <div
            style={{
              width: '50px',
              height: '1px',
              background: 'linear-gradient(to right, transparent, #C9A96E, transparent)',
              margin: '0 auto 14px',
            }}
          />

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'rgba(232,213,163,0.7)',
              textTransform: 'uppercase',
              margin: '0 0 18px 0',
            }}
          >
            С наилучшими пожеланиями в твой день!
          </p>

          {/* Кнопка салюта */}
          <button
            onClick={() => triggerCelebration('click')}
            style={{
              padding: '13px 32px',
              fontSize: '12px',
              letterSpacing: '0.1em',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: '600',
              color: '#0D0B0F',
              background: 'linear-gradient(135deg, #FFDF73 0%, #FFD700 50%, #C9A96E 100%)',
              boxShadow: celebrating
                ? '0 0 35px rgba(201,169,110,0.8)'
                : '0 4px 20px rgba(201,169,110,0.3)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✨</span>
            <span>Запустить салют!</span>
          </button>
        </div>

        {/* Футер */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '14px',
              fontStyle: 'italic',
              color: 'rgba(250,247,242,0.4)',
              margin: 0,
            }}
          >
            Сделано с уважением и восхищением ✦
          </p>
        </div>
      </div>
    </section>
  );
          }
                         
