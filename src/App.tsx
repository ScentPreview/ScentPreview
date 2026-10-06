import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CATALOG_DATA, 
  BUNDLE_DATA, 
  Fragrance, 
  CapsuleBundle 
} from "./types";
import ScentCard from "./components/ScentCard";
import ProductDetailPage from "./components/ProductDetailPage";
import AntiQuiz from "./components/AntiQuiz";
import AestheticQuiz from "./components/AestheticQuiz";
import ChordQuiz from "./components/ChordQuiz";
import ScentBattle from "./components/ScentBattle";
import LiquidBars from "./components/ui/liquid-bars";
import { 
  ShoppingBag, 
  X, 
  ChevronRight, 
  CreditCard,
  CheckCircle,
  Truck,
  RefreshCw,
  Mail,
  Copy,
  Check,
  Lock,
  Database,
  PlusCircle,
  List,
  ShieldAlert,
  Trash2,
  Sparkles,
  Search,
  Calendar,
  MapPin,
  User,
  Phone,
  ExternalLink,
  Tag,
  AlertTriangle,
  Upload,
  DollarSign,
  Layers
} from "lucide-react";



const DEFAULT_FALLBACK_STOCK = {
  fragrances: {
    "lattafa-khamrah": { "5ml Normal": 14, "5ml HQ": 0, "10ml": 0 },
    "ck2": { "5ml Normal": 2, "5ml HQ": 0, "10ml": 0 },
    "givenchy-gentleman": { "5ml Normal": 12, "5ml HQ": 0, "10ml": 0 },
    "zara-for-him-black": { "5ml Normal": 5, "5ml HQ": 0, "10ml": 0 },
    "zara-sunrise": { "5ml Normal": 0, "5ml HQ": 0, "10ml": 1 },
    "zara-seoul-winter": { "5ml Normal": 0, "5ml HQ": 0, "10ml": 0 },
    "zara-seoul": { "5ml Normal": 0, "5ml HQ": 2, "10ml": 0 },
    "zara-intense-dark": { "5ml Normal": 5, "5ml HQ": 0, "10ml": 0 },
    "zara-rich-warm-addictive": { "5ml Normal": 16, "5ml HQ": 0, "10ml": 0 },
    "ck-one": { "5ml Normal": 7, "5ml HQ": 3, "10ml": 0 },
    "la-uno-qaswa": { "5ml Normal": 11, "5ml HQ": 2, "10ml": 0 },
    "versace-crystal-noir": { "5ml Normal": 1, "5ml HQ": 0, "10ml": 0 }
  },
  bundles: {
    "spotlight-arabian": 6,
    "bundle-cozy-winter": 0,
    "bundle-marine-core": 0,
    "bundle-day-night": 0,
    "bundle-office-rotation": 0,
    "bundle-zara-classics": 0,
    "bundle-rare-collector": 0,
    "bundle-master-vault": 0
  }
};

type BundleSizeType = "10ml" | "5ml Normal" | "5ml HQ";

const INDIAN_STATES_AND_UTS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const getBundleAesthetic = (id: string) => {
  switch (id) {
    case "bundle-day-night":
      return {
        bgGradient: "from-amber-600/10 via-stone-900/40 to-indigo-950/60",
        orbs: [
          { color: "bg-amber-500/15", size: "w-24 h-24", pos: "-top-6 -left-6" },
          { color: "bg-indigo-600/15", size: "w-32 h-32", pos: "-bottom-8 -right-8" },
        ],
        badge: "Amber & Indigo Aura",
      };
    case "bundle-marine-core":
      return {
        bgGradient: "from-cyan-500/10 via-emerald-500/5 to-stone-900/40",
        orbs: [
          { color: "bg-cyan-400/15", size: "w-28 h-28", pos: "-top-4 -right-4" },
          { color: "bg-emerald-400/15", size: "w-24 h-24", pos: "-bottom-6 -left-6" },
        ],
        badge: "Marine & Teal Aqua",
      };
    case "bundle-rare-collector":
      return {
        bgGradient: "from-violet-600/10 via-stone-900/50 to-neutral-950/70",
        orbs: [
          { color: "bg-violet-500/15", size: "w-32 h-32", pos: "-bottom-10 -right-6" },
          { color: "bg-neutral-600/20", size: "w-20 h-20", pos: "-top-4 -left-4" },
        ],
        badge: "Obsidian & Violet Shimmer",
      };
    case "bundle-office-rotation":
      return {
        bgGradient: "from-amber-900/10 via-stone-950/40 to-stone-900/60",
        orbs: [
          { color: "bg-amber-800/15", size: "w-24 h-24", pos: "-top-6 -right-6" },
          { color: "bg-transparent0/15", size: "w-28 h-28", pos: "-bottom-6 -left-6" },
        ],
        badge: "Executive Brass & Silver",
      };
    case "bundle-cozy-winter":
      return {
        bgGradient: "from-orange-600/10 via-stone-900/40 to-amber-950/50",
        orbs: [
          { color: "bg-orange-500/15", size: "w-28 h-28", pos: "-top-8 -right-8" },
          { color: "bg-amber-600/15", size: "w-24 h-24", pos: "-bottom-6 -left-6" },
        ],
        badge: "Cinnamon & Cashmere Glow",
      };
    case "bundle-master-vault":
      return {
        bgGradient: "from-amber-500/10 via-stone-950/50 to-amber-950/70",
        orbs: [
          { color: "bg-amber-500/15", size: "w-32 h-32", pos: "-bottom-8 -right-8" },
          { color: "bg-yellow-600/10", size: "w-24 h-24", pos: "-top-6 -left-6" },
        ],
        badge: "Gold-Filigree Mahogany Aura",
      };
    case "bundle-zara-classics":
      return {
        bgGradient: "from-stone-300/10 via-stone-100/40 to-stone-200/50",
        orbs: [
          { color: "bg-stone-400/15", size: "w-24 h-24", pos: "-top-4 -right-4" },
          { color: "bg-stone-300/20", size: "w-28 h-28", pos: "-bottom-6 -left-6" },
        ],
        badge: "Minimalist Linen & Sand",
      };
    default:
      return {
        bgGradient: "from-stone-900/20 via-stone-850/40 to-stone-950/60",
        orbs: [],
        badge: "Curated Set",
      };
  }
};

const getBundleOriginalPrice = (id: string): string => {
  switch (id) {
    case "spotlight-arabian": return "956";
    case "bundle-day-night": return "1,040";
    case "bundle-marine-core": return "945";
    case "bundle-rare-collector": return "1,212";
    case "bundle-office-rotation": return "1,779";
    case "bundle-cozy-winter": return "1,487";
    case "bundle-master-vault": return "1,470";
    case "bundle-zara-classics": return "1,957";
    default: return "0";
  }
};

const getScentOriginalPrice = (id: string, size: "10ml" | "5ml Normal" | "5ml HQ"): string => {
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


// --- ROBUST ERROR HANDLING WRAPPER & CONSOLE PATCH ---
// Suppress benign Vite WebSocket connection errors from cluttering the logs
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('failed to connect to websocket')) {
    return; // Mute specific benign error
  }
  originalConsoleError(...args);
};

// Robust fetch wrapper that gracefully catches network/stock fetch failures
const safeFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    // Silently catch the fetch error and return a mock 503 response
    // This prevents recurring warnings in the app logs for unavailable endpoints
    return new Response(JSON.stringify({ error: "Network fetch failed gracefully.", success: false }), {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "application/json" }
    });
  }
};
// -----------------------------------------------------


const POLICIES = {
  terms: {
    title: "TERMS OF USE",
    content: [
      { subtitle: "1. Overview", text: "By accessing or purchasing from Scent Preview, you agree to be bound by these Terms of Use. If you do not agree, please do not use our site or services." },
      { subtitle: "2. Product Use & Intellectual Property", text: "All content, branding, media, and formulations displayed on Scent Preview are the intellectual property of Scent Preview. Products are sold strictly for personal use and may not be resold or redistributed without explicit authorization." },
      { subtitle: "3. Pricing & Modifications", text: "Prices, product availability, and promotional offers are subject to change at any time without prior notice. We reserve the right to modify or discontinue any product or service at our discretion." },
      { subtitle: "4. Limitation of Liability", text: "Scent Preview is not liable for any direct, indirect, or incidental damages resulting from the use or inability to use our products or website." }
    ]
  },
  privacy: {
    title: "PRIVACY POLICY",
    content: [
      { subtitle: "1. Information Collection", text: "We collect personal information necessary to fulfill your orders, including your name, shipping address, email address, phone number, and payment details." },
      { subtitle: "2. How Information Is Used", text: "Your data is used strictly for order processing, shipping updates, customer support, and essential store communications. We do not sell, rent, or trade your personal data to third parties." },
      { subtitle: "3. Payment Security", text: "Payment processing is handled via encrypted third-party payment gateways. Scent Preview does not store or process raw credit card or bank credentials on our servers." },
      { subtitle: "4. Data Rights", text: "You have the right to request access to, correction of, or deletion of your personal data at any time by contacting customer support." }
    ]
  },
  shipping: {
    title: "SHIPPING POLICY",
    content: [
      { subtitle: "1. Processing & Handling", text: "All orders are processed within 1 to 3 business days (excluding weekends and holidays). You will receive a tracking confirmation email once your order has dispatched." },
      { subtitle: "2. Delivery Timelines", text: "Standard Domestic: 3 to 7 business days.\nExpress Shipping: 1 to 3 business days.\n(Note: Regional location or carrier delays may slightly impact estimated delivery windows.)" },
      { subtitle: "3. Order Tracking", text: "Once shipped, your order confirmation will include a tracking code to monitor delivery status in real time." }
    ]
  },
  returns: {
    title: "RETURN & REFUND POLICY",
    content: [
      { subtitle: "1. Return Eligibility", text: "Due to hygiene, safety, and personal care standards, opened or used fragrance bottles cannot be accepted for return. Unopened, factory-sealed products in their original packaging are eligible for return within 14 days of delivery." },
      { subtitle: "2. Damaged or Defective Items", text: "If your package arrives damaged, leaking, or broken, contact us within 48 hours of delivery with photos of the damaged item and packaging. We will issue an immediate replacement or full refund." },
      { subtitle: "3. Refund Process", text: "Once an eligible return is received and inspected, refunds will be issued to your original payment method within 5 to 7 business days. Original shipping fees are non-refundable." }
    ]
  }
};


