"use client";
import { motion, useMotionValue, useSpring, useTransform, animate, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "Next.js", color: "#ffffff", glow: "#a8b4ff", icon: "▲", desc: "App Router · SSR · ISR" },
  { name: "React", color: "#61DAFB", glow: "#61DAFB", icon: "⚛", desc: "Hooks · Concurrent · RSC" },
  { name: "TypeScript", color: "#3178C6", glow: "#3178C6", icon: "TS", desc: "Strict · Generics · DX" },
  { name: "Tailwind", color: "#38BDF8", glow: "#38BDF8", icon: "✦", desc: "Utility · JIT · Custom" },
  { name: "Bootstrap", color: "#7952B3", glow: "#7952B3", icon: "B", desc: "Grid · Components · Flex" },
  { name: "JavaScript", color: "#F7DF1E", glow: "#F7DF1E", icon: "JS", desc: "ES6+ · Async · DOM" },
  { name: "Redux", color: "#764ABC", glow: "#764ABC", icon: "◈", desc: "RTK · Thunks · Selectors" },
  { name: "TanStack Query", color: "#FF4154", glow: "#FF4154", icon: "TQ", desc: "Cache · Sync · Fetching" },
  { name: "Framer", color: "#FF3366", glow: "#FF3366", icon: "◉", desc: "Springs · Layout · Gestures" },
];

interface Skill {
  name: string;
  color: string;
  glow: string;
  icon: string;
  desc: string;
}

interface CounterProps {
  value: number;
}

interface SkillOrbProps {
  skill: Skill;
  index: number;
  isActive: boolean;
  onHover: (index: number | null) => void;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

function Counter({ value }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v) + "%"; }
    });
    return controls.stop;
  }, [value]);
  return <span ref={ref}>0%</span>;
}

