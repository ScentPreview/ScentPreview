import React, { useState, useEffect, useRef } from "react";
import { 
  QrCode, 
  Check, 
  Copy, 
  ExternalLink, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Flame, 
  ArrowLeft, 
  ShoppingBag, 
  RefreshCw, 
  TrendingUp, 
  Smartphone, 
  Tag, 
  Printer,
  ChevronRight
} from "lucide-react";
import QRCode from "qrcode";
import { Fragrance, SizeType } from "../types";

interface QRScansPageProps {
  catalog: Fragrance[];
  onBackToStore: () => void;
  onAddToCart: (fragrance: Fragrance, size: SizeType, quantity: number) => void;
  onBuyNow: (fragrance: Fragrance, size: SizeType, quantity: number) => void;
  cartCount: number;
  onOpenCart: () => void;
}

interface ScanStatSummary {
  totalScans: number;
  uniqueIps: number;
  scansToday: number;
  byPerfume: Record<string, number>;
  bySource: Record<string, number>;
  recentScans: Array<{
    id: string;
    scannedAt: string;
    perfumeId?: string;
    perfumeName?: string;
    source: string;
    deviceType?: string;
    userAgent?: string;
  }>;
}

export default function QRScansPage({
  catalog,
  onBackToStore,
  onAddToCart,
  onBuyNow,
  cartCount,
  onOpenCart
}: QRScansPageProps) {
  // Determine if a specific perfume is requested via URL query param (?sp=givenchy-gentleman or ?sp=sp-1)
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const querySp = (params.get("sp") || params.get("perfume") || params.get("id") || "").toLowerCase().trim();
      if (querySp) {
        const found = catalog.find(
          (f) =>
            f.id.toLowerCase() === querySp ||
            f.name.toLowerCase().replace(/\s+/g, "") === querySp.replace(/\s+/g, "") ||
            f.name.toLowerCase().replace(/\s+/g, "-") === querySp
        );
        if (found) return found;
      }
    }
    return catalog[0] || null;
  });

  const [selectedSize, setSelectedSize] = useState<SizeType>("10ml");
  const [activeTab, setActiveTab] = useState<"verify" | "generator" | "analytics">("verify");
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // QR Generator state
  const [generatorPerfumeId, setGeneratorPerfumeId] = useState<string>(selectedFragrance?.id || catalog[0]?.id || "");
  const [generatorSource, setGeneratorSource] = useState<string>("bottle_label");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrSvgString, setQrSvgString] = useState<string>("");
  const [labelSize, setLabelSize] = useState<"5ml" | "10ml" | "box" | "card">("5ml");

  // Analytics state
  const [scanStats, setScanStats] = useState<ScanStatSummary | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Helper to generate the scan target URL
  const targetBaseUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/qrscans` 
    : "https://www.scentpreview.in/qrscans";

  const generatedScanUrl = `${targetBaseUrl}?sp=${encodeURIComponent(generatorPerfumeId)}&source=${encodeURIComponent(generatorSource)}`;

  // Automatically log this visit as a QR scan if visited via /qrscans
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const source = params.get("source") || "bottle_label";
      const spId = selectedFragrance ? selectedFragrance.id : "hub";
      const spName = selectedFragrance ? selectedFragrance.name : "ScentPreview Hub";

      fetch("/api/qr-scans/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          perfumeId: spId,
          perfumeName: spName,
          source: source,
          referrer: document.referrer || "direct",
        }),
      }).catch(() => {});
    } catch (e) {}
  }, [selectedFragrance?.id]);

  // Generate QR Code image when generator parameters change
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(generatedScanUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: "#111111",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate QR Data URL:", err);
      });

    QRCode.toString(generatedScanUrl, {
      type: "svg",
      margin: 1,
      color: {
        dark: "#111111",
        light: "#FFFFFF",
      },
    })
      .then((svg) => {
        if (isMounted) setQrSvgString(svg);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [generatedScanUrl]);

  // Fetch scan stats for the analytics tab
  const fetchScanStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch("/api/qr-scans");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.stats) {
          setScanStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load QR scan statistics:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchScanStats();
    const interval = setInterval(fetchScanStats, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyUrl = (urlToCopy: string) => {
    try {
      navigator.clipboard.writeText(urlToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {}
  };

  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const perfume = catalog.find((f) => f.id === generatorPerfumeId);
    const fileName = `ScentPreview-QR-${perfume ? perfume.name.replace(/\s+/g, "_") : "General"}-${labelSize}.png`;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectPerfume = (fragrance: Fragrance) => {
    setSelectedFragrance(fragrance);
    setGeneratorPerfumeId(fragrance.id);
    try {
      const url = `${window.location.pathname}?sp=${encodeURIComponent(fragrance.id)}`;
      window.history.replaceState({}, "", url);
    } catch (e) {}
  };

  const handleAddToCartClick = () => {
    if (!selectedFragrance) return;
    onAddToCart(selectedFragrance, selectedSize, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const handleBuyNowClick = () => {
    if (!selectedFragrance) return;
    onBuyNow(selectedFragrance, selectedSize, 1);
  };

  const generatorSelectedPerfume = catalog.find((f) => f.id === generatorPerfumeId) || selectedFragrance;
  const currentPrice = selectedFragrance ? selectedFragrance.prices[selectedSize] : 0;

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111111] font-sans antialiased pb-24 selection:bg-[#2F4F4F]/10 selection:text-[#2F4F4F]">
      
      {/* Top App Header */}
      <header className="sticky top-0 bg-[#F7F7F5]/95 backdrop-blur-md z-40 border-b border-[#D9D9D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 text-xs font-medium text-[#8A8A8A] hover:text-[#2F4F4F] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Full Shelf</span>
            </button>
            <span className="text-[#D9D9D6]">/</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-[0.18em] uppercase text-[#2F4F4F]">
                SCENTPREVIEW
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                /qrscans
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleCopyUrl(window.location.href)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#D9D9D6] bg-white text-xs text-[#2F4F4F] hover:bg-[#EFEDE6] transition-colors cursor-pointer"
              title="Copy QR scan link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8A8A8A]" />
                  <span className="hidden sm:inline">Copy Scan URL</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg border border-[#D9D9D6] bg-white hover:bg-[#EFEDE6] text-[#2F4F4F] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#2F4F4F] text-white text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Navigation Tabs between Customer View, QR Generator, and Scan Analytics */}
        <div className="flex items-center justify-between border-b border-[#D9D9D6] pb-3 mb-6 sm:mb-8 gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => setActiveTab("verify")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "verify"
                  ? "bg-[#2F4F4F] text-white shadow-xs"
                  : "bg-white text-[#8A8A8A] border border-[#D9D9D6] hover:text-[#2F4F4F]"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Bottle Verification & Reorder</span>
            </button>

            <button
              onClick={() => setActiveTab("generator")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "generator"
                  ? "bg-[#2F4F4F] text-white shadow-xs"
                  : "bg-white text-[#8A8A8A] border border-[#D9D9D6] hover:text-[#2F4F4F]"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code Generator</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("analytics");
                fetchScanStats();
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "bg-[#2F4F4F] text-white shadow-xs"
                  : "bg-white text-[#8A8A8A] border border-[#D9D9D6] hover:text-[#2F4F4F]"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Scan Analytics</span>
              {scanStats && (
                <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[10px] font-bold">
                  {scanStats.totalScans}
                </span>
              )}
            </button>
          </div>

          <span className="text-[11px] text-[#8A8A8A] hidden md:block">
            Permanent domain route: <code className="font-mono text-[#2F4F4F]">/qrscans</code>
          </span>
        </div>

        {/* TAB 1: BOTTLE VERIFICATION & REORDER (Customer Scanner Experience) */}
        {activeTab === "verify" && (
          <div className="space-y-6 sm:space-y-10">
            {/* Banner */}
            <div className="bg-[#EFEDE6] border border-[#D9D9D6] rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Verified ScentPreview Flacon Extraction</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                  Bottle Authenticated: <span className="text-[#2F4F4F]">{selectedFragrance.name}</span>
                </h1>
                <p className="text-xs text-[#8A8A8A] max-w-2xl leading-relaxed">
                  Extracted fresh via syringe transfer from authentic retail flacons into high-pressure travel atomizers. 
                  Zero air exposure ensures all delicate top notes remain 100% intact.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-lg bg-white border border-[#D9D9D6] text-xs font-mono text-[#2F4F4F]">
                  Batch: SP-2026-FLACON
                </span>
              </div>
            </div>

            {/* Quick Bottle Selector Pill Carousel */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-semibold tracking-wider text-[#8A8A8A]">
                  Select Scanned Flacon (SP 1 — SP 12)
                </span>
                <span className="text-xs text-[#8A8A8A]">
                  Viewing {selectedFragrance.name}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {catalog.map((fragrance) => {
                  const isCurrent = fragrance.id === selectedFragrance.id;
                  return (
                    <button
                      key={fragrance.id}
                      onClick={() => handleSelectPerfume(fragrance)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                        isCurrent
                          ? "bg-[#2F4F4F] text-white shadow-xs scale-102"
                          : "bg-white text-[#2F4F4F] border border-[#D9D9D6] hover:bg-[#EFEDE6]"
                      }`}
                    >
                      <span className="font-bold">{fragrance.name}</span>
                      <span className="text-[10px] opacity-75">
                        ₹{fragrance.prices["5ml Normal"]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Scanned Bottle Card */}
            <div className="grid grid-cols-12 gap-4 sm:gap-8 items-start bg-white border border-[#D9D9D6] rounded-2xl p-4 sm:p-8">
              
              {/* Left Column: Image with Framing */}
              <div className="col-span-12 sm:col-span-5 flex flex-col items-center">
                <div className="w-full aspect-[4/5] rounded-2xl bg-[#EFEDE6] border border-[#D9D9D6] p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
                  {selectedFragrance.image ? (
                    <img
                      src={selectedFragrance.image}
                      alt={selectedFragrance.name}
                      className="h-full w-auto max-w-full object-contain filter drop-shadow-md select-none transition-transform duration-300 hover:scale-105"
                      loading="eager"
                    />
                  ) : null}
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-[#8A8A8A] bg-white/90 px-2 py-0.5 rounded-full border border-[#D9D9D6]">
                      Authentic Retail Flacon
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 w-full text-center">
                  <div className="p-2 rounded-lg bg-[#F7F7F5] border border-[#D9D9D6]">
                    <span className="block text-[10px] uppercase text-[#8A8A8A] font-medium">5ml Bottle</span>
                    <span className="text-xs font-semibold text-[#2F4F4F]">~75 Sprays (3-4 wks)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F7F7F5] border border-[#D9D9D6]">
                    <span className="block text-[10px] uppercase text-[#8A8A8A] font-medium">10ml Bottle</span>
                    <span className="text-xs font-semibold text-[#2F4F4F]">~150 Sprays (2 mos)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Olfactory Breakdown, Lifespan, and Reorder Action */}
              <div className="col-span-12 sm:col-span-7 flex flex-col justify-start space-y-5 text-left">
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#8A8A8A]">
                      BOTTLE PASSPORT
                    </span>
                    <span className="text-[#D9D9D6]">·</span>
                    <span className="text-[10px] uppercase font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Cleanroom Sealed
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                    {selectedFragrance.name}
                  </h2>
                  <p className="text-xs text-[#8A8A8A] mt-0.5 font-medium">
                    {selectedFragrance.type || "Luxury Signature Extraction"}
                  </p>
                </div>

                {/* Scent Description */}
                <div className="space-y-1.5 border-t border-[#D9D9D6] pt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2F4F4F]">
                    How It Smells
                  </span>
                  <p className="text-xs sm:text-sm text-[#2F4F4F] leading-relaxed">
                    {selectedFragrance.description || "Authentic retail flacon juice extracted under cleanroom standards."}
                  </p>
                </div>

                {/* Notes Tags */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Key Accord Notes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFragrance.notesList.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 rounded-md bg-[#EFEDE6] text-[#2F4F4F] text-xs font-medium"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reorder Form */}
                <div className="border-t border-[#D9D9D6] pt-4 space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-2">
                      Reorder Bottle Size
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(["10ml", "5ml Normal", "5ml HQ"] as SizeType[]).map((size) => {
                        const itemPrice = selectedFragrance.prices[size];
                        const isSelected = selectedSize === size;
                        const labelText = size === "5ml Normal" ? "5ml Regular" : size === "5ml HQ" ? "5ml HQ Spray" : size;

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`py-2 px-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "border-[#2F4F4F] bg-[#EFEDE6] text-[#2F4F4F] shadow-xs"
                                : "border-[#D9D9D6] bg-white text-[#2F4F4F] hover:border-[#8A8A8A]"
                            }`}
                          >
                            <span className="text-[11px] font-medium">{labelText}</span>
                            <span className="text-xs font-bold text-[#2F4F4F]">₹{itemPrice}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleAddToCartClick}
                      className="py-3 px-4 rounded-xl bg-[#2F4F4F] text-white text-xs sm:text-sm font-medium hover:bg-[#253f3f] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      {addedToCart ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart · ₹{currentPrice}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNowClick}
                      className="py-3 px-4 rounded-xl border border-[#D9D9D6] bg-white text-[#2F4F4F] text-xs sm:text-sm font-medium hover:bg-[#EFEDE6] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Buy Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Layering Companion Rationale */}
                {selectedFragrance.layering && (
                  <div className="border-t border-[#D9D9D6] pt-4 bg-[#EFEDE6]/50 -mx-4 -mb-4 sm:-mx-8 sm:-mb-8 p-4 sm:p-6 rounded-b-2xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2F4F4F] mb-1">
                      <Layers className="w-4 h-4 text-[#2F4F4F]" />
                      <span>Recommended Layering Duo: {selectedFragrance.layering.partnerName}</span>
                    </div>
                    <p className="text-xs text-[#8A8A8A] leading-relaxed mb-3">
                      {selectedFragrance.layering.whyItWorks}
                    </p>
                    <button
                      onClick={() => {
                        const partner = catalog.find((f) => f.id === selectedFragrance.layering?.partnerId);
                        if (partner) handleSelectPerfume(partner);
                      }}
                      className="text-xs font-semibold text-[#2F4F4F] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View & Reorder {selectedFragrance.layering.partnerName}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QR CODE GENERATOR (For Bottle Labels & Packaging) */}
        {activeTab === "generator" && (
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-[#D9D9D6] rounded-2xl p-4 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#D9D9D6] gap-4">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#8A8A8A] block mb-1">
                    PACKAGING & BOTTLE QR TOOL
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                    Printable QR Code Generator
                  </h2>
                  <p className="text-xs text-[#8A8A8A] mt-1 max-w-xl">
                    Generate crisp high-resolution QR stickers for perfume decant bottles (5ml/10ml), 
                    shipping packaging, and thank-you cards. Scanning routes directly to <code className="font-mono text-[#2F4F4F]">/qrscans?sp={generatorPerfumeId}</code>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadQrPng}
                    disabled={!qrDataUrl}
                    className="px-4 py-2.5 rounded-xl bg-[#2F4F4F] text-white text-xs sm:text-sm font-medium hover:bg-[#253f3f] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PNG ({labelSize})</span>
                  </button>
                </div>
              </div>

              {/* Generator Configuration Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 pt-6">
                
                {/* Controls */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Select Perfume */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] mb-2">
                      Target Perfume Flacon
                    </label>
                    <select
                      value={generatorPerfumeId}
                      onChange={(e) => setGeneratorPerfumeId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D9D9D6] bg-[#F7F7F5] text-xs sm:text-sm font-medium text-[#111111] focus:outline-none focus:border-[#2F4F4F]"
                    >
                      {catalog.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} — {f.notes} (₹{f.prices["5ml Normal"]})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* QR Placement / Source */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] mb-2">
                      Scan Source Tag
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "bottle_label", label: "Bottle Label" },
                        { id: "packaging_box", label: "Packaging Box" },
                        { id: "thank_you_card", label: "Thank-You Card" },
                        { id: "store_flyer", label: "Marketing Flyer" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setGeneratorSource(item.id)}
                          className={`px-2.5 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                            generatorSource === item.id
                              ? "bg-[#2F4F4F] text-white border-[#2F4F4F]"
                              : "bg-white text-[#2F4F4F] border-[#D9D9D6] hover:bg-[#EFEDE6]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Label Size Preset */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] mb-2">
                      Label Size Preset
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "5ml", label: "5ml Bottle (25mm)" },
                        { id: "10ml", label: "10ml Bottle (30mm)" },
                        { id: "box", label: "Box Sticker (40mm)" },
                        { id: "card", label: "Postcard (60mm)" },
                      ].map((sizeItem) => (
                        <button
                          key={sizeItem.id}
                          type="button"
                          onClick={() => setLabelSize(sizeItem.id as any)}
                          className={`px-2.5 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                            labelSize === sizeItem.id
                              ? "bg-[#EFEDE6] text-[#2F4F4F] border-[#2F4F4F] font-bold"
                              : "bg-white text-[#8A8A8A] border-[#D9D9D6] hover:text-[#2F4F4F]"
                          }`}
                        >
                          {sizeItem.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generated Target URL Display */}
                  <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#D9D9D6] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A] block">
                      Target URL Encoded in QR
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-[#2F4F4F] truncate select-all">
                        {generatedScanUrl}
                      </span>
                      <button
                        onClick={() => handleCopyUrl(generatedScanUrl)}
                        className="px-2 py-1 rounded bg-white border border-[#D9D9D6] text-[10px] font-medium text-[#2F4F4F] hover:bg-[#EFEDE6] shrink-0 cursor-pointer"
                      >
                        {copiedLink ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* QR Code Preview & Mock Sticker Layout */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#EFEDE6] border border-[#D9D9D6] rounded-2xl">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-[#D9D9D6] flex flex-col items-center max-w-[240px] text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F4F4F] mb-1">
                      SCENTPREVIEW
                    </span>
                    <span className="text-xs font-bold text-[#111111] mb-2">
                      {generatorSelectedPerfume?.name || "SP Decant"}
                    </span>
                    
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="ScentPreview QR Code"
                        className="w-40 h-40 object-contain select-none"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-neutral-100 animate-pulse flex items-center justify-center text-xs text-[#8A8A8A]">
                        Generating QR...
                      </div>
                    )}

                    <span className="text-[9px] uppercase tracking-wider text-[#8A8A8A] mt-2 font-medium">
                      Scan to reorder & verify
                    </span>
                    <span className="text-[8px] font-mono text-[#8A8A8A]/70">
                      scentpreview.in/qrscans
                    </span>
                  </div>

                  <p className="text-[11px] text-[#8A8A8A] mt-4 text-center">
                    Simulated sticker preview for {labelSize.toUpperCase()} flacon format.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCAN ANALYTICS & RECENT LOGS */}
        {activeTab === "analytics" && (
          <div className="space-y-6 sm:space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border border-[#D9D9D6] rounded-2xl p-4 sm:p-5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A8A] block mb-1">
                  Total QR Scans
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#2F4F4F]">
                  {scanStats ? scanStats.totalScans : "..."}
                </span>
                <span className="text-[10px] text-emerald-700 block mt-1 font-medium">
                  Live verified scans
                </span>
              </div>

              <div className="bg-white border border-[#D9D9D6] rounded-2xl p-4 sm:p-5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A8A] block mb-1">
                  Unique Devices
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#111111]">
                  {scanStats ? scanStats.uniqueIps : "..."}
                </span>
                <span className="text-[10px] text-[#8A8A8A] block mt-1">
                  Unique customer visitors
                </span>
              </div>

              <div className="bg-white border border-[#D9D9D6] rounded-2xl p-4 sm:p-5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A8A] block mb-1">
                  Scans Today
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#2F4F4F]">
                  {scanStats ? scanStats.scansToday : "..."}
                </span>
                <span className="text-[10px] text-emerald-700 block mt-1 font-medium">
                  Past 24 hours
                </span>
              </div>

              <div className="bg-white border border-[#D9D9D6] rounded-2xl p-4 sm:p-5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A8A] block mb-1">
                  Top Scanned Flacon
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#111111] truncate block">
                  {scanStats && Object.keys(scanStats.byPerfume).length > 0
                    ? Object.entries(scanStats.byPerfume).sort((a, b) => b[1] - a[1])[0][0]
                    : "SP 1"}
                </span>
                <span className="text-[10px] text-[#8A8A8A] block mt-1">
                  Highest customer reorder interest
                </span>
              </div>
            </div>

            {/* Scans By Perfume Breakdown */}
            <div className="bg-white border border-[#D9D9D6] rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#D9D9D6] mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                  Scan Breakdown by Perfume
                </h3>
                <button
                  onClick={fetchScanStats}
                  disabled={isLoadingStats}
                  className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-[#2F4F4F] cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {scanStats && Object.keys(scanStats.byPerfume).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(scanStats.byPerfume).map(([pName, count]) => (
                    <div
                      key={pName}
                      className="p-3 rounded-xl bg-[#F7F7F5] border border-[#D9D9D6] flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-[#111111] truncate">{pName}</span>
                      <span className="text-xs font-bold font-mono text-[#2F4F4F] bg-white px-2 py-0.5 rounded-md border border-[#D9D9D6]">
                        {count} scans
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#8A8A8A]">
                  No scans recorded yet. QR codes scanned from bottle labels will appear here in real time.
                </div>
              )}
            </div>

            {/* Live Scan Activity Stream */}
            <div className="bg-white border border-[#D9D9D6] rounded-2xl p-4 sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-4">
                Live Scan Activity Stream
              </h3>

              {scanStats && scanStats.recentScans.length > 0 ? (
                <div className="divide-y divide-[#D9D9D6] overflow-x-auto">
                  {scanStats.recentScans.slice(0, 15).map((scan) => {
                    const dateObj = new Date(scan.scannedAt);
                    const formattedTime = !isNaN(dateObj.getTime())
                      ? dateObj.toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "Just now";

                    return (
                      <div key={scan.id} className="py-2.5 flex items-center justify-between text-xs gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="font-semibold text-[#111111]">{scan.perfumeName || "ScentPreview Hub"}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#EFEDE6] text-[#2F4F4F] font-mono">
                            {scan.source.replace(/_/g, " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-[#8A8A8A] text-[11px] shrink-0">
                          <span className="font-mono">{scan.deviceType || "Mobile"}</span>
                          <span>{formattedTime}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#8A8A8A]">
                  No recent scans logged.
                </div>
              )}
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
