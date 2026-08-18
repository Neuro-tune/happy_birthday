import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PhotoCard from './PhotoCard';

gsap.registerPlugin(ScrollTrigger);

const PHOTOS = [
  {
    src: '/images/1.webp',
    quote: 'Пусть каждый день будет наполнен эстетикой, вдохновением и тонким чувством прекрасного.',
  },
  {
    src: '/images/2.webp',
    quote: 'Желаем открывать самые красивые уголки мира, находить яркие впечатления и мечтать без границ.',
  },
  {
    src: '/images/3.webp',
    quote: 'Уверенности в каждом шаге, лёгкости и энергии для покорения любых новых вершин.',
  },
  {
    src: '/images/4.webp',
    quote: 'Пусть жизнь всегда окружает тебя вниманием, уютом, искренними людьми и теплом.',
  },
  {
    src: '/images/5.webp',
    quote: 'С днем рождения! Пусть этот новый год жизни станет временем твоих самых красивых и ярких побед.',
  },
  {
    src: '/images/6.webp',
    quote: 'Гармонии, внутреннего света и умения искренне наслаждаться каждым моментом.',
  },
  {
    src: '/images/7.webp',
    quote: 'Пусть жизнь будет полна романтики, вдохновляющих прогулок и незабываемых историй.',
  },
];

export default function Screen2Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Mouse drag & touch tracking refs
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const isMouseDown = useRef(false);
  const mouseStartX = useRef(0);

  // Responsive detector
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Title entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PHOTOS.length);
  }, []);

  // Circular offset calculation for 3D carousel
  const getOffset = useCallback((index: number, active: number, total: number) => {
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch event handlers (strictly non-blocking for vertical scrolling)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isHorizontalSwipe.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartPos.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - touchStartPos.current.x;
    const deltaY = e.touches[0].clientY - touchStartPos.current.y;

    if (isHorizontalSwipe.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartPos.current || e.changedTouches.length !== 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartPos.current.x;

    if (isHorizontalSwipe.current) {
      if (deltaX < -30) handleNext();
      else if (deltaX > 30) handlePrev();
    }

    touchStartPos.current = null;
    isHorizontalSwipe.current = null;
  };

  // Mouse drag support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    const diff = e.clientX - mouseStartX.current;
    if (diff < -40) handleNext();
    else if (diff > 40) handlePrev();
  };

  const activePhoto = PHOTOS[activeIndex];

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        padding: 'clamp(60px, 8vw, 90px) clamp(16px, 4vw, 60px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section header: Clean and strictly without '3D GALLERY' */}
      <div
        ref={titleRef}
        style={{
          textAlign: 'center',
          marginBottom: 'clamp(30px, 5vw, 48px)',
          opacity: 0,
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(32px, 5.5vw, 60px)',
            fontWeight: '300',
            color: '#FAF7F2',
            letterSpacing: '-0.01em',
            lineHeight: '1.2',
            margin: 0,
          }}
        >
          Моменты,{' '}
          <span style={{ fontStyle: 'italic', color: '#C9A96E' }}>
            что вдохновляют
          </span>
        </h2>
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C9A96E, transparent)',
            margin: '18px auto 0',
          }}
        />
      </div>

      {/* 3D Carousel Stage */}
      <div
        className="carousel-stage"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          height: isMobile ? '420px' : '520px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrev}
          aria-label="Предыдущий кадр"
          style={{
            position: 'absolute',
            left: isMobile ? '4px' : '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 25,
            width: isMobile ? '38px' : '48px',
            height: isMobile ? '38px' : '48px',
            borderRadius: '50%',
            background: 'rgba(20, 16, 26, 0.75)',
            border: '1px solid rgba(201, 169, 110, 0.4)',
            color: '#E8D5A3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201, 169, 110, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.8)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(20, 16, 26, 0.75)';
            e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.4)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNext}
          aria-label="Следующий кадр"
          style={{
            position: 'absolute',
            right: isMobile ? '4px' : '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 25,
            width: isMobile ? '38px' : '48px',
            height: isMobile ? '38px' : '48px',
            borderRadius: '50%',
            background: 'rgba(20, 16, 26, 0.75)',
            border: '1px solid rgba(201, 169, 110, 0.4)',
            color: '#E8D5A3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201, 169, 110, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.8)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(20, 16, 26, 0.75)';
            e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.4)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* 7 3D Photo Cards */}
        {PHOTOS.map((photo, i) => {
          const offset = getOffset(i, activeIndex, PHOTOS.length);
          if (Math.abs(offset) > 2) return null;

          return (
            <PhotoCard
              key={i}
              src={photo.src}
              index={i}
              offset={offset}
              isActive={offset === 0}
              isMobile={isMobile}
              onClick={() => setActiveIndex(i)}
            />
          );
        })}
      </div>

      {/* Pure Wish Quote under Central Photo */}
      <div
        style={{
          maxWidth: '620px',
          margin: '10px auto 0',
          textAlign: 'center',
          minHeight: '75px',
        }}
      >
        <div key={activeIndex} className="caption-fade">
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(17px, 2.4vw, 22px)',
              lineHeight: '1.65',
              fontStyle: 'italic',
              color: '#FAF7F2',
              fontWeight: '300',
              margin: 0,
              letterSpacing: '0.01em',
            }}
          >
            «{activePhoto.quote}»
          </p>
        </div>
      </div>

      {/* Minimalist Pagination Dot Indicators */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '24px',
        }}
      >
        {PHOTOS.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Перейти к кадру ${i + 1}`}
              style={{
                width: isActive ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: isActive ? '#C9A96E' : 'rgba(255, 255, 255, 0.2)',
                border: isActive
                  ? '1px solid rgba(201, 169, 110, 0.8)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isActive ? '0 0 12px rgba(201, 169, 110, 0.5)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                padding: 0,
              }}
            />
          );
        })}
      </div>

      {/* Scroll indicator */}
      <div
        className="scroll-indicator"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          marginTop: '36px',
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(250,247,242,0.25)',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '36px',
            background: 'linear-gradient(to bottom, rgba(201,169,110,0.4), transparent)',
          }}
        />
      </div>
    </section>
  );
}
