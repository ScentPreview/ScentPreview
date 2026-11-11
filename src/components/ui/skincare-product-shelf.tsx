"use client";

import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type RefObject } from "react";
import { AnimatePresence, LayoutGroup, animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { ChevronDown, ChevronLeft, Minus, Plus, ShoppingBag, ShieldCheck, Check } from "lucide-react";
import { cn } from "../../lib/utils";

type Kind = "jar" | "tube" | "pump" | "dropper" | "perfume" | "mist" | "bottle" | "stick" | "lip";

export type Product = {
  id: string;
  kind: Kind;
  name: string;
  image?: string;
  section?: "men" | "women" | "bundles";
  /** Name printed on the pack, with an optional second line. */
  short: string;
  sub?: string;
  category: string;
  /** Body colour, cap colour, label colour, print colour. */
  color: string;
  cap: string;
  label: string;
  ink: string;
  /** See-through glass, and the colour of what is inside. */
  glass?: boolean;
  liquid?: string;
  price: number;
  compareAt?: number;
  sizes: string[];
  sizePrices?: Record<string, number>;
  rating: number;
  reviews: number;
  tagline: string;
  description: string;
  benefits: string[];
  ingredients: string;
  howTo: string;
};

export const DEFAULT_PRODUCTS: Product[] = [
  // ================= 01 / MEN =================
  {
    id: "givenchy-gentleman",
    image: "/images/perfumes/givenchy-gentleman-transparent.png",
    kind: "perfume",
    section: "men",
    name: "SP 1",
    short: "SP 1",
    sub: "Iris & Dark Leather",
    category: "Formal & Evening",
    color: "#1e1e24",
    cap: "#111111",
    label: "#f3f1ec",
    ink: "#111111",
    glass: true,
    liquid: "#2b2824",
    price: 1165,
    compareAt: 1450,
    sizes: ["5ml Normal", "5ml HQ"],
    sizePrices: { "5ml Normal": 1165, "5ml HQ": 1221, "10ml": 2115 },
    rating: 4.9,
    reviews: 218,
    tagline: "Iris, fiery black pepper and dark leather.",
    description: "An aristocratic evening composition built around powdery Tuscan iris, softened by warm vanilla and smoky leather flacon extraction.",
    benefits: ["Authentic retail flacon juice", "Sterile syringe transfer", "Airtight fine-mist atomizer"],
    ingredients: "Alcohol Denat., Parfum, Aqua, Limonene, Linalool, Coumarin, Benzyl Benzoate.",
    howTo: "Spray on pulse points: collarbone, wrists, and behind the neck for a 10-hour sillage.",
  },
  {
    id: "la-uno-qaswa",
    image: "/images/perfumes/la-uno-transparent.png",
    kind: "perfume",
    section: "men",
    name: "SP 2",
    short: "SP 2",
    sub: "Smoky Oud & Incense",
    category: "Dark Woods & Oud",
    color: "#2d2926",
    cap: "#111111",
    label: "#eae5dd",
    ink: "#1a1a1a",
    glass: true,
    liquid: "#3a342f",
    price: 332,
    compareAt: 450,
    sizes: ["5ml Normal", "5ml HQ", "10ml"],
    sizePrices: { "5ml Normal": 332, "5ml HQ": 388, "10ml": 448 },
    rating: 4.6,
    reviews: 180,
    tagline: "Smoky incense, dark woods and amber.",
    description: "An enigmatic middle-eastern composition opening with resinous frankincense and drying into deep velvety cedarwood.",
    benefits: ["Rich smoky aura", "Hand-extracted in cleanroom", "Fine atomization"],
    ingredients: "Alcohol Denat., Fragrance, Alpha-Isomethyl Ionone, Limonene.",
    howTo: "Two sprays on lapels and chest for a deep, commanding presence.",
  },
  {
    id: "zara-for-him-black",
    image: "/images/perfumes/for-him-black-transparent.png",
    kind: "bottle",
    section: "men",
    name: "SP 3",
    short: "SP 3",
    sub: "Spicy Ginger & Cedar",
    category: "Daily Signature",
    color: "#1a1a1e",
    cap: "#141416",
    label: "#edebe6",
    ink: "#111111",
    glass: true,
    liquid: "#28282e",
    price: 448,
    compareAt: 550,
    sizes: ["5ml Normal", "10ml"],
    sizePrices: { "5ml Normal": 448, "5ml HQ": 504, "10ml": 682 },
    rating: 4.6,
    reviews: 295,
    tagline: "Crisp ginger zest, lavender and rich cedarwood.",
    description: "A structured, versatile masculine essential balancing fresh spicy ginger with soothing lavender and dry cedar.",
    benefits: ["Everyday office signature", "Drawn with cleanroom syringe", "Leak-proof travel cap"],
    ingredients: "Alcohol Denat., Parfum, Linalool, Citronellol.",
    howTo: "Two sprays on wrists, press lightly to neck.",
  },
  {
    id: "zara-seoul",
    image: "/images/perfumes/zara-seoul-original-transparent.png",
    kind: "mist",
    section: "men",
    name: "SP 4",
    short: "SP 4",
    sub: "Marine & Tangerine",
    category: "Aromatic & Sport",
    color: "#2a547a",
    cap: "#1c2b38",
    label: "#d8e7f3",
    ink: "#1c2b38",
    glass: true,
    liquid: "#5294bf",
    price: 428,
    compareAt: 520,
    sizes: ["5ml HQ"],
    sizePrices: { "5ml HQ": 428, "5ml Normal": 372, "10ml": 528 },
    rating: 4.6,
    reviews: 410,
    tagline: "Zesty tangerine, French lavender and marine amber.",
    description: "An energetic city scent inspired by the neon heartbeat of Seoul. Marine aquatic freshness over aromatic herbs.",
    benefits: ["Sport & office rotation favorite", "Crisp aquatic presence", "Fine mist decant"],
    ingredients: "Alcohol Denat., Aqua, Citrus Reticulata, Amber.",
    howTo: "Mist liberally before stepping into meetings or workouts.",
  },
  {
    id: "zara-intense-dark",
    image: "/images/perfumes/intense-dark-transparent.png",
    kind: "jar",
    section: "men",
    name: "SP 5",
    short: "SP 5",
    sub: "Green Apple & Roasted Tonka",
    category: "Night & Spices",
    color: "#1f1d1b",
    cap: "#2c2824",
    label: "#1f1d1b",
    ink: "#d9d2c5",
    price: 405,
    compareAt: 500,
    sizes: ["5ml Normal", "5ml HQ", "10ml"],
    sizePrices: { "5ml Normal": 405, "5ml HQ": 461, "10ml": 595 },
    rating: 4.5,
    reviews: 188,
    tagline: "Green apple, crushed black pepper and roasted tonka.",
    description: "A dark nocturnal scent pairing crisp juicy fruit with warming pepper and sweet hypnotic roasted tonka.",
    benefits: ["Intriguing date-night profile", "Precision decanted flacon juice", "Compact travel size"],
    ingredients: "Alcohol Denat., Parfum, Coumarin, Black Pepper Oil.",
    howTo: "Spray on collar and lapels for close intimate projection.",
  },

  // ================= 02 / WOMEN =================
  {
    id: "lattafa-khamrah",
    image: "/images/perfumes/lattafa-khamrah-transparent.png",
    kind: "bottle",
    section: "women",
    name: "SP 6",
    short: "SP 6",
    sub: "Cinnamon & Praline Dates",
    category: "Gourmand & Cozy",
    color: "#7a3f14",
    cap: "#1a120c",
    label: "#f6f2ea",
    ink: "#111111",
    glass: true,
    liquid: "#b8752a",
    price: 482,
    compareAt: 650,
    sizes: ["5ml Normal", "10ml"],
    sizePrices: { "5ml Normal": 482, "5ml HQ": 538, "10ml": 748 },
    rating: 4.8,
    reviews: 340,
    tagline: "Cinnamon, golden dates and warm praline.",
    description: "A sumptuous oriental gourmand echoing boozy spiced desserts, Madagascar vanilla bean, and toasted tonka sweetness.",
    benefits: ["Extremely long-lasting 12+ hour wear", "Rich sweet cloud projection", "Winter & evening signature"],
    ingredients: "Alcohol Denat., Parfum, Cinnamyl Alcohol, Benzyl Alcohol, Eugenol.",
    howTo: "One spray on each collarbone. Avoid rubbing wrists to preserve top cinnamon accords.",
  },
  {
    id: "zara-rich-warm-addictive",
    image: "/images/perfumes/rich-warm-addictive-transparent.png",
    kind: "bottle",
    section: "women",
    name: "SP 7",
    short: "SP 7",
    sub: "White Honey & Warm Rum",
    category: "Warm & Cozy",
    color: "#8a5229",
    cap: "#181818",
    label: "#f4ede2",
    ink: "#261a12",
    glass: true,
    liquid: "#c8853a",
    price: 432,
    compareAt: 550,
    sizes: ["5ml Normal", "5ml HQ", "10ml"],
    sizePrices: { "5ml Normal": 432, "5ml HQ": 488, "10ml": 648 },
    rating: 4.7,
    reviews: 490,
    tagline: "White honey, toasted coconut and dark rum.",
    description: "A beloved cult-favorite fragrance radiating effortless comfort with warm honey, creamy coconut milk, and blonde tobacco.",
    benefits: ["Comforting intimate scent bubble", "Zero artificial sharpness", "Perfect casual nightwear"],
    ingredients: "Alcohol Denat., Parfum, Coumarin, Linalool, Hydroxycitronellal.",
    howTo: "Generously mist over warm skin and cotton fabrics for a sweet lingering trail.",
  },
  {
    id: "ck-one",
    image: "/images/perfumes/ck-one-transparent.png",
    kind: "mist",
    section: "women",
    name: "SP 8",
    short: "SP 8",
    sub: "Lemon & Clean Green Tea",
    category: "Fresh & Citrus",
    color: "#e8eef0",
    cap: "#f7f7f5",
    label: "#ffffff",
    ink: "#111111",
    glass: true,
    liquid: "#f0f5f7",
    price: 527,
    compareAt: 699,
    sizes: ["5ml Normal", "5ml HQ", "10ml"],
    sizePrices: { "5ml Normal": 527, "5ml HQ": 582, "10ml": 838 },
    rating: 4.8,
    reviews: 812,
    tagline: "Sparkling lemon, green tea and fresh jasmine.",
    description: "The iconic clean, effortless scent that defined modern unisex freshness. Crisp citrus top notes resting on green hedione.",
    benefits: ["Effortless everyday versatility", "Ultra-crisp refreshing drydown", "Universal crowd-pleaser"],
    ingredients: "Alcohol Denat., Aqua, Citrus Limon Peel Extract, Camellia Sinensis.",
    howTo: "Apply post-shower across chest and forearms for an energizing uplift.",
  },
  {
    id: "ck2",
    image: "/images/perfumes/ck2-transparent.png",
    kind: "dropper",
    section: "women",
    name: "SP 9",
    short: "SP 9",
    sub: "Wasabi & Mineral Rain",
    category: "Mineral & Urban",
    color: "#e6f0f2",
    cap: "#f7f7f5",
    label: "#ffffff",
    ink: "#111111",
    glass: true,
    liquid: "#eef7fa",
    price: 665,
    compareAt: 850,
    sizes: ["5ml Normal", "5ml HQ", "10ml"],
    sizePrices: { "5ml Normal": 665, "5ml HQ": 721, "10ml": 1115 },
    rating: 4.7,
    reviews: 154,
    tagline: "Spicy wasabi, wet cobblestones and violet leaf.",
    description: "A rare discontinued masterpiece balancing electric wasabi spice with mineral wet rain and warm incense.",
    benefits: ["Rare discontinued collector decant", "Futuristic mineral accord", "Distinctive conversation starter"],
    ingredients: "Alcohol Denat., Parfum, Limonene, Citral, Linalool.",
    howTo: "Spray on wrists and neck when you want a completely singular fragrance identity.",
  },
  {
    id: "zara-sunrise",
    image: "/images/perfumes/sunrise-transparent.png",
    kind: "tube",
    section: "women",
    name: "SP 10",
    short: "SP 10",
    sub: "Italian Bergamot & Amber",
    category: "Solar Citrus",
    color: "#f3ede3",
    cap: "#c97a38",
    label: "#f3ede3",
    ink: "#4a2a12",
    price: 448,
    compareAt: 580,
    sizes: ["10ml", "5ml Normal", "5ml HQ"],
    sizePrices: { "10ml": 682, "5ml Normal": 448, "5ml HQ": 504 },
    rating: 4.8,
    reviews: 620,
    tagline: "Italian bergamot, ginger and solar amber.",
    description: "A radiant solar citrus opening with crystalline Italian bergamot and spicy ginger, settling into golden desert amber.",
    benefits: ["Bright optimistic projection", "High-mist atomizer", "Summer & daytime staple"],
    ingredients: "Alcohol Denat., Citrus Bergamia, Zingiber Officinale, Amber.",
    howTo: "Spritz across neck and shoulders on bright warm days.",
  },

  // ================= 03 / BUNDLES =================
  {
    id: "bundle-winter-layers-trio",
    image: "/images/perfumes/bundle-winter-layers-trio.png",
    kind: "perfume",
    section: "bundles",
    name: "SP B1",
    short: "SP B1",
    sub: "Men’s 3-Decant Wardrobe",
    category: "Gifting Trio",
    color: "#242426",
    cap: "#111111",
    label: "#f2eee9",
    ink: "#111111",
    glass: true,
    liquid: "#2e2b26",
    price: 1799,
    compareAt: 2400,
    sizes: ["5ml Normal", "5ml HQ", "10ml"],
    sizePrices: { "5ml Normal": 1799, "5ml HQ": 1967, "10ml": 3401 },
    rating: 4.9,
    reviews: 142,
    tagline: "SP 2 + SP 1 + SP 8",
    description: "Warm smoky oud, reserve powdery iris-leather elegance, and crisp citrus-musk versatility — a complete 3-sample gifting wardrobe from daytime refinement to evening distinction.",
    benefits: ["3 curated decants in luxury presentation", "Covers daytime, office & evening", "Authentic retail flacon juice"],
    ingredients: "3 authentic decanted extractions: SP 2, SP 1, SP 8.",
    howTo: "Layer SP 8 for morning freshness, SP 1 for evening events, or SP 2 for deep warmth.",
  },
  {
    id: "bundle-winter-warmth-trio",
    image: "/images/perfumes/bundle-winter-warmth-trio.png",
    kind: "bottle",
    section: "bundles",
    name: "SP B2",
    short: "SP B2",
    sub: "Women’s 3-Decant Wardrobe",
    category: "Gifting Trio",
    color: "#7f421a",
    cap: "#19120c",
    label: "#f5f0e8",
    ink: "#111111",
    glass: true,
    liquid: "#b8762e",
    price: 1199,
    compareAt: 1650,
    sizes: ["5ml Normal", "5ml HQ", "10ml"],
    sizePrices: { "5ml Normal": 1199, "5ml HQ": 1367, "10ml": 1991 },
    rating: 4.9,
    reviews: 186,
    tagline: "SP 7 + SP 6 + SP 5",
    description: "Golden honeyed coconut, spiced praline dates, and warm tonka bean — three enveloping cold-weather gourmands curated for effortless signature layering.",
    benefits: ["3 sweet & spiced winter bestsellers", "Over 12 hours combined longevity", "Independently rebottled flacons"],
    ingredients: "3 authentic decanted extractions: SP 7, SP 6, SP 5.",
    howTo: "Mist SP 6 on pulse points, blend with SP 7 on wool fabrics for an irresistible warm bubble.",
  },
  {
    id: "spotlight-arabian",
    image: "/images/perfumes/spotlight-arabian.png",
    kind: "bottle",
    section: "bundles",
    name: "SP B3",
    short: "SP B3",
    sub: "Middle-Eastern Luxury Duet",
    category: "Duo Bundle",
    color: "#5e3212",
    cap: "#140e09",
    label: "#f4eee4",
    ink: "#111111",
    glass: true,
    liquid: "#a26222",
    price: 814,
    compareAt: 1100,
    sizes: ["5ml Normal", "5ml HQ", "10ml"],
    sizePrices: { "5ml Normal": 814, "5ml HQ": 926, "10ml": 1196 },
    rating: 4.8,
    reviews: 115,
    tagline: "SP 6 + SP 2",
    description: "Opulent spiced date gourmand paired with dark smoky resinous oud. The definitive middle-eastern luxury duet at a bundled preview price.",
    benefits: ["Enchanting Arabian aura", "Rich contrast of sweet spice & smoky oud", "Two 5ml decants"],
    ingredients: "2 authentic decanted extractions: SP 6, SP 2.",
    howTo: "Wear SP 6 for sweet warmth, layer SP 2 on outer clothing for depth.",
  },
];

// ---------- colour ----------

type RGB = [number, number, number];
const hexRgb = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mixRgb = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const css = (c: RGB, k = 1, a = 1) => `rgba(${[0, 1, 2].map((i) => Math.round(Math.min(255, Math.max(0, c[i] * k)))).join(",")},${a})`;
const WHITE: RGB = [255, 255, 255];
const lum = (c: RGB) => c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;

// ---------- packaging (viewBox 200 x 300, everything stands on y = 286) ----------

type Box = { x: number; y: number; w: number; h: number };
type Shape = {
  body: string;
  box: Box;
  /** Where the print sits. `paper` puts it on a paper label instead of straight on the pack. */
  print: Box & { paper?: boolean };
  /** Liquid top for see-through packs. */
  fill?: number;
  /** Dip tube for see-through pumps and mists. */
  tube?: boolean;
  cap: (id: string) => ReactNode;
};

const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

// knurled grip: fine vertical ridges across a cap
const ridges = (x: number, y: number, w: number, h: number, step = 2.6) =>
  Array.from({ length: Math.floor(w / step) }, (_, i) => (
    <line key={i} x1={x + 1 + i * step} y1={y + 1.5} x2={x + 1 + i * step} y2={y + h - 1.5} stroke="#000" strokeOpacity={i % 2 ? 0.14 : 0.06} strokeWidth="1" />
  ));

const SHAPES: Record<Kind, Shape> = {
  jar: {
    body: "M42 208 H158 Q162 208 162 214 V276 Q162 286 150 286 H50 Q38 286 38 276 V214 Q38 208 42 208 Z",
    box: { x: 38, y: 208, w: 124, h: 78 },
    print: { x: 38, y: 226, w: 124, h: 46 },
    cap: (id) => (
      <>
        <path d={rr(36, 172, 128, 38, 6)} fill={`url(#${id}-cap)`} />
        <g>{ridges(36, 178, 128, 30, 2.2)}</g>
        <path d={rr(36, 172, 128, 38, 6)} fill={`url(#${id}-capv)`} />
        <path d="M42 173.2 H158" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2" />
        <rect x="38" y="208" width="124" height="3" fill="#000" opacity="0.22" />
      </>
    ),
  },
  tube: {
    body: "M80 250 L67 74 Q66 60 74 58 L126 58 Q134 60 133 74 L120 250 Z",
    box: { x: 66, y: 58, w: 68, h: 192 },
    print: { x: 66, y: 104, w: 68, h: 110 },
    cap: (id) => (
      <>
        <path d={`M62 40 H138 V58 H62 Z`} fill={`url(#${id}-body)`} />
        <path d={`M62 40 ${Array.from({ length: 19 }, (_, i) => `L${64 + i * 4} ${i % 2 ? 40 : 37.5}`).join(" ")} L138 40`} fill={`url(#${id}-body)`} />
        {Array.from({ length: 18 }, (_, i) => (
          <line key={i} x1={64 + i * 4.1} y1="42" x2={64 + i * 4.1} y2="56" stroke="#000" strokeOpacity="0.09" />
        ))}
        <text x="132" y="53" fontSize="3.4" textAnchor="end" fill="#000" fillOpacity="0.35">SCENTPREVIEW · 10ML</text>
        <path d={rr(73, 248, 54, 38, 7)} fill={`url(#${id}-cap)`} />
        <g>{ridges(73, 256, 54, 28, 2.4)}</g>
        <path d={rr(73, 248, 54, 38, 7)} fill={`url(#${id}-capv)`} />
        <path d="M75 251 H125" stroke="#000" strokeOpacity="0.2" />
      </>
    ),
  },
  pump: {
    body: "M58 136 Q58 110 84 108 L116 108 Q142 110 142 136 L142 272 Q142 286 128 286 L72 286 Q58 286 58 272 Z",
    box: { x: 58, y: 108, w: 84, h: 178 },
    print: { x: 58, y: 160, w: 84, h: 90 },
    tube: true,
    fill: 132,
    cap: (id) => (
      <>
        <rect x="95.5" y="60" width="9" height="32" fill={`url(#${id}-cap)`} />
        <path d="M82 50 H126 Q132 50 132 55 V64 H78 V55 Q78 50 82 50 Z" fill={`url(#${id}-cap)`} />
        <path d="M126 53 H153 Q157 53 157 56.5 V60 H126 Z" fill={`url(#${id}-cap)`} />
        <path d="M80 51.5 H128" stroke="#fff" strokeOpacity="0.7" />
        <path d={rr(80, 88, 40, 22, 3)} fill={`url(#${id}-cap)`} />
        <g>{ridges(80, 88, 40, 22, 2.2)}</g>
        <path d={rr(80, 88, 40, 22, 3)} fill={`url(#${id}-capv)`} />
      </>
    ),
  },
  dropper: {
    body: "M64 170 Q64 152 86 150 L86 140 L114 140 L114 150 Q136 152 136 170 L136 272 Q136 286 122 286 L78 286 Q64 286 64 272 Z",
    box: { x: 64, y: 140, w: 72, h: 146 },
    print: { x: 64, y: 192, w: 72, h: 70, paper: true },
    fill: 168,
    cap: (id) => (
      <>
        <path d="M86 118 V86 Q86 62 100 62 Q114 62 114 86 V118 Z" fill={`url(#${id}-bulb)`} />
        <path d="M91 74 Q93 66 100 65" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d={rr(80, 114, 40, 28, 3)} fill={`url(#${id}-cap)`} />
        <g>{ridges(80, 114, 40, 28, 2)}</g>
        <path d={rr(80, 114, 40, 28, 3)} fill={`url(#${id}-capv)`} />
      </>
    ),
  },
  perfume: {
    body: "M58 166 H142 Q154 166 156 178 L158 270 Q158 286 142 286 H58 Q42 286 42 270 L44 178 Q46 166 58 166 Z",
    box: { x: 42, y: 166, w: 116, h: 120 },
    print: { x: 66, y: 204, w: 68, h: 44 },
    fill: 178,
    cap: (id) => (
      <>
        <rect x="88" y="150" width="24" height="18" fill={`url(#${id}-cap)`} />
        <path d={rr(70, 96, 60, 56, 4)} fill={`url(#${id}-cap)`} />
        <path d={rr(70, 96, 60, 56, 4)} fill={`url(#${id}-capv)`} />
        <path d="M72 97.5 H128" stroke="#fff" strokeOpacity="0.8" />
      </>
    ),
  },
  mist: {
    body: "M62 154 Q62 130 86 128 L114 128 Q138 130 138 154 L138 272 Q138 286 124 286 L76 286 Q62 286 62 272 Z",
    box: { x: 62, y: 128, w: 76, h: 158 },
    print: { x: 62, y: 178, w: 76, h: 78 },
    tube: true,
    fill: 168,
    cap: (id) => (
      <>
        <path d={rr(82, 110, 36, 22, 3)} fill={`url(#${id}-cap)`} />
        <g>{ridges(82, 110, 36, 22, 2.2)}</g>
        <path d={rr(86, 82, 28, 30, 6)} fill={`url(#${id}-cap)`} />
        <path d={rr(86, 82, 28, 30, 6)} fill={`url(#${id}-capv)`} />
        <circle cx="111" cy="94" r="2.2" fill="#000" opacity="0.45" />
      </>
    ),
  },
  bottle: {
    body: "M62 114 Q62 86 86 82 L114 82 Q138 86 138 114 L141 268 Q141 286 122 286 L78 286 Q59 286 59 268 Z",
    box: { x: 59, y: 82, w: 82, h: 204 },
    print: { x: 59, y: 140, w: 82, h: 100, paper: true },
    fill: 110,
    cap: (id) => (
      <>
        <path d={rr(78, 50, 44, 34, 6)} fill={`url(#${id}-cap)`} />
        <path d={rr(78, 50, 44, 34, 6)} fill={`url(#${id}-capv)`} />
        <path d="M80 63 H120" stroke="#000" strokeOpacity="0.45" />
        <path d="M80 51.5 H120" stroke="#fff" strokeOpacity="0.4" />
      </>
    ),
  },
  lip: {
    body: "M89 250 L85 152 Q85 144 91 143 L109 143 Q115 144 115 152 L111 250 Z",
    box: { x: 85, y: 143, w: 30, h: 107 },
    print: { x: 85, y: 166, w: 30, h: 60 },
    cap: (id) => (
      <>
        <path d={`M83 128 H117 V143 H83 Z`} fill={`url(#${id}-body)`} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={85 + i * 4.2} y1="130" x2={85 + i * 4.2} y2="141" stroke="#000" strokeOpacity="0.08" />
        ))}
        <path d={rr(86, 248, 28, 38, 5)} fill={`url(#${id}-cap)`} />
        <path d={rr(86, 248, 28, 38, 5)} fill={`url(#${id}-capv)`} />
      </>
    ),
  },
  stick: {
    body: rr(81, 224, 38, 62, 4),
    box: { x: 81, y: 224, w: 38, h: 62 },
    print: { x: 81, y: 236, w: 38, h: 38 },
    cap: (id) => (
      <>
        <path d={rr(81, 168, 38, 58, 5)} fill={`url(#${id}-cap)`} />
        <path d={rr(81, 168, 38, 58, 5)} fill={`url(#${id}-capv)`} />
        <rect x="81" y="222" width="38" height="2.5" fill="#000" opacity="0.3" />
      </>
    ),
  },
};

