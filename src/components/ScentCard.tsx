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
                <h3 className="text-2xl font-sans font-bold text-black uppercase mb-3 leading-none tracking-tight">{fragrance.name}</h3>
        
        <div className="space-y-2 mb-6 flex-1">
          <p className="text-[11px] font-mono font-medium text-black uppercase tracking-wider">
            Notes: {fragrance.notes}
          </p>
          <p className="text-[11px] font-sans text-black leading-relaxed">
            Profile: {fragrance.description}
          </p>
          <p className="text-[11px] font-mono font-medium text-black uppercase tracking-wider">
            Tag: {fragrance.type}
          </p>
        </div>

        {/* Size Selection */}
        <div className="flex border border-black/5 rounded-2xl overflow-hidden mb-4">
          {(["10ml", "5ml Normal", "5ml HQ"] as SizeType[]).map((size, idx) => {
            const isSelected = selectedSize === size;
            const sizeStock = fragranceStock ? fragranceStock[size] : undefined;
            const isSizeDisabled = fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || sizeStock === 0;
            
            return (
              <button
                key={size}
                disabled={isSizeDisabled}
                onClick={() => handleSizeChange(size)}
                className={`flex-1 py-2 text-[9px] font-sans uppercase tracking-widest transition-colors ${
                  idx !== 2 ? 'border-r border-black/5' : ''
                } ${
                  isSelected ? "bg-black text-white" : isSizeDisabled ? "text-black/40 line-through cursor-not-allowed bg-black/5" : "text-black hover:bg-black/5"
                }`}
              >
                {size.replace('ml Normal', 'N').replace('ml HQ', 'HQ').replace('ml', 'ML')}
              </button>
            );
          })}
        </div>

        {/* Quantity and Price */}
        <div className="flex items-stretch border border-black/5 rounded-2xl overflow-hidden mb-4 h-10">
          <div className="flex-1 flex items-center justify-center border-r border-black/5 font-sans text-sm font-bold text-black">
            ₹{price * quantity}
          </div>
          <div className="flex items-center w-24">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={isCurrentOutOfStock}
              className="flex-1 h-full flex items-center justify-center hover:bg-black/5 text-black border-r border-black/5 font-sans"
            >-</button>
            <span className="flex-1 text-center font-sans text-[11px] font-bold text-black">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => currentStock !== undefined ? Math.min(currentStock, q + 1) : q + 1)}
              disabled={isCurrentOutOfStock}
              className="flex-1 h-full flex items-center justify-center hover:bg-black/5 text-black border-l border-black/5 font-sans"
            >+</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={isCurrentOutOfStock}
            onClick={handleAction}
            className="py-3 border border-black/5 rounded-2xl overflow-hidden text-[9px] font-sans uppercase tracking-widest font-bold text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            {added ? <Check className="w-3 h-3" /> : null}
            {added ? "ADDED" : isCurrentOutOfStock ? "SOLD OUT" : "ADD TO CART"}
          </button>
          <button
            disabled={isCurrentOutOfStock}
            onClick={() => onBuyNow?.(fragrance, selectedSize, quantity)}
            className="py-3 bg-black text-white text-[9px] font-sans uppercase tracking-widest font-bold hover:bg-[#0E0E0E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </motion.div>
  );
}
