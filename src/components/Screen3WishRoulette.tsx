import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

const WISHES = [
  "Безупречного вкуса и тонкого чувства прекрасного во всём ✨",
  "Пусть каждый день начинается с вдохновения и искренней улыбки ☕",
  "Исполнения самых смелых целей и амбициозных планов 🚀",
  "Ярких путешествий, новых городов и незабываемых панорам ✈️",
  "Бесконечного потока творческой энергии и гармонии 🌿",
  "Пусть удача сопутствует в каждом новом начинании 💫",
  "Легкости в принятии решений и кайфа от каждого прожитого момента 🥂",
  "Уютных вечеров, теплых встреч и искренних людей рядом 🤍",
  "Красоты в каждой детали — от утреннего света до вечерних огней 🕯️",
  "Пусть все задуманные мечты сбываются легко и красиво 🪄",
  "Энергии, которая заряжает всё вокруг и открывает любые двери ⚡",
  "Только приятных сюрпризов, подарков судьбы и роскошных моментов 🎁",
  "Гармонии между большими целями и умением наслаждаться моментом 🧘‍♀️",
  "Пусть этот год станет временем твоих самых красивых побед 🏆",
  "Безупречного настроения и твердого ощущения, что возможно абсолютно всё! 🌟",
  "Пусть вокруг тебя всегда цветут цветы и звучит любимая музыка 🌸",
  "Неиссякаемого запаса вдохновения для новых идей и образов 💄",
  "Окружения, которое искренне ценит, вдохновляет и поддерживает 💎",
  "Пусть каждый момент оставляет в памяти только теплый свет 🎞️",
  "ДЖЕКПОТ! 🎰 Ты официально собрала все лучшие пожелания на этот год! Пусть всё сбудется на 1000% ✨"
];

const WISH_ICONS = [
  '✨', '☕', '🚀', '✈️', '🌿',
  '💫', '🥂', '🤍', '🕯️', '🪄',
  '⚡', '🎁', '🧘‍♀️', '🏆', '🌟',
  '🌸', '💄', '💎', '🎞️', '🎰'
];

