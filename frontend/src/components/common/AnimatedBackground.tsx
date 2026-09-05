import { useRef, useEffect } from "react";

interface ParticlesProps {
  particleCount?: number;
  speed?: number;
  particleColor?: string;
  lineColor?: string;
}

export function AnimatedBackground({
  particleCount = 60,
  speed = 0.5,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      particles = Array.from({ length: particleCount }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2 * speed,
        vy: (Math.random() - 0.5) * 2 * speed,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const isDark = document.documentElement.classList.contains('dark');
      const activeColor = isDark ? "#22d3ee" : "#0891b2"; // Use darker teal for light mode
      const particleAlpha = isDark ? '80' : 'B3'; // 50% opacity in dark, 70% opacity in light

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, isDark ? 1.5 : 2, 0, Math.PI * 2); // Slightly larger in light mode
        ctx.fillStyle = activeColor + particleAlpha; 
        ctx.fill();

        // Draw connecting lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) { 
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // Append hex alpha to the base color
            // In light mode, lines should be slightly more opaque
            const maxAlpha = isDark ? 128 : 180;
            const alpha = Math.floor((1 - distance / 120) * maxAlpha); 
            const alphaHex = alpha.toString(16).padStart(2, '0');
            ctx.strokeStyle = `${activeColor}${alphaHex}`;
            ctx.lineWidth = isDark ? 1 : 1.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener("resize", init);
    // Listen for theme changes on HTML tag to force a redraw if needed, though requestAnimationFrame handles it automatically
    const observer = new MutationObserver(() => {});
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [particleCount, speed]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, 
        overflow: 'hidden',
        pointerEvents: 'none', 
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block', opacity: 1 }} 
      />
    </div>
  );
}
