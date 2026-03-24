"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

// ══════════════════════════════════════════════════════════════
//  ✏️  CONFIG — Full customization
// ══════════════════════════════════════════════════════════════
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
    secondary: { label: "Download CV", href: "/cv/ahmed-osama.pdf", download: true },
  },
};

// ── Types ─────────────────────────────────────────────────────
interface TextPoint { x: number; y: number; }

// ── Get text pixel coords (Core Logic) ────────────────────────
function getTextPoints(
  text: string,
  offsetX: number,
  offsetY: number,
  size: number,
  density: number,
  canvasW: number
): TextPoint[] {
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

// ── Particle Engine ────────────────────────────────────────────
class Particle {
  x: number; y: number;
  tx: number; ty: number;
  vx = 0; vy = 0;
  alpha = 0;
  size: number;
  color: string;
  delay: number;
  t = 0;
  baseSize: number;
  exploded = false;
  ex = 0; ey = 0;

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
      this.vx += dx * 0.06;
      this.vy += dy * 0.06;
      this.vx *= 0.82;
      this.vy *= 0.82;
      this.x += this.vx;
      this.y += this.vy;
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
      this.x += this.ex;
      this.y += this.ey;
      this.ey += 0.18;
      this.alpha -= 0.022;
      this.size *= 0.97;
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

// ── Role Cycling Hook ──────────────────────────────────────────
function useRoleCycle(roles: string[]) {
  const [idx, setIdx] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [display, setDisplay] = useState(roles[0]);

  useEffect(() => {
    const iv = setInterval(() => {
      const next = (idx + 1) % roles.length;
      setGlitching(true);
      const chars = "!<>-_[]{}=+*^?#ABCDEFGHIJKLMNOP0123456789";
      let gi = 0;
      const giv = setInterval(() => {
        setDisplay(roles[next].split("").map(c =>
          Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : c
        ).join(""));
        if (++gi > 6) {
          clearInterval(giv);
          setDisplay(roles[next]);
          setGlitching(false);
          setIdx(next);
        }
      }, 40);
    }, 3000);
    return () => clearInterval(iv);
  }, [idx, roles]);

  return { display, glitching };
}

// ── Main Responsive Hero ───────────────────────────────────────
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
  const { display: roleDisplay, glitching } = useRoleCycle(CONFIG.roles);

  const buildParticles = (W: number, H: number, mobile: boolean) => {
    const pts: Particle[] = [];
    const density = mobile ? 4 : 3;
    const leftPad = mobile ? W * 0.08 : Math.min(W * 0.07, 64);
    const nameSize = mobile ? W * 0.15 : Math.min(W * 0.105, 108);
    const lineH = nameSize * 0.95;
    const names = [CONFIG.name.first, CONFIG.name.middle, CONFIG.name.last];
    const colors = ["rgba(255,255,255,0.92)", "rgba(200,220,255,0.88)", "rgba(0,212,255,0.92)"];
    const startY = mobile ? H * 0.2 : H * 0.1;

    names.forEach((name, i) => {
      const textPts = getTextPoints(name, leftPad, startY + i * lineH, nameSize * 0.85, density, Math.floor(W * 0.9));
      textPts.forEach(pt => pts.push(new Particle(pt.x, pt.y, colors[i], W, H)));
    });

    if (!mobile) {
      for (let i = 0; i < 140; i++) {
        const p = new Particle(W * 0.55 + Math.random() * W * 0.45, Math.random() * H, `rgba(0,212,255,${(Math.random() * 0.2 + 0.04)})`, W, H);
        p.tx = p.x; p.ty = p.y;
        pts.push(p);
      }
    }
    particlesRef.current = pts;
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const hero = heroRef.current!;

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      buildParticles(canvas.width, canvas.height, mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const onMove = (e: any) => {
      const r = hero.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      mxRef.current = cx - r.left;
      myRef.current = cy - r.top;
      if (cursorRef.current) {
        cursorRef.current.style.left = cx + "px";
        cursorRef.current.style.top = cy + "px";
      }
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("touchstart", onMove);
    hero.addEventListener("touchmove", onMove);

    const loop = () => {
      timeRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid (Responsive)
      ctx.lineWidth = 0.5;
      const gs = isMobile ? 40 : 60;
      for (let x = 0; x < canvas.width; x += gs) {
        ctx.strokeStyle = `rgba(30,41,59,0.2)`;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }

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

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  return (
    <section ref={heroRef} style={{ minHeight: "100vh", background: "#020617", position: "relative", overflow: "hidden", cursor: isMobile ? "default" : "none" }}>
      {!isMobile && <div ref={cursorRef} style={{ position: "fixed", width: 14, height: 14, borderRadius: "50%", background: "#fff", mixBlendMode: "difference", pointerEvents: "none", zIndex: 9999, transform: "translate(-50%,-50%)" }} />}
      
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 2 }} />

      {/* UI Content */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "0 20px" : "0 7vw", pointerEvents: "none" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: uiVisible ? 1 : 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 11, color: "#00d4ff", letterSpacing: "0.2em", marginBottom: 16 }}>AVAILABLE FOR HIRE · {CONFIG.location}</div>
          
          <div style={{ marginBottom: 24 }}>
            {[CONFIG.name.first, CONFIG.name.middle, CONFIG.name.last].map((word, i) => (
              <div key={i} style={{ fontSize: "clamp(48px, 10vw, 110px)", fontWeight: 900, lineHeight: 0.9, color: i === 2 ? "transparent" : "#fff", WebkitTextStroke: i === 2 ? "1.5px rgba(0,212,255,0.5)" : "none", opacity: nameVisible[i] ? 1 : 0, transform: nameVisible[i] ? "none" : "translateY(20px)", transition: "0.8s" }}>
                {word}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", fontFamily: "monospace", marginBottom: 40 }}>
            <span style={{ color: "#00d4ff" }}>›</span> {roleDisplay}
          </div>

          <div style={{ display: "flex", gap: 30, marginBottom: 40 }}>
            {CONFIG.stats.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, pointerEvents: "all" }}>
            <motion.a href={CONFIG.buttons.primary.href} whileHover={{ scale: 1.05 }} style={{ padding: "12px 24px", background: "#00d4ff", color: "#000", borderRadius: 100, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
              {CONFIG.buttons.primary.label}
            </motion.a>
            <motion.a href={CONFIG.buttons.secondary.href} style={{ padding: "12px 24px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 100, fontSize: 12, textDecoration: "none" }}>
              {CONFIG.buttons.secondary.label}
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Hero Image Overlay */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: isMobile ? "100%" : "42%", zIndex: 5, opacity: isMobile ? 0.2 : 1 }}>
        <Image src="/certificate.jpeg" alt="Ahmed" fill style={{ objectFit: "cover", objectPosition: "center 20%" }} priority />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${isMobile ? 'to top' : 'to right'}, #020617, transparent)` }} />
      </div>

      {/* Click To Explode Area */}
      <div style={{ position: "absolute", inset: 0, zIndex: 20, cursor: "pointer" }} onClick={() => {
        if (phaseRef.current === 1) {
          phaseRef.current = 2;
          setTimeout(() => { 
            const canvas = canvasRef.current!;
            buildParticles(canvas.width, canvas.height, isMobile);
            phaseRef.current = 0; 
            setTimeout(() => phaseRef.current = 1, 1000); 
          }, 1500);
        }
      }} />
    </section>
  );
}