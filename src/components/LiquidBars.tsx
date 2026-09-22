import React, { useEffect, useRef, useState, useMemo, useId } from 'react';
import { motion, animate } from 'motion/react';

export interface LiquidBarsProps {
  /**
   * Fill level of the bars (0 to 100)
   * @default 65
   */
  value?: number;

  /**
   * Number of liquid bar columns or rendering segments
   * @default 5
   */
  barCount?: number;

  /**
   * Bar orientation: 'horizontal' or 'vertical'
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Animation velocity of the wave ripples
   * @default 1
   */
  speed?: number;

  /**
   * Amplitude / crest depth of the wave motion (in px)
   * @default 12
   */
  amplitude?: number;

  /**
   * Blur or feathering applied at the liquid boundaries (in px)
   * @default 2
   */
  edgeSoftness?: number;

  /**
   * Intensity of the outer drop-shadow halo using the #f2f7ff color hex (in px)
   * @default 16
   */
  glow?: number;

  /**
   * Optional custom class for the root wrapper
   */
  className?: string;

  /**
   * Optional custom class for each bar track container
   */
  barClassName?: string;

  /**
   * Optional flag to show or hide the numeric value label
   * @default false
   */
  showValueLabel?: boolean;

  /**
   * Optional per-bar value variation array (if customized)
   */
  barValues?: number[];
}

/**
 * Generates a smooth cubic bezier SVG path representing a vertical liquid column with waves.
 */
function buildVerticalWavePath(
  w: number,
  h: number,
  fillRatio: number,
  amp: number,
  phase: number,
  freq: number = 1
): string {
  if (fillRatio <= 0.001) return `M 0 ${h} L ${w} ${h} Z`;
  if (fillRatio >= 0.999) return `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;

  const yBase = h * (1 - fillRatio);
  const steps = 14;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const wave =
      Math.sin((x / w) * Math.PI * 2 * freq + phase) * amp +
      Math.sin((x / w) * Math.PI * 4 * freq + phase * 1.4) * (amp * 0.28);
    const y = Math.max(0, Math.min(h, yBase + wave));
    points.push({ x, y });
  }

  let d = `M 0 ${h} L 0 ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    const cy = (p0.y + p1.y) / 2;
    d += ` Q ${p0.x} ${p0.y} ${cx} ${cy}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y} L ${w} ${h} Z`;
  return d;
}

/**
 * Generates a single specular crest line for the vertical liquid surface.
 */
function buildVerticalCrestLine(
  w: number,
  h: number,
  fillRatio: number,
  amp: number,
  phase: number,
  freq: number = 1
): string {
  if (fillRatio <= 0.001 || fillRatio >= 0.999) return '';

  const yBase = h * (1 - fillRatio);
  const steps = 14;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const wave =
      Math.sin((x / w) * Math.PI * 2 * freq + phase) * amp +
      Math.sin((x / w) * Math.PI * 4 * freq + phase * 1.4) * (amp * 0.28);
    const y = Math.max(0, Math.min(h, yBase + wave));
    points.push({ x, y });
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    const cy = (p0.y + p1.y) / 2;
    d += ` Q ${p0.x} ${p0.y} ${cx} ${cy}`;
  }
  d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  return d;
}

/**
 * Generates a smooth cubic bezier SVG path representing a horizontal liquid column with waves.
 */
