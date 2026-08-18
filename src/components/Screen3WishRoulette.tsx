import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

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

// Extract emoji for the icon preview
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

  const getRandomWishData = () => {
    let nextIdx = Math.floor(Math.random() * WISHES.length);
    // Ensure no immediate repetition
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

    if (hasGenerated && cardRef.current) {
      // 3D Flip transition
      gsap.to(cardRef.current, {
        rotateY: 90,
        scale: 0.93,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          const nextData = getRandomWishData();
          setCurrentWish(nextData.wish);
          setCurrentIcon(nextData.icon);
          setIsJackpot(nextData.isJackpot);

          if (nextData.isJackpot) {
            confetti({
              particleCount: 75,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#FFDF73', '#C9A96E', '#FFFFFF', '#E8B4B8', '#C4B5FD'],
              startVelocity: 35,
              gravity: 0.75,
            });
          }

          if (cardRef.current) {
            gsap.fromTo(
              cardRef.current,
              { rotateY: -90, scale: 0.93 },
              {
                rotateY: 0,
                scale: 1,
                duration: 0.45,
                ease: 'back.out(1.2)',
                onComplete: () => setIsAnimating(false),
              }
            );
          }
        },
      });
    } else {
      const nextData = getRandomWishData();
      setCurrentWish(nextData.wish);
      setCurrentIcon(nextData.icon);
      setIsJackpot(nextData.isJackpot);
      setHasGenerated(true);

      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'back.out(1.4)',
            onComplete: () => setIsAnimating(false),
          }
        );
      } else {
        setIsAnimating(false);
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="wish-generator"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)',
        position: 'relative',
      }}
    >
      {/* Soft background ambient accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(196,181,253,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Clean Header: Strictly no 'WISH ROULETTE • 20 WISHES POOL' */}
      <div
        ref={titleRef}
        style={{
          textAlign: 'center',
          marginBottom: 'clamp(32px, 5vw, 50px)',
          opacity: 0,
          width: '100%',
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(34px, 5.5vw, 60px)',
            fontWeight: '300',
            color: '#FAF7F2',
            lineHeight: '1.2',
            marginBottom: '12px',
          }}
        >
          Испытай удачу
        </h2>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(14px, 2vw, 17px)',
            fontWeight: '300',
            color: 'rgba(250,247,242,0.65)',
            letterSpacing: '0.02em',
            margin: 0,
          }}
        >
          Нажми на кнопку, чтобы открыть своё послание на этот год
        </p>
      </div>

      {/* Glassmorphism Card Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          position: 'relative',
        }}
      >
        {/* Glow behind glass */}
        <div
          style={{
            position: 'absolute',
            inset: '-20px',
            background: isJackpot
              ? 'radial-gradient(ellipse, rgba(255,215,0,0.22) 0%, rgba(201,169,110,0.12) 50%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(201,169,110,0.1) 0%, transparent 70%)',
            borderRadius: '28px',
            filter: 'blur(24px)',
            transition: 'background 0.5s ease',
          }}
        />

        <div
          className="glass"
          style={{
            position: 'relative',
            borderRadius: '24px',
            padding: 'clamp(36px, 5.5vw, 56px)',
            textAlign: 'center',
            border: isJackpot
              ? '1px solid rgba(255, 215, 0, 0.5)'
              : '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: isJackpot
              ? '0 0 50px rgba(255, 215, 0, 0.25), inset 0 0 30px rgba(255, 215, 0, 0.08)'
              : '0 20px 50px rgba(0,0,0,0.4)',
            transition: 'all 0.5s ease',
          }}
        >
          {/* Wish display card - Only icon and wish text, no number badges */}
          <div
            ref={cardRef}
            style={{
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px',
              opacity: hasGenerated ? 1 : 0,
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            {currentWish ? (
              <>
                <div
                  style={{
                    fontSize: 'clamp(36px, 5.5vw, 50px)',
                    marginBottom: '18px',
                    filter: isJackpot
                      ? 'drop-shadow(0 0 16px rgba(255,215,0,0.8))'
                      : 'drop-shadow(0 0 12px rgba(201,169,110,0.5))',
                    animation: isJackpot ? 'sparkle 1.5s ease-in-out infinite' : 'none',
                  }}
                >
                  {currentIcon}
                </div>
                <p
                  style={{
                    fontFamily: isJackpot
                      ? "'Plus Jakarta Sans', sans-serif"
                      : "'Cormorant Garamond', serif",
                    fontSize: isJackpot
                      ? 'clamp(17px, 2.5vw, 22px)'
                      : 'clamp(20px, 3.2vw, 26px)',
                    fontWeight: isJackpot ? '600' : '300',
                    fontStyle: isJackpot ? 'normal' : 'italic',
                    color: isJackpot ? '#FFE899' : '#FAF7F2',
                    lineHeight: '1.65',
                    maxWidth: '480px',
                    textShadow: isJackpot ? '0 0 25px rgba(255,215,0,0.4)' : 'none',
                    margin: 0,
                  }}
                >
                  {isJackpot ? currentWish : `"${currentWish}"`}
                </p>
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '1px solid rgba(201,169,110,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    color: '#C9A96E',
                    background: 'rgba(201,169,110,0.06)',
                  }}
                >
                  ✦
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              width: '100%',
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(201,169,110,0.25), transparent)',
              marginBottom: '32px',
            }}
          />

          {/* Generate Button: ✨ Получить пожелание */}
          <button
            onClick={handleGenerate}
            disabled={isAnimating}
            className="btn-glossy"
            style={{
              padding: '16px 44px',
              fontSize: '13px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: '50px',
              border: 'none',
              cursor: isAnimating ? 'default' : 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '600',
              opacity: isAnimating ? 0.7 : 1,
              transition: 'opacity 0.3s ease, transform 0.2s ease',
              background: isJackpot
                ? 'linear-gradient(135deg, #FFDF73 0%, #FFD700 50%, #C9A96E 100%)'
                : undefined,
            }}
          >
            <span>✨</span>
            <span>{!hasGenerated ? 'Получить пожелание' : 'Получить пожелание'}</span>
          </button>
        </div>
      </div>

      {/* Decorative element */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 'clamp(36px, 5vw, 56px)',
          color: 'rgba(201,169,110,0.35)',
          fontSize: '20px',
          letterSpacing: '12px',
        }}
      >
        ✦ ✦ ✦
      </div>
    </section>
  );
}
