import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fragrance, CATALOG_DATA } from "../types";
import { X, Check, ShoppingBag, RotateCcw } from "lucide-react";

interface ScentBattleProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (fragrance: Fragrance, size: "10ml" | "5ml Normal" | "5ml HQ") => void;
  stock?: {
    fragrances: Record<string, Record<string, number>>;
    bundles: Record<string, number>;
  } | null;
}

interface BattleOption {
  id: string;
  name: string;
  matchId: string;
  subtitle: string;
  description: string;
}

const STUDIO_CONCRETE: BattleOption = {
  id: "studio-concrete",
  name: "STUDIO CONCRETE",
  matchId: "ck2",
  subtitle: "MINERAL // ELECTRIC // CRISP",
  description: "A highly linear, stripped-down signature that mirrors wet cement, industrial metals, and cold air currents. Pure avant-garde precision."
};

const EVENING_TAILORING: BattleOption = {
  id: "evening-tailoring",
  name: "EVENING TAILORING",
  matchId: "givenchy-gentleman",
  subtitle: "IRIS // DARK WOOD // FORMAL",
  description: "A formal architecture of powdery iris, dense leather, and smoldering wood smoke. Structured explicitly for high-contrast environments and low light."
};

const STATEMENT_PROFILE: BattleOption = {
  id: "statement-profile",
  name: "THE STATEMENT",
  matchId: "lattafa-khamrah",
  subtitle: "WARM CINNAMON // HEAVY AMBER // DENSE",
  description: "An unapologetic, heavy-duty shield of sticky dates, spiced cognac, and sweet leather notes. Designed to command space and leave an indelible memory."
};

const MIDDAY_RESET: BattleOption = {
  id: "midday-reset",
  name: "THE MIDDAY RESET",
  matchId: "zara-sunrise",
  subtitle: "CLEAN GINGER // CREAMY CITRUS // EFFORTLESS",
  description: "An incredibly bright, revitalizing splash of sun-dried orange peel, herbal tea, and transparent musk. Built for immediate utility and daily refreshment."
};

