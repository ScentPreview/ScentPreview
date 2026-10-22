export type SizeType = "10ml" | "5ml Normal" | "5ml HQ";

export interface Fragrance {
  id: string;
  name: string;
  brand: string;
  subdomainSlug?: string;
  isPremium: boolean;
  type?: string;
  description?: string;
  gender?: "Men" | "Women";
  isOutOfStock: boolean;
  notes: string;
  notesList: string[];
  disabledSizes?: string[]; // e.g., sizes that are explicitly unavailable
  prices: {
    "10ml": number;
    "5ml Normal": number;
    "5ml HQ": number;
  };
  color: string; // Theme color for bottle rendering
  glassStyle: string; // Styling helper
  image?: string;
}

export interface CapsuleBundle {
  id: string;
  name: string;
  contains: string;
  isOutOfStock: boolean;
  isSpotlight?: boolean;
  isGiftingBundle?: boolean;
  gender?: "Men" | "Women";
  categoryLabel?: string;
  description?: string;
  constituentIds?: string[];
  fixedPrice?: number; // Spotlights have a fixed price
  prices?: {
    "10ml": number;
    "5ml Normal": number;
    "5ml HQ": number;
  };
  image?: string;
}

export interface LayeringFeedback {
  comboName: string;
  scentProfile: string;
  harmonyScore: number;
  sillage: string;
  bestSeason: string;
  vibeDescription: string;
  isMock?: boolean;
}

