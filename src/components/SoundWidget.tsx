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
        top: '20px',
        right: '20px',
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          background: 'rgba(13,11,15,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,169,110,0.3)',
          borderRadius: '50px',
          cursor: 'pointer',
          color: '#C9A96E',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '12px',
          fontWeight: '500',
          letterSpacing: '0.06em',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,169,110,0.7)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(201,169,110,0.2)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,169,110,0.3)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        {/* Sound wave bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '20px' }}>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={isPlaying ? 'sound-bar' : ''}
              style={{
                width: '3px',
                height: isPlaying ? undefined : '4px',
                background: isPlaying ? '#C9A96E' : 'rgba(201,169,110,0.4)',
                borderRadius: '2px',
                animationDelay: `${(i - 1) * 0.1}s`,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
        <span style={{ textTransform: 'uppercase' }}>
          {isPlaying ? 'Sound On' : 'Sound Off'}
        </span>
      </button>
    </div>
  );
}
