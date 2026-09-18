import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fragrance, SizeType } from "../types";
import { Check } from "lucide-react";

interface ScentCardProps {
  fragrance: Fragrance;
  onAddToCart?: (fragrance: Fragrance, size: SizeType, quantity: number) => void;
  onBuyNow?: (fragrance: Fragrance, size: SizeType, quantity: number) => void;
  onNoteClick?: (note: string) => void;
  fragranceStock?: Record<string, number>;
}

export default function ScentCard({ fragrance, onAddToCart, onBuyNow, onNoteClick, fragranceStock }: ScentCardProps) {
  const [selectedSize, setSelectedSize] = useState<SizeType>(() => {
    const sizes: SizeType[] = ["10ml", "5ml Normal", "5ml HQ"];
    for (const size of sizes) {
      const stock = fragranceStock ? fragranceStock[size] : undefined;
      const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || stock === 0;
      if (!isSizeDisabled) {
        return size;
      }
    }
    return "10ml"; // Fallback if all are out of stock
  });

  useEffect(() => {
    const currentStock = fragranceStock ? fragranceStock[selectedSize] : undefined;
    const isCurrentOutOfStock = fragrance.isOutOfStock || (currentStock !== undefined && currentStock === 0) || fragrance.disabledSizes?.includes(selectedSize);
    
    if (isCurrentOutOfStock) {
      const sizes: SizeType[] = ["10ml", "5ml Normal", "5ml HQ"];
      for (const size of sizes) {
        const stock = fragranceStock ? fragranceStock[size] : undefined;
        const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || stock === 0;
        if (!isSizeDisabled) {
          setSelectedSize(size);
          return;
        }
      }
    }
  }, [fragranceStock, fragrance.disabledSizes, fragrance.isOutOfStock, selectedSize]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = fragrance.prices[selectedSize];
  const currentStock = fragranceStock ? fragranceStock[selectedSize] : undefined;
  const isCurrentOutOfStock = fragrance.isOutOfStock || (currentStock !== undefined && currentStock === 0) || fragrance.disabledSizes?.includes(selectedSize);
  const stockToDisplay = currentStock !== undefined && currentStock <= 5 && currentStock > 0 ? currentStock : null;
  const showLowStockAlert = stockToDisplay !== null;

  const handleSizeChange = (size: SizeType) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleAction = () => {
    onAddToCart?.(fragrance, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-col h-full bg-[#FFFFFF] border border-black/5 shadow-sm rounded-3xl overflow-hidden p-0 relative"
    >
      

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-sans font-semibold text-neutral-900 mb-1 leading-snug tracking-tight">{fragrance.name}</h3>
        
        <div className="space-y-2 mb-6 flex-1">
          <p className="text-xs font-sans text-neutral-700 leading-relaxed">
            <span className="font-semibold text-black">Notes:</span> {fragrance.notes}
          </p>
          <p className="text-xs font-sans text-neutral-600 leading-relaxed">
            {fragrance.description}
          </p>
          <div className="pt-1">
            <span className="inline-block text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium">
              {fragrance.type}
            </span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="flex border border-black/5 rounded-2xl overflow-hidden mb-3">
          {(["10ml", "5ml Normal", "5ml HQ"] as SizeType[]).map((size, idx) => {
            const isSelected = selectedSize === size;
            const sizeStock = fragranceStock ? fragranceStock[size] : undefined;
            const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || sizeStock === 0;
            
            return (
              <button
                key={size}
                disabled={isSizeDisabled}
                onClick={() => handleSizeChange(size)}
                className={`flex-1 py-2 text-[10px] font-sans font-medium transition-colors ${
                  idx !== 2 ? 'border-r border-black/5' : ''
                } ${
                  isSelected ? "bg-black text-white" : isSizeDisabled ? "text-black/40 line-through cursor-not-allowed bg-black/5" : "text-black hover:bg-black/5"
                }`}
              >
                {size.replace('ml Normal', ' (N)').replace('ml HQ', ' (HQ)')}
              </button>
            );
          })}
        </div>

        {/* Quantity Selection */}
        <div className="flex items-center justify-between border border-black/5 rounded-2xl px-3 py-1.5 mb-3 bg-stone-50/50">
          <span className="text-[11px] font-sans text-neutral-600 font-medium">Quantity</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={isCurrentOutOfStock}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 text-black font-sans text-xs disabled:opacity-30 transition-colors cursor-pointer"
            >-</button>
            <span className="w-5 text-center font-sans text-xs font-semibold text-black">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => currentStock !== undefined ? Math.min(currentStock, q + 1) : q + 1)}
              disabled={isCurrentOutOfStock}
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 text-black font-sans text-xs disabled:opacity-30 transition-colors cursor-pointer"
            >+</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={isCurrentOutOfStock}
            onClick={handleAction}
            className="py-2.5 border border-black/10 rounded-2xl text-[11px] font-sans font-medium text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            {added ? <Check className="w-3.5 h-3.5" /> : null}
            {added ? "Added" : isCurrentOutOfStock ? "Sold out" : "Add to Cart"}
          </button>
          <button
            disabled={isCurrentOutOfStock}
            onClick={() => onBuyNow?.(fragrance, selectedSize, quantity)}
            className="py-2.5 bg-black text-white rounded-2xl text-[11px] font-sans font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            Buy Now
          </button>
        </div>

        {/* Price: small below the buy/add to cart */}
        <div className="mt-2 text-center">
          <span className="text-xs font-mono font-medium text-neutral-600">
            ₹{price * quantity}
            {quantity > 1 ? (
              <span className="text-[10px] text-neutral-400 ml-1">
                (₹{price} each)
              </span>
            ) : null}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
