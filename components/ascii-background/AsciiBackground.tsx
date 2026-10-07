"use client";

import { useEffect, useRef } from "react";

const LEAF_CHARS = ["*", "~", "+", ".", "S", "E", "D", "H", "E", "✿", "❀", "🌸"];
const BARK_CHARS = ["=", "#", "*", ":", "-", "░", "▒"];
const KATAKANA = ["ゴ", "ド", "バ", "オ", "ア", "メ", "シ", "キ", "ム", "ラ"];
const COIN_CHARS = ["$", "¢", "♦", "©", "O", "●"];
const MANGA_WORDS = ["WHOOSH!", "SLASH!", "ゴゴゴゴ", "ズズズ", "BAM!"];

// 404 Withering Foliage Glyphs & Palette
const WITHERING_LEAF_GLYPHS = ["*", "~", "+", "✿", "❀", "🌸", "🍂", "░", "·", "S", "E", "D"];

const getWitheringPalette = (isLight: boolean) => {
  if (isLight) {
    return [
      "#e11d48", // rich rose crimson
      "#dc2626", // rich ember red
      "#ea580c", // deep autumn rust
      "#d97706", // warm amber
      "#b45309", // rich amber gold
      "#db2777", // deep sakura petal
      "#78716c"  // warm stone ash
    ];
  } else {
    return [
      "#f472b6", // luminous sakura pink
      "#fb7185", // rose blossom
      "#ff4d6d", // glowing crimson
      "#ef4444", // ember red
      "#f97316", // autumn rust orange
      "#f59e0b", // luminous amber
      "#fda4af"  // pale petal rose
    ];
  }
};

interface BranchPoint {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  char: string;
  color: string;
  depth: number;
  size: number;
}

interface CanopyPoint {
  baseX: number;
  baseY: number;
  char: string;
  color: string;
  autumnChar: string;
  autumnColor: string;
  phase: number;
  size: number;
  colorVariant: number;
  isFlower: boolean;
  autumnIndex: number;
}


class CoinParticle {
  x: number;
  y: number;
  char: string;
  speedX: number;
  speedY: number;
  life: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.char = COIN_CHARS[Math.floor(Math.random() * COIN_CHARS.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 3;
    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed - 5; // Initial explosive burst upwards
    this.life = 1.0;
  }

  update(height: number) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 0.4; // Gravity

    // Bounce off bottom of screen
    if (this.y > height - 10) {
      this.y = height - 10;
      this.speedY *= -0.6; // Dampen bounce
    }

    this.life -= 0.005; // Fade over time
  }
}

class FloatingText {
  x: number;
  y: number;
  text: string;
  life: number;
  isGiant?: boolean;
  angle?: number;
  subText?: string;

  constructor(x: number, y: number, text?: string, isGiant?: boolean, angle?: number, subText?: string) {
    this.x = x;
    this.y = y;
    this.text = text || MANGA_WORDS[Math.floor(Math.random() * MANGA_WORDS.length)];
    this.life = 1.0;
    this.isGiant = isGiant;
    this.angle = angle;
    this.subText = subText;
  }

  update() {
    if (this.isGiant) {
      this.life -= 0.025; // Giant text fades in about 40 frames
    } else {
      this.y -= 1.5; // Rise up
      this.life -= 0.02; // Fade quickly
    }
  }
}

class FallingPetal {
  x: number;
  y: number;
  char: string;
  color: string;
  phase: number;
  speedY: number;
  speedX: number;
  scale: number;
  rotation: number;
  rotSpeed: number;
  isShiny: boolean;
  isWithering: boolean;
  life: number;
  swept: boolean = false;

  constructor(
    startX: number,
    startY: number,
    color1: string,
    color2: string,
    isLightMode = false,
    isWithering = false,
    forcedChar?: string
  ) {
    this.x = startX;
    this.y = startY;
    this.isWithering = isWithering;
    this.life = 1.0;

    if (isWithering) {
      this.char = forcedChar || WITHERING_LEAF_GLYPHS[Math.floor(Math.random() * WITHERING_LEAF_GLYPHS.length)];
      const palette = getWitheringPalette(isLightMode);
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.phase = Math.random() * Math.PI * 2;
      // 404 Mode: Steady downward vertical gravity cascade
      this.speedY = Math.random() * 1.3 + 0.85;
      this.speedX = (Math.random() - 0.35) * 0.35; // Minimal lateral drift
      this.scale = Math.random() * 0.8 + 0.7;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.isShiny = Math.random() < 0.02;
    } else {
      this.char = forcedChar || LEAF_CHARS[Math.floor(Math.random() * LEAF_CHARS.length)];
      if (this.char === "✿" || this.char === "❀" || this.char === "🌸") {
        this.color = isLightMode ? "#e11d48" : "#f472b6"; // Luminous cherry blossom petal
      } else {
        this.color = Math.random() > 0.5 ? color1 : color2;
      }
      this.phase = Math.random() * Math.PI * 2;
      this.speedY = Math.random() * 0.2 + 0.1; // Slowed down from 0.5 + 0.2
      this.speedX = Math.random() * 0.8 + 0.4; // Slowed down from 2.0 + 1.5
      this.scale = Math.random() * 0.8 + 0.8;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02; // Slower rotation from 0.05
      this.isShiny = Math.random() < 0.02;
    }
  }

  sweepWithWind(windStrength = 7.0) {
    this.isWithering = false;
    this.swept = true;
    // Strong horizontal wind propulsion to carry the leaf across the viewport
    this.speedX = Math.random() * 1.6 + 2.4 + windStrength * 0.35;
    // Dynamic upward/fluttering swirl as the gust catches underneath
    this.speedY = -(Math.random() * 0.8 + 0.25);
    this.rotSpeed = (Math.random() - 0.5) * 0.07;
    // Refresh life so the leaf completes its journey across the viewport
    this.life = Math.max(this.life, 0.85);
  }

