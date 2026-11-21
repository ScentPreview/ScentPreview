interface WorkerEnv {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  ADMIN_PASSCODE?: string;
  JWT_SECRET?: string;
  ADMIN_2FA_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
}

const FIREBASE_PROJECT_ID = "gen-lang-client-0828448722";
const FIRESTORE_DATABASE_ID = "ai-studio-scentpreview-cdb09123-f70a-4cac-ade2-943e5e95115c";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents`;

const DEFAULT_STOCK = {
  fragrances: {
    "la-uno-qaswa": { "10ml": 0, "5ml Normal": 11, "5ml HQ": 2 },
    "ck-one": { "10ml": 0, "5ml Normal": 7, "5ml HQ": 3 },
    "zara-for-him-black": { "10ml": 0, "5ml Normal": 5, "5ml HQ": 0 },
    "givenchy-gentleman": { "10ml": 0, "5ml Normal": 12, "5ml HQ": 0 },
    "zara-intense-dark": { "10ml": 0, "5ml Normal": 5, "5ml HQ": 0 },
    "zara-rich-warm-addictive": { "10ml": 0, "5ml Normal": 16, "5ml HQ": 0 },
    "lattafa-khamrah": { "10ml": 0, "5ml Normal": 14, "5ml HQ": 0 },
    "versace-crystal-noir": { "10ml": 0, "5ml Normal": 0, "5ml HQ": 0 },
    "zara-sunrise": { "10ml": 1, "5ml Normal": 0, "5ml HQ": 0 },
    "zara-seoul-winter": { "10ml": 0, "5ml Normal": 0, "5ml HQ": 0 },
    "zara-seoul": { "10ml": 0, "5ml Normal": 0, "5ml HQ": 2 },
    "ck2": { "10ml": 0, "5ml Normal": 2, "5ml HQ": 0 },
  } as Record<string, Record<string, number>>,
  bundles: {
    "bundle-winter-layers-trio": 6,
    "bundle-winter-warmth-trio": 5,
    "spotlight-arabian": 6,
    "bundle-day-night": 0,
    "bundle-marine-core": 0,
    "bundle-rare-collector": 0,
    "bundle-office-rotation": 0,
    "bundle-cozy-winter": 0,
    "bundle-master-vault": 0,
    "bundle-zara-classics": 0,
  } as Record<string, number>,
};

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
  "E5T9QM", "CREST4FZ", "W7B2KL", "NEXUS6XY", "R4H8DP", "LUNAR9AW", "I6G3NV", "BOLT5JK", "C8E9TX", "SOLAR7MZ",
]);

const FRAGRANCE_METADATA: Record<string, { name: string; brand: string }> = {
  "givenchy-gentleman": { name: "SCENTPREVIEW Sample No. 1", brand: "SCENTPREVIEW" },
  "la-uno-qaswa": { name: "SCENTPREVIEW Sample No. 2", brand: "SCENTPREVIEW" },
  "zara-for-him-black": { name: "SCENTPREVIEW Sample No. 3", brand: "SCENTPREVIEW" },
  "zara-seoul": { name: "SCENTPREVIEW Sample No. 4", brand: "SCENTPREVIEW" },
  "zara-intense-dark": { name: "SCENTPREVIEW Sample No. 5", brand: "SCENTPREVIEW" },
  "lattafa-khamrah": { name: "SCENTPREVIEW Sample No. 6", brand: "SCENTPREVIEW" },
  "zara-rich-warm-addictive": { name: "SCENTPREVIEW Sample No. 7", brand: "SCENTPREVIEW" },
  "ck-one": { name: "SCENTPREVIEW Sample No. 8", brand: "SCENTPREVIEW" },
  "ck2": { name: "SCENTPREVIEW Sample No. 9", brand: "SCENTPREVIEW" },
  "zara-sunrise": { name: "SCENTPREVIEW Sample No. 10", brand: "SCENTPREVIEW" },
  "zara-seoul-winter": { name: "SCENTPREVIEW Sample No. 11", brand: "SCENTPREVIEW" },
  "versace-crystal-noir": { name: "SCENTPREVIEW Sample No. 12", brand: "SCENTPREVIEW" },
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
let cachedSigningSecret: string | null = null;

function json(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  const maxLen = Math.max(bufA.length, bufB.length);
  let diff = bufA.length ^ bufB.length;
  for (let i = 0; i < maxLen; i++) {
    diff |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0);
  }
  return diff === 0;
}

function randomHex(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function signJwt(payload: Record<string, any>, secret: string, expiresInSeconds: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
  const headerB64 = toBase64Url(encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(fullPayload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(signingInput));
  const sigB64 = toBase64Url(new Uint8Array(sigBuf));
  return `${signingInput}.${sigB64}`;
}

async function verifyJwt(token: string, secret: string): Promise<Record<string, any> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = fromBase64Url(sigB64);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      encoder.encode(signingInput)
    );
    if (!valid) return null;
    const payload = JSON.parse(decoder.decode(fromBase64Url(payloadB64)));
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && now >= payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function generateBase32Secret(byteLength = 20): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32ToBytes(base32: string): Uint8Array {
  const cleaned = base32.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of cleaned) {
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

async function generateTotpAtCounter(secretBase32: string, counter: number): Promise<string> {
  const keyBytes = base32ToBytes(secretBase32);
  const counterBuf = new ArrayBuffer(8);
  const view = new DataView(counterBuf);
  view.setBigUint64(0, BigInt(counter), false);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes.buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const hmac = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBuf));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return String(binary % 1000000).padStart(6, "0");
}

async function verifyTotpCode(secretBase32: string, inputCode: string, window = 2): Promise<boolean> {
  const cleanCode = inputCode.replace(/[\s-]+/g, "");
  if (!/^\d{6}$/.test(cleanCode)) return false;
  const currentCounter = Math.floor(Date.now() / 1000 / 30);
  for (let delta = -window; delta <= window; delta++) {
    const expected = await generateTotpAtCounter(secretBase32, currentCounter + delta);
    if (timingSafeStringEqual(cleanCode, expected)) {
      return true;
    }
  }
  return false;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 4; i++) {
    const hex = randomHex(4).toUpperCase();
    codes.push(`SP-${hex.slice(0, 4)}-${hex.slice(4, 8)}`);
  }
  return codes;
}

// --- FIRESTORE REST API HELPERS ---
function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === "string") return { stringValue: val };
  if (val instanceof Date) return { stringValue: val.toISOString() };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map((item) => toFirestoreValue(item)) } };
  }
  if (typeof val === "object") {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function fromFirestoreValue(val: any): any {
  if (!val || typeof val !== "object") return null;
  if ("nullValue" in val) return null;
  if ("booleanValue" in val) return Boolean(val.booleanValue);
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return Number(val.doubleValue);
  if ("stringValue" in val) return String(val.stringValue);
  if ("timestampValue" in val) return String(val.timestampValue);
  if ("arrayValue" in val) {
    const values = Array.isArray(val.arrayValue?.values) ? val.arrayValue.values : [];
    return values.map((v: any) => fromFirestoreValue(v));
  }
  if ("mapValue" in val) {
    const out: Record<string, any> = {};
    const fields = val.mapValue?.fields || {};
    for (const [k, v] of Object.entries(fields)) {
      out[k] = fromFirestoreValue(v);
    }
    return out;
  }
  return null;
}

function fromFirestoreDoc(docObj: any): Record<string, any> {
  const out: Record<string, any> = {};
  const fields = docObj?.fields || {};
  for (const [k, v] of Object.entries(fields)) {
    out[k] = fromFirestoreValue(v);
  }
  if (docObj?.name && !out.id) {
    const parts = String(docObj.name).split("/");
    out._docId = parts[parts.length - 1];
  }
  return out;
}

async function fsGetDoc(collectionName: string, docId: string): Promise<Record<string, any> | null> {
  const res = await fetch(`${FIRESTORE_BASE_URL}/${encodeURIComponent(collectionName)}/${encodeURIComponent(docId)}`);
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const data = await res.json();
  return fromFirestoreDoc(data);
}

async function fsSetDoc(collectionName: string, docId: string, obj: Record<string, any>): Promise<boolean> {
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }
  const res = await fetch(`${FIRESTORE_BASE_URL}/${encodeURIComponent(collectionName)}/${encodeURIComponent(docId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  return res.ok;
}

async function fsDeleteDoc(collectionName: string, docId: string): Promise<boolean> {
  const res = await fetch(`${FIRESTORE_BASE_URL}/${encodeURIComponent(collectionName)}/${encodeURIComponent(docId)}`, {
    method: "DELETE",
  });
  return res.ok || res.status === 404;
}

async function fsListDocs(collectionName: string, pageSize = 300): Promise<Record<string, any>[]> {
  const allDocs: Record<string, any>[] = [];
  let pageToken = "";
  for (let i = 0; i < 5; i++) {
    const url = `${FIRESTORE_BASE_URL}/${encodeURIComponent(collectionName)}?pageSize=${pageSize}${
      pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""
    }`;
    const res = await fetch(url);
    if (!res.ok) break;
    const data: any = await res.json();
    if (Array.isArray(data.documents)) {
      for (const d of data.documents) {
        allDocs.push(fromFirestoreDoc(d));
      }
    }
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }
  return allDocs;
}

async function getSigningSecret(env: WorkerEnv): Promise<string> {
  if (env.JWT_SECRET && env.JWT_SECRET.trim().length >= 16) {
    return env.JWT_SECRET.trim();
  }
  if (cachedSigningSecret) return cachedSigningSecret;
  const existing = await fsGetDoc("admin_login_attempts", "sys_jwt_signing_key");
  if (existing && typeof existing.secret === "string" && existing.secret.length >= 32) {
    cachedSigningSecret = existing.secret;
    return cachedSigningSecret;
  }
  const generated = randomHex(32);
  await fsSetDoc("admin_login_attempts", "sys_jwt_signing_key", {
    secret: generated,
    createdAt: new Date().toISOString(),
  });
  cachedSigningSecret = generated;
  return generated;
}

function extractClientIp(request: Request): { ip: string; forwardedChain: string; country: string } {
  const cfIp = request.headers.get("cf-connecting-ip")?.trim() || "";
  const trueClientIp = request.headers.get("true-client-ip")?.trim() || "";
  const xffRaw = request.headers.get("x-forwarded-for")?.trim() || "";
  const xffFirst = xffRaw ? xffRaw.split(",")[0].trim() : "";
  const ip = (cfIp || trueClientIp || xffFirst || "unknown").replace(/^::ffff:/, "");
  const country = request.headers.get("cf-ipcountry")?.trim() || "Unknown";
  return { ip, forwardedChain: xffRaw || ip, country };
}

function extractServerDeviceTelemetry(request: Request, client: any = {}) {
  const { ip, forwardedChain, country } = extractClientIp(request);
  const ua = String(request.headers.get("user-agent") || client?.userAgent || "Unknown");
  const uaLower = ua.toLowerCase();
  const secChModel = String(request.headers.get("sec-ch-ua-model") || client?.highEntropyModel || "").replace(/"/g, "").trim();
  const secChPlatform = String(request.headers.get("sec-ch-ua-platform") || client?.highEntropyPlatform || "").replace(/"/g, "").trim();
  const secChMobile = String(request.headers.get("sec-ch-ua-mobile") || "");
  const gpuRenderer = String(client?.gpuRenderer || "Unknown");
  const gpuLower = gpuRenderer.toLowerCase();
  const platformStr = String(client?.platform || secChPlatform || "");
  const modelCombined = `${ua} ${secChModel} ${gpuRenderer}`.toLowerCase();

  let os = "Unknown OS";
  if (uaLower.includes("iphone") || uaLower.includes("ipad") || uaLower.includes("ipod")) {
    os = "iOS / iPadOS";
  } else if (uaLower.includes("android") || secChPlatform.toLowerCase() === "android") {
    os = "Android";
  } else if (uaLower.includes("mac os x") || uaLower.includes("macintosh") || secChPlatform.toLowerCase() === "macos") {
    os = "macOS";
  } else if (uaLower.includes("windows") || secChPlatform.toLowerCase() === "windows") {
    os = "Windows";
  } else if (uaLower.includes("linux") || secChPlatform.toLowerCase() === "linux") {
    os = "Linux";
  } else if (uaLower.includes("node") || uaLower.includes("curl") || uaLower.includes("python")) {
    os = "Automated CLI / Script";
  }

  let browser = "Unknown Browser";
  if (uaLower.includes("samsungbrowser")) browser = "Samsung Internet";
  else if (uaLower.includes("edg/")) browser = "Microsoft Edge";
  else if (uaLower.includes("opr/") || uaLower.includes("opera")) browser = "Opera";
  else if (uaLower.includes("instagram")) browser = "Instagram In-App Browser";
  else if (uaLower.includes("chrome/") && !uaLower.includes("edg/")) browser = "Chrome";
  else if (uaLower.includes("firefox/")) browser = "Firefox";
  else if (uaLower.includes("safari/") && !uaLower.includes("chrome/")) browser = "Safari";
  else if (uaLower.includes("curl") || uaLower.includes("node")) browser = "CLI / HTTP Client";

  const isSamsung =
    modelCombined.includes("samsung") ||
    modelCombined.includes("samsungbrowser") ||
    modelCombined.includes("xclipse") ||
    /\bsm-[a-z0-9]+/i.test(modelCombined) ||
    /\bgt-[a-z0-9]+/i.test(modelCombined) ||
    /\bsch-[a-z0-9]+/i.test(modelCombined) ||
    /\bsgh-[a-z0-9]+/i.test(modelCombined);

  let brand = "Unknown";
  if (isSamsung) {
    brand = "Samsung";
  } else if (
    uaLower.includes("iphone") ||
    uaLower.includes("ipad") ||
    uaLower.includes("macintosh") ||
    platformStr.toLowerCase().includes("mac") ||
    gpuLower.includes("apple")
  ) {
    brand = "Apple";
  } else if (modelCombined.includes("pixel")) {
    brand = "Google Pixel";
  } else if (modelCombined.includes("oneplus") || /\bcph\d+|\bne\d+|\ble\d+/i.test(modelCombined)) {
    brand = "OnePlus";
  } else if (modelCombined.includes("xiaomi") || modelCombined.includes("redmi") || modelCombined.includes("poco")) {
    brand = "Xiaomi / Redmi";
  } else if (os === "Windows") {
    brand = "Windows PC";
  } else if (os === "Linux") {
    brand = "Linux System";
  } else if (os === "Automated CLI / Script") {
    brand = "Script / Bot";
  }

  let deviceType = "Desktop";
  if (os === "Automated CLI / Script") {
    deviceType = "Headless / Script";
  } else if (uaLower.includes("ipad") || (uaLower.includes("android") && !uaLower.includes("mobile"))) {
    deviceType = "Tablet";
  } else if (
    uaLower.includes("mobile") ||
    uaLower.includes("iphone") ||
    uaLower.includes("android") ||
    secChMobile === "?1" ||
    client?.highEntropyMobile === true
  ) {
    deviceType = "Mobile Phone";
  }

  let model = secChModel || "";
  if (!model) {
    if (uaLower.includes("iphone")) model = "iPhone";
    else if (uaLower.includes("ipad")) model = "iPad";
    else if (uaLower.includes("macintosh")) model = gpuLower.includes("apple") ? "Mac (Apple Silicon)" : "Mac";
    else if (os === "Windows") model = "Windows Workstation";
    else if (os === "Android") model = isSamsung ? "Samsung Galaxy (Model Masked)" : "Android Handset";
    else model = platformStr || deviceType;
  }

  return {
    auditId: `AUTH-${Date.now()}-${randomHex(3).toUpperCase()}`,
    ip,
    forwardedChain,
    country,
    deviceType,
    brand,
    model,
    os,
    browser,
    isSamsung,
    userAgent: ua,
    secChModel: secChModel || "Not Sent",
    secChPlatform: secChPlatform || platformStr || "Not Sent",
    timezone: String(client?.timezone || "Unknown"),
    screenResolution: String(client?.screenResolution || "Unknown"),
    gpuRenderer,
    clientSignature: String(client?.clientSignature || "SERVER-ONLY"),
    extractedAt: new Date().toISOString(),
  };
}

async function recordAdminAuthEvent(stage: string, telemetry: Record<string, any>, note = "") {
  const entry = {
    id: `LOG-${Date.now()}-${randomHex(3).toUpperCase()}`,
    stage,
    note,
    ip: telemetry.ip || "unknown",
    forwardedChain: telemetry.forwardedChain || "",
    country: telemetry.country || "Unknown",
    deviceType: telemetry.deviceType || "Unknown",
    brand: telemetry.brand || "Unknown",
    model: telemetry.model || "Unknown",
    os: telemetry.os || "Unknown",
    browser: telemetry.browser || "Unknown",
    isSamsung: Boolean(telemetry.isSamsung),
    userAgent: telemetry.userAgent || "Unknown",
    timezone: telemetry.timezone || "Unknown",
    screenResolution: telemetry.screenResolution || "Unknown",
    gpuRenderer: telemetry.gpuRenderer || "Unknown",
    clientSignature: telemetry.clientSignature || "",
    auditId: telemetry.auditId || "",
    createdAt: new Date().toISOString(),
  };
  await fsSetDoc("admin_login_attempts", entry.id, entry);
  return entry;
}

async function authenticateAdminRequest(request: Request, secret: string): Promise<Record<string, any> | null> {
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;
  const decoded = await verifyJwt(token, secret);
  if (!decoded || decoded.role !== "admin") return null;
  return decoded;
}

async function loadTwoFactorConfig(env: WorkerEnv) {
  if (env.ADMIN_2FA_SECRET && env.ADMIN_2FA_SECRET.trim().length >= 16) {
    return {
      enabled: true,
      secret: env.ADMIN_2FA_SECRET.trim(),
      recoveryHashes: [] as string[],
      enrolledAt: "env-configured",
      enrolledDevice: "Environment Secret",
    };
  }
  const doc = await fsGetDoc("admin_login_attempts", "sys_totp_config");
  if (doc && doc.enabled === true && typeof doc.secret === "string" && doc.secret.length >= 16) {
    return doc;
  }
  return null;
}

async function loadStock() {
  const stockDoc = await fsGetDoc("stock", "current");
  if (!stockDoc || !stockDoc.fragrances || !stockDoc.bundles) {
    const seeded = JSON.parse(JSON.stringify(DEFAULT_STOCK));
    await fsSetDoc("stock", "current", seeded);
    return seeded;
  }
  if (stockDoc.fragrances["versace-crystal-noir"]) {
    stockDoc.fragrances["versace-crystal-noir"] = { "10ml": 0, "5ml Normal": 0, "5ml HQ": 0 };
  }
  if (stockDoc.fragrances["zara-seoul-winter"]) {
    stockDoc.fragrances["zara-seoul-winter"] = { "10ml": 0, "5ml Normal": 0, "5ml HQ": 0 };
  }
  delete stockDoc._docId;
  return stockDoc;
}

function findItemIdByName(name: string): { type: "fragrance" | "bundle"; id: string } | null {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!norm) return null;
  if (norm.includes("seoulwinter")) return { type: "fragrance", id: "zara-seoul-winter" };
  if (norm.includes("seoul") && !norm.includes("winter")) return { type: "fragrance", id: "zara-seoul" };

  const fragrances = [
    { id: "givenchy-gentleman", names: ["sampleno1", "sample1", "scentpreviewsampleno1", "givenchygentleman", "gentleman", "givenchy"] },
    { id: "la-uno-qaswa", names: ["sampleno2", "sample2", "scentpreviewsampleno2", "launoqaswa", "qaswa", "launo", "uno"] },
    { id: "zara-for-him-black", names: ["sampleno3", "sample3", "scentpreviewsampleno3", "zaraforhimblack", "forhimblack", "himblack"] },
    { id: "zara-seoul", names: ["sampleno4", "sample4", "scentpreviewsampleno4", "zaraseoul", "seoul", "seouloriginal", "originalseoul"] },
    { id: "zara-intense-dark", names: ["sampleno5", "sample5", "scentpreviewsampleno5", "zaraintensedark", "intensedark", "intensivedark", "intense", "intensive"] },
    { id: "lattafa-khamrah", names: ["sampleno6", "sample6", "scentpreviewsampleno6", "lattafakhamrah", "khamrah", "lattafa"] },
    { id: "zara-rich-warm-addictive", names: ["sampleno7", "sample7", "scentpreviewsampleno7", "zararichwarmaddictive", "richwarmaddictive", "richwarm"] },
    { id: "ck-one", names: ["sampleno8", "sample8", "scentpreviewsampleno8", "calvinkleinckone", "ckone", "ck1"] },
    { id: "ck2", names: ["sampleno9", "sample9", "scentpreviewsampleno9", "calvinkleinck2", "ck2"] },
    { id: "zara-sunrise", names: ["sampleno10", "sample10", "scentpreviewsampleno10", "zarasunrise", "sunrise", "sunriseontheredsanddunes", "redsanddunes", "sanddunes"] },
    { id: "zara-seoul-winter", names: ["sampleno11", "sample11", "scentpreviewsampleno11", "zaraseoulwinter", "seoulwinter"] },
    { id: "versace-crystal-noir", names: ["sampleno12", "sample12", "scentpreviewsampleno12", "versacecrystalnoir", "crystalnoir", "versace", "crystal"] },
  ];

  const bundles = [
    { id: "bundle-winter-layers-trio", names: ["winterlayerstrio", "bundlewinterlayerstrio", "mensbundlewinterlayerstrio", "winterlayers"] },
    { id: "bundle-winter-warmth-trio", names: ["winterwarmthtrio", "bundlewinterwarmthtrio", "womensbundlewinterwarmthtrio", "winterwarmth"] },
    { id: "spotlight-arabian", names: ["arabianexotictreasuresduo", "spotlightarabian", "arabianexotic", "exotictreasures"] },
    { id: "bundle-day-night", names: ["thedaytonightsignatureduo", "bundledaynight", "daytonight"] },
    { id: "bundle-marine-core", names: ["thehypercleanmarinecorekit", "bundlemarinecore", "marinecore"] },
    { id: "bundle-rare-collector", names: ["rarediscontinuedcollectorduo", "bundlerarecollector", "rarediscontinued"] },
    { id: "bundle-office-rotation", names: ["247officeboardroomrotation", "bundleofficerotation", "officerotation"] },
    { id: "bundle-cozy-winter", names: ["thecozywintergourmandtrio", "bundlecozywinter", "cozywinter"] },
    { id: "bundle-master-vault", names: ["ultimatemasterlayeringvault", "bundlemastervault", "masterlayering", "mastervault"] },
    { id: "bundle-zara-classics", names: ["thezaraonlycultclassicsquad", "bundlezaraclassics", "zaraonly"] },
  ];

  for (const f of fragrances) {
    if (f.id === norm || f.id.replace(/-/g, "") === norm || f.names.includes(norm)) return { type: "fragrance", id: f.id };
  }
  for (const b of bundles) {
    if (b.id === norm || b.id.replace(/-/g, "") === norm || b.names.includes(norm)) return { type: "bundle", id: b.id };
  }
  for (const b of bundles) {
    if (b.names.some((n) => norm.includes(n))) return { type: "bundle", id: b.id };
  }
  for (const f of fragrances) {
    if (f.names.some((n) => norm.includes(n))) return { type: "fragrance", id: f.id };
  }
  return null;
}

function getBundleConstituents(bundleId: string): string[] {
  switch (bundleId) {
    case "bundle-winter-layers-trio": return ["la-uno-qaswa", "givenchy-gentleman", "ck-one"];
    case "bundle-winter-warmth-trio": return ["zara-rich-warm-addictive", "lattafa-khamrah", "zara-intense-dark"];
    case "spotlight-arabian": return ["lattafa-khamrah", "la-uno-qaswa"];
    case "bundle-day-night": return ["zara-sunrise", "zara-for-him-black"];
    case "bundle-marine-core": return ["ck-one"];
    case "bundle-rare-collector": return ["ck2", "zara-intense-dark"];
    case "bundle-office-rotation": return ["givenchy-gentleman", "ck-one"];
    case "bundle-cozy-winter": return ["zara-seoul-winter"];
    case "bundle-master-vault": return ["lattafa-khamrah"];
    case "bundle-zara-classics": return ["zara-sunrise", "zara-seoul-winter"];
    default: return [];
  }
}

async function reduceStock(items: { name: string; size: string; quantity: number }[]) {
  const stock = await loadStock();
  const alertsDoc = (await fsGetDoc("stock", "sys_sold_out_alerts")) || { alerts: [] };
  const alerts: any[] = Array.isArray(alertsDoc.alerts) ? alertsDoc.alerts : [];
  const affected = new Set<string>();

  for (const item of items) {
    const match = findItemIdByName(item.name);
    if (!match) continue;
    if (match.type === "fragrance") {
      const fStock = stock.fragrances[match.id];
      if (fStock) {
        fStock[item.size] = Math.max(0, (Number(fStock[item.size]) || 0) - item.quantity);
        affected.add(match.id);
      }
    } else {
      stock.bundles[match.id] = Math.max(0, (Number(stock.bundles[match.id]) || 0) - item.quantity);
      const sizeToReduce = item.size || "5ml Normal";
      for (const cid of getBundleConstituents(match.id)) {
        const fStock = stock.fragrances[cid];
        if (fStock) {
          fStock[sizeToReduce] = Math.max(0, (Number(fStock[sizeToReduce]) || 0) - item.quantity);
          affected.add(cid);
        }
      }
    }
  }
  await fsSetDoc("stock", "current", stock);

  let alertsChanged = false;
  for (const fragId of affected) {
    const fStock = stock.fragrances[fragId];
    if (fStock) {
      const total = Object.values(fStock).reduce((sum: number, v: any) => sum + (Number(v) || 0), 0);
      if (total === 0 && !alerts.find((a) => a.fragranceId === fragId && !a.dismissed)) {
        const meta = FRAGRANCE_METADATA[fragId] || { name: fragId, brand: "ScentPreview" };
        alerts.unshift({
          id: `alert-${fragId}-${Date.now()}`,
          fragranceId: fragId,
          fragranceName: meta.name,
          brand: meta.brand,
          message: "perfume sold out we have removed",
          timestamp: new Date().toISOString(),
          dismissed: false,
        });
        alertsChanged = true;
      }
    }
  }
  if (alertsChanged) {
    await fsSetDoc("stock", "sys_sold_out_alerts", { alerts });
  }
  return stock;
}

async function checkRateLimit(ip: string): Promise<{ blocked: boolean; lockoutUntil?: number }> {
  const safeIp = ip.replace(/[^a-zA-Z0-9._-]/g, "_") || "unknown";
  const docId = `sys_ratelimit_${safeIp}`;
  const rec = await fsGetDoc("admin_login_attempts", docId);
  const now = Date.now();
  if (rec && typeof rec.lockoutUntil === "number" && rec.lockoutUntil > now) {
    return { blocked: true, lockoutUntil: rec.lockoutUntil };
  }
  return { blocked: false };
}

async function recordRateLimitFailure(ip: string): Promise<number | null> {
  const safeIp = ip.replace(/[^a-zA-Z0-9._-]/g, "_") || "unknown";
  const docId = `sys_ratelimit_${safeIp}`;
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const rec = await fsGetDoc("admin_login_attempts", docId);
  let count = 1;
  let windowStart = now;
  if (rec && typeof rec.windowStart === "number" && now - rec.windowStart < windowMs) {
    count = (Number(rec.count) || 0) + 1;
    windowStart = rec.windowStart;
  }
  const lockoutUntil = count >= 5 ? now + windowMs : 0;
  await fsSetDoc("admin_login_attempts", docId, { count, windowStart, lockoutUntil });
  return lockoutUntil > 0 ? lockoutUntil : null;
}

async function clearRateLimit(ip: string) {
  const safeIp = ip.replace(/[^a-zA-Z0-9._-]/g, "_") || "unknown";
  await fsDeleteDoc("admin_login_attempts", `sys_ratelimit_${safeIp}`);
}

async function handleApi(request: Request, env: WorkerEnv): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();
  let body: any = {};
  if (method === "POST" || method === "PATCH" || method === "PUT" || method === "DELETE") {
    try {
      const text = await request.text();
      if (text) body = JSON.parse(text);
    } catch {
      body = {};
    }
  }

  if (path === "/api/health" && method === "GET") {
    return json({ status: "ok", edge: true, timestamp: new Date().toISOString() });
  }

  const secret = await getSigningSecret(env);

  // Step 1: Passcode verification + Automatic Telemetry -> Forced Google Authenticator 2FA
  if (path === "/api/login" && method === "POST") {
    const { ip: clientIp } = extractClientIp(request);
    const rl = await checkRateLimit(clientIp);
    if (rl.blocked) {
      return json({ error: "Too many failed login attempts from this IP, please try again after 10 minutes.", lockoutUntil: rl.lockoutUntil }, 429);
    }

    const clientTelemetry = body?.clientTelemetry && typeof body.clientTelemetry === "object" ? body.clientTelemetry : {};
    const telemetry = extractServerDeviceTelemetry(request, clientTelemetry);
    const passcode = typeof body?.passcode === "string" ? body.passcode : "";
    const expectedPasscode = env.ADMIN_PASSCODE || "ZaydenChingtham@2330";
    if (!timingSafeStringEqual(passcode, expectedPasscode)) {
      await recordAdminAuthEvent("passcode_failed", telemetry, "Invalid vault passcode");
      const lockoutUntil = await recordRateLimitFailure(clientIp);
      if (lockoutUntil) {
        return json({ error: "Too many failed login attempts from this IP, please try again after 10 minutes.", lockoutUntil }, 429);
      }
      return json({ error: "Invalid passcode." }, 401);
    }

    await recordAdminAuthEvent("passcode_passed", telemetry, "Passcode verified, awaiting Google Authenticator 2FA");

    const telemetrySummary = {
      deviceType: telemetry.deviceType,
      brand: telemetry.brand,
      model: telemetry.model,
      os: telemetry.os,
      browser: telemetry.browser,
      isSamsung: telemetry.isSamsung,
      ip: telemetry.ip,
      country: telemetry.country,
      timezone: telemetry.timezone,
      screenResolution: telemetry.screenResolution,
      gpuRenderer: telemetry.gpuRenderer,
      clientSignature: telemetry.clientSignature,
    };

    const existing2FA = await loadTwoFactorConfig(env);
    if (!existing2FA) {
      const setupSecret = generateBase32Secret(20);
      const recoveryCodes = generateRecoveryCodes();
      const otpauthUrl = `otpauth://totp/ScentPreview:Admin?secret=${setupSecret}&issuer=ScentPreview&algorithm=SHA1&digits=6&period=30`;
      const pendingToken = await signJwt(
        {
          type: "2fa_setup",
          auditId: telemetry.auditId,
          telemetry: telemetrySummary,
          secret: setupSecret,
          recoveryCodes,
        },
        secret,
        900
      );
      return json({
        success: true,
        telemetry,
        requires2FASetup: true,
        pendingToken,
        otpauthUrl,
        manualSecret: setupSecret,
        recoveryCodes,
      });
    }

    const pendingToken = await signJwt(
      { type: "2fa_verify", auditId: telemetry.auditId, telemetry: telemetrySummary },
      secret,
      900
    );
    return json({ success: true, telemetry, requires2FA: true, pendingToken });
  }

  // Step 2: Forced Google Authenticator 2FA Verification
  if (path === "/api/login/verify-2fa" && method === "POST") {
    const { ip: clientIp } = extractClientIp(request);
    const rl = await checkRateLimit(clientIp);
    if (rl.blocked) {
      return json({ error: "Too many failed login attempts from this IP, please try again after 10 minutes.", lockoutUntil: rl.lockoutUntil }, 429);
    }

    const pendingToken = typeof body?.pendingToken === "string" ? body.pendingToken : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";

    if (!pendingToken || !code) {
      return json({ error: "2FA session token and Google Authenticator code are required." }, 400);
    }

    const pendingClaims = await verifyJwt(pendingToken, secret);
    if (!pendingClaims || (pendingClaims.type !== "2fa_setup" && pendingClaims.type !== "2fa_verify")) {
      return json({ error: "2FA session expired. Please re-enter the passcode." }, 401);
    }

    const fallbackTelemetry = extractServerDeviceTelemetry(request, {});
    const savedTel = pendingClaims.telemetry && typeof pendingClaims.telemetry === "object" ? pendingClaims.telemetry : {};
    const auditTelemetry = {
      ...fallbackTelemetry,
      ...savedTel,
      auditId: String(pendingClaims.auditId || fallbackTelemetry.auditId),
      ip: clientIp || savedTel.ip || fallbackTelemetry.ip,
    };

    if (pendingClaims.type === "2fa_setup") {
      const ok = await verifyTotpCode(pendingClaims.secret, code, 2);
      if (!ok) {
        await recordAdminAuthEvent("2fa_failed", auditTelemetry, "Invalid Google Authenticator setup code");
        const lockoutUntil = await recordRateLimitFailure(clientIp);
        if (lockoutUntil) return json({ error: "Too many failed attempts.", lockoutUntil }, 429);
        return json({ error: "Invalid 6-digit Google Authenticator code. Check your phone's clock and try again." }, 401);
      }

      const recoveryHashes: string[] = [];
      if (Array.isArray(pendingClaims.recoveryCodes)) {
        for (const rc of pendingClaims.recoveryCodes) {
          recoveryHashes.push(await sha256Hex(String(rc).trim().toUpperCase()));
        }
      }
      await fsSetDoc("admin_login_attempts", "sys_totp_config", {
        enabled: true,
        secret: pendingClaims.secret,
        recoveryHashes,
        enrolledAt: new Date().toISOString(),
        enrolledFromIp: clientIp,
        enrolledDevice: `${auditTelemetry.brand} ${auditTelemetry.model} (${auditTelemetry.os} / ${auditTelemetry.browser})`,
      });
      await recordAdminAuthEvent("login_success_2fa_enrolled", auditTelemetry, "Google Authenticator 2FA enrolled and admin session issued");
    } else {
      const cfg = await loadTwoFactorConfig(env);
      if (!cfg || !cfg.enabled || !cfg.secret) {
        return json({ error: "Google Authenticator 2FA is not configured yet. Please re-enter passcode to pair." }, 400);
      }
      let verified = await verifyTotpCode(cfg.secret, code, 2);
      let usedRecovery = false;
      if (!verified && Array.isArray(cfg.recoveryHashes) && cfg.recoveryHashes.length > 0) {
        const codeHash = await sha256Hex(code.trim().toUpperCase());
        const idx = cfg.recoveryHashes.indexOf(codeHash);
        if (idx !== -1) {
          verified = true;
          usedRecovery = true;
          cfg.recoveryHashes.splice(idx, 1);
          await fsSetDoc("admin_login_attempts", "sys_totp_config", cfg);
        }
      }
      if (!verified) {
        await recordAdminAuthEvent("2fa_failed", auditTelemetry, "Invalid Google Authenticator code");
        const lockoutUntil = await recordRateLimitFailure(clientIp);
        if (lockoutUntil) return json({ error: "Too many failed attempts.", lockoutUntil }, 429);
        return json({ error: "Invalid 2FA code. Enter the 6-digit code from Google Authenticator." }, 401);
      }
      await recordAdminAuthEvent(
        "login_success",
        auditTelemetry,
        usedRecovery ? "Authenticated via backup recovery code" : "Authenticated via Google Authenticator 2FA"
      );
    }

    await clearRateLimit(clientIp);
    const token = await signJwt(
      {
        role: "admin",
        ip: clientIp,
        deviceType: auditTelemetry.deviceType,
        brand: auditTelemetry.brand,
        model: auditTelemetry.model,
        auditId: auditTelemetry.auditId,
      },
      secret,
      7200
    );
    return json({ success: true, token });
  }

  // Admin: Login Audit Logs
  if (path === "/api/admin/login-logs" && method === "GET") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied. Invalid or missing token." }, 401);

    const docs = await fsListDocs("admin_login_attempts", 300);
    const logs = docs
      .filter((d) => {
        const docId = String(d.id || d._docId || "");
        return docId && !docId.startsWith("sys_") && !docId.startsWith("__");
      })
      .map(({ _docId, ...rest }) => rest)
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .slice(0, 100);

    const twoFactorCfg = await loadTwoFactorConfig(env);
    return json({
      success: true,
      logs,
      twoFactorStatus: {
        enabled: Boolean(twoFactorCfg?.enabled),
        enrolledAt: twoFactorCfg?.enrolledAt || null,
        enrolledDevice: twoFactorCfg?.enrolledDevice || null,
        remainingRecoveryCodes: Array.isArray(twoFactorCfg?.recoveryHashes) ? twoFactorCfg.recoveryHashes.length : 0,
        lockedByEnv: Boolean(env.ADMIN_2FA_SECRET),
      },
    });
  }

  // Admin: Reset 2FA pairing
  if (path === "/api/admin/2fa/reset" && method === "POST") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied. Invalid or missing token." }, 401);
    if (env.ADMIN_2FA_SECRET) {
      return json({ error: "2FA is locked via ADMIN_2FA_SECRET environment variable." }, 400);
    }
    await fsDeleteDoc("admin_login_attempts", "sys_totp_config");
    return json({ success: true, message: "2FA configuration reset. Next login will prompt for new authenticator QR pairing." });
  }

  // Stock endpoints
  if (path === "/api/stock" && method === "GET") {
    const stock = await loadStock();
    return json({ success: true, stock });
  }

  if (path === "/api/stock/reset" && method === "POST") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied." }, 401);
    const resetStock = JSON.parse(JSON.stringify(DEFAULT_STOCK));
    await fsSetDoc("stock", "current", resetStock);
    return json({ success: true, message: "Stock successfully reset to the official list", stock: resetStock });
  }

  if (path === "/api/stock" && method === "POST") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied." }, 401);
    if (!body?.fragrances || !body?.bundles) {
      return json({ error: "Invalid stock update request payload." }, 400);
    }
    const updatedStock = { fragrances: body.fragrances, bundles: body.bundles };
    await fsSetDoc("stock", "current", updatedStock);
    return json({ success: true, message: "Stock levels successfully updated", stock: updatedStock });
  }

  // Sold-out alerts
  if (path === "/api/admin/sold-out-alerts" && method === "GET") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied." }, 401);
    const alertsDoc = (await fsGetDoc("stock", "sys_sold_out_alerts")) || { alerts: [] };
    return json({ success: true, alerts: Array.isArray(alertsDoc.alerts) ? alertsDoc.alerts : [] });
  }

  if (path === "/api/admin/sold-out-alerts/dismiss" && method === "POST") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied." }, 401);
    const alertsDoc = (await fsGetDoc("stock", "sys_sold_out_alerts")) || { alerts: [] };
    const alerts = Array.isArray(alertsDoc.alerts) ? alertsDoc.alerts : [];
    const target = alerts.find((a: any) => a.id === body?.id);
    if (target) target.dismissed = true;
    await fsSetDoc("stock", "sys_sold_out_alerts", { alerts });
    return json({ success: true, alerts });
  }

  // Blacklist
  if (path === "/api/admin/blacklist" && method === "GET") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied." }, 401);
    const bl = (await fsGetDoc("stock", "sys_blacklist")) || { phones: ["+916395707450", "6395707450"], emails: ["uditrana69@gmail.com"], ips: [] };
    return json({ success: true, blacklist: { phones: bl.phones || [], emails: bl.emails || [], ips: bl.ips || [] } });
  }

  if (path === "/api/admin/blacklist" && method === "POST") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied." }, 401);
    const bl = (await fsGetDoc("stock", "sys_blacklist")) || { phones: ["+916395707450", "6395707450"], emails: ["uditrana69@gmail.com"], ips: [] };
    const phones: string[] = Array.isArray(bl.phones) ? bl.phones : [];
    const emails: string[] = Array.isArray(bl.emails) ? bl.emails : [];
    const ips: string[] = Array.isArray(bl.ips) ? bl.ips : [];
    if (body?.phone && !phones.includes(String(body.phone).trim())) phones.push(String(body.phone).trim());
    if (body?.email && !emails.includes(String(body.email).trim().toLowerCase())) emails.push(String(body.email).trim().toLowerCase());
    if (body?.ip && body.ip !== "unknown" && !ips.includes(String(body.ip).trim())) ips.push(String(body.ip).trim());
    const next = { phones, emails, ips };
    await fsSetDoc("stock", "sys_blacklist", next);
    return json({ success: true, message: "Device & identity permanently blacklisted.", blacklist: next });
  }

  if (path === "/api/admin/blacklist" && method === "DELETE") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied." }, 401);
    const bl = (await fsGetDoc("stock", "sys_blacklist")) || { phones: [], emails: [], ips: [] };
    const next = {
      phones: (bl.phones || []).filter((p: string) => p !== body?.phone),
      emails: (bl.emails || []).filter((e: string) => e !== String(body?.email || "").toLowerCase()),
      ips: (bl.ips || []).filter((i: string) => i !== body?.ip),
    };
    await fsSetDoc("stock", "sys_blacklist", next);
    return json({ success: true, message: "Entry removed from blacklist.", blacklist: next });
  }

  // Coupons
  if (path === "/api/coupons/used" && method === "GET") {
    const couponDoc = await fsGetDoc("stock", "used_coupons");
    const codes = couponDoc?.codes && typeof couponDoc.codes === "object" ? Object.keys(couponDoc.codes) : [];
    return json({ usedCoupons: codes });
  }

  if (path === "/api/coupons/validate" && method === "POST") {
    const code = String(body?.code || "").trim().toUpperCase();
    if (!code || !VALID_COUPONS.has(code)) {
      return json({ valid: false, error: "Invalid coupon code." }, 400);
    }
    const couponDoc = await fsGetDoc("stock", "used_coupons");
    const usedMap = couponDoc?.codes && typeof couponDoc.codes === "object" ? couponDoc.codes : {};
    if (usedMap[code]) {
      return json({ valid: false, error: "This coupon code has already been used." }, 400);
    }
    return json({ valid: true, code });
  }

  // Orders
  if (path === "/api/orders" && method === "GET") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied. Invalid or missing token." }, 401);
    const docs = await fsListDocs("orders", 300);
    const orders = docs
      .map(({ _docId, ...rest }) => rest)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return json({ success: true, orders });
  }

  if (path === "/api/orders" && method === "POST") {
    const { orderNumber, items, total, subtotal, couponCode, name, email, address, phone, state, pincode, shippingProtection, skipStockReduction, source } = body;
    if (!orderNumber || !items || !name || !address) {
      return json({ error: "Missing required checkout fields." }, 400);
    }
    const existing = await fsGetDoc("orders", orderNumber);
    if (existing) {
      const { _docId, ...rest } = existing;
      return json({ success: true, order: rest });
    }
    const admin = await authenticateAdminRequest(request, secret);
    const wantsManual = Boolean(skipStockReduction) || String(orderNumber).startsWith("SP-ADMIN-");
    if (wantsManual && !admin) {
      return json({ error: "Unauthorized manual order request." }, 403);
    }
    const isManual = wantsManual && Boolean(admin);
    const { ip: clientIp } = extractClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";

    const normalizedCoupon = couponCode ? String(couponCode).trim().toUpperCase() : undefined;
    if (normalizedCoupon && !isManual) {
      if (!VALID_COUPONS.has(normalizedCoupon)) return json({ error: "Invalid coupon code." }, 400);
      const couponDoc = await fsGetDoc("stock", "used_coupons");
      const usedMap = couponDoc?.codes || {};
      if (usedMap[normalizedCoupon] && usedMap[normalizedCoupon] !== orderNumber) {
        return json({ error: "This coupon code has already been used." }, 400);
      }
      usedMap[normalizedCoupon] = orderNumber;
      await fsSetDoc("stock", "used_coupons", { codes: usedMap });
    }

    const newOrder = {
      orderNumber,
      items,
      total: Number(total) || 0,
      ...(subtotal ? { subtotal: Number(subtotal) } : {}),
      ...(normalizedCoupon ? { couponCode: normalizedCoupon } : {}),
      name,
      email: email || "",
      address,
      phone: phone || "N/A",
      state: state || "N/A",
      pincode: pincode || "000000",
      shippingProtection: Boolean(shippingProtection),
      status: isManual ? "paid" : "pending",
      createdAt: new Date().toISOString(),
      stockReduced: false,
      ip: clientIp,
      userAgent,
      ...(source ? { source: String(source) } : {}),
    };
    await fsSetDoc("orders", orderNumber, newOrder);
    return json({ success: true, order: newOrder }, 201);
  }

  if (path === "/api/orders/confirm-payment" && method === "POST") {
    const orderNumber = body?.orderNumber;
    if (!orderNumber) return json({ error: "Missing orderNumber in confirmation request." }, 400);
    const admin = await authenticateAdminRequest(request, secret);
    const wantsManual = Boolean(body?.skipStockReduction) || String(orderNumber).startsWith("SP-ADMIN-");
    if (wantsManual && !admin) {
      return json({ error: "Unauthorized manual order confirmation." }, 403);
    }

    const existing = await fsGetDoc("orders", orderNumber);
    const order: Record<string, any> = existing
      ? { ...existing }
      : {
          orderNumber,
          items: body.items || [],
          total: body.total || 0,
          name: body.name || "Valued Patron",
          email: body.email || "",
          address: body.address || "",
          phone: body.phone || "",
          state: body.state,
          pincode: body.pincode,
          shippingProtection: Boolean(body.shippingProtection),
          status: "pending",
          createdAt: new Date().toISOString(),
          stockReduced: false,
        };
    delete order._docId;
    order.status = "paid";
    const isManual = Boolean(admin) && (Boolean(body?.skipStockReduction) || Boolean(order.skipStockReduction) || String(orderNumber).startsWith("SP-ADMIN-"));
    if (!order.stockReduced && Array.isArray(order.items) && !isManual) {
      await reduceStock(order.items);
      order.stockReduced = true;
    }
    await fsSetDoc("orders", orderNumber, order);
    return json({ success: true, orderStatus: "paid", emailService: "cloudflare-worker" });
  }

  if (path.startsWith("/api/orders/") && method === "DELETE") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied." }, 401);
    const orderNumber = decodeURIComponent(path.slice("/api/orders/".length));
    const existing = await fsGetDoc("orders", orderNumber);
    if (!existing) return json({ error: "Order not found." }, 404);
    delete existing._docId;
    existing.status = "deleted";
    await fsSetDoc("orders", orderNumber, existing);
    return json({ success: true, message: `Order ${orderNumber} deleted successfully.` });
  }

  // Complaints
  if (path === "/api/complaints" && method === "GET") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied." }, 401);
    const docs = await fsListDocs("complaints", 200);
    const complaints = docs
      .map(({ _docId, ...rest }) => rest)
      .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
    return json({ success: true, complaints });
  }

  if (path === "/api/complaints" && method === "POST") {
    const claimId = "CLM-" + Math.floor(1000 + Math.random() * 9000);
    const complaint = {
      id: claimId,
      buyerName: body?.buyerName || "",
      email: body?.email || "",
      perfumeAndSize: body?.perfumeAndSize || "",
      proofImage: body?.proofImage || "",
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    await fsSetDoc("complaints", claimId, complaint);
    return json({ success: true, complaint });
  }

  if (path.startsWith("/api/complaints/") && method === "PATCH") {
    const admin = await authenticateAdminRequest(request, secret);
    if (!admin) return json({ error: "Access denied." }, 401);
    const id = decodeURIComponent(path.slice("/api/complaints/".length));
    const existing = await fsGetDoc("complaints", id);
    if (!existing) return json({ error: "Complaint not found." }, 404);
    delete existing._docId;
    existing.status = body?.status || existing.status;
    await fsSetDoc("complaints", id, existing);
    return json({ success: true, id, status: existing.status });
  }

  return json({ error: "API endpoint not found" }, 404);
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }
    const cleanPath = url.pathname.replace(/\/+$/, "").toLowerCase();
    if (cleanPath === "/scentpreviewsales.in") {
      const rootUrl = new URL("/", url.origin);
      const assetReq = new Request(rootUrl.toString(), {
        method: request.method,
        headers: request.headers,
      });
      const res = await env.ASSETS.fetch(assetReq);
      return new Response(res.body, {
        status: 200,
        headers: res.headers,
      });
    }
    return env.ASSETS.fetch(request);
  },
};
