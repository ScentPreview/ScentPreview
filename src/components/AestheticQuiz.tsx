import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fragrance, CATALOG_DATA } from "../types";
import { X, Check, ShoppingBag, ArrowLeft, Layers } from "lucide-react";

interface AestheticQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (fragrance: Fragrance, size: "10ml" | "5ml Normal" | "5ml HQ") => void;
  stock?: {
    fragrances: Record<string, Record<string, number>>;
    bundles: Record<string, number>;
  } | null;
}

interface ProfileItem {
  id: string;
  num: string;
  title: string;
  vibe: string;
  threeWords: string[];
  breakdown: string;
  matchedIds: string[]; // Fragrance IDs
}

const PROFILES: ProfileItem[] = [
  {
    id: "studio",
    num: "01",
    title: "The Studio Archetype",
    vibe: "Concrete. Structured. Minimal.",
    threeWords: ["Concrete", "Structured", "Minimal"],
    breakdown: "Built on sharp precision, raw elements, and mineral textures. A clean, linear profile stripped of all unnecessary weight.",
    matchedIds: ["ck2", "ck-one"]
  },
  {
    id: "tailoring",
    num: "02",
    title: "The Evening Tailoring",
    vibe: "Formal. Dark. Iris.",
    threeWords: ["Formal", "Dark", "Iris"],
    breakdown: "A sophisticated composition of iris, smoke, and dark woods. Designed for formal wear, low light, and high contrast.",
    matchedIds: ["givenchy-gentleman", "zara-for-him-black"]
  },
  {
    id: "statement",
    num: "03",
    title: "The Statement Profile",
    vibe: "Rich. Amber. Leather.",
    threeWords: ["Rich", "Amber", "Leather"],
    breakdown: "An unapologetic blend of warm cinnamon, rich dates, and heavy amber. A dense, high-performance profile that commands space.",
    matchedIds: ["lattafa-khamrah", "la-uno-qaswa"]
  },
  {
    id: "midday",
    num: "04",
    title: "The Midday Transition",
    vibe: "Bright. Crisp. Ginger.",
    threeWords: ["Bright", "Crisp", "Ginger"],
    breakdown: "Effortless and balanced, pairing clean citrus with transparent herbal tea notes. Pure utility for daytime environments.",
    matchedIds: ["ck-one", "zara-sunrise"]
  }
];

