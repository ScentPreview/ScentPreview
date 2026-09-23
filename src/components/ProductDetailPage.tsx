import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Check, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Droplets, 
  Truck, 
  RotateCcw,
  Share2
} from "lucide-react";
import { Fragrance, SizeType } from "../types";
import ScentCard from "./ScentCard";
import RubberSegment from "./RubberSegment";

interface ProductDetailPageProps {
  fragrance: Fragrance;
  onBack: () => void;
  onSelectFragrance: (fragrance: Fragrance) => void;
  onAddToCart: (fragrance: Fragrance, size: SizeType, quantity: number) => void;
  onBuyNow: (fragrance: Fragrance, size: SizeType, quantity: number) => void;
  fragranceStock?: Record<string, number>;
  allFragrances: Fragrance[];
  stock?: any;
}

export default function ProductDetailPage({
  fragrance,
  onBack,
  onSelectFragrance,
  onAddToCart,
  onBuyNow,
  fragranceStock,
  allFragrances,
  stock,
}: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState<SizeType>("10ml");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyDirectLink = () => {
    try {
      const subdomain = fragrance.subdomainSlug || `scentpreview${fragrance.id.replace(/-/g, "")}`;
      // Direct URL with pathname parameter or subdomain
      const url = `${window.location.origin}${window.location.pathname}?perfume=${encodeURIComponent(fragrance.id)}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch (e) {}
  };

  // Scroll to top immediately when opening or changing fragrance so user sees the selected perfume profile first
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const el = document.getElementById("product-detail-view");
    if (el) {
      el.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [fragrance.id]);

  // Initialize selected size to first in-stock size when fragrance changes
  useEffect(() => {
    const sizes: SizeType[] = ["10ml", "5ml Normal", "5ml HQ"];
    for (const size of sizes) {
      const stockVal = fragranceStock ? fragranceStock[size] : undefined;
      const isSizeDisabled =
        fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || stockVal === 0;
      if (!isSizeDisabled) {
        setSelectedSize(size);
        setQuantity(1);
        return;
      }
    }
    setSelectedSize("10ml");
    setQuantity(1);
  }, [fragrance.id, fragranceStock]);

  const currentStock = fragranceStock ? fragranceStock[selectedSize] : undefined;
  const isCurrentOutOfStock =
    fragrance.isOutOfStock ||
    (currentStock !== undefined && currentStock === 0) ||
    fragrance.disabledSizes?.includes(selectedSize);

  const price = (fragrance.prices && fragrance.prices[selectedSize]) ?? fragrance.prices?.["5ml Normal"] ?? 799;
  const totalPrice = price * quantity;

  const handleSizeChange = (size: SizeType) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleAdd = () => {
    if (isCurrentOutOfStock) return;
    onAddToCart(fragrance, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuy = () => {
    if (isCurrentOutOfStock) return;
    onBuyNow(fragrance, selectedSize, quantity);
  };

  // Filter other perfumes to show "another bunch of perfumes below that" like Amazon
  const otherPerfumes = allFragrances
    .filter((f) => f.id !== fragrance.id)
    .sort((a, b) => {
      // Prioritize same gender or matching notes
      const aMatch = a.gender === fragrance.gender ? 1 : 0;
      const bMatch = b.gender === fragrance.gender ? 1 : 0;
      return bMatch - aMatch;
    });

  return (
    <div id="product-detail-view" className="w-full min-h-screen bg-[#F4F4F2] pb-24">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="max-w-7xl mx-auto px-5 md:px-12 pt-8 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-sans font-medium text-neutral-800 hover:text-black transition-colors cursor-pointer group"
          >
            <span className="p-1 rounded-full bg-white border border-black/10 group-hover:border-black transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-800 group-hover:-translate-x-0.5 transition-transform" />
            </span>
            <span>Back to all perfumes</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-sans text-neutral-500">
              <span onClick={onBack} className="hover:text-black cursor-pointer">Archive</span>
              <span>/</span>
              <span>{fragrance.gender || "Unisex"} Collection</span>
              <span>/</span>
              <span className="text-neutral-900 font-medium">{fragrance.name}</span>
            </div>
            
            <button
              onClick={handleCopyDirectLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/10 hover:border-black text-[11px] font-sans text-neutral-800 transition-all cursor-pointer shadow-xs"
              title="Copy permanent shareable link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Share / Direct Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Amazon-Style Product Showcase */}
      <section className="max-w-7xl mx-auto px-5 md:px-12 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          {/* Left Column: Product Visual Card & Olfactory Profile */}
          <div className="lg:col-span-7 space-y-6">
            {/* High-End Clean Presentation Card */}
            <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-xs relative overflow-hidden">
              {/* Top Meta Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 font-semibold">
                  {fragrance.brand}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-sans px-2.5 py-1 rounded-full bg-black text-white font-medium">
                    {fragrance.type || "AUTHENTIC DECANT"}
                  </span>
                  {fragrance.isPremium && (
                    <span className="text-[10px] font-sans px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Premium Extraction
                    </span>
                  )}
                </div>
              </div>

              {/* Fragrance Bottle Product Showcase */}
              {fragrance.image && (
                <div className="w-full h-72 sm:h-80 md:h-96 rounded-2xl bg-stone-50/70 border border-black/5 flex items-center justify-center p-8 mb-8 overflow-hidden">
                  <img
                    src={fragrance.image}
                    alt={fragrance.name}
                    width="400"
                    height="400"
                    className="h-full w-full object-contain drop-shadow-md"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                  />
                </div>
              )}

              {/* Title & Brand */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-neutral-950 tracking-tight leading-[1.05] mb-8">
                {fragrance.name}
              </h1>

              {/* Description */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xs font-sans font-semibold tracking-wide text-neutral-900 uppercase">
                  Olfactory Character & Profile
                </h3>
                <p className="text-sm font-sans text-neutral-700 leading-relaxed">
                  {fragrance.description}
                </p>
              </div>

              {/* Notes Chords Static Badges */}
              <div className="bg-stone-50/90 rounded-2xl p-5 border border-black/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold text-neutral-900">
                    Chords & Notes Breakdown
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fragrance.notesList.map((note) => (
                    <span
                      key={note}
                      className="text-xs font-sans font-medium px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-neutral-800 shadow-xs"
                    >
                      {note}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] font-sans text-neutral-500 pt-1">
                  Full accord: <span className="text-neutral-800 font-medium">{fragrance.notes}</span>
                </p>
              </div>

              {/* Quality & Cleanroom Extraction Assurances */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-black/5">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50/60 border border-black/5">
                  <Droplets className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-sans font-semibold text-neutral-900 block">100% Pure Juice</span>
                    <span className="text-[10px] font-sans text-neutral-500">Drawn from original retail flacons</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50/60 border border-black/5">
                  <Truck className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-sans font-semibold text-neutral-900 block">Safe Dispatch</span>
                    <span className="text-[10px] font-sans text-neutral-500">Air-tight & leak-tested packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Amazon-Style Buy Box */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Dynamic Price Display */}
              <div className="border-b border-black/5 pb-5">
                <span className="text-xs font-sans font-medium text-neutral-500 block mb-1">
                  Decant Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-neutral-950">
                    ₹{totalPrice}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs font-mono text-neutral-500">
                      (₹{price} each × {quantity})
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-sans text-neutral-500 mt-1">
                  Inclusive of sterile packaging & fine-mist atomizer
                </p>

                {/* Tier Discount Callout - Sleek & Editorial */}
                {totalPrice >= 2500 ? (
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono border-t border-black/5 pt-2 text-neutral-800">
                    <span className="text-neutral-500">Tier Privilege:</span>
                    <span className="font-semibold text-neutral-900 bg-black/5 px-2 py-0.5 rounded text-[10px]">
                      25% OFF Unlocked
                    </span>
                  </div>
                ) : totalPrice >= 1500 ? (
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono border-t border-black/5 pt-2 text-neutral-800">
                    <span className="text-neutral-500">Tier Privilege:</span>
                    <span className="font-semibold text-neutral-900 bg-black/5 px-2 py-0.5 rounded text-[10px]">
                      20% OFF Unlocked
                    </span>
                  </div>
                ) : totalPrice >= 999 ? (
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono border-t border-black/5 pt-2 text-neutral-800">
                    <span className="text-neutral-500">Tier Privilege:</span>
                    <span className="font-semibold text-neutral-900 bg-black/5 px-2 py-0.5 rounded text-[10px]">
                      10% OFF Unlocked
                    </span>
                  </div>
                ) : (
                  <div className="mt-2.5 flex items-center justify-between text-[10.5px] font-mono text-neutral-500 border-t border-black/5 pt-2">
                    <span>Next Tier:</span>
                    <span>+₹{999 - totalPrice} for 10% OFF</span>
                  </div>
                )}
              </div>

              {/* Size Selector (Smaller & Sleeker) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-sans font-semibold text-neutral-800 uppercase tracking-wider">
                    Size
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {selectedSize}
                  </span>
                </div>
                <RubberSegment
                  items={(["10ml", "5ml Normal", "5ml HQ"] as SizeType[]).map((size) => {
                    const itemPrice = fragrance.prices[size];
                    const labelText = size === "5ml Normal" ? "5ml" : size === "5ml HQ" ? "5ml HQ" : size;
                    return {
                      value: size,
                      label: `${labelText} · ₹${itemPrice}`
                    };
                  })}
                  value={selectedSize}
                  onChange={(val) => handleSizeChange(val as SizeType)}
                  trackColor="#f4f4f2"
                  thumbColor="#111111"
                  textColor="#525252"
                  activeTextColor="#ffffff"
                  size="md"
                  radius={12}
                  inset={3}
                  equalSlots
                  className="w-full"
                />
              </div>

              {/* Quantity Stepper (Active here on details view!) */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50/80 border border-black/5">
                <div>
                  <span className="text-xs font-sans font-semibold text-neutral-900 block">
                    Quantity
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {isCurrentOutOfStock ? (
                      <span className="text-red-600 font-medium">Currently unavailable</span>
                    ) : (
                      <span className="text-emerald-700 font-medium">Available to order</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isCurrentOutOfStock || quantity <= 1}
                    className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center text-black hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors font-semibold text-base select-none active:scale-95"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-bold text-neutral-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) =>
                        currentStock !== undefined ? Math.min(currentStock, q + 1) : q + 1
                      )
                    }
                    disabled={
                      isCurrentOutOfStock ||
                      (currentStock !== undefined && quantity >= currentStock)
                    }
                    className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center text-black hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors font-semibold text-base select-none active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={isCurrentOutOfStock}
                  onClick={handleAdd}
                  className="w-full py-4 bg-black text-white rounded-2xl text-xs sm:text-sm font-sans font-medium hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm select-none"
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  {added ? "Added to Cart" : isCurrentOutOfStock ? "Sold Out" : "Add to cart"}
                </button>

                <button
                  type="button"
                  disabled={isCurrentOutOfStock}
                  onClick={handleBuy}
                  className="w-full py-4 border border-black/20 hover:border-black bg-stone-50/50 hover:bg-stone-100 rounded-2xl text-xs sm:text-sm font-sans font-medium text-black active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none"
                >
                  Buy Now
                </button>
              </div>

              {/* Dispatch Information */}
              <div className="border-t border-black/5 pt-4 space-y-2 text-[11px] font-sans text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Hand-extracted & sealed in sterile cleanroom</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3 h-3 text-neutral-400" />
                  <span>Eligible for Damaged in Transit claims</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* "And then put another bunch of perfumes below that" - Amazon Style Related/More Perfumes */}
      <section className="max-w-7xl mx-auto px-5 md:px-12 pt-20">
        <div className="border-t border-black/10 pt-12 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase font-semibold block mb-1">
              Explore More From Scent Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-neutral-950 tracking-tight">
              You May Also Like
            </h2>
          </div>
          <p className="text-xs font-sans text-neutral-600 max-w-sm">
            Discover other premier decants and pairings curated to complement your olfactory profile.
          </p>
        </div>

        {/* The bunch of perfumes below with generous breathing room */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {otherPerfumes.map((otherFragrance) => (
            <div key={otherFragrance.id} className="h-full">
              <ScentCard
                fragrance={otherFragrance}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onOpenDetails={(f) => {
                  onSelectFragrance(f);
                }}
                fragranceStock={stock?.fragrances[otherFragrance.id]}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
