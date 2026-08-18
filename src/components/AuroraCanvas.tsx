import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
  color: string;
}

const COLORS = [
  'rgba(201,169,110,',
  'rgba(232,180,184,',
  'rgba(196,181,253,',
  'rgba(255,255,255,',
  'rgba(232,213,163,',
];

export default function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createParticle = (): Particle => {
      const maxLife = Math.random() * 120 + 80;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        opacity: 0,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1,
        life: 0,
        maxLife,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    // Initialize particles
    for (let i = 0; i < 120; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      particlesRef.current.push(p);
    }

    let auroraTick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Aurora blobs
      auroraTick += 0.004;
      const blobs = [
        { x: canvas.width * 0.15 + Math.sin(auroraTick) * 80, y: canvas.height * 0.3, r: 400, c1: 'rgba(88,28,135,0.18)', c2: 'transparent' },
        { x: canvas.width * 0.8 + Math.cos(auroraTick * 0.7) * 60, y: canvas.height * 0.2, r: 350, c1: 'rgba(201,169,110,0.12)', c2: 'transparent' },
        { x: canvas.width * 0.5 + Math.sin(auroraTick * 0.5) * 100, y: canvas.height * 0.7, r: 450, c1: 'rgba(196,181,253,0.1)', c2: 'transparent' },
        { x: canvas.width * 0.9, y: canvas.height * 0.8, r: 300, c1: 'rgba(232,180,184,0.12)', c2: 'transparent' },
        { x: canvas.width * 0.05, y: canvas.height * 0.85, r: 280, c1: 'rgba(201,169,110,0.08)', c2: 'transparent' },
      ];

      blobs.forEach(blob => {
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        grad.addColorStop(0, blob.c1);
        grad.addColorStop(1, blob.c2);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.opacity = progress / 0.2;
        } else if (progress > 0.8) {
          p.opacity = (1 - progress) / 0.2;
        } else {
          p.opacity = 1;
        }

        if (p.life >= p.maxLife) {
          particles[i] = createParticle();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${(p.opacity * 0.8).toFixed(2)})`;
        ctx.fill();

        // Glow for larger particles
        if (p.size > 1.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${(p.opacity * 0.15).toFixed(2)})`;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="aurora-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
