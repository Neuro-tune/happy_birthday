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
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
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

  // Touch event handlers
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
      className="screen-section"
      style={{
        padding: isMobile
          ? '16px 12px 14px'
          : 'clamp(50px, 6vw, 80px) clamp(16px, 4vw, 60px)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isMobile ? 'space-between' : 'flex-start',
        boxSizing: 'border-box',
      }}
    >
      {/* Section Header */}
      <div
        ref={titleRef}
        style={{
          textAlign: 'center',
          marginBottom: isMobile ? '8px' : '36px',
          padding: isMobile ? '0 50px' : '0', // Защитный отступ от кнопки звука справа
          opacity: 0,
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? '26px' : 'clamp(32px, 5.5vw, 60px)',
            fontWeight: '300',
            color: '#FAF7F2',
            letterSpacing: '-0.01em',
            lineHeight: isMobile ? '1.1' : '1.2',
            margin: 0,
          }}
        >
          Моменты,
          <span
            style={{
              display: isMobile ? 'block' : 'inline', // На мобилке переносит на новую строку
              fontStyle: 'italic',
              color: '#C9A96E',
              marginTop: isMobile ? '2px' : '0',
            }}
          >
            {' '}что вдохновляют
          </span>
        </h2>
        <div
          style={{
            width: '45px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C9A96E, transparent)',
            margin: isMobile ? '6px auto 0' : '16px auto 0',
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
          height: isMobile ? '46vh' : '520px',
          minHeight: isMobile ? '290px' : '480px',
          maxHeight: isMobile ? '380px' : '620px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrev}
          aria-label="Предыдущий кадр"
          style={{
            position: 'absolute',
            left: isMobile ? '2px' : '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 25,
            width: isMobile ? '34px' : '48px',
            height: isMobile ? '34px' : '48px',
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
        >
        ... (truncated for brevity)