export default function ScentBattle({ isOpen, onClose, onAddToCart, stock }: ScentBattleProps) {
  const [round, setRound] = useState<1 | 2 | 3 | 4>(1); // 1, 2, 3 are battles, 4 is victory screen
  const [activeLeft, setActiveLeft] = useState<BattleOption | null>(null);
  const [activeRight, setActiveRight] = useState<BattleOption | null>(null);
  const [winner, setWinner] = useState<BattleOption | null>(null);
  const [direction, setDirection] = useState<"left" | "right" | null>(null); // For transition sweep direction

  const [selectedSize, setSelectedSize] = useState<"10ml" | "5ml Normal" | "5ml HQ">("5ml Normal");
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Initialize or reset game
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setRound(1);
      setActiveLeft(STUDIO_CONCRETE);
      setActiveRight(EVENING_TAILORING);
      setWinner(null);
      setIsAdded(false);
      setSelectedSize("5ml Normal");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper to check stock status
  const isOutOfStockCheck = (fragId: string, size: "10ml" | "5ml Normal" | "5ml HQ") => {
    const originalFrag = CATALOG_DATA.find((f) => f.id === fragId);
    if (!originalFrag) return true;
    if (originalFrag.isOutOfStock) return true;

    if (stock?.fragrances) {
      const fragStock = stock.fragrances[fragId];
      if (fragStock) {
        if (fragStock[size] === 0) return true;
        if (Object.values(fragStock).every((qty) => qty === 0)) return true;
      }
    }
    return false;
  };

  const handleSelect = (selected: BattleOption, rejected: BattleOption, side: "left" | "right") => {
    setDirection(side);
    
    setTimeout(() => {
      if (round === 1) {
        // Round 2: Winner of Round 1 vs The Statement
        setWinner(null);
        setActiveLeft(selected);
        setActiveRight(STATEMENT_PROFILE);
        setRound(2);
      } else if (round === 2) {
        // Round 3: Winner of Round 2 vs The Midday Reset
        setWinner(null);
        setActiveLeft(selected);
        setActiveRight(MIDDAY_RESET);
        setRound(3);
      } else if (round === 3) {
        // Round 4: Winner of Round 3 is crowned champion!
        setWinner(selected);
        setRound(4);
        
        // Initialize default size for winner
        const originalFrag = CATALOG_DATA.find((f) => f.id === selected.matchId);
        if (originalFrag) {
          const disabled = originalFrag.disabledSizes || [];
          if (!disabled.includes("5ml Normal")) {
            setSelectedSize("5ml Normal");
          } else if (!disabled.includes("10ml")) {
            setSelectedSize("10ml");
          } else {
            setSelectedSize("5ml HQ");
          }
        }
      }
      setDirection(null);
    }, 200);
  };

  const handleReset = () => {
    setRound(1);
    setActiveLeft(STUDIO_CONCRETE);
    setActiveRight(EVENING_TAILORING);
    setWinner(null);
    setIsAdded(false);
  };

  const handleAcquire = () => {
    if (!winner) return;
    const original = CATALOG_DATA.find((f) => f.id === winner.matchId);
    if (!original) return;

    if (isOutOfStockCheck(winner.matchId, selectedSize)) return;

    onAddToCart(original, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const winnerFrag = winner ? CATALOG_DATA.find((f) => f.id === winner.matchId) : null;
  const disabledSizes = winnerFrag?.disabledSizes || [];
  const price = winnerFrag ? (winnerFrag.prices[selectedSize] || winnerFrag.prices["5ml Normal"]) : 0;
  const isOOS = winner ? isOutOfStockCheck(winner.matchId, selectedSize) : false;

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950 overflow-hidden flex items-center justify-center p-0 sm:p-6 md:p-12 animate-fade-in">
      <div className="w-full h-full sm:h-[85vh] max-w-4xl bg-black border-0 sm:border border-stone-900 text-stone-100 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:min-h-[500px] md:min-h-[600px] sm:max-h-[90vh] md:max-h-[900px] relative">
        
        {/* Absolute Exit Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-50 p-2 text-stone-400 hover:text-white hover:bg-stone-900 rounded-full cursor-pointer bg-stone-950/40 border border-stone-850/60 backdrop-blur-sm transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {round < 4 ? (
          /* Active Battle Split-Screen Interface */
          <div className="flex-1 flex flex-col md:flex-row h-full w-full relative">
            
            {/* Split Divider */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] md:top-0 md:bottom-0 md:left-1/2 md:w-[1px] md:h-full bg-stone-800 z-10 pointer-events-none" />

            {/* Left/Top Half (Brutalist Dark: White text on Pure Black) */}
            <button
              onClick={() => activeLeft && activeRight && handleSelect(activeLeft, activeRight, "left")}
              type="button"
              className={`w-full md:w-1/2 h-1/2 md:h-full bg-black text-stone-100 p-6 sm:p-12 flex flex-col items-center justify-center text-center relative group overflow-hidden transition-all duration-200 cursor-pointer ${
                direction === "right" ? "-translate-x-full opacity-0" : ""
              }`}
            >
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-all duration-300" />
              
              <div className="relative space-y-4 max-w-sm pointer-events-none">
                <span className="text-[10px] font-mono tracking-[0.3em] text-stone-500 uppercase block font-bold">
                  ROUND {round} // CLASH {round}-A
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tighter text-white leading-none">
                  {activeLeft?.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-stone-900 border border-stone-850 text-emerald-400 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase">
                  {activeLeft?.subtitle}
                </span>
                <p className="text-stone-400 text-xs font-light tracking-wide leading-relaxed pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                  Click to choose this frequency
                </p>
              </div>
            </button>

            {/* Right/Bottom Half (Brutalist Light: Stark Pitch-Black text on Pure White / Light Stone) */}
            <button
              onClick={() => activeLeft && activeRight && handleSelect(activeRight, activeLeft, "right")}
              type="button"
              className={`w-full md:w-1/2 h-1/2 md:h-full bg-stone-100 text-stone-950 p-6 sm:p-12 flex flex-col items-center justify-center text-center relative group overflow-hidden transition-all duration-200 cursor-pointer ${
                direction === "left" ? "translate-x-full opacity-0" : ""
              }`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 transition-all duration-300" />
              
              <div className="relative space-y-4 max-w-sm pointer-events-none">
                <span className="text-[10px] font-mono tracking-[0.3em] text-stone-500 uppercase block font-bold">
                  ROUND {round} // CLASH {round}-B
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tighter text-stone-950 leading-none">
                  {activeRight?.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-stone-200 border border-stone-300 text-stone-800 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase">
                  {activeRight?.subtitle}
                </span>
                <p className="text-stone-700 text-xs font-light tracking-wide leading-relaxed pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                  Click to choose this frequency
                </p>
              </div>
            </button>

            {/* Interactive Progress Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {[1, 2, 3].map((r) => (
                <div
                  key={r}
                  className={`h-1.5 w-8 rounded-full border transition-all ${
                    r <= round
                      ? "bg-amber-500 border-amber-500"
                      : "bg-stone-950 border-stone-800"
                  }`}
                />
              ))}
            </div>

          </div>
        ) : (
          /* Winner Showcase (Victory Panel) */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden bg-black text-white"
          >
            {/* Heavy strobe-effect gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black to-stone-900 opacity-60" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 text-center max-w-xl mx-auto space-y-6 my-auto">
              <span className="text-[10px] font-mono tracking-[0.4em] text-amber-500 uppercase font-bold block">
                TOURNAMENT CHAMPION CROWNED
              </span>

              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-mono tracking-widest text-stone-400 uppercase">
                  {winnerFrag?.brand}
                </h3>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white leading-none uppercase">
                  {winnerFrag?.name}
                </h2>
                <span className="inline-block mt-4 text-[11px] font-mono tracking-[0.25em] text-white uppercase font-bold bg-stone-900 border border-stone-800 px-4 py-1.5 rounded-full">
                  YOUR UNDISPUTED PROFILE
                </span>
              </div>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light font-sans pt-2">
                {winner?.description}
              </p>

              {/* Fragrance Customizer Controls inside Game Victory Display */}
              <div className="bg-[#111111]/80 border border-stone-850 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex items-center gap-1.5 shrink-0">
                  {(["5ml Normal", "5ml HQ", "10ml"] as const).map((sizeOption) => {
                    const isDisabled = disabledSizes.includes(sizeOption);
                    const isSelected = selectedSize === sizeOption;
                    return (
                      <button
                        key={sizeOption}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedSize(sizeOption)}
                        className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-bold transition-all ${
                          isDisabled
                            ? "opacity-25 cursor-not-allowed line-through text-stone-600 bg-transparent"
                            : isSelected
                            ? "bg-amber-500 text-stone-950"
                            : "bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                        }`}
                      >
                        {sizeOption.replace("Normal", "N").replace("HQ", "HQ")}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={isOOS}
                  onClick={handleAcquire}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md ${
                    isAdded
                      ? "bg-emerald-500 text-white"
                      : isOOS
                      ? "bg-stone-900 border border-stone-800 text-stone-500 cursor-not-allowed opacity-80"
                      : "bg-white text-stone-950 hover:bg-stone-200 cursor-pointer"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      ACQUIRED TO BOX
                    </>
                  ) : isOOS ? (
                    <>
                      OUT OF STOCK - COMING SOON
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      ACQUIRE CHAMPION DECANT - ₹{price}
                    </>
                  )}
                </button>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-stone-400 hover:text-white text-xs font-mono tracking-widest uppercase flex items-center gap-2 mx-auto cursor-pointer bg-stone-900/40 border border-stone-850 px-4 py-2 rounded-lg hover:bg-stone-900 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  RESET BATTLE BRACKET
                </button>
              </div>

            </div>

            {/* Unified Footer */}
            <div className="relative z-10 shrink-0 text-center border-t border-stone-900/60 pt-4">
              <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">
                Sterile ISO cleanroom hand-pouring // 100% authentic decanting vault
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