function SkillOrb({ skill, index, isActive, onHover, mouseX, mouseY }: SkillOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });
  const scale = useSpring(1, { stiffness: 300, damping: 25 });

  const proficiency = [95, 97, 93, 90, 92, 88, 85, 91, 89][index];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    x.set(dx * 0.25);
    y.set(dy * 0.25);
    rotateX.set(-(dy / rect.height) * 18);
    rotateY.set((dx / rect.width) * 18);
    scale.set(1.12);
    onHover(index);
  };

  const handleLeave = () => {
    x.set(0); y.set(0);
    rotateX.set(0); rotateY.set(0);
    scale.set(1);
    onHover(null);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{ 
        x, y, scale, rotateX, rotateY, 
        transformPerspective: 800, 
        transformStyle: "preserve-3d",
        // التعديل هنا لضمان 3 في كل صف
        flex: "0 0 calc(33.333% - 16px)",
        minWidth: "140px"
      }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative cursor-pointer select-none"
    >
      <motion.div
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1.15 : 0.9 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute", inset: -8, borderRadius: "50%",
          background: `radial-gradient(circle, ${skill.glow}30 0%, transparent 70%)`,
          filter: `blur(8px)`,
        }}
      />

      <div style={{
        width: "100%", height: 170,
        background: isActive
          ? `linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`
          : `linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`,
        border: `1px solid ${isActive ? skill.glow + "60" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8, padding: "16px 12px",
        transition: "background 0.3s, border 0.3s",
        backdropFilter: "blur(20px)",
        position: "relative", overflow: "hidden",
      }}>
        <motion.div
          animate={{ x: isActive ? "200%" : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(105deg, transparent 20%, ${skill.glow}18 50%, transparent 80%)`,
            pointerEvents: "none",
          }}
        />

        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `${skill.glow}18`,
          border: `1px solid ${skill.glow}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: skill.icon.length > 1 ? 13 : 20,
          color: skill.color,
          fontWeight: 700, fontFamily: "monospace",
        }}>
          {skill.icon}
        </div>

        <div style={{
          color: isActive ? skill.color : "#e2e8f0",
          fontSize: 15, fontWeight: 700,
          letterSpacing: "-0.02em",
          transition: "color 0.3s",
        }}>{skill.name}</div>

        <div style={{
          color: "rgba(255,255,255,0.35)", fontSize: 10,
          textAlign: "center", lineHeight: 1.5, letterSpacing: "0.02em",
          fontFamily: "monospace",
        }}>{skill.desc}</div>

        <div style={{ position: "relative", width: 36, height: 36 }}>
          <svg width="36" height="36" style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5"/>
            <motion.circle
              cx="18" cy="18" r="14" fill="none"
              stroke={skill.glow} strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 14}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - proficiency / 100) }}
              transition={{ delay: index * 0.1 + 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: `drop-shadow(0 0 4px ${skill.glow}80)` }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 9, color: "rgba(255,255,255,0.5)", fontWeight: 600,
          }}>
            <Counter value={proficiency} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ParticleField() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.4)",
          }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function SkillsUltra() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 25 });
  const glowX = useTransform(smoothX, v => v - 160);
  const glowY = useTransform(smoothY, v => v - 160);

  useEffect(() => {
    const h = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [mouseX, mouseY]);

  const activeSkill = activeIndex !== null ? skills[activeIndex] : null;

  return (
    <section style={{
      minHeight: "100vh",
      background: "#050810",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "60px 24px",
    }}>
      {/* Deep space background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, #0d1a3a 0%, #050810 60%)",
      }} />

      {/* Animated grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.07,
        backgroundImage: `
          linear-gradient(rgba(100,120,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(100,120,255,0.5) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, #050810 100%)",
      }} />

      <ParticleField />

      {/* Cursor glow */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0,
          x: glowX, y: glowY,
          width: 320, height: 320,
          borderRadius: "50%",
          background: activeSkill
            ? `radial-gradient(circle, ${activeSkill.glow}25 0%, transparent 70%)`
            : "radial-gradient(circle, rgba(100,120,255,0.15) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 100,
          transition: "background 0.4s",
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center", marginBottom: 64, position: "relative", zIndex: 10 }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 20,
          fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}
          />
          Available for work · 2026
        </div>

        <h1 style={{
          fontSize: "clamp(48px, 8vw, 90px)",
          fontWeight: 800, margin: 0,
          background: "linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.4) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-0.04em", lineHeight: 1,
        }}>
          My Stack
        </h1>
        <p style={{ color: "rgba(255,255,255,0.3)", marginTop: 16, fontSize: 15, letterSpacing: "0.02em" }}>
          Hover each skill to interact · Proficiency rings animate on load
        </p>
      </motion.div>

      {/* Skills Grid - Forced 3 per row */}
      <div style={{
        display: "flex", flexWrap: "wrap",
        gap: 16, justifyContent: "center",
        maxWidth: 700, // تحجيم الحاوية لضمان كسر الصف بعد 3 عناصر
        position: "relative", zIndex: 10,
      }}>
        {skills.map((skill, i) => (
          <SkillOrb
            key={skill.name}
            skill={skill} index={i}
            isActive={activeIndex === i}
            onHover={setActiveIndex}
            mouseX={mouseX} mouseY={mouseY}
          />
        ))}
      </div>

      {/* Libraries Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 960, marginTop: 72 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08))" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>
            Libraries & Tools
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.08))" }} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {[
            { name: "React Router", abbr: "RR", color: "#F44250", bg: "#F4425015" },
            { name: "Formik", abbr: "FK", color: "#7986CB", bg: "#7986CB15" },
            { name: "React Hook Form", abbr: "RHF", color: "#EC5990", bg: "#EC599015" },
            { name: "Hero UI", abbr: "HU", color: "#a855f7", bg: "#a855f715" },
            { name: "Shadcn", abbr: "SC", color: "#e2e8f0", bg: "#e2e8f010" },
            { name: "React Toastify", abbr: "RT", color: "#FFBC00", bg: "#FFBC0015" },
            { name: "React Image", abbr: "RI", color: "#61DAFB", bg: "#61DAFB15" },
            { name: "Zod", abbr: "ZD", color: "#5b9bd5", bg: "#5b9bd515" },
            { name: "Yup", abbr: "YP", color: "#94a3b8", bg: "#94a3b815" },
            { name: "React Query", abbr: "RQ", color: "#FF4154", bg: "#FF415415" },
            { name: "Postman", abbr: "PM", color: "#FF6C37", bg: "#FF6C3715" },
            { name: "Font Awesome", abbr: "FA", color: "#528DD7", bg: "#528DD715" },
            { name: "React Icons", abbr: "IC", color: "#E91E63", bg: "#E91E6315" },
            { name: "React Helmet", abbr: "RH", color: "#38BDF8", bg: "#38BDF815" },
            { name: "Swiper", abbr: "SW", color: "#6332F6", bg: "#6332F615" },
            { name: "SweetAlert", abbr: "SA", color: "#F87171", bg: "#F8717115" },
          ].map((lib, i) => (
            <motion.div
              key={lib.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + i * 0.035, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.04 }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 16px 10px 10px", borderRadius: 14,
                border: `1px solid ${lib.color}20`, background: lib.bg,
                backdropFilter: "blur(12px)", cursor: "default", transition: "border 0.2s, box-shadow 0.2s",
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9, background: `${lib.color}20`,
                border: `1px solid ${lib.color}35`, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: lib.abbr.length > 2 ? 9 : 11, fontWeight: 800, color: lib.color, fontFamily: "monospace",
              }}>{lib.abbr}</div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap" }}>{lib.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom stat bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          display: "flex", gap: 40, marginTop: 64,
          borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, position: "relative", zIndex: 10,
        }}
      >
        {[["9", "Skills"], ["1+", "Year"], ["LuxeMart+", "Projects"]].map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>{val}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}