  update(time: number, globalWind: number, gustWind = 0, is404Active = true) {
    if (this.isWithering && !is404Active) {
      this.sweepWithWind(gustWind > 0 ? gustWind : 7.0);
    }

    if (this.isWithering) {
      // 404 Mode: Vertical cascade downward with steady gravity
      this.y += this.speedY + Math.sin(time * 0.002 + this.phase) * 0.2;

      // When gust triggers (e.g. hovering redirect button), surge with the gust
      let windPush = Math.min(globalWind, 1.2) * 0.12;
      if (gustWind > 0.05) {
        windPush += gustWind * 3.8;
        this.y += (Math.sin(time * 0.01 + this.phase) - 0.2) * gustWind * 0.8;
        this.rotation += gustWind * 0.06;
      }

      this.x += this.speedX + windPush + Math.cos(time * 0.0015 + this.phase) * 0.45;
      this.rotation += this.rotSpeed;

      this.life -= 0.0005;
      if (this.life < 0.35 && this.char !== "·" && this.char !== "░" && this.char !== "~") {
        this.char = Math.random() < 0.5 ? "·" : "~";
      }
    } else {
      // Normal flight or post-sweep flight:
      if (this.swept) {
        // Smoothly ease upward flutter into gentle floating descent matching normal leaves
        if (this.speedY < 0.22) {
          this.speedY += 0.02;
        }
        // Smoothly ease high burst speed back towards normal ambient speed
        if (this.speedX > 1.2) {
          this.speedX -= 0.025;
        }
      }

      // Normal Page: Signature ambient wind drift
      const effectiveWind = globalWind + gustWind;
      this.x += this.speedX * (effectiveWind > 0 ? 1 : 0) + effectiveWind + Math.sin(time * 0.001 + this.phase) * 1.2;
      this.y += this.speedY * (effectiveWind > 0 ? 1 : 0.1) + Math.cos(time * 0.002 + this.phase) * 0.8;
      this.rotation += this.rotSpeed;
    }
  }
}

interface GlobalTreeBranch {
  baseX: number;
  baseY: number;
  char: string;
  depth: number;
  size: number;
}

interface GlobalTreeCanopy {
  baseX: number;
  baseY: number;
  char: string;
  autumnChar: string;
  autumnIndex: number;
  phase: number;
  size: number;
  colorVariant: number;
  isFlower: boolean;
}

interface GlobalTreeData {
  seed: number;
  width: number;
  height: number;
  branches: GlobalTreeBranch[];
  canopy: GlobalTreeCanopy[];
}

const SESSION_TREE_KEY = "portfolio_ascii_tree_v2";
const SESSION_SEED_KEY = "portfolio_ascii_tree_seed";

// Module-level in-memory cache surviving client component remounts across page navigations
let globalSessionTree: GlobalTreeData | null = null;

