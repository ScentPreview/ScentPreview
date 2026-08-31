import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fragrance } from "../types";
import { Plus, Check, Camera } from "lucide-react";

interface ScentCardProps {
  fragrance: Fragrance;
  onAddToCart: (fragrance: Fragrance, size: "10ml" | "5ml Normal" | "5ml HQ", quantity?: number) => void;
  onBuyNow?: (fragrance: Fragrance, size: "10ml" | "5ml Normal" | "5ml HQ", quantity?: number) => void;
  fragranceStock?: Record<string, number>;
}

type SizeType = "10ml" | "5ml Normal" | "5ml HQ";

const getScentOriginalPrice = (id: string, size: SizeType): string => {
  const data: Record<string, Record<string, string>> = {
    "givenchy-gentleman": {
      "10ml": "2,187",
      "5ml Normal": "1,237",
      "5ml HQ": "1,310"
    },
    "ck2": {
      "10ml": "1,187",
      "5ml Normal": "737",
      "5ml HQ": "810"
    },
    "ck-one": {
      "10ml": "853",
      "5ml Normal": "542",
      "5ml HQ": "615"
    },
    "lattafa-khamrah": {
      "10ml": "820",
      "5ml Normal": "553",
      "5ml HQ": "627"
    },
    "zara-sunrise": {
      "10ml": "753",
      "5ml Normal": "520",
      "5ml HQ": "593"
    },
    "zara-for-him-black": {
      "10ml": "753",
      "5ml Normal": "520",
      "5ml HQ": "593"
    },
    "zara-intense-dark": {
      "10ml": "665",
      "5ml Normal": "475",
      "5ml HQ": "550"
    },
    "zara-rich-warm-addictive": {
      "10ml": "708",
      "5ml Normal": "492",
      "5ml HQ": "567"
    },
    "zara-seoul-winter": {
      "10ml": "598",
      "5ml Normal": "442",
      "5ml HQ": "517"
    },
    "zara-seoul": {
      "10ml": "582",
      "5ml Normal": "425",
      "5ml HQ": "498"
    },
    "la-uno-qaswa": {
      "10ml": "520",
      "5ml Normal": "403",
      "5ml HQ": "477"
    }
  };
  return data[id]?.[size] || "0";
};

