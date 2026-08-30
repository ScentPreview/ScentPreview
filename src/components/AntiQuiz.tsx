import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fragrance, CATALOG_DATA, BUNDLE_DATA } from "../types";
import { X, Check, ShieldAlert, ShoppingBag, RotateCcw } from "lucide-react";

interface AntiQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (fragrance: Fragrance, size: "10ml" | "5ml Normal" | "5ml HQ") => void;
  stock?: {
    fragrances: Record<string, Record<string, number>>;
    bundles: Record<string, number>;
  } | null;
}

interface QuizFragrance {
  id: string;
  name: string;
  brand: string;
  category: string;
  microDesc: string;
  notes: string;
  color: string;
}

const QUIZ_FRAGRANCES: QuizFragrance[] = [
  {
    id: "givenchy-gentleman",
    name: "Givenchy Gentleman",
    brand: "Givenchy",
    category: "Premium Tier",
    microDesc: "Rich. Iris. Powdery.",
    notes: "Iris / Black Pepper / Leather",
    color: "from-neutral-800 to-black"
  },
  {
    id: "ck2",
    name: "Calvin Klein CK2",
    brand: "Calvin Klein",
    category: "Premium Tier",
    microDesc: "Cobblestone. Electric. Clean.",
    notes: "Wasabi / Violet Leaf / Wet Cobblestones",
    color: "from-sky-100 to-sky-300"
  },
  {
    id: "ck-one",
    name: "Calvin Klein CK One",
    brand: "Calvin Klein",
    category: "Clean Tier",
    microDesc: "Classic. Citrus. Light.",
    notes: "Lemon / Green Tea / Jasmine",
    color: "from-stone-200 to-stone-400"
  },
  {
    id: "lattafa-khamrah",
    name: "Lattafa Khamrah",
    brand: "Lattafa",
    category: "Heavy Tier",
    microDesc: "Cinnamon. Dates. Amber.",
    notes: "Cinnamon / Dates / Pure Vanilla",
    color: "from-amber-600 to-amber-900"
  },
  {
    id: "la-uno-qaswa",
    name: "La Uno Qaswa",
    brand: "La Uno",
    category: "Dark/Oud Tier",
    microDesc: "Leather. Smoke. Wood.",
    notes: "Oud / Incense / Dark Woods",
    color: "from-stone-800 to-emerald-950"
  },
  {
    id: "zara-sunrise",
    name: "Zara Sunrise",
    brand: "Zara",
    category: "Fresh Tier",
    microDesc: "Citrus. Ginger. Orange.",
    notes: "Bergamot / Mandarin / Soft Amber",
    color: "from-orange-400 to-amber-600"
  },
  {
    id: "zara-for-him-black",
    name: "Zara For Him Black",
    brand: "Zara",
    category: "Dark Tier",
    microDesc: "Cardamom. Iris. Vanilla.",
    notes: "Ginger / Lavender / Cedarwood",
    color: "from-violet-950 to-neutral-900"
  },
  {
    id: "zara-intense-dark",
    name: "Zara Intense Dark",
    brand: "Zara",
    category: "Heavy Tier",
    microDesc: "Tobacco. Spice. Leather.",
    notes: "Apple / Black Pepper / Tonka Bean",
    color: "from-indigo-900 to-zinc-950"
  },
  {
    id: "zara-seoul-winter",
    name: "Zara Seoul Winter",
    brand: "Zara",
    category: "Fresh/Sweet Tier",
    microDesc: "Apple. Mint. Amber.",
    notes: "Tangerine / Apple / Amber",
    color: "from-sky-300 to-blue-700"
  }
];

interface Dealbreaker {
  id: string;
  label: string;
  eliminates: string[]; // Fragrance IDs eliminated by this dealbreaker
}

const DEALBREAKERS: Dealbreaker[] = [
  {
    id: "cloying",
    label: "Too Sweet / Cloying",
    eliminates: ["lattafa-khamrah", "zara-seoul-winter", "zara-intense-dark"]
  },
  {
    id: "heavy",
    label: "Heavy, Loud & Suffocating",
    eliminates: ["lattafa-khamrah", "la-uno-qaswa", "givenchy-gentleman"]
  },
  {
    id: "basic",
    label: "Too Basic / Just Smells Clean",
    eliminates: ["ck-one", "zara-sunrise"]
  },
  {
    id: "shaving",
    label: "Harsh / Synthetic Shaving Gel Vibe",
    eliminates: ["zara-seoul-winter"]
  },
  {
    id: "grandpa",
    label: "Smoky / Leather / Grandpa Vibe",
    eliminates: ["la-uno-qaswa", "givenchy-gentleman", "zara-intense-dark"]
  }
];

