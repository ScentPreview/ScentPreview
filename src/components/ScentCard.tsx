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

  const [selectedSize, setSelectedSize] = useState<SizeType>(() => {
    for (const size of SIZES) {
      const stock = fragranceStock ? fragranceStock[size] : undefined;
      const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || stock === 0;
      if (!isSizeDisabled) {
        return size;
      }
    }
    return "5ml Normal"; // Fallback to 5ml Normal if 10ml is out of stock / disabled
  });

  useEffect(() => {
    const currentStock = fragranceStock ? fragranceStock[selectedSize] : undefined;
    const isCurrentOutOfStock = fragrance.isOutOfStock || (currentStock !== undefined && currentStock === 0) || fragrance.disabledSizes?.includes(selectedSize);
    
    if (isCurrentOutOfStock) {
      for (const size of SIZES) {
        const stock = fragranceStock ? fragranceStock[size] : undefined;
        const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || stock === 0;
        if (!isSizeDisabled) {
          setSelectedSize(size);
          return;
        }
      }
    }
  }, [fragranceStock, fragrance.disabledSizes, fragrance.isOutOfStock, selectedSize]);
  const [added, setAdded] = useState(false);

  const price = fragrance.prices[selectedSize] ?? fragrance.prices["5ml Normal"] ?? 799;
  const currentStock = fragranceStock ? fragranceStock[selectedSize] : undefined;
  const isCurrentOutOfStock = fragrance.isOutOfStock || (currentStock !== undefined && currentStock === 0) || fragrance.disabledSizes?.includes(selectedSize);

  const handleSizeChange = (size: SizeType) => {
    setSelectedSize(size);
  };

  const handleAction = () => {
    if (isCurrentOutOfStock) return;
    onAddToCart?.(fragrance, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div 
      className="flex flex-col h-full bg-[#FFFFFF] border border-black/10 shadow-sm rounded-3xl overflow-hidden p-0 relative transition-all hover:border-black/30 hover:shadow-md group"
    >
      {/* Fragrance Bottle Product Image Showcase - Static height, no layout shifts */}
      {fragrance.image && (
        <div 
          onClick={() => onOpenDetails?.(fragrance)}
          className="w-full h-56 sm:h-64 bg-stone-50/70 border-b border-black/5 flex items-center justify-center p-6 cursor-pointer overflow-hidden group/img relative"
          title={`View ${fragrance.name} details`}
        >
          <img 
            src={fragrance.image} 
            alt={fragrance.name} 
            width="250"
            height="250"
            className="h-full w-full object-contain"
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
        </div>
      )}

      <div className="p-6 sm:p-7 md:p-8 flex-1 flex flex-col justify-between">
        {/* Clickable Fragrance Details Area */}
        <div 
          onClick={() => onOpenDetails?.(fragrance)}
          className="space-y-3 mb-6 cursor-pointer group/detail"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-sans font-semibold text-neutral-900 group-hover/detail:text-black group-hover/detail:underline decoration-neutral-300 underline-offset-4 leading-snug tracking-tight transition-colors">
              {fragrance.name}
            </h3>
            <span className="text-[11px] font-mono text-neutral-400 group-hover/detail:text-black transition-colors shrink-0 pt-0.5">
              Details ↗
            </span>
          </div>
          
          <p className="text-xs font-sans text-neutral-700 leading-relaxed">
            <span className="font-semibold text-black">Notes:</span> {fragrance.notes}
          </p>
          <p className="text-xs font-sans text-neutral-600 leading-relaxed line-clamp-2">
            {fragrance.description}
          </p>
          <div className="pt-2 flex items-center justify-between">
            <span className="inline-block text-[10px] font-sans px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 font-medium tracking-wide">
              {fragrance.type}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-black/5">
          {/* Size Selection */}
          <div className="flex border border-black/10 rounded-xl overflow-hidden mb-3 bg-stone-50/50">
            {SIZES.map((size, idx, arr) => {
              const isSelected = selectedSize === size;
              const sizeStock = fragranceStock ? fragranceStock[size] : undefined;
              const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || sizeStock === 0;
              
              return (
                <button
                  key={size}
                  disabled={isSizeDisabled}
                  onClick={() => handleSizeChange(size)}
                  className={`flex-1 py-2 sm:py-2.5 text-[11px] sm:text-xs font-sans font-medium transition-colors cursor-pointer select-none active:scale-[0.98] ${
                    idx !== arr.length - 1 ? 'border-r border-black/10' : ''
                  } ${
                    isSelected ? "bg-black text-white" : isSizeDisabled ? "text-black/30 line-through cursor-not-allowed bg-black/5" : "text-black hover:bg-black/5"
                  }`}
                >
                  {size === "5ml Normal" ? "5ml" : size === "5ml HQ" ? "5ml (HQ)" : size}
                </button>
              );
            })}
          </div>

          {/* Single Action Button: Add to cart */}
          <button
            disabled={isCurrentOutOfStock}
            onClick={handleAction}
            className="w-full py-3.5 sm:py-4 bg-black text-white rounded-2xl text-xs sm:text-sm font-sans font-medium hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm select-none"
          >
            {added ? <Check className="w-4 h-4" /> : null}
            {added ? "Added to Cart" : isCurrentOutOfStock ? "Sold Out" : "Add to cart"}
          </button>

          {/* Price: clear below button */}
          <div className="mt-2.5 text-center">
            <span className="text-xs font-mono font-semibold text-neutral-700">
              ₹{price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ScentCardComponent);
