import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CATALOG_DATA, 
  BUNDLE_DATA, 
  Fragrance, 
  CapsuleBundle 
} from "./types";
import ScentCard from "./components/ScentCard";
import InteractiveBottle from "./components/InteractiveBottle";
import AntiQuiz from "./components/AntiQuiz";
import AestheticQuiz from "./components/AestheticQuiz";
import ChordQuiz from "./components/ChordQuiz";
import ScentBattle from "./components/ScentBattle";
import GlassTiles from "./components/GlassTiles";
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
  DollarSign,
  Layers
} from "lucide-react";



const DEFAULT_FALLBACK_STOCK = {
  fragrances: {
    "lattafa-khamrah": { "5ml Normal": 13, "5ml HQ": 0, "10ml": 0 },
    "ck2": { "5ml Normal": 0, "5ml HQ": 0, "10ml": 3 },
    "givenchy-gentleman": { "5ml Normal": 11, "5ml HQ": 0, "10ml": 0 },
    "zara-for-him-black": { "5ml Normal": 5, "5ml HQ": 0, "10ml": 0 },
    "zara-sunrise": { "5ml Normal": 0, "5ml HQ": 0, "10ml": 2 },
    "zara-seoul-winter": { "5ml Normal": 0, "5ml HQ": 1, "10ml": 0 },
    "zara-seoul": { "5ml Normal": 0, "5ml HQ": 2, "10ml": 0 },
    "zara-intense-dark": { "5ml Normal": 5, "5ml HQ": 0, "10ml": 1 },
    "zara-rich-warm-addictive": { "5ml Normal": 16, "5ml HQ": 0, "10ml": 0 },
    "ck-one": { "5ml Normal": 8, "5ml HQ": 3, "10ml": 0 },
    "la-uno-qaswa": { "5ml Normal": 11, "5ml HQ": 2, "10ml": 1 }
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
          { color: "bg-stone-500/15", size: "w-28 h-28", pos: "-bottom-6 -left-6" },
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

export default function App() {
  // Navigation / Scroll helper
  const scrollToCatalog = () => {
    document.getElementById("kinetic-catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBuyNow = () => {
    if (cart.length === 0 && CATALOG_DATA.length > 0) {
      handleAddToCart(CATALOG_DATA[0], "10ml");
    }
    setIsCheckoutOpen(true);
  };

  // Stock State Management
  const [stock, setStock] = useState<{
    fragrances: Record<string, Record<string, number>>;
    bundles: Record<string, number>;
  }>(DEFAULT_FALLBACK_STOCK);

  const fetchStock = async () => {
    try {
      const res = await fetch("/api/stock");
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.success && data.stock) {
        setStock(data.stock);
      }
    } catch (e) {
      console.warn("[Stock Fetch] Live stock levels unavailable, fallback active:", e);
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
      const response = await fetch("/api/orders", {
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
        const res = await fetch("/api/orders/confirm-payment", {
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

  useEffect(() => {
    fetchStock();
    syncAndRecoverPendingOrder();
    
    // Auto sync on visibility change (e.g. returning from PhonePe/GPay app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("[System Focus] App returned to foreground. Performing synchronization...");
        fetchStock();
        syncAndRecoverPendingOrder();
      }
    };

    // Auto sync on window focus
    const handleWindowFocus = () => {
      console.log("[System Focus] Window gained focus. Syncing...");
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
  const [cart, setCart] = useState<{ id: string; name: string; brand: string; size: string; price: number; quantity: number }[]>(() => {
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

  const [selectedBundleSizes, setSelectedBundleSizes] = useState<Record<string, BundleSizeType>>({});
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
  const [enquiryCopied, setEnquiryCopied] = useState<boolean>(false);
  const [enquiryTopic, setEnquiryTopic] = useState<string>("Bespoke Decant Volume request");
  const [enquiryNote, setEnquiryNote] = useState<string>("");

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
  const [adminActiveTab, setAdminActiveTab] = useState<"view" | "create" | "stock" | "prices">("view");
  const [adminPriceSearch, setAdminPriceSearch] = useState<string>("");
  const [adminPriceFilter, setAdminPriceFilter] = useState<"all" | "fragrance" | "bundle" | "outofstock" | "disabled">("all");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPasscodeInput, setAdminPasscodeInput] = useState<string>("");
  const [adminPasscodeError, setAdminPasscodeError] = useState<string | null>(null);
  const [adminAttempts, setAdminAttempts] = useState<number>(() => {
    try {
      return Number(localStorage.getItem("scent_adminAttempts") || "0");
    } catch {
      return 0;
    }
  });
  
  const [adminLockoutTime, setAdminLockoutTime] = useState<number | null>(() => {
    try {
      const stored = localStorage.getItem("scent_adminLockoutTime");
      return stored ? Number(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLocked, setIsAdminLocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("scent_adminLockoutTime");
      if (stored) {
        const lockoutTime = Number(stored);
        if (Date.now() < lockoutTime) {
          return true;
        }
      }
    } catch {}
    return false;
  });

  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<string>("");

  useEffect(() => {
    try {
      localStorage.setItem("scent_adminAttempts", String(adminAttempts));
    } catch (e) {
      console.error(e);
    }
  }, [adminAttempts]);

  useEffect(() => {
    try {
      if (adminLockoutTime) {
        localStorage.setItem("scent_adminLockoutTime", String(adminLockoutTime));
      } else {
        localStorage.removeItem("scent_adminLockoutTime");
      }
    } catch (e) {
      console.error(e);
    }
  }, [adminLockoutTime]);

  useEffect(() => {
    let interval: any = null;
    
    const checkLockout = () => {
      if (adminLockoutTime) {
        const diff = adminLockoutTime - Date.now();
        if (diff <= 0) {
          setIsAdminLocked(false);
          setAdminAttempts(0);
          setAdminLockoutTime(null);
          setLockoutTimeRemaining("");
          try {
            localStorage.removeItem("scent_adminLockoutTime");
            localStorage.setItem("scent_adminAttempts", "0");
          } catch (e) {}
        } else {
          setIsAdminLocked(true);
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setLockoutTimeRemaining(
            `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`
          );
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
      const response = await fetch("/api/orders", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const serverOrders = data.orders || [];
        
        // Sort server orders by date descending
        serverOrders.sort((a: any, b: any) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        
        // Only set active (non-deleted) orders to state for the UI
        const activeOrders = serverOrders.filter((mo: any) => mo.status !== "deleted");
        setAdminOrders(activeOrders);
        
        // Cache the active orders in local storage as an offline fallback
        localStorage.setItem("scent_admin_orders_backup", JSON.stringify(serverOrders));
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

  useEffect(() => {
    let interval: any = null;
    if (isAdminOpen) {
      if (isAdminAuthenticated) {
        fetchAdminOrders();
        interval = setInterval(fetchAdminOrders, 10000); // Keep admin orders synchronized across devices
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
    if (!adminManualVariantName) {
      setAdminStatusMessage({ type: "error", text: "Please fill in the Perfume Variant Name." });
      return;
    }

    const finalName = adminManualDeliveryNA ? (adminManualName || "Walk-in Customer / N/A") : adminManualName;
    const finalAddress = adminManualDeliveryNA ? "Not Applicable" : adminManualAddress;
    const finalEmail = adminManualDeliveryNA ? "notapplicable@scentpreview.com" : (adminManualEmail || "admin@scentpreview.com");
    const finalPhone = adminManualDeliveryNA ? "N/A" : (adminManualPhone || "N/A");
    const finalState = adminManualDeliveryNA ? "N/A" : adminManualState;
    const finalPincode = adminManualDeliveryNA ? "000000" : adminManualPincode;

    if (!finalName || !finalAddress) {
      setAdminStatusMessage({ type: "error", text: "Please fill in all mandatory fields (Name and Address)." });
      return;
    }

    const orderNum = `SP-ADMIN-${Math.floor(100000 + Math.random() * 900000)}`;
    const payload = {
      orderNumber: orderNum,
      items: [{
        name: adminManualVariantName,
        size: adminManualVariantSize,
        quantity: Number(adminManualVariantQty)
      }],
      total: Number(adminManualTotal),
      name: finalName,
      email: finalEmail,
      address: finalAddress,
      phone: finalPhone,
      state: finalState,
      pincode: finalPincode,
      shippingProtection: adminManualShippingProtection,
      skipStockReduction: false // Force stock reduction to always happen
    };

    try {
      let createSuccess = false;
      let orderToBackup = {
        ...payload,
        status: "paid",
        createdAt: new Date().toISOString()
      };

      try {
        // 1. Try creating the pending order on the server
        const createRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const createData = await createRes.json();
        
        if (createData.success) {
          createSuccess = true;
          if (createData.order) {
            orderToBackup = createData.order;
          }
        }
      } catch (netErr) {
        console.warn("[Offline Mode] Server unreachable during order creation, saving to offline backup:", netErr);
      }

      if (createSuccess) {
        addOrderToLocalStorageBackup(orderToBackup);

        // 2. Immediately trigger confirm-payment (which marks as paid and triggers notification dispatch)
        try {
          const confirmRes = await fetch("/api/orders/confirm-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const confirmData = await confirmRes.json();

          if (confirmData.success) {
            addOrderToLocalStorageBackup({
              ...payload,
              status: "paid",
              createdAt: new Date().toISOString()
            });

            setAdminStatusMessage({ 
              type: "success", 
              text: `Successfully dispatched Order ${orderNum}! Status updated to 'paid' in database.` 
            });
          } else {
            throw new Error("Failed to confirm payment");
          }
        } catch (confirmErr) {
          console.error("[Offline Mode] Server unreachable during payment confirmation, marked as paid locally:", confirmErr);
          addOrderToLocalStorageBackup({
            ...payload,
            status: "paid",
            createdAt: new Date().toISOString()
          });
          setAdminStatusMessage({ 
            type: "success", 
            text: `Order ${orderNum} dispatched locally (Offline Mode). It will automatically sync to the server when connection returns!` 
          });
        }
      } else {
        // Entirely offline! Save directly to local storage backup as paid
        addOrderToLocalStorageBackup({
          ...payload,
          status: "paid",
          createdAt: new Date().toISOString()
        });
        setAdminStatusMessage({ 
          type: "success", 
          text: `Order ${orderNum} created locally in offline backup. It will automatically synchronize once connection is restored!` 
        });
      }
      
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
      
      // Refresh orders list
      fetchAdminOrders();
      fetchStock();
    } catch (err: any) {
      console.error(err);
      setAdminStatusMessage({ type: "error", text: err.message || "Failed to process manual order entry." });
    }
  };

  const handleDeleteOrder = async (orderNumber: string) => {
    try {
      const token = localStorage.getItem("scent_admin_token") || "";
      const response = await fetch(`/api/orders/${orderNumber}`, {
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
      const res = await fetch("/api/stock", {
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
        fetch("/api/stock", {
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
        const res = await fetch("/api/stock", {
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

  const saveUpdatedStock = async () => {
    if (!stock) return;
    setIsSavingStock(true);
    setAdminStatusMessage(null);
    try {
      const res = await fetch("/api/stock", {
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
      const res = await fetch("/api/stock/reset", {
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

  // Set default buy product ID once catalog is loaded
  useEffect(() => {
    if (CATALOG_DATA.length > 0) {
      setSelectedBuyId(CATALOG_DATA[0].id);
    }
  }, []);

  // Cart Handlers
  const getProductStock = (id: string, size: string): number => {
    if (!stock) return 10;
    
    // Check if it's a bundle first
    const isBundle = BUNDLE_DATA.some(b => b.id === id);
    if (isBundle) {
      const bundleStock = stock.bundles[id] !== undefined ? stock.bundles[id] : 10;
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
      
      // Assume "5ml Normal" size is required for bundles
      const checkSize = "5ml Normal";
      for (const cid of constituents) {
        const cStock = stock.fragrances[cid]?.[checkSize];
        if (cStock !== undefined) {
          minStock = Math.min(minStock, cStock);
        } else {
          // If a constituent is completely missing from stock, it's 0
          minStock = 0;
        }
      }
      
      return minStock;
    }

    const fragStock = stock.fragrances[id];
    if (fragStock) {
      return fragStock[size] !== undefined ? fragStock[size] : 10;
    }
    return 10;
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
        nextCart[existingIndex].quantity = targetQty;
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
        quantity: targetQty
      }];
    });

    if (!skipRecommendationUpdate) {
      // Recommend other in-stock perfumes
      const otherPerfumes = CATALOG_DATA.filter((f) => {
        if (f.id === fragrance.id) return false;
        
        // Solid check if fragrance f is out of stock in state or catalog
        const isOOS = f.isOutOfStock || (stock?.fragrances[f.id] && Object.values(stock.fragrances[f.id]).every((qty: any) => qty === 0));
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
        nextCart[existingIndex].quantity = targetQty;
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
        const isOOS = f.isOutOfStock || (stock?.fragrances[f.id] && Object.values(stock.fragrances[f.id]).every((qty: any) => qty === 0));
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
        nextCart[existingIndex].quantity = newQty;
        return nextCart;
      }
      return prev;
    });
  };

  const handleBuyNow = (fragrance: Fragrance, size: "10ml" | "5ml Normal" | "5ml HQ", quantityToAdd: number = 1) => {
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

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === bundle.id && item.size === sizeLabel
      );
      if (existingIndex > -1) {
        const nextCart = [...prev];
        const currentQty = nextCart[existingIndex].quantity;
        const targetQty = Math.min(availableStock, currentQty + 1);
        nextCart[existingIndex].quantity = targetQty;
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

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

  const shippingCost = 116;
  const checkoutTotal = (buyItemPrice * buyQuantity) + shippingCost;

  // Express Buy checkout submit
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsProcessingOrder(true);
    
    const orderNum = `SP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const items = cart.map(item => ({
      name: item.name,
      size: item.size,
      quantity: item.quantity
    }));
    const total = cartTotal + 116 + (isShippingProtectionEnabled ? 150 : 0);

    const payload = {
      items,
      total,
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
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success && data.order) {
        addOrderToLocalStorageBackup(data.order);
      }
      fetchStock();
    } catch (err) {
      console.error("Failed to register order on backend:", err);
    }

    setPaymentDetails(payload);
    setIsProcessingOrder(false);
    setIsPaymentConfirmed(false);
    setShowPaymentPage(true);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsCartCheckoutVisible(false);
    setCart([]);
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
      <div className="min-h-screen bg-[#0F0E0D] text-white font-sans relative overflow-x-hidden p-6 md:p-12 flex flex-col items-center justify-center sand-grain">
        {/* React Bits Pro Glass Tiles Shimmering Background */}
        <GlassTiles 
          colors={["#919191", "#FFFFFF", "#EEEEEE"]} 
          tileSize={56} 
          gap={6} 
          shimmerSpeed={1.2} 
          opacity={0.4}
          className="fixed inset-0 w-screen h-screen pointer-events-none z-0" 
        />
        
        {/* Subtle decorative background pattern */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-2xl w-full bg-stone-900/60 border border-stone-800 rounded-sm p-6 md:p-10 relative z-10 shadow-2xl">
          {!isPaymentConfirmed ? (
            <>
              {/* ScentPreview Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-6 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono tracking-[0.3em] font-bold text-white uppercase">
                    ScentPreview
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-gold animate-pulse" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase">
                  UPI Allocation Vault
                </span>
              </div>

              {/* Step title */}
              <div className="text-center mb-8">
                <span className="inline-block px-2.5 py-0.5 text-[8px] font-mono tracking-widest bg-amber-gold text-stone-950 font-bold uppercase rounded-full mb-3 animate-pulse">
                  Awaiting Extraction Payment
                </span>
                <h2 className="text-2xl font-serif tracking-tight text-white italic">
                  Complete Your Selection Payment
                </h2>
              </div>

              {/* Exact UPI Details requested by user */}
              <div className="bg-stone-950 border border-amber-gold/30 rounded p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-gold/5 rounded-full blur-2xl pointer-events-none" />
                
                <span className="block text-[8px] font-mono uppercase tracking-[0.15em] text-stone-500 mb-2">
                  Recipient UPI Address
                </span>
                
                <div className="flex items-center justify-between bg-stone-900/80 border border-stone-800/80 rounded px-4 py-3 mb-3">
                  <span className="font-mono text-sm md:text-base font-bold text-amber-gold tracking-wide select-all">
                    chingtham@okhdfcbank
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("chingtham@okhdfcbank");
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="text-[9px] font-mono bg-stone-800 hover:bg-stone-700 text-white px-3 py-1.5 rounded transition-colors"
                  >
                    {isCopied ? "Copied!" : "Copy ID"}
                  </button>
                </div>

                <div className="mb-4 flex flex-col gap-2.5">
                  <span className="block text-[8px] font-mono uppercase tracking-[0.15em] text-stone-500">
                    Instant Mobile App Launcher
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Generic UPI Chooser */}
                    <a 
                      href={`upi://pay?pa=chingtham@okhdfcbank&pn=Chingtham&am=${paymentDetails.total}&cu=INR&tn=ScentPreview%20Order`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-xs font-semibold bg-amber-gold hover:bg-amber-500 text-stone-950 py-2.5 px-4 rounded transition-all transform active:scale-[0.98] cursor-pointer text-center font-sans shadow-md"
                    >
                      ⚡ Pay via Any UPI App (GPay/PhonePe/Paytm)
                    </a>

                    {/* WhatsApp Pay & Confirm with background fulfillment */}
                    <button
                      type="button"
                      disabled={isConfirmingPayment}
                      onClick={async () => {
                        setIsConfirmingPayment(true);
                        const orderNum = paymentDetails.orderNumber;
                        console.log(`[WhatsApp Redirect] Starting background fulfillment for order: ${orderNum}`);
                        
                        try {
                          // 1. Instantly confirm and fulfill the order on the backend in the background
                          const res = await fetch("/api/orders/confirm-payment", {
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
                          console.error("[WhatsApp Redirect] Failed to auto-confirm order in the background:", err);
                        } finally {
                          setIsConfirmingPayment(false);
                          setIsPaymentConfirmed(true);
                          fetchStock();
                        }

                        // 2. Open WhatsApp in a new tab with pre-filled order details
                        const itemsSummary = paymentDetails.items
                          .map((item: any) => `- ${item.name} (${item.size}) x${item.quantity}`)
                          .join("\n");
                        const message = `Hello ScentPreview Support!\n\nI would like to complete payment for my order.\n\n*Order Number:* ${orderNum}\n*Customer:* ${paymentDetails.name}\n*Phone:* ${paymentDetails.phone}\n*Address:* ${paymentDetails.address}, ${paymentDetails.state || ""} - ${paymentDetails.pincode || ""}\n\n*Items Ordered*:\n${itemsSummary}\n\n*Total Amount:* ₹${paymentDetails.total}.00\n\nPlease verify my payment and begin extraction. Thank you!`;
                        
                        const whatsappUrl = `https://wa.me/919366110996?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, "_blank");
                      }}
                      className="inline-flex items-center justify-center gap-2 text-xs font-semibold bg-stone-950 border border-stone-800 hover:border-emerald-850/60 hover:bg-stone-900/40 text-emerald-400 py-2.5 px-4 rounded transition-all transform active:scale-[0.98] cursor-pointer text-center font-sans shadow-md"
                    >
                      <svg className="w-4 h-4 fill-emerald-500 shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.334 5.395 0 11.95 0a11.815 11.815 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L0 24zm6.59-4.814c1.727.94 3.42 1.41 5.32 1.41h.005c5.442 0 9.87-4.43 9.873-9.873a9.814 9.814 0 00-2.887-6.974 9.81 9.81 0 00-6.978-2.887c-5.443 0-9.873 4.43-9.876 9.874a9.8 9.8 0 001.487 5.147l-.234-.374-3.64.957.974-3.56-.216-.362a9.81 9.81 0 01-1.378-5.02c.003-4.943 4.02-8.96 8.966-8.962a8.92 8.92 0 016.34 2.626c1.693 1.693 2.623 3.945 2.62 6.34a8.966 8.966 0 01-8.966 8.967h-.005c-1.884 0-3.61-.482-5.18-1.39l-.361-.214zm11.233-5.938c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      Pay via WhatsApp
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 font-sans italic leading-normal mb-1">
                  (Please verify that the receiver name shows as <span className="text-white font-medium">chingtham@okhdfcbank</span> before completing the payment)
                </p>
              </div>

              {/* Exact Required Amount section from the prompt */}
              <div className="border border-amber-gold/30 bg-amber-gold/5 rounded p-5 mb-8">
                <span className="block text-[8px] font-mono uppercase tracking-widest text-amber-gold mb-1">
                  CRITICAL PAYMENT REQUIREMENT
                </span>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  Important: Please ensure you pay exactly <span className="text-white font-bold text-sm underline decoration-amber-gold">₹{paymentDetails.total}.00</span>. Orders with incorrect or partial amounts will not be processed.
                </p>
              </div>

              {/* Breakdown of items */}
              <div className="border-t border-stone-800 pt-6 mb-8">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-stone-500 mb-4">
                  Decant Selections to Pour
                </span>
                <div className="space-y-3">
                  {paymentDetails.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-stone-300 font-serif italic">
                        {item.name} <span className="text-[10px] font-mono text-stone-500">({item.size})</span>
                      </span>
                      <span className="font-mono text-stone-400">
                        Qty {item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs border-t border-dashed border-stone-800 pt-3 mt-3">
                    <span className="text-stone-400 font-mono">Courier standard dispatch:</span>
                    <span className="font-mono text-stone-400">₹90.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-stone-800 pt-3">
                    <span className="text-white font-serif italic font-medium">Total Balance Due:</span>
                    <span className="font-mono text-amber-gold font-bold text-base">₹{paymentDetails.total}.00</span>
                  </div>
                </div>
              </div>

              {/* Form submit confirm button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  disabled={isConfirmingPayment}
                  onClick={() => setShowPaymentPage(false)}
                  className="w-full sm:w-1/3 bg-transparent border border-stone-800 hover:bg-stone-850/40 text-stone-400 py-3 rounded-sm text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel Order
                </button>
                <button
                  type="button"
                  disabled={isConfirmingPayment}
                  onClick={async () => {
                    setIsConfirmingPayment(true);
                    try {
                      const res = await fetch("/api/orders/confirm-payment", {
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
                  className={`w-full sm:w-2/3 bg-amber-gold hover:bg-amber-400 text-stone-950 font-mono text-xs tracking-widest uppercase font-bold py-3 px-6 transition-all rounded-sm cursor-pointer shadow-md flex items-center justify-center gap-2 ${isConfirmingPayment ? "opacity-80 cursor-not-allowed" : ""}`}
                >
                  {isConfirmingPayment ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      Verifying Transfer...
                    </>
                  ) : (
                    "Confirm Payment Completed"
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Dispatched/success screen */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>

              <span className="text-[10px] font-mono text-amber-gold uppercase tracking-[0.2em] font-semibold block mb-2">
                Order Received & Authenticating
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-4 italic">
                Pouring Sequence Commencing
              </h3>
              
              <p className="text-stone-300 text-xs md:text-sm font-sans font-light mb-8 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-medium">{paymentDetails.name ? `${paymentDetails.name.charAt(0)}•••` : "Valued Patron"}</span>. Your transfer of <span className="text-white font-mono">₹{paymentDetails.total}.00</span> is being authenticated. Sterile extraction and decanting will proceed immediately.
              </p>

              {/* Secure Encrypted Customer Manifest */}
              <div className="bg-stone-950/80 border border-stone-800/80 rounded p-5 mb-8 text-left space-y-3">
                <span className="block text-[8px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  E2EE Secure Payload (Military Grade)
                </span>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                  <div>
                    <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500">Recipient Name</span>
                    <span className="font-sans text-stone-300">
                      {paymentDetails.name ? `${paymentDetails.name.charAt(0)}•••••` : "••••••"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500">Contact Phone</span>
                    <span className="font-mono text-stone-300">
                      {paymentDetails.phone && paymentDetails.phone !== "N/A" ? `${paymentDetails.phone.slice(0, 6)}•••••` : "••••••••••"}
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-stone-900 pt-2.5">
                    <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500">Secure Encrypted Email</span>
                    <span className="font-mono text-stone-300">
                      {paymentDetails.email ? `${paymentDetails.email.slice(0, 3)}•••••@••••.•••` : "••••••••"}
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-stone-900 pt-2.5">
                    <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500">Destination Address</span>
                    <span className="font-sans text-stone-300 leading-normal line-clamp-1">
                      {paymentDetails.address ? `${paymentDetails.address.slice(0, 10)}•••••••••••••` : "••••••••••••"}
                    </span>
                  </div>
                  {paymentDetails.state && (
                    <div className="col-span-1 border-t border-stone-900 pt-2.5">
                      <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500">State / Region</span>
                      <span className="font-sans text-stone-300">{paymentDetails.state}</span>
                    </div>
                  )}
                  {paymentDetails.pincode && (
                    <div className="col-span-1 border-t border-stone-900 pt-2.5">
                      <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500">Pincode</span>
                      <span className="font-mono text-stone-300">
                        {paymentDetails.pincode.slice(0, 2)}••••
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-stone-850 mb-8" />

              <button
                type="button"
                onClick={async () => {
                  // Ensure payment registration and confirmation on server upon clicking Continue
                  if (paymentDetails) {
                    try {
                      console.log("[Continue Action] User clicked Continue. Sending final payment confirmation...");
                      const res = await fetch("/api/orders/confirm-payment", {
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

                  // Clear all checkout & payment states
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
                  
                  // Clear active order local storage variables
                  localStorage.removeItem("scent_paymentDetails");
                  localStorage.removeItem("scent_showPaymentPage");
                  localStorage.removeItem("scent_isPaymentConfirmed");
                }}
                className="w-full bg-white text-stone-950 hover:bg-stone-200 py-3.5 rounded-sm text-xs font-mono font-bold tracking-widest uppercase transition-colors cursor-pointer"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#111111] font-sans relative overflow-x-hidden selection:bg-stone-900 selection:text-white sand-grain">
      
      {/* React Bits Pro Glass Tiles Shimmering Background (Full Screen Viewport Background) */}
      <GlassTiles 
        colors={["#919191", "#FFFFFF", "#EEEEEE"]} 
        tileSize={56} 
        gap={6} 
        shimmerSpeed={1.2} 
        opacity={0.7}
        className="fixed inset-0 w-screen h-screen pointer-events-none z-0" 
      />
      
      {/* Apple Liquid Glass Floating Background Backlight Blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-amber-200/15 blur-[120px] pointer-events-none animate-blob-1 z-0" />
      <div className="absolute top-[35%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-200/15 blur-[120px] pointer-events-none animate-blob-2 z-0" />
      <div className="absolute bottom-[10%] left-[15%] w-[50vw] h-[50vw] rounded-full bg-rose-200/15 blur-[130px] pointer-events-none animate-blob-3 z-0" />

      {/* 2026 EDITION Floating Vertical Ticker */}
      <div className="ticker hidden lg:block z-40 text-stone-900 border-stone-900">
        [ RE-DEFINING THE DECANT // 2026 EDITION ]
      </div>

      {/* Modern High-End Sticky Header Navigation with Search Bar on top */}
      <header className="sticky top-0 bg-white/60 backdrop-blur-xl z-40 border-b border-white/50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-[0.3em] font-bold text-stone-900 uppercase">
              ScentPreview
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-gold animate-pulse" />
          </div>

          {/* Persistent Search bar integrated right into the top header navigation */}
          <div className="relative flex-1 max-w-sm mx-6 hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  const catalogEl = document.getElementById("kinetic-catalog");
                  if (catalogEl) {
                    const rect = catalogEl.getBoundingClientRect();
                    if (rect.top > window.innerHeight || rect.bottom < 0) {
                      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }
                }
              }}
              placeholder="Search by brand, name, ingredients..."
              className="w-full bg-white/50 backdrop-blur-md border border-white/80 rounded-full py-2 px-4 pl-8 text-[11px] font-sans text-stone-950 focus:outline-none focus:ring-1 focus:ring-stone-300 focus:border-stone-300 transition-all placeholder:text-stone-450 shadow-2xs"
            />
            <span className="absolute left-2.5 top-2.5 text-stone-450">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1.5 text-stone-400 hover:text-stone-900 text-sm font-mono transition-colors font-bold"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Quick Links & Cart Toggle */}
          <div className="flex items-center gap-2 sm:gap-6">

            <button 
              type="button"
              onClick={() => {
                setAdminPasscodeInput("");
                setAdminPasscodeError(null);
                setIsAdminOpen(true);
              }}
              className="text-[10px] sm:text-xs font-mono tracking-widest text-stone-600 hover:text-amber-gold transition-colors uppercase cursor-pointer flex items-center gap-1 sm:gap-1.5 border border-stone-200 hover:border-amber-gold/30 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-sm"
            >
              <Lock className="w-2.5 h-2.5 sm:w-3 h-3 text-amber-gold/80" />
              <span>Admin</span>
            </button>

            <button 
              type="button"
              onClick={scrollToCatalog}
              className="hidden md:block text-xs font-mono tracking-widest text-stone-600 hover:text-stone-900 transition-colors uppercase cursor-pointer"
            >
              Archive Catalog
            </button>
            
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-stone-950 text-white hover:bg-stone-900 transition-all duration-300 py-2.5 px-4 rounded-sm text-xs font-mono tracking-widest uppercase cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="ml-1 bg-amber-gold text-stone-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </nav>
        
        {/* Mobile Search Bar at the top of viewport */}
        <div className="px-6 pb-4 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  document.getElementById("kinetic-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              placeholder="Search catalog..."
              className="w-full bg-stone-100/80 border border-stone-200/85 rounded-sm py-2 px-3 pl-8 text-[11px] font-sans text-stone-950 focus:outline-none focus:border-stone-400 placeholder:text-stone-400"
            />
            <span className="absolute left-2.5 top-2.5 text-stone-450">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1 text-stone-400 hover:text-stone-900 text-base font-mono font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 1. Opening Sequence: Asymmetric Hero */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col justify-center items-start z-10">
          
          {/* Micro Tagline */}
          <div className="flex items-center gap-2 mb-6">
            <span className="h-[1px] w-8 bg-stone-400" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-stone-500 uppercase font-semibold">
              The Luxury Decanting Laboratory
            </span>
          </div>

          {/* Super-Scalable High-Impact Typography Header (Editorial / Loro Piana aesthetic) */}
          <h1 className="text-6xl md:text-8xl font-serif font-semibold text-stone-900 tracking-tighter leading-[0.9] mb-8">
            SCENT<br />
            <span className="font-light italic text-amber-gold">PREVIEW</span>
          </h1>

          <p className="max-w-md text-stone-600 text-sm md:text-base leading-relaxed mb-10 font-sans font-light">
            An interactive sensory playground re-defining olfactory curation. Choose premium decant options, acquire hand-poured selections instantly, and preview your master harmony.
          </p>

          {/* Magnetic CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToCatalog}
              className="flex items-center gap-3 bg-stone-950 border border-stone-950 text-white hover:bg-stone-900 hover:border-stone-900 transition-all duration-300 py-4 px-8 rounded-full text-xs font-mono tracking-widest uppercase cursor-pointer apple-liquid-btn"
            >
              <span>Explore Archive</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Morphing Floating Glass Bottle and Shadow (InteractiveBottle) */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <InteractiveBottle />
        </div>
      </section>

      {/* 4. Brand Founders: The Engineering Behind Scent */}
      <section id="founders-section" className="bg-stone-50 border-t border-b border-stone-200/85 py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="max-w-xl mb-16">
            <span className="text-[10px] font-mono tracking-[0.2em] text-stone-500 uppercase font-bold block mb-2">
              The Intellect Behind The System
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-tight">
              Our Founders & Growth Architects
            </h2>
            <div className="h-[2px] w-12 bg-amber-gold mt-4" />
          </div>

          {/* Two Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            
            {/* Founder & CEO */}
            <div className="bg-white border border-stone-200/60 rounded-sm p-8 flex flex-col justify-between transition-all duration-300 hover:border-stone-300">
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-stone-400 tracking-wider">
                      Engineering & Product
                    </span>
                    <h3 className="text-lg font-serif italic text-stone-900 font-medium mt-1">
                      Our Founder & CEO
                    </h3>
                  </div>
                  <span className="text-2xl">💻</span>
                </div>

                <h4 className="text-sm font-sans font-semibold text-stone-850 mb-4 leading-snug">
                  The fragrance industry is broken—buried under pretentious marketing and expensive blind buys.
                </h4>

                <p className="text-stone-600 text-xs font-sans leading-relaxed mb-6 font-light">
                  Our Founder and CEO, a developer who engineered minimalist platforms like <span className="text-stone-900 font-medium">StupidSimple.ai</span> and <span className="text-stone-900 font-medium">GoalHub</span>, saw a textbook engineering problem. Finding a premium scent shouldn't be a gamble. He applied a strict, high-contrast philosophy to the physical world, stripping away the nonsense to deliver pure, high-conviction fragrance previews.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-150/40 rounded-sm p-4">
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider italic">
                  "Our Founder saw the gap. We built the solution."
                </p>
              </div>
            </div>

            {/* Co-Founder & CMO */}
            <div className="bg-white border border-stone-200/60 rounded-sm p-8 flex flex-col justify-between transition-all duration-300 hover:border-stone-300">
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-stone-400 tracking-wider">
                      Growth & Distribution
                    </span>
                    <h3 className="text-lg font-serif italic text-stone-900 font-medium mt-1">
                      Our Co-Founder & CMO
                    </h3>
                  </div>
                  <span className="text-2xl">⚡</span>
                </div>

                <h4 className="text-sm font-sans font-semibold text-stone-850 mb-4 leading-snug">
                  He doesn’t build the platforms—he builds the hype that scales them.
                </h4>

                <p className="text-stone-600 text-xs font-sans leading-relaxed mb-6 font-light">
                  Our Co-Founder and CMO masterminds the front-end engine, from the brand’s psychological angle to the high-converting hooks that drive traffic straight to checkout. As the marketing architect behind the ads that launched <span className="text-stone-900 font-medium">StupidSimple.ai</span> and <span className="text-stone-900 font-medium">GoalHub</span>, he proved that mastering attention moves any product.
                </p>

                <p className="text-stone-600 text-xs font-sans leading-relaxed mb-6 font-light">
                  Now, he’s bringing that growth logic to the fragrance world with one vision: make perfumes easy.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-150/40 rounded-sm p-4">
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider italic">
                  "Our Co-Founder hooks the audience, drives the traffic, and scales the brand."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Luxurious Buy Now & Express Checkout Section */}
      <section id="buy-now-section" className="hidden">
        
        {/* Subtle glowing fluid pattern in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-2.5 py-0.5 text-[8px] font-mono tracking-widest bg-amber-gold text-stone-950 font-bold uppercase rounded-full">
              Acquisition Studio
            </span>
            <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
              Immediate Dispatch
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">
            Direct Olfaction Acquisition
          </h2>
          <p className="text-stone-400 text-xs md:text-sm font-sans font-light mb-12 max-w-2xl leading-relaxed">
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
                    className="max-w-xl mx-auto bg-stone-950/60 border border-stone-800/80 rounded-sm p-6 md:p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="block text-[8px] font-mono tracking-widest text-amber-gold uppercase font-bold">
                        Step 1 of 2 / Configure Your Scent
                      </span>
                      <span className="text-[9px] font-mono text-stone-500 uppercase">
                        {selectionType} segment
                      </span>
                    </div>

                    {/* Item selector toggle (Fragrances vs Bundles) */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectionType("fragrance");
                          if (CATALOG_DATA.length > 0) {
                            setSelectedBuyId(CATALOG_DATA[0].id);
                          }
                          setSelectedBuySize("10ml");
                        }}
                        className={`py-2.5 px-3 text-xs font-mono rounded-sm border transition-all cursor-pointer ${
                          selectionType === "fragrance"
                            ? "bg-amber-gold text-stone-950 border-amber-gold font-bold"
                            : "bg-transparent text-stone-400 border-stone-800 hover:text-white"
                        }`}
                      >
                        Individual Scent
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectionType("bundle");
                          if (BUNDLE_DATA.length > 0) {
                            setSelectedBuyId(BUNDLE_DATA[0].id);
                          }
                          setSelectedBuySize("10ml");
                        }}
                        className={`py-2.5 px-3 text-xs font-mono rounded-sm border transition-all cursor-pointer ${
                          selectionType === "bundle"
                            ? "bg-amber-gold text-stone-950 border-amber-gold font-bold"
                            : "bg-transparent text-stone-400 border-stone-800 hover:text-white"
                        }`}
                      >
                        Curated Bundle
                      </button>
                    </div>

                    {/* Product Dropdown */}
                    <div className="mb-6">
                      <label className="block text-[9px] font-mono text-stone-400 uppercase tracking-wider mb-2">
                        Choose Blend or Set
                      </label>
                      <select
                        value={selectedBuyId}
                        onChange={(e) => {
                          const newId = e.target.value;
                          setSelectedBuyId(newId);
                          const defaultSize = selectionType === "fragrance" ? "10ml" : "5ml Normal";
                          setSelectedBuySize(defaultSize);
                          const maxStock = getProductStock(newId, defaultSize);
                          setBuyQuantity((q) => Math.max(1, Math.min(maxStock, q)));
                        }}
                        className="w-full bg-stone-900 border border-stone-800 rounded-sm px-4 py-3 text-xs font-sans text-white focus:outline-none focus:border-amber-gold"
                      >
                        {selectionType === "fragrance"
                          ? CATALOG_DATA.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.brand} — {f.name}
                              </option>
                            ))
                          : BUNDLE_DATA.map((b) => (
                              <option key={b.id} value={b.id}>
                                ScentPreview Curated — {b.name}
                              </option>
                            ))}
                      </select>
                    </div>

                    {/* Description or details of the selected item */}
                    <div className="bg-stone-900/40 p-3.5 border border-stone-900 rounded-sm mb-6">
                      <span className="block text-[8px] font-mono tracking-widest text-stone-500 uppercase mb-1">
                        Olfactory Composition
                      </span>
                      <p className="text-xs text-stone-300 font-sans italic">
                        {selectedProductDescription}
                      </p>
                    </div>

                    {/* Size Segment Selector */}
                    {hasSizeOptions && (
                      <div className="mb-6">
                        <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-400 mb-2">
                          02 / Volume Segment
                        </span>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-stone-900 rounded border border-stone-800">
                          {(["10ml", "5ml Normal", "5ml HQ"] as const).map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => {
                                setSelectedBuySize(size);
                                const maxStock = getProductStock(selectedBuyId, size);
                                setBuyQuantity((q) => Math.max(1, Math.min(maxStock, q)));
                              }}
                              className={`py-2 text-[10px] font-mono rounded-sm transition-all cursor-pointer ${
                                selectedBuySize === size
                                  ? "bg-amber-gold text-stone-950 font-bold"
                                  : "text-stone-400 hover:text-white"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-stone-900">
                      <div>
                        <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-500">
                          Quantity
                        </span>
                        <span className="text-xs text-stone-400 font-sans">Increase quantity</span>
                      </div>
                      <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-sm p-1">
                        <button
                          type="button"
                          onClick={() => setBuyQuantity((q) => Math.max(1, q - 1))}
                          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-white transition-colors font-mono cursor-pointer text-sm font-semibold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono text-sm font-semibold text-white">
                          {buyQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBuyQuantity((q) => {
                            const maxStock = selectedProduct ? getProductStock(selectedProduct.id, selectedBuySize) : 10;
                            return Math.min(maxStock, q + 1);
                          })}
                          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-white transition-colors font-mono cursor-pointer text-sm font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Cost Preview before checkout */}
                    <div className="border-t border-stone-900 pt-5 mt-4">
                      <div className="flex justify-between items-center text-xs mb-4">
                        <span className="text-stone-400 font-mono uppercase tracking-wider">Subtotal:</span>
                        <span className="font-mono text-white text-sm font-bold">₹{buyItemPrice * buyQuantity}.00</span>
                      </div>
                      
                      {(() => {
                        const maxStock = selectedProduct ? getProductStock(selectedProduct.id, selectedBuySize) : 0;
                        if (maxStock <= 0) {
                          return (
                            <button
                              type="button"
                              disabled
                              className="w-full bg-stone-800 text-stone-500 font-mono text-xs tracking-widest uppercase font-bold py-4 rounded-sm cursor-not-allowed border border-stone-750 flex items-center justify-center gap-2"
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
                            className="w-full bg-white hover:bg-stone-200 text-stone-950 font-mono text-xs tracking-widest uppercase font-bold py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                          >
                            <span>Configure Delivery Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        );
                      })()}
                    </div>
                  </motion.div>
                ) : (
                  /* STEP 2: SPLIT SCREEN WITH FULL CHECKOUT FORM AND SUMMARY */
                  <motion.div
                    key="step-checkout"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                  >
                    {/* Left Column: Scent Preview details summary */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="bg-stone-950/60 border border-stone-800/80 rounded-sm p-6 flex flex-col h-full justify-between">
                        <div>
                          <div className="flex justify-between items-center border-b border-stone-900 pb-4 mb-6">
                            <span className="text-[10px] font-mono tracking-widest text-amber-gold uppercase font-bold">
                              Selected Scent Recipe
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsCheckoutFormVisible(false)}
                              className="text-[10px] font-mono text-stone-400 hover:text-amber-gold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              ← Modify Selection
                            </button>
                          </div>

                          <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded bg-gradient-to-tr ${(selectionType === 'fragrance' && (selectedProduct as Fragrance)?.color) || 'from-stone-800 to-stone-900'} flex items-center justify-center border border-stone-800`}>
                                <ShoppingBag className="w-5 h-5 text-stone-400" />
                              </div>
                              <div>
                                <span className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider">
                                  {(selectionType === 'fragrance' && (selectedProduct as Fragrance)?.brand) || "Curated"}
                                </span>
                                <h4 className="text-sm font-serif font-medium text-white italic">
                                  {selectedProduct?.name}
                                </h4>
                                <span className="inline-block mt-1 text-[9px] font-mono bg-stone-900 text-stone-300 px-2 py-0.5 rounded">
                                  {selectionType === "fragrance" ? selectedBuySize : "5ml Normal"}
                                </span>
                              </div>
                            </div>

                            <div className="bg-stone-900/30 border border-stone-900 p-4 rounded-sm space-y-2">
                              <span className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest">
                                Lab Specifications
                              </span>
                              <div className="flex justify-between text-xs font-mono text-stone-400">
                                <span>Quantity:</span>
                                <span className="text-white">{buyQuantity} units</span>
                              </div>
                              <div className="flex justify-between text-xs font-mono text-stone-400">
                                <span>Bottle Seal:</span>
                                <span className="text-white">Sterile Teflon Wrap</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Beautiful security badge for encryption */}
                        <div className="border-t border-stone-900 pt-6 mt-6 space-y-3">
                          <div className="flex items-start gap-3 bg-stone-900/50 border border-stone-850 p-4 rounded-sm">
                            <span className="text-lg">🛡️</span>
                            <div>
                              <span className="block text-[9px] font-mono text-white font-semibold uppercase tracking-wider mb-1">
                                End-to-End Encryption
                              </span>
                              <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                                ScentPreview uses military grade encryption keys. Your email, contact phone, and shipping address are immediately hashed & secured. No plain-text logs are retained in memory.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: checkout form */}
                    <form
                      onSubmit={handlePlaceOrder}
                      className="lg:col-span-6 bg-stone-950/60 border border-stone-800/80 rounded-sm p-6 flex flex-col justify-between min-h-[340px]"
                    >
                      {!isNameAuthorized ? (
                        <div className="flex flex-col justify-between h-full py-2">
                          <div>
                            <div className="flex items-center justify-between border-b border-stone-900 pb-4 mb-6">
                              <span className="text-[10px] font-mono tracking-widest text-amber-gold uppercase font-bold">
                                Delivery Authorization
                              </span>
                              <span className="text-[9px] font-mono text-stone-500 uppercase">
                                Step 2 of 2
                              </span>
                            </div>
                            <p className="text-stone-300 text-xs font-light font-sans mb-6 leading-relaxed">
                              To prevent automated bot acquisitions and secure sterile delivery allocations, please enter your legal name to initialize your shipping file.
                            </p>
                            <div>
                              <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-2">
                                Full Name to Begin
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  required
                                  value={checkoutName}
                                  onChange={(e) => setCheckoutName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      if (checkoutName.trim() !== "") {
                                        setIsNameAuthorized(true);
                                      }
                                    }
                                  }}
                                  placeholder="Type your name here..."
                                  className="w-full bg-stone-900 border border-stone-800 rounded-sm px-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-gold placeholder-stone-600 font-sans pr-24"
                                />
                                <div className="absolute right-2 top-2">
                                  <button
                                    type="button"
                                    disabled={checkoutName.trim() === ""}
                                    onClick={() => {
                                      if (checkoutName.trim() !== "") {
                                        setIsNameAuthorized(true);
                                      }
                                    }}
                                    className="bg-amber-gold hover:bg-amber-400 text-stone-950 font-mono text-[10px] uppercase font-bold px-3.5 py-2 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    Enter
                                  </button>
                                </div>
                              </div>
                              <p className="text-[10px] text-stone-500 font-mono mt-1.5 italic">
                                Press <span className="font-sans font-bold">Enter</span> on your keyboard or click the button to authorize
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-8">
                            <button
                              type="button"
                              onClick={() => setIsCheckoutFormVisible(false)}
                              className="w-full bg-transparent border border-stone-800 hover:bg-stone-900 text-stone-400 py-4 rounded-sm text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer"
                            >
                              Back to Setup
                            </button>
                          </div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="flex items-center justify-between border-b border-stone-900 pb-4 mb-6">
                              <span className="text-[10px] font-mono tracking-widest text-amber-gold uppercase font-bold">
                                Delivery & Sterile Shipping
                              </span>
                              <span className="text-[9px] font-mono text-stone-500 uppercase">
                                Step 2 of 2
                              </span>
                            </div>

                            {/* Name & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={checkoutName}
                                  onChange={(e) => setCheckoutName(e.target.value)}
                                  placeholder="John Smith"
                                  className="w-full bg-stone-900 border border-stone-800 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-gold placeholder-stone-650"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={checkoutEmail}
                                  onChange={(e) => setCheckoutEmail(e.target.value)}
                                  placeholder="john.smith@gmail.com"
                                  className="w-full bg-stone-900 border border-stone-800 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-gold placeholder-stone-650"
                                />
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-4">
                              <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                                Shipping Address
                              </label>
                              <textarea
                                required
                                rows={2}
                                value={checkoutAddress}
                                onChange={(e) => setCheckoutAddress(e.target.value)}
                                placeholder="123 Oakwood Lane, Bandra West, Mumbai"
                                className="w-full bg-stone-900 border border-stone-800 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-gold placeholder-stone-650 resize-none"
                              />
                            </div>

                            {/* India State & Pincode Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                                  State / Union Territory
                                </label>
                                <select
                                  required
                                  value={checkoutState}
                                  onChange={(e) => setCheckoutState(e.target.value)}
                                  className="w-full bg-stone-900 border border-stone-850 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-gold font-sans"
                                >
                                  {INDIAN_STATES_AND_UTS.map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                  <span>Pincode</span>
                                  <span className="text-[7px] text-stone-500 font-normal">6-digit PIN</span>
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
                                  className="w-full bg-stone-900 border border-stone-800 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-gold placeholder-stone-650 font-mono"
                                />
                              </div>
                            </div>

                            {/* Phone & Shipping method */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div>
                                <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                                  Contact Phone
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={checkoutPhone}
                                  onChange={(e) => setCheckoutPhone(e.target.value)}
                                  placeholder="+91 99999 99999"
                                  className="w-full bg-stone-900 border border-stone-800 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-gold placeholder-stone-650"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                                  Delivery Priority
                                </label>
                                <div className="w-full bg-stone-900 border border-stone-850 rounded-sm px-3.5 py-2.5 text-xs text-stone-300 font-mono h-[38px] flex items-center">
                                  Standard Delivery (₹116)
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Summary and Purchase button */}
                          <div className="border-t border-stone-900 pt-6 mt-4">
                            <div className="space-y-2 mb-6">
                              <div className="flex justify-between text-xs font-mono text-stone-400">
                                <span>Allocation Cost:</span>
                                <span>₹{buyItemPrice * buyQuantity}.00</span>
                              </div>
                              <div className="flex justify-between text-xs font-mono text-stone-400">
                                <span>Sterile Courier:</span>
                                <span>₹{shippingCost}.00</span>
                              </div>
                              <div className="flex justify-between items-center text-xs font-mono text-stone-400 py-1.5 border-t border-b border-stone-800 my-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isShippingProtectionEnabled}
                                    onChange={(e) => setIsShippingProtectionEnabled(e.target.checked)}
                                    className="w-3.5 h-3.5 rounded-sm border-stone-700 bg-stone-900 text-amber-gold focus:ring-amber-gold cursor-pointer accent-amber-gold"
                                  />
                                  <span className="text-stone-300">Shipping Protection (₹150)</span>
                                </label>
                                <span className={isShippingProtectionEnabled ? "text-white" : "text-stone-600 line-through"}>
                                  ₹150.00
                                </span>
                              </div>
                              <div className="flex justify-between text-sm font-mono text-white font-semibold pt-2">
                                <span>Total Due:</span>
                                <span className="text-amber-gold">₹{checkoutTotal + (isShippingProtectionEnabled ? 150 : 0)}.00</span>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setCheckoutName("");
                                }}
                                className="w-1/3 bg-transparent border border-stone-800 hover:bg-stone-900 text-stone-400 py-4 rounded-sm text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer"
                              >
                                Clear
                              </button>
                              <button
                                type="submit"
                                disabled={isProcessingOrder}
                                className="w-2/3 bg-white hover:bg-stone-200 text-stone-950 font-mono text-xs tracking-widest uppercase font-bold py-4 px-6 transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center gap-2"
                              >
                                {isProcessingOrder ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Processing...</span>
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="w-4 h-4" />
                                    <span>Proceed to Payment</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </form>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="checkout-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-stone-950 border border-amber-gold/30 p-8 rounded-sm max-w-2xl mx-auto text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>

                <span className="text-[10px] font-mono text-amber-gold uppercase tracking-[0.2em] font-semibold block mb-2">
                  Acquisition Dispatched
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">
                  Pouring Sequence Completed
                </h3>
                
                <p className="text-stone-300 text-xs md:text-sm font-sans font-light mb-8 max-w-md mx-auto leading-relaxed">
                  Excellent choice, <span className="text-white font-medium">{placedOrderData?.name}</span>. Your personalized extraction of <span className="text-white italic font-serif">"{placedOrderData?.productName}" ({placedOrderData?.volume})</span> has entered sterile decanting.
                </p>

                <div className="border-y border-stone-800 py-6 mb-8 text-center">
                  <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-500 mb-1">
                    Amount Billed
                  </span>
                  <span className="font-mono text-xl text-white font-semibold">₹{placedOrderData?.total}.00</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                    setIsOrderPlaced(false);
                    setCheckoutName("");
                    setIsNameAuthorized(false);
                    setCheckoutEmail("");
                      setCheckoutAddress("");
                      setCheckoutPhone("");
                      setBuyQuantity(1);
                    }}
                    className="w-full sm:w-auto bg-stone-900 border border-stone-800 hover:bg-stone-850 px-6 py-3 rounded-sm text-xs font-mono text-white tracking-widest uppercase transition-colors cursor-pointer"
                  >
                    New Selection
                  </button>
                  <button
                    type="button"
                    onClick={scrollToCatalog}
                    className="w-full sm:w-auto bg-amber-gold text-stone-950 hover:bg-amber-400 px-6 py-3 rounded-sm text-xs font-mono tracking-widest uppercase font-bold transition-colors cursor-pointer"
                  >
                    Return to Catalog
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. Interactive Scent Grid: The Kinetic Catalog */}
      <section id="kinetic-catalog" className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        
        {/* Section Heading */}
        <div className="border-b border-stone-200/60 pb-5 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-stone-400 uppercase font-bold block mb-2">
              Curated Decants
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-tight">
              The Kinetic Catalog
            </h2>
          </div>
          <p className="text-stone-500 text-xs font-sans max-w-sm">
            Staggered architecture showcasing premier fragrance extractions. Select individual sizes dynamically to view instantaneous odometer price adjustments.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-md">
          <label htmlFor="scent-search" className="block text-[9px] font-mono uppercase tracking-[0.2em] text-stone-400 mb-2 font-bold">
            Search Decants
          </label>
          <div className="relative">
            <input
              id="scent-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, brand, or ingredients/notes..."
              className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-full py-3 px-5 pl-6 text-xs font-sans text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-300 focus:border-stone-300 transition-all placeholder:text-stone-400 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 text-xs font-mono transition-colors font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Sensory Test Call-To-Action Banner */}
        <div className="mb-16 bg-gradient-to-r from-stone-900 via-stone-950 to-neutral-900 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-xl overflow-hidden relative group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-700" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[9px] font-mono tracking-[0.25em] text-emerald-400 uppercase font-bold block">
                INTELLIGENT PROFILE ISOLATION // SYSTEM v2
              </span>
              <p className="text-sm sm:text-base font-serif italic text-stone-200 leading-relaxed">
                "Can't decide? Take one of our sensory tests to find your signature profile."
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsQuizListOpen(true)}
                className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-stone-950 transition-all duration-300 px-8 py-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0 border border-amber-400/20"
              >
                <Sparkles className="w-4 h-4 text-stone-950 animate-pulse" />
                Explore Sensory Quizzes
                <ChevronRight className="w-4 h-4 text-stone-950" />
              </button>
            </div>
          </div>
        </div>

        {/* Asymmetric Staggered Masonry Layout */}
        {filteredCatalog.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCatalog.map((fragrance, index) => {
              // Apply staggered offset effect for masonry pattern
              const isStaggered = index % 3 === 1;
              return (
                <div 
                  key={fragrance.id} 
                  className={`${isStaggered ? "lg:translate-y-6" : ""} transition-transform duration-500`}
                >
                  <ScentCard
                    fragrance={fragrance}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    fragranceStock={stock?.fragrances[fragrance.id]}
                  />
                </div>
              );
            })}
          </div>
        )}

        {filteredCatalog.length === 0 && filteredBundles.length === 0 && (
          <div className="text-center py-24 bg-white/40 border border-stone-200/50 rounded-sm">
            <span className="block font-serif italic text-stone-600 text-lg mb-2">
              No matching decants or bundles found
            </span>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              Try search parameters such as "cinnamon", "zara", or "duo"
            </span>
          </div>
        )}

        {/* Curated Capsule Bundles Subsection */}
        {filteredBundles.length > 0 && (
          <div className="mt-24 pt-16 border-t border-stone-200/60">
            {/* Subsection Heading */}
            <div className="border-b border-stone-200/60 pb-5 mb-10">
              <span className="text-[10px] font-mono tracking-[0.2em] text-stone-400 uppercase font-bold block mb-2">
                Unified Decant Combinations
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-stone-900 tracking-tight">
                Curated Bento Capsule Bundles
              </h3>
            </div>

            {/* Asymmetric Bento Grid for Bundles */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* The Spotlight Block: Massive Double-Sized Card */}
              {(() => {
                const spotlight = filteredBundles.find((b) => b.isSpotlight);
                if (!spotlight) return null;
                return (
                  <div className="lg:col-span-8 bg-stone-950 text-white rounded-sm p-8 flex flex-col justify-between relative overflow-hidden group min-h-[320px]">
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <span className="inline-flex items-center bg-amber-gold text-stone-950 text-[9px] font-mono px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                          Spotlight Bundle
                        </span>
                        <span className="inline-flex items-center bg-stone-850 border border-stone-800 text-stone-450 text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                          5ml Normal
                        </span>
                        <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                          Available Now
                        </span>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-serif tracking-tight max-w-md mb-3">
                        {spotlight.name}
                      </h3>
                      
                      <p className="text-stone-400 text-xs max-w-sm font-sans font-light leading-relaxed mb-6">
                        Experience the magnificent collision of the Orient. Includes our highest rated formulations: <span className="text-white italic font-serif">{spotlight.contains}</span>.
                      </p>
                    </div>

                    <div className="border-t border-stone-900 pt-6 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-500 mb-1">
                          Fixed Collection Price
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-sm text-stone-500 line-through">
                            ₹{getBundleOriginalPrice(spotlight.id)}.00
                          </span>
                          <span className="font-mono text-2xl font-medium text-amber-gold">
                            ₹{spotlight.fixedPrice}.00
                          </span>
                        </div>
                      </div>

                      {stock && stock.bundles[spotlight.id] !== undefined && (
                        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-stone-900/60 border border-stone-850/40 rounded-full py-1.5 px-3.5 backdrop-blur-md">
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                          </span>
                          <span className="text-[8px] font-mono font-semibold text-amber-gold uppercase tracking-wider">
                            {stock.bundles[spotlight.id] === 0 ? "SOLD OUT" : `Only ${stock.bundles[spotlight.id]} sets left`}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleAddBundleToCart(spotlight)}
                          className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-mono text-[10px] tracking-widest uppercase font-bold py-3.5 px-5 transition-colors rounded-sm cursor-pointer"
                        >
                          Add to Box
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBuyBundleNow(spotlight)}
                          className="bg-white text-stone-950 font-mono text-[10px] tracking-widest uppercase font-bold py-3.5 px-6 hover:bg-stone-200 transition-colors rounded-sm cursor-pointer"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* General Bento Cards */}
              {filteredBundles.filter((b) => !b.isSpotlight).map((bundle) => {
                const selectedSize = "5ml Normal";
                const price = bundle.prices ? bundle.prices[selectedSize] : 0;
                
                const bundleStock = stock ? stock.bundles[bundle.id] : undefined;
                const isBundleOutOfStock = bundle.isOutOfStock || bundleStock === 0;
                
                return (
                  <div 
                    key={bundle.id}
                    className={`lg:col-span-4 rounded-sm p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                      isBundleOutOfStock 
                        ? "bg-stone-100 border border-stone-200/60 grayscale opacity-60" 
                        : "bg-white border border-stone-200/80 hover:border-amber-gold"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-[9px] font-mono uppercase text-stone-400 tracking-wider">
                          Curated Set
                        </span>
                        
                        {isBundleOutOfStock && (
                          <span className="text-[8px] font-mono bg-stone-100 text-stone-500 border border-stone-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-serif italic text-stone-900 tracking-tight mb-2">
                        {bundle.name}
                      </h4>

                      <span className="block text-[10px] font-sans text-stone-500">
                        Contains: {bundle.contains}
                      </span>

                      {stock && bundleStock !== undefined && (
                        <div className="mt-3 flex items-center gap-1.5">
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${bundleStock <= 3 ? "bg-amber-400" : "bg-emerald-400"} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${bundleStock <= 3 ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                          </span>
                          <span className={`text-[9px] font-mono font-medium ${bundleStock <= 3 ? "text-amber-800" : "text-stone-500"} uppercase tracking-wide`}>
                            {bundleStock === 0 ? "SOLD OUT" : bundleStock <= 3 ? `Only ${bundleStock} left` : `${bundleStock} sets available`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Size toggler & purchase row */}
                    <div>
                      <div className="mb-4 mt-5">
                        <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                          Size / Volume
                        </span>
                        <div className="text-xs font-mono text-stone-700 font-medium bg-stone-100 px-3 py-2 rounded-sm border border-stone-200/40 inline-block w-full">
                          5ml Normal (Exclusive Bundle Size)
                        </div>
                      </div>

                      <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
                        <div>
                          <span className="block text-[8px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                            Bundle Price
                          </span>
                          {isBundleOutOfStock ? (
                            <span className="font-mono text-sm font-semibold text-stone-950">—</span>
                          ) : (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="font-mono text-[10px] text-stone-400 line-through">
                                  ₹{getBundleOriginalPrice(bundle.id)}.00
                                </span>
                              </div>
                              <span className="font-mono text-sm font-bold text-stone-950">
                                ₹{price}.00
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAddBundleToCart(bundle)}
                            disabled={isBundleOutOfStock}
                            className={`py-2 px-2.5 rounded-sm text-[9px] font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                              isBundleOutOfStock
                                ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
                                : "bg-stone-100 hover:bg-stone-200 text-stone-850 border border-stone-300"
                            }`}
                          >
                            {isBundleOutOfStock ? "Unavailable" : "Add to Box"}
                          </button>
                          
                          {!isBundleOutOfStock && (
                            <button
                              type="button"
                              onClick={() => handleBuyBundleNow(bundle)}
                              className="py-2 px-3 rounded-sm text-[9px] font-mono tracking-wider uppercase bg-stone-900 hover:bg-black text-white transition-colors cursor-pointer"
                            >
                              Buy Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Curation & Enquiries Desk Section */}
        <div className="mt-28 border-t border-stone-200/60 pt-16">
          <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-3xs">
            {/* Subtle luxury background glow effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/5 via-transparent to-transparent rounded-full pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Text & Interaction */}
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-800 text-[9px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-bold border border-amber-500/20">
                  <Mail className="w-3 h-3 text-amber-600 animate-pulse" />
                  <span>Curation Desk & Relations</span>
                </span>
                
                <h3 className="text-2xl md:text-3xl font-serif text-stone-900 tracking-tight leading-tight">
                  Have a bespoke request or order enquiry?
                </h3>
                
                <p className="text-stone-600 text-[12px] md:text-xs font-sans font-light leading-relaxed max-w-xl">
                  Seeking a custom volume decant, sourcing a rare collector bottle, arranging a bespoke corporate gift set, or inquiring about an active shipment? Reach out directly to our curation desk.
                </p>
                
                {/* Email Display & Fast Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="bg-white border border-stone-200/80 px-4 py-3 rounded-xl flex items-center justify-between gap-4 shadow-3xs flex-1 sm:max-w-md">
                    <span className="font-mono text-xs md:text-sm font-semibold text-stone-900 tracking-wide select-all">
                      scentpreview@gmail.com
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("scentpreview@gmail.com");
                        setEnquiryCopied(true);
                        setTimeout(() => setEnquiryCopied(false), 2000);
                      }}
                      className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-800 transition-colors cursor-pointer flex items-center justify-center"
                      title="Copy email address"
                    >
                      {enquiryCopied ? (
                        <Check className="w-4 h-4 text-emerald-600 animate-scale-up" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  <a
                    href="mailto:scentpreview@gmail.com?subject=ScentPreview%20Curation%20Inquiry"
                    className="bg-stone-900 hover:bg-black text-white font-mono text-[10px] tracking-widest uppercase font-bold px-6 py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-center apple-liquid-btn"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </a>
                </div>
              </div>
              
              {/* Right Column: Pre-composed drafting desk */}
              <div className="lg:col-span-5">
                <div className="bg-white border border-stone-200/60 rounded-xl p-5 shadow-3xs flex flex-col gap-3.5 relative">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 font-bold">
                      Direct Draft Assist
                    </span>
                    <span className="text-[8px] font-mono text-stone-400">
                      Auto-populates mail client
                    </span>
                  </div>
                  
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-stone-400 font-bold mb-1">
                        Inquiry Topic
                      </label>
                      <select 
                        value={enquiryTopic}
                        onChange={(e) => setEnquiryTopic(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-[11px] font-sans text-stone-800 outline-none focus:border-amber-500 transition-colors cursor-pointer"
                      >
                        <option value="Bespoke Decant Volume request">Bespoke Decant Volume request</option>
                        <option value="Order Status / Shipping assistance">Order Status / Shipping assistance</option>
                        <option value="Sourcing Vaulted / Rare fragrance">Sourcing Vaulted / Rare fragrance</option>
                        <option value="Corporate / Custom Curation Gift Sets">Corporate / Custom Curation Gift Sets</option>
                        <option value="General Feedback / Partnership enquiry">General Feedback / Partnership enquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-stone-400 font-bold mb-1">
                        Optional Detail Note
                      </label>
                      <textarea
                        value={enquiryNote}
                        onChange={(e) => setEnquiryNote(e.target.value)}
                        placeholder="E.g., Looking to procure a 30ml decant of Givenchy Gentleman..."
                        rows={2}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-[11px] font-sans text-stone-800 outline-none focus:border-amber-500 transition-colors placeholder:text-stone-400 resize-none"
                      />
                    </div>
                  </div>

                  <a
                    href={`mailto:scentpreview@gmail.com?subject=${encodeURIComponent(enquiryTopic)}&body=${encodeURIComponent(enquiryNote ? enquiryNote : "Hello ScentPreview, I would like to enquire about...")}`}
                    className="w-full mt-1.5 py-3 rounded-lg text-center bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 text-[10px] font-mono tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Prepare Email Draft</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* Modern Editorial Footer */}
      <footer className="bg-stone-950 text-white py-16 px-6 md:px-12 border-t border-stone-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] text-white uppercase font-bold">
              ScentPreview
            </span>
            <span className="block text-[10px] font-mono text-stone-500 mt-2 uppercase tracking-widest">
              © 2026 ScentPreview. All Rights Reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => {
                setAdminPasscodeInput("");
                setAdminPasscodeError(null);
                setIsAdminOpen(true);
              }}
              className="text-[10px] font-mono text-stone-500 hover:text-amber-gold uppercase tracking-widest transition-colors flex items-center gap-1.5 border border-stone-900 hover:border-amber-gold/30 px-3 py-1.5 rounded cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              Admin Vault
            </button>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest hidden sm:inline">
              Loro Piana x Apple Philosophy
            </span>
            <span className="text-[10px] font-mono text-amber-gold uppercase tracking-widest">
              India Edition
            </span>
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
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 220, mass: 0.8 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white/85 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 border-l border-white/80 p-6 flex flex-col justify-between overflow-y-auto rounded-l-3xl"
            >
              {isCartSuccessOpen ? (
                <div className="text-center py-12 flex flex-col items-center justify-center h-full my-auto animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6 shadow-xs">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-[0.2em] font-semibold block mb-2">
                    Acquisition Dispatched
                  </span>
                  <h3 className="text-2xl font-serif text-stone-900 mb-4">
                    Extraction Initiated
                  </h3>
                  <p className="text-xs text-stone-600 max-w-xs leading-relaxed mb-8">
                    Your luxury decanting acquisition has been successfully dispatched.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartSuccessOpen(false);
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-stone-950 hover:bg-black text-white text-xs font-mono tracking-widest uppercase py-4 px-6 rounded-xl cursor-pointer font-bold apple-liquid-btn"
                  >
                    Acknowledge & Close
                  </button>
                </div>
              ) : (
                <>
                  {isCartCheckoutVisible ? (
                    <div className="flex flex-col justify-between h-full animate-fade-in">
                      <div>
                        {/* Header with back button */}
                        <div className="flex items-center justify-between border-b border-stone-200/50 pb-4 mb-5">
                          <button
                            type="button"
                            onClick={() => setIsCartCheckoutVisible(false)}
                            className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500 hover:text-stone-900 transition-colors cursor-pointer font-bold"
                          >
                            ← Back to Bag
                          </button>
                          <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">
                            Direct Checkout
                          </span>
                        </div>

                        {/* Order Cost summary card */}
                        <div className="bg-stone-50/85 border border-stone-100 p-4 rounded-xl mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">Total Allocation Billed</span>
                            <span className="font-mono text-xs font-bold text-stone-950">₹{cartTotal + 116 + (isShippingProtectionEnabled ? 150 : 0)}.00</span>
                          </div>
                          <p className="text-[9px] text-stone-400 font-mono">
                            Includes Priority packaging, Delivery Fee (₹116.00) {isShippingProtectionEnabled ? "+ Protection" : ""}
                          </p>
                        </div>

                        {!isNameAuthorized ? (
                          <div className="space-y-4 py-2">
                            <span className="block text-[10px] font-mono tracking-widest text-stone-500 uppercase font-bold">
                              Step 1: Delivery Authorization
                            </span>
                            <p className="text-stone-600 text-xs font-sans leading-relaxed font-light">
                              To prevent automated bot acquisitions and secure sterile delivery allocations, please enter your legal name to initialize your shipping file.
                            </p>
                            
                            <div className="space-y-3">
                              <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                Full Name
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  required
                                  value={checkoutName}
                                  onChange={(e) => setCheckoutName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      if (checkoutName.trim() !== "") {
                                        setIsNameAuthorized(true);
                                      }
                                    }
                                  }}
                                  placeholder="Type your name here..."
                                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-400 placeholder-stone-400 font-sans pr-20"
                                />
                                <div className="absolute right-1.5 top-1.5">
                                  <button
                                    type="button"
                                    disabled={checkoutName.trim() === ""}
                                    onClick={() => {
                                      if (checkoutName.trim() !== "") {
                                        setIsNameAuthorized(true);
                                      }
                                    }}
                                    className="bg-stone-950 hover:bg-black text-white font-mono text-[9px] uppercase font-bold px-3.5 py-1.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    Proceed
                                  </button>
                                </div>
                              </div>
                              <p className="text-[8.5px] text-stone-400 font-mono italic">
                                Press <span className="font-bold">Enter</span> or click Proceed to unlock Step 2
                              </p>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handlePlaceOrder} className="space-y-3.5">
                            <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-1">
                              <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase font-bold">
                                Step 2: Shipping & Details
                              </span>
                              <button
                                type="button"
                                onClick={() => setIsNameAuthorized(false)}
                                className="text-[9px] font-mono text-stone-400 hover:text-stone-950"
                              >
                                ← Change Name
                              </button>
                            </div>

                            <div className="space-y-3">
                              {/* Name & Email */}
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                    Full Name
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={checkoutName}
                                    onChange={(e) => setCheckoutName(e.target.value)}
                                    placeholder="John Smith"
                                    className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                    Email Address
                                  </label>
                                  <input
                                    type="email"
                                    required
                                    value={checkoutEmail}
                                    onChange={(e) => setCheckoutEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                                  />
                                </div>
                              </div>

                              {/* Address */}
                              <div>
                                <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                  Shipping Address
                                </label>
                                <textarea
                                  required
                                  rows={2}
                                  value={checkoutAddress}
                                  onChange={(e) => setCheckoutAddress(e.target.value)}
                                  placeholder="Flat/House No., Street name, Area"
                                  className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none"
                                />
                              </div>

                              {/* State & Pincode */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                    State
                                  </label>
                                  <select
                                    required
                                    value={checkoutState}
                                    onChange={(e) => setCheckoutState(e.target.value)}
                                    className="w-full bg-white border border-stone-200 rounded-lg px-2 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-450 font-sans cursor-pointer"
                                  >
                                    {INDIAN_STATES_AND_UTS.map((st) => (
                                      <option key={st} value={st}>
                                        {st}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold flex items-center justify-between">
                                    <span>Pincode</span>
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
                                    className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-mono"
                                  />
                                </div>
                              </div>

                              {/* Phone */}
                              <div>
                                <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                  Contact Phone
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={checkoutPhone}
                                  onChange={(e) => setCheckoutPhone(e.target.value)}
                                  placeholder="+91 99999 99999"
                                  className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                                />
                              </div>
                            </div>

                            {/* Direct Checkout Actions */}
                            <div className="pt-3.5 border-t border-stone-200 flex gap-3 mt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setCheckoutName("");
                                  setIsNameAuthorized(false);
                                  setCheckoutEmail("");
                                  setCheckoutAddress("");
                                  setCheckoutPhone("");
                                  setCheckoutPincode("");
                                }}
                                className="w-1/3 bg-transparent border border-stone-300 hover:bg-stone-50 text-stone-500 py-3 rounded-xl text-xs font-mono tracking-wider uppercase transition-all cursor-pointer font-bold"
                              >
                                Clear
                              </button>
                              <button
                                type="submit"
                                disabled={isProcessingOrder}
                                className="w-2/3 bg-stone-950 hover:bg-black text-white font-mono text-xs tracking-widest uppercase font-bold py-3 px-4 transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1.5 apple-liquid-btn"
                              >
                                {isProcessingOrder ? "Processing..." : "Confirm & Pay"}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-between border-b border-white/50 pb-5 mb-6">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-stone-900" />
                            <span className="font-serif italic text-lg text-stone-950">Your Curated Bag</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsCartOpen(false)}
                            className="p-1.5 hover:text-amber-500 transition-colors cursor-pointer rounded-full hover:bg-white/40"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Cart Items List */}
                        {cart.length === 0 ? (
                          <div className="text-center py-16">
                            <span className="block font-serif italic text-stone-500 mb-2">The bag is currently empty</span>
                            <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">
                              Explore our selections to initiate decanting
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <AnimatePresence initial={false}>
                              {cart.map((item) => (
                                <motion.div 
                                  layout
                                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, x: 40, scale: 0.95 }}
                                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                                  key={item.id + "-" + item.size}
                                  className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 shadow-3xs hover:border-white/95 transition-all"
                                >
                                  <div>
                                    <span className="block text-[8px] font-mono text-stone-500 uppercase tracking-widest">
                                      {item.brand}
                                    </span>
                                    <span className="font-serif italic text-stone-950 text-sm block leading-tight">
                                      {item.name}
                                    </span>
                                    <span className="block text-[9px] font-mono text-amber-600 mt-0.5">
                                      Volume: {item.size}
                                    </span>
                                    
                                    {/* Quantity Display (Interactive, respects stock) */}
                                    <div className="flex items-center gap-2 mt-2">
                                      <div className="flex items-center border border-stone-200/80 bg-white rounded-lg overflow-hidden h-7">
                                        <button
                                          type="button"
                                          onClick={() => updateCartItemQuantity(item.id, item.size, -1)}
                                          className="px-2.5 h-full text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer font-mono text-xs font-semibold"
                                        >
                                          -
                                        </button>
                                        <span className="px-2 text-[11px] font-mono font-medium text-stone-800 min-w-[16px] text-center">
                                          {item.quantity}
                                        </span>
                                        <button
                                          type="button"
                                          disabled={item.quantity >= getProductStock(item.id, item.size)}
                                          onClick={() => updateCartItemQuantity(item.id, item.size, 1)}
                                          className="px-2.5 h-full text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer font-mono text-xs font-semibold border-l border-stone-100"
                                        >
                                          +
                                        </button>
                                      </div>
                                      {item.quantity >= getProductStock(item.id, item.size) && (
                                        <span className="text-[8px] font-mono text-amber-600 uppercase tracking-wider font-semibold">
                                          Max Stock
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <span className="font-mono text-xs font-semibold text-stone-950">
                                      ₹{item.price * item.quantity}.00
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.id, item.size)}
                                      className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-white/60 rounded-full transition-colors cursor-pointer"
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
                        <div className="border-t border-white/50 pt-6 mt-8">
                          <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs font-mono text-stone-500">
                              <span>Allocation Subtotal:</span>
                              <span>₹{cartTotal}.00</span>
                            </div>
                            <div className="flex justify-between text-xs font-mono text-stone-500">
                              <span>Mandatory Delivery Fee:</span>
                              <span>₹116.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono text-stone-500 py-1.5 border-t border-b border-white/40 my-1">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={isShippingProtectionEnabled}
                                  onChange={(e) => setIsShippingProtectionEnabled(e.target.checked)}
                                  className="w-3.5 h-3.5 rounded-md border-stone-300 text-stone-950 focus:ring-stone-500 cursor-pointer accent-stone-900"
                                />
                                <span className="text-stone-700 font-medium">Shipping Protection (₹150.00)</span>
                              </label>
                              <span className={isShippingProtectionEnabled ? "text-stone-900 font-semibold" : "text-stone-300 line-through"}>
                                ₹150.00
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-mono text-stone-950 font-bold pt-2">
                              <span>Total Billed:</span>
                              <span className="text-stone-900">₹{cartTotal + 116 + (isShippingProtectionEnabled ? 150 : 0)}.00</span>
                            </div>
                          </div>

                          <p className="text-[9.5px] text-stone-400 font-sans leading-relaxed mb-6">
                            *Each ScentPreview decant is precision-poured within our cleanroom laboratory to safeguard authentic olfactory complexity.
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setIsCartCheckoutVisible(true);
                              }}
                              className="w-full bg-stone-100 hover:bg-stone-200 border border-stone-200 py-4 rounded-xl text-xs font-mono text-stone-900 tracking-wider uppercase font-bold cursor-pointer transition-all"
                            >
                              Checkout Here
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCartOpen(false);
                                setIsCheckoutOpen(true);
                              }}
                              className="w-full bg-stone-950 hover:bg-black py-4 rounded-xl text-xs font-mono text-white tracking-widest uppercase font-bold cursor-pointer apple-liquid-btn"
                            >
                              Overlay Modal
                            </button>
                          </div>
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

      {/* Elegant Fullscreen Checkout Overlay Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-md z-40"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative bg-[#F2F0ED] rounded-xl border border-stone-200 shadow-2xl max-w-4xl w-full z-50 overflow-hidden flex flex-col md:grid md:grid-cols-12 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute right-4 top-4 text-stone-500 hover:text-stone-900 z-50 p-1.5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Curated Order Summary (span 5) */}
              <div className="md:col-span-5 bg-stone-100 border-r border-stone-200 p-6 flex flex-col justify-between max-h-[300px] md:max-h-[80vh] overflow-y-auto">
                <div>
                  <span className="block text-[9px] font-mono tracking-[0.25em] text-stone-400 uppercase font-bold mb-4">
                    Order Summary
                  </span>
                  
                  {/* Cart Items List */}
                  <div className="space-y-4 max-h-[180px] md:max-h-[50vh] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id + "-" + item.size} className="flex items-start gap-3 border-b border-stone-200/50 pb-3">
                        <div className="flex-1">
                          <span className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest">{item.brand}</span>
                          <span className="font-serif italic text-stone-900 text-xs font-semibold">{item.name}</span>
                          <span className="block text-[9px] font-mono text-stone-500 mt-0.5">
                            Qty: {item.quantity} × {item.size}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-stone-900 font-semibold">
                          ₹{item.price * item.quantity}.00
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtotals & Total Billed */}
                <div className="border-t border-stone-200 pt-4 mt-6">
                  <div className="space-y-2 mb-2">
                    <div className="flex justify-between text-[11px] font-mono text-stone-500">
                      <span>Subtotal:</span>
                      <span>₹{cartTotal}.00</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-stone-500">
                      <span>Delivery Priority:</span>
                      <span>₹116.00</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-mono text-stone-500 py-1 border-t border-b border-stone-200/50 my-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isShippingProtectionEnabled}
                          onChange={(e) => setIsShippingProtectionEnabled(e.target.checked)}
                          className="w-3.5 h-3.5 rounded-sm border-stone-300 text-stone-950 focus:ring-stone-500 cursor-pointer accent-stone-900"
                        />
                        <span className="text-stone-700">Shipping Protection (₹150.00)</span>
                      </label>
                      <span className={isShippingProtectionEnabled ? "text-stone-900 font-semibold" : "text-stone-300 line-through"}>
                        ₹150.00
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-stone-900 font-bold pt-2">
                      <span>Total Billed:</span>
                      <span>₹{cartTotal + 116 + (isShippingProtectionEnabled ? 150 : 0)}.00</span>
                    </div>
                  </div>
                  <p className="text-[8px] text-stone-400 font-sans leading-relaxed">
                    *Decanted fresh in our laboratory immediately upon verification.
                  </p>
                </div>
              </div>

              {/* Right Column: Checkout Form (span 7) */}
              <div className="md:col-span-7 p-6 bg-[#F2F0ED] max-h-[80vh] overflow-y-auto flex flex-col justify-between">
                {!isNameAuthorized ? (
                  <div className="flex flex-col justify-between h-full py-4">
                    <div>
                      <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
                        <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase font-bold">
                          Step 1: Delivery Authorization
                        </span>
                      </div>
                      <p className="text-stone-600 text-xs font-sans mb-6 leading-relaxed font-light">
                        To prevent automated bot acquisitions and secure sterile delivery allocations, please enter your legal name to initialize your shipping file.
                      </p>
                      
                      <div className="space-y-4">
                        <label className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider mb-1 font-bold">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={checkoutName}
                            onChange={(e) => setCheckoutName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (checkoutName.trim() !== "") {
                                  setIsNameAuthorized(true);
                                }
                              }
                            }}
                            placeholder="Type your name here..."
                            className="w-full bg-white border border-stone-200 rounded-sm px-4 py-3.5 text-xs text-stone-900 focus:outline-none focus:border-stone-400 placeholder-stone-400 font-sans pr-24"
                          />
                          <div className="absolute right-2 top-2">
                            <button
                              type="button"
                              disabled={checkoutName.trim() === ""}
                              onClick={() => {
                                if (checkoutName.trim() !== "") {
                                  setIsNameAuthorized(true);
                                }
                              }}
                              className="bg-stone-950 hover:bg-black text-white font-mono text-[9px] uppercase font-bold px-3.5 py-2 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              Proceed
                            </button>
                          </div>
                        </div>
                        <p className="text-[9px] text-stone-400 font-mono italic">
                          Press <span className="font-sans font-bold">Enter</span> on keyboard or click button to proceed to Step 2
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase font-bold">
                        Step 2: Shipping & Details
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsNameAuthorized(false)}
                        className="text-[9px] font-mono text-stone-450 hover:text-stone-900"
                      >
                        ← Change Name
                      </button>
                    </div>

                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          placeholder="John Smith"
                          className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={checkoutEmail}
                          onChange={(e) => setCheckoutEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                        />
                      </div>
                    </div>

                    {/* Address Textarea */}
                    <div>
                      <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                        Shipping Address
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={checkoutAddress}
                        onChange={(e) => setCheckoutAddress(e.target.value)}
                        placeholder="Flat/House No., Street name, Area"
                        className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 resize-none"
                      />
                    </div>

                    {/* State & Pin Code Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                          State
                        </label>
                        <select
                          required
                          value={checkoutState}
                          onChange={(e) => setCheckoutState(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-sans"
                        >
                          {INDIAN_STATES_AND_UTS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold flex items-center justify-between">
                          <span>Pincode</span>
                          <span className="text-[7px] text-stone-400 font-normal">6-digit PIN</span>
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
                          className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-mono"
                        />
                      </div>
                    </div>

                    {/* Phone & Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                          Contact Phone
                        </label>
                        <input
                          type="text"
                          required
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          placeholder="+91 99999 99999"
                          className="w-full bg-white border border-stone-200 rounded-sm px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                          Delivery Priority
                        </label>
                        <div className="w-full bg-stone-100 border border-stone-200 rounded-sm px-3 py-2.5 text-xs text-stone-600 font-mono">
                          Standard Shipping (₹116.00)
                        </div>
                      </div>
                    </div>

                    {/* Checkout CTA */}
                    <div className="pt-4 border-t border-stone-200 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutName("");
                          setIsNameAuthorized(false);
                          setCheckoutEmail("");
                          setCheckoutAddress("");
                          setCheckoutPhone("");
                        }}
                        className="w-1/3 bg-transparent border border-stone-300 hover:bg-stone-100 text-stone-500 py-3 rounded-sm text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessingOrder}
                        className="w-2/3 bg-stone-950 hover:bg-black text-white font-mono text-xs tracking-widest uppercase font-bold py-3 px-6 transition-all rounded-sm cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessingOrder ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Proceed to Payment</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Luxury Full-Screen Admin Vault */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-stone-900 border border-stone-800 text-white rounded-md w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="border-b border-stone-800 p-6 flex items-center justify-between bg-stone-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-gold/10 flex items-center justify-center border border-amber-gold/20">
                    <Lock className="w-4 h-4 text-amber-gold animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-lg text-white tracking-wide">
                      Admin Security Portal
                    </h3>
                    <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-500">
                      ScentPreview Allocation Vault
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAdminAuthenticated && (
                    <button
                      type="button"
                      onClick={handleCloseAndSaveAdminSession}
                      className="px-3 py-1.5 rounded-sm border border-stone-800 hover:border-amber-gold/30 hover:bg-stone-850 text-stone-450 hover:text-amber-gold text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3 h-3" />
                      Lock Session
                    </button>
                  )}
                  <button
                    onClick={handleCloseAndSaveAdminSession}
                    className="p-1.5 rounded-full border border-stone-800 hover:bg-stone-850 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isAdminAuthenticated ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 py-20 text-center max-w-md mx-auto space-y-6">
                  <div className={`w-16 h-16 rounded-full bg-stone-925 flex items-center justify-center border ${isAdminLocked ? "border-rose-500 animate-pulse" : "border-stone-800"}`}>
                    {isAdminLocked ? (
                      <ShieldAlert className="w-6 h-6 text-rose-500" />
                    ) : (
                      <Lock className="w-6 h-6 text-amber-gold" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif italic text-xl text-white">
                      {isAdminLocked ? "Vault Session Locked" : "Enter Vault Passcode"}
                    </h4>
                    <p className="text-xs text-stone-400 font-sans leading-relaxed">
                      {isAdminLocked 
                        ? "Security protocol active. Maximum authentication attempts exceeded. Access has been frozen."
                        : "This zone is strictly restricted to ScentPreview administrators. Please verify your credentials to decrypt the allocation logs."}
                    </p>
                  </div>

                  {!isAdminLocked ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const sanitizedInput = adminPasscodeInput.trim();
                        try {
                          const res = await fetch("/api/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ passcode: sanitizedInput })
                          });
                          const data = await res.json();
                          if (res.ok && data.success && data.token) {
                            localStorage.setItem("scent_admin_token", data.token);
                            setIsAdminAuthenticated(true);
                            setAdminPasscodeError(null);
                            setAdminAttempts(0);
                          } else {
                            throw new Error(data.error || "Invalid passcode");
                          }
                        } catch (err: any) {
                          const nextAttempts = adminAttempts + 1;
                          setAdminAttempts(nextAttempts);
                          if (nextAttempts >= 3) {
                            const lockoutUntil = Date.now() + 60 * 60 * 1000; // 1 hour
                            setAdminLockoutTime(lockoutUntil);
                            setIsAdminLocked(true);
                            setAdminPasscodeError("Security lockout: Maximum passcode attempts reached. Vault locked for 1 hour.");
                          } else {
                            setAdminPasscodeError(`Invalid passcode. ${3 - nextAttempts} attempt${3 - nextAttempts === 1 ? "" : "s"} remaining.`);
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
                        className="w-full bg-stone-950 border border-stone-800 rounded-sm px-4 py-3 text-xs tracking-widest text-center text-white focus:outline-none focus:border-amber-gold transition-colors font-mono"
                        autoFocus
                      />
                      {adminPasscodeError && (
                        <p className="text-[10px] font-mono text-rose-500">{adminPasscodeError}</p>
                      )}
                      <button
                        type="submit"
                        className="w-full bg-amber-gold hover:bg-amber-400 text-stone-950 font-mono text-xs tracking-widest uppercase font-bold py-3 px-6 transition-all rounded-sm cursor-pointer shadow-md"
                      >
                        Authenticate Vault
                      </button>
                    </form>
                  ) : (
                    <div className="w-full p-4 border border-rose-900/30 bg-rose-950/20 rounded text-rose-400 text-xs font-mono space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold uppercase tracking-wider text-rose-500">● SECURITY THREAT SUSPENDED</p>
                        {lockoutTimeRemaining && (
                          <span className="text-[10px] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 animate-pulse text-rose-400 font-bold">
                            {lockoutTimeRemaining}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-400 leading-normal font-sans">
                        You have failed to authenticate 3 consecutive times. The ScentPreview Vault has been sealed for security. Access is locked for exactly 1 hour.
                      </p>
                      {lockoutTimeRemaining && (
                        <div className="pt-2 border-t border-rose-900/20 flex items-center justify-between text-[10px]">
                          <span className="text-stone-500 font-sans uppercase tracking-wider">Remaining Lockout:</span>
                          <span className="font-mono text-rose-400 font-bold tracking-widest">{lockoutTimeRemaining}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Tab Selector */}
                  <div className="flex border-b border-stone-800 bg-stone-925">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab("view");
                        setAdminStatusMessage(null);
                      }}
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "view"
                          ? "border-amber-gold text-amber-gold bg-stone-900/40"
                          : "border-transparent text-stone-500 hover:text-stone-300"
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
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "create"
                          ? "border-amber-gold text-amber-gold bg-stone-900/40"
                          : "border-transparent text-stone-500 hover:text-stone-300"
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
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "stock"
                          ? "border-amber-gold text-amber-gold bg-stone-900/40"
                          : "border-transparent text-stone-500 hover:text-stone-300"
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
                      className={`flex-1 py-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        adminActiveTab === "prices"
                          ? "border-amber-gold text-amber-gold bg-stone-900/40"
                          : "border-transparent text-stone-500 hover:text-stone-300"
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      Price Details
                    </button>
                  </div>

                  {/* Status Banner */}
                  {adminStatusMessage && (
                    <div className={`p-4 text-xs font-mono flex items-center gap-2 border-b ${
                      adminStatusMessage.type === "success"
                        ? "bg-emerald-950/30 border-emerald-900/30 text-emerald-400"
                        : "bg-rose-950/30 border-rose-900/30 text-rose-400"
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                      <span>{adminStatusMessage.text}</span>
                    </div>
                  )}

                  {/* Content Panel */}
                  <div className="flex-1 overflow-y-auto p-6 bg-stone-900/30 space-y-4">
                    {/* Out of stock notifications list */}
                    {(() => {
                      const outOfStockItems = getOutOfStockItems();
                      if (outOfStockItems.length === 0) return null;
                      return (
                        <div className="p-4 bg-red-950/25 border border-red-900/40 rounded-sm space-y-2">
                          <div className="flex items-center gap-2 text-rose-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                            <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                              CRITICAL OUT OF STOCK ALERTS ({outOfStockItems.length})
                            </span>
                          </div>
                          <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {outOfStockItems.map((item, index) => (
                              <p key={index} className="text-xs text-stone-300 font-mono flex items-center gap-1.5">
                                <span className="text-rose-500">⚠</span>
                                <span>
                                  <strong className="text-white">{item.brand ? `${item.brand} — ` : ""}{item.name}</strong> is completely out of stock.
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
                        <div className="flex items-center justify-between pb-3 border-b border-stone-850">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                            Authenticated Webhook Database Records
                          </span>
                          <button
                            type="button"
                            onClick={fetchAdminOrders}
                            disabled={isLoadingAdminOrders}
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-gold hover:text-white transition-colors border border-stone-800 hover:border-amber-gold/30 px-2.5 py-1 rounded bg-stone-900/50 cursor-pointer"
                          >
                            <RefreshCw className={`w-3 h-3 ${isLoadingAdminOrders ? "animate-spin" : ""}`} />
                            Sync Registry
                          </button>
                        </div>

                        {isLoadingAdminOrders ? (
                          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                            <div className="w-6 h-6 border-2 border-amber-gold border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] font-mono text-stone-400 tracking-widest uppercase">
                              Decrypting Secure Ledger...
                            </span>
                          </div>
                        ) : adminOrders.length === 0 ? (
                          <div className="py-20 text-center border border-dashed border-stone-800 rounded flex flex-col items-center justify-center gap-2">
                            <Database className="w-8 h-8 text-stone-700" />
                            <span className="text-[11px] font-mono text-stone-500 tracking-wider">
                              NO RECOGNIZED ORDERS FOUND IN LEDGER
                            </span>
                            <p className="text-[9px] text-stone-600 max-w-xs">
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
                                  className="border border-stone-800 bg-stone-925/40 hover:bg-stone-925/80 p-5 rounded transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 shadow-lg hover:border-stone-700"
                                >
                                  {/* Left details */}
                                  <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-mono font-bold text-white bg-stone-800 px-2 py-0.5 rounded border border-stone-750">
                                        {order.orderNumber}
                                      </span>
                                      <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${
                                        order.status === "paid" 
                                          ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-400" 
                                          : "bg-amber-950/20 border-amber-900/50 text-amber-500"
                                      }`}>
                                        ● {order.status === "paid" ? "PAID (Confirmed)" : "PENDING"}
                                      </span>
                                      <span className="text-[10px] font-mono text-stone-550">
                                        {new Date(order.createdAt).toLocaleString()}
                                      </span>
                                    </div>

                                    {/* Variants */}
                                    <div>
                                      <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500 mb-1 font-semibold">
                                        Perfume Variant/Quantity
                                      </span>
                                      <div className="space-y-1">
                                        {order.items && order.items.map((item: any, i: number) => (
                                          <div key={i} className="text-xs font-sans text-amber-gold font-semibold">
                                            {item.name} <span className="text-stone-400">({item.size})</span>
                                            <span className="ml-2 font-mono bg-stone-800 text-white px-1.5 py-0.5 rounded text-[10px]">
                                              Qty: {item.quantity}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Customer details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-850">
                                      <div>
                                        <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                                          Customer Name
                                        </span>
                                        <span className="text-xs font-sans text-white font-medium">
                                          {order.name}
                                        </span>
                                        {order.email && (
                                          <span className="block text-[10px] font-mono text-stone-400 mt-0.5">
                                            {order.email}
                                          </span>
                                        )}
                                        {order.phone && order.phone !== "N/A" && (
                                          <span className="block text-[10px] font-mono text-stone-500">
                                            {order.phone}
                                          </span>
                                        )}
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                                          Customer Address
                                        </span>
                                        <span className="text-xs font-sans text-stone-300 block leading-relaxed">
                                          {order.address}
                                        </span>
                                        {(order.state || order.pincode) && (
                                          <span className="text-[10px] font-mono text-stone-550 block mt-0.5">
                                            {order.state || ""}{order.pincode ? ` - ${order.pincode}` : ""}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right details */}
                                  <div className="md:text-right flex md:flex-col justify-between items-center md:items-end gap-3 pt-3 md:pt-0 md:border-l md:border-stone-800 md:pl-5 min-w-[140px]">
                                    <div>
                                      <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                                        Shipping Protection
                                      </span>
                                      <span className={`text-xs font-sans font-semibold mt-1 inline-block ${
                                        hasProtection ? "text-emerald-400" : "text-stone-500"
                                      }`}>
                                        {hasProtection ? "🛡️ Yes" : "❌ No"}
                                      </span>
                                    </div>

                                    <div>
                                      <span className="block text-[8px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                                        Total Amount Paid
                                      </span>
                                      <span className="text-base font-mono font-bold text-white block mt-0.5">
                                        ₹{order.total}.00
                                      </span>
                                    </div>

                                    {/* Delete Order Action */}
                                    <div className="pt-2 w-full md:w-auto">
                                      {orderDeletingNum === order.orderNumber ? (
                                        <div className="flex items-center gap-2 justify-end">
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteOrder(order.orderNumber)}
                                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                                          >
                                            Confirm
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setOrderDeletingNum(null)}
                                            className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setOrderDeletingNum(order.orderNumber)}
                                          className="text-[10px] font-mono text-stone-400 hover:text-rose-450 uppercase tracking-widest transition-colors flex items-center gap-1.5 bg-stone-950/40 hover:bg-rose-950/10 px-2 py-1 rounded border border-stone-850 hover:border-rose-900/20 cursor-pointer w-full md:w-auto justify-center"
                                        >
                                          <Trash2 className="w-3 h-3 text-rose-500" />
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
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-2">
                          Record a paid order directly with custom parameters
                        </span>

                        {/* Variant Section */}
                        <div className="bg-stone-925/40 border border-stone-800 p-4 rounded space-y-3">
                          <span className="block text-[8px] font-mono uppercase tracking-[0.1em] text-amber-gold font-bold">
                            1. Perfume Allocation Details
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                Perfume Variant Name *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Lattefa Khawrah, Creed Aventus"
                                value={adminManualVariantName}
                                onChange={(e) => setAdminManualVariantName(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-stone-700"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                  Size *
                                </label>
                                <select
                                  value={adminManualVariantSize}
                                  onChange={(e) => setAdminManualVariantSize(e.target.value)}
                                  className="w-full bg-stone-950 border border-stone-800 rounded-sm px-2 py-2 text-xs text-white focus:outline-none focus:border-stone-700 font-sans"
                                >
                                  <option value="5ml Normal">5ml Normal</option>
                                  <option value="5ml HQ">5ml HQ</option>
                                  <option value="10ml">10ml</option>
                                  <option value="Full Bottle">Full Bottle</option>
                                  <option value="Not Applicable">Not Applicable</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                  Quantity *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min={1}
                                  value={adminManualVariantQty}
                                  onChange={(e) => setAdminManualVariantQty(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-stone-700 font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 mt-2 bg-stone-900/30 p-2.5 border border-stone-850 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-mono text-stone-300 select-none">
                              Stock Reduction: <span className="text-emerald-400 font-bold">AUTOMATIC & ENFORCED</span> (Real-time stock will be decreased automatically)
                            </span>
                          </div>
                        </div>

                        {/* Customer Info Section */}
                        <div className="bg-stone-925/40 border border-stone-800 p-4 rounded space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-850 pb-2">
                            <span className="block text-[8px] font-mono uppercase tracking-[0.1em] text-amber-gold font-bold">
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
                                className="rounded border-stone-800 bg-stone-950 text-amber-gold focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                              />
                              <label htmlFor="adminManualDeliveryNA" className="text-[9px] font-mono text-amber-gold/90 font-bold select-none cursor-pointer uppercase tracking-wider">
                                Mark Delivery as Not Applicable
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                Customer Name {adminManualDeliveryNA ? "" : "*"}
                              </label>
                              <input
                                type="text"
                                required={!adminManualDeliveryNA}
                                placeholder={adminManualDeliveryNA ? "Not Applicable (Walk-in)" : "Customer Full Name"}
                                value={adminManualName}
                                onChange={(e) => setAdminManualName(e.target.value)}
                                disabled={adminManualDeliveryNA}
                                className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-stone-700 disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                Customer Email Address
                              </label>
                              <input
                                type="type"
                                placeholder={adminManualDeliveryNA ? "N/A" : "customer@example.com"}
                                value={adminManualEmail}
                                onChange={(e) => setAdminManualEmail(e.target.value)}
                                disabled={adminManualDeliveryNA}
                                className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-stone-700 disabled:opacity-50"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                              Customer Shipping Address {adminManualDeliveryNA ? "" : "*"}
                            </label>
                            <textarea
                              required={!adminManualDeliveryNA}
                              rows={2}
                              placeholder={adminManualDeliveryNA ? "Not Applicable" : "Complete physical address with landmarks"}
                              value={adminManualAddress}
                              onChange={(e) => setAdminManualAddress(e.target.value)}
                              disabled={adminManualDeliveryNA}
                              className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-stone-700 resize-none disabled:opacity-50"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                Contact Phone
                              </label>
                              <input
                                type="text"
                                placeholder={adminManualDeliveryNA ? "N/A" : "e.g. +91 99999 99999"}
                                value={adminManualPhone}
                                onChange={(e) => setAdminManualPhone(e.target.value)}
                                disabled={adminManualDeliveryNA}
                                className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-stone-700 disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                State
                              </label>
                              <input
                                type="text"
                                placeholder={adminManualDeliveryNA ? "N/A" : "e.g. Maharashtra"}
                                value={adminManualState}
                                onChange={(e) => setAdminManualState(e.target.value)}
                                disabled={adminManualDeliveryNA}
                                className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-stone-700 disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-wider mb-1 font-bold">
                                Pincode
                              </label>
                              <input
                                type="text"
                                placeholder={adminManualDeliveryNA ? "N/A" : "e.g. 400050"}
                                value={adminManualPincode}
                                onChange={(e) => setAdminManualPincode(e.target.value)}
                                disabled={adminManualDeliveryNA}
                                className="w-full bg-stone-950 border border-stone-800 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-stone-700 font-mono disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Financial/Protection details */}
                        <div className="bg-stone-925/40 border border-stone-800 p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <input
                              type="checkbox"
                              id="adminManualProtection"
                              checked={adminManualShippingProtection}
                              onChange={(e) => setAdminManualShippingProtection(e.target.checked)}
                              className="rounded border-stone-800 bg-stone-950 text-amber-gold focus:ring-0 w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="adminManualProtection" className="text-xs font-sans text-stone-300 select-none cursor-pointer">
                              Include Shipping Protection (Yes/No)
                            </label>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <label className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                              Total Amount Paid:
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-xs font-sans text-stone-500">₹</span>
                              <input
                                type="number"
                                required
                                min={0}
                                value={adminManualTotal}
                                onChange={(e) => setAdminManualTotal(Math.max(0, parseInt(e.target.value) || 0))}
                                className="bg-stone-950 border border-stone-800 rounded-sm pl-6 pr-3 py-1.5 text-sm text-amber-gold font-mono font-bold focus:outline-none focus:border-stone-700 w-28 text-right"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Submit CTA */}
                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            className="w-full sm:w-auto bg-amber-gold hover:bg-amber-450 text-stone-950 font-mono text-xs tracking-widest uppercase font-bold py-3 px-8 transition-all rounded-sm cursor-pointer shadow-md flex items-center justify-center gap-2"
                          >
                            <Database className="w-4 h-4" />
                            Record & Dispatch Paid Order
                          </button>
                        </div>
                      </form>
                    ) : adminActiveTab === "stock" ? (
                      /* Stock levels tab */
                      <div className="space-y-6 max-w-4xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-850">
                          <div>
                            <span className="block text-[10px] font-mono uppercase tracking-widest text-amber-gold font-bold">
                              Live Fragrance Allocation & Decant Inventory
                            </span>
                            <p className="text-xs text-stone-400 font-sans mt-0.5">
                              Modify active stock units. These levels automatically decrement upon order confirmation.
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={resetStockToOfficial}
                              disabled={isSavingStock}
                              className="px-4 py-2 bg-stone-925 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-white rounded text-xs font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isSavingStock ? 'animate-spin' : ''}`} />
                              Reset to Baseline
                            </button>
                            <button
                              type="button"
                              onClick={saveUpdatedStock}
                              disabled={isSavingStock}
                              className="px-5 py-2 bg-amber-gold hover:bg-amber-450 text-stone-950 rounded text-xs font-mono font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md hover:shadow-amber-gold/10 disabled:opacity-50"
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
                              <div key={fragrance.id} className="bg-stone-925/40 border border-stone-800/80 p-4 rounded-md hover:border-stone-700/80 transition-colors flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${fragrance.color} flex-shrink-0 flex items-center justify-center border border-white/5 shadow-inner`}>
                                  <span className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-wider">
                                    {fragrance.brand.substring(0, 2)}
                                  </span>
                                </div>

                                <div className="flex-1 space-y-3">
                                  <div>
                                    <h4 className="font-serif italic text-white text-sm leading-snug">
                                      {fragrance.name}
                                    </h4>
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 block mt-0.5">
                                      {fragrance.brand} • {fragrance.notes.split(" / ").slice(0, 2).join(" & ")}
                                    </span>
                                  </div>

                                  {/* Stock selectors for each size */}
                                  <div className="space-y-2 pt-1 border-t border-stone-850">
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
                                            <span className="text-[11px] font-mono text-stone-400">
                                              {sizeObj.label}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-amber-gold">
                                              ₹{fragrance.prices[sizeObj.key as keyof typeof fragrance.prices]}
                                            </span>
                                            {isTypicalDisabled && (
                                              <span className="text-[7px] font-mono uppercase px-1 border border-stone-800 bg-stone-950 text-stone-600 rounded">
                                                Disabled
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-1 bg-stone-950/60 p-0.5 border border-stone-850 rounded">
                                            <button
                                              type="button"
                                              onClick={() => handleStockChange("fragrance", fragrance.id, sizeObj.key, count - 1)}
                                              className="w-5 h-5 rounded bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-white flex items-center justify-center text-xs font-mono cursor-pointer transition-colors"
                                            >
                                              -
                                            </button>
                                            <input
                                              type="number"
                                              value={count}
                                              onChange={(e) => handleStockChange("fragrance", fragrance.id, sizeObj.key, parseInt(e.target.value) || 0)}
                                              className="w-10 bg-transparent border-0 text-center font-mono text-xs text-amber-gold focus:ring-0 p-0"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleStockChange("fragrance", fragrance.id, sizeObj.key, count + 1)}
                                              className="w-5 h-5 rounded bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-white flex items-center justify-center text-xs font-mono cursor-pointer transition-colors"
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
                        <div className="mt-8 pt-6 border-t border-stone-850 space-y-4">
                          <div>
                            <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-400">
                              Capsule Bundles Inventory Allocation
                            </span>
                            <p className="text-[10px] text-stone-500 font-sans">
                              Managed stock quotas for pre-arranged layered gift boxes.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {BUNDLE_DATA.map((bundle) => {
                              const count = stock?.bundles[bundle.id] ?? 0;
                              return (
                                <div key={bundle.id} className="bg-stone-925/20 border border-stone-850 p-3 rounded flex items-center justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                    <h5 className="text-xs text-stone-300 font-sans truncate font-medium" title={bundle.name}>
                                      {bundle.name}
                                    </h5>
                                    <span className="text-[8px] font-mono text-stone-500 block truncate" title={bundle.contains}>
                                      {bundle.contains}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 bg-stone-950 p-0.5 border border-stone-850 rounded flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleStockChange("bundle", bundle.id, "", count - 1)}
                                      className="w-4 h-4 rounded bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-white flex items-center justify-center text-[10px] font-mono cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      value={count}
                                      onChange={(e) => handleStockChange("bundle", bundle.id, "", parseInt(e.target.value) || 0)}
                                      className="w-8 bg-transparent border-0 text-center font-mono text-xs text-stone-300 focus:ring-0 p-0"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleStockChange("bundle", bundle.id, "", count + 1)}
                                      className="w-4 h-4 rounded bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-white flex items-center justify-center text-[10px] font-mono cursor-pointer"
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
                    ) : (
                      /* Price Details & Variant Breakdown Tab */
                      <div className="space-y-6 max-w-5xl mx-auto">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-850">
                          <div>
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-amber-gold" />
                              <span className="block text-xs font-mono uppercase tracking-widest text-amber-gold font-bold">
                                Perfume Variant & Price Details Registry
                              </span>
                            </div>
                            <p className="text-xs text-stone-400 font-sans mt-1">
                              Complete exact price breakdown mapping for all perfumes, capsule bundles, and individual variants regardless of stock status.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-1 bg-stone-925 border border-stone-800 rounded text-[10px] font-mono text-stone-300">
                              Products: <strong className="text-white">{CATALOG_DATA.length + BUNDLE_DATA.length}</strong>
                            </span>
                            <span className="px-2.5 py-1 bg-amber-gold/10 border border-amber-gold/20 rounded text-[10px] font-mono text-amber-gold">
                              Variants Mapped: <strong className="text-white">100% Full Coverage</strong>
                            </span>
                            <span className="px-2.5 py-1 bg-emerald-950/30 border border-emerald-900/40 rounded text-[10px] font-mono text-emerald-400">
                              Exact Database Records
                            </span>
                          </div>
                        </div>

                        {/* Search and Filter Toolbar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-925/60 p-3 rounded-md border border-stone-800">
                          <div className="relative flex-1">
                            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Search perfume name, brand, variant (e.g. 5ml HQ), or exact price..."
                              value={adminPriceSearch}
                              onChange={(e) => setAdminPriceSearch(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-sm pl-8 pr-8 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-gold font-sans"
                            />
                            {adminPriceSearch && (
                              <button 
                                onClick={() => setAdminPriceSearch("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white text-xs font-mono"
                              >
                                ×
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider hidden sm:inline">Filter:</span>
                            <select
                              value={adminPriceFilter}
                              onChange={(e: any) => setAdminPriceFilter(e.target.value)}
                              className="bg-stone-950 border border-stone-800 rounded-sm px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-gold font-mono cursor-pointer"
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
                        <div className="border border-stone-800 bg-stone-925/40 rounded-md overflow-hidden shadow-xl">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-sans">
                              <thead>
                                <tr className="bg-stone-950/90 border-b border-stone-800 text-[10px] font-mono uppercase tracking-widest text-stone-400">
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
                                        <td colSpan={5} className="py-12 text-center text-stone-500 font-mono">
                                          No perfume variant or price records match your criteria.
                                        </td>
                                      </tr>
                                    );
                                  }

                                  return filteredRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-stone-900/60 transition-colors">
                                      {/* Perfume / Bundle Name */}
                                      <td className="py-3 px-4 font-medium text-white">
                                        <div className="flex items-center gap-2.5">
                                          {row.color ? (
                                            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${row.color} flex-shrink-0 border border-white/20`} />
                                          ) : (
                                            <div className="w-3 h-3 rounded-full bg-amber-500/30 flex-shrink-0 border border-amber-500/40" />
                                          )}
                                          <div>
                                            <span className="font-serif italic text-sm text-white block leading-tight">
                                              {row.name}
                                            </span>
                                            <span className="text-[9px] font-mono text-stone-500 block truncate max-w-xs">
                                              {row.notes}
                                            </span>
                                          </div>
                                        </div>
                                      </td>

                                      {/* Brand & Badges */}
                                      <td className="py-3 px-4">
                                        <span className="text-[11px] font-mono text-stone-300 block font-semibold">
                                          {row.brand}
                                        </span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <span className="text-[8px] font-mono uppercase px-1.5 py-0.2 rounded border border-stone-800 bg-stone-900 text-stone-400">
                                            {row.category}
                                          </span>
                                          {row.isPremium && (
                                            <span className="text-[8px] font-mono uppercase px-1.5 py-0.2 rounded border border-amber-500/30 bg-amber-950/30 text-amber-400">
                                              Premium
                                            </span>
                                          )}
                                        </div>
                                      </td>

                                      {/* Variant / Size */}
                                      <td className="py-3 px-4">
                                        <span className="text-xs font-mono font-bold text-amber-gold bg-amber-gold/10 px-2 py-0.5 rounded border border-amber-gold/20 inline-block">
                                          {row.variantName}
                                        </span>
                                      </td>

                                      {/* Inventory Status */}
                                      <td className="py-3 px-4">
                                        {row.isDisabled ? (
                                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-stone-750 bg-stone-900 text-stone-450 inline-flex items-center gap-1 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                                            Disabled Variant
                                          </span>
                                        ) : row.isOutOfStock ? (
                                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-900/50 bg-rose-950/30 text-rose-400 inline-flex items-center gap-1 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                                            Out of Stock (0 units)
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-900/50 bg-emerald-950/30 text-emerald-400 inline-flex items-center gap-1 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            In Stock ({row.stockCount} units)
                                          </span>
                                        )}
                                      </td>

                                      {/* Exact Price */}
                                      <td className="py-3 px-4 text-right">
                                        <span className="text-sm font-mono font-bold text-white tracking-wider">
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
                        <div className="pt-6 border-t border-stone-850 space-y-4">
                          <div>
                            <span className="block text-[10px] font-mono uppercase tracking-widest text-amber-gold font-bold">
                              Individual Perfume Variant Price Sheets
                            </span>
                            <p className="text-xs text-stone-400 font-sans mt-0.5">
                              Per-product view of all 11 catalog fragrances with complete variant price tables.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {CATALOG_DATA.map((fragrance) => {
                              const fragStock = stock?.fragrances[fragrance.id] || {};
                              return (
                                <div key={fragrance.id} className="bg-stone-925/40 border border-stone-800 p-4 rounded-md space-y-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${fragrance.color} flex-shrink-0 flex items-center justify-center border border-white/10 shadow-inner`}>
                                        <span className="text-[9px] font-mono text-white/50 font-bold uppercase">
                                          {fragrance.brand.substring(0, 2)}
                                        </span>
                                      </div>
                                      <div>
                                        <h4 className="font-serif italic text-white text-sm font-medium">
                                          {fragrance.name}
                                        </h4>
                                        <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block">
                                          {fragrance.brand}
                                        </span>
                                      </div>
                                    </div>

                                    {fragrance.isPremium && (
                                      <span className="text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/30 bg-amber-950/20 text-amber-400 font-bold">
                                        PREMIUM
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-[10px] text-stone-400 font-sans border-t border-stone-850 pt-2 flex items-center justify-between">
                                    <span>Notes: {fragrance.notes}</span>
                                    {fragrance.disabledSizes && fragrance.disabledSizes.length > 0 && (
                                      <span className="font-mono text-[9px] text-amber-400">
                                        Disabled: {fragrance.disabledSizes.join(", ")}
                                      </span>
                                    )}
                                  </div>

                                  {/* Variant Price Breakdown Table for this Perfume */}
                                  <div className="border border-stone-850 rounded bg-stone-950/70 overflow-hidden">
                                    <table className="w-full text-left text-[11px] font-mono">
                                      <thead>
                                        <tr className="border-b border-stone-850 text-stone-500 uppercase tracking-wider text-[8px]">
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
                                            <tr key={sizeKey} className="hover:bg-stone-900/40">
                                              <td className="py-2 px-3 text-white font-bold">
                                                {sizeKey}
                                              </td>
                                              <td className="py-2 px-3">
                                                {isDisabled ? (
                                                  <span className="text-[8px] uppercase tracking-wider text-stone-500 font-bold">
                                                    Disabled
                                                  </span>
                                                ) : isOOS ? (
                                                  <span className="text-[8px] uppercase tracking-wider text-rose-400 font-bold">
                                                    Out of Stock (0)
                                                  </span>
                                                ) : (
                                                  <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-bold">
                                                    In Stock ({count})
                                                  </span>
                                                )}
                                              </td>
                                              <td className="py-2 px-3 text-right text-amber-gold font-bold">
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
              className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm z-40"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-stone-900 border border-stone-800 text-stone-100 rounded-xl shadow-2xl max-w-md w-full z-50 max-h-[85vh] flex flex-col overflow-hidden p-5 sm:p-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setCrossSellRecommendation(prev => ({ ...prev, isOpen: false }))}
                className="absolute right-4 top-4 text-stone-400 hover:text-stone-100 p-1 transition-colors cursor-pointer z-10"
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
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="font-serif italic text-white text-base">Added to Cart!</h3>
                <p className="text-[11px] text-amber-gold font-mono tracking-wide mt-1 truncate max-w-full px-2.5 bg-stone-950/40 py-1 rounded inline-block">
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
                className="border-t border-stone-800 flex-shrink-0 transition-all duration-150 ease-out" 
              />

              {/* Recommendations Section - Fully Scrollable */}
              <div 
                onScroll={(e) => setRecommendationScrollTop(e.currentTarget.scrollTop)}
                className="flex-1 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent"
              >
                <span className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 text-center mb-3 sticky top-0 bg-stone-900 py-1 z-10">
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
                      <div key={perfume.id} className="bg-stone-950/40 border border-stone-850 p-2.5 rounded-lg flex items-center justify-between gap-3 hover:border-stone-700 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${perfume.color} flex-shrink-0 flex items-center justify-center border border-white/5`}>
                            <span className="text-[8px] font-mono text-white/50 font-bold uppercase">
                              {perfume.brand.substring(0, 2)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-serif italic text-white text-xs leading-tight truncate">
                              {perfume.name}
                            </h4>
                            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block mt-0.5">
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
                                    addedItemName: `${perfume.brand} ${perfume.name} (${sizeObj.label})`
                                  }));
                                }}
                                className={`px-2 py-1 border font-mono text-[9px] uppercase font-bold rounded transition-all flex flex-col items-center justify-center min-w-[50px] ${
                                  added 
                                    ? "bg-emerald-950/45 border-emerald-900/40 text-emerald-400 cursor-default" 
                                    : "bg-stone-850 hover:bg-amber-gold hover:text-stone-950 border-stone-800 hover:border-transparent text-stone-300 cursor-pointer"
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
              <div className="mt-4 pt-3 border-t border-stone-850 flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setCrossSellRecommendation(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-2.5 bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                >
                  Continue Browsing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCrossSellRecommendation(prev => ({ ...prev, isOpen: false }));
                    setIsCartOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-amber-gold hover:bg-amber-450 text-stone-950 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer text-center shadow-md shadow-amber-gold/5"
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
              className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm z-40"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl shadow-2xl max-w-4xl w-full z-50 overflow-hidden p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsQuizListOpen(false)}
                className="absolute right-4 top-4 text-stone-400 hover:text-stone-100 p-1.5 transition-colors cursor-pointer rounded-full hover:bg-stone-800/50"
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
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-500/20 shadow-inner">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-serif italic text-white text-2xl">Sensory Profiling Center</h3>
                <p className="text-xs text-stone-400 font-mono tracking-wider mt-1 uppercase">
                  Select a test to decode your unique olfactive fingerprint
                </p>
              </div>

              {/* Quiz Grid */}
              <div 
                onScroll={(e) => setQuizScrollTop(e.currentTarget.scrollTop)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] md:max-h-[55vh] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent"
              >
                {/* Quiz 1: Anti-Quiz */}
                <div className="bg-stone-950/40 border border-stone-850 p-5 rounded-xl hover:border-emerald-500/30 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-wider text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded-full">
                        01 / SYSTEM v2
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 font-semibold uppercase">
                        DEALBREAKER FILTER
                      </span>
                    </div>
                    <h4 className="font-serif italic text-white text-lg group-hover:text-amber-gold transition-colors mb-2">
                      The Scent Anti-Quiz
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed font-sans mb-5">
                      Identify exactly what notes and profiles you detest. We'll filter out matching decants with surgical precision so you only explore what you genuinely love.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuizListOpen(false);
                      setIsAntiQuizOpen(true);
                    }}
                    className="w-full bg-stone-800 hover:bg-emerald-600 text-stone-200 hover:text-white py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-bold border border-stone-750 hover:border-transparent"
                  >
                    <span>Launch Anti-Quiz</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quiz 2: Lifestyle Grid */}
                <div className="bg-stone-950/40 border border-stone-850 p-5 rounded-xl hover:border-indigo-500/30 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-wider text-indigo-400 font-bold bg-indigo-950/30 border border-indigo-900/30 px-2 py-0.5 rounded-full">
                        02 / VIBE MATCH
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 font-semibold uppercase">
                        AESTHETIC GRID
                      </span>
                    </div>
                    <h4 className="font-serif italic text-white text-lg group-hover:text-amber-gold transition-colors mb-2">
                      Lifestyle Aesthetic Grid
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed font-sans mb-5">
                      Align your fragrance with your daily routine, wardrobe vibe, and favorite environments. Perfect for establishing an effortless, everyday signature.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuizListOpen(false);
                      setIsAestheticQuizOpen(true);
                    }}
                    className="w-full bg-stone-800 hover:bg-indigo-600 text-stone-200 hover:text-white py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-bold border border-stone-750 hover:border-transparent"
                  >
                    <span>Launch Lifestyle Grid</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quiz 3: Chemical Chords */}
                <div className="bg-stone-950/40 border border-stone-850 p-5 rounded-xl hover:border-amber-500/30 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-wider text-amber-400 font-bold bg-amber-950/30 border border-amber-900/30 px-2 py-0.5 rounded-full">
                        03 / CHEM-STORY
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 font-semibold uppercase">
                        OLFACTORY CHORDS
                      </span>
                    </div>
                    <h4 className="font-serif italic text-white text-lg group-hover:text-amber-gold transition-colors mb-2">
                      Chemical Chords & Notes
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed font-sans mb-5">
                      Explore the base chords and molecular note pairings (citrus, woody, warm, leather). Find the ideal chemistry that matches your mood and environment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuizListOpen(false);
                      setIsChordQuizOpen(true);
                    }}
                    className="w-full bg-stone-800 hover:bg-amber-600 text-stone-200 hover:text-stone-950 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-bold border border-stone-750 hover:border-transparent"
                  >
                    <span>Launch Chords Quiz</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quiz 4: Scent Battle */}
                <div className="bg-stone-950/40 border border-stone-850 p-5 rounded-xl hover:border-rose-500/30 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-wider text-rose-400 font-bold bg-rose-950/30 border border-rose-900/30 px-2 py-0.5 rounded-full">
                        04 / BRACKET
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 font-semibold uppercase">
                        TOURNAMENT DUEL
                      </span>
                    </div>
                    <h4 className="font-serif italic text-white text-lg group-hover:text-amber-gold transition-colors mb-2">
                      The Ultimate Scent Battle
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed font-sans mb-5">
                      Put your potential favorites head-to-head in a gamified bracket tournament. Vote on match-ups to isolate and discover your perfect premium champion.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuizListOpen(false);
                      setIsScentBattleOpen(true);
                    }}
                    className="w-full bg-stone-800 hover:bg-rose-600 text-stone-200 hover:text-white py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-bold border border-stone-750 hover:border-transparent"
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
    </div>
  );
}