export default function AntiQuiz({ isOpen, onClose, onAddToCart, stock }: AntiQuizProps) {
  const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, "10ml" | "5ml Normal" | "5ml HQ">>({});

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

  // Helper to determine if the vault bundle is out of stock
  const isVaultOutOfStock = () => {
    const vaultBundle = BUNDLE_DATA.find((b) => b.id === "bundle-master-vault");
    if (!vaultBundle) return true;
    if (vaultBundle.isOutOfStock) return true;
    if (stock?.bundles) {
      const bundleStock = stock.bundles["bundle-master-vault"];
      if (bundleStock === 0) return true;
    }
    return false;
  };

  // Reset the quiz when opened or closed
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedDealbreakers([]);
      setIsFiltered(false);
      setAddedIds({});
      // Initialize default sizes based on CATALOG_DATA availability
      const defaultSizes: Record<string, "10ml" | "5ml Normal" | "5ml HQ"> = {};
      QUIZ_FRAGRANCES.forEach((f) => {
        const fullFrag = CATALOG_DATA.find((x) => x.id === f.id);
        if (fullFrag) {
          const disabled = fullFrag.disabledSizes || [];
          if (!disabled.includes("5ml Normal")) {
            defaultSizes[f.id] = "5ml Normal";
          } else if (!disabled.includes("10ml")) {
            defaultSizes[f.id] = "10ml";
          } else {
            defaultSizes[f.id] = "5ml HQ";
          }
        } else {
          defaultSizes[f.id] = "5ml Normal";
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

  // Toggle dealbreaker
  const handleToggleDealbreaker = (id: string) => {
    if (selectedDealbreakers.includes(id)) {
      setSelectedDealbreakers(selectedDealbreakers.filter((x) => x !== id));
    } else {
      setSelectedDealbreakers([...selectedDealbreakers, id]);
    }
  };

  // Compute survivors (disqualification mechanics)
  const eliminatedIds = Array.from(
    new Set(
      selectedDealbreakers.flatMap(
        (id) => DEALBREAKERS.find((db) => db.id === id)?.eliminates || []
      )
    )
  );

  const survivors = QUIZ_FRAGRANCES.filter((f) => !eliminatedIds.includes(f.id));

  // Handle action filter submission
  const handleFilter = () => {
    setIsFiltered(true);
  };

  const handleReset = () => {
    setSelectedDealbreakers([]);
    setIsFiltered(false);
    setAddedIds({});
  };

  // Add a survivor to cart
  const handleAddSurvivorToCart = (fragId: string) => {
    const fullFragrance = CATALOG_DATA.find((f) => f.id === fragId);
    if (!fullFragrance) return;

    const size = selectedSizes[fragId] || "5ml Normal";
    if (isOutOfStockCheck(fragId, size)) return;

    onAddToCart(fullFragrance, size);

    setAddedIds((prev) => ({ ...prev, [fragId]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [fragId]: false }));
    }, 1800);
  };

  // Special handler for Master Layering Vault
  const handleAddVaultToCart = () => {
    if (isVaultOutOfStock()) return;
    const vaultBundle = BUNDLE_DATA.find((b) => b.id === "bundle-master-vault");
    if (!vaultBundle) return;
    // Map bundle to temporary fragrance object for standard cart operations
    const mockFrag: Fragrance = {
      id: vaultBundle.id,
      name: vaultBundle.name,
      brand: "ScentPreview Vault",
      isPremium: true,
      isOutOfStock: false,
      notes: vaultBundle.contains,
      notesList: [vaultBundle.contains],
      prices: vaultBundle.prices || {
        "10ml": 665,
        "5ml Normal": 444,
        "5ml HQ": 623
      },
      color: "from-amber-600 to-amber-900",
      glassStyle: "shadow-amber-700/50"
    };
    onAddToCart(mockFrag, "5ml Normal");
    setAddedIds((prev) => ({ ...prev, "master-vault": true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, "master-vault": false }));
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-lg overflow-hidden flex items-center justify-center p-0 sm:p-6 md:p-12 animate-fade-in">
      <div className="w-full h-full sm:h-[85vh] max-w-4xl bg-[#0B0B0B] border-0 sm:border border-stone-800 text-stone-100 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row sm:min-h-[500px] md:min-h-[600px] sm:max-h-[90vh] md:max-h-[900px] relative">
        
        {/* Absolute Close Button for Mobile/Tablet */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-50 p-2 text-[#B1B7AB] hover:text-[#FBF6F0] text-shadow-sm hover:bg-stone-900 rounded-full md:hidden cursor-pointer bg-stone-950/40 border border-stone-800/60 backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Dynamic Visualization / Elimination Mechanics Screen */}
        <div className="w-full md:w-5/12 bg-[#111111] p-5 sm:p-8 border-b md:border-b-0 md:border-r border-stone-800/80 flex flex-col justify-between shrink-0 md:shrink relative overflow-hidden">
          {/* Ambient overlay */}
          
          <div className="relative z-10 space-y-4 md:space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-[0.2em] text-amber-500 uppercase font-bold">
                LAB SYSTEM 2.0 // BYPASS SEARCH
              </span>
              <h3 className="text-2xl font-serif italic text-[#FBF6F0] text-shadow-sm tracking-wide">
                The Anti-Quiz
              </h3>
            </div>

            <p className="text-xs text-[#B1B7AB] font-sans leading-relaxed font-light hidden xs:block line-clamp-2 sm:line-clamp-none">
              Standard search assumes you know what you want. We do not. Tell us what you absolutely despise, and we will chemically bypass those profiles to isolate your signature scent.
            </p>

            {/* Live survivors tracking with kinetic status indicator */}
            <div className="border-t border-stone-800/60 pt-4 md:pt-6 space-y-3 md:space-y-4">
              <span className="text-[10px] font-mono text-[#B1B7AB] uppercase tracking-widest block font-bold">
                Live Isolated Catalog
              </span>

              <div className="flex items-center gap-3 bg-stone-950/60 border border-stone-850 px-4 py-2.5 md:py-3 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 border border-stone-800 shrink-0 font-mono text-xs font-bold text-emerald-400">
                  <motion.span
                    key={survivors.length}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    {survivors.length}
                  </motion.span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#B1B7AB] block">
                    {survivors.length === 1 ? "Survivor" : "Survivors"} remaining
                  </span>
                  <span className="text-[9px] font-mono text-[#B1B7AB]/90">
                    {survivors.length === 0 ? "Perfect Filter Set" : "Isolating chemical notes..."}
                  </span>
                </div>
              </div>

              {/* Fragrance roster with fade & cross out state */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 md:pt-2">
                {QUIZ_FRAGRANCES.map((f, i) => {
                  const isEliminated = eliminatedIds.includes(f.id);
                  return (
                    <motion.div
                      key={f.id}
                      initial={false}
                      animate={{
                        opacity: isFiltered ? (isEliminated ? 0.05 : 1) : (isEliminated ? 0.25 : 1),
                        scale: isEliminated ? 0.95 : 1
                      }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className={`p-2 rounded border text-center relative overflow-hidden transition-all duration-300 ${
                        isEliminated 
                          ? "bg-stone-950/40 border-stone-900 text-[#B1B7AB] line-through" 
                          : "bg-stone-900 border-stone-800 text-[#B1B7AB]"
                      }`}
                    >
                      <div className="text-[9px] font-mono tracking-tighter truncate font-medium">
                        {f.brand}
                      </div>
                      <div className={`text-[8px] font-sans truncate ${isEliminated ? "line-through opacity-40" : "text-[#B1B7AB] font-light"}`}>
                        {f.name.replace("Calvin Klein ", "").replace("Zara ", "")}
                      </div>
                    </motion.div>
                  );
                })}
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

        {/* Right Side: Interactive Layout or Payoff Screen */}
        <div className="w-full md:w-7/12 bg-[#0B0B0B] p-5 sm:p-8 flex flex-col justify-between overflow-y-auto">
          
          <AnimatePresence mode="wait">
            {!isFiltered ? (
              /* Phase 1: Selection Checklist */
              <motion.div
                key="selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B1B7AB] font-bold">
                      Isolate Dealbreakers // Select what you hate
                    </h4>
                    <button
                      onClick={onClose}
                      className="hidden md:block text-[#B1B7AB]/90 hover:text-[#B1B7AB] transition-colors cursor-pointer p-1 rounded-full hover:bg-stone-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Vertical stack of Dealbreaker Cards */}
                  <div className="space-y-3">
                    {DEALBREAKERS.map((db) => {
                      const isSelected = selectedDealbreakers.includes(db.id);
                      return (
                        <button
                          key={db.id}
                          type="button"
                          onClick={() => handleToggleDealbreaker(db.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                            isSelected
                              ? "bg-stone-900 border-amber-500/40 text-stone-100"
                              : "bg-stone-950 border-stone-850 text-[#B1B7AB] hover:border-stone-700 hover:text-[#B1B7AB]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? "border-amber-500 bg-amber-500/10" : "border-stone-700 group-hover:border-stone-500"
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                            </div>
                            <span className={`text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                              isSelected ? "line-through text-[#B1B7AB]/90 font-bold" : "font-normal"
                            }`}>
                              {db.label}
                            </span>
                          </div>
                          
                          <span className="text-[9px] font-mono text-[#B1B7AB]/90 uppercase tracking-widest group-hover:text-[#B1B7AB] transition-colors">
                            {isSelected ? "[BYPASSED]" : "EXCLUDE"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-900">
                  <button
                    type="button"
                    onClick={handleFilter}
                    disabled={selectedDealbreakers.length === 0}
                    className={`w-full py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-lg ${
                      selectedDealbreakers.length > 0
                        ? "bg-[#276152] text-[#FBF6F0] text-shadow-sm hover:bg-[#0D3A35] cursor-pointer"
                        : "bg-stone-900 text-[#B1B7AB] border border-stone-850 cursor-not-allowed"
                    }`}
                  >
                    Filter Out the Noise ({selectedDealbreakers.length} active)
                  </button>
                  <p className="text-center text-[9px] font-mono text-[#B1B7AB]/90 mt-3 uppercase tracking-wider">
                    Chemical formulation compiles instantly upon click
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Phase 2: Payoff / Remaining survivors */
              <motion.div
                key="payoff"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between shrink-0">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                        CHEMICAL COMPILATION SUCCESSFUL
                      </span>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-[#B1B7AB] font-bold">
                        Your Tailored Chemical Match
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

                  {survivors.length === 0 ? (
                    /* Edge case: Zero survivors */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-stone-950 border border-stone-850/80 rounded-2xl space-y-5 my-auto">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/25">
                        <ShieldAlert className="w-6 h-6 text-amber-500 animate-pulse" />
                      </div>
                      <div className="space-y-2 max-w-sm">
                        <p className="text-sm font-serif italic text-stone-100 leading-relaxed">
                          "You hate everything. Perfect. Try the Master Layering Vault."
                        </p>
                        <p className="text-[11px] text-[#B1B7AB]/90 font-sans leading-relaxed">
                          By eliminating all simple styles, your subconscious demands complex, customizable olfactory layering. We have isolated the ultimate solution.
                        </p>
                      </div>
                      
                      <div className="pt-2 w-full max-w-xs space-y-2">
                        <button
                          type="button"
                          disabled={isVaultOutOfStock()}
                          onClick={handleAddVaultToCart}
                          className={`w-full py-3.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 ${
                            isVaultOutOfStock()
                              ? "bg-stone-900 border border-stone-800 text-[#B1B7AB]/90 cursor-not-allowed opacity-80"
                              : "bg-amber-500 hover:bg-amber-400 text-[#111111] cursor-pointer"
                          }`}
                        >
                          {addedIds["master-vault"] ? (
                            <>
                              <Check className="w-3.5 h-3.5 animate-scaleUp" />
                              ADDED TO ARCHIVE
                            </>
                          ) : isVaultOutOfStock() ? (
                            <>
                              OUT OF STOCK - COMING SOON
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              ACQUIRE VAULT DUO - ₹665
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="w-full py-2.5 bg-transparent border border-stone-800 hover:border-stone-600 text-[#B1B7AB] hover:text-[#FBF6F0] text-shadow-sm rounded-xl text-[10px] font-mono tracking-wider uppercase transition-all"
                        >
                          Reset & Try Again
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display survivors */
                    <div className="flex-1 md:overflow-y-auto pr-1 space-y-4 max-h-none md:max-h-[45vh] lg:max-h-[50vh] scrollbar-thin">
                      {survivors.map((surv) => {
                        const originalFrag = CATALOG_DATA.find((cf) => cf.id === surv.id);
                        if (!originalFrag) return null;
                        
                        const disabledSizes = originalFrag.disabledSizes || [];
                        const currentSize = selectedSizes[surv.id] || "5ml Normal";
                        const price = originalFrag.prices[currentSize] || originalFrag.prices["5ml Normal"];
                        const isAdded = addedIds[surv.id];

                        return (
                          <motion.div
                            key={surv.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-stone-950 border border-stone-850 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-700 transition-all group"
                          >
                            <div className="space-y-2 max-w-xs sm:max-w-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono font-bold text-[#B1B7AB] uppercase tracking-widest border border-stone-800 px-2 py-0.5 rounded-sm">
                                  {surv.brand}
                                </span>
                                <span className="text-[9px] font-mono font-semibold text-emerald-400 uppercase tracking-wide">
                                  {surv.category}
                                </span>
                              </div>
                              <div>
                                <h5 className="text-lg font-serif font-bold text-[#FBF6F0] text-shadow-sm uppercase tracking-tight">
                                  {surv.name}
                                </h5>
                                <p className="text-xs font-serif italic text-amber-500 mt-0.5">
                                  "{surv.microDesc}"
                                </p>
                              </div>
                              <p className="text-[10px] font-mono text-[#B1B7AB]/90 uppercase tracking-wider">
                                Notes: {surv.notes}
                              </p>
                            </div>

                            {/* Controls for Add to Cart */}
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-900 shrink-0">
                              <div className="space-y-1 text-left sm:text-right">
                                <span className="block text-xs font-mono text-[#B1B7AB]/90">
                                  Select Extraction Size
                                </span>
                                {/* Size selector */}
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
                                    onClick={() => handleAddSurvivorToCart(surv.id)}
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
                    Adjust Excluded Notes
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
