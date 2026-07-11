"use client";

import { useEffect, useRef } from "react";

const LEAF_CHARS = ["*", "~", "+", ".", "S", "E", "D", "H", "E", "✿", "❀", "🌸"];
const BARK_CHARS = ["=", "#", "*", ":", "-", "░", "▒"];
const KATAKANA = ["ゴ", "ド", "バ", "オ", "ア", "メ", "シ", "キ", "ム", "ラ"];
const COIN_CHARS = ["$", "¢", "♦", "©", "O", "●"];
const MANGA_WORDS = ["WHOOSH!", "SLASH!", "ゴゴゴゴ", "ズズズ", "BAM!"];

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
  phase: number;
  size: number;
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

  constructor(x: number, y: number, text?: string, isGiant?: boolean, angle?: number) {
    this.x = x;
    this.y = y;
    this.text = text || MANGA_WORDS[Math.floor(Math.random() * MANGA_WORDS.length)];
    this.life = 1.0;
    this.isGiant = isGiant;
    this.angle = angle;
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

  constructor(startX: number, startY: number, color1: string, color2: string) {
    this.x = startX;
    this.y = startY;
    this.char = LEAF_CHARS[Math.floor(Math.random() * LEAF_CHARS.length)];
    this.color = Math.random() > 0.5 ? color1 : color2;
    this.phase = Math.random() * Math.PI * 2;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.speedX = Math.random() * 2.0 + 1.5;
    this.scale = Math.random() * 0.8 + 0.8;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.05;

    // 2% chance to be a rare "Loot Drop" shiny petal
    this.isShiny = Math.random() < 0.02;
  }

  update(time: number, globalWind: number) {
    // If Domain Expansion is active, wind is 0, freeze movement mostly
    this.x += this.speedX * (globalWind > 0 ? 1 : 0) + globalWind + Math.sin(time * 0.001 + this.phase) * 2.5;
    this.y += this.speedY * (globalWind > 0 ? 1 : 0.1) + Math.cos(time * 0.002 + this.phase) * 1.5;
    this.rotation += this.rotSpeed;
  }
}

