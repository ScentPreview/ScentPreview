export interface Fragrance {
  id: string;
  name: string;
  brand: string;
  isPremium: boolean;
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
  {
    id: "lattafa-khamrah",
    name: "Lattafa Khamrah",
    brand: "Lattafa",
    isPremium: false,
    isOutOfStock: false,
    notes: "Cinnamon / Dates / Pure Vanilla",
    notesList: ["Cinnamon", "Dates", "Pure Vanilla"],
    disabledSizes: ["10ml", "5ml HQ"],
    prices: {
      "10ml": 748,
      "5ml Normal": 482,
      "5ml HQ": 538
    },
    color: "from-amber-600 to-amber-900",
    glassStyle: "shadow-amber-700/50"
  },
  {
    id: "zara-sunrise",
    name: "Zara Sunrise",
    brand: "Zara",
    isPremium: false,
    isOutOfStock: false,
    notes: "Bergamot / Mandarin / Soft Amber",
    notesList: ["Bergamot", "Mandarin", "Soft Amber"],
    disabledSizes: ["5ml Normal", "5ml HQ"],
    prices: {
      "10ml": 682,
      "5ml Normal": 448,
      "5ml HQ": 504
    },
    color: "from-orange-400 to-amber-600",
    glassStyle: "shadow-orange-400/40"
  },
  {
    id: "zara-for-him-black",
    name: "Zara For Him Black",
    brand: "Zara",
    isPremium: false,
    isOutOfStock: false,
    notes: "Ginger / Lavender / Cedarwood",
    notesList: ["Ginger", "Lavender", "Cedarwood"],
    disabledSizes: ["5ml HQ"],
    prices: {
      "10ml": 682,
      "5ml Normal": 448,
      "5ml HQ": 504
    },
    color: "from-violet-950 to-neutral-900",
    glassStyle: "shadow-purple-900/40"
  },
  {
    id: "zara-intense-dark",
    name: "Zara Intense Dark",
    brand: "Zara",
    isPremium: false,
    isOutOfStock: false,
    notes: "Apple / Black Pepper / Tonka Bean",
    notesList: ["Apple", "Black Pepper", "Tonka Bean"],
    disabledSizes: ["5ml HQ"],
    prices: {
      "10ml": 595,
      "5ml Normal": 405,
      "5ml HQ": 461
    },
    color: "from-indigo-900 to-zinc-950",
    glassStyle: "shadow-indigo-950/55"
  },
  {
    id: "zara-seoul-winter",
    name: "Zara Seoul Winter",
    brand: "Zara",
    isPremium: false,
    isOutOfStock: false,
    notes: "Tangerine / Apple / Amber",
    notesList: ["Tangerine", "Apple", "Amber"],
    disabledSizes: ["5ml Normal"],
    prices: {
      "10ml": 528,
      "5ml Normal": 372,
      "5ml HQ": 428
    },
    color: "from-sky-300 to-blue-700",
    glassStyle: "shadow-sky-500/30"
  },
  {
    id: "la-uno-qaswa",
    name: "La Uno Qaswa",
    brand: "La Uno",
    isPremium: false,
    isOutOfStock: false,
    notes: "Oud / Incense / Dark Woods",
    notesList: ["Oud", "Incense", "Dark Woods"],
    prices: {
      "10ml": 448,
      "5ml Normal": 332,
      "5ml HQ": 388
    },
    color: "from-stone-800 to-emerald-950",
    glassStyle: "shadow-stone-900/60"
  },
  {
    id: "ck-one",
    name: "Calvin Klein CK One",
    brand: "Calvin Klein",
    isPremium: false,
    isOutOfStock: false,
    notes: "Lemon / Green Tea / Jasmine",
    notesList: ["Lemon", "Green Tea", "Jasmine"],
    prices: {
      "10ml": 838,
      "5ml Normal": 527,
      "5ml HQ": 582
    },
    color: "from-stone-200 to-stone-400",
    glassStyle: "shadow-stone-300/40"
  },
  {
    id: "ck2",
    name: "Calvin Klein CK2",
    brand: "Calvin Klein",
    isPremium: false,
    isOutOfStock: false,
    notes: "Wasabi / Violet Leaf / Wet Cobblestones",
    notesList: ["Wasabi", "Violet Leaf", "Wet Cobblestones"],
    disabledSizes: ["5ml Normal", "5ml HQ"],
    prices: {
      "10ml": 1115,
      "5ml Normal": 665,
      "5ml HQ": 721
    },
    color: "from-sky-100 to-sky-300",
    glassStyle: "shadow-sky-200/30"
  },
  {
    id: "zara-rich-warm-addictive",
    name: "Zara Rich Warm Addictive",
    brand: "Zara",
    isPremium: false,
    isOutOfStock: false,
    notes: "Honey / Toasted Coconut / Tobacco Leaf",
    notesList: ["Honey", "Toasted Coconut", "Tobacco Leaf"],
    disabledSizes: ["10ml", "5ml HQ"],
    prices: {
      "10ml": 648,
      "5ml Normal": 432,
      "5ml HQ": 488
    },
    color: "from-amber-700 to-stone-900",
    glassStyle: "shadow-amber-800/45"
  },
  {
    id: "zara-seoul",
    name: "Zara Seoul",
    brand: "Zara",
    isPremium: false,
    isOutOfStock: false,
    notes: "Tangerine / Lavender / Amber",
    notesList: ["Tangerine", "Lavender", "Amber"],
    disabledSizes: ["10ml", "5ml Normal"],
    prices: {
      "10ml": 528,
      "5ml Normal": 372,
      "5ml HQ": 428
    },
    color: "from-blue-400 to-sky-600",
    glassStyle: "shadow-blue-400/30"
  },
  {
    id: "givenchy-gentleman",
    name: "Givenchy Gentleman",
    brand: "Givenchy",
    isPremium: true,
    isOutOfStock: false,
    notes: "Iris / Black Pepper / Leather",
    notesList: ["Iris", "Black Pepper", "Leather"],
    disabledSizes: ["5ml HQ"],
    prices: {
      "10ml": 2115,
      "5ml Normal": 1165,
      "5ml HQ": 1221
    },
    color: "from-neutral-800 to-black",
    glassStyle: "shadow-neutral-900/50"
  }
];

