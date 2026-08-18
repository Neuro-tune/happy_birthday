import { useEffect, useRef } from 'react';

interface Orb {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
  color: string;
}

export default function SparkleOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const rafRef = useRef<number>(0);

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

    const colors = ['#C9A96E', '#E8D5A3', '#E8B4B8', '#C4B5FD', '#FAF7F2'];
    orbsRef.current = Array.from({ length: 25 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      orbsRef.current.forEach(orb => {
        const alpha = orb.opacity * (0.5 + 0.5 * Math.sin(t * orb.speed * 100 + orb.phase));
        ctx.beginPath();
        ctx.arc(
          orb.x + Math.sin(t * orb.speed * 50 + orb.phase) * 20,
          orb.y + Math.cos(t * orb.speed * 40 + orb.phase) * 15,
          orb.size,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = orb.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Glow
        const grad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.size * 4
        );
        grad.addColorStop(0, orb.color + Math.floor(alpha * 80).toString(16).padStart(2, '0'));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