export const CATALOG_DATA: Fragrance[] = [
  // MEN'S COLLECTION
  {
    id: "givenchy-gentleman",
    name: "SCENTPREVIEW Sample No. 1",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewgentlemangivenchy",
    isPremium: true,
    gender: "Men",
    isOutOfStock: false,
    type: "FORMAL / PREMIUM",
    description: "This generic vial contains authentic Givenchy Gentleman liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Givenchy.",
    notes: "Iris / Black Pepper / Leather",
    notesList: ["Iris", "Black Pepper", "Leather"],
    disabledSizes: ["10ml"],
    prices: {
      "10ml": 2115,
      "5ml Normal": 1165,
      "5ml HQ": 1221
    },
    color: "from-neutral-800 to-black",
    glassStyle: "shadow-black/50",
    image: "/images/perfumes/givenchy-gentleman.jpg"
  },
  {
    id: "la-uno-qaswa",
    name: "SCENTPREVIEW Sample No. 2",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewlaunoqaswa",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "INTENSE / BOLD",
    description: "This generic vial contains authentic La Uno Qaswa liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with La Uno.",
    notes: "Oud / Incense / Dark Woods",
    notesList: ["Oud", "Incense", "Dark Woods"],
    prices: {
      "10ml": 448,
      "5ml Normal": 332,
      "5ml HQ": 388
    },
    color: "from-stone-700 to-stone-900",
    glassStyle: "shadow-stone-800/50",
    image: "/images/perfumes/la-uno.jpg?v=final"
  },
  {
    id: "zara-for-him-black",
    name: "SCENTPREVIEW Sample No. 3",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewzaraforhimblack",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "STRUCTURED / DAILY",
    description: "This generic vial contains authentic Zara For Him Black liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Zara.",
    notes: "Ginger / Lavender / Cedarwood",
    notesList: ["Ginger", "Lavender", "Cedarwood"],
    disabledSizes: ["5ml HQ"],
    prices: {
      "10ml": 682,
      "5ml Normal": 448,
      "5ml HQ": 504
    },
    color: "from-violet-950 to-neutral-900",
    glassStyle: "shadow-purple-900/40",
    image: "/images/perfumes/for-him-black.jpg"
  },
  {
    id: "zara-seoul",
    name: "SCENTPREVIEW Sample No. 4",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewzaraseoul",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "SPORT / DAILY",
    description: "This generic vial contains 5ml of authentic Zara Seoul 532-8 liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Zara.",
    notes: "Tangerine / Lavender / Amber",
    notesList: ["Tangerine", "Lavender", "Amber"],
    disabledSizes: ["10ml", "5ml Normal"],
    prices: {
      "10ml": 528,
      "5ml Normal": 372,
      "5ml HQ": 428
    },
    color: "from-blue-600 to-blue-900",
    glassStyle: "shadow-blue-700/50",
    image: "/images/perfumes/zara-seoul-original.jpg?v=2"
  },
  {
    id: "zara-intense-dark",
    name: "SCENTPREVIEW Sample No. 5",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewzaraintensedark",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "NIGHT / CASUAL",
    description: "This generic vial contains authentic Zara Intense Dark Exclusive liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Zara.",
    notes: "Apple / Black Pepper / Tonka Bean",
    notesList: ["Apple", "Black Pepper", "Tonka Bean"],
    prices: {
      "10ml": 595,
      "5ml Normal": 405,
      "5ml HQ": 461
    },
    color: "from-stone-800 to-black",
    glassStyle: "shadow-stone-900/50",
    image: "/images/perfumes/intense-dark.jpg"
  },

  // WOMEN'S COLLECTION
  {
    id: "versace-crystal-noir",
    name: "SCENTPREVIEW Sample No. 12",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewcrystalnoir",
    isPremium: true,
    gender: "Women",
    isOutOfStock: false,
    type: "PREMIUM / ELEGANT",
    description: "This generic vial contains 5ml of authentic Versace Crystal Noir liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Versace.",
    notes: "Ginger / Cardamom / Pepper",
    notesList: ["Ginger", "Cardamom", "Pepper"],
    disabledSizes: ["10ml", "5ml HQ"],
    prices: {
      "10ml": 799,
      "5ml Normal": 799,
      "5ml HQ": 799
    },
    color: "from-purple-900 to-black",
    glassStyle: "shadow-purple-900/50",
    image: "/images/perfumes/versace-crystal-noir.jpg"
  },
  {
    id: "lattafa-khamrah",
    name: "SCENTPREVIEW Sample No. 6",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewlattafakhamrah",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "EVENING / GOURMAND",
    description: "This generic vial contains authentic Lattafa Khamrah liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Lattafa.",
    notes: "Cinnamon / Dates / Pure Vanilla",
    notesList: ["Cinnamon", "Dates", "Pure Vanilla"],
    disabledSizes: ["10ml", "5ml HQ"],
    prices: {
      "10ml": 748,
      "5ml Normal": 482,
      "5ml HQ": 538
    },
    color: "from-amber-600 to-amber-900",
    glassStyle: "shadow-amber-700/50",
    image: "/images/perfumes/lattafa-khamrah.jpg"
  },
  {
    id: "zara-rich-warm-addictive",
    name: "SCENTPREVIEW Sample No. 7",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewrichwarmaddictive",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "COZY / NIGHT OUT",
    description: "This generic vial contains authentic Zara Rich Warm Addictive liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Zara.",
    notes: "Honey / Toasted Coconut / Tobacco Leaf",
    notesList: ["Honey", "Toasted Coconut", "Tobacco Leaf"],
    prices: {
      "10ml": 648,
      "5ml Normal": 432,
      "5ml HQ": 488
    },
    color: "from-amber-500 to-amber-800",
    glassStyle: "shadow-amber-600/50",
    image: "/images/perfumes/rich-warm-addictive.jpg"
  },
  {
    id: "ck-one",
    name: "SCENTPREVIEW Sample No. 8",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewckone",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "DAILY / FRESH",
    description: "This generic vial contains authentic Calvin Klein CK One liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Calvin Klein.",
    notes: "Lemon / Green Tea / Jasmine",
    notesList: ["Lemon", "Green Tea", "Jasmine"],
    prices: {
      "10ml": 838,
      "5ml Normal": 527,
      "5ml HQ": 582
    },
    color: "from-emerald-300 to-teal-500",
    glassStyle: "shadow-emerald-400/40",
    image: "/images/perfumes/ck-one.jpg"
  },
  {
    id: "ck2",
    name: "SCENTPREVIEW Sample No. 9",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewck2",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "UNCONVENTIONAL / AIRY",
    description: "This generic vial contains authentic Calvin Klein CK2 liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Calvin Klein.",
    notes: "Wasabi / Violet Leaf / Wet Cobblestones",
    notesList: ["Wasabi", "Violet Leaf", "Wet Cobblestones"],
    prices: {
      "10ml": 1115,
      "5ml Normal": 665,
      "5ml HQ": 721
    },
    color: "from-cyan-300 to-blue-400",
    glassStyle: "shadow-cyan-400/40",
    image: "/images/perfumes/ck2.jpg"
  },
  {
    id: "zara-sunrise",
    name: "SCENTPREVIEW Sample No. 10",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewzarasunrise",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "SUMMER / CITRUS",
    description: "This generic vial contains 10ml of authentic Zara Sunrise On The Red Sand Dunes liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Zara.",
    notes: "Bergamot / Mandarin / Soft Amber",
    notesList: ["Bergamot", "Mandarin", "Soft Amber"],
    disabledSizes: ["5ml Normal", "5ml HQ"],
    prices: {
      "10ml": 682,
      "5ml Normal": 448,
      "5ml HQ": 504
    },
    color: "from-orange-400 to-amber-600",
    glassStyle: "shadow-orange-400/40",
    image: "/images/perfumes/sunrise.jpg"
  },
  {
    id: "zara-seoul-winter",
    name: "SCENTPREVIEW Sample No. 11",
    brand: "SCENTPREVIEW",
    subdomainSlug: "scentpreviewzaraseoulwinter",
    isPremium: false,
    gender: "Women",
    isOutOfStock: true,
    type: "CASUAL / FRUITY",
    description: "This generic vial contains authentic Zara Seoul Winter liquid, independently rebottled by SCENTPREVIEW. SCENTPREVIEW has no official affiliation or partnership with Zara.",
    notes: "Tangerine / Apple / Amber",
    notesList: ["Tangerine", "Apple", "Amber"],
    disabledSizes: ["10ml", "5ml Normal", "5ml HQ"],
    prices: {
      "10ml": 528,
      "5ml Normal": 372,
      "5ml HQ": 428
    },
    color: "from-blue-800 to-indigo-900",
    glassStyle: "shadow-indigo-800/50",
    image: "/images/perfumes/seoul-winter.jpg?v=2"
  }
];

