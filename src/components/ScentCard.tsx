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
      className="relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 apple-glass apple-sheen shadow-sm hover:shadow-xl hover:border-white/90 border border-white/60 bg-white/70 backdrop-blur-md"
    >
      {/* Decorative background aura for Premium variants */}
      {fragrance.isPremium && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Discounted Price Above the Bottle */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/40 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-stone-500 line-through font-normal">
            ₹{getScentOriginalPrice(fragrance.id, selectedSize)}
          </span>
          <span className="text-[8.5px] text-emerald-700 font-sans font-bold bg-emerald-50/80 border border-emerald-100/60 px-1.5 py-0.5 rounded-full shadow-2xs">
            40% OFF
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[8px] text-stone-500 font-sans uppercase tracking-widest font-bold">
            DECANTS:
          </span>
          <span className="text-sm font-bold text-stone-900">
            ₹{price}.00
          </span>
        </div>
      </div>

      {/* Product Image */}
      {fragrance.image && (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 border border-white/90 bg-stone-100/60 shadow-inner">
          <img
            src={fragrance.image}
            alt={fragrance.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {allSizesOutOfStock ? (
            <div className="absolute top-2 left-2 bg-stone-800 text-white text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md shadow-md z-10 font-bold border border-stone-700">
              Sold Out
            </div>
          ) : currentStock !== undefined && currentStock > 0 && currentStock <= 3 ? (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md shadow-md z-10 font-bold border border-red-500/30 animate-pulse">
              Low Stock ({currentStock})
            </div>
          ) : null}
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-[3px] py-1 px-2 text-center text-[8.5px] font-sans text-stone-200 rounded-lg pointer-events-none border border-white/10">
            Images are AI and not the actual bottles
          </div>
        </div>
      )}

      {/* Top Details & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-stone-500 font-semibold">
            {fragrance.brand}
          </span>
          
          <div className="flex flex-col items-end gap-1">
            {/* Premium Tier Badge */}
            {fragrance.isPremium && (
              <span className="inline-flex items-center gap-1 bg-stone-900 text-white text-[8px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                PREMIUM
              </span>
            )}
            {/* Low Stock Badge */}
            {allSizesOutOfStock ? (
              <span className="inline-flex items-center gap-1 bg-stone-100 border border-stone-200 text-stone-500 text-[8px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm font-bold">
                OUT OF STOCK
              </span>
            ) : currentStock !== undefined && currentStock > 0 && currentStock <= 3 ? (
              <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 text-[8px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm font-bold animate-pulse">
                LOW STOCK
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Title (Editorial Serif Italic) */}
        <h3 className="text-lg font-serif italic text-stone-900 tracking-tight mb-2">
          {fragrance.name}
        </h3>
        
        {/* Scent Notes Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {fragrance.notesList.map((note) => (
            <span
              key={note}
              className="text-[9px] px-2.5 py-0.5 border rounded-full font-sans tracking-wide transition-colors border-white/80 text-stone-700 bg-white/60 hover:bg-white/85 shadow-3xs"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Size Selector Segmented Toggle */}
      <div className="mb-5">
        <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-400 mb-2">
          Select Volume / Tier
        </span>
        
        <div className="grid grid-cols-3 gap-1 p-1 bg-stone-200/50 backdrop-blur-sm rounded-xl border border-white/40 relative shadow-2xs">
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
                    ? "bg-white text-stone-900 font-semibold shadow-sm apple-liquid-btn" 
                    : isSizeDisabled
                      ? "text-stone-400 line-through cursor-not-allowed bg-stone-100/30"
                      : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
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
      <div className="border-t border-white/50 pt-4 mt-auto">
        {showLowStockAlert && (
          <div className="mb-3 px-3 py-1.5 bg-amber-50/80 border border-amber-200/60 rounded-xl flex items-center gap-1.5 backdrop-blur-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] font-mono font-medium text-amber-850 uppercase tracking-wide">
              Only {stockToDisplay} bottles left!
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 bg-stone-100/40 border border-stone-200/20 p-2 rounded-xl">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase tracking-[0.1em] text-stone-400 font-bold">
              Subtotal Price
            </span>
            
            {/* Odometer Roll-up pricing effect */}
            <div className="h-6 overflow-hidden flex items-center mt-0.5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={selectedSize + "-" + price + "-" + quantity}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="inline-block font-mono text-sm font-semibold text-stone-900"
                >
                  ₹{price * quantity}.00
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Premium Miniature Quantity Selector */}
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono uppercase tracking-[0.1em] text-stone-400 font-bold mb-1">
              Quantity
            </span>
            <div className="flex items-center gap-1.5 bg-white/95 border border-stone-200/60 rounded-lg p-0.5 shadow-3xs">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={isCurrentOutOfStock}
                className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors font-mono cursor-pointer text-xs font-semibold hover:bg-stone-50 rounded"
              >
                -
              </button>
              <span className="w-5 text-center font-mono text-[11px] font-bold text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => currentStock !== undefined ? Math.min(currentStock, q + 1) : q + 1)}
                disabled={isCurrentOutOfStock}
                className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors font-mono cursor-pointer text-xs font-semibold hover:bg-stone-50 rounded"
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
              className="w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase bg-stone-100/60 text-stone-400 cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-200/40"
            >
              <span>Sold Out</span>
            </button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAction}
              className={`w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 apple-liquid-btn ${
                added
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-stone-900 hover:bg-black text-white hover:shadow-md"
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
              className="w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase bg-stone-50/40 text-stone-300 cursor-not-allowed flex items-center justify-center gap-1.5 border border-stone-100/30"
            >
              <span>Unavailable</span>
            </button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onBuyNow?.(fragrance, selectedSize, quantity)}
              className="w-full py-2.5 px-3 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-white font-bold shadow-md apple-liquid-btn"
            >
              Buy Now
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
