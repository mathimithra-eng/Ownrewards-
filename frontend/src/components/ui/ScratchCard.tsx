"use client";

import React, { useRef, useEffect, useState } from 'react';

export default function ScratchCard({ children, width = 120, height = 24 }: { children: React.ReactNode; width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Fill with scratch material
    ctx.fillStyle = '#8b5cf6'; // Purple match
    ctx.fillRect(0, 0, width, height);

    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("Scratch to reveal", width / 2, height / 2 + 4);

    let isDrawing = false;

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.stopPropagation();
      
      const rect = canvas.getBoundingClientRect();
      let x, y;
      if ('touches' in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = (e as MouseEvent).clientX - rect.left;
        y = (e as MouseEvent).clientY - rect.top;
      }

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Check how much is scratched
      const imageData = ctx.getImageData(0, 0, width, height).data;
      let transparentPixels = 0;
      for (let i = 3; i < imageData.length; i += 4) {
        if (imageData[i] === 0) transparentPixels++;
      }
      
      if (transparentPixels > (width * height) * 0.4 && !isRevealed) {
        setIsRevealed(true);
        canvas.style.display = 'none';
      }
    };

    const down = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      isDrawing = true;
      scratch(e);
    };

    const up = (e: Event) => {
      e.stopPropagation();
      isDrawing = false;
    };

    canvas.addEventListener('mousedown', down);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', up);
    canvas.addEventListener('mouseleave', up);
    canvas.addEventListener('touchstart', down, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    canvas.addEventListener('touchend', up);

    return () => {
      canvas.removeEventListener('mousedown', down);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('mouseup', up);
      canvas.removeEventListener('mouseleave', up);
      canvas.removeEventListener('touchstart', down);
      canvas.removeEventListener('touchmove', scratch);
      canvas.removeEventListener('touchend', up);
    };
  }, [width, height, isRevealed]);

  return (
    <div 
      style={{ position: 'relative', width, height, display: 'inline-block' }}
      onClick={(e) => {
        if (!isRevealed) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'pointer',
          borderRadius: 4
        }}
      />
    </div>
  );
}
