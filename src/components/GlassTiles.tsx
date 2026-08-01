import React, { useEffect, useRef, useState } from "react";

interface GlassTilesProps {
  colors?: string[];
  tileSize?: number;
  gap?: number;
  shimmerSpeed?: number;
  interactive?: boolean;
  opacity?: number;
  className?: string;
  backdropBlur?: string;
}

export const GlassTiles: React.FC<GlassTilesProps> = ({
  colors = ["#919191", "#FFFFFF", "#EEEEEE"],
  tileSize = 64,
  gap = 6,
  shimmerSpeed = 1,
  interactive = true,
  opacity = 0.75,
  className = "",
  backdropBlur = "backdrop-blur-[2px]"
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Helper to parse hex colors to RGBA
    const hexToRgb = (hex: string) => {
      let cleanHex = hex.replace("#", "");
      if (cleanHex.length === 3) {
        cleanHex = cleanHex.split("").map((c) => c + c).join("");
      }
      const num = parseInt(cleanHex, 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      };
    };

    const colorRgbs = colors.map((c) => hexToRgb(c));
    // Color 0: #919191 (Slate/Silver)
    // Color 1: #FFFFFF (Pure White Shine)
    // Color 2: #EEEEEE (Soft Off-white)
    const slateRgb = colorRgbs[0] || { r: 145, g: 145, b: 145 };
    const whiteRgb = colorRgbs[1] || { r: 255, g: 255, b: 255 };
    const softRgb = colorRgbs[2] || { r: 238, g: 238, b: 238 };

    const handleResize = () => {
      const container = containerRef.current || canvas.parentElement;
      if (!container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current.targetX = e.clientX - rect.left;
      mousePos.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mousePos.current.targetX = -1000;
      mousePos.current.targetY = -1000;
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
      document.body.addEventListener("mouseleave", handleMouseLeave);
      document.body.addEventListener("mouseenter", handleMouseEnter);
    }

    // Main render loop
    const render = () => {
      time += 0.012 * shimmerSpeed;

      // Smooth mouse interpolation
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.1;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.1;

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / (tileSize + gap)) + 1;
      const rows = Math.ceil(height / (tileSize + gap)) + 1;

      const mX = mousePos.current.x;
      const mY = mousePos.current.y;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * (tileSize + gap);
          const y = r * (tileSize + gap);

          const centerX = x + tileSize / 2;
          const centerY = y + tileSize / 2;

          // Distance from mouse for interactive glare
          const distToMouse = Math.hypot(centerX - mX, centerY - mY);
          const maxDist = 260;
          const mouseIntensity = interactive ? Math.max(0, 1 - distToMouse / maxDist) : 0;

          // Shimmer wave calculated using trigonometric offsets
          const wave1 = Math.sin(c * 0.35 + r * 0.25 + time * 1.5);
          const wave2 = Math.cos(c * 0.2 - r * 0.4 + time * 2.1);
          const wave3 = Math.sin((c + r) * 0.15 + time * 0.8);
          
          let shimmerVal = (wave1 + wave2 + wave3) / 3; // range approx -1 to 1
          shimmerVal = (shimmerVal + 1) / 2; // normalize 0 to 1

          // Dynamic tile rotation / subtle glass reflection shift
          const glintFactor = Math.pow(shimmerVal, 3); // sharp peak highlights

          // Calculate tile opacity & color blend
          const baseAlpha = 0.08 + glintFactor * 0.18 + mouseIntensity * 0.35;
          
          // Blend colors based on shimmer and mouse proximity
          let tileR: number, tileG: number, tileB: number;

          if (mouseIntensity > 0.4) {
            // High mouse proximity -> Pure #FFFFFF white shine
            const t = (mouseIntensity - 0.4) / 0.6;
            tileR = softRgb.r + (whiteRgb.r - softRgb.r) * t;
            tileG = softRgb.g + (whiteRgb.g - softRgb.g) * t;
            tileB = softRgb.b + (whiteRgb.b - softRgb.b) * t;
          } else if (shimmerVal > 0.65) {
            // High shimmer peak -> Soft #EEEEEE off-white shimmer
            const t = (shimmerVal - 0.65) / 0.35;
            tileR = slateRgb.r + (softRgb.r - slateRgb.r) * t;
            tileG = slateRgb.g + (softRgb.g - slateRgb.g) * t;
            tileB = slateRgb.b + (softRgb.b - slateRgb.b) * t;
          } else {
            // Default -> #919191 slate glass tile tint
            tileR = slateRgb.r;
            tileG = slateRgb.g;
            tileB = slateRgb.b;
          }

          // Draw Rounded Glass Tile Box
          const radius = 8;
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(x, y, tileSize, tileSize, radius);

          // Tile Surface Gradient (Bevel & Specular Highlight)
          const grad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
          const topHighlightAlpha = (baseAlpha * 1.6).toFixed(3);
          const bottomShadowAlpha = (baseAlpha * 0.4).toFixed(3);

          grad.addColorStop(0, `rgba(${Math.round(whiteRgb.r)}, ${Math.round(whiteRgb.g)}, ${Math.round(whiteRgb.b)}, ${topHighlightAlpha})`);
          grad.addColorStop(0.4, `rgba(${Math.round(tileR)}, ${Math.round(tileG)}, ${Math.round(tileB)}, ${baseAlpha.toFixed(3)})`);
          grad.addColorStop(1, `rgba(${Math.round(slateRgb.r)}, ${Math.round(slateRgb.g)}, ${Math.round(slateRgb.b)}, ${bottomShadowAlpha})`);

          ctx.fillStyle = grad;
          ctx.fill();

          // Glass Border 3D Highlight (Top/Left: #FFFFFF, Bottom/Right: #919191)
          const borderGrad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
          const borderAlpha = (0.15 + glintFactor * 0.35 + mouseIntensity * 0.5).toFixed(3);
          
          borderGrad.addColorStop(0, `rgba(${whiteRgb.r}, ${whiteRgb.g}, ${whiteRgb.b}, ${borderAlpha})`);
          borderGrad.addColorStop(0.5, `rgba(${softRgb.r}, ${softRgb.g}, ${softRgb.b}, ${(parseFloat(borderAlpha) * 0.7).toFixed(3)})`);
          borderGrad.addColorStop(1, `rgba(${slateRgb.r}, ${slateRgb.g}, ${slateRgb.b}, ${(parseFloat(borderAlpha) * 0.3).toFixed(3)})`);

          ctx.lineWidth = 1;
          ctx.strokeStyle = borderGrad;
          ctx.stroke();

          // Subtle Glass Diagonal Refraction Line on bright tiles
          if (glintFactor > 0.4 || mouseIntensity > 0.2) {
            const lineAlpha = (glintFactor * 0.25 + mouseIntensity * 0.4).toFixed(3);
            ctx.beginPath();
            ctx.moveTo(x + tileSize * 0.2, y + tileSize * 0.8);
            ctx.lineTo(x + tileSize * 0.8, y + tileSize * 0.2);
            ctx.strokeStyle = `rgba(${whiteRgb.r}, ${whiteRgb.g}, ${whiteRgb.b}, ${lineAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mouseleave", handleMouseLeave);
        document.body.removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, [colors, tileSize, gap, shimmerSpeed, interactive]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${backdropBlur} ${className}`}
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default GlassTiles;
