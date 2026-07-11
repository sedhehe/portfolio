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
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.text = MANGA_WORDS[Math.floor(Math.random() * MANGA_WORDS.length)];
    this.life = 1.0;
  }
  
  update() {
    this.y -= 1.5; // Rise up
    this.life -= 0.02; // Fade quickly
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
    
    let mouseX = -1000;
    let mouseY = -1000;
    let isDragging = false;
    let isDomainExpansion = false;
    let currentZoom = 1.0;
    
    let primaryColor = "#05acff";
    let secondaryColor = "#ade1ff";
    let tertiaryColor = "#036799";
    let textColor = "#ffffff";

    const updateColors = () => {
      const style = getComputedStyle(document.body);
      const p = style.getPropertyValue("--primary").trim();
      const s = style.getPropertyValue("--secondary").trim();
      const t = style.getPropertyValue("--teritiary").trim();
      const txt = style.getPropertyValue("--textColor").trim();
      
      if (p) primaryColor = p;
      if (s) secondaryColor = s;
      if (t) tertiaryColor = t;
      if (txt) textColor = txt;
    };
    
    const buildTree = (x: number, y: number, length: number, angle: number, depth: number, maxDepth: number, branchWidth: number) => {
      if (depth > maxDepth) return;
      const steps = Math.floor(length / 3); 
      for (let i = 0; i < steps; i++) {
        const bx = x + Math.cos(angle) * (i * 3);
        const by = y + Math.sin(angle) * (i * 3);
        const currentWidth = branchWidth * (1 - (i / steps) * 0.5);
        const numChars = Math.max(0, Math.floor(currentWidth / 3));
        
        for (let w = -numChars; w <= numChars; w++) {
          const jitterX = (Math.random() - 0.5) * 2;
          const jitterY = (Math.random() - 0.5) * 2;
          branches.push({
            x: bx + Math.cos(angle + Math.PI / 2) * w * 3 + jitterX,
            y: by + Math.sin(angle + Math.PI / 2) * w * 3 + jitterY,
            baseX: bx + Math.cos(angle + Math.PI / 2) * w * 3 + jitterX,
            baseY: by + Math.sin(angle + Math.PI / 2) * w * 3 + jitterY,
            char: BARK_CHARS[Math.floor(Math.random() * BARK_CHARS.length)],
            color: tertiaryColor,
            depth: depth,
            size: Math.random() * 4 + 10 
          });
        }
      }
      
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      
      if (depth >= maxDepth - 2 || depth === 0) {
        const isEnd = depth === maxDepth;
        const numLeaves = isEnd ? 150 : (depth === 0 ? 80 : 60); 
        const spread = isEnd ? 60 : 30; 
        for(let i = 0; i < numLeaves; i++) {
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
            size: Math.random() * 6 + 12 
          });
        }
      }
      
      if (depth < maxDepth) {
        const numBranches = depth === 0 ? 2 : (Math.random() > 0.3 ? 2 : 1);
        for(let i = 0; i < numBranches; i++) {
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
      
      const startX = -20; 
      const startY = canvas.height * 0.65; 
      const initialLength = Math.min(canvas.width * 0.2, 280); 
      const initialAngle = -0.3; 
      const initialWidth = 9; 
      
      buildTree(startX, startY, initialLength, initialAngle, 0, 5, initialWidth);
      buildTree(startX, startY + 20, initialLength * 0.5, 0.15, 0, 4, initialWidth * 0.7);
    };

    let startTime = Date.now();
    let lastTime = startTime;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() - startTime;
      const dt = time - (lastTime - startTime);
      lastTime = Date.now();
      
      // Physics Variables
      let globalWind = Math.sin(time * 0.0002) * 2.0 + 2.0;
      
      if (isDomainExpansion) {
        globalWind = 0; // Wind freezes
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // Darken background instantly
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Smooth Cinematic Zoom
      const targetZoom = isDomainExpansion ? 1.15 : 1.0;
      currentZoom += (targetZoom - currentZoom) * 0.2; // Fast, punchy zoom interpolation
      
      ctx.save();
      // Zoom from the center of the screen
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(currentZoom, currentZoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      
      // EASTER EGG 2: Manga Speedlines (Drag Mode)
      if (isDragging) {
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i=0; i<30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const length = Math.random() * canvas.width;
          ctx.moveTo(mouseX + Math.cos(angle)*50, mouseY + Math.sin(angle)*50);
          ctx.lineTo(mouseX + Math.cos(angle)*length, mouseY + Math.sin(angle)*length);
        }
        ctx.stroke();
        
        ctx.globalAlpha = 1.0; // Reset alpha after stroke
        
        // Spawn manga text
        if (Math.random() < 0.1) {
          floatTexts.push(new FloatingText(mouseX + (Math.random()-0.5)*150, mouseY + (Math.random()-0.5)*150));
        }
      }

      // Draw Branches
      ctx.globalAlpha = isDomainExpansion ? 0.8 : 0.35; // Flash solid during domain
      branches.forEach(b => {
        const swayX = Math.sin(time * 0.001 + b.depth) * b.depth * 0.5; 
        const swayY = Math.cos(time * 0.001 + b.depth) * b.depth * 0.2;
        
        // Invert colors during domain expansion
        ctx.fillStyle = isDomainExpansion ? "#ffffff" : b.color;
        ctx.font = `${b.size}px monospace`; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.char, b.baseX + swayX, b.baseY + swayY);
      });
      
      // Draw Canopy
      ctx.globalAlpha = isDomainExpansion ? 0.9 : 0.55; 
      canopy.forEach(c => {
        const flutterX = Math.sin(time * 0.002 + c.phase) * 2;
        const flutterY = Math.cos(time * 0.0015 + c.phase) * 2;
        const finalX = c.baseX + flutterX;
        const finalY = c.baseY + flutterY;
        
        let drawX = finalX;
        let drawY = finalY;
        
        if (!isDragging) {
          const dx = finalX - mouseX;
          const dy = finalY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const push = (80 - dist) * 0.2;
            drawX += (dx / dist) * push;
            drawY += (dy / dist) * push;
          }
        }
        
        // Scramble to Katakana during Domain Expansion
        const displayChar = isDomainExpansion 
           ? KATAKANA[Math.floor(Math.random() * KATAKANA.length)]
           : c.char;

        ctx.fillStyle = isDomainExpansion ? "#ff0044" : c.color;
        ctx.font = `bold ${c.size}px "Source Code Pro", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(displayChar, drawX, drawY);
      });
      
      // Spawn Petals
      const spawnRate = globalWind > 1.0 ? 0.6 : 0.3; 
      if (!isDomainExpansion && Math.random() < spawnRate && canopy.length > 0) {
        const source = canopy[Math.floor(Math.random() * canopy.length)];
        fallingPetals.push(new FallingPetal(source.baseX, source.baseY, primaryColor, secondaryColor));
      }
      
      // Update Falling Petals & Loot Drops
      ctx.globalAlpha = isDomainExpansion ? 0.8 : 0.5;
      for (let i = fallingPetals.length - 1; i >= 0; i--) {
        const p = fallingPetals[i];
        p.update(time, globalWind);
        
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // EASTER EGG 3: Loot Drop Trigger
        if (p.isShiny && dist < 30) {
          // Burst coins!
          for(let k = 0; k < 12; k++) {
            coins.push(new CoinParticle(p.x, p.y));
          }
          fallingPetals.splice(i, 1);
          continue;
        }

        // Manga Drag Attraction
        if (isDragging) {
          p.x += -dx * 0.05; // Suck into cursor
          p.y += -dy * 0.05;
        } else if (dist < 120 && !isDomainExpansion) {
          const push = (120 - dist) * 0.05;
          p.x += (dx / dist) * push;
          p.y += (dy / dist) * push;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        // Shiny glow logic
        if (p.isShiny) {
          ctx.fillStyle = "#FFD700"; // Golden shiny color
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#FFD700";
        } else {
          ctx.fillStyle = isDomainExpansion ? "#ff0044" : p.color;
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
        
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillStyle = textColor;
        ctx.font = `bold 24px monospace`;
        ctx.fillText(ft.text, ft.x, ft.y);
        
        if (ft.life <= 0) floatTexts.splice(i, 1);
      }

      ctx.restore(); // Restore canvas context after drawing everything
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleMouseDown = () => { isDragging = true; };
    const handleMouseUp = () => { isDragging = false; };
    
    const handleMouseClick = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      const inCanopyBounds = mx > 0 && mx < window.innerWidth * 0.4 && my > window.innerHeight * 0.2 && my < window.innerHeight * 0.8;
      
      if (inCanopyBounds) {
        isDomainExpansion = !isDomainExpansion; // Toggle it
      } else {
        isDomainExpansion = false; // Clicking anywhere else turns it off
      }
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleMouseClick);
    
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleMouseClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 opacity-90"
    />
  );
}
