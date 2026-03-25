"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

const CONFIG = {
  name: { first: "AHMED", middle: "OSAMA", last: "FATHY" },
  location: "Cairo 🇪🇬",
  roles: ["Frontend Developer", "React Specialist", "UI Craftsman", "Next.js Engineer"],
  stats: [
    { value: "3+",   label: "Projects"      },
    { value: "1yr",  label: "Experience"    },
    { value: "10k+", label: "Lines of Code" },
  ],
  buttons: {
    primary:   { label: "View Projects →", href: "#projects" },
    secondary: { 
      label: "Download CV", 
      href: "/cv/Ahmed Osama Frontend.pdf", 
      downloadName: "Ahmed-Osama-Frontend.pdf" 
    },
  },
};

interface TextPoint { x: number; y: number; }

function getTextPoints(text: string, offsetX: number, offsetY: number, size: number, density: number, canvasW: number): TextPoint[] {
  if (typeof document === 'undefined') return [];
  const tmp = document.createElement("canvas");
  tmp.width = canvasW;
  tmp.height = size * 1.5;
  const tc = tmp.getContext("2d")!;
  tc.fillStyle = "#fff";
  tc.font = `900 ${size}px Inter, system-ui, sans-serif`;
  tc.textBaseline = "top";
  tc.fillText(text, 0, 0);
  const data = tc.getImageData(0, 0, canvasW, tmp.height).data;
  const pts: TextPoint[] = [];
  for (let py = 0; py < tmp.height; py += density) {
    for (let px = 0; px < canvasW; px += density) {
      const i = (py * canvasW + px) * 4;
      if (data[i + 3] > 128) pts.push({ x: offsetX + px, y: offsetY + py });
    }
  }
  return pts;
}

class Particle {
  x: number; y: number; tx: number; ty: number;
  vx = 0; vy = 0; alpha = 0; size: number; color: string;
  delay: number; t = 0; baseSize: number;
  exploded = false; ex = 0; ey = 0;

  constructor(tx: number, ty: number, color: string, W: number, H: number) {
    this.tx = tx; this.ty = ty;
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.color = color;
    this.baseSize = Math.random() * 1.4 + 0.6;
    this.size = this.baseSize;
    this.delay = Math.random() * 60;
  }

  update(phase: number, mx: number, my: number, time: number, isMobile: boolean) {
    this.t++;
    if (this.t < this.delay) return;
    if (phase === 0 || phase === 1) {
      const dx = this.tx - this.x;
      const dy = this.ty - this.y;
      const mdx = this.x - mx;
      const mdy = this.y - my;
      const md = Math.sqrt(mdx * mdx + mdy * mdy);
      const distLimit = isMobile ? 60 : 90;
      if (md < distLimit && mx > 0) {
        const f = ((distLimit - md) / distLimit) * (isMobile ? 3 : 5);
        this.vx += (mdx / md) * f;
        this.vy += (mdy / md) * f;
      }
      this.vx += dx * 0.06; this.vy += dy * 0.06;
      this.vx *= 0.82; this.vy *= 0.82;
      this.x += this.vx; this.y += this.vy;
      this.alpha = Math.min(1, this.alpha + 0.04);
      this.size = this.baseSize + Math.sin(time * 0.05 + this.tx * 0.01) * 0.35;
    }
    if (phase === 2) {
      if (!this.exploded) {
        this.exploded = true;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isMobile ? 6 : 9) + 2;
        this.ex = Math.cos(angle) * speed;
        this.ey = Math.sin(angle) * speed - 3;
      }
      this.x += this.ex; this.y += this.ey;
      this.ey += 0.18; this.alpha -= 0.022; this.size *= 0.97;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
    ctx.fill();
  }
}

function useRoleCycle(roles: string[]) {
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState(roles[0]);
  useEffect(() => {
    const iv = setInterval(() => {
      const next = (idx + 1) % roles.length;
      const chars = "!<>-_[]{}=+*^?#ABCDEFGHIJKLMNOP0123456789";
      let gi = 0;
      const giv = setInterval(() => {
        setDisplay(roles[next].split("").map(c => Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : c).join(""));
        if (++gi > 6) { clearInterval(giv); setDisplay(roles[next]); setIdx(next); }
      }, 40);
    }, 3000);
    return () => clearInterval(iv);
  }, [idx, roles]);
  return { display };
}

