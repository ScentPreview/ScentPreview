import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with auto-detect long-polling to prevent WebChannel Listen stream errors
let firestoreDb: any;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  try {
    firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } catch {
    firestoreDb = null;
  }
}

export const DEFAULT_STOCK_DATA = {
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
    "versace-crystal-noir": { "5ml Normal": 0, "5ml HQ": 0, "10ml": 0 },
  } as Record<string, Record<string, number>>,
  bundles: {
    "bundle-winter-layers-trio": 6,
    "bundle-winter-warmth-trio": 5,
    "spotlight-arabian": 6,
    "bundle-cozy-winter": 0,
    "bundle-marine-core": 0,
    "bundle-day-night": 0,
    "bundle-office-rotation": 0,
    "bundle-zara-classics": 0,
    "bundle-rare-collector": 0,
    "bundle-master-vault": 0,
  } as Record<string, number>,
};

const jsonResponse = (body: any, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// --- SAFE TIMEOUT HELPER ---
const TIMEOUT_MS = 2500;
function withTimeout<T>(promise: Promise<T>, fallbackVal: T, ms = TIMEOUT_MS): Promise<T> {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(fallbackVal);
      }
    }, ms);

    promise
      .then((val) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(val);
        }
      })
      .catch(() => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(fallbackVal);
        }
      });
  });
}

// --- LOCAL STORAGE CACHE HELPERS ---
const STOCK_STORAGE_KEY = "scentpreview_local_stock_v2";
const ORDERS_STORAGE_KEY = "scentpreview_local_orders_v2";
const COUPONS_STORAGE_KEY = "scentpreview_used_coupons_v2";
const COMPLAINTS_STORAGE_KEY = "scentpreview_complaints_v2";

function getCachedStock(): typeof DEFAULT_STOCK_DATA {
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STOCK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.fragrances && parsed.bundles) {
          if (parsed.fragrances["versace-crystal-noir"]) {
            parsed.fragrances["versace-crystal-noir"] = { "5ml Normal": 0, "5ml HQ": 0, "10ml": 0 };
          }
          return parsed;
        }
      }
    }
  } catch {}
  return JSON.parse(JSON.stringify(DEFAULT_STOCK_DATA));
}

function saveCachedStock(stock: typeof DEFAULT_STOCK_DATA) {
  try {
    if (typeof window !== "undefined") {
      if (stock.fragrances && stock.fragrances["versace-crystal-noir"]) {
        stock.fragrances["versace-crystal-noir"] = { "5ml Normal": 0, "5ml HQ": 0, "10ml": 0 };
      }
      localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(stock));
    }
  } catch {}
}

function getCachedOrders(): any[] {
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch {}
  return [];
}

function saveCachedOrder(order: any) {
  try {
    if (typeof window !== "undefined" && order && order.orderNumber) {
      const orders = getCachedOrders();
      const existingIdx = orders.findIndex((o) => o.orderNumber === order.orderNumber);
      if (existingIdx >= 0) {
        orders[existingIdx] = { ...orders[existingIdx], ...order };
      } else {
        orders.unshift(order);
      }
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
  } catch {}
}

function getCachedUsedCoupons(): Record<string, string> {
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
      }
    }
  } catch {}
  return {};
}

function saveCachedCoupon(code: string, orderNumber: string) {
  try {
    if (typeof window !== "undefined" && code) {
      const used = getCachedUsedCoupons();
      used[code.toUpperCase()] = orderNumber;
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(used));
    }
  } catch {}
}

function getCachedComplaints(): any[] {
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch {}
  return [];
}