const ClaimFormModal = ({ isOpen, onClose, availableSkus, onSubmitSuccess }: { isOpen: boolean, onClose: () => void, availableSkus: string[], onSubmitSuccess: () => void }) => {
  const [buyerName, setBuyerName] = useState("");
  const [email, setEmail] = useState("");
  const [perfumeAndSize, setPerfumeAndSize] = useState("");
  const [proofImage, setProofImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setProofImage(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !email || !perfumeAndSize) {
      alert("Please fill out all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerName, email, perfumeAndSize, proofImage })
      });
      
      if (!res.ok) {
        throw new Error("Server error");
      }
      
      // Clear form
      setBuyerName("");
      setEmail("");
      setPerfumeAndSize("");
      setProofImage("");
      
      setSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      alert("Failed to submit claim.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className="relative bg-[#FAF9F6] text-black max-w-2xl w-full z-50 p-8 md:p-12 border border-[#111111] shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto rounded-none">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-black hover:opacity-50 transition-opacity cursor-pointer font-sans text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-2"
        >
          <span>BACK TO STORE</span>
          <span className="text-xl leading-none">×</span>
        </button>
        
        {submitted ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-6">
            <div className="p-4 bg-emerald-100 border border-emerald-500 rounded-lg">
               <span className="block font-mono text-[10px] md:text-xs tracking-widest uppercase font-bold text-emerald-900 mb-2">
                 [ CLAIM REGISTERED: REVIEWING WITHIN 48 HOUR WINDOW ]
               </span>
            </div>
            <h2 className="text-3xl font-sans font-bold text-black">Claim Submitted</h2>
            <p className="text-sm font-sans tracking-widest uppercase text-black">
              Your claim is under review. You will be contacted via email.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-8 bg-[#111111] text-white px-10 py-4 font-sans text-xs tracking-[0.2em] uppercase font-bold hover:bg-stone-900 transition-colors shadow-xl shadow-black/10"
            >
              BACK TO STORE
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-sans font-bold mb-6 border-b border-[#111111] pb-4">
              Shipping Complaint & Claim
            </h2>
            
            <div className="mb-8 p-4 border border-[#111111] bg-stone-100/50">
              <span className="block font-mono text-[10px] md:text-xs tracking-widest uppercase font-bold text-black mb-2 leading-relaxed">
                CLAIMS MUST BE SUBMITTED WITHIN 48 HOURS OF SHIPPING.
              </span>
              <p className="font-mono text-[10px] text-black leading-relaxed uppercase">
                * Claims past the 48-hour post-dispatch mark will be automatically rejected. Our internal systems cryptographically verify dispatch timestamps.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-mono text-[10px] tracking-widest uppercase font-bold text-black">
                  [ 01. BUYER NAME ]
                </label>
                <input 
                  type="text"
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  className="w-full bg-transparent border border-[#111111] p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] tracking-widest uppercase font-bold text-black">
                  [ 02. GMAIL / EMAIL ADDRESS ]
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-[#111111] p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] tracking-widest uppercase font-bold text-black">
                  [ 03. PERFUME & SIZE ]
                </label>
                <input
                  type="text"
                  list="claim-skus"
                  value={perfumeAndSize}
                  onChange={e => setPerfumeAndSize(e.target.value)}
                  placeholder="Type or select a perfume & size..."
                  className="w-full bg-transparent border border-[#111111] p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  required
                />
                <datalist id="claim-skus">
                  {availableSkus.map(sku => (
                    <option key={sku} value={sku} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] tracking-widest uppercase font-bold text-black">
                  [ 04. IMAGE PROOF ]
                </label>
                <div className="relative border border-[#111111] border-dashed p-8 text-center hover:bg-black/5 transition-colors cursor-pointer group">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-black group-hover:underline">
                      {proofImage ? "IMAGE ATTACHED. CLICK TO REPLACE." : "CLICK TO ATTACH PHOTO EVIDENCE (OPTIONAL)"}
                    </span>
                    {proofImage && (
                      <div className="mt-4 w-24 h-24 border border-[#111111] overflow-hidden">
                        <img src={proofImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#111111] hover:bg-stone-900 text-white py-5 mt-6 font-mono text-xs uppercase font-bold tracking-[0.2em] transition-colors border border-[#111111] disabled:opacity-50"
              >
                {isSubmitting ? "PROCESSING..." : "SUBMIT CLAIM FOR REVIEW"}
              </button>
            </form>
          </>
        )}
      </div>

    </div>
  );
};

export default function App() {
  // Navigation / Scroll helper
  const scrollToCatalog = () => {
    setSelectedDetailFragrance(null);
    setTimeout(() => {
      document.getElementById("kinetic-catalog")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const scrollToBuyNow = () => {
    if (cart.length === 0 && CATALOG_DATA.length > 0) {
      const firstInStock = CATALOG_DATA.find((f) => {
        if (f.isOutOfStock) return false;
        const fStock = stock?.fragrances[f.id];
        return fStock && Object.values(fStock).some((v) => (Number(v) || 0) > 0);
      });
      if (firstInStock) {
        const availSize = (["10ml", "5ml Normal", "5ml HQ"] as const).find(
          (s) => !firstInStock.disabledSizes?.includes(s) && (Number(stock?.fragrances[firstInStock.id]?.[s]) || 0) > 0
        ) || "5ml Normal";
        handleAddToCart(firstInStock, availSize);
      }
    }
    setIsCheckoutOpen(true);
  };

  // Stock State Management
  const [stock, setStock] = useState<{
    fragrances: Record<string, Record<string, number>>;
    bundles: Record<string, number>;
  }>(DEFAULT_FALLBACK_STOCK);

  const fetchStock = async () => {
    if (isStockDirtyRef.current) return;
    try {
      const res = await safeFetch("/api/stock");
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success && data.stock && !isStockDirtyRef.current) {
        setStock(data.stock);
      }
    } catch (e) {
      // Silently fall back to cached stock levels if network is unavailable
    }
  };

  const syncAndRecoverPendingOrder = async () => {
    try {
      const storedDetails = localStorage.getItem("scent_paymentDetails");
      if (!storedDetails) return;
      
      const parsedDetails = JSON.parse(storedDetails);
      if (!parsedDetails || !parsedDetails.orderNumber) return;
      
      console.log("[Redirection Auto-Sync] Found pending order in local storage:", parsedDetails.orderNumber);
      
      // Post to ensure it is registered on the server as "pending"
      const response = await safeFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedDetails)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.order) {
          addOrderToLocalStorageBackup(data.order);
          console.log("[Redirection Auto-Sync] Order successfully verified on backend.");
        }
      }
      
      // If the user already confirmed payment in this session but browser was refreshed/closed,
      // let's make sure the server has confirmed it as paid.
      const isConfirmedLocally = localStorage.getItem("scent_isPaymentConfirmed") === "true";
      if (isConfirmedLocally) {
        console.log("[Redirection Auto-Sync] Order was paid locally. Ensuring server registration...");
        const res = await safeFetch("/api/orders/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedDetails)
        });
        if (res.ok) {
          const confirmData = await res.json();
          if (confirmData.success) {
            addOrderToLocalStorageBackup({
              ...parsedDetails,
              status: "paid",
              createdAt: new Date().toISOString()
            });
          }
        }
      }
      
      fetchStock();
    } catch (err) {
      console.warn("[Redirection Auto-Sync] Could not reach backend during background sync:", err);
    }
  };

  const [activeTierBannerIndex, setActiveTierBannerIndex] = useState(0);
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setActiveTierBannerIndex((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(bannerTimer);
  }, []);

  useEffect(() => {
    fetchStock();
    syncAndRecoverPendingOrder();
    
    // Auto sync on visibility change (e.g. returning from PhonePe/GPay app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchStock();
        syncAndRecoverPendingOrder();
      }
    };

    // Auto sync on window focus
    const handleWindowFocus = () => {
      fetchStock();
      syncAndRecoverPendingOrder();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);
    
    const interval = setInterval(() => {
      fetchStock();
      syncAndRecoverPendingOrder();
    }, 15000);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
      clearInterval(interval);
    };
  }, []);

  // State Management
  const [cart, setCart] = useState<{ id: string; name: string; brand: string; size: string; price: number; quantity: number; image?: string }[]>(() => {
    try {
      const stored = localStorage.getItem("scent_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartCheckoutVisible, setIsCartCheckoutVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!isCartOpen) {
      setIsCartCheckoutVisible(false);
    }
  }, [isCartOpen]);

  // Helper to find a fragrance from hostname (subdomains) or pathname/search params
  const resolveFragranceFromLocation = (): Fragrance | null => {
    if (typeof window === "undefined") return null;
    
    // 1. Check Subdomain (e.g. scentpreviewgentlemangivenchy.onrender.com or givenchy-gentleman.scentpreview.com)
    const hostname = window.location.hostname.toLowerCase();
    
    // Check direct matching against catalog IDs, explicit subdomainSlug, or slugified names
    for (const f of CATALOG_DATA) {
      const cleanSlug = f.id.replace(/-/g, ""); // e.g. givenchygentleman
      const nameSlug = f.name.toLowerCase().replace(/[^a-z0-9]/g, ""); // e.g. givenchygentleman
      const customSubdomain = f.subdomainSlug?.toLowerCase() || "";
      
      // Check if hostname begins with or contains the exact custom subdomain or perfume slug
      if (
        (customSubdomain && hostname.includes(customSubdomain)) ||
        hostname.includes(`scentpreview${cleanSlug}`) ||
        hostname.includes(`scentpreview${nameSlug}`) ||
        hostname.startsWith(`${f.id}.`) ||
        hostname.startsWith(`${nameSlug}.`) ||
        hostname.startsWith(`${cleanSlug}.`)
      ) {
        return f;
      }
    }

    // 2. Check Pathname (/perfume/:id, /p/:id, /:id)
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    if (path) {
      const segments = path.split("/");
      const targetSlug = segments[segments.length - 1]; // last segment or /perfume/givenchy-gentleman
      const match = CATALOG_DATA.find(
        (f) => 
          f.id === targetSlug || 
          f.id === segments[0] || 
          (f.subdomainSlug && f.subdomainSlug === targetSlug) ||
          f.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === targetSlug ||
          f.name.toLowerCase().replace(/[^a-z0-9]/g, "") === targetSlug
      );
      if (match) return match;
    }

    // 3. Check Query parameter (?p=givenchy-gentleman or ?perfume=versace-crystal-noir)
    const params = new URLSearchParams(window.location.search);
    const queryPerfume = params.get("p") || params.get("perfume") || params.get("id");
    if (queryPerfume) {
      const queryClean = queryPerfume.toLowerCase().trim();
      const match = CATALOG_DATA.find(
        (f) => 
          f.id === queryClean || 
          (f.subdomainSlug && f.subdomainSlug === queryClean) ||
          f.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === queryClean ||
          f.name.toLowerCase().replace(/[^a-z0-9]/g, "") === queryClean
      );
      if (match) return match;
    }

    return null;
  };

  const [selectedBundleSizes, setSelectedBundleSizes] = useState<Record<string, BundleSizeType>>({});
  const [selectedDetailFragrance, setSelectedDetailFragrance] = useState<Fragrance | null>(() => {
    return resolveFragranceFromLocation();
  });

  const handleOpenFragranceDetails = (fragrance: Fragrance) => {
    setSelectedDetailFragrance(fragrance);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    
    // Update browser URL so page reload or sharing keeps this perfume open permanently
    try {
      const newUrl = `${window.location.pathname}?perfume=${encodeURIComponent(fragrance.id)}`;
      window.history.pushState({ perfumeId: fragrance.id }, "", newUrl);
    } catch (e) {}
  };

  const handleBackFromDetails = () => {
    setSelectedDetailFragrance(null);
    try {
      const newUrl = window.location.pathname;
      window.history.pushState({}, "", newUrl);
    } catch (e) {}
  };

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolveFragranceFromLocation();
      setSelectedDetailFragrance(resolved);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const [policyModal, setPolicyModal] = useState<"terms" | "privacy" | "shipping" | "returns" | null>(null);
  const [isClaimFormOpen, setIsClaimFormOpen] = useState(false);
  const [adminComplaints, setAdminComplaints] = useState<any[]>([]);

  const [isCheckoutFormVisible, setIsCheckoutFormVisible] = useState<boolean>(() => {
    try {
      return localStorage.getItem("scent_isCheckoutFormVisible") === "true";
    } catch {
      return false;
    }
  });
  
  // UPI Payment states
  const [showPaymentPage, setShowPaymentPage] = useState<boolean>(() => {
    try {
      return localStorage.getItem("scent_showPaymentPage") === "true";
    } catch {
      return false;
    }
  });
  const [paymentDetails, setPaymentDetails] = useState<{
    items: { name: string; size: string; quantity: number }[];
    total: number;
    subtotal?: number;
    discount?: number;
    couponCode?: string;
    shippingProtection?: boolean;
    orderNumber: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    state?: string;
    pincode?: string;
  } | null>(() => {
    try {
      const stored = localStorage.getItem("scent_paymentDetails");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("scent_isPaymentConfirmed") === "true";
    } catch {
      return false;
    }
  });
  const [isConfirmingPayment, setIsConfirmingPayment] = useState<boolean>(false);

  // Express Buy Now Section State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem("scent_isCheckoutOpen") === "true";
    } catch {
      return false;
    }
  });
  const [selectionType, setSelectionType] = useState<"fragrance" | "bundle">("fragrance");
  const [selectedBuyId, setSelectedBuyId] = useState<string>("");
  const [selectedBuySize, setSelectedBuySize] = useState<"10ml" | "5ml Normal" | "5ml HQ">("10ml");
  const [buyQuantity, setBuyQuantity] = useState<number>(1);
  const [checkoutName, setCheckoutName] = useState<string>(() => {
    try {
      return localStorage.getItem("scent_checkoutName") || "";
    } catch {
      return "";
    }
  });
  const [isNameAuthorized, setIsNameAuthorized] = useState<boolean>(() => {
    try {
      return localStorage.getItem("scent_isNameAuthorized") === "true";
    } catch {
      return false;
    }
  });
  const [checkoutEmail, setCheckoutEmail] = useState<string>(() => {
    try {
      return localStorage.getItem("scent_checkoutEmail") || "";
    } catch {
      return "";
    }
  });
  const [checkoutAddress, setCheckoutAddress] = useState<string>(() => {
    try {
      return localStorage.getItem("scent_checkoutAddress") || "";
    } catch {
      return "";
    }
  });
  const [checkoutPhone, setCheckoutPhone] = useState<string>(() => {
    try {
      return localStorage.getItem("scent_checkoutPhone") || "";
    } catch {
      return "";
    }
  });
  const [checkoutState, setCheckoutState] = useState<string>(() => {
    try {
      return localStorage.getItem("scent_checkoutState") || "Maharashtra";
    } catch {
      return "Maharashtra";
    }
  });
  const [checkoutPincode, setCheckoutPincode] = useState<string>(() => {
    try {
      return localStorage.getItem("scent_checkoutPincode") || "";
    } catch {
      return "";
    }
  });
  const [shippingPriority, setShippingPriority] = useState<"express" | "standard">("standard");
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(() => {
    try {
      return localStorage.getItem("scent_isOrderPlaced") === "true";
    } catch {
      return false;
    }
  });
  const [placedOrderData, setPlacedOrderData] = useState<any>(() => {
    try {
      const stored = localStorage.getItem("scent_placedOrderData");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [registrySearchQuery, setRegistrySearchQuery] = useState<string>("");
  const [isCartSuccessOpen, setIsCartSuccessOpen] = useState<boolean>(false);
  const [cartSuccessOrderNum, setCartSuccessOrderNum] = useState<string>("");
  const [isShippingProtectionEnabled, setIsShippingProtectionEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("scent_isShippingProtectionEnabled") === "true";
    } catch {
      return false;
    }
  });

  const FREE_DELIVERY_COUPONS = new Set([
    "K7Q9M2X", "PROMO5B8", "V4NP7R", "SAVE2K6J", "D8W3FX", "LUCKY9QM", "Z5T7KN", "SHIP4VQ", "FREE8P2", "SPEED6HX",
    "B9R4WL", "ENJOY7DK", "X3M5GT", "RUSH2FP", "C6Y8NV", "FAST9JQ", "T2K7RM", "BONUS5WX", "H4P6SL", "DEAL8VZ",
    "S7B3KQ", "PICK9CX", "W5F2GT", "URBAN6MY", "R8L4PN", "QUICK7AH", "J3V9KW", "LAUNCH2DX", "A6Q5BP", "GRIP7FS",
    "N9M3VT", "SMOOTH4LK", "E2W8RX", "VIBE5CJ", "L7P4DN", "SPARK9MZ", "G3H6KV", "ZONE8WQ", "Y5T2FP", "BLEND7RJ",
    "O4N6XM", "MOTION9KL", "C8S3VH", "STYLE2BX", "U6W9RF", "PRIME5GT", "I7D4KQ", "FLICK3NP", "X2V8LM", "CHARGE6AY",
    "B5H7CW", "CRUISE9PX", "F9M3RL", "ACTIVE7KZ", "J4T6DV", "SWIFT2QX", "P8R5NM", "GLORY4LJ", "K3W9BH", "STORM6FY",
    "V7G2KX", "TURBO8CP", "S5L9RM", "ALPHA3DW", "T2H6QV", "SONIC7NP", "Z4B8FX", "BLAZE9KJ", "M6E3WL", "QUEST5GY",
    "D9R4TX", "IGNITE2VZ", "A7C5HK", "TEMPO8QM", "U3F6RX", "VIGOR4NJ", "L5P9BW", "ORBIT7DY", "O8W2KV", "FRAME6CP",
    "Y4M7FX", "RHYTHM9LZ", "Q6V3NM", "GLOW5BJ", "X2S8KW", "PEAK7AY", "H9D4RV", "SURGE2GX", "J3L6CP", "WAVE8NP",
    "E5T9QM", "CREST4FZ", "W7B2KL", "NEXUS6XY", "R4H8DP", "LUNAR9AW", "I6G3NV", "BOLT5JK", "C8E9TX", "SOLAR7MZ"
  ]);

  const [couponInput, setCouponInput] = useState<string>("");
  const [usedCoupons, setUsedCoupons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("scent_usedCoupons");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem("scent_appliedCoupon");
      const usedRaw = localStorage.getItem("scent_usedCoupons");
      const usedList: string[] = usedRaw ? JSON.parse(usedRaw) : [];
      const norm = saved ? saved.trim().toUpperCase() : "";
      return norm && FREE_DELIVERY_COUPONS.has(norm) && !usedList.includes(norm) ? norm : null;
    } catch {
      return null;
    }
  });
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsedCoupons = async () => {
      try {
        const res = await safeFetch("/api/coupons/used");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.usedCoupons)) {
            setUsedCoupons(data.usedCoupons);
            try {
              localStorage.setItem("scent_usedCoupons", JSON.stringify(data.usedCoupons));
            } catch {}
            setAppliedCoupon((prev) => {
              if (prev && data.usedCoupons.includes(prev)) {
                try {
                  localStorage.removeItem("scent_appliedCoupon");
                } catch {}
                return null;
              }
              return prev;
            });
          }
        }
      } catch {}
    };
    fetchUsedCoupons();
  }, [isCartOpen, isCheckoutOpen, isCheckoutFormVisible]);

  const handleApplyCoupon = async () => {
    const normalized = couponInput.trim().toUpperCase();
    if (!normalized) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    if (!FREE_DELIVERY_COUPONS.has(normalized)) {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code.");
      try {
        localStorage.removeItem("scent_appliedCoupon");
      } catch {}
      return;
    }
    if (usedCoupons.includes(normalized)) {
      setAppliedCoupon(null);
      setCouponError("This coupon code has already been used.");
      try {
        localStorage.removeItem("scent_appliedCoupon");
      } catch {}
      return;
    }

    try {
      const res = await safeFetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalized }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setAppliedCoupon(null);
        setCouponError(data.error || "This coupon code has already been used.");
        if (data.error && data.error.includes("already been used")) {
          const updated = Array.from(new Set([...usedCoupons, normalized]));
          setUsedCoupons(updated);
          try {
            localStorage.setItem("scent_usedCoupons", JSON.stringify(updated));
          } catch {}
        }
        try {
          localStorage.removeItem("scent_appliedCoupon");
        } catch {}
        return;
      }
    } catch {
      // Fallback to local check if network is momentarily unreachable
    }

    setAppliedCoupon(normalized);
    setCouponInput(normalized);
    setCouponError(null);
    try {
      localStorage.setItem("scent_appliedCoupon", normalized);
    } catch {}
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    try {
      localStorage.removeItem("scent_appliedCoupon");
    } catch {}
  };

  const renderCouponSection = () => (
    <div className="pt-2 pb-1">
      <label className="block text-[8px] font-mono text-black uppercase tracking-wider mb-1.5 font-bold">
        Enter Coupon
      </label>
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200 px-3 py-2 text-xs font-mono text-emerald-900">
          <span>
            Code <strong>{appliedCoupon}</strong> · Free Delivery (-₹116)
          </span>
          <button
            type="button"
            onClick={handleRemoveCoupon}
            className="text-[10px] font-mono uppercase tracking-wider text-stone-600 hover:text-black underline cursor-pointer ml-2"
          >
            Remove
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value.toUpperCase());
                if (couponError) setCouponError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyCoupon();
                }
              }}
              placeholder="Enter coupon code"
              className="flex-1 bg-white border border-stone-200 px-3 py-2 text-xs text-black font-mono uppercase tracking-wider focus:outline-none focus:border-stone-500 placeholder:normal-case placeholder:tracking-normal placeholder-stone-400"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-stone-900 hover:bg-black text-white font-mono text-[10px] uppercase tracking-widest font-bold px-4 py-2 transition-colors cursor-pointer shrink-0"
            >
              Apply
            </button>
          </div>
          {couponError && (
            <p className="text-[10px] font-mono text-rose-600 mt-1">{couponError}</p>
          )}
        </div>
      )}
    </div>
  );

  // Cross Sell Recommendation State
  const [crossSellRecommendation, setCrossSellRecommendation] = useState<{
    isOpen: boolean;
    addedItemName: string;
    recommendedPerfumes: Fragrance[];
  }>({
    isOpen: false,
    addedItemName: "",
    recommendedPerfumes: []
  });
  const [recommendationScrollTop, setRecommendationScrollTop] = useState<number>(0);

  useEffect(() => {
    if (!crossSellRecommendation.isOpen) {
      setRecommendationScrollTop(0);
    }
  }, [crossSellRecommendation.isOpen]);

  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState<string | null>(null);
  // Anti Quiz State
  const [isAntiQuizOpen, setIsAntiQuizOpen] = useState<boolean>(false);
  const [isAestheticQuizOpen, setIsAestheticQuizOpen] = useState<boolean>(false);
  const [isChordQuizOpen, setIsChordQuizOpen] = useState<boolean>(false);
  const [isScentBattleOpen, setIsScentBattleOpen] = useState<boolean>(false);
  const [isQuizListOpen, setIsQuizListOpen] = useState<boolean>(false);
  const [quizScrollTop, setQuizScrollTop] = useState<number>(0);

  useEffect(() => {
    if (!isQuizListOpen) {
      setQuizScrollTop(0);
    }
  }, [isQuizListOpen]);

  // Admin Portal States
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [isLoadingAdminOrders, setIsLoadingAdminOrders] = useState<boolean>(false);
  const [adminActiveTab, setAdminActiveTab] = useState<"view" | "create" | "stock" | "prices" | "claims">("view");
  const [adminPriceSearch, setAdminPriceSearch] = useState<string>("");
  const [adminPriceFilter, setAdminPriceFilter] = useState<"all" | "fragrance" | "bundle" | "outofstock" | "disabled">("all");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPasscodeInput, setAdminPasscodeInput] = useState<string>("");

  const [adminPasscodeError, setAdminPasscodeError] = useState<string | null>(null);
  const [adminLockoutTime, setAdminLockoutTime] = useState<number | null>(() => {
    const stored = localStorage.getItem("scent_adminLockoutTime");
    return stored ? parseInt(stored) : null;
  });
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<string>("");
  const [isAdminLocked, setIsAdminLocked] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    const checkLockout = () => {
      if (adminLockoutTime) {
        const diff = adminLockoutTime - Date.now();
        if (diff <= 0) {
          setIsAdminLocked(false);
          setAdminLockoutTime(null);
          setLockoutTimeRemaining("");
          try {
            localStorage.removeItem("scent_adminLockoutTime");
            localStorage.setItem("scent_adminAttempts", "0");
          } catch(e){}
        } else {
          setIsAdminLocked(true);
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setLockoutTimeRemaining(`${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`);
        }
      } else {
        setIsAdminLocked(false);
        setLockoutTimeRemaining("");
      }
    };
    checkLockout();
    if (adminLockoutTime) {
      interval = setInterval(checkLockout, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [adminLockoutTime]);
  


  const [orderDeletingNum, setOrderDeletingNum] = useState<string | null>(null);

  // Manual Order Creation State
  const [adminManualName, setAdminManualName] = useState<string>("");
  const [adminManualEmail, setAdminManualEmail] = useState<string>("");
  const [adminManualAddress, setAdminManualAddress] = useState<string>("");
  const [adminManualPhone, setAdminManualPhone] = useState<string>("");
  const [adminManualState, setAdminManualState] = useState<string>("Maharashtra");
  const [adminManualPincode, setAdminManualPincode] = useState<string>("");
  const [adminManualVariantName, setAdminManualVariantName] = useState<string>("");
  const [adminManualVariantSize, setAdminManualVariantSize] = useState<string>("5ml Normal");
  const [adminManualVariantQty, setAdminManualVariantQty] = useState<number>(1);
  const [adminManualShippingProtection, setAdminManualShippingProtection] = useState<boolean>(false);
  const [adminManualTotal, setAdminManualTotal] = useState<number>(748);
  const [adminStatusMessage, setAdminStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [adminManualDeliveryNA, setAdminManualDeliveryNA] = useState<boolean>(false);
  const [adminManualNoStockReduction, setAdminManualNoStockReduction] = useState<boolean>(false);
  const [isSavingManualOrder, setIsSavingManualOrder] = useState<boolean>(false);
  const [manualStockAlert, setManualStockAlert] = useState<{
    orderNumber: string;
    variantName: string;
    variantSize: string;
    quantity: number;
    customerName: string;
    total: number;
  } | null>(null);

  // LocalStorage synchronizing effects
  useEffect(() => {
    try {
      localStorage.setItem("scent_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("scent_isCheckoutFormVisible", String(isCheckoutFormVisible));
  }, [isCheckoutFormVisible]);

  useEffect(() => {
    localStorage.setItem("scent_showPaymentPage", String(showPaymentPage));
  }, [showPaymentPage]);

  useEffect(() => {
    if (paymentDetails) {
      localStorage.setItem("scent_paymentDetails", JSON.stringify(paymentDetails));
    } else {
      localStorage.removeItem("scent_paymentDetails");
    }
  }, [paymentDetails]);

  useEffect(() => {
    localStorage.setItem("scent_isPaymentConfirmed", String(isPaymentConfirmed));
  }, [isPaymentConfirmed]);

  useEffect(() => {
    localStorage.setItem("scent_isCheckoutOpen", String(isCheckoutOpen));
  }, [isCheckoutOpen]);

  useEffect(() => {
    localStorage.setItem("scent_checkoutName", checkoutName);
  }, [checkoutName]);

  useEffect(() => {
    localStorage.setItem("scent_isNameAuthorized", String(isNameAuthorized));
  }, [isNameAuthorized]);

  useEffect(() => {
    localStorage.setItem("scent_checkoutEmail", checkoutEmail);
  }, [checkoutEmail]);

  useEffect(() => {
    localStorage.setItem("scent_checkoutAddress", checkoutAddress);
  }, [checkoutAddress]);

  useEffect(() => {
    localStorage.setItem("scent_checkoutPhone", checkoutPhone);
  }, [checkoutPhone]);

  useEffect(() => {
    localStorage.setItem("scent_checkoutState", checkoutState);
  }, [checkoutState]);

  useEffect(() => {
    localStorage.setItem("scent_checkoutPincode", checkoutPincode);
  }, [checkoutPincode]);

  useEffect(() => {
    localStorage.setItem("scent_isOrderPlaced", String(isOrderPlaced));
  }, [isOrderPlaced]);

  useEffect(() => {
    if (placedOrderData) {
      localStorage.setItem("scent_placedOrderData", JSON.stringify(placedOrderData));
    } else {
      localStorage.removeItem("scent_placedOrderData");
    }
  }, [placedOrderData]);

  useEffect(() => {
    localStorage.setItem("scent_isShippingProtectionEnabled", String(isShippingProtectionEnabled));
  }, [isShippingProtectionEnabled]);

  const addOrderToLocalStorageBackup = (order: any) => {
    if (!order || !order.orderNumber) return;
    try {
      const backupStr = localStorage.getItem("scent_admin_orders_backup");
      let backupOrders: any[] = [];
      if (backupStr) {
        try {
          backupOrders = JSON.parse(backupStr);
          if (!Array.isArray(backupOrders)) backupOrders = [];
        } catch (e) {
          backupOrders = [];
        }
      }
      const index = backupOrders.findIndex((o: any) => o && o.orderNumber === order.orderNumber);
      if (index > -1) {
        backupOrders[index] = { ...backupOrders[index], ...order };
      } else {
        backupOrders.unshift(order);
      }
      localStorage.setItem("scent_admin_orders_backup", JSON.stringify(backupOrders));
    } catch (e) {
      console.error("[Backup Save] Failed to save order to local storage backup:", e);
    }
  };

  const fetchAdminOrders = async () => {
    if (!isAdminAuthenticated) return;
    setIsLoadingAdminOrders(true);
    try {
      const token = localStorage.getItem("scent_admin_token") || "";
      const response = await safeFetch("/api/orders", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const serverOrders = data.orders || [];
        const serverMap = new Map<string, any>();
        serverOrders.forEach((so: any) => {
          if (so && so.orderNumber) {
            serverMap.set(so.orderNumber, so);
          }
        });

        // Merge any locally saved manual orders that might not have synced yet
        try {
          const backupStr = localStorage.getItem("scent_admin_orders_backup");
          if (backupStr) {
            const localBackup = JSON.parse(backupStr);
            if (Array.isArray(localBackup)) {
              for (const lo of localBackup) {
                if (lo && lo.orderNumber && !serverMap.has(lo.orderNumber) && lo.status !== "deleted") {
                  serverMap.set(lo.orderNumber, lo);
                  // Sync missing manual order to backend in background
                  safeFetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...lo, skipStockReduction: true })
                  }).catch(() => {});
                }
              }
            }
          }
        } catch (mergeErr) {
          console.warn("[Order Sync] Failed to merge local backup:", mergeErr);
        }

        const mergedOrders = Array.from(serverMap.values());
        
        // Sort orders by date descending
        mergedOrders.sort((a: any, b: any) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        
        // Only set active (non-deleted) orders to state for the UI
        const activeOrders = mergedOrders.filter((mo: any) => mo.status !== "deleted");
        setAdminOrders(activeOrders);
        
        // Cache the merged orders in local storage as an offline fallback
        localStorage.setItem("scent_admin_orders_backup", JSON.stringify(mergedOrders));
      } else {
        // If unauthorized or failed on the backend, clear authentication to prompt login
        setIsAdminAuthenticated(false);
        localStorage.removeItem("scent_admin_token");
      }
    } catch (err) {
      console.error("Failed to fetch admin orders, falling back to local backup:", err);
      // Retrieve client-side local storage backup as offline fallback
      const backupStr = localStorage.getItem("scent_admin_orders_backup");
      let backupOrders: any[] = [];
      try {
        if (backupStr) backupOrders = JSON.parse(backupStr);
      } catch (e) {
        console.error("[Offline Fallback Error] Failed to parse local orders backup:", e);
      }
      if (Array.isArray(backupOrders)) {
        // Filter out tombstones and sort by date descending
        const activeBackupOrders = backupOrders.filter(o => o && o.status !== "deleted");
        activeBackupOrders.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        setAdminOrders(activeBackupOrders);
      }
    } finally {
      setIsLoadingAdminOrders(false);
    }
  };

  const updateClaimStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("scent_admin_token") || "";
      const response = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setAdminComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Error updating status.");
    }
  };

  const fetchAdminComplaints = async () => {
    if (!isAdminAuthenticated) return;
    try {
      const token = localStorage.getItem("scent_admin_token") || "";
      const response = await safeFetch("/api/complaints", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAdminComplaints(data.complaints || []);
      }
    } catch (e) {
      console.error(e);
    }
  };


  useEffect(() => {
    let interval: any = null;
    if (isAdminOpen) {
      if (isAdminAuthenticated) {
        fetchAdminOrders();
        fetchAdminComplaints();
        interval = setInterval(() => {
           fetchAdminOrders();
           fetchAdminComplaints();
        }, 10000); // Keep admin orders synchronized across devices
      }
    } else {
      setIsAdminAuthenticated(false);
      setAdminPasscodeInput("");
      setAdminPasscodeError(null);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAdminOpen, isAdminAuthenticated]);

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedVariantName = adminManualVariantName.trim();
    if (!trimmedVariantName) {
      setAdminStatusMessage({ type: "error", text: "Please fill in the Perfume Variant Name." });
      return;
    }

    const finalName = adminManualDeliveryNA
      ? (adminManualName.trim() || "Walk-in Customer / N/A")
      : (adminManualName.trim() || "Walk-in Customer / N/A");
    const finalAddress = adminManualDeliveryNA
      ? "Not Applicable"
      : (adminManualAddress.trim() || "Not Applicable");
    const finalEmail = adminManualDeliveryNA
      ? "notapplicable@scentpreview.com"
      : (adminManualEmail.trim() || "admin@scentpreview.com");
    const finalPhone = adminManualDeliveryNA
      ? "N/A"
      : (adminManualPhone.trim() || "N/A");
    const finalState = adminManualDeliveryNA
      ? "N/A"
      : (adminManualState.trim() || "N/A");
    const finalPincode = adminManualDeliveryNA
      ? "000000"
      : (adminManualPincode.trim() || "000000");

    const savedVariantSize = adminManualVariantSize;
    const savedVariantQty = Math.max(1, Number(adminManualVariantQty) || 1);
    const savedTotal = Math.max(0, Number(adminManualTotal) || 0);
    const orderNum = `SP-ADMIN-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const payload = {
      orderNumber: orderNum,
      items: [{
        name: trimmedVariantName,
        size: savedVariantSize,
        quantity: savedVariantQty
      }],
      total: savedTotal,
      name: finalName,
      email: finalEmail,
      address: finalAddress,
      phone: finalPhone,
      state: finalState,
      pincode: finalPincode,
      shippingProtection: adminManualShippingProtection,
      skipStockReduction: true // Manual orders never auto-deduct stock; show alert instead
    };

    const paidOrderRecord = {
      ...payload,
      status: "paid",
      stockReduced: false,
      createdAt: nowIso
    };

    setIsSavingManualOrder(true);
    try {
      // Immediately add to local state & backup so the order is never lost
      addOrderToLocalStorageBackup(paidOrderRecord);
      setAdminOrders((prev) => [
        paidOrderRecord,
        ...prev.filter((o: any) => o.orderNumber !== orderNum)
      ]);

      try {
        // 1. Save the manual order on the server (persists to Firestore + disk as paid without reducing stock)
        const createRes = await safeFetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const createData = await createRes.json();

        // 2. Also call confirm-payment to ensure paid status and notification flow (with skipStockReduction: true)
        await safeFetch("/api/orders/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (createData?.order) {
          addOrderToLocalStorageBackup({ ...createData.order, status: "paid" });
        }
      } catch (netErr) {
        console.warn("[Manual Order] Saved locally and queued for sync:", netErr);
      }

      // Show prominent Stock Reduction Alert without reducing stock
      setManualStockAlert({
        orderNumber: orderNum,
        variantName: trimmedVariantName,
        variantSize: savedVariantSize,
        quantity: savedVariantQty,
        customerName: finalName,
        total: savedTotal
      });

      setAdminStatusMessage({
        type: "success",
        text: `Manual Order ${orderNum} saved! Stock Alert: Stock was NOT reduced automatically — please manually reduce stock by ${savedVariantQty}x ${trimmedVariantName} (${savedVariantSize}) in the Stock Levels tab.`
      });

      // Reset inputs
      setAdminManualName("");
      setAdminManualEmail("");
      setAdminManualAddress("");
      setAdminManualPhone("");
      setAdminManualVariantName("");
      setAdminManualVariantQty(1);
      setAdminManualShippingProtection(false);
      setAdminManualTotal(748);
      setAdminManualDeliveryNA(false);
      setAdminManualNoStockReduction(false);

      // Sync orders list from backend (preserving our newly saved order)
      await fetchAdminOrders();
      fetchStock();
    } catch (err: any) {
      console.error(err);
      setAdminStatusMessage({ type: "error", text: err.message || "Failed to process manual order entry." });
    } finally {
      setIsSavingManualOrder(false);
    }
  };

  const handleDeleteOrder = async (orderNumber: string) => {
    try {
      const token = localStorage.getItem("scent_admin_token") || "";
      const response = await safeFetch(`/api/orders/${orderNumber}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Also remove from client-side local storage backup
        const backupStr = localStorage.getItem("scent_admin_orders_backup");
        if (backupStr) {
          try {
            const backupOrders = JSON.parse(backupStr);
            const filteredBackup = backupOrders.filter((o: any) => o.orderNumber !== orderNumber);
            localStorage.setItem("scent_admin_orders_backup", JSON.stringify(filteredBackup));
          } catch (e) {
            console.error("[Backup Delete] Failed to update local storage backup:", e);
          }
        }

        setAdminStatusMessage({ type: "success", text: `Order ${orderNumber} deleted successfully.` });
        setOrderDeletingNum(null);
        fetchAdminOrders();
        fetchStock();
      } else {
        throw new Error(data.error || "Failed to delete order");
      }
    } catch (err: any) {
      console.error(err);
      setAdminStatusMessage({ type: "error", text: err.message || "Failed to delete order." });
    }
  };

  const [banningOrderNum, setBanningOrderNum] = useState<string | null>(null);

  const handleBanOrder = async (order: any) => {
    try {
      const token = localStorage.getItem("scent_admin_token") || "";
      const response = await safeFetch("/api/admin/blacklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          phone: order.phone,
          email: order.email,
          ip: order.ip
        })
      });
      const data = await response.json();
      if (data.success) {
        setAdminStatusMessage({ type: "success", text: `Device / Account for order ${order.orderNumber} successfully blacklisted & banned.` });
        setBanningOrderNum(null);
      } else {
        throw new Error(data.error || "Failed to blacklist device");
      }
    } catch (err: any) {
      console.error(err);
      setAdminStatusMessage({ type: "error", text: err.message || "Failed to ban device." });
    }
  };

  const [isSavingStock, setIsSavingStock] = useState<boolean>(false);
  const stockDebounceRef = useRef<any>(null);
  const isStockDirtyRef = useRef<boolean>(false);
  const latestStockRef = useRef<any>(null);

  const saveStockImmediately = async () => {
    if (!isStockDirtyRef.current || !latestStockRef.current) return;
    
    if (stockDebounceRef.current) {
      clearTimeout(stockDebounceRef.current);
      stockDebounceRef.current = null;
    }

    setIsSavingStock(true);
    try {
      const res = await safeFetch("/api/stock", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("scent_admin_token") || ""}`
        },
        body: JSON.stringify(latestStockRef.current)
      });
      const data = await res.json();
      if (data.success) {
        setStock(data.stock);
        isStockDirtyRef.current = false;
        setAdminStatusMessage({
          type: "success",
          text: "All direct data levels saved successfully!"
        });
        console.log("[Auto-Save] Stock saved immediately upon session close.");
      }
    } catch (err) {
      console.error("[Auto-Save] Failed to save stock immediately upon session close:", err);
    } finally {
      setIsSavingStock(false);
    }
  };

  const handleCloseAndSaveAdminSession = async () => {
    await saveStockImmediately();
    setIsAdminOpen(false);
    setIsAdminAuthenticated(false);
    setAdminPasscodeInput("");
    setAdminOrders([]);
    localStorage.removeItem("scent_admin_token");
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isStockDirtyRef.current && latestStockRef.current) {
        safeFetch("/api/stock", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("scent_admin_token") || ""}`
          },
          body: JSON.stringify(latestStockRef.current),
          keepalive: true
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (stockDebounceRef.current) {
        clearTimeout(stockDebounceRef.current);
      }
    };
  }, []);

  const handleStockChange = (type: "fragrance" | "bundle", itemId: string, sizeOrKey: string, newValue: number) => {
    if (!stock) return;
    const value = Math.max(0, newValue);
    const updatedStock = JSON.parse(JSON.stringify(stock));
    if (type === "fragrance") {
      if (!updatedStock.fragrances[itemId]) {
        updatedStock.fragrances[itemId] = {};
      }
      updatedStock.fragrances[itemId][sizeOrKey] = value;
    } else {
      updatedStock.bundles[itemId] = value;
    }
    setStock(updatedStock);

    isStockDirtyRef.current = true;
    latestStockRef.current = updatedStock;

    if (stockDebounceRef.current) {
      clearTimeout(stockDebounceRef.current);
    }

    setAdminStatusMessage({
      type: "success",
      text: "Stock updated... Auto-saving in progress..."
    });

    stockDebounceRef.current = setTimeout(async () => {
      setIsSavingStock(true);
      try {
        const res = await safeFetch("/api/stock", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("scent_admin_token") || ""}`
          },
          body: JSON.stringify(updatedStock)
        });
        const data = await res.json();
        if (data.success) {
          setStock(data.stock);
          isStockDirtyRef.current = false;
          setAdminStatusMessage({
            type: "success",
            text: "All stock levels auto-saved successfully!"
          });
        } else {
          setAdminStatusMessage({
            type: "error",
            text: data.error || "Failed to auto-save stock levels."
          });
        }
      } catch (err) {
        console.error("Error auto-saving stock:", err);
        setAdminStatusMessage({
          type: "error",
          text: "Failed to auto-save stock levels due to a network issue."
        });
      } finally {
        setIsSavingStock(false);
      }
    }, 1000);
  };

  const handleZeroOutFragrance = (itemId: string) => {
    if (!stock) return;
    const updatedStock = JSON.parse(JSON.stringify(stock));
    if (!updatedStock.fragrances[itemId]) {
      updatedStock.fragrances[itemId] = {};
    }
    // Set all variants to exactly 0
    updatedStock.fragrances[itemId]["5ml Normal"] = 0;
    updatedStock.fragrances[itemId]["5ml HQ"] = 0;
    updatedStock.fragrances[itemId]["10ml"] = 0;
    setStock(updatedStock);

    isStockDirtyRef.current = true;
    latestStockRef.current = updatedStock;

    if (stockDebounceRef.current) {
      clearTimeout(stockDebounceRef.current);
    }

    const frag = CATALOG_DATA.find((f) => f.id === itemId);
    setAdminStatusMessage({
      type: "success",
      text: `${frag?.name || itemId} stock zeroed out across all sizes. Auto-saving...`
    });

    stockDebounceRef.current = setTimeout(async () => {
      setIsSavingStock(true);
      try {
        const res = await safeFetch("/api/stock", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("scent_admin_token") || ""}`
          },
          body: JSON.stringify(updatedStock)
        });
        const data = await res.json();
        if (data.success) {
          setStock(data.stock);
          isStockDirtyRef.current = false;
          setAdminStatusMessage({
            type: "success",
            text: `${frag?.name || itemId} is now 0 (Out of stock as a whole across site).`
          });
        }
      } catch (err) {
        console.error("Error auto-saving zeroed stock:", err);
      } finally {
        setIsSavingStock(false);
      }
    }, 500);
  };

  const saveUpdatedStock = async () => {
    if (!stock) return;
    setIsSavingStock(true);
    setAdminStatusMessage(null);
    try {
      const res = await safeFetch("/api/stock", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("scent_admin_token") || ""}`
        },
        body: JSON.stringify(stock)
      });
      const data = await res.json();
      if (data.success) {
        setStock(data.stock);
        isStockDirtyRef.current = false;
        setAdminStatusMessage({
          type: "success",
          text: "Stock levels successfully saved and synchronized."
        });
      } else {
        setAdminStatusMessage({
          type: "error",
          text: data.error || "Failed to save stock levels."
        });
      }
    } catch (err) {
      console.error("Error saving stock:", err);
      setAdminStatusMessage({
        type: "error",
        text: "Network error. Failed to save stock levels."
      });
    } finally {
      setIsSavingStock(false);
    }
  };

  const resetStockToOfficial = async () => {
    if (!window.confirm("Are you sure you want to reset ALL stock to the official baseline list? This cannot be undone.")) return;
    setIsSavingStock(true);
    setAdminStatusMessage(null);
    try {
      const res = await safeFetch("/api/stock/reset", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("scent_admin_token") || ""}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setStock(data.stock);
        setAdminStatusMessage({
          type: "success",
          text: "Stock successfully reset to the user's official baseline list!"
        });
      } else {
        setAdminStatusMessage({
          type: "error",
          text: data.error || "Failed to reset stock."
        });
      }
    } catch (err) {
      console.error("Error resetting stock:", err);
      setAdminStatusMessage({
        type: "error",
        text: "Network error. Failed to reset stock."
      });
    } finally {
      setIsSavingStock(false);
    }
  };

  // Initialize bundle size selectors
  useEffect(() => {
    const initialSizes: Record<string, BundleSizeType> = {};
    BUNDLE_DATA.forEach((bundle) => {
      if (!bundle.isSpotlight) {
        initialSizes[bundle.id] = "5ml Normal";
      }
    });
    setSelectedBundleSizes(initialSizes);
  }, []);

  // Set default buy product ID once catalog is loaded (only in-stock fragrances)
  useEffect(() => {
    const inStockFrags = CATALOG_DATA.filter((f) => {
      if (f.isOutOfStock) return false;
      const fStock = stock?.fragrances[f.id];
      return fStock ? Object.values(fStock).some((v) => (Number(v) || 0) > 0) : false;
    });
    if (inStockFrags.length > 0) {
      const currentValid = inStockFrags.some((f) => f.id === selectedBuyId);
      const targetFrag = currentValid ? inStockFrags.find((f) => f.id === selectedBuyId)! : inStockFrags[0];
      if (!currentValid) {
        setSelectedBuyId(targetFrag.id);
      }
      const fStock = stock?.fragrances[targetFrag.id];
      if (fStock && (Number(fStock[selectedBuySize]) || 0) <= 0) {
        const firstAvailSize = (["10ml", "5ml Normal", "5ml HQ"] as const).find(
          (s) => !targetFrag.disabledSizes?.includes(s) && (Number(fStock[s]) || 0) > 0
        );
        if (firstAvailSize) {
          setSelectedBuySize(firstAvailSize);
        }
      }
    }
  }, [stock]);

  // Cart Handlers
  const getProductStock = (id: string, size: string): number => {
    // Check catalog flag first
    const catItem = CATALOG_DATA.find(f => f.id === id);
    if (catItem?.isOutOfStock) return 0;
    if (catItem?.disabledSizes?.includes(size)) return 0;

    const bundleItem = BUNDLE_DATA.find(b => b.id === id);
    if (bundleItem?.isOutOfStock) return 0;

    if (!stock) return 0;
    
    // Check if it's a bundle
    if (bundleItem || BUNDLE_DATA.some(b => b.id === id)) {
      const bundleStock = stock.bundles[id] !== undefined ? Number(stock.bundles[id]) || 0 : 0;
      let minStock = bundleStock;
      
      // Get constituents
      let constituents: string[] = [];
      switch (id) {
        case "spotlight-arabian": constituents = ["lattafa-khamrah", "la-uno-qaswa"]; break;
        case "bundle-day-night": constituents = ["zara-sunrise", "zara-for-him-black"]; break;
        case "bundle-marine-core": constituents = ["ck-one", "la-uno-qaswa"]; break;
        case "bundle-rare-collector": constituents = ["ck2", "zara-intense-dark"]; break;
        case "bundle-office-rotation": constituents = ["givenchy-gentleman", "ck-one"]; break;
        case "bundle-cozy-winter": constituents = ["zara-seoul-winter", "lattafa-khamrah", "zara-rich-warm-addictive"]; break;
        case "bundle-master-vault": constituents = ["lattafa-khamrah", "zara-seoul-winter", "zara-intense-dark"]; break;
        case "bundle-zara-classics": constituents = ["zara-sunrise", "zara-seoul-winter", "zara-for-him-black", "zara-intense-dark"]; break;
      }
      
      const checkSize = "5ml Normal";
      for (const cid of constituents) {
        const cCat = CATALOG_DATA.find(f => f.id === cid);
        if (cCat?.isOutOfStock) return 0;
        const cStockObj = stock.fragrances[cid];
        if (!cStockObj) return 0;
        const totalCStock = Object.values(cStockObj).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
        if (totalCStock <= 0) return 0;
        const cStock = cStockObj[checkSize] !== undefined ? Number(cStockObj[checkSize]) || 0 : 0;
        minStock = Math.min(minStock, cStock);
      }
      
      return Math.max(0, minStock);
    }

    const fragStock = stock.fragrances[id];
    if (fragStock) {
      const totalUnits = Object.values(fragStock).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
      if (totalUnits <= 0) return 0;
      const sizeQty = fragStock[size] !== undefined ? Number(fragStock[size]) || 0 : 0;
      return Math.max(0, sizeQty);
    }
    return 0;
  };

  const getOutOfStockItems = () => {
    const list: { type: "fragrance" | "bundle"; name: string; brand?: string; id: string }[] = [];
    
    CATALOG_DATA.forEach((f) => {
      const fragStock = stock?.fragrances[f.id];
      const isActuallyOutOfStock = f.isOutOfStock || (fragStock && Object.values(fragStock).every((qty) => qty === 0));
      if (isActuallyOutOfStock) {
        list.push({
          type: "fragrance",
          name: f.name,
          brand: f.brand,
          id: f.id
        });
      }
    });

    BUNDLE_DATA.forEach((b) => {
      const bundleStock = stock?.bundles[b.id];
      const isActuallyOutOfStock = b.isOutOfStock || bundleStock === 0;
      if (isActuallyOutOfStock) {
        list.push({
          type: "bundle",
          name: b.name,
          brand: "ScentPreview Curated",
          id: b.id
        });
      }
    });

    return list;
  };

  const handleAddToCart = (
    fragrance: Fragrance, 
    size: "10ml" | "5ml Normal" | "5ml HQ", 
    quantityToAdd: number = 1,
    skipRecommendationUpdate: boolean = false
  ) => {
    const availableStock = getProductStock(fragrance.id, size);
    if (availableStock <= 0 || fragrance.isOutOfStock) {
      return;
    }

    const price = fragrance.prices[size];

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === fragrance.id && item.size === size
      );
      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        const targetQty = Math.min(availableStock, currentQty + quantityToAdd);
        nextCart[existingIndex] = { ...nextCart[existingIndex], quantity: targetQty };
        return nextCart;
      }
      
      const targetQty = Math.min(availableStock, quantityToAdd);
      if (targetQty <= 0) return prev;

      return [...prev, { 
        id: fragrance.id, 
        name: fragrance.name, 
        brand: fragrance.brand, 
        size, 
        price, 
        quantity: targetQty,
        image: fragrance.image
      }];
    });

    if (!skipRecommendationUpdate) {
      // Recommend other in-stock perfumes
      const otherPerfumes = CATALOG_DATA.filter((f) => {
        if (f.id === fragrance.id) return false;
        
        // Solid check if fragrance f is out of stock in state or catalog
        const isOOS = f.isOutOfStock || !stock?.fragrances[f.id] || Object.values(stock.fragrances[f.id]).every((qty: any) => (Number(qty) || 0) <= 0);
        if (isOOS) return false;

        return true;
      }).slice(0, 6);

      setCrossSellRecommendation({
        isOpen: true,
        addedItemName: `${fragrance.brand} ${fragrance.name} (${size})`,
        recommendedPerfumes: otherPerfumes
      });
    }
  };

  const handleAddBundleToCart = (bundle: CapsuleBundle, skipRecommendationUpdate: boolean = false) => {
    if (bundle.isOutOfStock) return;
    
    let price = 0;
    let sizeLabel = "5ml Normal";
    
    if (bundle.isSpotlight && bundle.fixedPrice) {
      price = bundle.fixedPrice;
    } else if (bundle.prices) {
      price = bundle.prices["5ml Normal"];
    }

    const availableStock = getProductStock(bundle.id, sizeLabel);
    if (availableStock <= 0) {
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === bundle.id && item.size === sizeLabel
      );
      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        const targetQty = Math.min(availableStock, currentQty + 1);
        nextCart[existingIndex] = { ...nextCart[existingIndex], quantity: targetQty };
        return nextCart;
      }
      const targetQty = Math.min(availableStock, 1);
      if (targetQty <= 0) return prev;
      return [...prev, {
        id: bundle.id,
        name: bundle.name,
        brand: "ScentPreview Curated",
        size: sizeLabel,
        price,
        quantity: targetQty
      }];
    });

    setIsCartOpen(true);

    if (!skipRecommendationUpdate) {
      // Recommend other in-stock perfumes
      const otherPerfumes = CATALOG_DATA.filter((f) => {
        const isOOS = f.isOutOfStock || !stock?.fragrances[f.id] || Object.values(stock.fragrances[f.id]).every((qty: any) => (Number(qty) || 0) <= 0);
        if (isOOS) return false;
        return true;
      }).slice(0, 6);

      setCrossSellRecommendation({
        isOpen: true,
        addedItemName: bundle.name,
        recommendedPerfumes: otherPerfumes
      });
    }
  };

  const removeFromCart = (id: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateCartItemQuantity = (id: string, size: string, change: number) => {
    const availableStock = getProductStock(id, size);
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === id && item.size === size
      );
      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        let newQty = currentQty + change;
        if (newQty > availableStock) {
          newQty = availableStock;
        }
        if (newQty <= 0) {
          return prev.filter((item) => !(item.id === id && item.size === size));
        }
        nextCart[existingIndex] = { ...nextCart[existingIndex], quantity: newQty };
        return nextCart;
      }
      return prev;
    });
  };

  const handleBuyNow = (fragrance: Fragrance, size: "10ml" | "5ml Normal" | "5ml HQ", quantityToAdd: number = 1) => {
    const availableStock = getProductStock(fragrance.id, size);
    if (availableStock <= 0 || fragrance.isOutOfStock) {
      return;
    }
    handleAddToCart(fragrance, size, quantityToAdd);
    setSelectionType("fragrance");
    setSelectedBuyId(fragrance.id);
    setSelectedBuySize(size);
    setBuyQuantity(quantityToAdd);
    setIsCheckoutOpen(true);
  };

  const handleBuyBundleNow = (bundle: CapsuleBundle) => {
    if (bundle.isOutOfStock) return;
    
    let price = 0;
    const sizeLabel = "5ml Normal";
    
    if (bundle.isSpotlight && bundle.fixedPrice) {
      price = bundle.fixedPrice;
    } else if (bundle.prices) {
      price = bundle.prices["5ml Normal"];
    }

    const availableStock = getProductStock(bundle.id, sizeLabel);
    if (availableStock <= 0) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === bundle.id && item.size === sizeLabel
      );
      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        const targetQty = Math.min(availableStock, currentQty + 1);
        nextCart[existingIndex] = { ...nextCart[existingIndex], quantity: targetQty };
        return nextCart;
      }
      const targetQty = Math.min(availableStock, 1);
      if (targetQty <= 0) return prev;
      return [...prev, {
        id: bundle.id,
        name: bundle.name,
        brand: "ScentPreview Curated",
        size: sizeLabel,
        price,
        quantity: targetQty
      }];
    });

    setSelectionType("bundle");
    setSelectedBuyId(bundle.id);
    setSelectedBuySize(sizeLabel);
    setBuyQuantity(1);
    setIsCheckoutOpen(true);
  };

  const calculateTierDiscount = (subtotal: number): number => {
    if (subtotal >= 2500) return 625;
    if (subtotal >= 1500) return 300;
    if (subtotal >= 999) return 100;
    return 0;
  };

  const getTierPercentage = (subtotal: number): string | null => {
    if (subtotal >= 2500) return "25%";
    if (subtotal >= 1500) return "20%";
    if (subtotal >= 999) return "10%";
    return null;
  };

  const getNextDiscountTier = (subtotal: number): { nextGoal: number; discount: number; percent: string; amountNeeded: number } | null => {
    if (subtotal < 999) {
      return { nextGoal: 999, discount: 100, percent: "10%", amountNeeded: 999 - subtotal };
    }
    if (subtotal < 1500) {
      return { nextGoal: 1500, discount: 300, percent: "20%", amountNeeded: 1500 - subtotal };
    }
    if (subtotal < 2500) {
      return { nextGoal: 2500, discount: 625, percent: "25%", amountNeeded: 2500 - subtotal };
    }
    return null;
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const activeDiscount = calculateTierDiscount(cartTotal);
  const nextTier = getNextDiscountTier(cartTotal);

  // Find the active selected product for "Buy Now"
  const selectedProduct = selectionType === "fragrance" 
    ? CATALOG_DATA.find(f => f.id === selectedBuyId) 
    : BUNDLE_DATA.find(b => b.id === selectedBuyId);

  // Get description
  const selectedProductDescription = selectedProduct
    ? (selectionType === "fragrance" ? (selectedProduct as Fragrance).notes : `Contains: ${(selectedProduct as CapsuleBundle).contains}`)
    : "No composition selected.";

  // Determine if size options apply (Bundles are strictly 5ml Normal)
  const hasSizeOptions = selectionType === "fragrance";

  // Calculate dynamic pricing
  let buyItemPrice = 0;
  if (selectedProduct) {
    if (selectionType === "fragrance") {
      buyItemPrice = (selectedProduct as Fragrance).prices[selectedBuySize];
    } else {
      const b = selectedProduct as CapsuleBundle;
      if (b.isSpotlight && b.fixedPrice) {
        buyItemPrice = b.fixedPrice;
      } else if (b.prices) {
        buyItemPrice = b.prices["5ml Normal"];
      }
    }
  }

  const shippingCost = appliedCoupon ? 0 : 116;
  const buySubtotal = buyItemPrice * buyQuantity;
  const buyDiscount = calculateTierDiscount(buySubtotal);
  const checkoutTotal = Math.max(0, buySubtotal - buyDiscount) + shippingCost;

  // Express Buy checkout submit
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setCheckoutErrorMessage(null);

    // Strict validation: Ensure every item in cart has sufficient active stock
    for (const item of cart) {
      const available = getProductStock(item.id, item.size);
      if (available <= 0 || available < item.quantity) {
        setCheckoutErrorMessage(`"${item.name}" (${item.size}) is currently out of stock. Please remove it from your cart before proceeding.`);
        fetchStock();
        return;
      }
    }

    setIsProcessingOrder(true);
    
    const typedCoupon = couponInput.trim().toUpperCase();
    if (!appliedCoupon && typedCoupon && usedCoupons.includes(typedCoupon)) {
      setIsProcessingOrder(false);
      setCouponError("This coupon code has already been used.");
      setCheckoutErrorMessage("The entered coupon code has already been used. Please remove it to proceed.");
      return;
    }
    const activeCoupon = appliedCoupon || (FREE_DELIVERY_COUPONS.has(typedCoupon) && !usedCoupons.includes(typedCoupon) ? typedCoupon : null);
    const effectiveDeliveryFee = activeCoupon ? 0 : 116;

    const orderNum = `SP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const items = cart.map(item => ({
      name: item.name,
      size: item.size,
      quantity: item.quantity
    }));
    const discountAmount = calculateTierDiscount(cartTotal);
    const total = Math.max(0, cartTotal - discountAmount) + effectiveDeliveryFee + (isShippingProtectionEnabled ? 150 : 0);

    const payload = {
      items,
      total,
      subtotal: cartTotal,
      discount: discountAmount,
      couponCode: activeCoupon || undefined,
      orderNumber: orderNum,
      name: checkoutName,
      email: checkoutEmail,
      address: checkoutAddress,
      phone: checkoutPhone,
      state: checkoutState,
      pincode: checkoutPincode,
      shippingProtection: isShippingProtectionEnabled
    };

    try {
      const response = await safeFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setIsProcessingOrder(false);
        if (data.error && data.error.toLowerCase().includes("coupon")) {
          setCouponError(data.error);
          if (activeCoupon) {
            const updated = Array.from(new Set([...usedCoupons, activeCoupon]));
            setUsedCoupons(updated);
            try {
              localStorage.setItem("scent_usedCoupons", JSON.stringify(updated));
              localStorage.removeItem("scent_appliedCoupon");
            } catch {}
            setAppliedCoupon(null);
          }
        }
        setCheckoutErrorMessage(data.error || "Unable to place order: One or more items are currently out of stock.");
        fetchStock();
        return;
      }

      if (data.success && data.order) {
        addOrderToLocalStorageBackup(data.order);
      }
      fetchStock();

      if (activeCoupon) {
        const updated = Array.from(new Set([...usedCoupons, activeCoupon]));
        setUsedCoupons(updated);
        try {
          localStorage.setItem("scent_usedCoupons", JSON.stringify(updated));
        } catch {}
      }

      setPaymentDetails(payload);
      setIsProcessingOrder(false);
      setIsPaymentConfirmed(false);
      setShowPaymentPage(true);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setIsCartCheckoutVisible(false);
      setCart([]);
      setAppliedCoupon(null);
      setCouponInput("");
      setCouponError(null);
      try {
        localStorage.removeItem("scent_appliedCoupon");
      } catch {}
    } catch (err: any) {
      console.error("Failed to register order on backend:", err);
      setIsProcessingOrder(false);
      setCheckoutErrorMessage("Network error during order creation. Please check your connection and try again.");
    }
  };

  // Filter catalog based on search query
  const filteredCatalog = CATALOG_DATA.filter((fragrance) => {
    const query = searchQuery.toLowerCase();
    return (
      fragrance.name.toLowerCase().includes(query) ||
      fragrance.brand.toLowerCase().includes(query) ||
      fragrance.notes.toLowerCase().includes(query) ||
      fragrance.notesList.some((note) => note.toLowerCase().includes(query))
    );
  });

  // Filter bundles based on search query
  const filteredBundles = BUNDLE_DATA.filter((bundle) => {
    const query = searchQuery.toLowerCase();
    return (
      bundle.name.toLowerCase().includes(query) ||
      bundle.contains.toLowerCase().includes(query)
    );
  });

  if (showPaymentPage && paymentDetails) {
    return (
      <div className="min-h-screen bg-stone-50 text-black font-sans p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="max-w-lg w-full bg-white border border-stone-200 p-6 sm:p-8">
          {!isPaymentConfirmed ? (
            <>
              <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
                <span className="text-sm font-sans font-bold text-black tracking-tight">
                  SP 0.2
                </span>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                  Order #{paymentDetails.orderNumber}
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-serif text-black mb-1">
                  Complete UPI Payment
                </h2>
                <p className="text-xs text-stone-600 font-sans">
                  Pay <strong className="text-black font-mono">₹{paymentDetails.total}.00</strong> to the UPI ID below to confirm your order.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-4 mb-6 space-y-3">
                <div className="flex items-center justify-between bg-white border border-stone-200 px-3.5 py-2.5">
                  <div>
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-stone-500">
                      UPI ID
                    </span>
                    <span className="font-mono text-sm font-bold text-black select-all">
                      chingtham@okhdfcbank
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("chingtham@okhdfcbank");
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="text-[10px] font-mono bg-stone-900 hover:bg-black text-white px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? "Copied" : "Copy UPI ID"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={`upi://pay?pa=chingtham@okhdfcbank&pn=Chingtham&am=${paymentDetails.total}&cu=INR&tn=ScentPreview%20Order`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-xs font-semibold bg-black hover:bg-stone-800 text-white py-2.5 px-4 transition-colors cursor-pointer text-center font-sans"
                  >
                    Open UPI App
                  </a>

                  <button
                    type="button"
                    disabled={isConfirmingPayment}
                    onClick={async () => {
                      setIsConfirmingPayment(true);
                      const orderNum = paymentDetails.orderNumber;
                      try {
                        const res = await safeFetch("/api/orders/confirm-payment", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(paymentDetails),
                        });
                        const data = await res.json();
                        if (data.success) {
                          addOrderToLocalStorageBackup({
                            ...paymentDetails,
                            status: "paid",
                            createdAt: new Date().toISOString()
                          });
                          localStorage.setItem("scent_isPaymentConfirmed", "true");
                        }
                      } catch (err) {
                        console.error("[WhatsApp Redirect] Failed to auto-confirm order:", err);
                      } finally {
                        setIsConfirmingPayment(false);
                        setIsPaymentConfirmed(true);
                        fetchStock();
                      }

                      const itemsSummary = paymentDetails.items
                        .map((item: any) => `- ${item.name} (${item.size}) x${item.quantity}`)
                        .join("\n");
                      const discountPercent = paymentDetails.subtotal
                        ? getTierPercentage(paymentDetails.subtotal)
                        : (paymentDetails.total >= 2500 ? "25%" : paymentDetails.total >= 1500 ? "20%" : paymentDetails.total >= 999 ? "10%" : "");
                      const discountLine = paymentDetails.discount && paymentDetails.discount > 0
                        ? `\n*Tier Discount (${discountPercent || "Tier"} OFF):* Applied`
                        : "";
                      const couponLine = paymentDetails.couponCode
                        ? `\n*Coupon (${paymentDetails.couponCode}):* Free Delivery Applied`
                        : "";
                      const message = `Hello ScentPreview Support!\n\nI would like to complete payment for my order.\n\n*Order Number:* ${orderNum}\n*Customer:* ${paymentDetails.name}\n*Phone:* ${paymentDetails.phone}\n*Address:* ${paymentDetails.address}, ${paymentDetails.state || ""} - ${paymentDetails.pincode || ""}\n\n*Items Ordered*:\n${itemsSummary}${discountLine}${couponLine}\n\n*Total Amount:* ₹${paymentDetails.total}.00\n\nPlease verify my payment and begin extraction. Thank you!`;

                      const whatsappUrl = `https://wa.me/919366110996?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    className="inline-flex items-center justify-center gap-2 text-xs font-semibold bg-white border border-stone-200 hover:bg-stone-100 text-emerald-700 py-2.5 px-4 transition-colors cursor-pointer text-center font-sans"
                  >
                    Pay via WhatsApp
                  </button>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4 mb-6 space-y-2 text-xs font-mono">
                {paymentDetails.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-black">
                    <span className="font-sans">
                      {item.name} <span className="text-stone-500">({item.size})</span>
                    </span>
                    <span>×{item.quantity}</span>
                  </div>
                ))}
                {paymentDetails.discount && paymentDetails.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>Tier Discount:</span>
                    <span>
                      {paymentDetails.subtotal
                        ? `${getTierPercentage(paymentDetails.subtotal)} OFF`
                        : (paymentDetails.total >= 2500 ? "25% OFF" : paymentDetails.total >= 1500 ? "20% OFF" : "10% OFF")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-stone-600 pt-2 border-t border-stone-100">
                  <span>Delivery:</span>
                  <span>
                    {paymentDetails.couponCode ? (
                      <span className="text-emerald-700 font-bold">FREE ({paymentDetails.couponCode})</span>
                    ) : (
                      "₹116.00"
                    )}
                  </span>
                </div>
                {paymentDetails.shippingProtection && (
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Shipping Protection:</span>
                    <span>₹150.00</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-bold text-black border-t border-stone-200 pt-2.5">
                  <span className="font-sans">Total Due:</span>
                  <span>₹{paymentDetails.total}.00</span>
                </div>
              </div>

              <button
                type="button"
                disabled={isConfirmingPayment}
                onClick={async () => {
                  setIsConfirmingPayment(true);
                  try {
                    const res = await safeFetch("/api/orders/confirm-payment", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(paymentDetails),
                    });
                    const data = await res.json();
                    if (data.success) {
                      addOrderToLocalStorageBackup({
                        ...paymentDetails,
                        status: "paid",
                        createdAt: new Date().toISOString()
                      });
                    }
                  } catch (err) {
                    console.error("Failed to notify backend of payment:", err);
                  } finally {
                    setIsConfirmingPayment(false);
                    setIsPaymentConfirmed(true);
                    fetchStock();
                  }
                }}
                className={`w-full bg-black hover:bg-stone-800 text-white font-sans text-xs tracking-widest uppercase font-bold py-3.5 px-6 transition-colors cursor-pointer flex items-center justify-center gap-2 ${isConfirmingPayment ? "opacity-80 cursor-not-allowed" : ""}`}
              >
                {isConfirmingPayment ? "Confirming..." : "I Have Completed Payment"}
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-700" />
              </div>

              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block mb-1">
                Order #{paymentDetails.orderNumber}
              </span>
              <h3 className="text-2xl font-serif text-black mb-2">
                Order Confirmed
              </h3>
              <p className="text-stone-600 text-xs font-sans mb-6 max-w-sm mx-auto leading-relaxed">
                Thank you, {paymentDetails.name || "Valued Patron"}. Your payment of <strong className="text-black font-mono">₹{paymentDetails.total}.00</strong> has been logged and your decants will be prepared for dispatch.
              </p>

              <div className="bg-stone-50 border border-stone-200 p-4 mb-6 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 font-semibold">
                    VELYX Waitlist
                  </span>
                  <a
                    href="https://velyx-waitlist.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-black underline"
                  >
                    <span>Join Waitlist</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-stone-600 font-sans">
                  Get early access to limited archive drops and upcoming releases.
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (paymentDetails) {
                    try {
                      const res = await safeFetch("/api/orders/confirm-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(paymentDetails),
                      });
                      const data = await res.json();
                      if (data.success) {
                        addOrderToLocalStorageBackup({
                          ...paymentDetails,
                          status: "paid",
                          createdAt: new Date().toISOString()
                        });
                      }
                    } catch (err) {
                      console.error("[Continue Action] Failed to auto-confirm payment:", err);
                    }
                  }

                  setShowPaymentPage(false);
                  setIsPaymentConfirmed(false);
                  setCheckoutName("");
                  setIsNameAuthorized(false);
                  setCheckoutEmail("");
                  setCheckoutAddress("");
                  setCheckoutPhone("");
                  setCheckoutState("Maharashtra");
                  setCheckoutPincode("");
                  setIsCheckoutOpen(false);
                  setBuyQuantity(1);
                  setPaymentDetails(null);

                  localStorage.removeItem("scent_paymentDetails");
                  localStorage.removeItem("scent_showPaymentPage");
                  localStorage.removeItem("scent_isPaymentConfirmed");
                }}
                className="w-full bg-stone-900 hover:bg-black text-white py-3.5 text-xs font-mono font-bold tracking-widest uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Return to Store</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-black font-sans relative selection:bg-amber-100 selection:text-black">
      {/* Full-Screen Liquid Bars Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#0a0c10]">
        <LiquidBars
          color="#eceff6"
          speed={0.7}
          barCount={7}
          scale={0.42}
          waveComplexity={2}
          waveAmplitude={0.7}
          reflectionFrequency={18}
          metallicContrast={2.2}
          streakIntensity={0.35}
          highlightWarmth={0.35}
          opacity={1}
          className="w-full h-full"
        />
      </div>

      {/* Modern High-End Sticky Header Navigation */}
      <header className="sticky top-0 bg-[#F4F4F2]/95 backdrop-blur-md z-50 border-b border-black/10 shadow-xs">
        {/* Tiered Discount Announcement Bar */}
        <div className="bg-[#111111] text-[#E8E8E6] py-2 px-3 sm:px-6 text-center text-[10px] sm:text-[11px] font-mono tracking-wider flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-b border-white/10">
          <span className="text-neutral-400 font-sans uppercase text-[10px] tracking-widest shrink-0">
            Complimentary Tier Privileges:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px]">
            {[
              { threshold: "₹999+", discount: "10% OFF" },
              { threshold: "₹1,500+", discount: "20% OFF" },
              { threshold: "₹2,500+", discount: "25% OFF" }
            ].map((tier, idx) => {
              const isActive = activeTierBannerIndex === idx;
              return (
                <div 
                  key={tier.threshold}
                  className={`flex items-center gap-1.5 transition-all duration-500 ${
                    isActive ? "text-white scale-105 font-bold underline decoration-white/60 underline-offset-4" : "text-neutral-400 opacity-60"
                  }`}
                >
                  <span>{tier.threshold}</span>
                  <span className={isActive ? "text-white" : "text-neutral-300"}>{tier.discount}</span>
                  {idx < 2 && <span className="text-neutral-600 ml-1.5">/</span>}
                </div>
              );
            })}
          </div>
        </div>

        <nav className="w-full flex items-center justify-between h-12 sm:h-14 px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto gap-2">
          {/* Brand Identity & Primary Links */}
          <div className="flex items-center gap-4 sm:gap-8 min-w-0 shrink">
            <span 
              onClick={() => {
                setSelectedDetailFragrance(null);
              }}
              className="text-lg sm:text-xl font-sans font-bold tracking-tight text-black flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:opacity-80 transition-opacity truncate"
            >
              <span className="truncate">Scent Preview</span>
              <span className="text-[10px] font-mono font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-black/5 text-neutral-600 shrink-0">0.2</span>
            </span>
            <div className="hidden md:flex items-center gap-6 pl-6 border-l border-black/10 shrink-0">
              <button 
                onClick={scrollToCatalog} 
                className="text-[11px] font-sans tracking-[0.15em] text-neutral-800 hover:text-black transition-colors uppercase font-medium cursor-pointer"
              >
                Archive
              </button>
              <button 
                onClick={() => {
                  document.getElementById("bundle-capsules")?.scrollIntoView({ behavior: "smooth" });
                }} 
                className="text-[11px] font-sans tracking-[0.15em] text-neutral-800 hover:text-black transition-colors uppercase font-medium cursor-pointer"
              >
                Bundles
              </button>
              <a 
                href="https://velyx-waitlist.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[11px] font-sans tracking-[0.15em] text-neutral-800 hover:text-black transition-colors uppercase font-medium cursor-pointer"
              >
                VELYX
              </a>
            </div>
          </div>

          {/* Search Bar & Cart Button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="relative flex items-center">
              <div className="flex items-center bg-white/80 border border-black/10 rounded-full px-2.5 sm:px-3.5 py-1.5 focus-within:border-black/30 focus-within:bg-white transition-all shadow-xs w-32 xs:w-40 sm:w-56 md:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 mr-1.5 sm:mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value) {
                      setSelectedDetailFragrance(null);
                      document.getElementById("kinetic-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  placeholder="Search decants..."
                  className="w-full bg-transparent text-xs font-sans text-black focus:outline-none placeholder:text-neutral-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-neutral-400 hover:text-black font-mono text-xs px-1 cursor-pointer shrink-0"
                    title="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-stone-900 text-white hover:bg-black px-3 sm:px-5 py-2 rounded-full text-[10px] sm:text-[11px] font-sans tracking-[0.12em] uppercase transition-all cursor-pointer font-medium shadow-xs shrink-0 select-none active:scale-95"
            >
              <span>Cart</span>
              <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Product Detail Page View (Amazon Style) OR Main Catalog */}
      {selectedDetailFragrance ? (
        <ProductDetailPage
          fragrance={selectedDetailFragrance}
          onBack={handleBackFromDetails}
          onSelectFragrance={(f) => {
            handleOpenFragranceDetails(f);
          }}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          fragranceStock={stock?.fragrances[selectedDetailFragrance.id]}
          allFragrances={CATALOG_DATA}
          stock={stock}
        />
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative w-full overflow-hidden border-b border-black/10">

            {/* Subtle organic ambient glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/[0.04] blur-[80px] pointer-events-none z-0" />

            <section className="w-full max-w-7xl mx-auto flex flex-col md:flex-row px-4 sm:px-6 lg:px-8 relative z-10 items-center justify-between py-10 sm:py-12 md:py-14">
              <div className="flex-1 flex flex-col justify-center py-2 sm:py-4 relative z-10 max-w-2xl">
                <div className="overflow-visible mb-3">
                  <span className="text-[10px] font-sans font-semibold tracking-[0.2em] text-neutral-200 uppercase border border-white/20 bg-black/40 backdrop-blur-md rounded-full px-3.5 py-1 mb-3 inline-block shadow-sm">
                    Edition 0.2
                  </span>
                  <div className="block">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-white tracking-[-0.03em] leading-[0.96] inline-block border border-white/20 bg-black/40 backdrop-blur-md rounded-2xl sm:rounded-3xl px-6 py-3.5 sm:px-8 sm:py-4 shadow-lg">
                      Scent<br className="hidden sm:inline" /> Preview
                    </h1>
                  </div>
                </div>
                <div className="max-w-md mt-1">
                  <p className="text-xs sm:text-sm font-sans text-neutral-200 leading-relaxed mb-6 font-normal border border-white/20 bg-black/40 backdrop-blur-md rounded-2xl px-5 py-3 shadow-sm inline-block">
                    Curated premium fragrance decants. Hand-poured, perfectly measured, and delivered directly to your door.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      onClick={scrollToCatalog}
                      className="border border-white/20 bg-white text-black shadow-md rounded-full px-7 py-3.5 text-[11px] font-sans tracking-[0.16em] uppercase hover:bg-neutral-200 transition-all cursor-pointer font-bold"
                    >
                      Explore Catalog
                    </button>
                    <button
                      onClick={() => setIsQuizListOpen(true)}
                      className="border border-white/30 bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:border-white/50 transition-all rounded-full px-6 py-3.5 text-[11px] font-sans tracking-[0.16em] uppercase cursor-pointer font-bold shadow-sm flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Find your Scent</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

      <section id="buy-now-section" className="hidden">
        
        {/* Subtle glowing fluid pattern in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 -full  pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-2.5 py-0.5 text-[8px] font-sans tracking-[0.2em] bg-black text-white font-bold uppercase -full">
              Acquisition Studio
            </span>
            <span className="text-[10px] font-sans tracking-[0.2em] text-black uppercase">
              Immediate Dispatch
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">
            Direct Olfaction Acquisition
          </h2>
          <p className="text-black text-xs md:text-sm font-sans font-light mb-12 max-w-2xl leading-relaxed">
            Acquire premier decants and curated pairings instantly. Bypass standard cart routing with our premium single-view express checkout. Configured and poured with sterile precision in our cleanroom laboratories.
          </p>

          <AnimatePresence mode="wait">
            {!isOrderPlaced ? (
              <motion.div
                key="checkout-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                {!isCheckoutFormVisible ? (
                  /* STEP 1: ONLY SCENT CUSTOMIZATION SHOWN - CENTERED & MINIMALIST */
                  <motion.div
                    key="step-selection"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="max-w-xl mx-auto bg-[#FFFFFF] border border-stone-200/80  p-6 md:p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="block text-[8px] font-sans tracking-[0.2em] text-black uppercase font-bold">
                        Step 1 of 2 / Configure Your Scent
                      </span>
                      <span className="text-[9px] font-mono text-black uppercase">
                        {selectionType} segment
                      </span>
                    </div>

                    {/* Item selector toggle (Fragrances vs Bundles) */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectionType("fragrance");
                          const availFrags = CATALOG_DATA.filter((f) => {
                            if (f.isOutOfStock) return false;
                            const fStock = stock?.fragrances[f.id];
                            return fStock ? Object.values(fStock).some((q) => (Number(q) || 0) > 0) : false;
                          });
                          if (availFrags.length > 0) {
                            const firstFrag = availFrags[0];
                            setSelectedBuyId(firstFrag.id);
                            const fStock = stock?.fragrances[firstFrag.id];
                            const firstSize = (["10ml", "5ml Normal", "5ml HQ"] as const).find(
                              (s) => !firstFrag.disabledSizes?.includes(s) && (Number(fStock?.[s]) || 0) > 0
                            ) || "5ml Normal";
                            setSelectedBuySize(firstSize);
                          }
                        }}
                        className={`py-2.5 px-3 text-xs font-mono  border transition-all cursor-pointer ${
                          selectionType === "fragrance"
                            ? "bg-black text-white border-amber-gold font-bold"
                            : "bg-transparent text-black border-stone-200 hover:text-black "
                        }`}
                      >
                        Individual Scent
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectionType("bundle");
                          const availBundles = BUNDLE_DATA.filter((b) => !b.isOutOfStock && getProductStock(b.id, "5ml Normal") > 0);
                          if (availBundles.length > 0) {
                            setSelectedBuyId(availBundles[0].id);
                          }
                          setSelectedBuySize("5ml Normal");
                        }}
                        className={`py-2.5 px-3 text-xs font-mono  border transition-all cursor-pointer ${
                          selectionType === "bundle"
                            ? "bg-black text-white border-amber-gold font-bold"
                            : "bg-transparent text-black border-stone-200 hover:text-black "
                        }`}
                      >
                        Curated Bundle
                      </button>
                    </div>

                    {/* Product Dropdown - Only In-Stock Buyable Options */}
                    <div className="mb-6">
                      <label className="block text-[9px] font-mono text-black uppercase tracking-wider mb-2">
                        Choose Blend or Set
                      </label>
                      <select
                        value={selectedBuyId}
                        onChange={(e) => {
                          const newId = e.target.value;
                          setSelectedBuyId(newId);
                          if (selectionType === "fragrance") {
                            const frag = CATALOG_DATA.find((f) => f.id === newId);
                            const fStock = stock?.fragrances[newId];
                            const firstSize = (["10ml", "5ml Normal", "5ml HQ"] as const).find(
                              (s) => !frag?.disabledSizes?.includes(s) && (Number(fStock?.[s]) || 0) > 0
                            ) || "5ml Normal";
                            setSelectedBuySize(firstSize);
                            const maxStock = getProductStock(newId, firstSize);
                            setBuyQuantity((q) => Math.max(1, Math.min(maxStock, q)));
                          } else {
                            setSelectedBuySize("5ml Normal");
                            const maxStock = getProductStock(newId, "5ml Normal");
                            setBuyQuantity((q) => Math.max(1, Math.min(maxStock, q)));
                          }
                        }}
                        className="w-full bg-[#FFFFFF] border border-stone-200  px-4 py-3 text-xs font-sans text-black  focus:outline-none focus:border-amber-gold"
                      >
                        {selectionType === "fragrance"
                          ? CATALOG_DATA.filter((f) => {
                              if (f.isOutOfStock) return false;
                              const fStock = stock?.fragrances[f.id];
                              return fStock ? Object.values(fStock).some((q) => (Number(q) || 0) > 0) : false;
                            }).map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.brand} — {f.name}
                              </option>
                            ))
                          : BUNDLE_DATA.filter((b) => !b.isOutOfStock && getProductStock(b.id, "5ml Normal") > 0).map((b) => (
                              <option key={b.id} value={b.id}>
                                ScentPreview Curated — {b.name}
                              </option>
                            ))}
                      </select>
                    </div>

                    {/* Description or details of the selected item */}
                    <div className="bg-stone-50 p-3.5 border border-black/5  mb-6">
                      <span className="block text-[8px] font-sans tracking-[0.2em] text-black uppercase mb-1">
                        Olfactory Composition
                      </span>
                      <p className="text-xs text-black font-sans ">
                        {selectedProductDescription}
                      </p>
                    </div>

                    {/* Size Segment Selector */}
                    {hasSizeOptions && (
                      <div className="mb-6">
                        <span className="block text-[8px] font-sans tracking-[0.15em] uppercase tracking-widest text-black mb-2">
                          02 / Volume Segment
                        </span>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-[#FFFFFF]  border border-stone-200">
                          {(["10ml", "5ml Normal", "5ml HQ"] as const).map((size) => {
                            const sizeStock = getProductStock(selectedBuyId, size);
                            const isSizeOOS = sizeStock <= 0;
                            return (
                              <button
                                key={size}
                                type="button"
                                disabled={isSizeOOS}
                                onClick={() => {
                                  if (isSizeOOS) return;
                                  setSelectedBuySize(size);
                                  setBuyQuantity((q) => Math.max(1, Math.min(sizeStock, q)));
                                }}
                                className={`py-2 text-[10px] font-mono transition-all cursor-pointer ${
                                  selectedBuySize === size
                                    ? "bg-black text-white font-bold"
                                    : isSizeOOS
                                    ? "text-stone-400 line-through cursor-not-allowed bg-stone-100"
                                    : "text-stone-800 hover:text-black"
                                }`}
                              >
                                {size} {isSizeOOS ? "(0)" : ""}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-black/5">
                      <div>
                        <span className="block text-[8px] font-sans tracking-[0.15em] uppercase tracking-widest text-black">
                          Quantity
                        </span>
                        <span className="text-xs text-black font-sans">Increase quantity</span>
                      </div>
                      <div className="flex items-center gap-3 bg-[#FFFFFF] border border-stone-200  p-1">
                        <button
                          type="button"
                          onClick={() => setBuyQuantity((q) => Math.max(1, q - 1))}
                          className="w-7 h-7 flex items-center justify-center text-black hover:text-black  transition-colors font-mono cursor-pointer text-sm font-semibold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono text-sm font-semibold text-black ">
                          {buyQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBuyQuantity((q) => {
                            const maxStock = selectedProduct ? getProductStock(selectedProduct.id, selectedBuySize) : 10;
                            return Math.min(maxStock, q + 1);
                          })}
                          className="w-7 h-7 flex items-center justify-center text-black hover:text-black  transition-colors font-mono cursor-pointer text-sm font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Cost Preview before checkout */}
                    <div className="border-t border-black/5 pt-5 mt-4 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-black font-sans tracking-[0.15em] uppercase tracking-wider">Subtotal:</span>
                        <span className="font-mono text-black text-sm font-bold">₹{buyItemPrice * buyQuantity}.00</span>
                      </div>

                      {/* Tier Discount Callout if active */}
                      {calculateTierDiscount(buyItemPrice * buyQuantity) > 0 ? (
                        <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 flex items-center justify-between text-xs font-mono">
                          <span className="text-neutral-700">Tier Privilege ({getTierPercentage(buyItemPrice * buyQuantity)} OFF):</span>
                          <span className="text-neutral-900 font-semibold">{getTierPercentage(buyItemPrice * buyQuantity)} Applied</span>
                        </div>
                      ) : (
                        getNextDiscountTier(buyItemPrice * buyQuantity) && (
                          <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-between py-1">
                            <span>Next Tier Privilege:</span>
                            <span>+₹{getNextDiscountTier(buyItemPrice * buyQuantity)?.amountNeeded}.00 for {getNextDiscountTier(buyItemPrice * buyQuantity)?.percent} OFF</span>
                          </div>
                        )
                      )}
                      
                      {(() => {
                        const maxStock = selectedProduct ? getProductStock(selectedProduct.id, selectedBuySize) : 0;
                        if (maxStock <= 0) {
                          return (
                            <button
                              type="button"
                              disabled
                              className="w-full bg-stone-800 text-white font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-4  cursor-not-allowed border border-stone-750 flex items-center justify-center gap-2"
                            >
                              <span>Sold Out / Unavailable</span>
                            </button>
                          );
                        }
                        return (
                          <button
                            type="button"
                            onClick={() => {
                              if (!selectedProduct) return;
                              const finalQty = Math.min(maxStock, buyQuantity);
                              setCart([{
                                id: selectedProduct.id,
                                name: selectedProduct.name,
                                brand: selectionType === "fragrance" ? (selectedProduct as Fragrance).brand : "ScentPreview Curated",
                                size: selectedBuySize,
                                price: buyItemPrice,
                                quantity: finalQty
                              }]);
                              setIsCheckoutFormVisible(true);
                            }}
                            className="w-full bg-[#276152] hover:bg-[#0D3A35] text-black  font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-4  transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer "
                          >
                            <span>Configure Delivery Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        );
                      })()}
                    </div>
                  </motion.div>
                ) : (
                  /* STEP 2: CLEAN SINGLE-STEP CHECKOUT FORM AND SUMMARY */
                  <motion.div
                    key="step-checkout"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    {/* Left Column: Clean Order Summary */}
                    <div className="lg:col-span-5">
                      <div className="bg-white border border-stone-200 p-6 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-center border-b border-stone-200 pb-4 mb-5">
                            <span className="text-xs font-sans uppercase tracking-wider text-black font-bold">
                              Order Summary
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsCheckoutFormVisible(false)}
                              className="text-xs font-mono text-stone-600 hover:text-black cursor-pointer transition-colors"
                            >
                              ← Edit Item
                            </button>
                          </div>

                          <div className="flex items-center justify-between py-2 border-b border-stone-100 mb-5">
                            <div>
                              <span className="block text-[10px] font-mono text-stone-500 uppercase">
                                {(selectionType === "fragrance" && (selectedProduct as Fragrance)?.brand) || "Curated"}
                              </span>
                              <h4 className="text-sm font-sans font-bold text-black">
                                {selectedProduct?.name}
                              </h4>
                              <span className="text-xs font-mono text-stone-600">
                                {selectionType === "fragrance" ? selectedBuySize : "5ml Normal"} × {buyQuantity}
                              </span>
                            </div>
                            <span className="font-mono text-sm font-bold text-black">
                              ₹{buyItemPrice * buyQuantity}.00
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2.5 pt-2">
                          <div className="flex justify-between text-xs font-mono text-stone-700">
                            <span>Subtotal</span>
                            <span>₹{buyItemPrice * buyQuantity}.00</span>
                          </div>
                          {calculateTierDiscount(buyItemPrice * buyQuantity) > 0 && (
                            <div className="flex justify-between text-xs font-mono text-emerald-700">
                              <span>Tier Discount</span>
                              <span>{getTierPercentage(buyItemPrice * buyQuantity)} OFF</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xs font-mono text-stone-700">
                            <span>Delivery</span>
                            <span>
                              {appliedCoupon ? (
                                <>
                                  <span className="line-through text-stone-400 mr-1.5">₹116.00</span>
                                  <span className="text-emerald-700 font-bold">₹0.00</span>
                                </>
                              ) : (
                                `₹${shippingCost}.00`
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-mono text-stone-700 py-1.5 border-t border-b border-stone-100">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isShippingProtectionEnabled}
                                onChange={(e) => setIsShippingProtectionEnabled(e.target.checked)}
                                className="w-3.5 h-3.5 border-stone-300 text-black cursor-pointer accent-black"
                              />
                              <span>Shipping Protection (Optional)</span>
                            </label>
                            <span>{isShippingProtectionEnabled ? "₹150.00" : "—"}</span>
                          </div>
                          {renderCouponSection()}
                          <div className="flex justify-between text-base font-mono text-black font-bold pt-2 border-t border-stone-200">
                            <span>Total</span>
                            <span>₹{checkoutTotal + (isShippingProtectionEnabled ? 150 : 0)}.00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Single-Step Shipping Form */}
                    <form
                      onSubmit={handlePlaceOrder}
                      className="lg:col-span-7 bg-white border border-stone-200 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="border-b border-stone-200 pb-4 mb-5">
                          <span className="text-xs font-sans uppercase tracking-wider text-black font-bold">
                            Delivery Details
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              required
                              value={checkoutName}
                              onChange={(e) => setCheckoutName(e.target.value)}
                              placeholder="Full Name"
                              className="w-full bg-white border border-stone-200 px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              required
                              value={checkoutPhone}
                              onChange={(e) => setCheckoutPhone(e.target.value)}
                              placeholder="+91 99999 99999"
                              className="w-full bg-white border border-stone-200 px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={checkoutEmail}
                            onChange={(e) => setCheckoutEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-white border border-stone-200 px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                            Street Address
                          </label>
                          <textarea
                            required
                            rows={2}
                            value={checkoutAddress}
                            onChange={(e) => setCheckoutAddress(e.target.value)}
                            placeholder="House/Flat No., Building, Street, Area"
                            className="w-full bg-white border border-stone-200 px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                              State
                            </label>
                            <select
                              required
                              value={checkoutState}
                              onChange={(e) => setCheckoutState(e.target.value)}
                              className="w-full bg-white border border-stone-200 px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black font-sans"
                            >
                              {INDIAN_STATES_AND_UTS.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                              Pincode (6 digits)
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              pattern="[1-9][0-9]{5}"
                              value={checkoutPincode}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setCheckoutPincode(val);
                              }}
                              placeholder="400050"
                              className="w-full bg-white border border-stone-200 px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-200">
                        <button
                          type="submit"
                          disabled={isProcessingOrder}
                          className="w-full bg-black hover:bg-stone-800 text-white py-3.5 text-xs font-sans tracking-widest uppercase transition-colors font-bold cursor-pointer disabled:opacity-50"
                        >
                          {isProcessingOrder ? "Processing..." : "Continue to Payment"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
            </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 px-6 bg-white border border-stone-200 rounded-xl max-w-xl mx-auto shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <span className="text-[10px] font-mono text-black uppercase tracking-[0.2em] font-semibold block mb-2">
                  Order Authorized
                </span>
                <h3 className="text-3xl font-serif text-black mb-3">
                  Pouring Sequence Commenced
                </h3>
                <p className="text-black text-sm font-sans mb-6 px-4">
                  Thank you for your acquisition. The sterile extraction process has begun.
                </p>

                {/* VELYX Waitlist Section */}
                <div className="bg-[#FFFFFF] border border-stone-200/80 p-5 my-6 text-left space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-stone-500 font-semibold">
                      Upcoming Release • Waitlist
                    </span>
                    <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest">
                      VELYX
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-serif text-black mb-1">
                      VELYX
                    </h4>
                    <p className="text-xs text-stone-600 font-sans leading-relaxed">
                      Join the waitlist for VELYX to receive priority access to limited decants, archive vault drops, and new olfactory releases.
                    </p>
                  </div>

                  <a
                    href="https://velyx-waitlist.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 hover:bg-black text-white text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer"
                  >
                    <span>Join VELYX Waitlist</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button 
                  onClick={() => { setIsOrderPlaced(false); }} 
                  className="bg-stone-900 hover:bg-black text-white py-3.5 px-8 rounded-lg text-xs font-mono tracking-wider uppercase font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy More / Return to Studio</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. Interactive Scent Grid: The Kinetic Catalog */}
      <section id="kinetic-catalog" className="max-w-7xl mx-auto px-5 md:px-12 pt-8 sm:pt-10 pb-16 md:pb-24">
        
        {/* Section Heading */}
        <div className="border-b border-stone-200/60 pb-5 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-black uppercase font-bold block mb-2">
              Curated Decants
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-black  tracking-tight">
              The Kinetic Catalog
            </h2>
          </div>
          <p className="text-black text-xs font-sans max-w-sm">
            Staggered architecture showcasing premier fragrance extractions. Select individual sizes dynamically to view instantaneous odometer price adjustments.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-md">
          <label htmlFor="scent-search" className="block text-[9px] font-sans tracking-[0.15em] uppercase tracking-[0.2em] text-black mb-2 font-bold">
            Search Decants
          </label>
          <div className="relative">
            <input
              id="scent-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, brand, or ingredients/notes..."
              className="w-full bg-white/60  border border-stone-200 -full py-3 px-5 pl-6 text-xs font-sans text-black  focus:outline-none focus:ring-1 focus:ring-stone-300 focus:border-stone-200 transition-all placeholder:text-black "
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-black  text-xs font-mono transition-colors font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Sensory Test Call-To-Action Banner */}
        <div className="mb-16 bg-[#F4F4F2] text-black p-6 sm:p-8 border border-black/5 rounded-3xl shadow-2xl shadow-black/5 overflow-hidden relative group mb-16">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[9px] font-mono tracking-[0.25em] text-emerald-700 uppercase font-bold block">
                INTELLIGENT PROFILE ISOLATION SYSTEM v2
              </span>
              <p className="text-sm sm:text-base font-sans font-bold text-black leading-relaxed">
                "Can't decide? Take one of our sensory tests to find your signature profile."
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsQuizListOpen(true)}
                className="w-full md:w-auto bg-stone-900 hover:bg-black text-white transition-colors px-8 py-4 text-xs font-mono font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2.5 border border-black/5 shadow-sm rounded-2xl"
              >
                <Sparkles className="w-4 h-4 text-black  animate-pulse" />
                Explore Sensory Quizzes
                <ChevronRight className="w-4 h-4 text-black " />
              </button>
            </div>
          </div>
        </div>

        {/* Brutalist Grid Layout - Categorized by Gender */}
        {filteredCatalog.length > 0 && (
          <div className="space-y-24">
            {/* Men's Collection */}
            {filteredCatalog.filter(f => f.gender === "Men").length > 0 && (
              <div>
                <div className="mb-8">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase font-bold block mb-2">
                    MASCULINE PROFILE ARCHIVE
                  </span>
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-sans font-bold text-white tracking-[-0.02em] inline-block border border-white/20 bg-black/40 backdrop-blur-md rounded-2xl sm:rounded-3xl px-5 py-2.5 sm:px-7 sm:py-3 shadow-lg">
                      Men's Collection
                    </h3>
                    <div className="h-px bg-black/10 flex-1 min-w-[24px]" />
                  </div>
                  <p className="text-xs font-sans text-neutral-500 mt-2">
                    Woody, aromatic, leather, and intense amber formulations.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 bg-transparent">
                  {filteredCatalog.filter(f => f.gender === "Men").map((fragrance) => (
                    <div key={fragrance.id} className="h-full">
                      <ScentCard
                        fragrance={fragrance}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onNoteClick={setSelectedNote}
                        onOpenDetails={handleOpenFragranceDetails}
                        fragranceStock={stock?.fragrances[fragrance.id]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Women's Collection */}
            {filteredCatalog.filter(f => f.gender === "Women").length > 0 && (
              <div>
                <div className="mb-8">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase font-bold block mb-2">
                    FEMININE PROFILE ARCHIVE
                  </span>
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-sans font-bold text-white tracking-[-0.02em] inline-block border border-white/20 bg-black/40 backdrop-blur-md rounded-2xl sm:rounded-3xl px-5 py-2.5 sm:px-7 sm:py-3 shadow-lg">
                      Women's Collection
                    </h3>
                    <div className="h-px bg-black/10 flex-1 min-w-[24px]" />
                  </div>
                  <p className="text-xs font-sans text-neutral-500 mt-2">
                    Floral, sweet, vanilla, and sophisticated amber profiles.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 bg-transparent">
                  {filteredCatalog.filter(f => f.gender === "Women").map((fragrance) => (
                    <div key={fragrance.id} className="h-full">
                      <ScentCard
                        fragrance={fragrance}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onNoteClick={setSelectedNote}
                        onOpenDetails={handleOpenFragranceDetails}
                        fragranceStock={stock?.fragrances[fragrance.id]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Curated Capsule Bundles Subsection - Below Main Perfumes */}
        {filteredBundles.length > 0 && (
          <div id="bundle-capsules" className="mt-20 scroll-mt-24">
            {/* Subsection Heading */}
            <div className="border-b border-black/10 pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-800 uppercase font-bold block mb-1">
                  BUNDLE CAPSULES
                </span>
                <h3 className="text-3xl sm:text-4xl font-sans font-black text-black uppercase tracking-tight">
                  UNIFIED DECANT SETS
                </h3>
              </div>
              <p className="text-xs font-sans text-neutral-600 max-w-sm">
                Curated multi-scent pairings hand-selected for synergy and exceptional value.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 bg-transparent">
              {filteredBundles.map((bundle) => {
                const selectedSize = "5ml Normal";
                const isSpotlight = bundle.isSpotlight;
                const price = isSpotlight ? bundle.fixedPrice : (bundle.prices ? bundle.prices[selectedSize] : 0);
                const originalPrice = isSpotlight ? getBundleOriginalPrice(bundle.id) : null;
                const bundleStock = stock ? stock.bundles[bundle.id] : undefined;
                const isBundleOutOfStock = bundle.isOutOfStock || bundleStock === 0;

                return (
                  <div 
                    key={bundle.id}
                    className={`bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-black/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow ${isSpotlight ? 'md:col-span-2' : ''}`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[9px] font-sans tracking-[0.15em] uppercase text-black tracking-widest border border-black/5 shadow-xs rounded-full px-2 py-0.5 bg-black/5">
                          {isSpotlight ? "SPOTLIGHT" : "CURATED"}
                        </span>
                        {isBundleOutOfStock && (
                          <span className="text-[9px] font-mono text-red-600 tracking-widest uppercase font-semibold">
                            [ SOLD OUT ]
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-sans font-bold text-black tracking-tight mb-2">
                        {bundle.name}
                      </h3>
                      <p className="text-xs font-sans text-neutral-600 mb-4 leading-relaxed">
                        Contains: {bundle.contains}
                      </p>
                    </div>

                    <div className="mt-8 border-t border-black/5 pt-4 flex flex-col gap-2">
                      <button
                        disabled={isBundleOutOfStock}
                        onClick={() => {
                          handleAddBundleToCart(bundle, true);
                          setIsCartOpen(true);
                        }}
                        className="w-full py-2.5 bg-black text-white rounded-xl text-[11px] font-sans font-medium hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        {isBundleOutOfStock ? "Sold Out" : "Add to cart"}
                      </button>
                      <div className="text-center mt-1">
                        <span className="font-mono text-xs font-semibold text-neutral-800">
                          ₹{price}
                        </span>
                        {originalPrice && (
                          <span className="font-mono text-[10px] text-neutral-400 line-through ml-1.5">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {filteredCatalog.length === 0 && filteredBundles.length === 0 && (
          <div className="text-center py-24 bg-white/40 border border-stone-200/50 ">
            <span className="block font-sans font-bold text-black text-lg mb-2">
              No matching decants or bundles found
            </span>
            <span className="text-[10px] font-mono text-black uppercase tracking-widest">
              Try search parameters such as "cinnamon", "zara", or "duo"
            </span>
          </div>
        )}
      </section>
        </>
      )}

      {/* Modern Editorial Footer */}
      <footer className="bg-[#FFFFFF] text-black  py-16 px-6 md:px-12 border-t border-black/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xl font-sans font-bold text-black font-bold">
              SP 0.2
            </span>
            <span className="block text-[10px] font-mono text-black mt-2 uppercase tracking-widest">
              © 2026 ScentPreview. All Rights Reserved.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-[10px] font-sans tracking-[0.15em] text-black uppercase">
              <button onClick={() => setPolicyModal("terms")} className="hover:text-amber-700 transition-colors cursor-pointer">Terms of Use</button>
              <button onClick={() => setPolicyModal("privacy")} className="hover:text-amber-700 transition-colors cursor-pointer">Privacy Policy</button>
              <button onClick={() => setPolicyModal("shipping")} className="hover:text-amber-700 transition-colors cursor-pointer">Shipping Policy</button>
              <button onClick={() => setPolicyModal("returns")} className="hover:text-amber-700 transition-colors cursor-pointer">Returns & Refunds</button>
            </div>
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    setAdminPasscodeInput("");
                    setAdminPasscodeError(null);
                    setIsAdminOpen(true);
                  }}
                  className="text-[10px] font-sans text-black font-semibold uppercase tracking-[0.15em] cursor-pointer"
                >
                  India Edition
                </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Luxury Slide-out Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40  z-50"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 220, mass: 0.8 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white/95 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 border-l border-stone-200 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto sm:rounded-l-3xl"
            >
              {isCartSuccessOpen ? (
                <div className="text-center py-8 flex flex-col items-center justify-center h-full my-auto animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 shadow-xs">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-mono text-black uppercase tracking-[0.2em] font-semibold block mb-1">
                    Acquisition Dispatched
                  </span>
                  <h3 className="text-2xl font-serif text-black mb-2">
                    Extraction Initiated
                  </h3>
                  <p className="text-xs text-black max-w-xs leading-relaxed mb-4">
                    Your luxury decanting acquisition has been successfully dispatched.
                  </p>

                  {/* VELYX Waitlist Section */}
                  <div className="w-full bg-[#FFFFFF] border border-stone-200/80 p-4 my-4 text-left space-y-2.5">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                      <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-stone-500 font-semibold">
                        Upcoming Release • Waitlist
                      </span>
                      <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest">
                        VELYX
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-serif text-black mb-1">
                        VELYX
                      </h4>
                      <p className="text-[11px] text-stone-600 font-sans leading-relaxed">
                        Join the waitlist for VELYX to receive priority access to limited decants, archive vault drops, and new olfactory releases.
                      </p>
                    </div>

                    <a
                      href="https://velyx-waitlist.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-stone-900 hover:bg-black text-white text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer"
                    >
                      <span>Join VELYX Waitlist</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartSuccessOpen(false);
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-stone-900 hover:bg-black text-white text-xs font-mono tracking-widest uppercase py-3.5 px-6 rounded-lg cursor-pointer font-bold flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy More / Return to Studio</span>
                  </button>
                </div>
              ) : (
                <>
                  {isCartCheckoutVisible ? (
                    <div className="flex flex-col justify-between h-full animate-fade-in">
                      <div>
                        {/* Header with back button */}
                        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
                          <button
                            type="button"
                            onClick={() => setIsCartCheckoutVisible(false)}
                            className="flex items-center gap-1.5 text-xs font-mono text-stone-600 hover:text-black transition-colors cursor-pointer"
                          >
                            ← Back to Bag
                          </button>
                          <span className="text-xs font-sans tracking-wider text-black uppercase font-bold">
                            Checkout
                          </span>
                        </div>

                        {/* Compact Order Cost Summary */}
                        <div className="bg-stone-50 border border-stone-200 p-3.5 mb-5 flex items-center justify-between text-xs font-mono text-black">
                          <span>
                            {cart.reduce((s, i) => s + i.quantity, 0)} item(s) · {appliedCoupon ? "Free Delivery" : "Delivery ₹116"}
                          </span>
                          <span className="font-bold text-sm">
                            ₹{Math.max(0, cartTotal - activeDiscount) + shippingCost + (isShippingProtectionEnabled ? 150 : 0)}.00
                          </span>
                        </div>

                        <form onSubmit={handlePlaceOrder} className="space-y-3.5">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                required
                                value={checkoutName}
                                onChange={(e) => setCheckoutName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                                  Phone
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={checkoutPhone}
                                  onChange={(e) => setCheckoutPhone(e.target.value)}
                                  placeholder="+91 99999 99999"
                                  className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={checkoutEmail}
                                  onChange={(e) => setCheckoutEmail(e.target.value)}
                                  placeholder="you@example.com"
                                  className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                                Street Address
                              </label>
                              <textarea
                                required
                                rows={2}
                                value={checkoutAddress}
                                onChange={(e) => setCheckoutAddress(e.target.value)}
                                placeholder="House/Flat No., Building, Street, Area"
                                className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black resize-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                                  State
                                </label>
                                <select
                                  required
                                  value={checkoutState}
                                  onChange={(e) => setCheckoutState(e.target.value)}
                                  className="w-full bg-white border border-stone-200 px-2 py-2 text-xs text-black focus:outline-none focus:border-black font-sans cursor-pointer"
                                >
                                  {INDIAN_STATES_AND_UTS.map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                                  Pincode
                                </label>
                                <input
                                  type="text"
                                  required
                                  maxLength={6}
                                  pattern="[1-9][0-9]{5}"
                                  value={checkoutPincode}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    setCheckoutPincode(val);
                                  }}
                                  placeholder="400050"
                                  className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {renderCouponSection()}

                          {checkoutErrorMessage && (
                            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                              {checkoutErrorMessage}
                            </div>
                          )}

                          <div className="pt-4 border-t border-stone-200">
                            <button
                              type="submit"
                              disabled={isProcessingOrder}
                              className="w-full bg-black hover:bg-stone-800 text-white font-sans text-xs tracking-widest uppercase font-bold py-3.5 px-4 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {isProcessingOrder ? "Processing..." : "Continue to Payment"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-black" />
                            <span className="font-sans font-bold text-base text-black">Your Bag</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsCartOpen(false)}
                            className="p-1.5 text-stone-500 hover:text-black transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Cart Items List */}
                        {cart.length === 0 ? (
                          <div className="text-center py-16">
                            <span className="block font-sans font-bold text-black mb-1">Your bag is empty</span>
                            <span className="text-xs font-sans text-stone-500">
                              Add a fragrance or bundle to get started.
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <AnimatePresence initial={false}>
                              {cart.map((item) => (
                                <motion.div 
                                  layout
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  key={item.id + "-" + item.size}
                                  className="flex items-center justify-between p-3.5 bg-white border border-stone-200"
                                >
                                  <div className="flex items-center gap-3">
                                    {item.image && (
                                      <div className="w-11 h-11 bg-stone-50 border border-stone-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                                      </div>
                                    )}
                                    <div>
                                      <span className="block text-[9px] font-mono text-stone-500 uppercase">
                                        {item.brand}
                                      </span>
                                      <span className="font-sans font-bold text-black text-sm block leading-tight">
                                        {item.name}
                                      </span>
                                      <span className="block text-[10px] font-mono text-stone-600 mt-0.5">
                                        {item.size}
                                      </span>
                                    
                                      <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center border border-stone-200 bg-white h-6">
                                          <button
                                            type="button"
                                            onClick={() => updateCartItemQuantity(item.id, item.size, -1)}
                                            className="px-2 h-full text-black hover:bg-stone-100 transition-colors cursor-pointer font-mono text-xs"
                                          >
                                            -
                                          </button>
                                          <span className="px-2 text-xs font-mono text-black min-w-[20px] text-center">
                                            {item.quantity}
                                          </span>
                                          <button
                                            type="button"
                                            disabled={item.quantity >= getProductStock(item.id, item.size)}
                                            onClick={() => updateCartItemQuantity(item.id, item.size, 1)}
                                            className="px-2 h-full text-black hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-mono text-xs border-l border-stone-200"
                                          >
                                            +
                                          </button>
                                        </div>
                                        {getProductStock(item.id, item.size) <= 0 ? (
                                          <span className="text-[9px] font-mono text-red-600 uppercase font-bold">
                                            Out of Stock
                                          </span>
                                        ) : item.quantity >= getProductStock(item.id, item.size) && (
                                          <span className="text-[9px] font-mono text-stone-500">
                                            Max stock
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs font-bold text-black">
                                      ₹{item.price * item.quantity}.00
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.id, item.size)}
                                      className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Cart Footer */}
                      {cart.length > 0 && (
                        <div className="border-t border-stone-200 pt-5 mt-6">
                          <div className="space-y-2 mb-5">
                            <div className="flex justify-between text-xs font-mono text-stone-700">
                              <span>Subtotal</span>
                              <span>₹{cartTotal}.00</span>
                            </div>
                            {activeDiscount > 0 && (
                              <div className="flex justify-between items-center text-xs font-mono text-emerald-700">
                                <span>Tier Discount</span>
                                <span>{getTierPercentage(cartTotal)} OFF</span>
                              </div>
                            )}
                            <div className="flex justify-between text-xs font-mono text-stone-700">
                              <span>Delivery</span>
                              <span>
                                {appliedCoupon ? (
                                  <>
                                    <span className="line-through text-stone-400 mr-1.5">₹116.00</span>
                                    <span className="text-emerald-700 font-bold">₹0.00</span>
                                  </>
                                ) : (
                                  "₹116.00"
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono text-stone-700 py-1.5 border-t border-b border-stone-100">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={isShippingProtectionEnabled}
                                  onChange={(e) => setIsShippingProtectionEnabled(e.target.checked)}
                                  className="w-3.5 h-3.5 border-stone-300 text-black cursor-pointer accent-black"
                                />
                                <span>Shipping Protection (Optional)</span>
                              </label>
                              <span>{isShippingProtectionEnabled ? "₹150.00" : "—"}</span>
                            </div>
                            {renderCouponSection()}
                            <div className="flex justify-between text-base font-mono text-black font-bold pt-2 border-t border-stone-200">
                              <span>Total</span>
                              <span>
                                ₹{Math.max(0, cartTotal - activeDiscount) + shippingCost + (isShippingProtectionEnabled ? 150 : 0)}.00
                              </span>
                            </div>
                          </div>

                          {cart.some(item => getProductStock(item.id, item.size) < item.quantity) && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                              Some items in your bag are out of stock. Please remove them to proceed.
                            </div>
                          )}

                          <button
                            type="button"
                            disabled={cart.some(item => getProductStock(item.id, item.size) < item.quantity)}
                            onClick={() => setIsCartCheckoutVisible(true)}
                            className="w-full bg-black hover:bg-stone-800 py-3.5 text-xs font-sans text-white tracking-widest uppercase font-bold cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Proceed to Checkout
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Clean Single-Step Checkout Modal (for Buy Now) */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-white border border-stone-200 shadow-xl max-w-3xl w-full z-50 overflow-hidden flex flex-col md:grid md:grid-cols-12 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute right-4 top-4 text-stone-500 hover:text-black z-50 p-1.5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Order Summary (span 5) */}
              <div className="md:col-span-5 bg-stone-50 border-b md:border-b-0 md:border-r border-stone-200 p-6 flex flex-col justify-between">
                <div>
                  <span className="block text-xs font-sans tracking-wider text-black uppercase font-bold mb-4">
                    Order Summary
                  </span>
                  
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id + "-" + item.size} className="flex items-center justify-between gap-3 border-b border-stone-200/70 pb-3">
                        <div className="min-w-0">
                          <span className="font-sans font-bold text-black text-xs truncate block">{item.name}</span>
                          <span className="block text-[10px] font-mono text-stone-600 mt-0.5">
                            {item.size} × {item.quantity}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-black font-bold shrink-0">
                          ₹{item.price * item.quantity}.00
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-4 mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-stone-700">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}.00</span>
                  </div>
                  {activeDiscount > 0 && (
                    <div className="flex justify-between items-center text-xs font-mono text-emerald-700">
                      <span>Tier Discount</span>
                      <span>{getTierPercentage(cartTotal)} OFF</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-mono text-stone-700">
                    <span>Delivery</span>
                    <span>
                      {appliedCoupon ? (
                        <>
                          <span className="line-through text-stone-400 mr-1.5">₹116.00</span>
                          <span className="text-emerald-700 font-bold">₹0.00</span>
                        </>
                      ) : (
                        "₹116.00"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-stone-700 py-1.5 border-t border-b border-stone-200/60">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isShippingProtectionEnabled}
                        onChange={(e) => setIsShippingProtectionEnabled(e.target.checked)}
                        className="w-3.5 h-3.5 border-stone-300 text-black cursor-pointer accent-black"
                      />
                      <span>Protection (Optional)</span>
                    </label>
                    <span>{isShippingProtectionEnabled ? "₹150.00" : "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm font-mono text-black font-bold pt-2">
                    <span>Total</span>
                    <span>₹{Math.max(0, cartTotal - activeDiscount) + shippingCost + (isShippingProtectionEnabled ? 150 : 0)}.00</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Single-Step Checkout Form (span 7) */}
              <div className="md:col-span-7 p-6 bg-white flex flex-col justify-between">
                <form onSubmit={handlePlaceOrder} className="space-y-3.5">
                  <div className="border-b border-stone-200 pb-3 mb-3">
                    <span className="text-xs font-sans tracking-wider text-black uppercase font-bold">
                      Delivery Details
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutName}
                        onChange={(e) => setCheckoutName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutPhone}
                        onChange={(e) => setCheckoutPhone(e.target.value)}
                        placeholder="+91 99999 99999"
                        className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                      Street Address
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      placeholder="House/Flat No., Building, Street, Area"
                      className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                        State
                      </label>
                      <select
                        required
                        value={checkoutState}
                        onChange={(e) => setCheckoutState(e.target.value)}
                        className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-sans"
                      >
                        {INDIAN_STATES_AND_UTS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">
                        Pincode (6 digits)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        pattern="[1-9][0-9]{5}"
                        value={checkoutPincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setCheckoutPincode(val);
                        }}
                        placeholder="400050"
                        className="w-full bg-white border border-stone-200 px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-mono"
                      />
                    </div>
                  </div>

                  {renderCouponSection()}

                  {checkoutErrorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                      {checkoutErrorMessage}
                    </div>
                  )}

                  <div className="pt-3 border-t border-stone-200">
                    <button
                      type="submit"
                      disabled={isProcessingOrder || cart.some(item => getProductStock(item.id, item.size) < item.quantity)}
                      className="w-full bg-black hover:bg-stone-800 text-white font-sans text-xs tracking-widest uppercase font-bold py-3.5 px-6 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isProcessingOrder ? "Processing..." : cart.some(item => getProductStock(item.id, item.size) < item.quantity) ? "Contains Sold Out Items" : "Continue to Payment"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Luxury Full-Screen Admin Vault */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FFFFFF]/90  flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-[#FFFFFF] border border-stone-200 text-black   w-full max-w-4xl  overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="border-b border-stone-200 p-6 flex items-center justify-between bg-[#FFFFFF]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 -full bg-black/10 flex items-center justify-center border border-amber-gold/20">
                    <Lock className="w-4 h-4 text-black animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg text-black  tracking-wide">
                      Admin Security Portal
                    </h3>
                    <p className="text-[10px] font-sans tracking-[0.15em] uppercase tracking-[0.15em] text-black">
                      ScentPreview Allocation Vault
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAdminAuthenticated && (
                    <button
                      type="button"
                      onClick={handleCloseAndSaveAdminSession}
                      className="px-3 py-1.5  border border-stone-200 hover:border-amber-gold/30 hover:bg-stone-850 text-black hover:text-white text-[10px] font-sans tracking-[0.15em] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3 h-3" />
                      Lock Session
                    </button>
                  )}
                  <button
                    onClick={handleCloseAndSaveAdminSession}
                    className="p-1.5 -full border border-stone-200 hover:bg-stone-850 text-black hover:text-white  transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isAdminAuthenticated ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 py-20 text-center max-w-md mx-auto space-y-6">
                  <div className={`w-16 h-16 -full bg-stone-50 flex items-center justify-center border ${isAdminLocked ? "border-rose-500 animate-pulse" : "border-stone-200"}`}>
                    {isAdminLocked ? (
                      <ShieldAlert className="w-6 h-6 text-rose-700" />
                    ) : (
                      <Lock className="w-6 h-6 text-black" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-sans font-bold text-xl text-black ">
                      {isAdminLocked ? "Vault Session Locked" : "Enter Vault Passcode"}
                    </h4>
                    <p className="text-xs text-black font-sans leading-relaxed">
                      {isAdminLocked ? "Security protocol active. Maximum authentication attempts exceeded. Access has been frozen." : "This zone is strictly restricted to ScentPreview administrators. Please verify your credentials to decrypt the allocation logs."}
                    </p>
                  </div>

                  {true ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const sanitizedInput = adminPasscodeInput.trim();
                        try {
                          const res = await safeFetch("/api/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ passcode: sanitizedInput })
                          });
                          
                          const data = await res.json();
                          
                          if (res.status === 429) {
                            const newLockout = data.lockoutUntil || (Date.now() + 10 * 60 * 1000);
                            setAdminLockoutTime(newLockout);
                            localStorage.setItem("scent_adminLockoutTime", newLockout.toString());
                            setAdminPasscodeError(data.error || "Vault locked out.");
                            return;
                          }
                          
                          if (res.ok && data.success && data.token) {
                            localStorage.setItem("scent_admin_token", data.token);
                            localStorage.removeItem("scent_adminAttempts");
                            setIsAdminAuthenticated(true);
                            setAdminPasscodeError(null);
                            setAdminLockoutTime(null);
                          } else {
                            throw new Error(data.error || "Invalid passcode");
                          }
                        } catch (err: any) {
                          const errorMsg = err.message || "Invalid passcode.";
                          setAdminPasscodeError(errorMsg);
                          
                          let attempts = parseInt(localStorage.getItem("scent_adminAttempts") || "0") + 1;
                          localStorage.setItem("scent_adminAttempts", attempts.toString());
                          
                          if (attempts >= 3) {
                             const newLockout = Date.now() + 10 * 60 * 1000;
                             setAdminLockoutTime(newLockout);
                             localStorage.setItem("scent_adminLockoutTime", newLockout.toString());
                             setAdminPasscodeError("Maximum authentication attempts exceeded.");
                          }
                        }
                      }}
                      className="w-full space-y-3"
                    >
                      <input
                        type="password"
                        placeholder="Enter Passcode"
                        value={adminPasscodeInput}
                        onChange={(e) => {
                          setAdminPasscodeInput(e.target.value);
                          setAdminPasscodeError(null);
                        }}
                        className="w-full bg-[#FFFFFF] border border-stone-200  px-4 py-3 text-xs tracking-widest text-center text-black  focus:outline-none focus:border-amber-gold transition-colors font-mono"
                        autoFocus
                      />
                      {adminPasscodeError && (
                        <p className="text-[10px] font-mono text-rose-700">{adminPasscodeError}</p>
                      )}
                      <button
                        type="submit"
                        className="w-full bg-black hover:bg-amber-400 text-white font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-3 px-6 transition-all  cursor-pointer "
                      >
                        Authenticate Vault
                      </button>
                    </form>
                  ) : (
                    <div className="w-full p-4 border border-rose-900/30 bg-rose-950/20  text-rose-700 text-xs font-mono space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold uppercase tracking-wider text-rose-700">● SECURITY THREAT SUSPENDED</p>
                        {lockoutTimeRemaining && (
                          <span className="text-[10px] bg-rose-950/80 px-2 py-0.5  border border-rose-800 animate-pulse text-rose-700 font-bold">
                            {lockoutTimeRemaining}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-black leading-normal font-sans">
                        You have failed to authenticate 3 consecutive times. The ScentPreview Vault has been sealed for security. Access is locked for exactly 1 hour.
                      </p>
                      {lockoutTimeRemaining && (
                        <div className="pt-2 border-t border-rose-900/20 flex items-center justify-between text-[10px]">
                          <span className="text-black font-sans uppercase tracking-wider">Remaining Lockout:</span>
                          <span className="font-mono text-rose-700 font-bold tracking-widest">{lockoutTimeRemaining}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Tab Selector */}
                  <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab("view");
                        setAdminStatusMessage(null);
                      }}
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "view"
                          ? "border-stone-900 text-stone-900 bg-white font-bold"
                          : "border-transparent text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      Orders ({adminOrders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab("create");
                        setAdminStatusMessage(null);
                      }}
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "create"
                          ? "border-stone-900 text-stone-900 bg-white font-bold"
                          : "border-transparent text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Manual Dispatch
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab("stock");
                        setAdminStatusMessage(null);
                      }}
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "stock"
                          ? "border-stone-900 text-stone-900 bg-white font-bold"
                          : "border-transparent text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      Stock Levels
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab("prices");
                        setAdminStatusMessage(null);
                      }}
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "prices"
                          ? "border-stone-900 text-stone-900 bg-white font-bold"
                          : "border-transparent text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      Price Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab("claims");
                        setAdminStatusMessage(null);
                      }}
                      className={`flex-1 py-3 px-4 text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                        adminActiveTab === "claims"
                          ? "border-stone-900 text-stone-900 bg-white font-bold"
                          : "border-transparent text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Refund Claims
                    </button>
                  </div>

                  {/* Persistent Manual Order Stock Reduction Alert Banner */}
                  {manualStockAlert && (
                    <div className="p-4 bg-amber-50 border-b-2 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono uppercase tracking-widest font-bold bg-amber-900 text-white px-2 py-0.5">
                              STOCK ALERT — MANUAL REDUCTION REQUIRED
                            </span>
                            <span className="text-[11px] font-mono font-bold text-emerald-800">
                              ✓ Order {manualStockAlert.orderNumber} Saved (₹{manualStockAlert.total})
                            </span>
                          </div>
                          <p className="text-xs font-mono text-black leading-relaxed">
                            Stock was <strong>NOT</strong> reduced automatically. Please reduce stock by{" "}
                            <strong className="bg-amber-200/80 px-1.5 py-0.5 text-black">
                              {manualStockAlert.quantity}x {manualStockAlert.variantName} ({manualStockAlert.variantSize})
                            </strong>{" "}
                            in the Stock Levels tab.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {adminActiveTab !== "stock" && (
                          <button
                            type="button"
                            onClick={() => setAdminActiveTab("stock")}
                            className="px-3 py-1.5 bg-black hover:bg-stone-800 text-white text-[10px] font-mono uppercase tracking-wider font-bold cursor-pointer"
                          >
                            Reduce Stock Now →
                          </button>
                        )}
                        {adminActiveTab !== "view" && (
                          <button
                            type="button"
                            onClick={() => setAdminActiveTab("view")}
                            className="px-3 py-1.5 bg-white hover:bg-stone-100 text-black border border-stone-300 text-[10px] font-mono uppercase tracking-wider font-bold cursor-pointer"
                          >
                            View Saved Order
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setManualStockAlert(null)}
                          className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-600 hover:text-black border border-transparent hover:border-stone-300 cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Banner */}
                  {adminStatusMessage && (
                    <div className={`p-4 text-xs font-mono flex items-center gap-2 border-b ${
                      adminStatusMessage.type === "success"
                        ? "bg-emerald-950/30 border-emerald-900/30 text-emerald-700"
                        : "bg-rose-950/30 border-rose-900/30 text-rose-700"
                    }`}>
                      <span className="w-1.5 h-1.5 -full bg-current animate-ping" />
                      <span>{adminStatusMessage.text}</span>
                    </div>
                  )}

                  {/* Content Panel */}
                  <div className="flex-1 overflow-y-auto p-6 bg-[#FFFFFF] space-y-4">
                    {/* Out of stock notifications list */}
                    {(() => {
                      const outOfStockItems = getOutOfStockItems();
                      if (outOfStockItems.length === 0) return null;
                      return (
                        <div className="p-4 bg-red-950/25 border border-red-900/40  space-y-2">
                          <div className="flex items-center gap-2 text-rose-700">
                            <span className="w-1.5 h-1.5 -full bg-rose-500 animate-ping" />
                            <span className="text-[10px] font-sans tracking-[0.15em] uppercase tracking-widest font-bold">
                              CRITICAL OUT OF STOCK ALERTS ({outOfStockItems.length})
                            </span>
                          </div>
                          <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {outOfStockItems.map((item, index) => (
                              <p key={index} className="text-xs text-black font-mono flex items-center gap-1.5">
                                <span className="text-rose-700">⚠</span>
                                <span>
                                  <strong className="text-black ">{item.brand ? `${item.brand} — ` : ""}{item.name}</strong> is completely out of stock.
                                </span>
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {adminActiveTab === "view" ? (
                      <div className="space-y-4">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                          <span className="text-[10px] font-sans tracking-[0.15em] uppercase tracking-widest text-black">
                            Authenticated Webhook Database Records
                          </span>
                          <button
                            type="button"
                            onClick={fetchAdminOrders}
                            disabled={isLoadingAdminOrders}
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono text-black hover:text-black  transition-colors border border-stone-200 hover:border-amber-gold/30 px-2.5 py-1  bg-[#FFFFFF] cursor-pointer"
                          >
                            <RefreshCw className={`w-3 h-3 ${isLoadingAdminOrders ? "animate-spin" : ""}`} />
                            Sync Registry
                          </button>
                        </div>

                        {isLoadingAdminOrders ? (
                          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                            <div className="w-6 h-6 border-2 border-amber-gold border-t-transparent -full animate-spin" />
                            <span className="text-[10px] font-mono text-black tracking-widest uppercase">
                              Decrypting Secure Ledger...
                            </span>
                          </div>
                        ) : adminOrders.length === 0 ? (
                          <div className="py-20 text-center border border-dashed border-stone-200  flex flex-col items-center justify-center gap-2">
                            <Database className="w-8 h-8 text-black" />
                            <span className="text-[11px] font-mono text-black tracking-wider">
                              NO RECOGNIZED ORDERS FOUND IN LEDGER
                            </span>
                            <p className="text-[9px] text-black max-w-xs">
                              Orders successfully placed or manually dispatched will appear here automatically via backend replication.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {adminOrders.map((order, idx) => {
                              const hasProtection = order.shippingProtection;
                              return (
                                <div 
                                  key={order.orderNumber || idx}
                                  className="border border-stone-200 bg-stone-50/40 hover:bg-stone-50/80 p-5  transition-all flex flex-col md:flex-row md:items-start justify-between gap-4  hover:border-stone-700"
                                >
                                  {/* Left details */}
                                  <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-mono font-bold text-black  bg-stone-800 px-2 py-0.5 text-white border border-stone-750">
                                        {order.orderNumber}
                                      </span>
                                      <span className={`text-[9px] font-sans tracking-[0.15em] uppercase tracking-widest px-2 py-0.5  border ${
                                        order.status === "paid" 
                                          ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-700" 
                                          : "bg-amber-950/20 border-amber-900/50 text-amber-500"
                                      }`}>
                                        ● {order.status === "paid" ? "PAID Confirmed" : "PENDING"}
                                      </span>
                                      <span className="text-[10px] font-mono text-stone-550">
                                        {new Date(order.createdAt).toLocaleString()}
                                      </span>
                                    </div>

                                    {/* Variants */}
                                    <div>
                                      <span className="block text-[8px] font-sans tracking-[0.15em] uppercase tracking-wider text-black mb-1 font-semibold">
                                        Perfume Variant/Quantity
                                      </span>
                                      <div className="space-y-1">
                                        {order.items && order.items.map((item: any, i: number) => (
                                          <div key={i} className="text-xs font-sans text-black font-semibold">
                                            {item.name} <span className="text-black">{item.size}</span>
                                            <span className="ml-2 font-mono bg-stone-800 text-white px-1.5 py-0.5 text-[10px]">
                                              Qty: {item.quantity}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Customer details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                                      <div>
                                        <span className="block text-[8px] font-sans tracking-[0.15em] uppercase tracking-wider text-black font-semibold">
                                          Customer Name
                                        </span>
                                        <span className="text-xs font-sans text-black  font-medium">
                                          {order.name}
                                        </span>
                                        {order.email && (
                                          <span className="block text-[10px] font-mono text-black mt-0.5">
                                            {order.email}
                                          </span>
                                        )}
                                        {order.phone && order.phone !== "N/A" && (
                                          <span className="block text-[10px] font-mono text-black">
                                            {order.phone}
                                          </span>
                                        )}
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-sans tracking-[0.15em] uppercase tracking-wider text-black font-semibold">
                                          Customer Address
                                        </span>
                                        <span className="text-xs font-sans text-black block leading-relaxed">
                                          {order.address}
                                        </span>
                                        {(order.state || order.pincode) && (
                                          <span className="text-[10px] font-mono text-stone-550 block mt-0.5">
                                            {order.state || ""}{order.pincode ? ` - ${order.pincode}` : ""}
                                          </span>
                                        )}
                                        {order.ip && (
                                          <span className="block text-[9px] font-mono text-stone-600 mt-1">
                                            Client IP: <span className="text-black font-semibold">{order.ip}</span>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right details */}
                                  <div className="md:text-right flex md:flex-col justify-between items-center md:items-end gap-3 pt-3 md:pt-0 md:border-l md:border-stone-200 md:pl-5 min-w-[150px]">
                                    <div>
                                      <span className="block text-[8px] font-sans tracking-[0.15em] uppercase tracking-wider text-black font-semibold">
                                        Shipping Protection
                                      </span>
                                      <span className={`text-xs font-sans font-semibold mt-1 inline-block ${
                                        hasProtection ? "text-emerald-700" : "text-black"
                                      }`}>
                                        {hasProtection ? "🛡️ Yes" : "❌ No"}
                                      </span>
                                    </div>

                                    {order.couponCode && (
                                      <div>
                                        <span className="block text-[8px] font-sans tracking-[0.15em] uppercase tracking-wider text-black font-semibold">
                                          Delivery Coupon
                                        </span>
                                        <span className="text-xs font-mono font-bold text-emerald-700 mt-0.5 block">
                                          {order.couponCode} (Free Delivery)
                                        </span>
                                      </div>
                                    )}

                                    <div>
                                      <span className="block text-[8px] font-sans tracking-[0.15em] uppercase tracking-wider text-black font-semibold">
                                        Total Amount Paid
                                      </span>
                                      <span className="text-base font-mono font-bold text-black  block mt-0.5">
                                        ₹{order.total}.00
                                      </span>
                                    </div>

                                    {/* Actions: Ban Device & Delete */}
                                    <div className="pt-2 flex items-center gap-2 flex-wrap justify-end">
                                      {/* Flag & Ban Button */}
                                      {banningOrderNum === order.orderNumber ? (
                                        <div className="flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() => handleBanOrder(order)}
                                            className="px-2 py-1 bg-red-700 hover:bg-red-800 text-white text-[9px] font-mono uppercase font-bold tracking-wider cursor-pointer"
                                          >
                                            Confirm Ban
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setBanningOrderNum(null)}
                                            className="px-2 py-1 bg-stone-700 text-white text-[9px] font-mono cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          title="Permanently block this IP, phone, and email from making future orders"
                                          onClick={() => setBanningOrderNum(order.orderNumber)}
                                          className="text-[10px] font-mono text-rose-700 hover:text-rose-900 uppercase tracking-wider flex items-center gap-1 bg-rose-50 hover:bg-rose-100 px-2 py-1 border border-rose-200 cursor-pointer"
                                        >
                                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                                          Flag & Ban
                                        </button>
                                      )}

                                      {/* Delete Button */}
                                      {orderDeletingNum === order.orderNumber ? (
                                        <div className="flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteOrder(order.orderNumber)}
                                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                                          >
                                            Confirm
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setOrderDeletingNum(null)}
                                            className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-white text-[10px] font-mono transition-all cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setOrderDeletingNum(order.orderNumber)}
                                          className="text-[10px] font-mono text-black hover:text-rose-600 uppercase tracking-widest transition-colors flex items-center gap-1 bg-stone-50 hover:bg-rose-50 px-2 py-1 border border-stone-200 hover:border-rose-200 cursor-pointer"
                                        >
                                          <Trash2 className="w-3 h-3 text-rose-700" />
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : adminActiveTab === "create" ? (
                      /* Manual dispatch dispatcher form */
                      <form onSubmit={handleCreateManualOrder} className="space-y-4 max-w-2xl mx-auto">
                        <span className="block text-[10px] font-sans tracking-[0.15em] uppercase tracking-widest text-black mb-2">
                          Record a paid order directly with custom parameters
                        </span>

                        {/* Variant Section */}
                        <div className="bg-stone-50/40 border border-stone-200 p-4  space-y-3">
                          <span className="block text-[8px] font-sans tracking-[0.15em] uppercase tracking-[0.1em] text-black font-bold">
                            1. Perfume Allocation Details
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[8px] font-mono text-black uppercase tracking-wider mb-1 font-bold">
                                Perfume Variant Name *
                              </label>
                              <input
                                type="text"
                                required
                                list="admin-perfume-variants"
                                placeholder="e.g. Lattafa Khamrah, Calvin Klein CK One"
                                value={adminManualVariantName}
                                onChange={(e) => setAdminManualVariantName(e.target.value)}
                                className="w-full bg-[#FFFFFF] border border-stone-200  px-3 py-2 text-xs text-black  focus:outline-none focus:border-stone-700"
                              />
                              <datalist id="admin-perfume-variants">
                                {CATALOG_DATA.map((f) => (
                                  <option key={f.id} value={f.name} />
                                ))}
                                {BUNDLE_DATA.map((b) => (
                                  <option key={b.id} value={b.name} />
                                ))}
                              </datalist>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[8px] font-mono text-black uppercase tracking-wider mb-1 font-bold">
                                  Size *
                                </label>
                                <select
                                  value={adminManualVariantSize}
                                  onChange={(e) => setAdminManualVariantSize(e.target.value)}
                                  className="w-full bg-[#FFFFFF] border border-stone-200  px-2 py-2 text-xs text-black  focus:outline-none focus:border-stone-700 font-sans"
                                >
                                  <option value="5ml Normal">5ml Normal</option>
                                  <option value="5ml HQ">5ml HQ</option>
                                  <option value="10ml">10ml</option>
                                  <option value="Full Bottle">Full Bottle</option>
                                  <option value="Not Applicable">Not Applicable</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[8px] font-mono text-black uppercase tracking-wider mb-1 font-bold">
                                  Quantity *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min={1}
                                  value={adminManualVariantQty}
                                  onChange={(e) => setAdminManualVariantQty(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-full bg-[#FFFFFF] border border-stone-200  px-3 py-2 text-xs text-black  focus:outline-none focus:border-stone-700 font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-2 bg-amber-50 p-3 border border-amber-300">
                            <div className="flex items-start sm:items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
                              <span className="text-[10px] font-mono text-black select-none leading-relaxed">
                                <strong className="text-amber-900 uppercase">Manual Stock Reminder:</strong> Auto stock deduction is <span className="font-bold underline">DISABLED</span> for manual orders. Please remember to manually reduce stock in the Stock Levels tab after recording this order.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setAdminActiveTab("stock")}
                              className="px-2.5 py-1 bg-black text-white text-[9px] font-mono uppercase tracking-wider font-bold shrink-0 cursor-pointer hover:bg-stone-800"
                            >
                              Open Stock Tab →
                            </button>
                          </div>
                        </div>

                        {/* Customer Info Section */}
                        <div className="bg-stone-50/40 border border-stone-200 p-4  space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                            <span className="block text-[8px] font-sans tracking-[0.15em] uppercase tracking-[0.1em] text-black font-bold">
                              2. Customer Delivery Parameters
                            </span>

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="adminManualDeliveryNA"
                                checked={adminManualDeliveryNA}
                                onChange={(e) => {
                                  setAdminManualDeliveryNA(e.target.checked);
                                  if (e.target.checked) {
                                    setAdminManualAddress("Not Applicable");
                                    setAdminManualEmail("notapplicable@scentpreview.com");
                                    setAdminManualPhone("N/A");
                                    setAdminManualState("N/A");
                                    setAdminManualPincode("000000");
                                  } else {
                                    setAdminManualAddress("");
                                    setAdminManualEmail("");
                                    setAdminManualPhone("");
                                    setAdminManualState("Maharashtra");
                                    setAdminManualPincode("");
                                  }
                                }}
                                className=" border-stone-200 bg-[#FFFFFF] text-black focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                              />
                              <label htmlFor="adminManualDeliveryNA" className="text-[9px] font-mono text-black/90 font-bold select-none cursor-pointer uppercase tracking-wider">
                                Mark Delivery as Not Applicable
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[8px] font-mono text-black uppercase tracking-wider mb-1 font-bold">
                                Customer Name
                              </label>
                              <input
                                type="text"
                                placeholder={adminManualDeliveryNA ? "Not Applicable (Walk-in)" : "Customer Full Name (or leave blank for Walk-in)"}
                                value={adminManualName}
                                onChange={(e) => setAdminManualName(e.target.value)}
                                disabled={adminManualDeliveryNA}
                                className="w-full bg-[#FFFFFF] border border-stone-200  px-3 py-2 text-xs text-black  focus:outline-none focus:border-stone-700 disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono text-black uppercase tracking-wider mb-1 font-bold">
                                Customer Email Address
                              </label>
                              <input
                                type="text"
                                placeholder={adminManualDeliveryNA ? "N/A" : "customer@example.com"}
                                value={adminManualEmail}
                                onChange={(e) => setAdminManualEmail(e.target.value)}
                                disabled={adminManualDeliveryNA}
                                className="w-full bg-[#FFFFFF] border border-stone-200  px-3 py-2 text-xs text-black  focus:outline-none focus:border-stone-700 disabled:opacity-50"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-mono text-black uppercase tracking-wider mb-1 font-bold">
                              Customer Shipping Address
                            </label>
                            <textarea
                              rows={2}
                              placeholder={adminManualDeliveryNA ? "Not Applicable" : "Complete physical address (or leave blank for N/A)"}
                              value={adminManualAddress}
                              onChange={(e) => setAdminManualAddress(e.target.value)}
                              disabled={adminManualDeliveryNA}
                              className="w-full bg-[#FFFFFF] border border-stone-200  px-3 py-2 text-xs text-black  focus:outline-none focus:border-stone-700 resize-none disabled:opacity-50"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[8px] font-mono text-black uppercase tracking-wider mb-1 font-bold">
                                Contact Phone
                              </label>
                              <input
                                type="text"
                                placeholder={adminManualDeliveryNA ? "N/A" : "e.g. +91 99999 99999"}
                                value={adminManualPhone}
                                onChange={(e) => setAdminManualPhone(e.target.value)}
                                disabled={adminManualDeliveryNA}
                                className="w-full bg-[#FFFFFF] border border-stone-200  px-3 py-2 text-xs text-black  focus:outline-none focus:border-stone-700 disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono text-black uppercase tracking-wider mb-1 font-bold">
                                State
                              </label>
                              <input
                                type="text"
                                placeholder={adminManualDeliveryNA ? "N/A" : "e.g. Maharashtra"}
                                value={adminManualState}
                                onChange={(e) => setAdminManualState(e.target.value)}
                                disabled={adminManualDeliveryNA}
                                className="w-full bg-[#FFFFFF] border border-stone-200  px-3 py-2 text-xs text-black  focus:outline-none focus:border-stone-700 disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono text-black uppercase tracking-wider mb-1 font-bold">
                                Pincode
                              </label>
                              <input
                                type="text"
                                placeholder={adminManualDeliveryNA ? "N/A" : "e.g. 400050"}
                                value={adminManualPincode}
                                onChange={(e) => setAdminManualPincode(e.target.value)}
                                disabled={adminManualDeliveryNA}
                                className="w-full bg-[#FFFFFF] border border-stone-200  px-3 py-2 text-xs text-black  focus:outline-none focus:border-stone-700 font-mono disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Financial/Protection details */}
                        <div className="bg-stone-50/40 border border-stone-200 p-4  flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <input
                              type="checkbox"
                              id="adminManualProtection"
                              checked={adminManualShippingProtection}
                              onChange={(e) => setAdminManualShippingProtection(e.target.checked)}
                              className=" border-stone-200 bg-[#FFFFFF] text-black focus:ring-0 w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="adminManualProtection" className="text-xs font-sans text-black select-none cursor-pointer">
                              Include Shipping Protection Yes/No
                            </label>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <label className="text-xs font-mono text-black uppercase tracking-wider">
                              Total Amount Paid:
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-xs font-sans text-black">₹</span>
                              <input
                                type="number"
                                required
                                min={0}
                                value={adminManualTotal}
                                onChange={(e) => setAdminManualTotal(Math.max(0, parseInt(e.target.value) || 0))}
                                className="bg-[#FFFFFF] border border-stone-200  pl-6 pr-3 py-1.5 text-sm text-black font-mono font-bold focus:outline-none focus:border-stone-700 w-28 text-right"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Submit CTA */}
                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            disabled={isSavingManualOrder}
                            className="w-full sm:w-auto bg-black hover:bg-amber-450 text-white font-sans text-xs tracking-[0.2em] uppercase font-medium font-bold py-3 px-8 transition-all  cursor-pointer  flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <Database className="w-4 h-4" />
                            {isSavingManualOrder ? "Saving Order..." : "Record & Dispatch Paid Order"}
                          </button>
                        </div>
                      </form>
                    ) : adminActiveTab === "stock" ? (
                      /* Stock levels tab */
                      <div className="space-y-6 max-w-4xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                          <div>
                            <span className="block text-[10px] font-sans tracking-[0.15em] uppercase tracking-widest text-black font-bold">
                              Live Fragrance Allocation & Decant Inventory
                            </span>
                            <p className="text-xs text-black font-sans mt-0.5">
                              Modify active stock units. These levels automatically decrement upon order confirmation.
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={resetStockToOfficial}
                              disabled={isSavingStock}
                              className="px-4 py-2 bg-stone-50 hover:bg-stone-850 border border-stone-200 text-black hover:text-black   text-xs font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isSavingStock ? 'animate-spin' : ''}`} />
                              Reset to Baseline
                            </button>
                            <button
                              type="button"
                              onClick={saveUpdatedStock}
                              disabled={isSavingStock}
                              className="px-5 py-2 bg-black hover:bg-amber-450 text-white  text-xs font-mono font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2  hover:shadow-amber-gold/10 disabled:opacity-50"
                            >
                              <Database className="w-3.5 h-3.5" />
                              {isSavingStock ? "Saving..." : "Save (Auto)"}
                            </button>
                          </div>
                        </div>

                        {/* Fragrance List Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {CATALOG_DATA.map((fragrance) => {
                            const fragStock = stock?.fragrances[fragrance.id] || {};
                            return (
                              <div key={fragrance.id} className="bg-stone-50/40 border border-stone-200/80 p-4  hover:border-stone-700/80 transition-colors flex items-start gap-4">
                                <div className={`w-12 h-12 -full bg-gradient-to-br ${fragrance.color} flex-shrink-0 flex items-center justify-center border border-white/5 shadow-inner`}>
                                  <span className="text-[10px] font-mono text-black /40 font-bold uppercase tracking-wider">
                                    {fragrance.brand.substring(0, 2)}
                                  </span>
                                </div>

                                <div className="flex-1 space-y-3">
                                  <div>
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <h4 className="font-sans font-bold text-black text-sm leading-snug">
                                          {fragrance.name}
                                        </h4>
                                        <span className="text-[9px] font-sans tracking-[0.15em] uppercase tracking-widest text-black block mt-0.5">
                                          {fragrance.brand} • {fragrance.notes.split(" / ").slice(0, 2).join(" & ")}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {(() => {
                                          const totalUnits = Object.values(fragStock).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
                                          return totalUnits <= 0 ? (
                                            <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-red-100 text-red-700 border border-red-200">
                                              0 Stock (Sold Out)
                                            </span>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() => handleZeroOutFragrance(fragrance.id)}
                                              className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded bg-stone-100 hover:bg-red-600 hover:text-white border border-stone-300 text-stone-700 transition-colors cursor-pointer font-bold"
                                              title="Set entire perfume to 0 stock across all sizes"
                                            >
                                              Zero Out (Set to 0)
                                            </button>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
                                      {(() => {
                                        const totalUnits = Object.values(fragStock).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
                                        return (
                                          <span className={totalUnits <= 0 ? "text-red-600 font-bold" : "text-stone-500"}>
                                            Total: {totalUnits} units {totalUnits <= 0 ? "• Cannot be bought" : ""}
                                          </span>
                                        );
                                      })()}
                                    </div>
                                  </div>

                                  {/* Stock selectors for each size */}
                                  <div className="space-y-2 pt-1 border-t border-stone-200">
                                    {[
                                      { label: "5ml (Norm)", key: "5ml Normal" },
                                      { label: "5ml (HQ)", key: "5ml HQ" },
                                      { label: "10ml (Norm)", key: "10ml" }
                                    ].map((sizeObj) => {
                                      const isTypicalDisabled = fragrance.disabledSizes?.includes(sizeObj.key);
                                      const count = fragStock[sizeObj.key] ?? 0;
                                      return (
                                        <div key={sizeObj.key} className="flex items-center justify-between gap-2 py-0.5">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[11px] font-mono text-black">
                                              {sizeObj.label}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-black">
                                              ₹{fragrance.prices[sizeObj.key as keyof typeof fragrance.prices]}
                                            </span>
                                            {isTypicalDisabled && (
                                              <span className="text-[7px] font-sans tracking-[0.15em] uppercase px-1 border border-stone-200 bg-[#FFFFFF] text-black ">
                                                Disabled
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-1 bg-[#FFFFFF] p-0.5 border border-stone-200 ">
                                            <button
                                              type="button"
                                              onClick={() => handleStockChange("fragrance", fragrance.id, sizeObj.key, count - 1)}
                                              className="w-5 h-5  bg-[#FFFFFF] hover:bg-stone-850 text-black hover:text-white  flex items-center justify-center text-xs font-mono cursor-pointer transition-colors"
                                            >
                                              -
                                            </button>
                                            <input
                                              type="number"
                                              value={count}
                                              onChange={(e) => handleStockChange("fragrance", fragrance.id, sizeObj.key, parseInt(e.target.value) || 0)}
                                              className="w-10 bg-transparent border-0 text-center font-sans text-[11px] tracking-wider text-black focus:ring-0 p-0"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleStockChange("fragrance", fragrance.id, sizeObj.key, count + 1)}
                                              className="w-5 h-5  bg-[#FFFFFF] hover:bg-stone-850 text-black hover:text-white  flex items-center justify-center text-xs font-mono cursor-pointer transition-colors"
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Bundles Section */}
                        <div className="mt-8 pt-6 border-t border-stone-200 space-y-4">
                          <div>
                            <span className="block text-[10px] font-sans tracking-[0.15em] uppercase tracking-widest text-black">
                              Capsule Bundles Inventory Allocation
                            </span>
                            <p className="text-[10px] text-black font-sans">
                              Managed stock quotas for pre-arranged layered gift boxes.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {BUNDLE_DATA.map((bundle) => {
                              const count = stock?.bundles[bundle.id] ?? 0;
                              return (
                                <div key={bundle.id} className="bg-stone-50/20 border border-stone-200 p-3  flex items-center justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                    <h5 className="text-xs text-black font-sans truncate font-medium" title={bundle.name}>
                                      {bundle.name}
                                    </h5>
                                    <span className="text-[8px] font-mono text-black block truncate" title={bundle.contains}>
                                      {bundle.contains}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 bg-[#FFFFFF] p-0.5 border border-stone-200  flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleStockChange("bundle", bundle.id, "", count - 1)}
                                      className="w-4 h-4  bg-[#FFFFFF] hover:bg-stone-850 text-black hover:text-white  flex items-center justify-center text-[10px] font-mono cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      value={count}
                                      onChange={(e) => handleStockChange("bundle", bundle.id, "", parseInt(e.target.value) || 0)}
                                      className="w-8 bg-transparent border-0 text-center font-sans text-[11px] tracking-wider text-black focus:ring-0 p-0"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleStockChange("bundle", bundle.id, "", count + 1)}
                                      className="w-4 h-4  bg-[#FFFFFF] hover:bg-stone-850 text-black hover:text-white  flex items-center justify-center text-[10px] font-mono cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : adminActiveTab === "prices" ? (
                      /* Price Details & Variant Breakdown Tab */
                      <div className="space-y-6 max-w-5xl mx-auto">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                          <div>
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-black" />
                              <span className="block text-xs font-sans tracking-[0.15em] uppercase tracking-widest text-black font-bold">
                                Perfume Variant & Price Details Registry
                              </span>
                            </div>
                            <p className="text-xs text-black font-sans mt-1">
                              Complete exact price breakdown mapping for all perfumes, capsule bundles, and individual variants regardless of stock status.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-1 bg-stone-50 border border-stone-200  text-[10px] font-mono text-black">
                              Products: <strong className="text-black ">{CATALOG_DATA.length + BUNDLE_DATA.length}</strong>
                            </span>
                            <span className="px-2.5 py-1 bg-black/10 border border-amber-gold/20  text-[10px] font-mono text-black">
                              Variants Mapped: <strong className="text-black ">100% Full Coverage</strong>
                            </span>
                            <span className="px-2.5 py-1 bg-emerald-950/30 border border-emerald-900/40  text-[10px] font-mono text-emerald-700">
                              Exact Database Records
                            </span>
                          </div>
                        </div>

                        {/* Search and Filter Toolbar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50/60 p-3  border border-stone-200">
                          <div className="relative flex-1">
                            <Search className="w-3.5 h-3.5 text-black absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Search perfume name, brand, variant (e.g. 5ml HQ), or exact price..."
                              value={adminPriceSearch}
                              onChange={(e) => setAdminPriceSearch(e.target.value)}
                              className="w-full bg-[#FFFFFF] border border-stone-200  pl-8 pr-8 py-1.5 text-xs text-black  placeholder-stone-500 focus:outline-none focus:border-amber-gold font-sans"
                            />
                            {adminPriceSearch && (
                              <button 
                                onClick={() => setAdminPriceSearch("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black hover:text-black  text-xs font-mono"
                              >
                                ×
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-black uppercase tracking-wider hidden sm:inline">Filter:</span>
                            <select
                              value={adminPriceFilter}
                              onChange={(e: any) => setAdminPriceFilter(e.target.value)}
                              className="bg-[#FFFFFF] border border-stone-200  px-3 py-1.5 text-xs text-black focus:outline-none focus:border-amber-gold font-mono cursor-pointer"
                            >
                              <option value="all">All Items & Variants</option>
                              <option value="fragrance">Single Perfumes Only</option>
                              <option value="bundle">Capsule Bundles Only</option>
                              <option value="outofstock">Out of Stock Only</option>
                              <option value="disabled">Disabled Variants Only</option>
                            </select>
                          </div>
                        </div>

                        {/* High-Density Tabular Breakdown */}
                        <div className="border border-stone-200 bg-stone-50/40  overflow-hidden ">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-sans">
                              <thead>
                                <tr className="bg-[#FFFFFF]/90 border-b border-stone-200 text-[10px] font-sans tracking-[0.15em] uppercase tracking-widest text-black">
                                  <th className="py-3 px-4 font-semibold">Perfume / Bundle</th>
                                  <th className="py-3 px-4 font-semibold">Brand / Category</th>
                                  <th className="py-3 px-4 font-semibold">Variant / Format</th>
                                  <th className="py-3 px-4 font-semibold">Inventory Status</th>
                                  <th className="py-3 px-4 font-semibold text-right">Exact Price</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-850/80">
                                {(() => {
                                  // Construct all rows
                                  const allRows: Array<{
                                    id: string;
                                    name: string;
                                    brand: string;
                                    category: "Single Perfume" | "Capsule Bundle";
                                    notes: string;
                                    variantName: string;
                                    price: number;
                                    isOutOfStock: boolean;
                                    isDisabled: boolean;
                                    stockCount: number;
                                    color?: string;
                                    isPremium?: boolean;
                                    isSpotlight?: boolean;
                                  }> = [];

                                  // Add Catalog Fragrances
                                  CATALOG_DATA.forEach((f) => {
                                    const fragStock = stock?.fragrances[f.id] || {};
                                    const variantSizes = ["5ml Normal", "5ml HQ", "10ml"] as const;
                                    
                                    variantSizes.forEach((sizeKey) => {
                                      const isDisabled = Boolean(f.disabledSizes?.includes(sizeKey));
                                      const stockCount = fragStock[sizeKey] ?? 0;
                                      const isOOS = f.isOutOfStock || stockCount === 0;

                                      allRows.push({
                                        id: `${f.id}-${sizeKey}`,
                                        name: f.name,
                                        brand: f.brand,
                                        category: "Single Perfume",
                                        notes: f.notes,
                                        variantName: sizeKey,
                                        price: f.prices[sizeKey],
                                        isOutOfStock: isOOS,
                                        isDisabled: isDisabled,
                                        stockCount: stockCount,
                                        color: f.color,
                                        isPremium: f.isPremium
                                      });
                                    });
                                  });

                                  // Add Capsule Bundles
                                  BUNDLE_DATA.forEach((b) => {
                                    const bundleStock = stock?.bundles[b.id] ?? 0;
                                    const isOOS = b.isOutOfStock || bundleStock === 0;

                                    if (b.isSpotlight && b.fixedPrice !== undefined) {
                                      allRows.push({
                                        id: `${b.id}-spotlight`,
                                        name: b.name,
                                        brand: "ScentPreview Curated",
                                        category: "Capsule Bundle",
                                        notes: b.contains,
                                        variantName: "Spotlight Fixed Bundle",
                                        price: b.fixedPrice,
                                        isOutOfStock: isOOS,
                                        isDisabled: false,
                                        stockCount: bundleStock,
                                        isSpotlight: true
                                      });
                                    } else if (b.prices) {
                                      const variantSizes = ["5ml Normal", "5ml HQ", "10ml"] as const;
                                      variantSizes.forEach((sizeKey) => {
                                        allRows.push({
                                          id: `${b.id}-${sizeKey}`,
                                          name: b.name,
                                          brand: "ScentPreview Curated",
                                          category: "Capsule Bundle",
                                          notes: b.contains,
                                          variantName: sizeKey,
                                          price: b.prices![sizeKey],
                                          isOutOfStock: isOOS,
                                          isDisabled: false,
                                          stockCount: bundleStock
                                        });
                                      });
                                    }
                                  });

                                  // Apply Filter & Search
                                  const query = adminPriceSearch.trim().toLowerCase();
                                  const filteredRows = allRows.filter((row) => {
                                    // Search match
                                    if (query) {
                                      const matchName = row.name.toLowerCase().includes(query);
                                      const matchBrand = row.brand.toLowerCase().includes(query);
                                      const matchVariant = row.variantName.toLowerCase().includes(query);
                                      const matchNotes = row.notes.toLowerCase().includes(query);
                                      const matchPrice = String(row.price).includes(query);
                                      if (!matchName && !matchBrand && !matchVariant && !matchNotes && !matchPrice) {
                                        return false;
                                      }
                                    }

                                    // Category/Status match
                                    if (adminPriceFilter === "fragrance" && row.category !== "Single Perfume") return false;
                                    if (adminPriceFilter === "bundle" && row.category !== "Capsule Bundle") return false;
                                    if (adminPriceFilter === "outofstock" && !row.isOutOfStock) return false;
                                    if (adminPriceFilter === "disabled" && !row.isDisabled) return false;

                                    return true;
                                  });

                                  if (filteredRows.length === 0) {
                                    return (
                                      <tr>
                                        <td colSpan={5} className="py-12 text-center text-black font-mono">
                                          No perfume variant or price records match your criteria.
                                        </td>
                                      </tr>
                                    );
                                  }

                                  return filteredRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-[#FFFFFF]/60 transition-colors">
                                      {/* Perfume / Bundle Name */}
                                      <td className="py-3 px-4 font-medium text-black ">
                                        <div className="flex items-center gap-2.5">
                                          {row.color ? (
                                            <div className={`w-3 h-3 -full bg-gradient-to-br ${row.color} flex-shrink-0 border border-white/20`} />
                                          ) : (
                                            <div className="w-3 h-3 -full bg-amber-500/30 flex-shrink-0 border border-amber-500/40" />
                                          )}
                                          <div>
                                            <span className="font-sans font-bold text-sm text-black  block leading-tight">
                                              {row.name}
                                            </span>
                                            <span className="text-[9px] font-mono text-black block truncate max-w-xs">
                                              {row.notes}
                                            </span>
                                          </div>
                                        </div>
                                      </td>

                                      {/* Brand & Badges */}
                                      <td className="py-3 px-4">
                                        <span className="text-[11px] font-mono text-black block font-semibold">
                                          {row.brand}
                                        </span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <span className="text-[8px] font-sans tracking-[0.15em] uppercase px-1.5 py-0.2  border border-stone-200 bg-[#FFFFFF] text-black">
                                            {row.category}
                                          </span>
                                          {row.isPremium && (
                                            <span className="text-[8px] font-sans tracking-[0.15em] uppercase px-1.5 py-0.2  border border-amber-500/30 bg-amber-950/30 text-amber-400">
                                              Premium
                                            </span>
                                          )}
                                        </div>
                                      </td>

                                      {/* Variant / Size */}
                                      <td className="py-3 px-4">
                                        <span className="text-xs font-mono font-bold text-black bg-black/10 px-2 py-0.5  border border-amber-gold/20 inline-block">
                                          {row.variantName}
                                        </span>
                                      </td>

                                      {/* Inventory Status */}
                                      <td className="py-3 px-4">
                                        {row.isDisabled ? (
                                          <span className="text-[10px] font-mono px-2 py-0.5  border border-stone-750 bg-[#FFFFFF] text-black inline-flex items-center gap-1 font-semibold">
                                            <span className="w-1.5 h-1.5 -full bg-transparent0" />
                                            Disabled Variant
                                          </span>
                                        ) : row.isOutOfStock ? (
                                          <span className="text-[10px] font-mono px-2 py-0.5  border border-rose-900/50 bg-rose-950/30 text-rose-700 inline-flex items-center gap-1 font-semibold">
                                            <span className="w-1.5 h-1.5 -full bg-rose-500 animate-ping" />
                                            Out of Stock (0 units)
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-mono px-2 py-0.5  border border-emerald-900/50 bg-emerald-950/30 text-emerald-700 inline-flex items-center gap-1 font-semibold">
                                            <span className="w-1.5 h-1.5 -full bg-emerald-400" />
                                            In Stock ({row.stockCount} units)
                                          </span>
                                        )}
                                      </td>

                                      {/* Exact Price */}
                                      <td className="py-3 px-4 text-right">
                                        <span className="text-sm font-mono font-bold text-black  tracking-wider">
                                          ₹{row.price}.00
                                        </span>
                                      </td>
                                    </tr>
                                  ));
                                })()}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Product-by-Product Variant Breakdown Cards */}
                        <div className="pt-6 border-t border-stone-200 space-y-4">
                          <div>
                            <span className="block text-[10px] font-sans tracking-[0.15em] uppercase tracking-widest text-black font-bold">
                              Individual Perfume Variant Price Sheets
                            </span>
                            <p className="text-xs text-black font-sans mt-0.5">
                              Per-product view of all 11 catalog fragrances with complete variant price tables.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {CATALOG_DATA.map((fragrance) => {
                              const fragStock = stock?.fragrances[fragrance.id] || {};
                              return (
                                <div key={fragrance.id} className="bg-stone-50/40 border border-stone-200 p-4  space-y-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 -full bg-gradient-to-br ${fragrance.color} flex-shrink-0 flex items-center justify-center border border-white/10 shadow-inner`}>
                                        <span className="text-[9px] font-mono text-black /50 font-bold uppercase">
                                          {fragrance.brand.substring(0, 2)}
                                        </span>
                                      </div>
                                      <div>
                                        <h4 className="font-sans font-bold text-black  text-sm font-medium">
                                          {fragrance.name}
                                        </h4>
                                        <span className="text-[9px] font-mono text-black uppercase tracking-widest block">
                                          {fragrance.brand}
                                        </span>
                                      </div>
                                    </div>

                                    {fragrance.isPremium && (
                                      <span className="text-[8px] font-sans tracking-[0.15em] uppercase tracking-wider px-2 py-0.5  border border-amber-500/30 bg-amber-950/20 text-amber-400 font-bold">
                                        PREMIUM
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-[10px] text-black font-sans border-t border-stone-200 pt-2 flex items-center justify-between">
                                    <span>Notes: {fragrance.notes}</span>
                                    {fragrance.disabledSizes && fragrance.disabledSizes.length > 0 && (
                                      <span className="font-sans text-[10px] text-amber-400">
                                        Disabled: {fragrance.disabledSizes.join(", ")}
                                      </span>
                                    )}
                                  </div>

                                  {/* Variant Price Breakdown Table for this Perfume */}
                                  <div className="border border-stone-200  bg-[#FFFFFF]/70 overflow-hidden">
                                    <table className="w-full text-left text-[11px] font-mono">
                                      <thead>
                                        <tr className="border-b border-stone-200 text-black uppercase tracking-wider text-[8px]">
                                          <th className="py-1.5 px-3 font-semibold">Variant Size</th>
                                          <th className="py-1.5 px-3 font-semibold">Status</th>
                                          <th className="py-1.5 px-3 font-semibold text-right">Exact Price</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-stone-850/50">
                                        {(["5ml Normal", "5ml HQ", "10ml"] as const).map((sizeKey) => {
                                          const isDisabled = Boolean(fragrance.disabledSizes?.includes(sizeKey));
                                          const count = fragStock[sizeKey] ?? 0;
                                          const isOOS = fragrance.isOutOfStock || count === 0;
                                          const exactPrice = fragrance.prices[sizeKey];

                                          return (
                                            <tr key={sizeKey} className="hover:bg-stone-50">
                                              <td className="py-2 px-3 text-black  font-bold">
                                                {sizeKey}
                                              </td>
                                              <td className="py-2 px-3">
                                                {isDisabled ? (
                                                  <span className="text-[8px] uppercase tracking-wider text-black font-bold">
                                                    Disabled
                                                  </span>
                                                ) : isOOS ? (
                                                  <span className="text-[8px] uppercase tracking-wider text-rose-700 font-bold">
                                                    Out of Stock (0)
                                                  </span>
                                                ) : (
                                                  <span className="text-[8px] uppercase tracking-wider text-emerald-700 font-bold">
                                                    In Stock ({count})
                                                  </span>
                                                )}
                                              </td>
                                              <td className="py-2 px-3 text-right text-black font-bold">
                                                ₹{exactPrice}.00
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Claims Tab */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-black/5">
                          <span className="text-[10px] font-sans tracking-[0.15em] uppercase text-black font-bold">
                            ADMIN REGISTERED CLAIMS
                          </span>
                          <button
                            type="button"
                            onClick={fetchAdminComplaints}
                            className="inline-flex items-center gap-1.5 text-[10px] font-sans text-black hover:text-black transition-colors border border-black/5 hover:border-amber-700 px-2.5 py-1 bg-[#FFFFFF] cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Sync Claims
                          </button>
                        </div>
                        {adminComplaints.length === 0 ? (
                          <div className="py-20 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-black/5 bg-[#FFFFFF]">
                            <span className="text-black text-xs font-sans uppercase tracking-[0.15em]">
                              No Claims Found
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {adminComplaints.map(claim => {
                              const submittedTime = new Date(claim.submittedAt || claim.createdAt).getTime();
                              const isExpired = (Date.now() - submittedTime) > 48 * 60 * 60 * 1000;
                              return (
                              <div key={claim.id} className="border border-black/5 bg-[#FFFFFF] p-5 rounded-2xl flex flex-col justify-between gap-6 shadow-sm hover:border-stone-300">
                                <div className="space-y-3 flex-1">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-[11px] font-mono bg-stone-100 text-black px-2 py-0.5 rounded font-bold">
                                      {claim.id}
                                    </span>
                                    <span className="text-[10px] font-sans text-black/60 uppercase tracking-widest">
                                      {new Date(claim.submittedAt || claim.createdAt).toLocaleString()}
                                    </span>
                                    <span className={`text-[10px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 rounded ${claim.status === "pending" ? "bg-amber-100 text-amber-800" : claim.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                      {claim.status}
                                    </span>
                                    <span className={`text-[10px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 rounded ${isExpired ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>
                                      {isExpired ? "SLA EXPIRED (>48H)" : "VALID SLA (≤48H)"}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <span className="block text-[9px] font-sans text-black/60 uppercase tracking-widest mb-0.5">Buyer Details</span>
                                      <span className="block text-sm font-sans font-medium text-black">{claim.buyerName}</span>
                                      <span className="block text-xs font-mono text-black">{claim.email}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[9px] font-sans text-black/60 uppercase tracking-widest mb-0.5">Item Ordered</span>
                                      <span className="block text-sm font-sans font-bold text-black">{claim.perfumeAndSize || claim.perfumeOrdered}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                  <span className="block text-[9px] font-sans text-black/60 uppercase tracking-widest">Attached Proof</span>
                                  {(claim.proofImage || claim.imageProof) ? (
                                    <div className="w-full">
                                      <a href={claim.proofImage || claim.imageProof} target="_blank" rel="noreferrer" className="block text-xs font-bold font-sans text-amber-700 hover:underline mb-2 uppercase tracking-widest">
                                        View Full Image
                                      </a>
                                      <img 
                                        src={claim.proofImage || claim.imageProof} 
                                        alt="Claim Proof" 
                                        className="w-full max-h-64 object-contain rounded border border-neutral-700 bg-black" 
                                        onError={(e) => { e.currentTarget.src=''; e.currentTarget.alt='Invalid or Corrupted Image'; }}
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-xs font-mono text-stone-500 italic">No image provided</span>
                                  )}
                                </div>
                                
                                {claim.status === "pending" && (
                                  <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-4 pt-4 border-t border-black/5">
                                    <button
                                      onClick={() => updateClaimStatus(claim.id, "approved")}
                                      className="flex-1 bg-[#111111] hover:bg-[#1A1A1A] text-white py-2.5 text-[9px] font-sans tracking-[0.1em] uppercase font-bold rounded shadow-sm transition-colors"
                                    >
                                      APPROVE REPLACEMENT (CHARGE RE-DISPATCH FEE)
                                    </button>
                                    <button
                                      onClick={() => updateClaimStatus(claim.id, "rejected")}
                                      className="flex-1 bg-[#FFFFFF] hover:bg-red-50 text-black border border-red-200 py-2.5 text-[9px] font-sans tracking-[0.1em] uppercase font-bold rounded shadow-sm transition-colors"
                                    >
                                      REJECT CLAIM (PAST 48-HOUR MARK)
                                    </button>
                                  </div>
                                )}
                              </div>
                            ); })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cross-Sell up-sell recommendation modal */}
      <AnimatePresence>
        {crossSellRecommendation.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCrossSellRecommendation(prev => ({ ...prev, isOpen: false }))}
              className="fixed inset-0 bg-[#FFFFFF]/75  z-40"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-[#FFFFFF] border border-stone-200 text-black   max-w-md w-full z-50 max-h-[85vh] flex flex-col overflow-hidden p-5 sm:p-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setCrossSellRecommendation(prev => ({ ...prev, isOpen: false }))}
                className="absolute right-4 top-4 text-black hover:text-white p-1 transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Success Section */}
              <div 
                style={{
                  opacity: Math.max(0, 1 - recommendationScrollTop / 80),
                  transform: `translateY(${-Math.min(20, recommendationScrollTop * 0.25)}px)`,
                  maxHeight: recommendationScrollTop >= 80 ? "0px" : `${Math.max(0, 110 - recommendationScrollTop * 1.375)}px`,
                  marginBottom: recommendationScrollTop >= 80 ? "0px" : `${Math.max(0, 16 - recommendationScrollTop * 0.2)}px`,
                  pointerEvents: recommendationScrollTop > 40 ? "none" : "auto",
                }}
                className="text-center flex-shrink-0 overflow-hidden transition-all duration-150 ease-out"
              >
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-700 -full flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-black  text-base">Added to Cart!</h3>
                <p className="text-[11px] text-black font-mono tracking-wide mt-1 truncate max-w-full px-2.5 bg-stone-50 py-1  inline-block">
                  {crossSellRecommendation.addedItemName}
                </p>
              </div>

              {/* Divider */}
              <div 
                style={{
                  opacity: Math.max(0, 1 - recommendationScrollTop / 80),
                  height: recommendationScrollTop >= 80 ? "0px" : "1px",
                  marginTop: recommendationScrollTop >= 80 ? "0px" : "12px",
                  marginBottom: recommendationScrollTop >= 80 ? "0px" : "12px",
                }}
                className="border-t border-stone-200 flex-shrink-0 transition-all duration-150 ease-out" 
              />

              {/* Recommendations Section - Fully Scrollable */}
              <div 
                onScroll={(e) => setRecommendationScrollTop(e.currentTarget.scrollTop)}
                className="flex-1 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent"
              >
                <span className="block text-[9px] font-sans tracking-[0.15em] uppercase tracking-widest text-black text-center mb-3 sticky top-0 bg-[#FFFFFF] py-1 z-10">
                  You Might Want To Consider Adding:
                </span>

                <div className="space-y-2.5">
                  {crossSellRecommendation.recommendedPerfumes.map((perfume) => {
                    // Determine available sizes for buttons
                    const sizes = [
                      { key: "5ml Normal", label: "5ml" },
                      { key: "10ml", label: "10ml" }
                    ].filter(sizeObj => !perfume.disabledSizes?.includes(sizeObj.key));

                    return (
                      <div key={perfume.id} className="bg-stone-50 border border-stone-200 p-2.5  flex items-center justify-between gap-3 hover:border-stone-700 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 -full bg-gradient-to-br ${perfume.color} flex-shrink-0 flex items-center justify-center border border-white/5`}>
                            <span className="text-[8px] font-mono text-black /50 font-bold uppercase">
                              {perfume.brand.substring(0, 2)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-sans font-bold text-black  text-xs leading-tight truncate">
                              {perfume.name}
                            </h4>
                            <span className="text-[9px] font-mono text-black uppercase tracking-widest block mt-0.5">
                              {perfume.brand}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          {sizes.map((sizeObj) => {
                            const price = perfume.prices[sizeObj.key as keyof typeof perfume.prices];
                            const added = cart.some(item => item.id === perfume.id && item.size === sizeObj.key);
                            return (
                              <button
                                key={sizeObj.key}
                                type="button"
                                disabled={added}
                                onClick={() => {
                                  handleAddToCart(perfume, sizeObj.key as any, 1, true);
                                  setCrossSellRecommendation(prev => ({
                                    ...prev,
                                    addedItemName: `${perfume.brand} ${perfume.name} {sizeObj.label}`
                                  }));
                                }}
                                className={`px-2 py-1 border font-sans text-[10px] uppercase font-bold  transition-all flex flex-col items-center justify-center min-w-[50px] ${
                                  added 
                                    ? "bg-emerald-950/45 border-emerald-900/40 text-emerald-700 cursor-default" 
                                    : "bg-stone-850 hover:bg-black hover:text-white border-stone-200 hover:border-transparent text-white cursor-pointer"
                                }`}
                              >
                                <span className="text-[8px] font-medium tracking-tight">
                                  {added ? "In Cart" : sizeObj.label}
                                </span>
                                <span className="text-[8px] mt-0.5 opacity-90 font-bold">₹{price}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer actions */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setCrossSellRecommendation(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-2.5 bg-[#FFFFFF] hover:bg-stone-850 border border-stone-200 hover:border-stone-700 text-black hover:text-black   text-xs font-sans tracking-[0.15em] uppercase tracking-wider transition-all cursor-pointer"
                >
                  Continue Browsing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCrossSellRecommendation(prev => ({ ...prev, isOpen: false }));
                    setIsCartOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-black hover:bg-amber-450 text-white  text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer text-center  shadow-amber-gold/5"
                >
                  View My Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quiz List Explorer Modal */}
      <AnimatePresence>
        {isQuizListOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuizListOpen(false)}
              className="fixed inset-0 bg-[#FFFFFF]/75  z-40"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-[#FFFFFF] border border-stone-200 text-black   max-w-4xl w-full z-50 overflow-hidden p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsQuizListOpen(false)}
                className="absolute right-4 top-4 text-black hover:text-white p-1.5 transition-colors cursor-pointer -full hover:bg-stone-800/50"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div 
                style={{
                  opacity: Math.max(0, 1 - quizScrollTop / 100),
                  transform: `translateY(${-Math.min(25, quizScrollTop * 0.25)}px)`,
                  maxHeight: quizScrollTop >= 100 ? "0px" : `${Math.max(0, 150 - quizScrollTop * 1.5)}px`,
                  marginBottom: quizScrollTop >= 100 ? "0px" : `${Math.max(0, 32 - quizScrollTop * 0.32)}px`,
                  pointerEvents: quizScrollTop > 50 ? "none" : "auto",
                }}
                className="text-center overflow-hidden transition-all duration-150 ease-out"
              >
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 -full flex items-center justify-center mx-auto mb-3 border border-amber-500/20 shadow-inner">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-sans font-bold text-black  text-2xl">Sensory Profiling Center</h3>
                <p className="text-xs text-black font-mono tracking-wider mt-1 uppercase">
                  Select a test to decode your unique olfactive fingerprint
                </p>
              </div>

              {/* Quiz Grid */}
              <div 
                onScroll={(e) => setQuizScrollTop(e.currentTarget.scrollTop)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] md:max-h-[55vh] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent"
              >
                {/* Quiz 1: Anti-Quiz */}
                <div className="bg-stone-50 border border-stone-200 p-5  hover:border-emerald-500/30 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-wider text-emerald-700 font-bold bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 -full">
                        01 / SYSTEM v2
                      </span>
                      <span className="text-[10px] font-mono text-black font-semibold uppercase">
                        DEALBREAKER FILTER
                      </span>
                    </div>
                    <h4 className="font-sans font-bold text-black  text-lg group-hover:text-black transition-colors mb-2">
                      The Scent Anti-Quiz
                    </h4>
                    <p className="text-xs text-black leading-relaxed font-sans mb-5">
                      Identify exactly what notes and profiles you detest. We'll filter out matching decants with surgical precision so you only explore what you genuinely love.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuizListOpen(false);
                      setIsAntiQuizOpen(true);
                    }}
                    className="w-full bg-stone-800 hover:bg-emerald-600 text-white hover:text-white  py-2.5  text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-bold border border-stone-750 hover:border-transparent"
                  >
                    <span>Launch Anti-Quiz</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quiz 2: Lifestyle Grid */}
                <div className="bg-stone-50 border border-stone-200 p-5  hover:border-indigo-500/30 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-wider text-indigo-400 font-bold bg-indigo-950/30 border border-indigo-900/30 px-2 py-0.5 -full">
                        02 / VIBE MATCH
                      </span>
                      <span className="text-[10px] font-mono text-black font-semibold uppercase">
                        AESTHETIC GRID
                      </span>
                    </div>
                    <h4 className="font-sans font-bold text-black  text-lg group-hover:text-black transition-colors mb-2">
                      Lifestyle Aesthetic Grid
                    </h4>
                    <p className="text-xs text-black leading-relaxed font-sans mb-5">
                      Align your fragrance with your daily routine, wardrobe vibe, and favorite environments. Perfect for establishing an effortless, everyday signature.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuizListOpen(false);
                      setIsAestheticQuizOpen(true);
                    }}
                    className="w-full bg-stone-800 hover:bg-indigo-600 text-white hover:text-white  py-2.5  text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-bold border border-stone-750 hover:border-transparent"
                  >
                    <span>Launch Lifestyle Grid</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quiz 3: Chemical Chords */}
                <div className="bg-stone-50 border border-stone-200 p-5  hover:border-amber-500/30 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-wider text-amber-400 font-bold bg-amber-950/30 border border-amber-900/30 px-2 py-0.5 -full">
                        03 / CHEM-STORY
                      </span>
                      <span className="text-[10px] font-mono text-black font-semibold uppercase">
                        OLFACTORY CHORDS
                      </span>
                    </div>
                    <h4 className="font-sans font-bold text-black  text-lg group-hover:text-black transition-colors mb-2">
                      Chemical Chords & Notes
                    </h4>
                    <p className="text-xs text-black leading-relaxed font-sans mb-5">
                      Explore the base chords and molecular note pairings citrus, woody, warm, leather. Find the ideal chemistry that matches your mood and environment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuizListOpen(false);
                      setIsChordQuizOpen(true);
                    }}
                    className="w-full bg-stone-800 hover:bg-amber-600 text-white hover:text-white py-2.5  text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-bold border border-stone-750 hover:border-transparent"
                  >
                    <span>Launch Chords Quiz</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quiz 4: Scent Battle */}
                <div className="bg-stone-50 border border-stone-200 p-5  hover:border-rose-500/30 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-wider text-rose-700 font-bold bg-rose-950/30 border border-rose-900/30 px-2 py-0.5 -full">
                        04 / BRACKET
                      </span>
                      <span className="text-[10px] font-mono text-black font-semibold uppercase">
                        TOURNAMENT DUEL
                      </span>
                    </div>
                    <h4 className="font-sans font-bold text-black  text-lg group-hover:text-black transition-colors mb-2">
                      The Ultimate Scent Battle
                    </h4>
                    <p className="text-xs text-black leading-relaxed font-sans mb-5">
                      Put your potential favorites head-to-head in a gamified bracket tournament. Vote on match-ups to isolate and discover your perfect premium champion.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuizListOpen(false);
                      setIsScentBattleOpen(true);
                    }}
                    className="w-full bg-stone-800 hover:bg-rose-600 text-white hover:text-white  py-2.5  text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-bold border border-stone-750 hover:border-transparent"
                  >
                    <span>Launch Scent Battle</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AntiQuiz
        isOpen={isAntiQuizOpen}
        onClose={() => setIsAntiQuizOpen(false)}
        onAddToCart={handleAddToCart}
        stock={stock}
      />

      <AestheticQuiz
        isOpen={isAestheticQuizOpen}
        onClose={() => setIsAestheticQuizOpen(false)}
        onAddToCart={handleAddToCart}
        stock={stock}
      />

      <ChordQuiz
        isOpen={isChordQuizOpen}
        onClose={() => setIsChordQuizOpen(false)}
        onAddToCart={handleAddToCart}
        stock={stock}
      />

      <ScentBattle
        isOpen={isScentBattleOpen}
        onClose={() => setIsScentBattleOpen(false)}
        onAddToCart={handleAddToCart}
        stock={stock}
      />

      {/* Policy Modal */}
      <AnimatePresence>
        {policyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setPolicyModal(null)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#F7F7F5] border border-black/5 text-black rounded-3xl shadow-2xl max-w-2xl w-full z-50 overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-black/5">
                <h2 className="text-xl font-sans font-bold text-black">
                  {POLICIES[policyModal].title}
                </h2>
                <button
                  onClick={() => setPolicyModal(null)}
                  className="text-black hover:text-black transition-colors cursor-pointer p-2 bg-stone-200/50 hover:bg-stone-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
                {POLICIES[policyModal].content.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-black mb-3">
                      {section.subtitle}
                    </h3>
                    <p className="text-sm font-sans text-black leading-relaxed whitespace-pre-line">
                      {section.text}
                    </p>
                  </div>
                ))}
                
                {policyModal === "returns" && (
                  <div className="pt-8 border-t border-black/5 mt-8">
                    <button
                      onClick={() => {
                        setPolicyModal(null);
                        setIsClaimFormOpen(true);
                      }}
                      className="w-full bg-[#111111] hover:bg-[#1A1A1A] text-white transition-all duration-300 px-8 py-4 text-[11px] font-sans tracking-[0.2em] uppercase font-medium cursor-pointer shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                    >
                      FILE A CLAIM
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shipping Claims Modal */}
      <ClaimFormModal 
        isOpen={isClaimFormOpen} 
        onClose={() => setIsClaimFormOpen(false)} 
        onSubmitSuccess={fetchAdminComplaints}
        availableSkus={
          (() => {
            const skus: string[] = [];
            CATALOG_DATA.forEach(f => {
              ["10ml", "5ml Normal", "5ml HQ"].forEach(size => {
                skus.push(`${f.name} - ${size}`);
              });
            });
            BUNDLE_DATA.forEach(b => {
              skus.push(`${b.name} Bundle`);
            });
            return skus;
          })()
        }
      />

        {/* Footer */}
        <footer className="mt-auto border-t border-black/10 bg-[#F4F4F2] py-8 z-10 relative">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-neutral-600">
            <button onClick={() => setPolicyModal("terms")} className="hover:text-black transition-colors cursor-pointer">Terms</button>
            <button onClick={() => setPolicyModal("privacy")} className="hover:text-black transition-colors cursor-pointer">Privacy</button>
            <button onClick={() => setPolicyModal("returns")} className="hover:text-black transition-colors cursor-pointer">Refund</button>
            <a 
              href="https://velyx-waitlist.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-black transition-colors cursor-pointer"
            >
              VELYX
            </a>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-black transition-colors cursor-pointer ml-auto">Admin</button>
          </div>
        </footer>
      
    </div>
  );
}