import React, { useState, useEffect, memo } from "react";
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
    return "5ml Normal";
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

  // Format clean title without all caps
  const cleanDisplayName = fragrance.name.replace(/^SCENTPREVIEW\s+/i, "ScentPreview ");

  return (
    <div 
      className="flex flex-col h-full bg-[#FFFFFF] border border-black/10 shadow-xs rounded-xl sm:rounded-2xl overflow-hidden p-0 relative transition-all hover:border-black/30 hover:shadow-md group"
    >
      {/* Fragrance Bottle Product Image Showcase - Responsive height */}
      {fragrance.image && (
        <div 
          onClick={() => onOpenDetails?.(fragrance)}
          className="w-full h-32 sm:h-44 md:h-52 bg-stone-50/70 border-b border-black/5 flex items-center justify-center p-2.5 sm:p-4 cursor-pointer overflow-hidden group/img relative"
          title={`View ${cleanDisplayName} details`}
        >
          <img 
            src={fragrance.image} 
            alt={cleanDisplayName} 
            width="220"
            height="220"
            className="h-full w-full object-contain group-hover/img:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            loading={fragrance.id === "givenchy-gentleman" ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      )}

      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        {/* Clickable Fragrance Details Area - Minimal & Yap-free */}
        <div 
          onClick={() => onOpenDetails?.(fragrance)}
          className="mb-2 sm:mb-3 cursor-pointer group/detail"
        >
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-xs sm:text-sm md:text-base font-sans font-semibold text-neutral-900 group-hover/detail:text-black group-hover/detail:underline decoration-neutral-300 underline-offset-2 leading-tight tracking-tight truncate">
              {cleanDisplayName}
            </h3>
            <span className="text-[9px] sm:text-[10px] font-mono text-neutral-400 group-hover/detail:text-black transition-colors shrink-0">
              Details ↗
            </span>
          </div>
        </div>

        <div>
          {/* Size Selection */}
          <div className="flex border border-black/10 rounded-lg overflow-hidden mb-2 bg-stone-50/50">
            {SIZES.map((size, idx, arr) => {
              const sizeStock = fragranceStock ? Number(fragranceStock[size]) || 0 : 0;
              const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || isAllSizesOutOfStock || sizeStock <= 0;
              const isSelected = !isSizeDisabled && selectedSize === size;
              
              return (
                <button
                  key={size}
                  disabled={isSizeDisabled}
                  onClick={() => handleSizeChange(size)}
                  className={`flex-1 py-1 sm:py-1.5 text-[9px] sm:text-[11px] font-sans font-medium transition-colors select-none ${
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

          {/* Action Button: Add to cart with integrated clean price */}
          <button
            disabled={isCurrentOutOfStock || isAllSizesOutOfStock}
            onClick={handleAction}
            className="w-full py-2 sm:py-2.5 bg-black text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-sans font-medium hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between px-2.5 sm:px-3 cursor-pointer shadow-xs select-none"
          >
            <span className="flex items-center gap-1 truncate">
              {added ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> : null}
              {added ? "Added!" : (isCurrentOutOfStock || isAllSizesOutOfStock) ? "Sold Out" : "Add to cart"}
            </span>
            <span className="font-mono font-bold text-[10px] sm:text-xs shrink-0 pl-1">
              ₹{price}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ScentCardComponent);