export const BUNDLE_DATA: CapsuleBundle[] = [
  {
    id: "bundle-winter-layers-trio",
    name: "Winter Layers Trio",
    categoryLabel: "MEN’S BUNDLE — GIFTING EDITION",
    gender: "Men",
    contains: "SCENTPREVIEW Sample No. 2 (5ml) + Sample No. 1 (5ml) + Sample No. 8 (5ml)",
    description: "Warm smoky oud, reserve powdery iris-leather elegance, and crisp citrus-musk versatility — a complete 3-sample gifting wardrobe from daytime refinement to evening distinction.",
    constituentIds: ["la-uno-qaswa", "givenchy-gentleman", "ck-one"],
    isOutOfStock: false,
    isSpotlight: true,
    isGiftingBundle: true,
    fixedPrice: 1799,
    prices: {
      "10ml": 3401,
      "5ml Normal": 1799,
      "5ml HQ": 1967
    }
  },
  {
    id: "bundle-winter-warmth-trio",
    name: "Winter Warmth Trio",
    categoryLabel: "WOMEN’S BUNDLE — GIFTING EDITION",
    gender: "Women",
    contains: "SCENTPREVIEW Sample No. 7 (5ml) + Sample No. 6 (5ml) + Sample No. 5 (5ml)",
    description: "Golden honeyed coconut, spiced praline dates, and warm tonka bean — three enveloping cold-weather gourmands curated for effortless signature layering.",
    constituentIds: ["zara-rich-warm-addictive", "lattafa-khamrah", "zara-intense-dark"],
    isOutOfStock: false,
    isSpotlight: true,
    isGiftingBundle: true,
    fixedPrice: 1199,
    prices: {
      "10ml": 1991,
      "5ml Normal": 1199,
      "5ml HQ": 1367
    }
  },
  {
    id: "spotlight-arabian",
    name: "Arabian Exotic Treasures Duo",
    contains: "SCENTPREVIEW Sample No. 6 + Sample No. 2",
    isOutOfStock: false,
    isSpotlight: true,
    fixedPrice: 814,
    prices: {
      "10ml": 1196,
      "5ml Normal": 814,
      "5ml HQ": 926
    }
  },
  {
    id: "bundle-day-night",
    name: "The Day-to-Night Signature Duo",
    contains: "SCENTPREVIEW Sample No. 10 + Sample No. 3",
    isOutOfStock: true,
    prices: {
      "10ml": 1364,
      "5ml Normal": 897,
      "5ml HQ": 1008
    }
  },
  {
    id: "bundle-marine-core",
    name: "The \"Hyper-Clean\" Marine Core Kit",
    contains: "SCENTPREVIEW Sample No. 8 + Curated Marine Pairings",
    isOutOfStock: true,
    prices: {
      "10ml": 1286,
      "5ml Normal": 858,
      "5ml HQ": 970
    }
  },
  {
    id: "bundle-rare-collector",
    name: "Rare Discontinued Collector Duo",
    contains: "SCENTPREVIEW Sample No. 9 + Sample No. 5",
    isOutOfStock: true,
    prices: {
      "10ml": 1710,
      "5ml Normal": 1070,
      "5ml HQ": 1182
    }
  },
  {
    id: "bundle-office-rotation",
    name: "24/7 Office & Boardroom Rotation",
    contains: "SCENTPREVIEW Sample No. 1 + Sample No. 8",
    isOutOfStock: true,
    prices: {
      "10ml": 2953,
      "5ml Normal": 1692,
      "5ml HQ": 1803
    }
  },
  {
    id: "bundle-cozy-winter",
    name: "The Cozy Winter-Gourmand Trio",
    contains: "SCENTPREVIEW Sample No. 11 + Curated Pairings",
    isOutOfStock: true,
    prices: {
      "10ml": 1924,
      "5ml Normal": 1285,
      "5ml HQ": 1454
    }
  },
  {
    id: "bundle-master-vault",
    name: "Ultimate Master Layering Vault",
    contains: "SCENTPREVIEW Sample No. 6 + Curated Winter Pairings",
    isOutOfStock: true,
    prices: {
      "10ml": 1871,
      "5ml Normal": 1258,
      "5ml HQ": 1427
    }
  },
  {
    id: "bundle-zara-classics",
    name: "The \"Zara Only\" Cult Classics Quad",
    contains: "SCENTPREVIEW Sample No. 10 + Sample No. 11 + Curated Zara Samples",
    isOutOfStock: true,
    prices: {
      "10ml": 2433,
      "5ml Normal": 1673,
      "5ml HQ": 1897
    }
  }
];
