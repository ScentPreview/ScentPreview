import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fragrance, CATALOG_DATA } from "../types";
import { X, Check, ShoppingBag, Music, RotateCcw } from "lucide-react";

interface ChordQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (fragrance: Fragrance, size: "10ml" | "5ml Normal" | "5ml HQ") => void;
  stock?: {
    fragrances: Record<string, Record<string, number>>;
    bundles: Record<string, number>;
  } | null;
}

interface ScentNoteNode {
  id: string;
  name: string;
  type: "Base" | "Heart" | "Top";
  desc: string;
  matchedFragrances: string[]; // Fragrance IDs
}

const SCENT_NODES: ScentNoteNode[] = [
  {
    id: "iris",
    name: "Powdery Iris",
    type: "Heart",
    desc: "Elegant, clean, velvet wood texture.",
    matchedFragrances: ["givenchy-gentleman", "zara-for-him-black"]
  },
  {
    id: "stone",
    name: "Wet Cobblestone",
    type: "Base",
    desc: "Hyper-modern, mineral, urban rain feel.",
    matchedFragrances: ["ck2"]
  },
  {
    id: "cinnamon",
    name: "Warm Cinnamon",
    type: "Top",
    desc: "Spicy, sweet, luxurious golden syrup aura.",
    matchedFragrances: ["lattafa-khamrah", "zara-intense-dark"]
  },
  {
    id: "leather",
    name: "Deep Leather",
    type: "Base",
    desc: "Heavy, smoky, confidence of dark woods.",
    matchedFragrances: ["la-uno-qaswa", "zara-intense-dark"]
  },
  {
    id: "citrus",
    name: "Bright Mandarin",
    type: "Top",
    desc: "Crisp ginger, clean citrus, sun-dried orange.",
    matchedFragrances: ["zara-sunrise", "ck-one"]
  },
  {
    id: "mint",
    name: "Cool Mint",
    type: "Top",
    desc: "Crisp green apple, arctic wind, sweet amber.",
    matchedFragrances: ["zara-seoul-winter"]
  }
];

