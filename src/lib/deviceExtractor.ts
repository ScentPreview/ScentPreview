export interface ClientDeviceTelemetry {
  userAgent: string;
  platform: string;
  language: string;
  languages: string[];
  timezone: string;
  screenResolution: string;
  viewportSize: string;
  pixelRatio: number;
  hardwareConcurrency: number | null;
  deviceMemory: number | null;
  maxTouchPoints: number;
  gpuVendor: string;
  gpuRenderer: string;
  highEntropyBrand: string;
  highEntropyModel: string;
  highEntropyPlatform: string;
  highEntropyPlatformVersion: string;
  highEntropyMobile: boolean | null;
  architecture: string;
  clientSignature: string;
  collectedAt: string;
}

function hashSignature(input: string): string {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return ((h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0")).toUpperCase();
}

function getWebGLInfo(): { vendor: string; renderer: string } {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return { vendor: "Unavailable", renderer: "Unavailable" };
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const vendor = String(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "Unknown");
      const renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "Unknown");
      return { vendor, renderer };
    }
    return {
      vendor: String(gl.getParameter(gl.VENDOR) || "Generic"),
      renderer: String(gl.getParameter(gl.RENDERER) || "Generic"),
    };
  } catch {
    return { vendor: "Restricted", renderer: "Restricted" };
  }
}

export async function extractDeviceTelemetry(): Promise<ClientDeviceTelemetry> {
  const nav = typeof navigator !== "undefined" ? navigator : ({} as Navigator);
  const win = typeof window !== "undefined" ? window : ({} as Window);

  let highEntropyBrand = "";
  let highEntropyModel = "";
  let highEntropyPlatform = "";
  let highEntropyPlatformVersion = "";
  let highEntropyMobile: boolean | null = null;
  let architecture = "";

  try {
    const uaData = (nav as any).userAgentData;
    if (uaData) {
      if (typeof uaData.mobile === "boolean") {
        highEntropyMobile = uaData.mobile;
      }
      if (Array.isArray(uaData.brands)) {
        highEntropyBrand = uaData.brands
          .map((b: any) => `${b.brand} ${b.version}`)
          .filter((s: string) => !s.toLowerCase().includes("not"))
          .join(", ");
      }
      if (typeof uaData.getHighEntropyValues === "function") {
        const values = await uaData.getHighEntropyValues([
          "model",
          "platform",
          "platformVersion",
          "architecture",
        ]);
        if (values?.model) highEntropyModel = String(values.model);
        if (values?.platform) highEntropyPlatform = String(values.platform);
        if (values?.platformVersion) highEntropyPlatformVersion = String(values.platformVersion);
        if (values?.architecture) architecture = String(values.architecture);
      }
    }
  } catch {
    // High-entropy hints unsupported or blocked by browser privacy policy
  }

  const webgl = typeof document !== "undefined" ? getWebGLInfo() : { vendor: "N/A", renderer: "N/A" };
  let timezone = "Unknown";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
  } catch {}

  const screenWidth = typeof win.screen?.width === "number" ? win.screen.width : 0;
  const screenHeight = typeof win.screen?.height === "number" ? win.screen.height : 0;
  const screenResolution = `${screenWidth}x${screenHeight}`;
  const viewportSize = `${win.innerWidth || 0}x${win.innerHeight || 0}`;
  const pixelRatio = typeof win.devicePixelRatio === "number" ? win.devicePixelRatio : 1;

  const userAgent = String(nav.userAgent || "Unknown");
  const platform = String((nav as any).platform || "Unknown");
  const language = String(nav.language || "Unknown");
  const languages = Array.isArray(nav.languages) ? Array.from(nav.languages).slice(0, 5) : [language];
  const hardwareConcurrency = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : null;
  const deviceMemory = typeof (nav as any).deviceMemory === "number" ? (nav as any).deviceMemory : null;
  const maxTouchPoints = typeof nav.maxTouchPoints === "number" ? nav.maxTouchPoints : 0;

  const rawFingerprint = [
    userAgent,
    platform,
    screenResolution,
    pixelRatio,
    timezone,
    hardwareConcurrency,
    maxTouchPoints,
    webgl.vendor,
    webgl.renderer,
    highEntropyModel,
    highEntropyPlatform,
  ].join("|");

  return {
    userAgent,
    platform,
    language,
    languages,
    timezone,
    screenResolution,
    viewportSize,
    pixelRatio,
    hardwareConcurrency,
    deviceMemory,
    maxTouchPoints,
    gpuVendor: webgl.vendor,
    gpuRenderer: webgl.renderer,
    highEntropyBrand,
    highEntropyModel,
    highEntropyPlatform,
    highEntropyPlatformVersion,
    highEntropyMobile,
    architecture,
    clientSignature: hashSignature(rawFingerprint),
    collectedAt: new Date().toISOString(),
  };
}
