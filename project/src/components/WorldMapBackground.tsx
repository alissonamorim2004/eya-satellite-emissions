import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function WorldMapBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    const hotspots = [
      { x: 0.22, y: 0.45, label: 'Brasil' },
      { x: 0.50, y: 0.35, label: 'Europa' },
      { x: 0.55, y: 0.50, label: 'África' },
      { x: 0.75, y: 0.40, label: 'Ásia' },
      { x: 0.15, y: 0.25, label: 'América do Norte' },
    ];

    function drawWorldMap() {
      if (!ctx || !canvas) return;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radiusX = canvas.width * 0.4;
      const radiusY = canvas.height * 0.35;

      ctx.beginPath();
      for (let i = -90; i <= 90; i += 30) {
        const y = centerY + (i / 90) * radiusY;
        const width = radiusX * Math.cos((i * Math.PI) / 180);
        ctx.moveTo(centerX - width, y);
        ctx.lineTo(centerX + width, y);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let i = -180; i <= 180; i += 30) {
        const x = centerX + (i / 180) * radiusX;
        ctx.moveTo(x, centerY - radiusY);
        ctx.lineTo(x, centerY + radiusY);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();

      hotspots.forEach((spot) => {
        const x = spot.x * canvas.width;
        const y = spot.y * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        const pulse = Math.sin(Date.now() / 500) * 3 + 3;
        ctx.beginPath();
        ctx.arc(x, y, 12 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = '11px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(spot.label, x, y + 25);
      });
    }

    function updateParticles() {
      if (!ctx || !canvas) return;

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });
    }

    function drawParticles() {
      if (!ctx) return;

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawWorldMap();
      updateParticles();
      drawParticles();

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.4 }}
    />
  );
}