export default function ChordQuiz({ isOpen, onClose, onAddToCart, stock }: ChordQuizProps) {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, "10ml" | "5ml Normal" | "5ml HQ">>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedNodes([]);
      setIsRevealed(false);
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
      setSelectedSizes(defaultSizes);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

  const handleToggleNode = (id: string) => {
    if (selectedNodes.includes(id)) {
      setSelectedNodes(selectedNodes.filter((x) => x !== id));
    } else {
      if (selectedNodes.length >= 2) {
        // Limit to max 2 nodes to create a precise "Scent Chord"
        setSelectedNodes([selectedNodes[1], id]);
      } else {
        setSelectedNodes([...selectedNodes, id]);
      }
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleReset = () => {
    setSelectedNodes([]);
    setIsRevealed(false);
    setAddedIds({});
  };

  // Find matching fragrances based on selected scent nodes
  const getMatches = () => {
    if (selectedNodes.length === 0) return [];
    
    // Union of matches for selected nodes
    const matchedFragranceIds = Array.from(
      new Set(
        selectedNodes.flatMap(
          (nodeId) => SCENT_NODES.find((node) => node.id === nodeId)?.matchedFragrances || []
        )
      )
    );

    return CATALOG_DATA.filter((f) => matchedFragranceIds.includes(f.id));
  };

  const matches = getMatches();

  const handleAddMatch = (fragId: string) => {
    const original = CATALOG_DATA.find((f) => f.id === fragId);
    if (!original) return;

    const size = selectedSizes[fragId] || "5ml Normal";
    if (isOutOfStockCheck(fragId, size)) return;

    onAddToCart(original, size);

    setAddedIds((prev) => ({ ...prev, [fragId]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [fragId]: false }));
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950/98 backdrop-blur-lg overflow-hidden flex items-center justify-center p-0 sm:p-6 md:p-12 animate-fade-in">
      <div className="w-full h-full sm:h-[85vh] max-w-4xl bg-[#0B0B0B] border-0 sm:border border-stone-850 text-stone-100 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row sm:min-h-[500px] md:min-h-[600px] sm:max-h-[90vh] md:max-h-[900px] relative">
        
        {/* Absolute Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-50 p-2 text-[#B1B7AB] hover:text-[#FBF6F0] text-shadow-sm hover:bg-stone-900 rounded-full cursor-pointer bg-stone-950/40 border border-stone-800/60 backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Chord visualization panel */}
        <div className="w-full md:w-5/12 bg-[#111111] p-5 sm:p-8 border-b md:border-b-0 md:border-r border-stone-800/80 flex flex-col justify-between shrink-0 md:shrink relative overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-[200px] h-[200px] bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="relative z-10 space-y-4 md:space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-[0.2em] text-emerald-400 uppercase font-bold">
                LAB SYSTEM 2.0 // CHORD SYNTHESIS
              </span>
              <h3 className="text-2xl font-serif italic text-[#FBF6F0] text-shadow-sm tracking-wide">
                Chemical Chord Matcher
              </h3>
            </div>

            <p className="text-xs text-[#B1B7AB] font-sans leading-relaxed font-light hidden xs:block line-clamp-2 sm:line-clamp-none">
              Like sound waves, fragrance molecules strike the senses in pairs. Select exactly two complementary raw chemical notes below to synthesize your custom scent chord.
            </p>

            {/* Dynamic visual representation of the active chord */}
            <div className="border-t border-stone-800/60 pt-4 md:pt-6 space-y-4">
              <span className="text-[10px] font-mono text-[#B1B7AB] uppercase tracking-widest block font-bold">
                Active Chemical Chord
              </span>

              <div className="space-y-2">
                {selectedNodes.length === 0 ? (
                  <div className="h-16 rounded-lg border border-dashed border-stone-800 flex items-center justify-center bg-stone-950/40">
                    <span className="text-[10px] font-mono text-stone-650 uppercase tracking-widest">
                      [Select 2 chemical elements]
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedNodes.map((nodeId, index) => {
                      const node = SCENT_NODES.find((n) => n.id === nodeId);
                      return (
                        <div
                          key={nodeId}
                          className="bg-stone-950/80 border border-amber-500/30 p-3 rounded-lg text-left"
                        >
                          <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest block font-bold">
                            Node {index + 1} / {node?.type}
                          </span>
                          <span className="text-xs font-serif font-bold text-[#FBF6F0] text-shadow-sm block truncate">
                            {node?.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex relative z-10 pt-8 border-t border-stone-800/60 items-center justify-between text-[10px] font-mono text-[#B1B7AB]/90 uppercase tracking-widest">
            <span>ScentPreview Secure UI</span>
            <button
              type="button"
              onClick={onClose}
              className="text-[#B1B7AB] hover:text-[#FBF6F0] text-shadow-sm transition-colors cursor-pointer"
            >
              Exit Lab
            </button>
          </div>
        </div>

        {/* Right Side: Selection Checklist or Matches Revealed */}
        <div className="w-full md:w-7/12 bg-[#0B0B0B] p-5 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              /* Phase 1: Clean selection map of raw notes */
              <motion.div
                key="chord-selector"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B1B7AB] font-bold">
                      Synthesize Chemical Nodes // Limit 2
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SCENT_NODES.map((node) => {
                      const isSelected = selectedNodes.includes(node.id);
                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => handleToggleNode(node.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden group ${
                            isSelected
                              ? "bg-stone-900 border-emerald-500/40 text-stone-100"
                              : "bg-stone-950 border-stone-850 text-[#B1B7AB] hover:border-stone-700 hover:text-[#B1B7AB]"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-[8px] font-mono uppercase tracking-widest ${isSelected ? "text-emerald-400" : "text-[#B1B7AB]/90"}`}>
                              {node.type} Node
                            </span>
                            <div className={`w-2 h-2 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-emerald-400 bg-emerald-500" : "border-stone-700"
                            }`} />
                          </div>

                          <div className="space-y-0.5 mt-2">
                            <span className={`text-sm font-serif font-bold block ${isSelected ? "text-[#FBF6F0] text-shadow-sm" : "text-[#B1B7AB]"}`}>
                              {node.name}
                            </span>
                            <p className="text-[9px] font-sans text-[#B1B7AB]/90 leading-tight font-light truncate">
                              {node.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-900">
                  <button
                    type="button"
                    onClick={handleReveal}
                    disabled={selectedNodes.length !== 2}
                    className={`w-full py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-lg ${
                      selectedNodes.length === 2
                        ? "bg-[#276152] text-[#FBF6F0] text-shadow-sm hover:bg-[#0D3A35] cursor-pointer"
                        : "bg-stone-900 text-[#B1B7AB] border border-stone-850 cursor-not-allowed"
                    }`}
                  >
                    Synthesize Scent Chord ({selectedNodes.length}/2 Active)
                  </button>
                  <p className="text-center text-[9px] font-mono text-[#B1B7AB]/90 mt-3 uppercase tracking-wider">
                    Chemical formulation compiles instantly upon click
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Phase 2: Beautiful payoff page for selected chord */
              <motion.div
                key="chord-payoff"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between shrink-0">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                        CHORD SYNTHESIS COMPLETE
                      </span>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-[#B1B7AB] font-bold">
                        Compiled Scent Molecules
                      </h4>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-xs font-mono text-[#B1B7AB] hover:text-[#FBF6F0] text-shadow-sm flex items-center gap-1.5 cursor-pointer bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <RotateCcw className="w-3 h-3" />
                      RESTART
                    </button>
                  </div>

                  {matches.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-stone-950 border border-stone-850/80 rounded-2xl space-y-4 my-auto">
                      <p className="text-sm font-serif italic text-[#B1B7AB]">
                        "Your selected chemical chord is highly complex."
                      </p>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="py-2.5 px-6 bg-[#276152] text-[#FBF6F0] text-shadow-sm rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all shadow"
                      >
                        Adjust Selected Nodes
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 md:overflow-y-auto pr-1 space-y-4 max-h-none md:max-h-[45vh] lg:max-h-[50vh] scrollbar-thin">
                      {matches.map((surv) => {
                        const disabledSizes = surv.disabledSizes || [];
                        const currentSize = selectedSizes[surv.id] || "5ml Normal";
                        const price = surv.prices[currentSize] || surv.prices["5ml Normal"];
                        const isAdded = addedIds[surv.id];

                        return (
                          <motion.div
                            key={surv.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-stone-950 border border-stone-850 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-700 transition-all group"
                          >
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-mono font-bold text-[#B1B7AB] uppercase tracking-widest border border-stone-800 px-2 py-0.5 rounded-sm">
                                {surv.brand}
                              </span>
                              <h5 className="text-lg font-serif font-bold text-[#FBF6F0] text-shadow-sm uppercase tracking-tight">
                                {surv.name}
                              </h5>
                              <p className="text-[10px] font-mono text-[#B1B7AB]/90 uppercase tracking-wider line-clamp-1">
                                Notes: {surv.notes}
                              </p>
                            </div>

                            {/* Controls for Add to Cart */}
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-900 shrink-0">
                              <div className="space-y-1 text-left sm:text-right">
                                <div className="flex gap-1.5">
                                  {(["5ml Normal", "5ml HQ", "10ml"] as const).map((sizeOption) => {
                                    const isDisabled = disabledSizes.includes(sizeOption);
                                    const isSelected = currentSize === sizeOption;
                                    return (
                                      <button
                                        key={sizeOption}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [surv.id]: sizeOption }))}
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
                              </div>

                              {(() => {
                                const isOOS = isOutOfStockCheck(surv.id, currentSize);
                                return (
                                  <button
                                    type="button"
                                    disabled={isOOS}
                                    onClick={() => handleAddMatch(surv.id)}
                                    className={`w-full sm:w-36 py-2 px-3 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow ${
                                      isAdded
                                        ? "bg-emerald-500 text-[#FBF6F0] text-shadow-sm"
                                        : isOOS
                                        ? "bg-stone-900 border border-stone-800 text-[#B1B7AB]/90 cursor-not-allowed opacity-80"
                                        : "bg-[#276152] text-[#FBF6F0] text-shadow-sm hover:bg-[#0D3A35] cursor-pointer"
                                    }`}
                                  >
                                    {isAdded ? (
                                      <>
                                        <Check className="w-3 h-3 animate-scaleUp" />
                                        ADDED
                                      </>
                                    ) : isOOS ? (
                                      <>
                                        OUT OF STOCK - COMING SOON
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingBag className="w-3 h-3" />
                                        ADD - ₹{price}
                                      </>
                                    )}
                                  </button>
                                );
                              })()}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-900 flex flex-col sm:flex-row gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-[#B1B7AB] rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all"
                  >
                    Adjust Selection Chord
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 bg-[#276152] hover:bg-[#0D3A35] text-[#FBF6F0] text-shadow-sm rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all shadow"
                  >
                    Return to Archive Catalog
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
