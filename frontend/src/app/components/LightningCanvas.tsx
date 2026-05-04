"use client";
import { useEffect, useRef } from "react";

function drawLightning(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  branches: number
) {
  if (branches <= 0) return;
  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 80;
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 40;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(midX, midY);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.6})`;
  ctx.lineWidth = Math.random() * 1.5 + 0.3;
  ctx.shadowColor = "#c0a3ff";
  ctx.shadowBlur = 12;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(midX, midY);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(192,163,255,${0.1 + Math.random() * 0.3})`;
  ctx.lineWidth = Math.random() * 4 + 1;
  ctx.shadowBlur = 24;
  ctx.stroke();

  drawLightning(ctx, x1, y1, midX, midY, branches - 1);
  drawLightning(ctx, midX, midY, x2, y2, branches - 1);

  if (Math.random() > 0.6) {
    const bx = midX + (Math.random() - 0.5) * 120;
    const by = midY + Math.random() * 60;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(bx, by);
    ctx.strokeStyle = `rgba(192,163,255,${0.1 + Math.random() * 0.3})`;
    ctx.lineWidth = 0.5;
    ctx.shadowBlur = 8;
    ctx.stroke();
  }
}

function strikeAt(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  targetX: number,
  targetY: number
) {
  const x1 = Math.random() * canvas.width;
  const y1 = 0;
  const x2 = targetX + (Math.random() - 0.5) * 100;
  const y2 = targetY + (Math.random() - 0.5) * 60;

  let frame = 0;
  const flash = () => {
    if (frame++ > 4) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLightning(ctx, x1, y1, x2, y2, 4);
    if (frame === 1) drawLightning(ctx, x1, y1, x2, y2, 3);
    setTimeout(flash, 50);
  };
  flash();
}

export function LightningCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let lastStrike = 0;
    let strikeDelay = 800 + Math.random() * 1500;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Trigger glitch burst on all headline elements
      document.querySelectorAll(".glitch").forEach((el) => {
        el.classList.add("glitch-move");
        setTimeout(() => el.classList.remove("glitch-move"), 120);
      });
    };

    const onClick = (e: MouseEvent) => {
      strikeAt(ctx, canvas, e.clientX, e.clientY);
      setTimeout(() => strikeAt(ctx, canvas, e.clientX, e.clientY), 80);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    let raf: number;
    const render = (now: number) => {
      if (now - lastStrike > strikeDelay) {
        lastStrike = now;
        strikeDelay = 600 + Math.random() * 1400;
        strikeAt(ctx, canvas, mouseX, mouseY);
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.55,
      }}
    />
  );
}