const EXTENT: Record<Kind, { top: number; w: number }> = {
  jar: { top: 172, w: 128 }, tube: { top: 37, w: 76 }, pump: { top: 50, w: 101 }, dropper: { top: 60, w: 72 },
  perfume: { top: 96, w: 116 }, mist: { top: 80, w: 76 }, bottle: { top: 48, w: 84 }, stick: { top: 166, w: 38 }, lip: { top: 128, w: 34 },
};
const pageZoom = (k: Kind) => Math.min(2.2, 262 / (290 - EXTENT[k].top), 190 / EXTENT[k].w);

// ---------- the product drawing ----------

function ProductArt({ p, spin, className }: { p: Product; spin?: MotionValue<number>; className?: string }) {
  const id = "ps" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const s = SHAPES[p.kind];
  const c = hexRgb(p.color);
  const k = hexRgb(p.cap);
  const lab = hexRgb(p.label);
  const a = p.glass ? (lum(c) > 200 ? 0.32 : 0.85) : 1;
  const liq = hexRgb(p.liquid ?? p.color);
  const { print: P, box: B } = s;
  const period = P.w * 2.6;
  const fallback = useMotionValue(0);
  const x = useTransform(spin ?? fallback, (v) => -((((v * period) % period) + period) % period));
  const nameSize = Math.min(10.5, P.w * 0.12, (P.w * 1.12) / p.short.length);
  const subSize = Math.min(7, P.w * 0.08, (P.w * 1.25) / (p.sub ?? "").length);
  
  const printArt = (dx: number) => (
    <g transform={`translate(${dx} 0)`}>
      {P.paper && <rect x={P.x} y={P.y} width={P.w} height={P.h} fill={css(lab)} />}
      <text x={P.x + P.w / 2} y={P.y + P.h * 0.2} fill={p.ink} fontSize={Math.min(6.5, P.w * 0.075)} fontWeight="700" letterSpacing={Math.min(1.6, P.w * 0.02)} textAnchor="middle">SCENTPREVIEW</text>
      <text x={P.x + P.w / 2} y={P.y + P.h * 0.46} fill={p.ink} fontSize={nameSize} fontWeight="600" letterSpacing="-0.15" textAnchor="middle">{p.short}</text>
      {p.sub && <text x={P.x + P.w / 2} y={P.y + P.h * 0.62} fill={p.ink} fontSize={subSize} opacity="0.8" textAnchor="middle">{p.sub}</text>}
      <text x={P.x + P.w / 2} y={P.y + P.h * 0.86} fill={p.ink} opacity="0.6" fontSize={Math.min(5.8, P.w * 0.07)} textAnchor="middle">{p.sizes[0]}</text>
    </g>
  );

  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" x2="1">
          <stop offset="0" stopColor={css(c, 0.42, a)} />
          <stop offset="0.06" stopColor={css(c, 0.64, a)} />
          <stop offset="0.1" stopColor={css(c, 0.92, a)} />
          <stop offset="0.16" stopColor={css(mixRgb(c, WHITE, 0.16), 1, a)} />
          <stop offset="0.36" stopColor={css(c, 1.02, a)} />
          <stop offset="0.55" stopColor={css(c, 0.93, a)} />
          <stop offset="0.76" stopColor={css(c, 0.78, a)} />
          <stop offset="0.9" stopColor={css(c, 0.6, a)} />
          <stop offset="0.95" stopColor={css(mixRgb(c, WHITE, 0.14), 0.9, a)} />
          <stop offset="1" stopColor={css(c, 0.5, a)} />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" x2="1">
          <stop offset="0" stopColor={css(k, 0.4)} />
          <stop offset="0.1" stopColor={css(k, 0.7)} />
          <stop offset="0.22" stopColor={css(mixRgb(k, WHITE, 0.6))} />
          <stop offset="0.3" stopColor={css(k, 1.02)} />
          <stop offset="0.6" stopColor={css(k, 0.86)} />
          <stop offset="0.85" stopColor={css(k, 0.62)} />
          <stop offset="0.93" stopColor={css(mixRgb(k, WHITE, 0.2), 0.9)} />
          <stop offset="1" stopColor={css(k, 0.4)} />
        </linearGradient>
        <linearGradient id={`${id}-capv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.86" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-wrap`} x1="0" x2="1">
          <stop offset="0" stopColor={css(c, 0.42)} stopOpacity="1" />
          <stop offset="0.14" stopColor={css(c, 0.42)} stopOpacity="0" />
          <stop offset="0.86" stopColor={css(c, 0.42)} stopOpacity="0" />
          <stop offset="1" stopColor={css(c, 0.42)} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`${id}-liquid`} x1="0" x2="1">
          <stop offset="0" stopColor={css(liq, 0.7)} />
          <stop offset="0.3" stopColor={css(liq, 1)} />
          <stop offset="0.7" stopColor={css(liq, 0.92)} />
          <stop offset="1" stopColor={css(liq, 0.7)} />
        </linearGradient>
        <filter id={`${id}-soft`} x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={s.body} />
        </clipPath>
        <radialGradient id={`${id}-bulb`} cx="0.35" cy="0.25" r="0.9">
          <stop offset="0" stopColor={css(mixRgb(k, WHITE, 0.4))} />
          <stop offset="0.55" stopColor={css(k, 0.9)} />
          <stop offset="1" stopColor={css(k, 0.55)} />
        </radialGradient>
        <radialGradient id={`${id}-floor`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.25" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* contact shadow */}
      <ellipse cx="100" cy="287" rx={B.w * 0.7} ry="6" fill={`url(#${id}-floor)`} />
      <ellipse cx="100" cy="286.3" rx={B.w * 0.47} ry="1.4" fill="#000" opacity="0.35" />

      <path d={s.body} fill={`url(#${id}-body)`} />
      <g clipPath={`url(#${id}-clip)`}>
        {p.glass && s.fill !== undefined && (
          <>
            <rect x={B.x + 3} y={s.fill} width={B.w - 6} height={286 - s.fill - 9} fill={`url(#${id}-liquid)`} opacity="0.8" />
            <rect x={B.x + 3} y={s.fill} width={B.w - 6} height="1.6" fill="#fff" opacity="0.45" />
            {s.tube && <rect x="98.6" y={B.y - 4} width="2.8" height={286 - B.y - 4} fill="#fff" opacity="0.4" />}
            <rect x={B.x} y="274" width={B.w} height="12" fill={css(c, 0.5, 0.55)} />
            <path d={`M${B.x + 6} 275 H${B.x + B.w - 6}`} stroke="#fff" strokeOpacity="0.5" strokeWidth="0.8" />
          </>
        )}
        <motion.g style={{ x }}>
          {printArt(0)}
          {printArt(period)}
        </motion.g>
        <rect x={B.x} y={P.y - 2} width={B.w} height={P.h + 4} fill={`url(#${id}-wrap)`} opacity="0.5" />
        <rect x={B.x} y={B.y} width={B.w} height={B.h} fill={`url(#${id}-shade)`} />
        <rect x={B.x + B.w * 0.07} y={B.y + 4} width={B.w * 0.11} height={B.h - 8} rx="3" fill="#fff" opacity={lum(c) > 200 ? 0.45 : 0.3} filter={`url(#${id}-soft)`} />
        <rect x={B.x + B.w * 0.11} y={B.y + 6} width={B.w * 0.028} height={B.h - 12} rx="1" fill="#fff" opacity="0.85" />
        <rect x={B.x + B.w * 0.86} y={B.y + 8} width={B.w * 0.025} height={B.h - 16} rx="1" fill="#fff" opacity="0.3" />
      </g>
      <path d={s.body} fill="none" stroke={css(c, 0.45, 0.45)} strokeWidth="0.7" />
      {s.cap(id)}
    </svg>
  );
}