export default function FullHeroParticle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const phaseRef = useRef(0);
  const mxRef = useRef(-1000);
  const myRef = useRef(-1000);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [uiVisible, setUiVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [nameVisible, setNameVisible] = useState([false, false, false]);
  const { display: roleDisplay } = useRoleCycle(CONFIG.roles);

  const buildParticles = (W: number, H: number, mobile: boolean) => {
    const pts: Particle[] = [];
    const density = mobile ? 4 : 3;
    const leftPad = mobile ? W * 0.08 : Math.min(W * 0.07, 64);
    const nameSize = mobile ? W * 0.15 : Math.min(W * 0.105, 108);
    const lineH = nameSize * 0.95;
    const names = [CONFIG.name.first, CONFIG.name.middle, CONFIG.name.last];
    const colors = ["#ffffff", "#c8dcff", "#00d4ff"];
    const startY = mobile ? H * 0.2 : H * 0.1;

    names.forEach((name, i) => {
      const textPts = getTextPoints(name, leftPad, startY + i * lineH, nameSize * 0.85, density, Math.floor(W * 0.9));
      textPts.forEach(pt => pts.push(new Particle(pt.x, pt.y, colors[i], W, H)));
    });
    particlesRef.current = pts;
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const hero = heroRef.current!;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      buildParticles(canvas.width, canvas.height, window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const loop = () => {
      timeRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        p.update(phaseRef.current, mxRef.current, myRef.current, timeRef.current, isMobile);
        p.draw(ctx);
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    setTimeout(() => setNameVisible([true, false, false]), 500);
    setTimeout(() => setNameVisible([true, true, false]), 850);
    setTimeout(() => setNameVisible([true, true, true]), 1200);
    setTimeout(() => { phaseRef.current = 1; setUiVisible(true); }, 1800);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", handleResize); };
  }, [isMobile]);

  const handleExplode = () => {
    if (phaseRef.current === 1) {
      phaseRef.current = 2;
      setTimeout(() => {
        buildParticles(canvasRef.current!.width, canvasRef.current!.height, isMobile);
        phaseRef.current = 0;
        setTimeout(() => phaseRef.current = 1, 1000);
      }, 1500);
    }
  };

  return (
    <section ref={heroRef} onClick={handleExplode} style={{ minHeight: "100vh", background: "#020617", position: "relative", overflow: "hidden", cursor: "pointer" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

      {/* UI Content - zIndex: 50 لضمان أنه فوق كل شيء */}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "0 20px" : "0 7vw", pointerEvents: "none" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: uiVisible ? 1 : 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 11, color: "#00d4ff", letterSpacing: "0.2em", marginBottom: 16 }}>AVAILABLE FOR HIRE · {CONFIG.location}</div>
          
          <div style={{ marginBottom: 24 }}>
            {[CONFIG.name.first, CONFIG.name.middle, CONFIG.name.last].map((word, i) => (
              <div key={i} style={{ fontSize: "clamp(48px, 10vw, 110px)", fontWeight: 900, lineHeight: 0.9, color: i === 2 ? "transparent" : "#fff", WebkitTextStroke: i === 2 ? "1.5px rgba(0,212,255,0.5)" : "none", opacity: nameVisible[i] ? 1 : 0 }}>
                {word}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", fontFamily: "monospace", marginBottom: 40 }}>
            <span style={{ color: "#00d4ff" }}>›</span> {roleDisplay}
          </div>

          <div style={{ display: "flex", gap: 12, pointerEvents: "all" }}>
            {/* View Projects Button */}
            <a 
              href={CONFIG.buttons.primary.href} 
              style={{ padding: "12px 24px", background: "#00d4ff", color: "#000", borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: "none", display: "inline-block", zIndex: 60 }}
            >
              {CONFIG.buttons.primary.label}
            </a>

            {/* Download CV Button */}
            <a 
              href={CONFIG.buttons.secondary.href} 
              download={CONFIG.buttons.secondary.downloadName}
              style={{ padding: "12px 24px", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 100, fontSize: 12, textDecoration: "none", display: "inline-block", zIndex: 60 }}
            >
              {CONFIG.buttons.secondary.label}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Image Overlay */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: isMobile ? "100%" : "42%", zIndex: 2, opacity: isMobile ? 0.2 : 1 }}>
        <Image src="/hero.jpeg" alt="Ahmed" fill style={{ objectFit: "cover", objectPosition: "center 20%" }} priority />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${isMobile ? 'to top' : 'to right'}, #020617, transparent)` }} />
      </div>
    </section>
  );
}