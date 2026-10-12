import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { cn } from "@/src/lib/utils";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uBarCount;
  uniform float uScale;

  uniform float uWaveComplexity;
  uniform float uWaveAmplitude;
  uniform float uReflectionFrequency;
  uniform float uStreakIntensity;
  uniform float uMetallicContrast;
  uniform float uHighlightWarmth;

  uniform float uRefractionStrength;
  uniform float uEdgeWidth;
  uniform float uEdgeSoftness;
  uniform float uFresnelIntensity;
  uniform float uEdgeHighlight;
  uniform float uGapDarkness;
  uniform float uRefractionWaveSpeed;
  uniform float uRefractionWaveFrequency;

  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 getMetallicColor(vec2 uv, vec2 resolution, vec3 color, float time) {
    vec2 p = uv * 2.0 - 1.0;
    p.x *= resolution.x / resolution.y;

    p *= uScale;

    float t = time * 0.3;

    float waves = snoise(vec3(p * 1.5, t * 0.5)) * 0.5 * uWaveAmplitude;

    if (uWaveComplexity >= 2.0) {
      waves += snoise(vec3(p * 2.0 + 10.0, t * 0.7)) * 0.35 * uWaveAmplitude;
    }
    if (uWaveComplexity >= 3.0) {
      waves += snoise(vec3(p * 4.0 + 20.0, t * 0.9)) * 0.15 * uWaveAmplitude;
    }
    if (uWaveComplexity >= 4.0) {
      waves += snoise(vec3(p * 6.0 + 30.0, t * 1.1)) * 0.1 * uWaveAmplitude;
    }
    if (uWaveComplexity >= 5.0) {
      waves += snoise(vec3(p * 8.0 + 40.0, t * 1.3)) * 0.05 * uWaveAmplitude;
    }

    float reflection = sin(waves * uReflectionFrequency + p.y * 3.0) * 0.5 + 0.5;
    reflection = pow(reflection, 1.5);

    float streak1 = smoothstep(0.4, 0.5, sin(waves * 12.0 + t)) * uStreakIntensity;
    float streak2 = smoothstep(0.6, 0.7, sin(waves * 8.0 - p.x * 2.0 + t * 1.5)) * uStreakIntensity;

    float darkMult = 0.08 / uMetallicContrast;
    float midMult = 0.5;
    float brightMult = 0.5 + 0.7 * uMetallicContrast;

    vec3 darkColor = color * darkMult;
    vec3 midColor = color * midMult;
    vec3 brightColor = color * brightMult;
    vec3 highlightColor = mix(color, vec3(1.0), 0.7);

    vec3 finalColor = mix(darkColor, midColor, reflection);
    finalColor = mix(finalColor, brightColor, pow(reflection, 2.0));
    finalColor = mix(finalColor, highlightColor, streak1 * 0.6);
    finalColor += highlightColor * streak2 * 0.3;

    finalColor += vec3(0.08, 0.06, 0.03) * pow(reflection, 3.0) * uHighlightWarmth;

    return finalColor;
  }

  void main() {
    vec2 uv = vUv;

    float barWidth = 1.0 / uBarCount;
    float barIndex = floor(uv.x / barWidth);
    float barLocal = mod(uv.x, barWidth) / barWidth;

    float edgeWidth = uEdgeWidth;

    float leftDist = barLocal / edgeWidth;
    float rightDist = (1.0 - barLocal) / edgeWidth;
    float edgeDist = min(leftDist, rightDist);
    float inEdgeZone = 1.0 - clamp(edgeDist, 0.0, 1.0);

    vec2 refractionOffset = vec2(0.0);

    if (barLocal < edgeWidth) {
      float t = 1.0 - barLocal / edgeWidth;
      float curve = t * t * t;
      refractionOffset.x = curve * uRefractionStrength * 0.08;
      refractionOffset.y = sin(uv.y * uRefractionWaveFrequency + uTime * uRefractionWaveSpeed) * curve * uRefractionStrength * 0.015;
    }
    else if (barLocal > 1.0 - edgeWidth) {
      float t = (barLocal - (1.0 - edgeWidth)) / edgeWidth;
      float curve = t * t * t;
      refractionOffset.x = -curve * uRefractionStrength * 0.08;
      refractionOffset.y = sin(uv.y * uRefractionWaveFrequency + uTime * uRefractionWaveSpeed + 3.14159) * curve * uRefractionStrength * 0.015;
    }

    vec2 refractedUV = clamp(uv + refractionOffset, 0.0, 1.0);
    vec3 metallic = getMetallicColor(refractedUV, uResolution, uColor, uTime);

    float barMask = smoothstep(0.0, uEdgeSoftness, barLocal) * smoothstep(1.0, 1.0 - uEdgeSoftness, barLocal);

    float gapDarken = mix(1.0 - uGapDarkness, 1.0, barMask);

    float edgeHighlightVal = inEdgeZone * uEdgeHighlight * barMask;

    float fresnel = pow(inEdgeZone, 2.0) * uFresnelIntensity;

    vec3 finalColor = metallic * gapDarken;
    finalColor += vec3(1.0) * edgeHighlightVal;
    finalColor += uColor * fresnel * 0.3;

    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

export interface LiquidBarsProps {
  width?: string | number;
  height?: string | number;
  speed?: number;
  color?: string;
  barCount?: number;
  scale?: number;
  waveComplexity?: number;
  waveAmplitude?: number;
  reflectionFrequency?: number;
  streakIntensity?: number;
  metallicContrast?: number;
  highlightWarmth?: number;
  refractionStrength?: number;
  edgeWidth?: number;
  edgeSoftness?: number;
  fresnelIntensity?: number;
  edgeHighlight?: number;
  gapDarkness?: number;
  refractionWaveSpeed?: number;
  refractionWaveFrequency?: number;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export const LiquidBars: React.FC<LiquidBarsProps> = ({
  width = "100%",
  height = "100%",
  speed = 1,
  color = "#a855f7",
  barCount = 6,
  scale = 0.4,
  waveComplexity = 1,
  waveAmplitude = 0.6,
  reflectionFrequency = 20,
  streakIntensity = 0.25,
  metallicContrast = 2,
  highlightWarmth = 0.5,
  refractionStrength = 5,
  edgeWidth = 0.3,
  edgeSoftness = 0.04,
  fresnelIntensity = 0.2,
  edgeHighlight = 0.1,
  gapDarkness = 0.2,
  refractionWaveSpeed = 1.4,
  refractionWaveFrequency = 20,
  opacity = 1,
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    if (materialRef.current) {
      const u = materialRef.current.uniforms;
      u.uColor.value.set(color);
      u.uOpacity.value = opacity;
      u.uBarCount.value = barCount;
      u.uScale.value = scale;
      u.uWaveComplexity.value = waveComplexity;
      u.uWaveAmplitude.value = waveAmplitude;
      u.uReflectionFrequency.value = reflectionFrequency;
      u.uStreakIntensity.value = streakIntensity;
      u.uMetallicContrast.value = metallicContrast;
      u.uHighlightWarmth.value = highlightWarmth;
      u.uRefractionStrength.value = refractionStrength;
      u.uEdgeWidth.value = edgeWidth;
      u.uEdgeSoftness.value = edgeSoftness;
      u.uFresnelIntensity.value = fresnelIntensity;
      u.uEdgeHighlight.value = edgeHighlight;
      u.uGapDarkness.value = gapDarkness;
      u.uRefractionWaveSpeed.value = refractionWaveSpeed;
      u.uRefractionWaveFrequency.value = refractionWaveFrequency;
    }
  }, [
    color,
    opacity,
    barCount,
    scale,
    waveComplexity,
    waveAmplitude,
    reflectionFrequency,
    streakIntensity,
    metallicContrast,
    highlightWarmth,
    refractionStrength,
    edgeWidth,
    edgeSoftness,
    fresnelIntensity,
    edgeHighlight,
    gapDarkness,
    refractionWaveSpeed,
    refractionWaveFrequency,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.set(0, 0, 5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const w = container.clientWidth || 300;
    const h = container.clientHeight || 300;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.insertBefore(renderer.domElement, container.firstChild);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(w, h) },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uBarCount: { value: barCount },
      uScale: { value: scale },
      uWaveComplexity: { value: waveComplexity },
      uWaveAmplitude: { value: waveAmplitude },
      uReflectionFrequency: { value: reflectionFrequency },
      uStreakIntensity: { value: streakIntensity },
      uMetallicContrast: { value: metallicContrast },
      uHighlightWarmth: { value: highlightWarmth },
      uRefractionStrength: { value: refractionStrength },
      uEdgeWidth: { value: edgeWidth },
      uEdgeSoftness: { value: edgeSoftness },
      uFresnelIntensity: { value: fresnelIntensity },
      uEdgeHighlight: { value: edgeHighlight },
      uGapDarkness: { value: gapDarkness },
      uRefractionWaveSpeed: { value: refractionWaveSpeed },
      uRefractionWaveFrequency: { value: refractionWaveFrequency },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 100;
      const nh = container.clientHeight || 100;
      renderer.setSize(nw, nh);
      uniforms.uResolution.value.set(nw, nh);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const startTime = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate);
      const elapsedSeconds = (now - startTime) / 1000;
      uniforms.uTime.value = elapsedSeconds * speedRef.current;
      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      materialRef.current = null;
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ width: widthStyle, height: heightStyle }}
    >
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

LiquidBars.displayName = "LiquidBars";

export default LiquidBars;
