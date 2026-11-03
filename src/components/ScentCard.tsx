import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fragrance, SizeType } from "../types";
import { Check } from "lucide-react";

interface ScentCardProps {
  fragrance: Fragrance;
  onAddToCart?: (fragrance: Fragrance, size: SizeType, quantity: number) => void;
  onBuyNow?: (fragrance: Fragrance, size: SizeType, quantity: number) => void;
  onNoteClick?: (note: string) => void;
  onOpenDetails?: (fragrance: Fragrance) => void;
  fragranceStock?: Record<string, number>;
}

function ScentCardComponent({ fragrance, onAddToCart, onBuyNow, onNoteClick, onOpenDetails, fragranceStock }: ScentCardProps) {
  const SIZES: SizeType[] = ["10ml", "5ml Normal", "5ml HQ"];

  // Check if all sizes are 0 or out of stock
  const isAllSizesOutOfStock = fragrance.isOutOfStock || !fragranceStock || (
    Object.values(fragranceStock).every(v => (Number(v) || 0) <= 0)
  );

  const [selectedSize, setSelectedSize] = useState<SizeType>(() => {
    for (const size of SIZES) {
      const stock = fragranceStock ? Number(fragranceStock[size]) || 0 : 0;
      const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || isAllSizesOutOfStock || stock <= 0;
      if (!isSizeDisabled) {
        return size;
      }
    }
    return "5ml Normal"; // Fallback to 5ml Normal
  });

  useEffect(() => {
    const currentStock = fragranceStock ? Number(fragranceStock[selectedSize]) || 0 : 0;
    const isCurrentOutOfStock = isAllSizesOutOfStock || fragrance.isOutOfStock || currentStock <= 0 || fragrance.disabledSizes?.includes(selectedSize);
    
    if (isCurrentOutOfStock && !isAllSizesOutOfStock) {
      for (const size of SIZES) {
        const stock = fragranceStock ? Number(fragranceStock[size]) || 0 : 0;
        const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || stock <= 0;
        if (!isSizeDisabled) {
          setSelectedSize(size);
          return;
        }
      }
    }
  }, [fragranceStock, fragrance.disabledSizes, fragrance.isOutOfStock, selectedSize, isAllSizesOutOfStock]);
  const [added, setAdded] = useState(false);

  const price = fragrance.prices[selectedSize] ?? fragrance.prices["5ml Normal"] ?? 799;
  const currentStock = fragranceStock ? Number(fragranceStock[selectedSize]) || 0 : 0;
  const isCurrentOutOfStock = isAllSizesOutOfStock || fragrance.isOutOfStock || currentStock <= 0 || fragrance.disabledSizes?.includes(selectedSize);

  const handleSizeChange = (size: SizeType) => {
    const sizeStock = fragranceStock ? Number(fragranceStock[size]) || 0 : 0;
    if (fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || isAllSizesOutOfStock || sizeStock <= 0) return;
    setSelectedSize(size);
  };

  const handleAction = () => {
    if (isCurrentOutOfStock || isAllSizesOutOfStock) return;
    onAddToCart?.(fragrance, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div 
      className="flex flex-col h-full bg-[#FFFFFF] border border-black/10 shadow-xs rounded-2xl sm:rounded-3xl overflow-hidden p-0 relative transition-all hover:border-black/30 hover:shadow-md group"
    >
      {/* Fragrance Bottle Product Image Showcase - Responsive height */}
      {fragrance.image && (
        <div 
          onClick={() => onOpenDetails?.(fragrance)}
          className="w-full h-40 sm:h-56 md:h-64 bg-stone-50/70 border-b border-black/5 flex items-center justify-center p-3 sm:p-6 cursor-pointer overflow-hidden group/img relative"
          title={`View ${fragrance.name} details`}
        >
          <img 
            src={fragrance.image} 
            alt={`${fragrance.name} (${fragrance.brand}) Perfume Decant – ScentPreview by Gephel Chingtham`} 
            width="250"
            height="250"
            className="h-full w-full object-contain group-hover/img:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            loading={fragrance.id === "givenchy-gentleman" ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      )}

      <div className="p-3.5 sm:p-6 md:p-7 flex-1 flex flex-col justify-between">
        {/* Clickable Fragrance Details Area */}
        <div 
          onClick={() => onOpenDetails?.(fragrance)}
          className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 cursor-pointer group/detail"
        >
          <div className="flex items-center justify-between gap-1.5">
            <span className="inline-block text-[8px] sm:text-[9px] font-mono uppercase tracking-wider font-bold px-1.5 sm:px-2 py-0.5 rounded bg-black text-white">
              SP Decant
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase tracking-wider truncate">
              {fragrance.brand}
            </span>
          </div>

          <div className="flex items-start justify-between gap-1.5">
            <h3 className="text-sm sm:text-lg md:text-xl font-sans font-semibold text-neutral-900 group-hover/detail:text-black group-hover/detail:underline decoration-neutral-300 underline-offset-4 leading-snug tracking-tight transition-colors line-clamp-2">
              {fragrance.name}
            </h3>
            <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 group-hover/detail:text-black transition-colors shrink-0 pt-0.5">
              Details ↗
            </span>
          </div>
          
          <p className="text-[11px] sm:text-xs font-sans text-neutral-700 leading-snug line-clamp-2">
            <span className="font-semibold text-black">Notes:</span> {fragrance.notes}
          </p>
          <p className="text-[10px] sm:text-xs font-sans text-neutral-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {fragrance.description}
          </p>
          <div className="pt-1 sm:pt-2 flex items-center justify-between gap-1">
            <span className="inline-block text-[8px] sm:text-[10px] font-sans px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-neutral-100 text-neutral-700 font-medium tracking-wide truncate max-w-[90px] sm:max-w-none">
              {fragrance.type}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-neutral-500 font-medium shrink-0">
              SP Decant
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-black/5">
          {/* Size Selection */}
          <div className="flex border border-black/10 rounded-lg sm:rounded-xl overflow-hidden mb-2.5 sm:mb-3 bg-stone-50/50">
            {SIZES.map((size, idx, arr) => {
              const sizeStock = fragranceStock ? Number(fragranceStock[size]) || 0 : 0;
              const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || isAllSizesOutOfStock || sizeStock <= 0;
              const isSelected = !isSizeDisabled && selectedSize === size;
              
              return (
                <button
                  key={size}
                  disabled={isSizeDisabled}
                  onClick={() => handleSizeChange(size)}
                  className={`flex-1 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-sans font-medium transition-colors select-none ${
                    idx !== arr.length - 1 ? 'border-r border-black/10' : ''
                  } ${
                    isSelected ? "bg-black text-white cursor-pointer active:scale-[0.98]" : isSizeDisabled ? "text-black/30 line-through cursor-not-allowed bg-black/5" : "text-black hover:bg-black/5 cursor-pointer active:scale-[0.98]"
                  }`}
                >
                  {size === "5ml Normal" ? "5ml" : size === "5ml HQ" ? "5ml HQ" : size}
                </button>
              );
            })}
          </div>

          {/* Single Action Button: Add to cart */}
          <button
            disabled={isCurrentOutOfStock || isAllSizesOutOfStock}
            onClick={handleAction}
            className="w-full py-2.5 sm:py-3.5 md:py-4 bg-black text-white rounded-xl sm:rounded-2xl text-[11px] sm:text-xs md:text-sm font-sans font-medium hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs select-none"
          >
            {added ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : null}
            {added ? "Added to Cart" : (isCurrentOutOfStock || isAllSizesOutOfStock) ? "Sold Out" : "Add to cart"}
          </button>

          {/* Price: clear below button */}
          <div className="mt-2 text-center">
            <span className="text-xs sm:text-sm font-mono font-bold text-neutral-900">
              ₹{price}
            </span>
          </div>

          {/* Fine print below */}
          <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2.5 border-t border-black/5 text-center">
            <p className="text-[8px] sm:text-[9px] font-sans text-neutral-400 leading-tight truncate">
              SP Decant • Independent rebottler
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ScentCardComponent);