export default function Screen3WishRoulette() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [currentWish, setCurrentWish] = useState<string | null>(null);
  const [currentIcon, setCurrentIcon] = useState('✨');
  const [isJackpot, setIsJackpot] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const lastIndexRef = useRef<number>(-1);

  // Плавное появление заголовка при монтировании без риска зависания ScrollTrigger
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  const getRandomWishData = () => {
    let nextIdx = Math.floor(Math.random() * WISHES.length);
    if (nextIdx === lastIndexRef.current && WISHES.length > 1) {
      nextIdx = (nextIdx + 1 + Math.floor(Math.random() * (WISHES.length - 1))) % WISHES.length;
    }
    lastIndexRef.current = nextIdx;

    const jackpot = nextIdx === WISHES.length - 1;
    return {
      wish: WISHES[nextIdx],
      icon: WISH_ICONS[nextIdx] || '✨',
      isJackpot: jackpot,
    };
  };

  const handleGenerate = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateY: 90,
        scale: 0.92,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          const nextData = getRandomWishData();
          setCurrentWish(nextData.wish);
          setCurrentIcon(nextData.icon);
          setIsJackpot(nextData.isJackpot);
          setHasGenerated(true);

          if (nextData.isJackpot) {
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#FFDF73', '#C9A96E', '#FFFFFF', '#E8B4B8'],
              startVelocity: 35,
              gravity: 0.75,
            });
          }

          if (cardRef.current) {
            gsap.fromTo(
              cardRef.current,
              { rotateY: -90, scale: 0.92 },
              {
                rotateY: 0,
                scale: 1,
                duration: 0.4,
                ease: 'back.out(1.2)',
                onComplete: () => setIsAnimating(false),
              }
            );
          }
        },
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="wish-generator"
      className="screen-section"
      style={{
        minHeight: '100dvh',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Мягкое фоновое свечение */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Заголовок */}
      <div
        ref={titleRef}
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          width: '100%',
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#C9A96E',
            display: 'block',
            marginBottom: '6px',
          }}
        >
          — ЗНАК ДНЯ —
        </span>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(28px, 6vw, 46px)',
            fontWeight: '300',
            color: '#FAF7F2',
            lineHeight: '1.15',
            margin: '0 0 6px 0',
          }}
        >
          Испытай удачу
        </h2>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '13px',
            fontWeight: '300',
            color: 'rgba(250,247,242,0.65)',
            margin: 0,
          }}
        >
          Нажми на кнопку, чтобы открыть своё послание на этот год
        </p>
      </div>

      {/* Стеклянная карточка */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-10px',
            background: isJackpot
              ? 'radial-gradient(ellipse, rgba(255,215,0,0.25) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(201,169,110,0.12) 0%, transparent 70%)',
            borderRadius: '24px',
            filter: 'blur(20px)',
            transition: 'background 0.5s ease',
          }}
        />

        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            padding: '24px 20px',
            textAlign: 'center',
            background: 'rgba(20, 16, 26, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: isJackpot
              ? '1px solid rgba(255, 215, 0, 0.6)'
              : '1px solid rgba(201, 169, 110, 0.25)',
            boxShadow: isJackpot
              ? '0 0 30px rgba(255, 215, 0, 0.2)'
              : '0 12px 36px rgba(0,0,0,0.4)',
            transition: 'all 0.4s ease',
          }}
        >
          {/* Контейнер текста и иконки */}
          <div
            ref={cardRef}
            style={{
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            {hasGenerated && currentWish ? (
              <>
                <div
                  style={{
                    fontSize: '34px',
                    marginBottom: '10px',
                    filter: isJackpot
                      ? 'drop-shadow(0 0 12px rgba(255,215,0,0.8))'
                      : 'drop-shadow(0 0 8px rgba(201,169,110,0.5))',
                  }}
                >
                  {currentIcon}
                </div>
                <p
                  style={{
                    fontFamily: isJackpot ? "'Plus Jakarta Sans', sans-serif" : "'Cormorant Garamond', serif",
                    fontSize: isJackpot ? '16px' : 'clamp(18px, 3.5vw, 22px)',
                    fontWeight: isJackpot ? '600' : '300',
                    fontStyle: isJackpot ? 'normal' : 'italic',
                    color: isJackpot ? '#FFE899' : '#FAF7F2',
                    lineHeight: '1.45',
                    margin: 0,
                  }}
                >
                  {isJackpot ? currentWish : `«${currentWish}»`}
                </p>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: '1px solid rgba(201,169,110,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#C9A96E',
                    background: 'rgba(201,169,110,0.08)',
                  }}
                >
                  ✦
                </div>
                <span style={{ fontSize: '13px', color: 'rgba(250,247,242,0.45)', fontStyle: 'italic' }}>
                  Нажми на кнопку ниже
                </span>
              </div>
            )}
          </div>

          {/* Разделитель */}
          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)',
              marginBottom: '20px',
            }}
          />

          {/* Кнопка генерации */}
          <button
            onClick={handleGenerate}
            disabled={isAnimating}
            style={{
              padding: '13px 32px',
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: '50px',
              border: isJackpot ? 'none' : '1px solid rgba(201, 169, 110, 0.6)',
              cursor: isAnimating ? 'default' : 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              color: isJackpot ? '#14101A' : '#FAF7F2',
              background: isJackpot
                ? 'linear-gradient(135deg, #FFDF73 0%, #FFD700 50%, #C9A96E 100%)'
                : 'linear-gradient(135deg, rgba(201,169,110,0.2) 0%, rgba(20,16,26,0.8) 100%)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              opacity: isAnimating ? 0.7 : 1,
            }}
          >
            <span>✨</span>
            <span>{hasGenerated ? 'Ещё одно послание' : 'Получить пожелание'}</span>
          </button>
        </div>
      </div>

      {/* Декоративный футер */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '16px',
          color: 'rgba(201,169,110,0.35)',
          fontSize: '14px',
          letterSpacing: '8px',
        }}
      >
        ✦ ✦ ✦
      </div>
    </section>
  );
            }
            