function buildHorizontalWavePath(
  w: number,
  h: number,
  fillRatio: number,
  amp: number,
  phase: number,
  freq: number = 1
): string {
  if (fillRatio <= 0.001) return `M 0 0 L 0 ${h} Z`;
  if (fillRatio >= 0.999) return `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;

  const xBase = w * fillRatio;
  const steps = 14;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * h;
    const wave =
      Math.sin((y / h) * Math.PI * 2 * freq + phase) * amp +
      Math.sin((y / h) * Math.PI * 4 * freq + phase * 1.4) * (amp * 0.28);
    const x = Math.max(0, Math.min(w, xBase + wave));
    points.push({ x, y });
  }

  let d = `M 0 0 L ${points[0].x} 0`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    const cy = (p0.y + p1.y) / 2;
    d += ` Q ${p0.x} ${p0.y} ${cx} ${cy}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y} L 0 ${h} Z`;
  return d;
}

/**
 * Generates a single specular crest line for the horizontal liquid surface.
 */
function buildHorizontalCrestLine(
  w: number,
  h: number,
  fillRatio: number,
  amp: number,
  phase: number,
  freq: number = 1
): string {
  if (fillRatio <= 0.001 || fillRatio >= 0.999) return '';

  const xBase = w * fillRatio;
  const steps = 14;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * h;
    const wave =
      Math.sin((y / h) * Math.PI * 2 * freq + phase) * amp +
      Math.sin((y / h) * Math.PI * 4 * freq + phase * 1.4) * (amp * 0.28);
    const x = Math.max(0, Math.min(w, xBase + wave));
    points.push({ x, y });
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    const cy = (p0.y + p1.y) / 2;
    d += ` Q ${p0.x} ${p0.y} ${cx} ${cy}`;
  }
  d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  return d;
}

export const LiquidBars: React.FC<LiquidBarsProps> = ({
  value = 65,
  barCount = 5,
  orientation = 'vertical',
  speed = 1,
  amplitude = 12,
  edgeSoftness = 2,
  glow = 16,
  className = '',
  barClassName = '',
  showValueLabel = false,
  barValues,
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const filterId = `liquid-blur-${uniqueId}`;

  // Clamped target value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  // Current animated fill value (starts at 0 on mount for smooth rise)
  const [currentFill, setCurrentFill] = useState<number>(0);

  // Time state for high-performance wave ripples
  const [time, setTime] = useState<number>(0);

  // Respect user preference for reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Smooth rise animation upon mounting or value change
  useEffect(() => {
    const controls = animate(currentFill, clampedValue, {
      duration: prefersReducedMotion ? 0.4 : 1.4,
      ease: [0.16, 1, 0.3, 1], // premium fluid ease-out
      onUpdate: (latest) => setCurrentFill(latest),
    });
    return () => controls.stop();
  }, [clampedValue, prefersReducedMotion]);

  // RequestAnimationFrame loop for continuous wave motion
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (prefersReducedMotion) return;

    let isRunning = true;
    const tick = (now: number) => {
      if (!isRunning) return;
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Advance fluid phase according to velocity multiplier
      setTime((prev) => prev + delta * 0.003 * speed);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      isRunning = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [speed, prefersReducedMotion]);

  // Calculate dimensions and per-bar ratios
  const isVertical = orientation === 'vertical';
  const effectiveAmp = prefersReducedMotion ? 0 : amplitude;

  // Glow filter style using the strict anchor color #f2f7ff
  const glowStyle = useMemo(() => {
    if (glow <= 0) return {};
    return {
      filter: `drop-shadow(0 0 ${glow}px rgba(242, 247, 255, 0.55)) drop-shadow(0 0 ${glow * 2}px rgba(242, 247, 255, 0.22))`,
    };
  }, [glow]);

  // Generate bars array
  const bars = useMemo(() => {
    return Array.from({ length: Math.max(1, barCount) }, (_, i) => {
      // Allow individual bar height offset for harmonic viscometer / equalizer effect
      const customVal = barValues && barValues[i] !== undefined ? barValues[i] : null;
      let ratio = currentFill / 100;
      if (customVal !== null) {
        ratio = (customVal / 100) * (currentFill / Math.max(1, clampedValue));
      }
      return {
        index: i,
        ratio: Math.max(0, Math.min(1, ratio)),
        phaseOffset: i * 0.75,
      };
    });
  }, [barCount, currentFill, clampedValue, barValues]);

  return (
    <div
      id={`liquid-bars-container-${uniqueId}`}
      className={`relative w-full h-full p-4 md:p-6 bg-zinc-900 border border-zinc-800/80 rounded-3xl shadow-2xl flex ${
        isVertical ? 'flex-row items-stretch justify-center' : 'flex-col items-stretch justify-center'
      } gap-3 md:gap-5 select-none overflow-hidden ${className}`}
      style={glowStyle}
    >
      {/* SVG Defs for edge softness / blur filtering */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={Math.max(0, edgeSoftness)} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Core #f2f7ff metallic liquid gradient */}
          <linearGradient id={`liquid-fill-grad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f2f7ff" stopOpacity="1" />
            <stop offset="45%" stopColor="#eaf3ff" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#dce9fc" stopOpacity="0.95" />
          </linearGradient>

          {/* Back wave blend gradient */}
          <linearGradient id={`liquid-back-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d1e3fa" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#e2eeff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#d1e3fa" stopOpacity="0.65" />
          </linearGradient>

          {/* Mid wave blend gradient */}
          <linearGradient id={`liquid-mid-grad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#eaf3ff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#cfe1f7" stopOpacity="0.85" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ambient background glow inside the container */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#f2f7ff]/[0.03] via-transparent to-[#f2f7ff]/[0.02]"
        aria-hidden="true"
      />

      {/* Render each Liquid Bar */}
      {bars.map((bar) => {
        const viewBoxW = isVertical ? 100 : 300;
        const viewBoxH = isVertical ? 300 : 100;

        // Wave phase parameters per layer
        const backPhase = time * 1.25 + bar.phaseOffset;
        const midPhase = -time * 0.95 + bar.phaseOffset + 2.1;
        const frontPhase = time * 1.05 + bar.phaseOffset + 4.2;

        let pathBack = '';
        let pathMid = '';
        let pathFront = '';
        let crestLine = '';

        if (isVertical) {
          pathBack = buildVerticalWavePath(
            viewBoxW,
            viewBoxH,
            bar.ratio,
            effectiveAmp * 0.7,
            backPhase,
            1.1
          );
          pathMid = buildVerticalWavePath(
            viewBoxW,
            viewBoxH,
            bar.ratio,
            effectiveAmp * 0.85,
            midPhase,
            0.9
          );
          pathFront = buildVerticalWavePath(
            viewBoxW,
            viewBoxH,
            bar.ratio,
            effectiveAmp,
            frontPhase,
            1.0
          );
          crestLine = buildVerticalCrestLine(
            viewBoxW,
            viewBoxH,
            bar.ratio,
            effectiveAmp,
            frontPhase,
            1.0
          );
        } else {
          pathBack = buildHorizontalWavePath(
            viewBoxW,
            viewBoxH,
            bar.ratio,
            effectiveAmp * 0.7,
            backPhase,
            1.1
          );
          pathMid = buildHorizontalWavePath(
            viewBoxW,
            viewBoxH,
            bar.ratio,
            effectiveAmp * 0.85,
            midPhase,
            0.9
          );
          pathFront = buildHorizontalWavePath(
            viewBoxW,
            viewBoxH,
            bar.ratio,
            effectiveAmp,
            frontPhase,
            1.0
          );
          crestLine = buildHorizontalCrestLine(
            viewBoxW,
            viewBoxH,
            bar.ratio,
            effectiveAmp,
            frontPhase,
            1.0
          );
        }

        return (
          <div
            key={bar.index}
            id={`liquid-bar-track-${uniqueId}-${bar.index}`}
            className={`relative flex-1 bg-zinc-950/90 rounded-2xl md:rounded-3xl border border-zinc-800/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col items-center justify-end ${barClassName}`}
            style={{
              minWidth: isVertical ? '32px' : 'auto',
              minHeight: !isVertical ? '32px' : 'auto',
            }}
          >
            {/* The Fluid SVGs */}
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
              preserveAspectRatio="none"
              style={{ filter: `url(#${filterId})` }}
            >
              {/* Layer 1: Back Wave (translucent deep crest with mix-blend overlay) */}
              <path
                d={pathBack}
                fill={`url(#liquid-back-grad-${uniqueId})`}
                className="mix-blend-screen opacity-60"
              />

              {/* Layer 2: Mid Wave (opposing flow with phase delay) */}
              <path
                d={pathMid}
                fill={`url(#liquid-mid-grad-${uniqueId})`}
                className="mix-blend-screen opacity-75"
              />

              {/* Layer 3: Front Core Wave (Strictly anchored to #f2f7ff) */}
              <path
                d={pathFront}
                fill={`url(#liquid-fill-grad-${uniqueId})`}
                className="opacity-95"
              />

              {/* Specular Meniscus Highlight Line along wave crest */}
              {crestLine && (
                <path
                  d={crestLine}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="opacity-90 mix-blend-overlay drop-shadow-[0_0_3px_#ffffff]"
                />
              )}
            </svg>

            {/* Glossy / Metallic Glass Shading Overlays */}
            {/* 1. Cylindrical Edge Refraction */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0_0_12px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.25)]"
              aria-hidden="true"
            />

            {/* 2. Longitudinal Glass Tube Specular Reflection */}
            <div
              className={`absolute pointer-events-none rounded-full bg-gradient-to-b from-white/35 via-white/10 to-transparent blur-[0.6px] ${
                isVertical
                  ? 'top-2 bottom-2 left-2 w-1.5'
                  : 'left-2 right-2 top-2 h-1.5'
              }`}
              aria-hidden="true"
            />

            {/* 3. Surface Light Sheen Overlay */}
            <div
              className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.18]"
              aria-hidden="true"
            />

            {/* Numeric Value Label (if enabled) */}
            {showValueLabel && (
              <span className="relative z-10 mb-3 text-[10px] font-mono font-bold tracking-widest text-zinc-950 bg-white/80 px-2 py-0.5 rounded-full shadow-sm">
                {Math.round(bar.ratio * 100)}%
              </span>
            )}
          </div>
        );
      })}

      {/* Floating Global Value Tag */}
      {showValueLabel && !bars.some(() => showValueLabel) && (
        <div className="absolute top-3 right-4 z-20 pointer-events-none">
          <span className="px-2.5 py-1 text-xs font-mono font-semibold tracking-wider text-[#f2f7ff] bg-zinc-950/80 border border-zinc-700/60 rounded-full shadow-lg">
            {Math.round(currentFill)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default LiquidBars;
