import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
    "versace-crystal-noir": { "5ml Normal": 1, "5ml HQ": 0, "10ml": 0 },
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

async function loadStockDirect() {
  const docRef = doc(firestoreDb, "stock", "global_stock");
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    const seeded = JSON.parse(JSON.stringify(DEFAULT_STOCK_DATA));
    await setDoc(docRef, seeded);
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
    await setDoc(docRef, stock);
  }
  return stock;
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

  if (n.includes("khamrah")) return { type: "fragrance", key: "lattafa-khamrah" };
  if (n.includes("ck2")) return { type: "fragrance", key: "ck2" };
  if (n.includes("gentleman")) return { type: "fragrance", key: "givenchy-gentleman" };
  if (n.includes("for him") || n.includes("black edition")) return { type: "fragrance", key: "zara-for-him-black" };
  if (n.includes("sunrise")) return { type: "fragrance", key: "zara-sunrise" };
  if (n.includes("seoul 532-8") || n.includes("seoul winter")) return { type: "fragrance", key: "zara-seoul-winter" };
  if (n.includes("seoul")) return { type: "fragrance", key: "zara-seoul" };
  if (n.includes("intense dark")) return { type: "fragrance", key: "zara-intense-dark" };
  if (n.includes("rich warm")) return { type: "fragrance", key: "zara-rich-warm-addictive" };
  if (n.includes("ck one")) return { type: "fragrance", key: "ck-one" };
  if (n.includes("qaswa") || n.includes("la uno")) return { type: "fragrance", key: "la-uno-qaswa" };
  if (n.includes("crystal noir") || n.includes("versace")) return { type: "fragrance", key: "versace-crystal-noir" };
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
  await setDoc(doc(firestoreDb, "stock", "global_stock"), stock);
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
      await setDoc(doc(firestoreDb, "stock", "global_stock"), parsedBody);
      return jsonResponse({ success: true, stock: parsedBody });
    }

    // 3. POST /api/stock/reset
    if (pathOnly === "/api/stock/reset" && method === "POST") {
      const resetData = JSON.parse(JSON.stringify(DEFAULT_STOCK_DATA));
      await setDoc(doc(firestoreDb, "stock", "global_stock"), resetData);
      return jsonResponse({ success: true, stock: resetData });
    }

    // 4. POST /api/login
    if (pathOnly === "/api/login" && method === "POST") {
      const passcode = String(parsedBody?.passcode || "").trim();
      if (passcode === "gephelbuiltallofthisforagirl") {
        return jsonResponse({ success: true, token: "cf_scentpreview_admin_session_2026" });
      }
      return jsonResponse({ error: "Invalid passcode." }, 401);
    }

    // 5. GET /api/coupons/used
    if (pathOnly === "/api/coupons/used" && method === "GET") {
      const snap = await getDoc(doc(firestoreDb, "stock", "used_coupons"));
      const codes = snap.exists() ? Object.keys(snap.data()?.codes || {}) : [];
      return jsonResponse({ usedCoupons: codes });
    }

    // 6. POST /api/coupons/validate
    if (pathOnly === "/api/coupons/validate" && method === "POST") {
      const code = String(parsedBody?.code || "").trim().toUpperCase();
      if (!code || !VALID_COUPONS.has(code)) {
        return jsonResponse({ valid: false, error: "Invalid coupon code." }, 400);
      }
      const snap = await getDoc(doc(firestoreDb, "stock", "used_coupons"));
      const usedMap = snap.exists() ? snap.data()?.codes || {} : {};
      if (usedMap[code]) {
        return jsonResponse({ valid: false, error: "This coupon code has already been used." }, 400);
      }
      return jsonResponse({ valid: true, code });
    }

    // 7. GET /api/orders
    if (pathOnly === "/api/orders" && method === "GET") {
      const snap = await getDocs(collection(firestoreDb, "orders"));
      const orders: any[] = [];
      snap.forEach((docSnap) => {
        orders.push(docSnap.data());
      });
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
        const couponRef = doc(firestoreDb, "stock", "used_coupons");
        const cSnap = await getDoc(couponRef);
        const existingCodes = cSnap.exists() ? cSnap.data()?.codes || {} : {};
        if (existingCodes[rawCoupon] && existingCodes[rawCoupon] !== parsedBody.orderNumber) {
          return jsonResponse({ success: false, error: "This coupon code has already been used." }, 400);
        }
        existingCodes[rawCoupon] = parsedBody.orderNumber;
        await setDoc(couponRef, { codes: existingCodes, updatedAt: new Date().toISOString() });
      }
      const orderRecord = {
        ...parsedBody,
        ...(rawCoupon ? { couponCode: rawCoupon } : {}),
        status: isManual ? "paid" : "pending",
        stockReduced: false,
        createdAt: parsedBody.createdAt || new Date().toISOString(),
      };
      await setDoc(doc(firestoreDb, "orders", orderRecord.orderNumber), orderRecord);
      return jsonResponse({ success: true, order: orderRecord }, 201);
    }

    // 9. POST /api/orders/confirm-payment
    if (pathOnly === "/api/orders/confirm-payment" && method === "POST") {
      const orderNum = parsedBody.orderNumber;
      const orderRef = doc(firestoreDb, "orders", orderNum);
      const snap = await getDoc(orderRef);
      const existing = snap.exists() ? snap.data() : null;
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

      await setDoc(orderRef, updatedOrder);
      return jsonResponse({ success: true, orderStatus: "paid", emailService: "firestore-direct" });
    }

    // 10. DELETE /api/orders/:orderNumber
    if (pathOnly.startsWith("/api/orders/") && method === "DELETE") {
      const orderNum = decodeURIComponent(pathOnly.replace("/api/orders/", ""));
      const orderRef = doc(firestoreDb, "orders", orderNum);
      await setDoc(orderRef, { orderNumber: orderNum, status: "deleted" }, { merge: true });
      return jsonResponse({ success: true, message: `Order ${orderNum} deleted successfully.` });
    }

    // 11. GET /api/complaints
    if (pathOnly === "/api/complaints" && method === "GET") {
      const snap = await getDocs(collection(firestoreDb, "complaints"));
      const complaints: any[] = [];
      snap.forEach((d) => complaints.push(d.data()));
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
      await setDoc(doc(firestoreDb, "complaints", claimId), complaint);
      return jsonResponse({ success: true, complaint });
    }

    // 13. PATCH /api/complaints/:id
    if (pathOnly.startsWith("/api/complaints/") && method === "PATCH") {
      const claimId = decodeURIComponent(pathOnly.replace("/api/complaints/", ""));
      await setDoc(doc(firestoreDb, "complaints", claimId), { status: parsedBody.status }, { merge: true });
      return jsonResponse({ success: true, id: claimId, status: parsedBody.status });
    }

    // 14. POST/GET /api/admin/blacklist
    if (pathOnly === "/api/admin/blacklist") {
      return jsonResponse({ success: true, blacklist: { phones: [], emails: [], ips: [] } });
    }

    return jsonResponse({ error: "Endpoint not found" }, 404);
  } catch (err: any) {
    console.error("[Cloudflare Firestore Bridge Error]:", err);
    return jsonResponse({ error: err?.message || "Firestore request failed", success: false }, 500);
  }
}