export default function ScentCard({ fragrance, onAddToCart, onBuyNow, fragranceStock }: ScentCardProps) {
  const findFirstInStockSize = (): SizeType => {
    const sizes: SizeType[] = ["10ml", "5ml Normal", "5ml HQ"];
    const inStock = sizes.find((size) => {
      const isDisabled = fragrance.disabledSizes?.includes(size);
      const stockQty = fragranceStock ? fragranceStock[size] : undefined;
      return !isDisabled && !fragrance.isOutOfStock && (stockQty === undefined || stockQty > 0);
    });
    if (inStock) return inStock;

    const enabled = sizes.find((size) => !fragrance.disabledSizes?.includes(size));
    return enabled || "10ml";
  };

  const [selectedSize, setSelectedSize] = useState<SizeType>(() => findFirstInStockSize());
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedSize(findFirstInStockSize());
  }, [fragrance, fragranceStock]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedSize, fragrance]);

  const price = fragrance.prices[selectedSize];

  const handleSizeChange = (size: SizeType) => {
    setSelectedSize(size);
  };

  const allSizesOutOfStock = fragranceStock 
    ? Object.values(fragranceStock).every((qty) => qty === 0)
    : false;

  const currentStock = fragranceStock ? fragranceStock[selectedSize] : undefined;
  const isCurrentOutOfStock = fragrance.isOutOfStock || fragrance.disabledSizes?.includes(selectedSize) || currentStock === 0 || allSizesOutOfStock;

  const handleAction = () => {
    if (isCurrentOutOfStock) return;
    onAddToCart(fragrance, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const showLowStockAlert = (fragrance.id === "ck2" && selectedSize === "10ml" && currentStock === undefined) || (currentStock !== undefined && currentStock > 0 && currentStock <= 5);
  const stockToDisplay = currentStock !== undefined ? currentStock : 2;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300shadow-sm hover:shadow-xl hover:border-[#276152]/60 border border-[#276152]/30 bg-[#111111]/95"
    >

      {/* Discounted Price Above the Bottle */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-700/50 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#B1B7AB]/90 line-through font-normal">
            ₹{getScentOriginalPrice(fragrance.id, selectedSize)}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[8px] text-[#B1B7AB]/90 font-sans uppercase tracking-widest font-bold">
            DECANTS:
          </span>
          <span className="text-sm font-bold text-[#FBF6F0] ">
            ₹{price}.00
          </span>
        </div>
      </div>

      {/* Top Details & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#B1B7AB]/90 font-semibold">
            {fragrance.brand}
          </span>
          
          <div className="flex flex-col items-end gap-1">
            {/* Premium Tier Badge */}
            {fragrance.isPremium && (
              <span className="inline-flex items-center gap-1 bg-[#276152] text-[#FBF6F0] border border-[#0D3A35] text-[8px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                PREMIUM
              </span>
            )}
            {/* Low Stock Badge */}
            {allSizesOutOfStock ? (
              <span className="inline-flex items-center gap-1 bg-stone-900/60 border border-stone-700 text-[#B1B7AB] text-[8px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm font-bold">
                OUT OF STOCK
              </span>
            ) : currentStock !== undefined && currentStock > 0 && currentStock <= 3 ? (
              <span className="inline-flex items-center gap-1 bg-red-950/40 border border-red-900/50 text-red-400 text-[8px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm font-bold animate-pulse">
                LOW STOCK
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Title (Editorial Serif Italic) */}
        <h3 className="text-lg font-serif italic text-[#FBF6F0]  tracking-tight mb-2">
          {fragrance.name}
        </h3>
        
        {/* Scent Notes Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {fragrance.notesList.map((note) => (
            <span
              key={note}
              className="text-[10px] px-2.5 py-0.5 border border-stone-800/60 rounded-full font-mono font-medium tracking-wider transition-colors text-[#FBF6F0] bg-[#111111]/90 hover:bg-[#276152]/80 hover:border-[#276152] shadow-sm"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Size Selector Segmented Toggle */}
      <div className="mb-5">
        <span className="block text-[8px] font-mono uppercase tracking-widest text-[#B1B7AB] mb-2">
          Select Volume / Tier
        </span>
        
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#276152]/50 rounded-xl border border-stone-700/50 relative shadow-2xs">
          {(["10ml", "5ml Normal", "5ml HQ"] as SizeType[]).map((size) => {
            const isSelected = selectedSize === size;
            const sizeStock = fragranceStock ? fragranceStock[size] : undefined;
            const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || sizeStock === 0;
            
            return (
              <button
                key={size}
                type="button"
                disabled={isSizeDisabled}
                onClick={() => handleSizeChange(size)}
                className={`relative py-1.5 text-[9px] font-mono rounded-lg transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isSelected 
                    ? "bg-[#276152] text-[#FBF6F0]  font-semibold shadow-sm apple-liquid-btn" 
                    : isSizeDisabled
                      ? "text-[#B1B7AB] line-through cursor-not-allowed bg-[#111111]/30"
                      : "text-[#B1B7AB] hover:text-[#FBF6F0]  hover:bg-[#0D3A35]/60"
                }`}
              >
                <span className="truncate">{size === "5ml Normal" ? "5ml N" : size}</span>
                {isSizeDisabled && (
                  <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing & Actions Row */}
      <div className="border-t border-stone-800 pt-4 mt-auto">
        {showLowStockAlert && (
          <div className="mb-3 px-3 py-1.5 bg-amber-50/80 border border-amber-200/60 rounded-xl flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] font-mono font-medium text-amber-850 uppercase tracking-wide">
              Only {stockToDisplay} bottles left!
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 bg-[#111111]/40 border border-stone-800/20 p-2 rounded-xl">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase tracking-[0.1em] text-[#B1B7AB] font-bold">
              Subtotal Price
            </span>
            
            {/* Odometer Roll-up pricing effect */}
            <div className="h-6 overflow-hidden flex items-center mt-0.5 relative">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={selectedSize + "-" + price + "-" + quantity}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="inline-block font-mono text-sm font-semibold text-[#FBF6F0] "
                >
                  ₹{price * quantity}.00
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Premium Miniature Quantity Selector */}
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono uppercase tracking-[0.1em] text-[#B1B7AB] font-bold mb-1">
              Quantity
            </span>
            <div className="flex items-center gap-1.5 bg-[#111111]/95 border border-stone-800/60 rounded-lg p-0.5 shadow-3xs">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={isCurrentOutOfStock}
                className="w-5 h-5 flex items-center justify-center text-[#B1B7AB]/90 hover:text-[#FBF6F0]  transition-colors font-mono cursor-pointer text-xs font-semibold hover:bg-[#0D3A35]/40 rounded"
              >
                -
              </button>
              <span className="w-5 text-center font-mono text-[11px] font-bold text-[#FBF6F0] ">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => currentStock !== undefined ? Math.min(currentStock, q + 1) : q + 1)}
                disabled={isCurrentOutOfStock}
                className="w-5 h-5 flex items-center justify-center text-[#B1B7AB]/90 hover:text-[#FBF6F0]  transition-colors font-mono cursor-pointer text-xs font-semibold hover:bg-[#0D3A35]/40 rounded"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-2">
          {isCurrentOutOfStock ? (
            <button
              disabled
              className="w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase bg-[#111111]/60 text-[#B1B7AB] cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-800/40"
            >
              <span>Sold Out</span>
            </button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAction}
              className={`w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 apple-liquid-btn ${
                added
                  ? "bg-emerald-600 hover:bg-emerald-700 text-[#FBF6F0] "
                  : "bg-stone-900 hover:bg-black text-[#FBF6F0]  hover:shadow-md"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3 h-3 animate-bounce" />
                  Added To Cart
                </>
              ) : (
                <>
                  <span>Add to Cart</span>
                  <span className="opacity-60">+</span>
                </>
              )}
            </motion.button>
          )}

          {isCurrentOutOfStock ? (
            <button
              disabled
              className="w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase bg-[#0B0A0A]/40 text-[#B1B7AB] cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-800/40"
            >
              <span>Unavailable</span>
            </button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onBuyNow?.(fragrance, selectedSize, quantity)}
              className="w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 bg-amber-gold hover:bg-amber-400 text-[#111111]  font-bold shadow-md apple-liquid-btn"
            >
              Buy Now
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
