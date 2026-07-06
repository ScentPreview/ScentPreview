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
      "10ml": 492,
      "5ml Normal": 332,
      "5ml HQ": 376
    },
    color: "from-amber-600 to-amber-900",
    glassStyle: "shadow-amber-700/50",
    image: "/assets/images/lattafa_khamrah_1782758838392.jpg"
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
      "10ml": 452,
      "5ml Normal": 312,
      "5ml HQ": 356
    },
    color: "from-orange-400 to-amber-600",
    glassStyle: "shadow-orange-400/40",
    image: "/assets/images/zara_sunrise_1782758851145.jpg"
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
      "10ml": 452,
      "5ml Normal": 312,
      "5ml HQ": 356
    },
    color: "from-violet-950 to-neutral-900",
    glassStyle: "shadow-purple-900/40",
    image: "/assets/images/zara_for_him_black_1782758863865.jpg"
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
      "10ml": 399,
      "5ml Normal": 285,
      "5ml HQ": 330
    },
    color: "from-indigo-900 to-zinc-950",
    glassStyle: "shadow-indigo-950/55",
    image: "/assets/images/zara_intense_dark_1782758877655.jpg"
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
      "10ml": 359,
      "5ml Normal": 265,
      "5ml HQ": 310
    },
    color: "from-sky-300 to-blue-700",
    glassStyle: "shadow-sky-500/30",
    image: "/assets/images/zara_seoul_winter_1782758896942.jpg"
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
      "10ml": 312,
      "5ml Normal": 242,
      "5ml HQ": 286
    },
    color: "from-stone-800 to-emerald-950",
    glassStyle: "shadow-stone-900/60",
    image: "/assets/images/la_uno_qaswa_fixed_1782759717224.jpg"
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
      "10ml": 512,
      "5ml Normal": 325,
      "5ml HQ": 369
    },
    color: "from-stone-200 to-stone-400",
    glassStyle: "shadow-stone-300/40",
    image: "/assets/images/ck_one_perfume_1782759266424.jpg"
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
      "10ml": 712,
      "5ml Normal": 442,
      "5ml HQ": 486
    },
    color: "from-sky-100 to-sky-300",
    glassStyle: "shadow-sky-200/30",
    image: "/assets/images/ck2_perfume_1782759281216.jpg"
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
      "10ml": 425,
      "5ml Normal": 295,
      "5ml HQ": 340
    },
    color: "from-amber-700 to-stone-900",
    glassStyle: "shadow-amber-800/45",
    image: "/assets/images/zara_rich_warm_addictive_1782759293619.jpg"
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
      "10ml": 349,
      "5ml Normal": 255,
      "5ml HQ": 299
    },
    color: "from-blue-400 to-sky-600",
    glassStyle: "shadow-blue-400/30",
    image: "/assets/images/zara_seoul_1782759305579.jpg"
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
      "10ml": 1312,
      "5ml Normal": 742,
      "5ml HQ": 786
    },
    color: "from-neutral-800 to-black",
    glassStyle: "shadow-neutral-900/50",
    image: "/assets/images/givenchy_gentleman_1782759317891.jpg"
  }
];

export const BUNDLE_DATA: CapsuleBundle[] = [
  {
    id: "spotlight-arabian",
    name: "Arabian Exotic Treasures Duo",
    contains: "Lattafa Khamrah + La Uno Qaswa",
    isOutOfStock: false,
    isSpotlight: true,
    fixedPrice: 499,
    image: "/assets/images/bundle_spotlight_arabian_1782760520600.jpg"
  },
  {
    id: "bundle-day-night",
    name: "The Day-to-Night Signature Duo",
    contains: "Zara Sunrise + Zara For Him Black",
    isOutOfStock: true,
    prices: {
      "10ml": 599,
      "5ml Normal": 333,
      "5ml HQ": 520
    },
    image: "/assets/images/bundle_day_night_1782760460955.jpg"
  },
  {
    id: "bundle-marine-core",
    name: "The \"Hyper-Clean\" Marine Core Kit",
    contains: "Calvin Klein CK One + Curated Marine Pairings",
    isOutOfStock: false,
    prices: {
      "10ml": 689,
      "5ml Normal": 386,
      "5ml HQ": 599
    },
    image: "/assets/images/bundle_marine_core_1782760476971.jpg"
  },
  {
    id: "bundle-rare-collector",
    name: "Rare Discontinued Collector Duo",
    contains: "Calvin Klein CK2 + Zara Intense Dark",
    isOutOfStock: false,
    prices: {
      "10ml": 620,
      "5ml Normal": 531,
      "5ml HQ": 540
    },
    image: "/assets/images/bundle_rare_collector_1782760489241.jpg"
  },
  {
    id: "bundle-office-rotation",
    name: "24/7 Office & Boardroom Rotation",
    contains: "Givenchy Gentleman + Calvin Klein CK One",
    isOutOfStock: false,
    prices: {
      "10ml": 720,
      "5ml Normal": 373,
      "5ml HQ": 610
    },
    image: "/assets/images/bundle_office_rotation_1782760503031.jpg"
  },
  {
    id: "bundle-cozy-winter",
    name: "The Cozy Winter-Gourmand Trio",
    contains: "Zara Seoul Winter + Curated Pairings",
    isOutOfStock: false,
    prices: {
      "10ml": 586,
      "5ml Normal": 396,
      "5ml HQ": 530
    },
    image: "/assets/images/bundle_cozy_winter_1782760533679.jpg"
  },
  {
    id: "bundle-master-vault",
    name: "Ultimate Master Layering Vault",
    contains: "Khamrah + Curated Winter Pairings",
    isOutOfStock: false,
    prices: {
      "10ml": 665,
      "5ml Normal": 444,
      "5ml HQ": 623
    },
    image: "/assets/images/bundle_master_vault_1782760546991.jpg"
  },
  {
    id: "bundle-zara-classics",
    name: "The \"Zara Only\" Cult Classics Quad",
    contains: "Zara Sunrise + Zara Seoul Winter + 2 Other Zara Classics",
    isOutOfStock: false,
    prices: {
      "10ml": 765,
      "5ml Normal": 494,
      "5ml HQ": 673
    },
    image: "/assets/images/bundle_zara_classics_1782760558987.jpg"
  }
];