export function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    let slashEffect: {
      active: boolean;
      p1: { x: number; y: number } | null;
      p2: { x: number; y: number } | null;
      progress: number;
      maxLife: number;
    } = { active: false, p1: null, p2: null, progress: 0, maxLife: 25 };
    let flashTime = 0;

    let mouseX = -1000;
    let mouseY = -1000;
    let isDragging = false;
    let isDomainExpansion = false;
    let currentZoom = 1.0;

    let primaryColor = "#05acff";
    let secondaryColor = "#ade1ff";
    let tertiaryColor = "#036799";
    let textColor = "#ffffff";
    let isLightMode = false;

    const updateColors = () => {
      const style = getComputedStyle(document.documentElement);
      const p = style.getPropertyValue("--primary").trim();
      const s = style.getPropertyValue("--secondary").trim();
      const t = style.getPropertyValue("--teritiary").trim();
      const txt = style.getPropertyValue("--textColor").trim();
      const bg = style.getPropertyValue("--background").trim();

      isLightMode = bg === "#fff" || bg === "#ffffff" || bg.includes("255, 255, 255") || txt === "#121212";

      if (p) primaryColor = p;
      if (s) secondaryColor = s;
      if (t) tertiaryColor = t;
      if (txt) textColor = txt;
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
      const displacement = Math.sin(lifeRatio * Math.PI) * 45; // 45px peak visual shear displacement

      const side = cross >= 0 ? 1 : -1;
      return {
        x: nx * displacement * side,
        y: ny * displacement * side
      };
    };

    const buildTree = (x: number, y: number, length: number, angle: number, depth: number, maxDepth: number, branchWidth: number) => {
      if (depth > maxDepth) return;
      const stepSize = 12;
      const steps = Math.floor(length / stepSize);
      for (let i = 0; i < steps; i++) {
        const bx = x + Math.cos(angle) * (i * stepSize);
        const by = y + Math.sin(angle) * (i * stepSize);
        const currentWidth = branchWidth * (1 - (i / steps) * 0.5);
        const numChars = Math.max(0, Math.floor(currentWidth / 4)); // Thicker branches

        for (let w = -numChars; w <= numChars; w++) {
          const jitterX = (Math.random() - 0.5) * 4;
          const jitterY = (Math.random() - 0.5) * 4;
          const wx = bx + Math.cos(angle + Math.PI / 2) * w * 8 + jitterX;
          const wy = by + Math.sin(angle + Math.PI / 2) * w * 8 + jitterY;
          branches.push({
            x: wx,
            y: wy,
            baseX: wx,
            baseY: wy,
            char: BARK_CHARS[Math.floor(Math.random() * BARK_CHARS.length)],
            color: tertiaryColor,
            depth: depth,
            size: 12
          });
        }
      }

      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;

      if (depth >= maxDepth - 2 || depth === 0) {
        const isEnd = depth === maxDepth;
        const isMobile = canvas.width < 768;
        
        // Scale leaf count down on mobile to avoid lag and squishing
        const numLeaves = isEnd 
          ? (isMobile ? 35 : 80) 
          : (depth === 0 ? (isMobile ? 20 : 40) : (isMobile ? 15 : 30));
        const spread = isEnd ? (isMobile ? 35 : 60) : (isMobile ? 15 : 30);
        
        for (let i = 0; i < numLeaves; i++) {
          const r1 = Math.random();
          const r2 = Math.random();
          const radius = spread * Math.sqrt(-2.0 * Math.log(r1)) * Math.cos(2.0 * Math.PI * r2) * 0.4;
          const theta = Math.random() * Math.PI * 2;
          const cx = endX + Math.cos(theta) * radius;
          const cy = endY + Math.sin(theta) * radius;

          canopy.push({
            baseX: cx,
            baseY: cy,
            char: LEAF_CHARS[Math.floor(Math.random() * LEAF_CHARS.length)],
            color: Math.random() > 0.4 ? primaryColor : secondaryColor,
            phase: Math.random() * Math.PI * 2,
            size: isMobile ? 11 : 14 // slightly smaller leaves for high pixel density mobile displays
          });
        }
      }

      if (depth < maxDepth) {
        const numBranches = depth === 0 ? 2 : (Math.random() > 0.3 ? 2 : 1);
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
              newAngle = angle + (Math.random() * 0.3 - 0.15);
              newLength = length * 0.8;
              newWidth = branchWidth * 0.8;
            } else {
              newAngle = angle + (Math.random() > 0.5 ? 0.4 : -0.4);
              newLength = length * 0.6;
              newWidth = branchWidth * 0.6;
            }
          }
          buildTree(endX, endY, newLength, newAngle, depth + 1, maxDepth, newWidth);
        }
      }
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateColors();
      branches = [];
      canopy = [];
      fallingPetals = [];
      coins = [];
      floatTexts = [];

      const isMobile = canvas.width < 768;
      const startX = -20;
      const startY = canvas.height * (isMobile ? 0.72 : 0.65); // lower down on mobile to clear text
      const initialLength = isMobile 
        ? Math.min(canvas.width * 0.45, 185) 
        : Math.min(canvas.width * 0.2, 280); 
      const initialAngle = -0.3;
      const initialWidth = isMobile ? 7 : 9;

      // depth 3 on mobile (much better performance and density), depth 4 on desktop
      buildTree(startX, startY, initialLength, initialAngle, 0, isMobile ? 3 : 4, initialWidth);
      buildTree(startX, startY + 20, initialLength * 0.5, 0.15, 0, isMobile ? 2 : 3, initialWidth * 0.7);
    };

    let startTime = Date.now();
    let lastTime = startTime;
    let dragTimeout: ReturnType<typeof setTimeout> | null = null;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() - startTime;
      const dt = time - (lastTime - startTime);
      lastTime = Date.now();

      // Update slash progress
      if (slashEffect.active) {
        slashEffect.progress++;
        if (slashEffect.progress >= slashEffect.maxLife) {
          slashEffect.active = false;
        }
      }

      // Physics Variables
      let globalWind = Math.sin(time * 0.0002) * 2.0 + 2.0;

      if (isDomainExpansion) {
        globalWind = 0; // Wind freezes
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // Darken background instantly
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Smooth Cinematic Zoom (Spikes on slash impact)
      const targetZoom = isDomainExpansion ? 1.15 : (slashEffect.active ? 1.25 : 1.0);
      currentZoom += (targetZoom - currentZoom) * 0.15; // Fast, punchy zoom interpolation

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
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2; // Thin drag trail line
        ctx.shadowBlur = 10;
        ctx.shadowColor = primaryColor;
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
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      branches.forEach(b => {
        const swayX = Math.sin(time * 0.001 + b.depth) * b.depth * 0.5;
        const swayY = Math.cos(time * 0.001 + b.depth) * b.depth * 0.2;

        const bx = b.baseX + swayX;
        const by = b.baseY + swayY;
        const offset = getSlashOffset(bx, by);

        // Invert colors during domain expansion
        ctx.fillStyle = isDomainExpansion ? "#ffffff" : b.color;
        ctx.fillText(b.char, bx + offset.x, by + offset.y);
      });

      // Draw Canopy
      ctx.globalAlpha = isDomainExpansion ? 0.9 : (isLightMode ? 0.85 : 0.55); // increase opacity in light mode for leaf visibility
      ctx.font = 'bold 14px "Source Code Pro", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      canopy.forEach((c, idx) => {
        const flutterX = Math.sin(time * 0.002 + c.phase) * 2;
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
          : c.char;

        ctx.fillStyle = isDomainExpansion ? "#ff0044" : c.color;
        ctx.fillText(displayChar, drawX + offset.x, drawY + offset.y);
      });

      // Draw Slash Line Cut
      if (slashEffect.active && slashEffect.p1 && slashEffect.p2) {
        const lifeRatio = slashEffect.progress / slashEffect.maxLife;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3 * (1 - lifeRatio); // Thin slash cut line
        ctx.shadowBlur = 15;
        ctx.shadowColor = primaryColor;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(slashEffect.p1.x, slashEffect.p1.y);
        ctx.lineTo(slashEffect.p2.x, slashEffect.p2.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Spawn Petals
      const spawnRate = globalWind > 1.0 ? 0.6 : 0.3;
      if (!isDomainExpansion && Math.random() < spawnRate && canopy.length > 0) {
        const source = canopy[Math.floor(Math.random() * canopy.length)];
        fallingPetals.push(new FallingPetal(source.baseX, source.baseY, primaryColor, secondaryColor));
      }

      // Update Falling Petals & Loot Drops
      ctx.globalAlpha = isDomainExpansion ? 0.8 : (isLightMode ? 0.75 : 0.5); // increase opacity in light mode
      for (let i = fallingPetals.length - 1; i >= 0; i--) {
        const p = fallingPetals[i];
        p.update(time, globalWind);

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

        // Shiny glow logic with shadow cleanup
        if (p.isShiny) {
          ctx.fillStyle = "#FFD700"; // Golden shiny color
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#FFD700";
        } else {
          ctx.fillStyle = isDomainExpansion ? "#ff0044" : p.color;
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
        }

        ctx.font = `bold ${16 * p.scale}px "Source Code Pro", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, 0, 0);
        ctx.restore();

        if (p.y > canvas.height + 50 || p.x > canvas.width + 50) {
          fallingPetals.splice(i, 1);
        }
      }

      // Update & Draw Coins
      ctx.globalAlpha = 1.0;
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.update(canvas.height);

        ctx.fillStyle = `rgba(255, 215, 0, ${c.life})`; // Gold fading
        ctx.font = `bold 18px monospace`;
        ctx.fillText(c.char, c.x, c.y);

        if (c.life <= 0) coins.splice(i, 1);
      }

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

          // Primary color outline for theme compliance
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 8;
          ctx.strokeText(ft.text, shakeX, shakeY);
          ctx.fillText(ft.text, shakeX, shakeY);
        } else {
          ctx.fillStyle = textColor;
          ctx.font = `bold 24px monospace`;
          ctx.fillText(ft.text, ft.x, ft.y);
        }
        ctx.restore();

        if (ft.life <= 0) floatTexts.splice(i, 1);
      }

      // Invert half plane divided by slash line (dramatic impact effect)
      if (flashTime > 0 && slashEffect.p1 && slashEffect.p2) {
        ctx.save();
        ctx.beginPath();
        // Move along slash line
        ctx.moveTo(slashEffect.p1.x, slashEffect.p1.y);
        ctx.lineTo(slashEffect.p2.x, slashEffect.p2.y);

        // Expand path along normal to cover half of screen
        const dy = slashEffect.p2.y - slashEffect.p1.y;
        const dx = slashEffect.p2.x - slashEffect.p1.x;
        const nx = -dy * 100;
        const ny = dx * 100;

        ctx.lineTo(slashEffect.p2.x + nx, slashEffect.p2.y + ny);
        ctx.lineTo(slashEffect.p1.x + nx, slashEffect.p1.y + ny);
        ctx.closePath();

        // Apply difference composite mode to mathematically invert pixels
        ctx.globalCompositeOperation = "difference";
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();
        flashTime--;
      }

      ctx.restore(); // Restore canvas context after drawing everything (including bisection flash)

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (isDragging) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const canvasX = centerX + (mouseX - centerX) / currentZoom;
        const canvasY = centerY + (mouseY - centerY) / currentZoom;
        dragPoints.push({ x: canvasX, y: canvasY });
        if (dragPoints.length > 40) dragPoints.shift(); // Limit path size
      }
    };

    const handleMouseDown = () => {
      dragPoints = [];

      // Temporarily disable text selection highlights globally during active mouse hold/drag
      const body = document.body;
      if (body) {
        body.style.userSelect = "none";
        body.style.webkitUserSelect = "none";
      }

      if (dragTimeout) clearTimeout(dragTimeout);
      dragTimeout = setTimeout(() => {
        isDragging = true;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const canvasX = centerX + (mouseX - centerX) / currentZoom;
        const canvasY = centerY + (mouseY - centerY) / currentZoom;
        dragPoints.push({ x: canvasX, y: canvasY });
      }, 300); // 300ms delay for click-and-hold speedlines
    };
    const handleMouseUp = () => {
      if (dragTimeout) {
        clearTimeout(dragTimeout);
        dragTimeout = null;
      }

      // Re-enable text selection highlights on mouse release
      const body = document.body;
      if (body) {
        body.style.userSelect = "";
        body.style.webkitUserSelect = "";
      }

      if (isDragging && dragPoints.length > 2) {
        const p1 = dragPoints[0];
        const p2 = dragPoints[dragPoints.length - 1];

        // Trigger visual slash effect
        slashEffect = {
          active: true,
          p1: p1,
          p2: p2,
          progress: 0,
          maxLife: 30
        };
        flashTime = 6;

        // Spawn giant manga slash kanji/effects at the center of the slash path
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

        floatTexts.push(new FloatingText(
          midX,
          midY,
          ["斬", "ザシュッ", "SLASH!", "ズバァッ!"][Math.floor(Math.random() * 4)],
          true,
          angle
        ));

        // Trigger dramatic full-screen CSS filter impact flash
        if (body) {
          body.style.transition = "none";
          body.style.filter = "grayscale(100%) invert(100%) contrast(200%)";

          setTimeout(() => {
            body.style.transition = "filter 0.8s cubic-bezier(0.1, 0.8, 0.25, 1)";
            body.style.filter = "none";
          }, 150);
        }
      }

      isDragging = false;
      dragPoints = [];
    };

    const toggleDomainStyle = (active: boolean) => {
      const root = document.documentElement;
      if (active) {
        root.style.setProperty("--primary", "#ff0044");
        root.style.setProperty("--secondary", "#ff6688");
        root.style.setProperty("--teritiary", "#990028");
        root.style.setProperty("--image-filter", "hue-rotate(130deg) saturate(1.8) contrast(0.8) brightness(0.8)");
      } else {
        root.style.removeProperty("--primary");
        root.style.removeProperty("--secondary");
        root.style.removeProperty("--teritiary");
        root.style.removeProperty("--image-filter");
      }
      updateColors();
    };

    const handleMouseClick = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      const inCanopyBounds = mx > 0 && mx < window.innerWidth * 0.4 && my > window.innerHeight * 0.2 && my < window.innerHeight * 0.8;

      if (inCanopyBounds) {
        isDomainExpansion = !isDomainExpansion; // Toggle it
      } else {
        isDomainExpansion = false; // Clicking anywhere else turns it off
      }
      toggleDomainStyle(isDomainExpansion);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        handleMouseDown();
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        if (isDragging) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const canvasX = centerX + (mouseX - centerX) / currentZoom;
          const canvasY = centerY + (mouseY - centerY) / currentZoom;
          dragPoints.push({ x: canvasX, y: canvasY });
          if (dragPoints.length > 40) dragPoints.shift();
        }
      }
    };

    const handleTouchEnd = () => {
      handleMouseUp();
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleMouseClick);
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleMouseClick);
      
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      
      if (dragTimeout) clearTimeout(dragTimeout);
      cancelAnimationFrame(animationFrameId);

      // Reset body styles and domain theme overrides to prevent leaks
      const body = document.body;
      if (body) {
        body.style.filter = "";
        body.style.transition = "";
      }
      toggleDomainStyle(false);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 opacity-90"
    />
  );
}
