import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Check, 
  Minus, 
  Plus, 
  Share2, 
  ChevronDown 
} from "lucide-react";
import { Fragrance, SizeType } from "../types";
import ScentCard from "./ScentCard";

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
  const [layeringAdded, setLayeringAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleCopyDirectLink = () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}?perfume=${encodeURIComponent(fragrance.id)}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch (e) {}
  };

  // Scroll to top immediately when opening or changing fragrance
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const el = document.getElementById("product-detail-view");
    if (el) {
      el.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [fragrance.id]);

  // Check if all sizes are 0 or out of stock
  const isAllSizesOutOfStock = fragrance.isOutOfStock || !fragranceStock || (
    Object.values(fragranceStock).every(v => (Number(v) || 0) <= 0)
  );

  // Initialize selected size to first in-stock size when fragrance changes
  useEffect(() => {
    const sizes: SizeType[] = ["10ml", "5ml Normal", "5ml HQ"];
    for (const size of sizes) {
      const stockVal = fragranceStock ? Number(fragranceStock[size]) || 0 : 0;
      const isSizeDisabled =
        fragrance.disabledSizes?.includes(size) || fragrance.isOutOfStock || isAllSizesOutOfStock || stockVal <= 0;
      if (!isSizeDisabled) {
        setSelectedSize(size);
        setQuantity(1);
        return;
      }
    }
    setSelectedSize("10ml");
    setQuantity(1);
  }, [fragrance.id, fragranceStock, isAllSizesOutOfStock]);

  const currentStock = fragranceStock ? Number(fragranceStock[selectedSize]) || 0 : 0;
  const isCurrentOutOfStock =
    isAllSizesOutOfStock ||
    fragrance.isOutOfStock ||
    currentStock <= 0 ||
    fragrance.disabledSizes?.includes(selectedSize);

  const price = (fragrance.prices && fragrance.prices[selectedSize]) ?? fragrance.prices?.["5ml Normal"] ?? 799;
  const totalPrice = price * quantity;

  const handleSizeChange = (size: SizeType) => {
    const stockVal = fragranceStock ? Number(fragranceStock[size]) || 0 : 0;
    if (isAllSizesOutOfStock || fragrance.isOutOfStock || fragrance.disabledSizes?.includes(size) || stockVal <= 0) return;
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleAdd = () => {
    if (isCurrentOutOfStock || isAllSizesOutOfStock) return;
    onAddToCart(fragrance, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1600);
  };

  const handleBuy = () => {
    if (isCurrentOutOfStock || isAllSizesOutOfStock) return;
    onBuyNow(fragrance, selectedSize, quantity);
  };

  const partnerFragrance = fragrance.layering
    ? allFragrances.find((f) => f.id === fragrance.layering?.partnerId)
    : undefined;

  const handleAddLayering = () => {
    if (!fragrance.layering) return;
    const partner = partnerFragrance || ({
      id: fragrance.layering.partnerId,
      name: fragrance.layering.partnerName,
      brand: fragrance.layering.partnerBrand,
      isPremium: false,
      isOutOfStock: false,
      notes: "",
      notesList: [],
      prices: {
        "10ml": fragrance.layering.partnerPrice,
        "5ml Normal": Math.round(fragrance.layering.partnerPrice * 0.55),
        "5ml HQ": Math.round(fragrance.layering.partnerPrice * 0.65),
      },
      color: "#2F4F4F",
      glassStyle: "",
      image: fragrance.layering.partnerImage,
    } as Fragrance);

    onAddToCart(partner, fragrance.layering.partnerSize, 1);
    setLayeringAdded(true);
    setTimeout(() => setLayeringAdded(false), 2200);
  };

  // Filter other perfumes to only show in-stock perfumes below
  const otherPerfumes = allFragrances
    .filter((f) => {
      if (f.id === fragrance.id) return false;
      if (f.isOutOfStock) return false;
      const fStock = stock?.fragrances?.[f.id];
      if (!fStock) return false;
      const hasStock = Object.values(fStock).some((v) => (Number(v) || 0) > 0);
      return hasStock;
    })
    .sort((a, b) => {
      const aMatch = a.gender === fragrance.gender ? 1 : 0;
      const bMatch = b.gender === fragrance.gender ? 1 : 0;
      return bMatch - aMatch;
    });

  // Headline styling helper
  const nameParts = fragrance.name.split(" ");
  const firstPart = nameParts.slice(0, Math.max(1, nameParts.length - 1)).join(" ");
  const accentWord = nameParts[nameParts.length - 1] || "";

  return (
    <div id="product-detail-view" className="w-full min-h-screen bg-[#F7F7F5] text-[#2F4F4F] font-sans pb-24 antialiased">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 pb-4">
        <div className="flex items-center justify-between border-b border-[#D9D9D6] pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-[#8A8A8A] hover:text-[#2F4F4F] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All fragrances</span>
            </button>
            <span className="text-[#D9D9D6]">/</span>
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#2F4F4F]">
              SCENTPREVIEW
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-xs text-[#8A8A8A]">
              Authentic decant · ScentPreview
            </span>
            <button
              onClick={handleCopyDirectLink}
              className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-[#2F4F4F] transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2F4F4F]" />
                  <span className="text-[#2F4F4F] font-medium">Link copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Frame - Side-by-Side on Mobile and Laptop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-5 sm:py-8 lg:py-12">
        <div className="grid grid-cols-12 gap-3 sm:gap-6 lg:gap-14 items-start">
          
          {/* Left Column: Headline, Subheading, Body, Specs, CTA, Accordions */}
          <div className="col-span-7 sm:col-span-6 lg:col-span-6 flex flex-col justify-start text-left">
            
            {/* 1. Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#111111] leading-[1.08] tracking-tight mb-1 sm:mb-2">
              {firstPart} <span className="text-[#2F4F4F]">{accentWord}</span>
            </h1>

            {/* 2. Subheading */}
            <p className="text-[9px] sm:text-[13px] font-medium tracking-[0.16em] text-[#8A8A8A] uppercase mb-3 sm:mb-6">
              SCENTPREVIEW · AUTHENTIC DECANT
            </p>

            {/* 3. Body: easy-to-understand scent description & bottle lifespan */}
            <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-8">
              <p className="text-xs sm:text-[15px] text-[#2F4F4F] font-medium leading-relaxed">
                {fragrance.description || "Fresh authentic decant extracted directly from retail flacons."}
              </p>
              <p className="text-[10px] sm:text-xs text-[#8A8A8A] leading-relaxed">
                <span className="font-semibold text-[#2F4F4F]">Lifespan:</span> 5ml yields ~75 sprays (lasts ~3 to 4 weeks). 10ml yields ~150 sprays (lasts ~2 full months).
              </p>
            </div>

            {/* 4. Specifications & Pricing */}
            <div className="border-t border-[#D9D9D6] pt-3 sm:pt-6 mb-4 sm:mb-8 space-y-3 sm:space-y-6">
              
              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.14em] text-[#8A8A8A]">
                    Volume
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-[#2F4F4F] truncate max-w-[130px] sm:max-w-none">
                    {selectedSize === "10ml" 
                      ? "10ml · ~150 sprays" 
                      : selectedSize === "5ml HQ"
                      ? "5ml HQ · ~75 sprays"
                      : "5ml · ~75 sprays"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2.5">
                  {(["10ml", "5ml Normal", "5ml HQ"] as SizeType[]).map((size) => {
                    const itemPrice = fragrance.prices[size];
                    const sizeStock = fragranceStock ? Number(fragranceStock[size]) || 0 : 0;
                    const isSizeOOS = isAllSizesOutOfStock || fragrance.isOutOfStock || fragrance.disabledSizes?.includes(size) || sizeStock <= 0;
                    const isSelected = selectedSize === size && !isSizeOOS;
                    const labelText = size === "5ml Normal" ? "5ml" : size === "5ml HQ" ? "5ml HQ" : size;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={isSizeOOS}
                        onClick={() => handleSizeChange(size)}
                        className={`py-1.5 sm:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[46px] sm:min-h-[64px] ${
                          isSelected
                            ? "border-[#2F4F4F] bg-[#EFEDE6] text-[#2F4F4F] shadow-xs"
                            : isSizeOOS
                            ? "border-[#D9D9D6] bg-transparent text-[#8A8A8A]/40 line-through cursor-not-allowed"
                            : "border-[#D9D9D6] bg-white text-[#2F4F4F] hover:border-[#8A8A8A]"
                        }`}
                      >
                        <span className="text-[11px] sm:text-xs font-medium tracking-wide">
                          {labelText}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#8A8A8A] font-medium">
                          {isSizeOOS ? "Sold out" : `₹${itemPrice}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Price Line */}
              <div className="flex items-center justify-between py-1 sm:py-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-[#2F4F4F] tracking-tight">
                    ₹{totalPrice}
                  </span>
                  {quantity > 1 && (
                    <span className="text-[10px] sm:text-xs text-[#8A8A8A]">
                      (₹{price} × {quantity})
                    </span>
                  )}
                </div>

                <div className="flex items-center border border-[#D9D9D6] rounded-lg sm:rounded-xl bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isCurrentOutOfStock || quantity <= 1}
                    className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center text-[#2F4F4F] hover:bg-[#EFEDE6] disabled:text-[#D9D9D6] disabled:hover:bg-transparent rounded-l-lg sm:rounded-l-xl transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <span className="w-6 sm:w-8 text-center text-xs font-medium text-[#2F4F4F]">
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
                    className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center text-[#2F4F4F] hover:bg-[#EFEDE6] disabled:text-[#D9D9D6] disabled:hover:bg-transparent rounded-r-lg sm:rounded-r-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Call To Action */}
            <div className="space-y-2 sm:space-y-3">
              <button
                type="button"
                disabled={isCurrentOutOfStock || isAllSizesOutOfStock}
                onClick={handleAdd}
                className="w-full py-2.5 sm:py-4 bg-[#2F4F4F] text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium tracking-wide hover:bg-[#253f3f] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                {added ? "Added to cart" : isAllSizesOutOfStock ? "Sold out" : `Add to cart · ₹${totalPrice}`}
              </button>

              <button
                type="button"
                disabled={isCurrentOutOfStock || isAllSizesOutOfStock}
                onClick={handleBuy}
                className="w-full py-2 sm:py-3.5 border border-[#D9D9D6] bg-white text-[#2F4F4F] hover:bg-[#EFEDE6] rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-medium tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isCurrentOutOfStock ? "Sold out" : "Buy now"}
              </button>
            </div>

            {/* Packaging and authentic extraction details */}
            <div className="pt-3 sm:pt-5 mt-4 sm:mt-6 border-t border-[#D9D9D6] space-y-1 text-[10px] sm:text-xs text-[#8A8A8A]">
              <p>Authentic retail flacon juice. Sealed with tamper band.</p>
              <p>Lightweight shatterproof travel atomizer with airtight fine-mist spray.</p>
            </div>

            {/* Accordions */}
            <div className="mt-4 sm:mt-8 border-t border-[#D9D9D6]">
              {/* Notes Accordion */}
              <div className="border-b border-[#D9D9D6]">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === "Notes" ? null : "Notes")}
                  className="w-full py-3 sm:py-4 flex items-center justify-between text-left text-[11px] sm:text-xs font-medium uppercase tracking-[0.14em] text-[#2F4F4F] cursor-pointer"
                >
                  <span>Notes & Accord</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A8A8A] transition-transform ${openSection === "Notes" ? "rotate-180" : ""}`} />
                </button>
                {openSection === "Notes" && (
                  <div className="pb-3 sm:pb-4 text-[11px] sm:text-xs text-[#8A8A8A] leading-relaxed space-y-2">
                    <p>{fragrance.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {fragrance.notesList.map((n) => (
                        <span key={n} className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#EFEDE6] text-[#2F4F4F] text-[10px] sm:text-[11px] font-medium">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Extraction Accordion */}
              <div className="border-b border-[#D9D9D6]">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === "Extraction" ? null : "Extraction")}
                  className="w-full py-3 sm:py-4 flex items-center justify-between text-left text-[11px] sm:text-xs font-medium uppercase tracking-[0.14em] text-[#2F4F4F] cursor-pointer"
                >
                  <span>Cleanroom Extraction</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A8A8A] transition-transform ${openSection === "Extraction" ? "rotate-180" : ""}`} />
                </button>
                {openSection === "Extraction" && (
                  <div className="pb-3 sm:pb-4 text-[11px] sm:text-xs text-[#8A8A8A] leading-relaxed">
                    Extracted using syringe transfer directly from original retail bottles. No dipping or exposure to ambient air ensures zero evaporation of top notes.
                  </div>
                )}
              </div>

              {/* Lifespan & Wear Accordion */}
              <div className="border-b border-[#D9D9D6]">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === "Lifespan" ? null : "Lifespan")}
                  className="w-full py-3 sm:py-4 flex items-center justify-between text-left text-[11px] sm:text-xs font-medium uppercase tracking-[0.14em] text-[#2F4F4F] cursor-pointer"
                >
                  <span>Lifespan & Sprays</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A8A8A] transition-transform ${openSection === "Lifespan" ? "rotate-180" : ""}`} />
                </button>
                {openSection === "Lifespan" && (
                  <div className="pb-3 sm:pb-4 text-[11px] sm:text-xs text-[#8A8A8A] leading-relaxed space-y-1.5">
                    <p><strong className="text-[#111111]">5ml Pocket Atomizer:</strong> Yields ~75 sprays (lasts ~3 to 4 weeks with daily wear).</p>
                    <p><strong className="text-[#111111]">10ml Travel Spray:</strong> Yields ~150 sprays (lasts ~2 full months of consistent daily wear).</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Perfume Bottle Photo Side by Side on Mobile and Desktop */}
          <div className="col-span-5 sm:col-span-6 lg:col-span-6 flex flex-col items-center justify-start sticky top-16 sm:top-20">
            <div className="w-full aspect-[3/4] sm:aspect-[4/5] max-w-[460px] rounded-2xl sm:rounded-3xl bg-[#EFEDE6] border border-[#D9D9D6] p-2.5 sm:p-6 lg:p-12 flex items-center justify-center relative overflow-hidden shadow-2xs">
              {fragrance.image ? (
                <img
                  src={fragrance.image}
                  alt={fragrance.name}
                  width="380"
                  height="380"
                  className="h-full w-auto max-w-full object-contain filter drop-shadow-md select-none block mx-auto transition-transform duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="sync"
                />
              ) : null}
            </div>
            <p className="mt-2 sm:mt-4 text-[9px] sm:text-[11px] uppercase tracking-wider text-[#8A8A8A] font-medium text-center">
              Authentic Retail Extraction
            </p>
          </div>

        </div>
      </section>

      {/* Recommended Layering Duo Section */}
      {fragrance.layering && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8">
          <div className="bg-[#EFEDE6] border border-[#D9D9D6] rounded-2xl p-5 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-[#D9D9D6]">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#8A8A8A] block mb-1">
                  LAYER & ELEVATE
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-[#111111] tracking-tight">
                  Pair with <span className="text-[#2F4F4F]">{fragrance.layering.partnerName}</span>
                </h2>
                <p className="text-xs text-[#8A8A8A] mt-1">
                  Blend {fragrance.name} + {fragrance.layering.partnerName} into a custom scent: <strong className="text-[#111111] font-semibold">{fragrance.layering.combinationName}</strong>
                </p>
              </div>

              {/* Add Layering Partner Button */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleAddLayering}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#2F4F4F] text-white text-xs sm:text-sm font-medium hover:bg-[#253f3f] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {layeringAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Added to cart</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add {fragrance.layering.partnerName} ({fragrance.layering.partnerSize}) · ₹{fragrance.layering.partnerPrice}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Layering Visual & Rationale */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pt-5 sm:pt-6 items-center">
              {/* Partner Visual Duo */}
              <div className="lg:col-span-4 flex items-center justify-center gap-4 bg-white/70 rounded-xl p-3 sm:p-4 border border-[#D9D9D6]">
                <div className="w-20 sm:w-24 h-24 sm:h-28 flex items-center justify-center">
                  <img
                    src={fragrance.image}
                    alt={fragrance.name}
                    className="max-h-20 sm:max-h-24 w-auto object-contain drop-shadow-sm select-none"
                    loading="lazy"
                  />
                </div>
                <span className="text-[#2F4F4F] font-bold text-xl">+</span>
                <div 
                  className="w-20 sm:w-24 h-24 sm:h-28 flex items-center justify-center cursor-pointer group"
                  onClick={() => {
                    if (partnerFragrance) onSelectFragrance(partnerFragrance);
                  }}
                  title={`View ${fragrance.layering.partnerName}`}
                >
                  <img
                    src={fragrance.layering.partnerImage}
                    alt={fragrance.layering.partnerName}
                    className="max-h-20 sm:max-h-24 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform select-none"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Why & How */}
              <div className="lg:col-span-8 space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2F4F4F]">
                    Why they work together
                  </span>
                  <p className="text-xs sm:text-sm text-[#111111] leading-relaxed">
                    {fragrance.layering.whyItWorks}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-[#D9D9D6]/60">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    How to layer
                  </span>
                  <p className="text-xs text-[#8A8A8A] leading-relaxed">
                    {fragrance.layering.howToLayer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Perfumes Below */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-12 sm:pt-16">
        <div className="border-t border-[#D9D9D6] pt-8 sm:pt-12 pb-6 sm:pb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mb-1">
            You may also <span className="text-[#2F4F4F]">want to buy</span>
          </h2>
          <p className="text-xs text-[#8A8A8A]">
            Current in-stock authentic flacon extractions ready to ship together.
          </p>
        </div>

        {/* Side-by-side grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {otherPerfumes.slice(0, 12).map((otherFragrance) => (
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
