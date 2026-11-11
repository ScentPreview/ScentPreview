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
  layering?: LayeringRecommendation;
}

export interface LayeringRecommendation {
  partnerId: string;
  partnerName: string;
  partnerBrand: string;
  partnerImage: string;
  partnerPrice: number;
  partnerSize: SizeType;
  combinationName: string;
  whyItWorks: string;
  howToLayer: string;
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
    name: "SP 1",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewgentlemangivenchy",
    isPremium: true,
    gender: "Men",
    isOutOfStock: false,
    type: "FORMAL & EVENING",
    description: "Smells like smooth warm vanilla, rich dark leather, and powdery iris. Sophisticated, warm, and luxurious—perfect for dates, formal dinners, and nights out.",
    notes: "Iris / Black Pepper / Leather",
    notesList: ["Tuscan Iris", "Black Pepper", "Dark Leather", "Warm Vanilla"],
    disabledSizes: ["10ml"],
    prices: {
      "10ml": 2115,
      "5ml Normal": 1165,
      "5ml HQ": 1221
    },
    color: "from-neutral-800 to-black",
    glassStyle: "shadow-black/50",
    image: "/images/perfumes/givenchy-gentleman-transparent.png",
    layering: {
      partnerId: "ck-one",
      partnerName: "SP 8",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/ck-one-transparent.png",
      partnerPrice: 527,
      partnerSize: "5ml Normal",
      combinationName: "Citrus Powdery Iris",
      whyItWorks: "SP 8's sparkling lemon and green tea cut through the dense vanilla and leather, giving SP 1 a fresh daytime radiance before drying down into smooth luxury.",
      howToLayer: "Spray 2 sprays of SP 8 on pulse points first, then layer 1 spray of SP 1 on your chest."
    }
  },
  {
    id: "la-uno-qaswa",
    name: "SP 2",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewlaunoqaswa",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "DARK WOODS & OUD",
    description: "Smells like smoky frankincense incense, rich oud, and deep cedarwood. Bold, warm, and mysterious with a noticeable spice trail.",
    notes: "Oud / Incense / Dark Woods",
    notesList: ["Frankincense", "Rich Oud", "Velvet Cedarwood"],
    prices: {
      "10ml": 448,
      "5ml Normal": 332,
      "5ml HQ": 388
    },
    color: "from-stone-700 to-stone-900",
    glassStyle: "shadow-stone-800/50",
    image: "/images/perfumes/la-uno-transparent.png",
    layering: {
      partnerId: "lattafa-khamrah",
      partnerName: "SP 6",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/lattafa-khamrah-transparent.png",
      partnerPrice: 482,
      partnerSize: "5ml Normal",
      combinationName: "Sweet Smoky Oud",
      whyItWorks: "SP 6's cinnamon-spiced date sweetness balances SP 2's dry woody frankincense smoke, creating the quintessential luxury sillage.",
      howToLayer: "Spray SP 2 on wrists and neck, then add a light mist of SP 6 over your collar."
    }
  },
  {
    id: "zara-for-him-black",
    name: "SP 3",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewzaraforhimblack",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "DAILY SIGNATURE",
    description: "Smells like fresh spicy ginger, clean soothing lavender, and structured cedarwood. Crisp, modern, and versatile—your go-to everyday office signature.",
    notes: "Ginger / Lavender / Cedarwood",
    notesList: ["Spicy Ginger", "French Lavender", "Dry Cedarwood"],
    disabledSizes: ["5ml HQ"],
    prices: {
      "10ml": 682,
      "5ml Normal": 448,
      "5ml HQ": 504
    },
    color: "from-violet-950 to-neutral-900",
    glassStyle: "shadow-purple-900/40",
    image: "/images/perfumes/for-him-black-transparent.png",
    layering: {
      partnerId: "zara-seoul",
      partnerName: "SP 4",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/zara-seoul-original-transparent.png",
      partnerPrice: 372,
      partnerSize: "5ml Normal",
      combinationName: "Aquatic Spice Signature",
      whyItWorks: "Both share aromatic lavender accords. SP 4 brings energizing aquatic citrus freshness, while SP 3 anchors the base with warm cedar and spicy ginger.",
      howToLayer: "Mist SP 4 for initial freshness, then layer SP 3 on chest and collar for all-day staying power."
    }
  },
  {
    id: "zara-seoul",
    name: "SP 4",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewzaraseoul",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "AROMATIC & SPORT",
    description: "Smells like sweet juicy tangerine, clean sea breeze, and fresh lavender. Light, energetic, and refreshing—ideal for hot days, gym workouts, and casual mornings.",
    notes: "Tangerine / Lavender / Amber",
    notesList: ["Zesty Tangerine", "Aromatic Lavender", "Marine Amber"],
    disabledSizes: ["10ml"],
    prices: {
      "10ml": 528,
      "5ml Normal": 372,
      "5ml HQ": 428
    },
    color: "from-blue-600 to-blue-900",
    glassStyle: "shadow-blue-700/50",
    image: "/images/perfumes/zara-seoul-original-transparent.png",
    layering: {
      partnerId: "zara-sunrise",
      partnerName: "SP 10",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/sunrise-transparent.png",
      partnerPrice: 448,
      partnerSize: "5ml Normal",
      combinationName: "Solar Mediterranean Drift",
      whyItWorks: "SP 10 adds sunny bergamot and desert amber, turning SP 4's aquatic profile into a high-projection summer signature.",
      howToLayer: "Apply 2 sprays of SP 4 on wrists, then mist SP 10 across shoulders and neck."
    }
  },
  {
    id: "zara-intense-dark",
    name: "SP 5",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewzaraintensedark",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "NIGHT & SPICES",
    description: "Smells like crisp green apple, cracked black pepper, and sweet roasted tonka bean. Dark, cozy, and slightly sweet—great for casual nights and cooler weather.",
    notes: "Apple / Black Pepper / Tonka Bean",
    notesList: ["Crisp Green Apple", "Crushed Black Pepper", "Roasted Tonka Bean"],
    prices: {
      "10ml": 595,
      "5ml Normal": 405,
      "5ml HQ": 461
    },
    color: "from-stone-800 to-black",
    glassStyle: "shadow-stone-900/50",
    image: "/images/perfumes/intense-dark-transparent.png",
    layering: {
      partnerId: "zara-rich-warm-addictive",
      partnerName: "SP 7",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/rich-warm-addictive-transparent.png",
      partnerPrice: 432,
      partnerSize: "5ml Normal",
      combinationName: "Spiced Honey Apple",
      whyItWorks: "The tart green apple and black pepper of SP 5 cut through SP 7's sweet honey and rum, creating an addictive spiced dessert warmth.",
      howToLayer: "Apply SP 5 on pulse points, then mist SP 7 over your shirt or jacket."
    }
  },

  // WOMEN'S COLLECTION
  {
    id: "lattafa-khamrah",
    name: "SP 6",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewlattafakhamrah",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "GOURMAND & COZY",
    description: "Smells like warm cinnamon buns, sweet dates, and creamy praline with vanilla and roasted tonka. Super rich, sweet, and comforting—lasts 12+ hours.",
    notes: "Cinnamon / Dates / Pure Vanilla",
    notesList: ["Warm Cinnamon", "Golden Dates", "Creamy Praline", "Vanilla"],
    disabledSizes: ["10ml"],
    prices: {
      "10ml": 748,
      "5ml Normal": 482,
      "5ml HQ": 538
    },
    color: "from-amber-600 to-amber-900",
    glassStyle: "shadow-amber-700/50",
    image: "/images/perfumes/lattafa-khamrah-transparent.png",
    layering: {
      partnerId: "la-uno-qaswa",
      partnerName: "SP 2",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/la-uno-transparent.png",
      partnerPrice: 332,
      partnerSize: "5ml Normal",
      combinationName: "Spiced Date & Oud Smoke",
      whyItWorks: "SP 2's dry frankincense and cedarwood smoke add dark, sophisticated mystery to SP 6's rich cinnamon sweetness.",
      howToLayer: "Spray SP 2 on pulse points first, then spray SP 6 once on each collarbone."
    }
  },
  {
    id: "zara-rich-warm-addictive",
    name: "SP 7",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewrichwarmaddictive",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "WARM & COZY",
    description: "Smells like golden white honey, toasted creamy coconut, and warm dark rum. Incredibly smooth, comforting, and sweet—feels like a warm blanket on cold days.",
    notes: "Honey / Toasted Coconut / Tobacco Leaf",
    notesList: ["White Honey", "Toasted Coconut Milk", "Dark Rum", "Blonde Tobacco"],
    prices: {
      "10ml": 648,
      "5ml Normal": 432,
      "5ml HQ": 488
    },
    color: "from-amber-500 to-amber-800",
    glassStyle: "shadow-amber-600/50",
    image: "/images/perfumes/rich-warm-addictive-transparent.png",
    layering: {
      partnerId: "zara-intense-dark",
      partnerName: "SP 5",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/intense-dark-transparent.png",
      partnerPrice: 405,
      partnerSize: "5ml Normal",
      combinationName: "Nocturnal Honey Rum",
      whyItWorks: "The crisp black pepper and tart green apple in SP 5 add an exciting spicy contrast to the velvety coconut-honey warmth.",
      howToLayer: "Apply SP 7 generously, then layer 2 sprays of SP 5 on top for a spiced sweet trail."
    }
  },
  {
    id: "ck-one",
    name: "SP 8",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewckone",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "FRESH & CITRUS",
    description: "Smells like sparkling fresh lemon, clean green tea, and soft jasmine. Crisp, refreshing, and clean post-shower scent that works anytime, anywhere.",
    notes: "Lemon / Green Tea / Jasmine",
    notesList: ["Sparkling Lemon", "Green Tea Accord", "Clean Jasmine", "Hedione"],
    prices: {
      "10ml": 838,
      "5ml Normal": 527,
      "5ml HQ": 582
    },
    color: "from-emerald-300 to-teal-500",
    glassStyle: "shadow-emerald-400/40",
    image: "/images/perfumes/ck-one-transparent.png",
    layering: {
      partnerId: "givenchy-gentleman",
      partnerName: "SP 1",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/givenchy-gentleman-transparent.png",
      partnerPrice: 1165,
      partnerSize: "5ml Normal",
      combinationName: "Citrus Powdery Iris",
      whyItWorks: "SP 8 provides an instant burst of fresh citrus energy, brightening SP 1's deep leather and iris for effortless daytime luxury.",
      howToLayer: "Spray SP 8 over your chest and wrists, then add SP 1 behind each ear."
    }
  },
  {
    id: "ck2",
    name: "SP 9",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewck2",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "MINERAL & URBAN",
    description: "Smells like electric wasabi spice, fresh rain on wet cobblestones, and clean violet leaf. Ultra-unique, mineral, and futuristic—a distinctive personal signature.",
    notes: "Wasabi / Violet Leaf / Wet Cobblestones",
    notesList: ["Spicy Wasabi", "Wet Cobblestones", "Violet Leaf", "Incense"],
    prices: {
      "10ml": 1115,
      "5ml Normal": 665,
      "5ml HQ": 721
    },
    color: "from-cyan-300 to-blue-400",
    glassStyle: "shadow-cyan-400/40",
    image: "/images/perfumes/ck2-transparent.png",
    layering: {
      partnerId: "ck-one",
      partnerName: "SP 8",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/ck-one-transparent.png",
      partnerPrice: 527,
      partnerSize: "5ml Normal",
      combinationName: "Mineral Rain & Citrus",
      whyItWorks: "SP 8's lemon and green tea soften SP 9's ozonic mineral wet stone notes, producing an airy, refreshing post-rain garden feeling.",
      howToLayer: "Apply SP 9 on pulse points, followed by a light veil of SP 8 across forearms."
    }
  },
  {
    id: "zara-sunrise",
    name: "SP 10",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewzarasunrise",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "SOLAR CITRUS",
    description: "Smells like zesty Italian bergamot, sunny ginger, and warm desert amber. Bright, citrusy, and optimistic—crafted for sunny warm days.",
    notes: "Bergamot / Mandarin / Soft Amber",
    notesList: ["Italian Bergamot", "Spicy Ginger", "Sunny Amber"],
    prices: {
      "10ml": 682,
      "5ml Normal": 448,
      "5ml HQ": 504
    },
    color: "from-orange-400 to-amber-600",
    glassStyle: "shadow-orange-400/40",
    image: "/images/perfumes/sunrise-transparent.png",
    layering: {
      partnerId: "zara-seoul",
      partnerName: "SP 4",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/zara-seoul-original-transparent.png",
      partnerPrice: 372,
      partnerSize: "5ml Normal",
      combinationName: "Double-Fresh Citrus Marine",
      whyItWorks: "Combines sparkling sunny bergamot with cool marine aquatic notes for an invigorating, long-lasting summer blast.",
      howToLayer: "Spritz SP 10 on shoulders and neck, then add SP 4 on your wrists."
    }
  },
  {
    id: "versace-crystal-noir",
    name: "SP 11",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewcrystalnoir",
    isPremium: true,
    gender: "Women",
    isOutOfStock: true,
    type: "DARK FLORAL & SPICE",
    description: "Smells like dark cardamom spice, creamy coconut, and sensual night-blooming gardenia. Sultry, opulent, and mysterious for special evenings.",
    notes: "Ginger / Cardamom / Pepper",
    notesList: ["Cardamom", "Black Pepper", "Creamy Coconut", "Gardenia"],
    disabledSizes: ["10ml", "5ml Normal", "5ml HQ"],
    prices: {
      "10ml": 799,
      "5ml Normal": 799,
      "5ml HQ": 799
    },
    color: "from-purple-900 to-black",
    glassStyle: "shadow-purple-900/50",
    image: "/images/perfumes/versace-crystal-noir-transparent.png",
    layering: {
      partnerId: "ck-one",
      partnerName: "SP 8",
      partnerBrand: "ScentPreview",
      partnerImage: "/images/perfumes/ck-one-transparent.png",
      partnerPrice: 527,
      partnerSize: "5ml Normal",
      combinationName: "Clean Spiced Coconut",
      whyItWorks: "Bright lemon and green tea lift the heavy spiced coconut accord into an intoxicating all-season head-turner.",
      howToLayer: "Spray SP 8 across chest, followed by SP 11 behind each ear."
    }
  },
  {
    id: "zara-seoul-winter",
    name: "SP 12",
    brand: "ScentPreview",
    subdomainSlug: "scentpreviewzaraseoulwinter",
    isPremium: false,
    gender: "Women",
    isOutOfStock: true,
    type: "CASUAL / FRUITY",
    description: "Smells like crisp red apple, sweet tangerine, and warm cozy amber. Sweet and fresh for cool casual days.",
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
    image: "/images/perfumes/seoul-winter-transparent.png"
  }
];

