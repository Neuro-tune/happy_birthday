import { useEffect, useState } from 'react';

interface SoundWidgetProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function SoundWidget({ isPlaying, onToggle }: SoundWidgetProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <button
        onClick={onToggle}
        aria-label={isPlaying ? 'Mute sound' : 'Unmute sound'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          padding: 0,
          background: 'rgba(13, 11, 15, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 169, 110, 0.4)',
          borderRadius: '50%',
          cursor: 'pointer',
          color: '#C9A96E',
          transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = 'rgba(13, 11, 15, 0.85)';
          btn.style.borderColor = 'rgba(201, 169, 110, 0.7)';
          btn.style.boxShadow = '0 0 20px rgba(201, 169, 110, 0.3), 0 4px 12px rgba(0, 0, 0, 0.4)';
          btn.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = 'rgba(13, 11, 15, 0.7)';
          btn.style.borderColor = 'rgba(201, 169, 110, 0.4)';
          btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          btn.style.transform = 'scale(1)';
        }}
      >
        {/* Animated sound wave bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '18px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={isPlaying ? 'sound-bar-animated' : ''}
              style={{
                width: '2px',
                height: isPlaying ? undefined : '3px',
                background: isPlaying ? '#C9A96E' : 'rgba(201, 169, 110, 0.5)',
                borderRadius: '1px',
                animationDelay: `${(i - 1) * 0.1}s`,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </button>

      {/* CSS Animation for sound bars */}
      <style>{`
        @keyframes soundBarAnimation {
          0%, 100% {
            height: 4px;
            opacity: 1;
          }
          50% {
            height: 12px;
            opacity: 0.7;
          }
        }

        .sound-bar-animated {
          animation: soundBarAnimation 0.6s ease-in-out infinite !important;
        }

        /* Mobile responsiveness */
        @media (max-width: 480px) {
          .sound-widget-fixed {
            top: 12px !important;
            right: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