export const BUNDLE_DATA: CapsuleBundle[] = [
  {
    id: "spotlight-arabian",
    name: "Arabian Exotic Treasures Duo",
    contains: "Lattafa Khamrah + La Uno Qaswa",
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
    contains: "Zara Sunrise + Zara For Him Black",
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
    contains: "Calvin Klein CK One + Curated Marine Pairings",
    isOutOfStock: false,
    prices: {
      "10ml": 1286,
      "5ml Normal": 858,
      "5ml HQ": 970
    }
  },
  {
    id: "bundle-rare-collector",
    name: "Rare Discontinued Collector Duo",
    contains: "Calvin Klein CK2 + Zara Intense Dark",
    isOutOfStock: false,
    prices: {
      "10ml": 1710,
      "5ml Normal": 1070,
      "5ml HQ": 1182
    }
  },
  {
    id: "bundle-office-rotation",
    name: "24/7 Office & Boardroom Rotation",
    contains: "Givenchy Gentleman + Calvin Klein CK One",
    isOutOfStock: false,
    prices: {
      "10ml": 2953,
      "5ml Normal": 1692,
      "5ml HQ": 1803
    }
  },
  {
    id: "bundle-cozy-winter",
    name: "The Cozy Winter-Gourmand Trio",
    contains: "Zara Seoul Winter + Curated Pairings",
    isOutOfStock: false,
    prices: {
      "10ml": 1924,
      "5ml Normal": 1285,
      "5ml HQ": 1454
    }
  },
  {
    id: "bundle-master-vault",
    name: "Ultimate Master Layering Vault",
    contains: "Khamrah + Curated Winter Pairings",
    isOutOfStock: false,
    prices: {
      "10ml": 1871,
      "5ml Normal": 1258,
      "5ml HQ": 1427
    }
  },
  {
    id: "bundle-zara-classics",
    name: "The \"Zara Only\" Cult Classics Quad",
    contains: "Zara Sunrise + Zara Seoul Winter + 2 Other Zara Classics",
    isOutOfStock: false,
    prices: {
      "10ml": 2433,
      "5ml Normal": 1673,
      "5ml HQ": 1897
    }
  }
];
