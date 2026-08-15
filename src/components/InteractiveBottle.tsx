import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function InteractiveBottle() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Spring settings for ultra-smooth physical motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 120, mass: 1 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const shadowX = useSpring(useMotionValue(0), springConfig);
  const shadowY = useSpring(useMotionValue(0), springConfig);

  // Slosh fluid physics config (lower stiffness & damping for organic sway)
  const liquidSpringConfig = { damping: 14, stiffness: 65, mass: 0.8 };
  const liquidRotate = useSpring(useMotionValue(0), liquidSpringConfig);
  const liquidX = useSpring(useMotionValue(0), liquidSpringConfig);
  
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized mouse positions relative to the container center (-0.5 to 0.5)
    let x = (e.clientX - rect.left) / width - 0.5;
    let y = (e.clientY - rect.top) / height - 0.5;
    
    // Clamp coordinates safely within the container boundaries to prevent upside-down flipping
    x = Math.max(-0.5, Math.min(0.5, x));
    y = Math.max(-0.5, Math.min(0.5, y));
    
    // Rotate up to 15 degrees
    rotateX.set(-y * 22);
    rotateY.set(x * 22);
    
    // Shadow shifts in the opposite direction of the light source
    shadowX.set(x * 45);
    shadowY.set(y * 45);

    // Reactively slosh fluid in opposite direction of tilt
    liquidRotate.set(-x * 26);
    liquidX.set(-x * 16);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[380px] md:h-[500px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovered(false);
        rotateX.set(0);
        rotateY.set(0);
        shadowX.set(0);
        shadowY.set(0);
        liquidRotate.set(0);
        liquidX.set(0);
      }}
    >
      {/* Dynamic Refracted Liquid-Amber Shadow */}
      <motion.div
        style={{
          x: shadowX,
          y: shadowY,
          scale: isHovered ? 1.08 : 1.0,
        }}
        className="absolute w-56 h-80 rounded-[4rem] bg-[#276152]/20 blur-3xl mix-blend-multiply transition-all duration-700 pointer-events-none liquid-refraction"
      />

      {/* Secondary Soft Ambient Sand Shadow */}
      <motion.div
        style={{
          x: useSpring(useMotionValue(0)),
          y: useSpring(useMotionValue(20)),
        }}
        className="absolute w-60 h-10 rounded-full bg-sand-900/10 blur-xl bottom-8 pointer-events-none"
      />

      {/* Floating Morphed Glass Bottle Frame */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-56 h-80 flex flex-col items-center justify-between p-6 cursor-grab active:cursor-grabbing"
      >
        {/* Glass Bottle Cap */}
        <div className="relative w-16 h-8 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 border border-stone-700/50 rounded-t-md shadow-lg flex items-center justify-center">
          <div className="w-12 h-[2px] bg-amber-gold/40 absolute bottom-[2px]" />
          <span className="text-[7px] font-mono tracking-widest text-[#FBF6F0] text-shadow-sm">SP 2026</span>
        </div>

        {/* Neck of the bottle */}
        <div className="w-8 h-6 bg-gradient-to-r from-white/30 via-white/10 to-white/30 border-x border-white/20 -mt-[1px] relative" />

        {/* Translucent Sculpted Glass Body */}
        <div className="relative w-full flex-1 rounded-[3rem] border border-white/80 apple-glass apple-sheen shadow-[0_25px_60px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(255,255,255,0.7)] overflow-hidden flex flex-col items-center justify-center p-4">
          
          {/* Glass Specular Refraction Highlights */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/50 via-transparent to-black/5 pointer-events-none" />
          <div className="absolute top-4 left-6 w-[2px] h-32 bg-[#111111]/60 rounded-full blur-[1px] pointer-events-none" />
          <div className="absolute bottom-4 right-6 w-3 h-3 border-r border-b border-white/30 rounded-br-lg pointer-events-none" />

          {/* Liquid Amber Core (morphs with floating movement) */}
          <motion.div 
            style={{
              rotate: liquidRotate,
              x: liquidX,
            }}
            animate={{
              borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "70% 30% 52% 48% / 60% 40% 60% 40%", "42% 58% 70% 30% / 45% 45% 55% 55%"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-44 h-44 bg-gradient-to-b from-[#276152]/80 via-[#0D3A35]/90 to-[#0B0A0A]/95 blur-[1px] shadow-inner opacity-90 flex flex-col items-center justify-center"
          >
            {/* Swirling emerald liquid highlight */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/25 via-transparent to-transparent" />
          </motion.div>

          {/* Premium Minimalist Label (Centered & Float Aligned) */}
          <div className="z-10 bg-[#111111]/90 backdrop-blur-md px-4 py-3.5 rounded-2xl border border-[#276152]/50 text-center shadow-md w-10/12 apple-sheen">
            <span className="block text-[8px] font-mono tracking-[0.25em] text-[#B1B7AB] uppercase">ScentPreview</span>
            <span className="block text-[14px] font-serif font-medium tracking-tight text-[#FBF6F0] text-shadow-sm my-[2px]">L'Eau Dorée</span>
            <span className="block text-[7px] font-mono text-[#FBF6F0] text-shadow-sm uppercase tracking-wider font-bold">Decant Studio</span>
          </div>

          {/* Micro text on the bottom edge of glass */}
          <div className="absolute bottom-4 z-10">
            <span className="text-[6px] font-mono text-[#B1B7AB] uppercase tracking-[0.3em]">50ML // COUTURE EDITION</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
