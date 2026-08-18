import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  density?: number;
  faint?: boolean;
  interactive?: boolean;
};

type Node = { x: number; y: number; vx: number; vy: number; phase: number };

export function NetworkCanvas({
  className = "",
  density = 0.00009,
  faint = false,
  interactive = true,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let t = 0;
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.min(90, Math.round(width * height * density)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);
      const linkDist = Math.min(160, Math.max(90, width / 8));
      const alphaScale = faint ? 0.4 : 1;

      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
        }
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        if (interactive) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 130 && d > 0.01) {
            n.x += (dx / d) * (130 - d) * 0.012;
            n.y += (dy / d) * (130 - d) * 0.012;
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > linkDist) continue;
          const strength = 1 - d / linkDist;
          const travel = (Math.sin(t * 1.4 + (i + j) * 0.35) + 1) / 2;
          ctx.strokeStyle = `rgba(59, 130, 246, ${strength * 0.28 * alphaScale})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          if (!reduced && strength > 0.55) {
            const px = a.x + (b.x - a.x) * travel;
            const py = a.y + (b.y - a.y) * travel;
            ctx.fillStyle = `rgba(6, 182, 212, ${strength * 0.7 * alphaScale})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      for (const n of nodes) {
        const pulse = (Math.sin(t * 2 + n.phase) + 1) / 2;
        ctx.fillStyle = `rgba(124, 58, 237, ${(0.35 + pulse * 0.4) * alphaScale})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6 + pulse * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("pointermove", onPointer);
      window.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [density, faint, interactive]);

  return <canvas ref={ref} aria-hidden="true" className={`h-full w-full ${className}`} />;
}
