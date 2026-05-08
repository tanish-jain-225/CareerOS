'use client';

import React, { useEffect, useRef } from 'react';

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Lightweight canvas confetti burst. Fires on mount and self-destructs after 3s.
 */
export default function Confetti({ active = false }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#60a5fa', '#a78bfa'];
    const particles = Array.from({ length: 120 }, () => ({
      x: randomInRange(canvas.width * 0.3, canvas.width * 0.7),
      y: randomInRange(canvas.height * 0.3, canvas.height * 0.5),
      vx: randomInRange(-6, 6),
      vy: randomInRange(-14, -4),
      size: randomInRange(4, 10),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 1,
      rotation: randomInRange(0, 360),
      rotSpeed: randomInRange(-5, 5),
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rotSpeed;
        p.opacity -= 0.012;
        if (p.opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      frame++;
      if (frame < 180) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