// ---------- component ----------

export type ProductShelfProps = {
  products?: Product[];
  currency?: string;
  className?: string;
  onAddToCart?: (p: Product, size: string, qty: number) => void;
  onOpenDetails?: (p: Product) => void;
  onOpenBag?: () => void;
  bagCount?: number;
  stock?: any;
  hideHeader?: boolean;
  children?: ReactNode;
};

const SPRING = { type: "spring" as const, bounce: 0, duration: 0.55 };

export function ProductShelf({ 
  products = DEFAULT_PRODUCTS, 
  currency = "₹", 
  className, 
  onAddToCart,
  onOpenDetails,
  onOpenBag,
  bagCount = 0,
  stock,
  hideHeader = false,
  children 
}: ProductShelfProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [localBag, setLocalBag] = useState(0);
  const [bump, setBump] = useState(0);
  const bagRef = useRef<HTMLButtonElement | null>(null);
  
  const SECTIONS = [
    { id: "men", title: "01 / MEN", subtitle: "Tuscan Iris, Incense & Masculine Signatures" },
    { id: "women", title: "02 / WOMEN", subtitle: "Honeyed Spices, Solar Amber & Clean Hedione" },
    { id: "bundles", title: "03 / BUNDLES", subtitle: "Curated Layering Trios & Spotlight Duets" },
  ] as const;

  const activeSections = SECTIONS.map((sec) => ({
    ...sec,
    items: products.filter((p) => (p.section || "men") === sec.id),
  })).filter((sec) => sec.items.length > 0);

  const open = products.find((p) => p.id === openId) ?? null;

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  const handleAddInternal = (p: Product, size: string, qty: number) => {
    setLocalBag((b) => b + qty);
    setBump((n) => n + 1);
    onAddToCart?.(p, size, qty);
  };

  const displayBagCount = bagCount > 0 ? bagCount : localBag;

  return (
    <div
      className={cn("relative min-h-dvh w-full overflow-x-hidden bg-[#f3f1ed] font-sans text-[#111] antialiased select-none", className)}
    >
      {/* Wordmark top left, bag top right; both float above the product page too */}
      {!hideHeader && (
        <>
          <div className="pointer-events-none fixed top-4 left-5 z-30 flex h-11 items-center text-[15px] font-bold tracking-[0.18em] text-[#2F4F4F]">
            SCENTPREVIEW
          </div>

          <button
            ref={bagRef}
            type="button"
            onClick={() => onOpenBag?.()}
            aria-label={`Bag, ${displayBagCount} items`}
            className="fixed top-4 right-4 z-30 grid size-11 place-items-center rounded-xl bg-white/80 text-[#111111] shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.06] backdrop-blur-xl transition-[transform,background-color] duration-100 hover:bg-white active:scale-[0.94] focus-visible:outline-2 focus-visible:outline-[#111111] cursor-pointer"
          >
            <ShoppingBag className="size-[19px]" strokeWidth={1.6} />
            {displayBagCount > 0 && (
              <motion.span
                key={bump}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={SPRING}
                className="absolute -top-1.5 -right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-[9px] bg-[#2F4F4F] px-1 text-[11px] font-semibold text-white tabular-nums"
              >
                {displayBagCount}
              </motion.span>
            )}
          </button>
        </>
      )}

      <LayoutGroup>
        <main className={cn("mx-auto w-full max-w-[1120px] px-4 sm:px-6 pb-16", hideHeader ? "pt-6 sm:pt-10" : "pt-16 sm:pt-20")}>
          {activeSections.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-sm font-semibold text-[#111111]">No fragrances found</p>
              <p className="text-xs text-[#8A8A8A] mt-1.5">Try searching for "gentleman", "zara", "khamrah", or "fresh"</p>
            </div>
          ) : (
            activeSections.map((sec) => (
              <section 
                key={sec.id} 
                id={`shelf-${sec.id}`}
                aria-label={sec.title} 
                className="relative mb-16 sm:mb-24 scroll-mt-20"
              >
                {/* Shelf category title */}
                <div className="mb-4 px-3 text-left flex items-baseline justify-between border-b border-[#D9D9D6]/60 pb-2">
                  <span className="text-[12px] sm:text-[13px] uppercase tracking-[0.22em] text-[#2F4F4F] font-bold">
                    {sec.title}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[#8A8A8A] font-medium hidden sm:inline-block">
                    {sec.subtitle}
                  </span>
                </div>

                <div className={cn(
                  "relative z-10 grid items-start gap-4 sm:gap-6 px-2 sm:px-4",
                  sec.id === "bundles" 
                    ? "grid-cols-1 sm:grid-cols-3 max-w-[960px] mx-auto"
                    : "grid-cols-2 sm:grid-cols-5"
                )}>
                  {sec.items.map((p) => {
                    const isBundle = p.section === "bundles";
                    const pStock = isBundle ? stock?.bundles?.[p.id] : stock?.fragrances?.[p.id];
                    const isOOS = isBundle 
                      ? (Number(pStock) || 0) <= 0 
                      : pStock ? Object.values(pStock).every(v => (Number(v) || 0) <= 0) : false;

                    const handleCardClick = () => {
                      if (onOpenDetails) {
                        onOpenDetails(p);
                      } else {
                        setOpenId(p.id);
                      }
                    };

                    return (
                      <div key={p.id} className="flex flex-col items-center justify-between h-full group pb-2">
                        {/* 1. Bottle Standing on Visible Shelf */}
                        <div className="w-full flex flex-col items-center">
                          <button
                            type="button"
                            onClick={handleCardClick}
                            aria-label={`View full order page for ${p.name}`}
                            className={cn(
                              "relative w-full cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#2F4F4F] group/flacon flex flex-col items-center justify-end",
                              isBundle ? "h-[160px] sm:h-[200px] max-w-[260px]" : "h-[180px] sm:h-[220px] max-w-[170px]"
                            )}
                          >
                            {p.image ? (
                              <div className="w-full h-full flex flex-col items-center justify-end pb-1 relative overflow-visible">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className={cn(
                                    "w-auto max-h-[92%] max-w-[88%] object-contain select-none filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.22)] group-hover/flacon:scale-105 transition-transform duration-200 pointer-events-none block",
                                    isBundle ? "max-h-[92%] max-w-[96%]" : "max-h-[90%] max-w-[88%]"
                                  )}
                                  loading="eager"
                                  decoding="sync"
                                />
                                <div className={cn(
                                  "bg-black/25 rounded-full blur-[2px] -mt-1 pointer-events-none",
                                  isBundle ? "w-[75%] h-2.5" : "w-[60%] h-2"
                                )} />
                              </div>
                            ) : (
                              <ProductArt p={p} className="size-full group-hover/flacon:scale-[1.02] transition-transform duration-200" />
                            )}
                            {isOOS && (
                              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/60 text-white backdrop-blur-xs">
                                Sold out
                              </span>
                            )}
                          </button>

                          {/* Individual Visible Floating Shelf Ledge */}
                          <div aria-hidden className="w-full relative h-[14px] -mt-[3px] pointer-events-none">
                            <div className="absolute inset-x-0 top-0 h-[6px] bg-[linear-gradient(to_bottom,#e2e2e6,#fbfbfd)]" />
                            <div className="absolute inset-x-0 top-[6px] h-[6px] bg-[linear-gradient(to_bottom,#ffffff,#ececf0)] shadow-[0_1px_0_rgba(0,0,0,0.06)]" />
                            <div className="absolute inset-x-[4%] top-[12px] h-[18px] bg-[radial-gradient(50%_100%_at_50%_0%,rgba(0,0,0,0.12),transparent)]" />
                          </div>
                        </div>

                        {/* 2. Texts directly below each perfume */}
                        <div className="w-full mt-3 flex flex-col items-center text-center px-1 flex-1 justify-between">
                          <div 
                            className="cursor-pointer w-full" 
                            onClick={handleCardClick}
                          >
                            <h3 className="text-sm font-bold text-[#111111] hover:text-[#2F4F4F] transition-colors leading-tight line-clamp-1">
                              {p.short || p.name}
                            </h3>
                            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8A8A8A] font-medium block truncate mt-0.5">
                              {p.sub}
                            </span>
                            <div className="mt-1 text-xs sm:text-sm font-bold text-[#2F4F4F] tabular-nums">
                              {currency}{p.price}
                              {p.compareAt && (
                                <span className="ml-1.5 text-[10px] sm:text-[11px] text-[#8A8A8A] line-through font-normal">
                                  {currency}{p.compareAt}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 3. Add to Cart button directly below each perfume */}
                          <div className="w-full mt-2.5">
                            <button
                              type="button"
                              disabled={isOOS}
                              onClick={(e) => {
                                e.stopPropagation();
                                const defaultSize = p.sizes[0] || "5ml Normal";
                                handleAddInternal(p, defaultSize, 1);
                              }}
                              className={cn(
                                "w-full py-2 px-2 rounded-xl text-xs font-medium tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs",
                                isOOS 
                                  ? "bg-[#EFEDE6] text-[#8A8A8A] cursor-not-allowed border border-[#D9D9D6]" 
                                  : "bg-[#2F4F4F] text-white hover:bg-[#253f3f] active:scale-[0.98]"
                              )}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>{isOOS ? "Sold out" : `Add to cart`}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </main>

        <AnimatePresence>
          {open && (
            <ProductPage 
              key={open.id} 
              p={open} 
              currency={currency} 
              onClose={() => setOpenId(null)} 
              onAdd={handleAddInternal} 
              onOpenDetails={onOpenDetails}
              bagRef={bagRef}
              stock={stock}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
      {children}
    </div>
  );
}

function ProductPage({ p, currency, onClose, onAdd, onOpenDetails, bagRef, stock }: {
  p: Product; 
  currency: string; 
  onClose: () => void; 
  onAdd: (p: Product, size: string, qty: number) => void; 
  onOpenDetails?: (p: Product) => void;
  bagRef: RefObject<HTMLButtonElement | null>;
  stock?: any;
}) {
  const reduce = useReducedMotion();
  const spin = useMotionValue(0);
  const [size, setSize] = useState(p.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [section, setSection] = useState<string | null>("Details");
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const drag = useRef<{ x: number; v: number; samples: { x: number; t: number }[] } | null>(null);

  const isBundle = p.section === "bundles";
  const bundleStockCount = stock?.bundles?.[p.id];
  const fragranceStock = stock?.fragrances?.[p.id];
  const isSizeOOS = isBundle ? (Number(bundleStockCount) || 0) <= 0 : fragranceStock ? (Number(fragranceStock[size]) || 0) <= 0 : false;
  const isAllOOS = isBundle ? (Number(bundleStockCount) || 0) <= 0 : fragranceStock ? Object.values(fragranceStock).every(v => (Number(v) || 0) <= 0) : false;

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    if (reduce) return;
    const c = animate(spin, 1, { duration: 1.1, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 });
    return () => c.stop();
  }, [spin, reduce]);

  const price = p.sizePrices?.[size] ?? p.price;
  const totalPrice = price * qty;

  const add = () => {
    if (isSizeOOS || isAllOOS) return;
    onAdd(p, size, qty);
    setAdded(true);
    bagRef.current?.animate([{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }], { duration: 320, easing: "ease-out" });
    setTimeout(() => setAdded(false), 1800);
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    spin.stop();
    drag.current = { x: e.clientX, v: spin.get(), samples: [{ x: e.clientX, t: e.timeStamp }] };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    spin.set(d.v - (e.clientX - d.x) / 380);
    d.samples.push({ x: e.clientX, t: e.timeStamp });
    if (d.samples.length > 5) d.samples.shift();
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const vx = last.t > first.t ? ((last.x - first.x) / (last.t - first.t)) * 1000 : 0;
    const velocity = -vx / 380;
    const projected = spin.get() + ((velocity / 1000) * 0.998) / (1 - 0.998);
    animate(spin, Math.round(projected), { type: "spring", bounce: 0, duration: 0.9, velocity });
  };

  const sections: [string, ReactNode][] = [
    ["Chords & Extraction", <ul key="d" className="list-disc space-y-1 pl-5 text-[#6f6a64]">{p.benefits.map((b) => <li key={b}>{b}</li>)}</ul>],
    ["Formulation & Notes", <p key="i" className="text-[#6f6a64] leading-relaxed">{p.ingredients}</p>],
    ["How to wear & layer", <p key="h" className="text-[#6f6a64] leading-relaxed">{p.howTo}</p>],
  ];

  return (
    <motion.div role="dialog" aria-modal="true" aria-label={p.name} className="fixed inset-0 z-40 overflow-y-auto">
      <motion.div className="fixed inset-0 bg-[#f3f1ed]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
      <div className="relative mx-auto grid min-h-full max-w-[1080px] grid-cols-1 items-center gap-8 px-5 pt-20 pb-12 md:grid-cols-[1.05fr_1fr] md:gap-14">
        {/* The product, moved over from the shelf, standing on a white surface */}
        <div className="relative flex flex-col items-center justify-center md:h-[calc(100dvh-7rem)]">
          {p.image ? (
            <div className="flex flex-col items-center justify-center w-full">
              <motion.div
                layoutId={`product-${p.id}`}
                transition={SPRING}
                className="relative z-10 aspect-[2/3] h-[44vh] md:h-[58vh] flex items-center justify-center select-none"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-auto max-w-[88%] object-contain filter drop-shadow-[0_24px_32px_rgba(0,0,0,0.22)] block"
                  loading="eager"
                  decoding="sync"
                />
              </motion.div>
              <motion.div
                aria-hidden
                className="relative -mt-[1.5%] h-[18px] w-[75%] rounded-[3px] bg-[linear-gradient(to_bottom,#ffffff,#ececf0)] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.22)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <p className="mt-5 text-[12px] text-[#8f8982] font-medium">Authentic Retail Flacon Juice</p>
            </div>
          ) : (
            <>
              <motion.div
                layoutId={`product-${p.id}`}
                transition={SPRING}
                className="relative z-10 aspect-[2/3] h-[44vh] cursor-grab touch-none select-none active:cursor-grabbing md:h-[62vh]"
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
              >
                <motion.div
                  className="pointer-events-none size-full"
                  style={{ transformOrigin: "50% 96.7%" }}
                  initial={{ scale: 1 }}
                  animate={{ scale: pageZoom(p.kind) }}
                  exit={{ scale: 1 }}
                  transition={SPRING}
                >
                  <ProductArt p={p} spin={spin} className="size-full" />
                </motion.div>
              </motion.div>
              <motion.div
                aria-hidden
                className="relative -mt-[1.5%] h-[18px] w-[86%] rounded-[3px] bg-[linear-gradient(to_bottom,#ffffff,#ececf0)] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <p className="mt-6 text-[12px] text-[#8f8982]">Drag to turn flacon</p>
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ ...SPRING, delay: 0.05 }}
          className="relative z-20 text-left"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="-ml-1.5 mb-6 inline-flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[15px] text-[#111111] underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-[#111111] cursor-pointer"
          >
            <ChevronLeft className="size-4" strokeWidth={2.2} /> Shelf
          </button>
          
          <div className="text-[13px] uppercase tracking-wider text-[#6f6a64] font-medium">{p.category}</div>
          <h2 className="mt-1 text-[clamp(28px,3.8vw,38px)] leading-[1.08] font-bold tracking-tight text-[#111111]">
            {p.name}
          </h2>
          <div className="mt-6 flex items-baseline gap-2.5 tabular-nums">
            <span className="text-[26px] font-bold text-[#2F4F4F] tracking-tight">{currency}{totalPrice}</span>
            {p.compareAt && (
              <span className="text-[17px] text-[#8f8982] line-through">
                {currency}{(p.compareAt * (price / p.price) * qty).toFixed(0)}
              </span>
            )}
            {qty > 1 && (
              <span className="text-[13px] text-[#8f8982]">
                ({currency}{price} each × {qty})
              </span>
            )}
          </div>

          <p className="mt-4 max-w-[54ch] text-[16px] leading-[1.47] text-[#111111]/85">
            {p.description}
          </p>

          <fieldset className="mt-7">
            <legend className="mb-2.5 text-[14px] font-semibold text-[#111111] uppercase tracking-wider">Volume & Atomizer</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {p.sizes.map((sz) => {
                const on = size === sz;
                const szPrice = p.sizePrices?.[sz] ?? p.price;
                const szOOS = fragranceStock ? (Number(fragranceStock[sz]) || 0) <= 0 : false;

                return (
                  <label
                    key={sz}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border bg-white p-3 text-[14px] transition-all cursor-pointer min-h-[64px]",
                      on ? "border-[#2F4F4F] ring-1 ring-[#2F4F4F] bg-[#EFEDE6]" : "border-[#d9d4cd] hover:border-[#8f8982]",
                      szOOS && "opacity-40 cursor-not-allowed bg-black/5"
                    )}
                  >
                    <input 
                      type="radio" 
                      name="size" 
                      value={sz} 
                      disabled={szOOS} 
                      checked={on} 
                      onChange={() => setSize(sz)} 
                      className="sr-only" 
                    />
                    <span className="font-medium text-[#111111]">{sz}</span>
                    <span className="text-[12px] text-[#6f6a64] tabular-nums font-medium mt-1">
                      {szOOS ? "Sold out" : `${currency}${szPrice}`}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7 flex items-stretch gap-3">
            <div className="flex items-center rounded-xl border border-[#d9d4cd] bg-white">
              <button 
                type="button" 
                aria-label="Decrease quantity" 
                onClick={() => setQty((q) => Math.max(1, q - 1))} 
                className="grid h-full w-11 place-items-center rounded-l-xl text-[#111111] transition-colors active:bg-black/[0.06] disabled:text-[#d9d4cd] cursor-pointer" 
                disabled={qty === 1 || isSizeOOS || isAllOOS}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-7 text-center text-[16px] font-medium tabular-nums" aria-live="polite">{qty}</span>
              <button 
                type="button" 
                aria-label="Increase quantity" 
                onClick={() => setQty((q) => Math.min(9, q + 1))} 
                className="grid h-full w-11 place-items-center rounded-r-xl text-[#111111] transition-colors active:bg-black/[0.06] cursor-pointer"
                disabled={isSizeOOS || isAllOOS}
              >
                <Plus className="size-4" />
              </button>
            </div>
            
            <button
              type="button"
              disabled={isSizeOOS || isAllOOS}
              onClick={add}
              className="h-12 flex-1 rounded-xl bg-[#2F4F4F] text-[15px] font-medium tracking-wide text-white transition-[background-color,transform] duration-100 hover:bg-[#253f3f] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {added ? <Check className="size-4" /> : null}
              <span aria-live="polite">
                {added ? "Added to Bag" : isSizeOOS || isAllOOS ? "Sold Out" : `Add to Bag · ${currency}${totalPrice}`}
              </span>
            </button>
          </div>

          {onOpenDetails && (
            <button
              type="button"
              onClick={() => onOpenDetails(p)}
              className="mt-3 w-full py-2.5 border border-[#d9d4cd] bg-white text-[#111111] hover:border-[#2F4F4F] hover:text-[#2F4F4F] rounded-xl text-xs font-medium tracking-wide transition-colors cursor-pointer text-center"
            >
              View Full Order Page ↗
            </button>
          )}

          <dl className="mt-6 grid gap-1.5 text-[13px] leading-snug">
            <div className="flex gap-2">
              <dt className="font-semibold text-[#111111]">Extraction:</dt>
              <dd className="text-[#6f6a64]">Direct retail flacon decant in sterile shatterproof travel atomizer</dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-[#d9d4cd]">
            {sections.map(([title, body]) => {
              const isOpen = section === title;
              return (
                <div key={title} className="border-b border-[#d9d4cd]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setSection(isOpen ? null : title)}
                    className="flex w-full items-center justify-between py-4 text-left text-[15px] font-semibold tracking-[-0.01em] text-[#111111] cursor-pointer"
                  >
                    {title}
                    <ChevronDown className={cn("size-[18px] text-[#6f6a64] transition-transform duration-300", isOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={SPRING} className="overflow-hidden">
                        <div className="pb-5 text-[14px] leading-relaxed text-[#111111]/80">{body}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