export const BUNDLE_DATA: CapsuleBundle[] = [
  {
    id: "bundle-winter-layers-trio",
    name: "SP B1",
    categoryLabel: "MEN’S BUNDLE — 3-SAMPLE WARDROBE",
    gender: "Men",
    contains: "SP 2 (5ml) + SP 1 (5ml) + SP 8 (5ml)",
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
    },
    image: "/images/perfumes/bundle-winter-layers-trio.png"
  },
  {
    id: "bundle-winter-warmth-trio",
    name: "SP B2",
    categoryLabel: "WOMEN’S BUNDLE — 3-SAMPLE WARDROBE",
    gender: "Women",
    contains: "SP 7 (5ml) + SP 6 (5ml) + SP 5 (5ml)",
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
    },
    image: "/images/perfumes/bundle-winter-warmth-trio.png"
  },
  {
    id: "spotlight-arabian",
    name: "SP B3",
    categoryLabel: "DUO BUNDLE — SPOTLIGHT",
    contains: "SP 6 (5ml) + SP 2 (5ml)",
    constituentIds: ["lattafa-khamrah", "la-uno-qaswa"],
    isOutOfStock: false,
    isSpotlight: true,
    fixedPrice: 814,
    prices: {
      "10ml": 1196,
      "5ml Normal": 814,
      "5ml HQ": 926
    },
    image: "/images/perfumes/spotlight-arabian.png"
  },
  {
    id: "bundle-day-night",
    name: "SP B4",
    contains: "SP 10 + SP 3",
    isOutOfStock: true,
    prices: {
      "10ml": 1364,
      "5ml Normal": 897,
      "5ml HQ": 1008
    }
  },
  {
    id: "bundle-marine-core",
    name: "SP B5",
    contains: "SP 8 + Curated Marine Pairings",
    isOutOfStock: true,
    prices: {
      "10ml": 1286,
      "5ml Normal": 858,
      "5ml HQ": 970
    }
  },
  {
    id: "bundle-rare-collector",
    name: "SP B6",
    contains: "SP 9 + SP 5",
    isOutOfStock: true,
    prices: {
      "10ml": 1710,
      "5ml Normal": 1070,
      "5ml HQ": 1182
    }
  },
  {
    id: "bundle-office-rotation",
    name: "SP B7",
    contains: "SP 1 + SP 8",
    isOutOfStock: true,
    prices: {
      "10ml": 2953,
      "5ml Normal": 1692,
      "5ml HQ": 1803
    }
  },
  {
    id: "bundle-cozy-winter",
    name: "SP B8",
    contains: "SP 11 + Curated Pairings",
    isOutOfStock: true,
    prices: {
      "10ml": 1924,
      "5ml Normal": 1285,
      "5ml HQ": 1454
    }
  },
  {
    id: "bundle-master-vault",
    name: "SP B9",
    contains: "SP 6 + Curated Winter Pairings",
    isOutOfStock: true,
    prices: {
      "10ml": 1871,
      "5ml Normal": 1258,
      "5ml HQ": 1427
    }
  },
  {
    id: "bundle-zara-classics",
    name: "SP B10",
    contains: "SP 10 + SP 11 + Curated Decants",
    isOutOfStock: true,
    prices: {
      "10ml": 2433,
      "5ml Normal": 1673,
      "5ml HQ": 1897
    }
  }
];