export default function AestheticQuiz({ isOpen, onClose, onAddToCart, stock }: AestheticQuizProps) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<Record<string, "10ml" | "5ml Normal" | "5ml HQ">>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Helper to determine if a specific fragrance/size is out of stock
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedProfile(null);
      setAddedIds({});
      // Initialize default sizes for matches
      const defaultSizes: Record<string, "10ml" | "5ml Normal" | "5ml HQ"> = {};
      CATALOG_DATA.forEach((f) => {
        const disabled = f.disabledSizes || [];
        if (!disabled.includes("5ml Normal")) {
          defaultSizes[f.id] = "5ml Normal";
        } else if (!disabled.includes("10ml")) {
          defaultSizes[f.id] = "10ml";
        } else {
          defaultSizes[f.id] = "5ml HQ";
        }
      });
      setSelectedSize(defaultSizes);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectProfile = (profile: ProfileItem) => {
    setSelectedProfile(profile);
  };

  const handleBackToGrid = () => {
    setSelectedProfile(null);
  };

  const handleAddFragrance = (fragId: string) => {
    const original = CATALOG_DATA.find((f) => f.id === fragId);
    if (!original) return;

    const size = selectedSize[fragId] || "5ml Normal";
    if (isOutOfStockCheck(fragId, size)) return;

    onAddToCart(original, size);

    setAddedIds((prev) => ({ ...prev, [fragId]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [fragId]: false }));
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950/98 backdrop-blur-lg overflow-hidden flex items-center justify-center p-0 sm:p-6 md:p-12 animate-fade-in">
      <div className="w-full h-full sm:h-[85vh] max-w-4xl bg-[#0B0B0B] border-0 sm:border border-stone-850 text-stone-100 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:min-h-[500px] md:min-h-[600px] sm:max-h-[90vh] md:max-h-[900px] relative">
        
        {/* Absolute Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-50 p-2 text-[#B1B7AB] hover:text-[#FBF6F0] text-shadow-sm hover:bg-stone-900 rounded-full cursor-pointer bg-stone-950/40 border border-stone-800/60 backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Header */}
        <div className="border-b border-stone-900 px-6 py-4 flex items-center justify-between bg-[#111111]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-stone-900 border border-stone-800 flex items-center justify-center">
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-emerald-400 uppercase font-bold block">
                LAB SYSTEM 2.0 // AESTHETIC CHANNEL
              </span>
              <h3 className="text-sm sm:text-base font-serif italic text-[#FBF6F0] text-shadow-sm tracking-wide">
                Lifestyle Profile Selector
              </h3>
            </div>
          </div>
          <div className="hidden sm:block text-[10px] font-mono text-[#B1B7AB]/90 uppercase tracking-widest">
            {selectedProfile ? "Revealing Matched Scent" : "Select Your Vibe"}
          </div>
        </div>

        {/* Dynamic Body Panel */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!selectedProfile ? (
              /* Phase 1: 2x2 Clean Geometric Grid */
              <motion.div
                key="grid"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full space-y-6"
              >
                <div className="text-center max-w-lg mx-auto space-y-2 mb-2">
                  <h4 className="text-xl sm:text-2xl font-serif text-[#FBF6F0] text-shadow-sm tracking-tight">
                    Select a channel to project today.
                  </h4>
                  <p className="text-xs text-[#B1B7AB] font-sans leading-relaxed font-light">
                    Click an archetype below to reveal the specific molecules structured to project that physical environment and mental frequency.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROFILES.map((profile) => (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => handleSelectProfile(profile)}
                      className="group relative w-full h-40 sm:h-44 text-left p-6 bg-stone-950 hover:bg-[#111111] border border-stone-900 hover:border-stone-700 rounded-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                    >
                      {/* Accent Light Layer */}
                      
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-mono tracking-widest text-[#B1B7AB] group-hover:text-amber-500 transition-colors">
                          {profile.num} / ARCHETYPE
                        </span>
                        <span className="text-[9px] font-mono text-[#B1B7AB]/90 uppercase tracking-widest bg-stone-900 border border-stone-850 px-2.5 py-1 rounded">
                          SELECT
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h5 className="text-lg font-serif font-bold text-stone-250 group-hover:text-[#FBF6F0] text-shadow-sm transition-colors">
                          {profile.title}
                        </h5>
                        <p className="text-xs font-serif italic text-[#B1B7AB] group-hover:text-emerald-400 transition-colors">
                          "{profile.vibe}"
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Phase 2: Beautiful payoff page for selected profile */
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl mx-auto space-y-6"
              >
                {/* Back to Profiles navigation */}
                <button
                  type="button"
                  onClick={handleBackToGrid}
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#B1B7AB] hover:text-[#FBF6F0] text-shadow-sm hover:bg-stone-900/60 border border-stone-900 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Profiles
                </button>

                {/* Aesthetic Detail Display Card */}
                <div className="bg-[#111111]/80 border border-stone-850 p-6 sm:p-8 rounded-2xl space-y-4 relative overflow-hidden">
                  
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-[0.25em] text-amber-500 uppercase font-bold">
                      SYSTEM DETECTED ARCHETYPE: {selectedProfile.num}
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-serif text-[#FBF6F0] text-shadow-sm tracking-tight">
                      {selectedProfile.title}
                    </h4>
                  </div>

                  {/* Vibe badge stack */}
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.threeWords.map((word) => (
                      <span
                        key={word}
                        className="px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-stone-900 border border-stone-800 text-emerald-400"
                      >
                        {word}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm font-sans text-[#B1B7AB] leading-relaxed font-light">
                    {selectedProfile.breakdown}
                  </p>
                </div>

                {/* Matches Showcase */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-mono text-[#B1B7AB]/90 uppercase tracking-widest font-bold">
                    UNLOCKED SIGNATURE MATCHES
                  </h5>

                  <div className="space-y-3">
                    {selectedProfile.matchedIds.map((fragId) => {
                      const originalFrag = CATALOG_DATA.find((f) => f.id === fragId);
                      if (!originalFrag) return null;

                      const disabledSizes = originalFrag.disabledSizes || [];
                      const currentSize = selectedSize[fragId] || "5ml Normal";
                      const price = originalFrag.prices[currentSize] || originalFrag.prices["5ml Normal"];
                      const isAdded = addedIds[fragId];

                      return (
                        <div
                          key={fragId}
                          className="bg-stone-950 border border-stone-900 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-700 transition-all group"
                        >
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-mono font-bold text-[#B1B7AB]/90 uppercase tracking-widest">
                              {originalFrag.brand}
                            </span>
                            <h6 className="text-base sm:text-lg font-serif text-[#FBF6F0] text-shadow-sm uppercase tracking-tight">
                              {originalFrag.name}
                            </h6>
                            <p className="text-[10px] sm:text-xs font-sans text-[#B1B7AB] font-light line-clamp-1">
                              Notes: {originalFrag.notes}
                            </p>
                          </div>

                          {/* Order Actions */}
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0">
                            <div className="flex items-center gap-1.5">
                              {(["5ml Normal", "5ml HQ", "10ml"] as const).map((sizeOption) => {
                                const isDisabled = disabledSizes.includes(sizeOption);
                                const isSelected = currentSize === sizeOption;
                                return (
                                  <button
                                    key={sizeOption}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => setSelectedSize((prev) => ({ ...prev, [fragId]: sizeOption }))}
                                    className={`px-2 py-1 rounded text-[9px] font-mono font-bold transition-all ${
                                      isDisabled
                                        ? "opacity-25 cursor-not-allowed line-through text-[#B1B7AB] bg-transparent"
                                        : isSelected
                                        ? "bg-amber-500 text-[#111111]"
                                        : "bg-stone-900 text-[#B1B7AB] hover:bg-stone-800 hover:text-[#B1B7AB]"
                                    }`}
                                  >
                                    {sizeOption.replace("Normal", "N").replace("HQ", "HQ")}
                                  </button>
                                );
                              })}
                            </div>

                             {(() => {
                               const isOOS = isOutOfStockCheck(fragId, currentSize);
                               return (
                                 <button
                                   type="button"
                                   disabled={isOOS}
                                   onClick={() => handleAddFragrance(fragId)}
                                   className={`w-32 sm:w-36 py-2 px-3 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow ${
                                     isAdded
                                       ? "bg-emerald-500 text-[#FBF6F0] text-shadow-sm"
                                       : isOOS
                                       ? "bg-stone-900 border border-stone-800 text-[#B1B7AB]/90 cursor-not-allowed opacity-80"
                                       : "bg-[#276152] text-[#FBF6F0] text-shadow-sm hover:bg-[#0D3A35] cursor-pointer"
                                   }`}
                                 >
                                   {isAdded ? (
                                     <>
                                       <Check className="w-3 h-3" />
                                       ADDED
                                     </>
                                   ) : isOOS ? (
                                     <>
                                       OUT OF STOCK - COMING SOON
                                     </>
                                   ) : (
                                     <>
                                       <ShoppingBag className="w-3 h-3" />
                                       PREVIEW - ₹{price}
                                     </>
                                   )}
                                 </button>
                               );
                             })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stable Footer */}
        <div className="border-t border-stone-900 px-6 py-4 bg-[#111111]/80 shrink-0 text-center">
          <p className="text-[9px] font-mono text-[#B1B7AB]/90 uppercase tracking-widest">
            {selectedProfile 
              ? "All Decants are Hand-Poured inside Sterile ISO Cleanrooms" 
              : "Bypasses Traditional Olfactory Searching with Aesthetic Modeling"
            }
          </p>
        </div>

      </div>
    </div>
  );
}