function createPRNG(seed: number) {
  let s = seed | 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getOrCreateSessionSeed(): number {
  if (typeof window === "undefined") return 1337;
  try {
    const existing = window.sessionStorage?.getItem(SESSION_SEED_KEY);
    if (existing) {
      const parsed = parseInt(existing, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    const newSeed = Math.floor(Math.random() * 2147483640) + 1;
    window.sessionStorage?.setItem(SESSION_SEED_KEY, newSeed.toString());
    return newSeed;
  } catch {
    return 1337;
  }
}

function loadGlobalTree(): GlobalTreeData | null {
  if (globalSessionTree) return globalSessionTree;
  if (typeof window !== "undefined") {
    const win = window as unknown as { __GLOBAL_ASCII_TREE__?: GlobalTreeData };
    if (win.__GLOBAL_ASCII_TREE__) {
      globalSessionTree = win.__GLOBAL_ASCII_TREE__;
      return globalSessionTree;
    }
    try {
      const raw = window.sessionStorage?.getItem(SESSION_TREE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GlobalTreeData;
        if (
          parsed &&
          Array.isArray(parsed.branches) &&
          Array.isArray(parsed.canopy) &&
          parsed.branches.length > 0
        ) {
          globalSessionTree = parsed;
          win.__GLOBAL_ASCII_TREE__ = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return null;
}

function saveGlobalTree(tree: GlobalTreeData): void {
  globalSessionTree = tree;
  if (typeof window !== "undefined") {
    const win = window as unknown as { __GLOBAL_ASCII_TREE__?: GlobalTreeData };
    win.__GLOBAL_ASCII_TREE__ = tree;
    try {
      window.sessionStorage?.setItem(SESSION_TREE_KEY, JSON.stringify(tree));
    } catch {
      // ignore
    }
  }
}

function generateDeterministicTree(
  width: number,
  height: number,
  seed: number
): GlobalTreeData {
  const prng = createPRNG(seed);
  const isMobile = width < 768;
  const startX = -20;
  const startY = height * (isMobile ? 0.72 : 0.65);
  const initialLength = isMobile
    ? Math.min(width * 0.45, 185)
    : Math.min(width * 0.2, 280);
  const initialAngle = -0.3;
  const initialWidth = isMobile ? 7 : 9;

  const rawBranches: GlobalTreeBranch[] = [];
  const rawCanopy: GlobalTreeCanopy[] = [];

  const buildSubTree = (
    x: number,
    y: number,
    length: number,
    angle: number,
    depth: number,
    maxDepth: number,
    branchWidth: number
  ) => {
    if (depth > maxDepth) return;
    const stepSize = 16;
    const steps = Math.floor(length / stepSize);
    for (let i = 0; i < steps; i++) {
      const bx = x + Math.cos(angle) * (i * stepSize);
      const by = y + Math.sin(angle) * (i * stepSize);
      const currentWidth = branchWidth * (1 - (i / steps) * 0.5);
      const numChars = Math.max(0, Math.floor(currentWidth / 4));

      for (let w = -numChars; w <= numChars; w++) {
        const jitterX = (prng() - 0.5) * 4;
        const jitterY = (prng() - 0.5) * 4;
        const wx = bx + Math.cos(angle + Math.PI / 2) * w * 8 + jitterX;
        const wy = by + Math.sin(angle + Math.PI / 2) * w * 8 + jitterY;
        rawBranches.push({
          baseX: Math.round(wx * 10) / 10,
          baseY: Math.round(wy * 10) / 10,
          char: BARK_CHARS[Math.floor(prng() * BARK_CHARS.length)],
          depth,
          size: 12,
        });
      }
    }

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    if (depth >= maxDepth - 2 || depth === 0) {
      const isEnd = depth === maxDepth;
      const numLeaves = isEnd
        ? (isMobile ? 25 : 50)
        : (depth === 0 ? (isMobile ? 15 : 30) : (isMobile ? 10 : 20));
      const spread = isEnd ? (isMobile ? 35 : 60) : (isMobile ? 15 : 30);

      for (let i = 0; i < numLeaves; i++) {
        const r1 = Math.max(0.0001, prng());
        const r2 = prng();
        const radius = spread * Math.sqrt(-2.0 * Math.log(r1)) * Math.cos(2.0 * Math.PI * r2) * 0.4;
        const theta = prng() * Math.PI * 2;
        const cx = endX + Math.cos(theta) * radius;
        const cy = endY + Math.sin(theta) * radius;

        const leafChar = LEAF_CHARS[Math.floor(prng() * LEAF_CHARS.length)];
        const isFlower = leafChar === "✿" || leafChar === "❀" || leafChar === "🌸";
        const colorVariant = prng() > 0.4 ? 0 : 1;
        const autumnChar = WITHERING_LEAF_GLYPHS[Math.floor(prng() * WITHERING_LEAF_GLYPHS.length)];
        const autumnIndex = Math.floor(prng() * 100);

        rawCanopy.push({
          baseX: Math.round(cx * 10) / 10,
          baseY: Math.round(cy * 10) / 10,
          char: leafChar,
          autumnChar,
          autumnIndex,
          phase: prng() * Math.PI * 2,
          size: isMobile ? 11 : 14,
          colorVariant,
          isFlower,
        });
      }
    }

    if (depth < maxDepth) {
      const numBranches = depth === 0 ? 2 : (prng() > 0.3 ? 2 : 1);
      for (let i = 0; i < numBranches; i++) {
        let newAngle = angle;
        let newLength = length;
        let newWidth = branchWidth;
        if (depth === 0) {
          if (i === 0) {
            newAngle = angle - 0.2;
            newLength = length * 0.9;
            newWidth = branchWidth * 0.8;
          } else {
            newAngle = angle + 0.25;
            newLength = length * 0.6;
            newWidth = branchWidth * 0.6;
          }
        } else {
          if (i === 0) {
            newAngle = angle + (prng() * 0.3 - 0.15);
            newLength = length * 0.8;
            newWidth = branchWidth * 0.8;
          } else {
            newAngle = angle + (prng() > 0.5 ? 0.4 : -0.4);
            newLength = length * 0.6;
            newWidth = branchWidth * 0.6;
          }
        }
        buildSubTree(endX, endY, newLength, newAngle, depth + 1, maxDepth, newWidth);
      }
    }
  };

  buildSubTree(startX, startY, initialLength, initialAngle, 0, isMobile ? 3 : 4, initialWidth);
  buildSubTree(startX, startY + 20, initialLength * 0.5, 0.15, 0, isMobile ? 2 : 3, initialWidth * 0.7);

  return {
    seed,
    width,
    height,
    branches: rawBranches,
    canopy: rawCanopy,
  };
}

export function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let branches: BranchPoint[] = [];
    let canopy: CanopyPoint[] = [];
    let fallingPetals: FallingPetal[] = [];
    let coins: CoinParticle[] = [];
    let floatTexts: FloatingText[] = [];

    let dragPoints: { x: number; y: number }[] = [];
    let dragScreenPoints: { x: number; y: number }[] = [];
    let slashEffect: {
      active: boolean;
      p1: { x: number; y: number } | null;
      p2: { x: number; y: number } | null;
      progress: number;
      maxLife: number;
    } = { active: false, p1: null, p2: null, progress: 0, maxLife: 16 };
    let flashTime = 0;
    let flashFadeTimer: ReturnType<typeof setTimeout> | null = null;
    let flashCleanTimer: ReturnType<typeof setTimeout> | null = null;

    let mouseX = -1000;
    let mouseY = -1000;
    let isDragging = false;
    let isDomainExpansion = false;
    let is404Mode = false;
    let currentZoom = 1.0;
    let justDraggedTime = 0;
    let gustWind = 0;
    let lastDecomposeTime = 0;

    let primaryColor = "#05acff";
    let secondaryColor = "#ade1ff";
    let tertiaryColor = "#036799";
    let textColor = "#ffffff";
    let isLightMode = false;

    // Offscreen canvas glyph caching to optimize canvas drawing
    const glyphCache = new Map<string, HTMLCanvasElement>();
    const getGlyphCanvas = (char: string, color: string, font: string, size: number) => {
      const key = `${char}_${color}_${font}_${size}`;
      let cached = glyphCache.get(key);
      if (!cached) {
        cached = document.createElement("canvas");
        const padding = Math.max(8, size * 0.5);
        const dimension = Math.ceil(size * 2 + padding);
        cached.width = dimension;
        cached.height = dimension;
        const oCtx = cached.getContext("2d");
        if (oCtx) {
          oCtx.font = font;
          oCtx.fillStyle = color;
          oCtx.textAlign = "center";
          oCtx.textBaseline = "middle";
          oCtx.fillText(char, dimension / 2, dimension / 2);
        }
        glyphCache.set(key, cached);
      }
      return cached;
    };

    const updateColors = () => {
      const style = getComputedStyle(document.documentElement);
      const p = style.getPropertyValue("--primary").trim();
      const s = style.getPropertyValue("--secondary").trim();
      const t = style.getPropertyValue("--teritiary").trim();
      const txt = style.getPropertyValue("--textColor").trim();
      const bg = style.getPropertyValue("--background").trim();

      isLightMode = bg === "#fff" || bg === "#ffffff" || bg.includes("255, 255, 255") || txt === "#121212" || window.matchMedia("(prefers-color-scheme: light)").matches;

      if (isLightMode) {
        primaryColor = p || "#0284c7";
        secondaryColor = "#0284c7"; // high-contrast vibrant cerulean in light mode
        tertiaryColor = t || "#036799";
        textColor = txt || "#121212";
      } else {
        if (p) primaryColor = p;
        if (s) secondaryColor = s;
        if (t) tertiaryColor = t;
        if (txt) textColor = txt;
      }

      const witheringPalette = getWitheringPalette(isLightMode);
      canopy.forEach((c) => {
        if (c.isFlower) {
          c.color = isLightMode ? "#e11d48" : "#f472b6";
        } else {
          c.color = c.colorVariant === 1 ? secondaryColor : primaryColor;
        }
        c.autumnColor = witheringPalette[c.autumnIndex % witheringPalette.length];
      });

      glyphCache.clear();
    };

    const getSlashOffset = (px: number, py: number) => {
      if (!slashEffect.active || !slashEffect.p1 || !slashEffect.p2) return { x: 0, y: 0 };
      const { x: x1, y: y1 } = slashEffect.p1;
      const { x: x2, y: y2 } = slashEffect.p2;

      const cross = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
      const dy = y2 - y1;
      const dx = x2 - x1;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      const lifeRatio = slashEffect.progress / slashEffect.maxLife;
      const displacement = Math.sin(lifeRatio * Math.PI) * 18 * (1 - lifeRatio); // Smooth, snappy return without lingering

      const side = cross >= 0 ? 1 : -1;
      return {
        x: nx * displacement * side,
        y: ny * displacement * side
      };
    };

    const getOrInitGlobalTree = (w: number, h: number): GlobalTreeData => {
      const cached = loadGlobalTree();
      if (cached) {
        const isMobileNow = w < 768;
        const wasMobile = cached.width < 768;
        // Keep tree continuous if device category is unchanged
        if (isMobileNow === wasMobile) {
          const deltaY = h - cached.height;
          if (deltaY !== 0 && Math.abs(deltaY) < 220) {
            // Anchor smoothly to bottom on minor height adjustments (e.g. mobile URL bar)
            cached.branches.forEach((b) => {
              b.baseY += deltaY;
            });
            cached.canopy.forEach((c) => {
              c.baseY += deltaY;
            });
            cached.height = h;
            cached.width = w;
            saveGlobalTree(cached);
          }
          return cached;
        }
      }

      // First generation or major breakpoint transition (mobile <-> desktop):
      const seed = cached?.seed ?? getOrCreateSessionSeed();
      const newTree = generateDeterministicTree(w, h, seed);
      saveGlobalTree(newTree);
      return newTree;
    };

    const syncTreeFromGlobal = () => {
      const treeData = getOrInitGlobalTree(canvas.width, canvas.height);
      branches = treeData.branches.map((b) => ({
        x: b.baseX,
        y: b.baseY,
        baseX: b.baseX,
        baseY: b.baseY,
        char: b.char,
        color: tertiaryColor,
        depth: b.depth,
        size: b.size,
      }));

      const witheringPalette = getWitheringPalette(isLightMode);
      canopy = treeData.canopy.map((c, idx) => {
        let leafColor: string;
        if (c.isFlower) {
          leafColor = isLightMode ? "#e11d48" : "#f472b6";
        } else {
          leafColor = c.colorVariant === 1 ? secondaryColor : primaryColor;
        }
        const autumnIndex = typeof c.autumnIndex === "number" ? c.autumnIndex : idx;
        const autumnChar = c.autumnChar || c.char;
        const autumnColor = witheringPalette[autumnIndex % witheringPalette.length];
        return {
          baseX: c.baseX,
          baseY: c.baseY,
          char: c.char,
          color: leafColor,
          autumnChar,
          autumnColor,
          autumnIndex,
          phase: c.phase,
          size: c.size,
          colorVariant: c.colorVariant,
          isFlower: c.isFlower,
        };
      });
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateColors();
      syncTreeFromGlobal();
      updateColors();

      // Pre-seed falling leaves in 404 mode so user immediately sees atmospheric vertical cascade
      if (is404Mode && canopy.length > 0 && fallingPetals.length === 0) {
        for (let i = 0; i < 20; i++) {
          const source = canopy[Math.floor(Math.random() * canopy.length)];
          fallingPetals.push(
            new FallingPetal(
              source.baseX + (Math.random() - 0.2) * (canvas.width * 0.45),
              Math.random() * canvas.height,
              primaryColor,
              secondaryColor,
              isLightMode,
              true,
              source.autumnChar
            )
          );
        }
      }
    };

    const triggerDomainBlockedError = (x?: number, y?: number) => {
      const posX = Math.max(canvas.width * 0.2, Math.min(canvas.width * 0.8, x ?? canvas.width * 0.32));
      const posY = Math.max(90, Math.min(canvas.height - 100, y ?? canvas.height * 0.38));
      floatTexts.push(
        new FloatingText(posX, posY, "ERR // DOMAIN_BLOCKED", true, 0, "[ ROUTE_SEVERED: 0x404 ]")
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("tree:domain_blocked", { detail: { x: posX, y: posY } }));
      }
    };

    const triggerSlashBlockedError = (x?: number, y?: number) => {
      const posX = Math.max(canvas.width * 0.15, Math.min(canvas.width * 0.55, x ?? canvas.width * 0.35));
      const posY = Math.max(90, Math.min(canvas.height - 100, y ?? canvas.height * 0.42));
      floatTexts.push(
        new FloatingText(posX, posY, "ERR // 0x404_SEVERED", true, 0, "[ SLASH_RESTRICTED ]")
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("tree:slash_blocked", { detail: { x: posX, y: posY } }));
      }
    };

    const handleTreeGust = (e: Event) => {
      const ce = e as CustomEvent<{ strength?: number; petals?: number }>;
      const strength = ce.detail?.strength ?? 3.2;
      const numPetals = ce.detail?.petals ?? 18;
      gustWind = Math.max(gustWind, strength);

      // Spawn gust petals from canopy
      if (canopy.length > 0) {
        for (let i = 0; i < numPetals; i++) {
          const source = canopy[Math.floor(Math.random() * canopy.length)];
          fallingPetals.push(
            new FallingPetal(
              source.baseX,
              source.baseY,
              primaryColor,
              secondaryColor,
              isLightMode,
              is404Mode,
              is404Mode ? source.autumnChar : source.char
            )
          );
        }
      }
    };

    const clipRectWithHalfPlane = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      W: number,
      H: number
    ): { x: number; y: number }[] | null => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      if (Math.hypot(dx, dy) < 1) return null;

      // Normal vector pointing to the half-plane on one side of cut vector (p1 -> p2)
      const A = -dy;
      const B = dx;
      const C = -(A * p1.x + B * p1.y);

      const isInside = (pt: { x: number; y: number }) => A * pt.x + B * pt.y + C >= -1e-4;

      const lineIntersection = (cp1: { x: number; y: number }, cp2: { x: number; y: number }) => {
        const d1 = A * cp1.x + B * cp1.y + C;
        const d2 = A * cp2.x + B * cp2.y + C;
        const t = d1 / (d1 - d2);
        return {
          x: cp1.x + t * (cp2.x - cp1.x),
          y: cp1.y + t * (cp2.y - cp1.y)
        };
      };

      const subject = [
        { x: 0, y: 0 },
        { x: W, y: 0 },
        { x: W, y: H },
        { x: 0, y: H }
      ];

      const output: { x: number; y: number }[] = [];
      for (let i = 0; i < subject.length; i++) {
        const cur = subject[i];
        const prev = subject[(i + subject.length - 1) % subject.length];

        if (isInside(cur)) {
          if (!isInside(prev)) {
            output.push(lineIntersection(prev, cur));
          }
          output.push(cur);
        } else if (isInside(prev)) {
          output.push(lineIntersection(prev, cur));
        }
      }

      // Filter duplicate vertices and constrain coordinates strictly to [0, W] x [0, H]
      const clean: { x: number; y: number }[] = [];
      for (const pt of output) {
        if (!clean.some(c => Math.hypot(c.x - pt.x, c.y - pt.y) < 1)) {
          clean.push({
            x: Math.max(0, Math.min(W, Math.round(pt.x))),
            y: Math.max(0, Math.min(H, Math.round(pt.y)))
          });
        }
      }

      return clean.length >= 3 ? clean : null;
    };

    const triggerHalfPlaneSlash = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const overlay = flashOverlayRef.current;
      if (!overlay) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const poly = clipRectWithHalfPlane(p1, p2, W, H);
      if (!poly || poly.length < 3) return;

      const clipStr = `polygon(${poly.map(pt => `${pt.x}px ${pt.y}px`).join(", ")})`;
      const filterValue = "invert(100%) grayscale(100%) contrast(150%)";

      if (flashFadeTimer) clearTimeout(flashFadeTimer);
      if (flashCleanTimer) clearTimeout(flashCleanTimer);

      overlay.style.transition = "none";
      overlay.style.clipPath = clipStr;
      overlay.style.backdropFilter = filterValue;
      overlay.style.setProperty("-webkit-backdrop-filter", filterValue);
      overlay.style.opacity = "1";

      flashFadeTimer = setTimeout(() => {
        overlay.style.transition = "opacity 0.35s cubic-bezier(0.1, 0.8, 0.25, 1)";
        overlay.style.opacity = "0";
      }, 180);

      flashCleanTimer = setTimeout(() => {
        overlay.style.clipPath = "none";
        overlay.style.backdropFilter = "none";
        overlay.style.setProperty("-webkit-backdrop-filter", "none");
      }, 550);
    };

    const handleTreeSlash = () => {
      if (is404Mode) {
        triggerSlashBlockedError(canvas.width / 2, canvas.height / 2);
        return;
      }
      const p1 = { x: canvas.width * 0.15, y: canvas.height * 0.25 };
      const p2 = { x: canvas.width * 0.85, y: canvas.height * 0.75 };
      slashEffect = {
        active: true,
        p1: p1,
        p2: p2,
        progress: 0,
        maxLife: 20
      };
      flashTime = 8;
      triggerHalfPlaneSlash(
        { x: window.innerWidth * 0.15, y: window.innerHeight * 0.25 },
        { x: window.innerWidth * 0.85, y: window.innerHeight * 0.75 }
      );
      floatTexts.push(
        new FloatingText(canvas.width / 2, canvas.height / 2, "斬!", true, -0.35)
      );
    };

    const startTime = Date.now();
    let isPointerDown = false;
    let startPointerX = 0;
    let startPointerY = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() - startTime;

      // Update slash progress
      if (slashEffect.active) {
        slashEffect.progress++;
        if (slashEffect.progress >= slashEffect.maxLife) {
          slashEffect.active = false;
        }
      }

      // Physics Variables (Slowed down leaf wind sweep)
      let globalWind = Math.sin(time * 0.0002) * 0.5 + 0.5;

      if (gustWind > 0) {
        const decayRate = gustWind > 4.0 ? 0.962 : 0.94;
        gustWind *= decayRate;
        if (gustWind < 0.02) gustWind = 0;
      }

      if (isDomainExpansion) {
        globalWind = 0; // Wind freezes
        const bgGrad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          50,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) * 0.75
        );
        bgGrad.addColorStop(0, "rgba(24, 6, 12, 0.94)");
        bgGrad.addColorStop(1, "rgba(10, 2, 5, 0.98)");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Smooth Cinematic Zoom (Snappy, punchy impact without lingering)
      const targetZoom = isDomainExpansion ? 1.08 : (slashEffect.active ? 1.05 : 1.0);
      currentZoom += (targetZoom - currentZoom) * 0.3; // Fast, snappy return

      ctx.save();
      // Zoom from the center of the screen
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(currentZoom, currentZoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const canvasMouseX = centerX + (mouseX - centerX) / currentZoom;
      const canvasMouseY = centerY + (mouseY - centerY) / currentZoom;

      // Draw Drag Path Line
      if (isDragging && dragPoints.length > 1) {
        const dragLineColor = is404Mode ? "#e11d48" : primaryColor;
        ctx.strokeStyle = dragLineColor;
        ctx.lineWidth = 2; // Thin drag trail line
        ctx.shadowBlur = 10;
        ctx.shadowColor = dragLineColor;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(dragPoints[0].x, dragPoints[0].y);
        for (let i = 1; i < dragPoints.length; i++) {
          ctx.lineTo(dragPoints[i].x, dragPoints[i].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // EASTER EGG 2: Manga Speedlines (Drag Mode)
      if (isDragging) {
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const length = Math.random() * canvas.width;
          ctx.moveTo(canvasMouseX + Math.cos(angle) * 50, canvasMouseY + Math.sin(angle) * 50);
          ctx.lineTo(canvasMouseX + Math.cos(angle) * length, canvasMouseY + Math.sin(angle) * length);
        }
        ctx.stroke();

        ctx.globalAlpha = 1.0; // Reset alpha after stroke

        // Spawn manga text
        if (Math.random() < 0.1) {
          floatTexts.push(new FloatingText(canvasMouseX + (Math.random() - 0.5) * 150, canvasMouseY + (Math.random() - 0.5) * 150));
        }
      }

      // Draw Branches
      ctx.globalAlpha = isDomainExpansion ? 0.8 : (isLightMode ? 0.75 : 0.35); // Flash solid during domain; increase opacity in light mode for visibility
      const branchColor = isDomainExpansion ? "#ffffff" : tertiaryColor;
      const branchFont = "12px monospace";
      branches.forEach(b => {
        const swayX = Math.sin(time * 0.001 + b.depth) * b.depth * 0.5 + (gustWind * (b.depth + 1) * 0.6);
        const swayY = Math.cos(time * 0.001 + b.depth) * b.depth * 0.2;

        const bx = b.baseX + swayX;
        const by = b.baseY + swayY;
        const offset = getSlashOffset(bx, by);

        const glyph = getGlyphCanvas(b.char, branchColor, branchFont, 12);
        ctx.drawImage(glyph, bx + offset.x - glyph.width / 2, by + offset.y - glyph.height / 2);
      });

      // Draw Canopy
      ctx.globalAlpha = isDomainExpansion ? 0.9 : (isLightMode ? 0.85 : 0.55); // increase opacity in light mode for leaf visibility
      const canopyFont = 'bold 14px "Source Code Pro", monospace';
      canopy.forEach((c, idx) => {
        const gustSway = gustWind * 4.5;
        const flutterX = Math.sin(time * 0.002 + c.phase) * 2 + gustSway;
        const flutterY = Math.cos(time * 0.0015 + c.phase) * 2;
        const finalX = c.baseX + flutterX;
        const finalY = c.baseY + flutterY;

        let drawX = finalX;
        let drawY = finalY;

        if (!isDragging) {
          const dx = finalX - canvasMouseX;
          const dy = finalY - canvasMouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const push = (80 - dist) * 0.2;
            drawX += (dx / dist) * push;
            drawY += (dy / dist) * push;
          }
        }

        const offset = getSlashOffset(drawX, drawY);

        // Scramble to Katakana during Domain Expansion (deterministic matrix-like effect)
        const displayChar = isDomainExpansion
          ? KATAKANA[(Math.floor(time / 150) + idx) % KATAKANA.length]
          : is404Mode
          ? c.autumnChar
          : c.char;

        const leafColor = isDomainExpansion
          ? "#ff0044"
          : is404Mode
          ? c.autumnColor
          : c.color;
        const glyph = getGlyphCanvas(displayChar, leafColor, canopyFont, c.size);
        ctx.drawImage(glyph, drawX + offset.x - glyph.width / 2, drawY + offset.y - glyph.height / 2);
      });

      // Draw Slash Line Cut across the cut axis
      if (slashEffect.active && slashEffect.p1 && slashEffect.p2) {
        const lifeRatio = slashEffect.progress / slashEffect.maxLife;
        const dx = slashEffect.p2.x - slashEffect.p1.x;
        const dy = slashEffect.p2.y - slashEffect.p1.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const midX = (slashEffect.p1.x + slashEffect.p2.x) / 2;
        const midY = (slashEffect.p1.y + slashEffect.p2.y) / 2;
        const ext = Math.max(canvas.width, canvas.height) * 1.5;

        ctx.strokeStyle = is404Mode ? "#e11d48" : (isLightMode ? primaryColor : "#ffffff");
        ctx.lineWidth = 3.5 * (1 - lifeRatio);
        ctx.shadowBlur = 18;
        ctx.shadowColor = is404Mode ? "#f43f5e" : primaryColor;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(midX - ux * ext, midY - uy * ext);
        ctx.lineTo(midX + ux * ext, midY + uy * ext);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Spawn Petals
      const spawnRate = is404Mode ? 0.45 : (globalWind > 1.0 ? 0.6 : 0.3);
      if (!isDomainExpansion && Math.random() < spawnRate && canopy.length > 0) {
        const source = canopy[Math.floor(Math.random() * canopy.length)];
        fallingPetals.push(
          new FallingPetal(
            source.baseX,
            source.baseY,
            primaryColor,
            secondaryColor,
            isLightMode,
            is404Mode,
            source.char
          )
        );
      }

      // In 404 mode, canopy leaves continuously detach and fall vertically
      if (is404Mode && !isDomainExpansion && canopy.length > 0) {
        if (time - lastDecomposeTime > 110) {
          lastDecomposeTime = time;
          const leaf = canopy[Math.floor(Math.random() * canopy.length)];
          if (leaf) {
            fallingPetals.push(
              new FallingPetal(
                leaf.baseX,
                leaf.baseY,
                primaryColor,
                secondaryColor,
                isLightMode,
                true,
                leaf.autumnChar
              )
            );
          }
        }
      }

      // Update Falling Petals & Loot Drops
      ctx.globalAlpha = isDomainExpansion ? 0.8 : (isLightMode ? 0.75 : 0.5); // increase opacity in light mode
      for (let i = fallingPetals.length - 1; i >= 0; i--) {
        const p = fallingPetals[i];
        p.update(time, globalWind, gustWind, is404Mode);

        const dx = p.x - canvasMouseX;
        const dy = p.y - canvasMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // EASTER EGG 3: Loot Drop Trigger
        if (p.isShiny && dist < 30) {
          // Burst coins!
          for (let k = 0; k < 12; k++) {
            coins.push(new CoinParticle(p.x, p.y));
          }
          fallingPetals.splice(i, 1);
          continue;
        }

        if (dist < 120 && !isDomainExpansion) {
          const push = (120 - dist) * 0.05;
          p.x += (dx / dist) * push;
          p.y += (dy / dist) * push;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const roundedScale = Math.round(p.scale * 10) / 10;
        const petalSize = Math.round(16 * roundedScale);
        const petalFont = `bold ${petalSize}px "Source Code Pro", monospace`;
        const petalColor = p.isShiny ? "#FFD700" : (isDomainExpansion ? "#ff0044" : p.color);

        // Canvas shadow is slow, so we only apply it for rare shiny petals
        if (p.isShiny) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#FFD700";
        } else {
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
        }

        const glyph = getGlyphCanvas(p.char, petalColor, petalFont, petalSize);
        ctx.drawImage(glyph, -glyph.width / 2, -glyph.height / 2);
        ctx.restore();

        if (p.y > canvas.height + 50 || p.x > canvas.width + 50 || (p.isWithering && p.life <= 0)) {
          fallingPetals.splice(i, 1);
        }
      }

      // Update & Draw Coins
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.update(canvas.height);

        ctx.globalAlpha = Math.max(0, Math.min(1, c.life));
        const glyph = getGlyphCanvas(c.char, "#FFD700", "bold 18px monospace", 18);
        ctx.drawImage(glyph, c.x - glyph.width / 2, c.y - glyph.height / 2);

        if (c.life <= 0) coins.splice(i, 1);
      }
      ctx.globalAlpha = 1.0;

      // Update & Draw Manga Text
      for (let i = floatTexts.length - 1; i >= 0; i--) {
        const ft = floatTexts[i];
        ft.update();

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.life);

        if (ft.isGiant) {
          ctx.translate(ft.x, ft.y);
          if (ft.angle !== undefined) ctx.rotate(ft.angle);

          // Violent shake effect for impact
          const shakeX = (Math.random() - 0.5) * 12 * ft.life;
          const shakeY = (Math.random() - 0.5) * 12 * ft.life;

          ctx.fillStyle = "#ffffff"; // Bold white kanji
          ctx.font = `bold 100px "Source Code Pro", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Outline for theme compliance (No blue in 404 mode)
          ctx.strokeStyle = is404Mode ? "#e11d48" : primaryColor;
          ctx.lineWidth = 8;
          ctx.strokeText(ft.text, shakeX, shakeY);
          ctx.fillText(ft.text, shakeX, shakeY);

          if (ft.subText) {
            ctx.font = `bold 18px monospace`;
            ctx.fillStyle = is404Mode ? "#fca5a5" : "#fda4af";
            ctx.fillText(ft.subText, shakeX, shakeY + 54);
          }
        } else {
          ctx.fillStyle = is404Mode ? "#f59e0b" : textColor;
          ctx.font = `bold 24px monospace`;
          ctx.fillText(ft.text, ft.x, ft.y);
        }
        ctx.restore();

        if (ft.life <= 0) floatTexts.splice(i, 1);
      }

      // Invert half plane divided by slash line (dramatic impact effect)
      if (flashTime > 0 && slashEffect.p1 && slashEffect.p2) {
        const canvasPoly = clipRectWithHalfPlane(
          slashEffect.p1,
          slashEffect.p2,
          canvas.width,
          canvas.height
        );
        if (canvasPoly && canvasPoly.length >= 3) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(canvasPoly[0].x, canvasPoly[0].y);
          for (let pi = 1; pi < canvasPoly.length; pi++) {
            ctx.lineTo(canvasPoly[pi].x, canvasPoly[pi].y);
          }
          ctx.closePath();

          // Apply difference composite mode to mathematically invert pixels
          ctx.globalCompositeOperation = "difference";
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.restore();
        }
        flashTime--;
      }

      ctx.restore(); // Restore canvas context after drawing everything (including bisection flash)

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (isPointerDown) {
        const dist = Math.hypot(mouseX - startPointerX, mouseY - startPointerY);
        if (dist > 8) {
          isDragging = true;
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const canvasX = centerX + (mouseX - centerX) / currentZoom;
          const canvasY = centerY + (mouseY - centerY) / currentZoom;
          dragPoints.push({ x: canvasX, y: canvasY });
          if (dragPoints.length > 50) dragPoints.shift(); // Limit path size
          dragScreenPoints.push({ x: e.clientX, y: e.clientY });
          if (dragScreenPoints.length > 50) dragScreenPoints.shift();
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        typeof target.closest === "function" &&
        (target.closest(
          "button, a, input, textarea, select, [role='button'], [role='link']"
        ) ||
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT")
      ) {
        return;
      }

      isPointerDown = true;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      isDragging = false;
      dragPoints = [];
      dragScreenPoints = [{ x: e.clientX, y: e.clientY }];

      // Temporarily disable text selection highlights globally during active mouse hold/drag
      const body = document.body;
      if (body) {
        body.style.userSelect = "none";
        body.style.webkitUserSelect = "none";
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const canvasX = centerX + (mouseX - centerX) / currentZoom;
      const canvasY = centerY + (mouseY - centerY) / currentZoom;
      dragPoints.push({ x: canvasX, y: canvasY });
    };

    const handleMouseUp = () => {
      // Re-enable text selection highlights on mouse release
      const body = document.body;
      if (body) {
        body.style.userSelect = "";
        body.style.webkitUserSelect = "";
      }

      if (isDragging) {
        justDraggedTime = Date.now();
      }

      if (isDragging && dragPoints.length >= 2) {
        const p1 = dragPoints[0];
        const p2 = dragPoints[dragPoints.length - 1];
        const slashDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        if (slashDist > 40) {
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          if (is404Mode) {
            // In 404 mode: Slash effect MUST NOT happen, trigger error state
            triggerSlashBlockedError(midX, midY);
          } else {
            // Trigger visual slash effect
            slashEffect = {
              active: true,
              p1: p1,
              p2: p2,
              progress: 0,
              maxLife: 20
            };
            flashTime = 8;

            // Trigger dramatic one-side-of-cut impact flash on DOM overlay
            const screenP1 = dragScreenPoints[0] || p1;
            const screenP2 = dragScreenPoints[dragScreenPoints.length - 1] || p2;
            triggerHalfPlaneSlash(screenP1, screenP2);

            // Spawn giant manga slash kanji/effects at the center of the slash path
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

            floatTexts.push(new FloatingText(
              midX,
              midY,
              ["斬", "ザシュッ", "SLASH!", "ズバァッ!"][Math.floor(Math.random() * 4)],
              true,
              angle
            ));
          }
        }
      }

      isPointerDown = false;
      isDragging = false;
      dragPoints = [];
      dragScreenPoints = [];
    };

    const toggleDomainStyle = (active: boolean) => {
      const root = document.documentElement;
      if (active) {
        root.style.setProperty("--primary", "#ff0044");
        root.style.setProperty("--secondary", "#ff4d6d");
        root.style.setProperty("--teritiary", "#990028");
        root.style.setProperty("--background", "#0d0407");
        root.style.setProperty("--textColor", "#ffffff");
        root.style.setProperty("--muted-textColor", "#fda4af");
        root.style.setProperty(
          "--image-filter",
          "hue-rotate(140deg) saturate(2.4) brightness(0.95)"
        );
      } else {
        root.style.removeProperty("--primary");
        root.style.removeProperty("--secondary");
        root.style.removeProperty("--teritiary");
        root.style.removeProperty("--background");
        root.style.removeProperty("--textColor");
        root.style.removeProperty("--muted-textColor");
        root.style.removeProperty("--image-filter");
      }
      updateColors();
    };

    const handleMouseClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (Date.now() - justDraggedTime < 350) return;

      // Prevent clicks on UI controls, sections, cards, links, or buttons from triggering Domain Expansion
      const target = e.target as HTMLElement | null;
      if (
        target &&
        typeof target.closest === "function" &&
        (target.closest(
          "button, a, input, textarea, select, [role='button'], [role='link'], [data-interactive], #experience, #projects, #about, #skills, #home, nav, footer, header"
        ) ||
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT")
      ) {
        return;
      }

      const mx = e.clientX;
      const my = e.clientY;
      const inCanopyBounds = mx > 0 && mx < window.innerWidth * 0.4 && my > window.innerHeight * 0.2 && my < window.innerHeight * 0.8;

      if (inCanopyBounds) {
        if (is404Mode) {
          triggerDomainBlockedError(mx, my);
          return;
        }
        isDomainExpansion = !isDomainExpansion; // Toggle it
      } else {
        isDomainExpansion = false; // Clicking anywhere else turns it off
      }
      toggleDomainStyle(isDomainExpansion);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          typeof target.closest === "function" &&
          (target.closest(
            "button, a, input, textarea, select, [role='button'], [role='link']"
          ) ||
            target.tagName === "BUTTON" ||
            target.tagName === "A" ||
            target.tagName === "INPUT")
        ) {
          return;
        }

        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        startPointerX = touch.clientX;
        startPointerY = touch.clientY;
        isPointerDown = true;
        isDragging = false;
        dragPoints = [];
        dragScreenPoints = [{ x: touch.clientX, y: touch.clientY }];

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const canvasX = centerX + (mouseX - centerX) / currentZoom;
        const canvasY = centerY + (mouseY - centerY) / currentZoom;
        dragPoints.push({ x: canvasX, y: canvasY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        if (isPointerDown) {
          const dist = Math.hypot(mouseX - startPointerX, mouseY - startPointerY);
          if (dist > 12) {
            isDragging = true;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const canvasX = centerX + (mouseX - centerX) / currentZoom;
            const canvasY = centerY + (mouseY - centerY) / currentZoom;
            dragPoints.push({ x: canvasX, y: canvasY });
            if (dragPoints.length > 50) dragPoints.shift();
            dragScreenPoints.push({ x: touch.clientX, y: touch.clientY });
            if (dragScreenPoints.length > 50) dragScreenPoints.shift();
          }
        }
      }
    };

    const handleTouchEnd = () => {
      handleMouseUp();
    };

    const handleScroll = () => {
      // Cancel active drag immediately when the user scrolls so scrolling never registers as a slash
      if (isPointerDown || isDragging) {
        isPointerDown = false;
        isDragging = false;
        dragPoints = [];
        dragScreenPoints = [];
      }
    };

    let lastSweepTime = 0;

    const handle404Mode = (e: Event) => {
      const ce = e as CustomEvent<{ active?: boolean }>;
      const nextMode = ce.detail?.active ?? true;
      if (is404Mode !== nextMode) {
        is404Mode = nextMode;
        // Never wipe or re-create the tree! It is global for the entire session across all pages and states.
        if (!is404Mode) {
          // Returning to normal page: sweep all lingering 404 leaves away with the wind so none fall awkwardly in the corner
          gustWind = Math.max(gustWind, 8.0);
          fallingPetals.forEach((p) => {
            p.sweepWithWind(7.5);
          });
          const now = Date.now();
          if (now - lastSweepTime >= 600 && canopy.length > 0) {
            lastSweepTime = now;
            for (let i = 0; i < 35; i++) {
              const source = canopy[Math.floor(Math.random() * canopy.length)];
              const newPetal = new FallingPetal(
                source.baseX + (Math.random() - 0.2) * 90,
                source.baseY + (Math.random() - 0.5) * 110,
                primaryColor,
                secondaryColor,
                isLightMode,
                false,
                source.char
              );
              newPetal.sweepWithWind(7.5);
              newPetal.x += (Math.random() - 0.4) * 60;
              fallingPetals.push(newPetal);
            }
          }
        } else if (is404Mode && fallingPetals.length < 15 && canopy.length > 0) {
          for (let i = 0; i < 15; i++) {
            const source = canopy[Math.floor(Math.random() * canopy.length)];
            fallingPetals.push(
              new FallingPetal(
                source.baseX + (Math.random() - 0.2) * (canvas.width * 0.45),
                Math.random() * canvas.height,
                primaryColor,
                secondaryColor,
                isLightMode,
                true,
                source.autumnChar
              )
            );
          }
        }
      }
    };

    const handleSweep404Leaves = (e: Event) => {
      const ce = e as CustomEvent<{ strength?: number; spawnCount?: number }>;
      const strength = ce.detail?.strength ?? 8.5;
      const count = ce.detail?.spawnCount ?? 35;
      gustWind = Math.max(gustWind, strength);
      is404Mode = false;

      // Immediately sweep all existing withering leaves into horizontal flight
      fallingPetals.forEach((p) => {
        p.sweepWithWind(strength);
      });

      const now = Date.now();
      if (now - lastSweepTime < 600) return;
      lastSweepTime = now;

      // Spawn a flurry of fresh normal leaves to ride the wind along with the swept leaves
      if (canopy.length > 0) {
        for (let i = 0; i < count; i++) {
          const source = canopy[Math.floor(Math.random() * canopy.length)];
          const newPetal = new FallingPetal(
            source.baseX + (Math.random() - 0.2) * 90,
            source.baseY + (Math.random() - 0.5) * 110,
            primaryColor,
            secondaryColor,
            isLightMode,
            false,
            source.char
          );
          newPetal.sweepWithWind(strength);
          newPetal.x += (Math.random() - 0.4) * 60;
          fallingPetals.push(newPetal);
        }
      }
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newW = window.innerWidth;
        const newH = window.innerHeight;
        if (canvas.width !== newW || canvas.height !== newH) {
          canvas.width = newW;
          canvas.height = newH;
          syncTreeFromGlobal();
          updateColors();
        }
      }, 150);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDomainExpansion) {
        isDomainExpansion = false;
        toggleDomainStyle(false);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => {
      updateColors();
    };
    mediaQuery.addEventListener("change", handleThemeChange);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("click", handleMouseClick);
    window.addEventListener("keydown", handleKeyDown);

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("tree:gust", handleTreeGust);
    window.addEventListener("tree:slash", handleTreeSlash);
    window.addEventListener("tree:404_mode", handle404Mode);
    window.addEventListener("tree:sweep_404_leaves", handleSweep404Leaves);

    const checkIs404 = () => {
      if (typeof window === "undefined") return false;
      const path = window.location.pathname;
      if (path.includes("404") || path.includes("not-found")) return true;
      if (document.title.includes("404")) return true;
      if (document.querySelector("[data-page-404]")) return true;
      return false;
    };

    if (checkIs404()) {
      is404Mode = true;
    }

    init();
    animate();

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("click", handleMouseClick);
      window.removeEventListener("keydown", handleKeyDown);

      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("tree:gust", handleTreeGust);
      window.removeEventListener("tree:slash", handleTreeSlash);
      window.removeEventListener("tree:404_mode", handle404Mode);
      window.removeEventListener("tree:sweep_404_leaves", handleSweep404Leaves);

      if (flashFadeTimer) clearTimeout(flashFadeTimer);
      if (flashCleanTimer) clearTimeout(flashCleanTimer);
      cancelAnimationFrame(animationFrameId);

      // Reset body styles and domain theme overrides to prevent leaks
      const root = document.documentElement;
      const body = document.body;
      if (root) {
        root.style.filter = "";
        root.style.transition = "";
      }
      if (body) {
        body.style.filter = "";
        body.style.transition = "";
        body.style.userSelect = "";
        body.style.webkitUserSelect = "";
      }
      toggleDomainStyle(false);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10 opacity-90"
        style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
      />
      <div
        ref={flashOverlayRef}
        className="fixed inset-0 pointer-events-none z-[9990] transition-opacity duration-300 opacity-0"
        style={{ willChange: "clip-path, opacity, filter" }}
      />
    </>
  );
}