function saveCachedComplaint(complaint: any) {
  try {
    if (typeof window !== "undefined" && complaint && complaint.id) {
      const list = getCachedComplaints();
      const idx = list.findIndex((c) => c.id === complaint.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...complaint };
      } else {
        list.unshift(complaint);
      }
      localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {}
}

async function loadStockDirect(): Promise<typeof DEFAULT_STOCK_DATA> {
  const localStock = getCachedStock();
  if (!firestoreDb) return localStock;

  try {
    const docRef = doc(firestoreDb, "stock", "global_stock");
    const snap = await withTimeout<any>(getDoc(docRef), null, 2500);
    if (!snap) {
      return localStock;
    }
    if (!snap.exists()) {
      const seeded = JSON.parse(JSON.stringify(DEFAULT_STOCK_DATA));
      withTimeout(setDoc(docRef, seeded), null, 2000).catch(() => {});
      saveCachedStock(seeded);
      return seeded;
    }

    const stock = snap.data() as typeof DEFAULT_STOCK_DATA;
    let needsSync = false;
    if (!stock.fragrances) {
      stock.fragrances = JSON.parse(JSON.stringify(DEFAULT_STOCK_DATA.fragrances));
      needsSync = true;
    } else {
      for (const [fragId, defaultSizes] of Object.entries(DEFAULT_STOCK_DATA.fragrances)) {
        if (!stock.fragrances[fragId]) {
          stock.fragrances[fragId] = { ...defaultSizes };
          needsSync = true;
        }
      }
    }
    // Strictly enforce Versace Crystal Noir is 0
    if (stock.fragrances && stock.fragrances["versace-crystal-noir"]) {
      stock.fragrances["versace-crystal-noir"] = { "5ml Normal": 0, "5ml HQ": 0, "10ml": 0 };
    }

    if (!stock.bundles) {
      stock.bundles = JSON.parse(JSON.stringify(DEFAULT_STOCK_DATA.bundles));
      needsSync = true;
    } else {
      for (const [bundleId, defaultQty] of Object.entries(DEFAULT_STOCK_DATA.bundles)) {
        if (stock.bundles[bundleId] === undefined) {
          stock.bundles[bundleId] = defaultQty;
          needsSync = true;
        }
      }
    }
    if (needsSync) {
      withTimeout(setDoc(docRef, stock), null, 2000).catch(() => {});
    }
    saveCachedStock(stock);
    return stock;
  } catch {
    return localStock;
  }
}

const mapNameToKey = (name: string): { type: "fragrance" | "bundle"; key: string } | null => {
  const n = name.toLowerCase();
  if (n.includes("winter layers trio")) return { type: "bundle", key: "bundle-winter-layers-trio" };
  if (n.includes("winter warmth trio")) return { type: "bundle", key: "bundle-winter-warmth-trio" };
  if (n.includes("arabian exotic") || n.includes("spotlight")) return { type: "bundle", key: "spotlight-arabian" };
  if (n.includes("day & night") || n.includes("day and night")) return { type: "bundle", key: "bundle-day-night" };
  if (n.includes("marine & citrus") || n.includes("marine core")) return { type: "bundle", key: "bundle-marine-core" };
  if (n.includes("rare collector")) return { type: "bundle", key: "bundle-rare-collector" };
  if (n.includes("office")) return { type: "bundle", key: "bundle-office-rotation" };
  if (n.includes("cozy winter")) return { type: "bundle", key: "bundle-cozy-winter" };
  if (n.includes("master vault")) return { type: "bundle", key: "bundle-master-vault" };
  if (n.includes("zara classics")) return { type: "bundle", key: "bundle-zara-classics" };

  if (n.includes("khamrah") || n.includes("sample no. 6") || n.includes("sample 6")) return { type: "fragrance", key: "lattafa-khamrah" };
  if (n.includes("ck2") || n.includes("sample no. 9") || n.includes("sample 9")) return { type: "fragrance", key: "ck2" };
  if (n.includes("gentleman") || n.includes("sample no. 1") || n.includes("sample 1")) return { type: "fragrance", key: "givenchy-gentleman" };
  if (n.includes("for him") || n.includes("black edition") || n.includes("sample no. 3") || n.includes("sample 3")) return { type: "fragrance", key: "zara-for-him-black" };
  if (n.includes("sunrise") || n.includes("sample no. 10") || n.includes("sample 10")) return { type: "fragrance", key: "zara-sunrise" };
  if (n.includes("seoul 532-8") || n.includes("seoul winter") || n.includes("sample no. 11") || n.includes("sample 11")) return { type: "fragrance", key: "zara-seoul-winter" };
  if (n.includes("seoul") || n.includes("sample no. 4") || n.includes("sample 4")) return { type: "fragrance", key: "zara-seoul" };
  if (n.includes("intense dark") || n.includes("sample no. 5") || n.includes("sample 5")) return { type: "fragrance", key: "zara-intense-dark" };
  if (n.includes("rich warm") || n.includes("sample no. 7") || n.includes("sample 7")) return { type: "fragrance", key: "zara-rich-warm-addictive" };
  if (n.includes("ck one") || n.includes("sample no. 8") || n.includes("sample 8")) return { type: "fragrance", key: "ck-one" };
  if (n.includes("qaswa") || n.includes("la uno") || n.includes("sample no. 2") || n.includes("sample 2")) return { type: "fragrance", key: "la-uno-qaswa" };
  if (n.includes("crystal noir") || n.includes("versace") || n.includes("sample no. 12") || n.includes("sample 12")) return { type: "fragrance", key: "versace-crystal-noir" };
  return null;
};

const getBundleConstituents = (bundleKey: string): string[] => {
  switch (bundleKey) {
    case "bundle-winter-layers-trio":
      return ["la-uno-qaswa", "givenchy-gentleman", "ck-one"];
    case "bundle-winter-warmth-trio":
      return ["zara-rich-warm-addictive", "lattafa-khamrah", "zara-intense-dark"];
    case "spotlight-arabian":
      return ["lattafa-khamrah", "la-uno-qaswa"];
    case "bundle-day-night":
      return ["zara-sunrise", "zara-for-him-black"];
    case "bundle-marine-core":
      return ["ck-one", "la-uno-qaswa"];
    case "bundle-rare-collector":
      return ["ck2", "zara-intense-dark"];
    case "bundle-office-rotation":
      return ["givenchy-gentleman", "ck-one"];
    case "bundle-cozy-winter":
      return ["zara-seoul-winter", "lattafa-khamrah", "zara-rich-warm-addictive"];
    case "bundle-master-vault":
      return ["lattafa-khamrah", "zara-seoul-winter", "zara-intense-dark"];
    case "bundle-zara-classics":
      return ["zara-sunrise", "zara-seoul-winter", "zara-for-him-black", "zara-intense-dark"];
    default:
      return [];
  }
};

async function reduceStockDirect(items: { name: string; size: string; quantity: number }[]) {
  const stock = await loadStockDirect();
  for (const item of items) {
    const match = mapNameToKey(item.name);
    if (!match) continue;
    if (match.type === "bundle") {
      const cur = Number(stock.bundles[match.key]) || 0;
      stock.bundles[match.key] = Math.max(0, cur - item.quantity);
      const sizeKey = item.size || "5ml Normal";
      for (const cid of getBundleConstituents(match.key)) {
        if (stock.fragrances[cid] && stock.fragrances[cid][sizeKey] !== undefined) {
          stock.fragrances[cid][sizeKey] = Math.max(0, (Number(stock.fragrances[cid][sizeKey]) || 0) - item.quantity);
        }
      }
    } else if (match.type === "fragrance") {
      const fStock = stock.fragrances[match.key];
      if (fStock && fStock[item.size] !== undefined) {
        fStock[item.size] = Math.max(0, (Number(fStock[item.size]) || 0) - item.quantity);
      }
    }
  }
  if (stock.fragrances && stock.fragrances["versace-crystal-noir"]) {
    stock.fragrances["versace-crystal-noir"] = { "5ml Normal": 0, "5ml HQ": 0, "10ml": 0 };
  }
  saveCachedStock(stock);
  if (firestoreDb) {
    withTimeout(setDoc(doc(firestoreDb, "stock", "global_stock"), stock), null, 2500).catch(() => {});
  }
  return stock;
}

const VALID_COUPONS = new Set([
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

export async function handleCloudflareFirestoreApi(url: string, options?: RequestInit): Promise<Response> {
  const method = (options?.method || "GET").toUpperCase();
  const parsedBody = options?.body && typeof options.body === "string" ? JSON.parse(options.body) : {};
  const pathOnly = url.split("?")[0];

  try {
    // 1. GET /api/stock
    if (pathOnly === "/api/stock" && method === "GET") {
      const stock = await loadStockDirect();
      return jsonResponse({ success: true, stock });
    }

    // 2. POST /api/stock
    if (pathOnly === "/api/stock" && method === "POST") {
      saveCachedStock(parsedBody);
      if (firestoreDb) {
        withTimeout(setDoc(doc(firestoreDb, "stock", "global_stock"), parsedBody), null, 2500).catch(() => {});
      }
      return jsonResponse({ success: true, stock: parsedBody });
    }

    // 3. POST /api/stock/reset
    if (pathOnly === "/api/stock/reset" && method === "POST") {
      const resetData = JSON.parse(JSON.stringify(DEFAULT_STOCK_DATA));
      saveCachedStock(resetData);
      if (firestoreDb) {
        withTimeout(setDoc(doc(firestoreDb, "stock", "global_stock"), resetData), null, 2500).catch(() => {});
      }
      return jsonResponse({ success: true, stock: resetData });
    }

    // 4. POST /api/login
    if (pathOnly === "/api/login" && method === "POST") {
      const passcode = String(parsedBody?.passcode || "").trim();
      if (passcode === "Zayden@233008") {
        return jsonResponse({ success: true, token: "cf_scentpreview_admin_session_2026" });
      }
      return jsonResponse({ error: "Invalid passcode." }, 401);
    }

    // 5. GET /api/coupons/used
    if (pathOnly === "/api/coupons/used" && method === "GET") {
      const localUsed = getCachedUsedCoupons();
      if (firestoreDb) {
        const snap = await withTimeout<any>(getDoc(doc(firestoreDb, "stock", "used_coupons")), null, 2000);
        if (snap && snap.exists()) {
          const codes = Object.keys(snap.data()?.codes || {});
          return jsonResponse({ usedCoupons: codes });
        }
      }
      return jsonResponse({ usedCoupons: Object.keys(localUsed) });
    }

    // 6. POST /api/coupons/validate
    if (pathOnly === "/api/coupons/validate" && method === "POST") {
      const code = String(parsedBody?.code || "").trim().toUpperCase();
      if (!code || !VALID_COUPONS.has(code)) {
        return jsonResponse({ valid: false, error: "Invalid coupon code." }, 400);
      }
      const localUsed = getCachedUsedCoupons();
      if (localUsed[code]) {
        return jsonResponse({ valid: false, error: "This coupon code has already been used." }, 400);
      }
      if (firestoreDb) {
        const snap = await withTimeout<any>(getDoc(doc(firestoreDb, "stock", "used_coupons")), null, 2000);
        const usedMap = snap && snap.exists() ? snap.data()?.codes || {} : {};
        if (usedMap[code]) {
          return jsonResponse({ valid: false, error: "This coupon code has already been used." }, 400);
        }
      }
      return jsonResponse({ valid: true, code });
    }

    // 7. GET /api/orders
    if (pathOnly === "/api/orders" && method === "GET") {
      let orders: any[] = getCachedOrders();
      if (firestoreDb) {
        const snap = await withTimeout<any>(getDocs(collection(firestoreDb, "orders")), null, 2500);
        if (snap && typeof snap.forEach === "function") {
          const remoteOrders: any[] = [];
          snap.forEach((docSnap: any) => {
            remoteOrders.push(docSnap.data());
          });
          if (remoteOrders.length > 0) {
            orders = remoteOrders;
          }
        }
      }
      orders.sort((a, b) => {
        const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tB - tA;
      });
      return jsonResponse({ success: true, orders });
    }

    // 8. POST /api/orders
    if (pathOnly === "/api/orders" && method === "POST") {
      const isManual = Boolean(parsedBody.skipStockReduction) || String(parsedBody.orderNumber || "").startsWith("SP-ADMIN-");
      const rawCoupon = parsedBody.couponCode ? String(parsedBody.couponCode).trim().toUpperCase() : "";
      if (rawCoupon && !isManual) {
        if (!VALID_COUPONS.has(rawCoupon)) {
          return jsonResponse({ success: false, error: "Invalid coupon code." }, 400);
        }
        const localUsed = getCachedUsedCoupons();
        if (localUsed[rawCoupon] && localUsed[rawCoupon] !== parsedBody.orderNumber) {
          return jsonResponse({ success: false, error: "This coupon code has already been used." }, 400);
        }
        saveCachedCoupon(rawCoupon, parsedBody.orderNumber);
        if (firestoreDb) {
          const couponRef = doc(firestoreDb, "stock", "used_coupons");
          withTimeout(getDoc(couponRef), null, 1500).then((cSnap: any) => {
            const existingCodes = cSnap && cSnap.exists() ? cSnap.data()?.codes || {} : {};
            existingCodes[rawCoupon] = parsedBody.orderNumber;
            withTimeout(setDoc(couponRef, { codes: existingCodes, updatedAt: new Date().toISOString() }), null, 2000).catch(() => {});
          }).catch(() => {});
        }
      }
      const orderRecord = {
        ...parsedBody,
        ...(rawCoupon ? { couponCode: rawCoupon } : {}),
        status: isManual ? "paid" : "pending",
        stockReduced: false,
        createdAt: parsedBody.createdAt || new Date().toISOString(),
      };
      saveCachedOrder(orderRecord);
      if (firestoreDb) {
        withTimeout(setDoc(doc(firestoreDb, "orders", orderRecord.orderNumber), orderRecord), null, 2500).catch(() => {});
      }
      return jsonResponse({ success: true, order: orderRecord }, 201);
    }

    // 9. POST /api/orders/confirm-payment
    if (pathOnly === "/api/orders/confirm-payment" && method === "POST") {
      const orderNum = parsedBody.orderNumber;
      const cachedOrders = getCachedOrders();
      const localExisting = cachedOrders.find((o) => o.orderNumber === orderNum);

      let existing = localExisting || null;
      if (firestoreDb) {
        const orderRef = doc(firestoreDb, "orders", orderNum);
        const snap = await withTimeout<any>(getDoc(orderRef), null, 2000);
        if (snap && snap.exists()) {
          existing = snap.data();
        }
      }

      const isManual =
        Boolean(parsedBody.skipStockReduction) ||
        Boolean(existing?.skipStockReduction) ||
        String(orderNum).startsWith("SP-ADMIN-");

      const updatedOrder: any = {
        ...(existing || parsedBody),
        status: "paid",
        createdAt: existing?.createdAt || new Date().toISOString(),
      };

      if (!updatedOrder.stockReduced && Array.isArray(updatedOrder.items) && !isManual) {
        await reduceStockDirect(updatedOrder.items);
        updatedOrder.stockReduced = true;
      }

      saveCachedOrder(updatedOrder);
      if (firestoreDb) {
        const orderRef = doc(firestoreDb, "orders", orderNum);
        withTimeout(setDoc(orderRef, updatedOrder), null, 2500).catch(() => {});
      }
      return jsonResponse({ success: true, orderStatus: "paid", emailService: "firestore-direct" });
    }

    // 10. DELETE /api/orders/:orderNumber
    if (pathOnly.startsWith("/api/orders/") && method === "DELETE") {
      const orderNum = decodeURIComponent(pathOnly.replace("/api/orders/", ""));
      const cachedOrders = getCachedOrders();
      const local = cachedOrders.find((o) => o.orderNumber === orderNum);
      if (local) {
        local.status = "deleted";
        saveCachedOrder(local);
      }
      if (firestoreDb) {
        const orderRef = doc(firestoreDb, "orders", orderNum);
        withTimeout(setDoc(orderRef, { orderNumber: orderNum, status: "deleted" }, { merge: true }), null, 2500).catch(() => {});
      }
      return jsonResponse({ success: true, message: `Order ${orderNum} deleted successfully.` });
    }

    // 11. GET /api/complaints
    if (pathOnly === "/api/complaints" && method === "GET") {
      let complaints: any[] = getCachedComplaints();
      if (firestoreDb) {
        const snap = await withTimeout<any>(getDocs(collection(firestoreDb, "complaints")), null, 2500);
        if (snap && typeof snap.forEach === "function") {
          const remoteList: any[] = [];
          snap.forEach((d: any) => remoteList.push(d.data()));
          if (remoteList.length > 0) complaints = remoteList;
        }
      }
      complaints.sort((a, b) => {
        const tA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const tB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return tB - tA;
      });
      return jsonResponse({ success: true, complaints });
    }

    // 12. POST /api/complaints
    if (pathOnly === "/api/complaints" && method === "POST") {
      const claimId = "CLM-" + Math.floor(1000 + Math.random() * 9000);
      const complaint = {
        id: claimId,
        buyerName: parsedBody.buyerName,
        email: parsedBody.email,
        perfumeAndSize: parsedBody.perfumeAndSize,
        proofImage: parsedBody.proofImage,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      saveCachedComplaint(complaint);
      if (firestoreDb) {
        withTimeout(setDoc(doc(firestoreDb, "complaints", claimId), complaint), null, 2500).catch(() => {});
      }
      return jsonResponse({ success: true, complaint });
    }

    // 13. PATCH /api/complaints/:id
    if (pathOnly.startsWith("/api/complaints/") && method === "PATCH") {
      const claimId = decodeURIComponent(pathOnly.replace("/api/complaints/", ""));
      const list = getCachedComplaints();
      const local = list.find((c) => c.id === claimId);
      if (local) {
        local.status = parsedBody.status;
        saveCachedComplaint(local);
      }
      if (firestoreDb) {
        withTimeout(setDoc(doc(firestoreDb, "complaints", claimId), { status: parsedBody.status }, { merge: true }), null, 2500).catch(() => {});
      }
      return jsonResponse({ success: true, id: claimId, status: parsedBody.status });
    }

    // 14. POST/GET /api/admin/blacklist
    if (pathOnly === "/api/admin/blacklist") {
      return jsonResponse({ success: true, blacklist: { phones: [], emails: [], ips: [] } });
    }

    return jsonResponse({ error: "Endpoint not found" }, 404);
  } catch (err: any) {
    // Graceful offline fallback - never crash or return 500 to the client
    if (pathOnly === "/api/stock") {
      return jsonResponse({ success: true, stock: getCachedStock(), offline: true });
    }
    if (pathOnly === "/api/orders") {
      return jsonResponse({ success: true, orders: getCachedOrders(), offline: true });
    }
    return jsonResponse({ success: true, offline: true }, 200);
  }
}
