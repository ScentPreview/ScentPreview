import re

new_catalog = '''export const CATALOG_DATA: Fragrance[] = [
  // MEN'S COLLECTION
  {
    id: "givenchy-gentleman",
    name: "Givenchy Gentleman",
    brand: "Givenchy",
    isPremium: true,
    gender: "Men",
    isOutOfStock: false,
    type: "FORMAL / PREMIUM",
    description: "Dry powdery iris, crushed black pepper, and dark leather.",
    notes: "Iris / Black Pepper / Leather",
    notesList: ["Iris", "Black Pepper", "Leather"],
    disabledSizes: ["10ml"],
    prices: {
      "10ml": 1100,
      "5ml Normal": 700,
      "5ml HQ": 750
    },
    color: "from-neutral-800 to-black",
    glassStyle: "shadow-black/50"
  },
  {
    id: "la-uno-qaswa",
    name: "La Uno Qaswa",
    brand: "La Uno",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "INTENSE / BOLD",
    description: "Heavy resinous smoke, raw oud, and dry timber.",
    notes: "Oud / Incense / Dark Woods",
    notesList: ["Oud", "Incense", "Dark Woods"],
    prices: {
      "10ml": 600,
      "5ml Normal": 400,
      "5ml HQ": 450
    },
    color: "from-stone-700 to-stone-900",
    glassStyle: "shadow-stone-800/50"
  },
  {
    id: "zara-for-him-black",
    name: "Zara For Him Black",
    brand: "Zara",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "STRUCTURED / DAILY",
    description: "Fresh ginger bite over clean lavender and dry cedar.",
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
    id: "zara-seoul",
    name: "Zara Seoul",
    brand: "Zara",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "SPORT / DAILY",
    description: "Sharp lavender, energetic citrus, and warm amber.",
    notes: "Tangerine / Lavender / Amber",
    notesList: ["Tangerine", "Lavender", "Amber"],
    prices: {
      "10ml": 682,
      "5ml Normal": 448,
      "5ml HQ": 504
    },
    color: "from-blue-600 to-blue-900",
    glassStyle: "shadow-blue-700/50"
  },
  {
    id: "zara-intense-dark",
    name: "Zara Intense Dark",
    brand: "Zara",
    isPremium: false,
    gender: "Men",
    isOutOfStock: false,
    type: "NIGHT / CASUAL",
    description: "Dark apple with black pepper and a warm tonka base.",
    notes: "Apple / Black Pepper / Tonka Bean",
    notesList: ["Apple", "Black Pepper", "Tonka Bean"],
    prices: {
      "10ml": 682,
      "5ml Normal": 448,
      "5ml HQ": 504
    },
    color: "from-stone-800 to-black",
    glassStyle: "shadow-stone-900/50"
  },

  // WOMEN'S COLLECTION
  {
    id: "lattafa-khamrah",
    name: "Lattafa Khamrah",
    brand: "Lattafa",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "EVENING / GOURMAND",
    description: "Boozy, dense dessert warmth with high-projection cinnamon.",
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
    id: "zara-rich-warm-addictive",
    name: "Zara Rich Warm Addictive",
    brand: "Zara",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "COZY / NIGHT OUT",
    description: "Smooth honey, toasted coconut cream, and sweet tobacco.",
    notes: "Honey / Toasted Coconut / Tobacco Leaf",
    notesList: ["Honey", "Toasted Coconut", "Tobacco Leaf"],
    prices: {
      "10ml": 682,
      "5ml Normal": 448,
      "5ml HQ": 504
    },
    color: "from-amber-500 to-amber-800",
    glassStyle: "shadow-amber-600/50"
  },
  {
    id: "ck-one",
    name: "Calvin Klein CK One",
    brand: "Calvin Klein",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "DAILY / FRESH",
    description: "Clean tea leaf, sharp citrus, and light white florals.",
    notes: "Lemon / Green Tea / Jasmine",
    notesList: ["Lemon", "Green Tea", "Jasmine"],
    prices: {
      "10ml": 650,
      "5ml Normal": 420,
      "5ml HQ": 480
    },
    color: "from-emerald-300 to-teal-500",
    glassStyle: "shadow-emerald-400/40"
  },
  {
    id: "ck2",
    name: "Calvin Klein CK2",
    brand: "Calvin Klein",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "UNCONVENTIONAL / AIRY",
    description: "Cold mineral aquatic with a sharp, spicy bite.",
    notes: "Wasabi / Violet Leaf / Wet Cobblestones",
    notesList: ["Wasabi", "Violet Leaf", "Wet Cobblestones"],
    prices: {
      "10ml": 650,
      "5ml Normal": 420,
      "5ml HQ": 480
    },
    color: "from-cyan-300 to-blue-400",
    glassStyle: "shadow-cyan-400/40"
  },
  {
    id: "zara-sunrise",
    name: "Zara Sunrise",
    brand: "Zara",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "SUMMER / CITRUS",
    description: "Bright citrus peel over a warm resinous base.",
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
    id: "zara-seoul-winter",
    name: "Zara Seoul Winter",
    brand: "Zara",
    isPremium: false,
    gender: "Women",
    isOutOfStock: false,
    type: "CASUAL / FRUITY",
    description: "Crisp apple and mandarin over a sweet amber finish.",
    notes: "Tangerine / Apple / Amber",
    notesList: ["Tangerine", "Apple", "Amber"],
    prices: {
      "10ml": 682,
      "5ml Normal": 448,
      "5ml HQ": 504
    },
    color: "from-blue-800 to-indigo-900",
    glassStyle: "shadow-indigo-800/50"
  }
];'''

with open("src/types.ts", "r") as f:
    content = f.read()

# Replace everything from export const CATALOG_DATA: Fragrance[] = [ to the end of the array.
# Let's use regex
content = re.sub(r'export const CATALOG_DATA: Fragrance\[\] = \[.*?\];', new_catalog, content, flags=re.DOTALL)

with open("src/types.ts", "w") as f:
    f.write(content)

