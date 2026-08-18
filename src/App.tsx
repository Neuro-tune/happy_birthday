import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AuroraCanvas from './components/AuroraCanvas';
import SoundWidget from './components/SoundWidget';
import ScrollProgress from './components/ScrollProgress';
import Screen1Landing from './components/Screen1Landing';
import Screen2Gallery from './components/Screen2Gallery';
import Screen3WishRoulette from './components/Screen3WishRoulette';
import Screen4Final from './components/Screen4Final';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [landingVisible, setLandingVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    // Using local background music from public/music
    audio.src = '/music/alanajordan-leave-the-door-open-310153.mp3';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleStart = useCallback(() => {
    setIsStarted(true);

    // Play audio with fade-in to ~30% volume
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        let vol = 0;
        const fadeInterval = setInterval(() => {
          vol = Math.min(vol + 0.015, 0.30);
          if (audioRef.current) audioRef.current.volume = vol;
          if (vol >= 0.30) clearInterval(fadeInterval);
        }, 50);
      }).catch(() => {
        // Browser blocked autoplay — that's fine
      });
    }

    // Crossfade: Main content fades in while Landing fades out
    window.scrollTo({ top: 0, behavior: 'instant' });

    setTimeout(() => {
      if (mainRef.current) {
        gsap.to(mainRef.current, {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    }, 300);

    // Remove landing from DOM after its exit animation completes
    setTimeout(() => {
      setLandingVisible(false);
    }, 1200);
  }, []);

  const handleToggleSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Fade out
      let vol = audio.volume;
      const fadeOut = setInterval(() => {
        vol = Math.max(vol - 0.03, 0);
        audio.volume = vol;
        if (vol <= 0) {
          clearInterval(fadeOut);
          audio.pause();
          setIsPlaying(false);
        }
      }, 40);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol = Math.min(vol + 0.02, 0.30);
          audio.volume = vol;
          if (vol >= 0.30) clearInterval(fadeIn);
        }, 50);
      }).catch(() => {});
    }
  }, [isPlaying]);

  return (
    <div style={{ minHeight: '100vh', background: '#0D0B0F', position: 'relative' }}>
      {/* Persistent aurora background */}
      <AuroraCanvas />

      {/* Progress bar — visible in main experience */}
      {isStarted && <ScrollProgress />}

      {/* Sound widget — always visible once started */}
      {isStarted && (
        <SoundWidget isPlaying={isPlaying} onToggle={handleToggleSound} />
      )}

      {/* Main content — PRE-MOUNTED for shader warmup, hidden until started */}
      <div
        ref={mainRef}
        style={{
          opacity: 0,
          position: 'relative',
          zIndex: 1,
          pointerEvents: isStarted ? 'auto' : 'none',
        }}
      >
        {/* Screen 2: Gallery */}
        <Screen2Gallery />

        {/* Section divider */}
        <SectionDivider />

        {/* Screen 3: Wish Roulette */}
        <Screen3WishRoulette />

        {/* Section divider */}
        <SectionDivider />

        {/* Screen 4: Final */}
        <Screen4Final />
      </div>

      {/* Screen 1: Landing — on top, removed from DOM after crossfade */}
      {landingVisible && (
        <Screen1Landing onStart={handleStart} />
      )}
    </div>
  );
}

function SectionDivider() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 clamp(20px, 5vw, 80px)',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <div style={{
        flex: 1,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.15), transparent)',
      }} />
    </div>
  );
}
