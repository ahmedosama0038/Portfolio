"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

const PROJECTS = [
  {
    id: 1, title: "FreshCart", category: "E-Commerce", number: "01",
    description: "Full-stack e-commerce with SSR, Redux cart, dark mode & Apple-like animations.",
    longDesc: "Built with Next.js 14 & TypeScript leveraging SSR and Server Actions. Features Signup/Login with Zod validation, Redux Toolkit for cart logic, Tailwind + Framer Motion animations, and a polished dark mode.",
    tech: ["Next.js 14", "TypeScript", "Redux", "Tailwind", "Framer Motion", "Zod"],
    github: "https://github.com/ahmedosama0038/FreshCart.git",
    demo: "https://fresh-cart-five-snowy.vercel.app",
    image: "/freshcart.png",
    accent: "#3b82f6", tag: "Featured",
  },
  {
    id: 2, title: "Movie App", category: "Entertainment", number: "02",
    description: "React movie discovery app with trending films, auth flow & detailed pages.",
    longDesc: "Full-featured movie discovery powered by TMDB API. Includes Formik auth, trending movies, detailed pages with cast & ratings, search, and React Router navigation.",
    tech: ["React", "Bootstrap", "Formik", "React Router", "React Toastify"],
    github: "https://github.com/ahmedosama0038/movie-app.git",
    demo: "https://movie-app-5if8-git-main-ahmedosama0038s-projects.vercel.app",
    image: "/movieapp.png",
    accent: "#8b5cf6", tag: "Live",
  },
  {
    id: 3, title: "LinKyra", category: "Social Media", number: "03",
    description: "Social networking platform with token auth, Zod validation & Hero UI.",
    longDesc: "Social networking app with token-based auth via Context API, React Hook Form + Zod validation, Hero UI components, and Tailwind CSS. Real-time features with smart alerts.",
    tech: ["React", "Tailwind", "React Hook Form", "Zod", "Context API", "Hero UI"],
    github: "https://github.com/ahmedosama0038/LinKyra.git",
    demo: null,
    image: "/linkyra.png",
    accent: "#06b6d4", tag: "In Progress",
  },
  {
    id: 4, title: "Yummy", category: "Food & Recipes", number: "04",
    description: "Vanilla JS recipe app with dynamic search, categories & ingredient details.",
    longDesc: "Recipe discovery app in pure Vanilla JS. Dynamic meal search, category & area browsing, ingredient exploration, and detailed recipe pages. Fully responsive with Bootstrap.",
    tech: ["JavaScript", "Bootstrap", "HTML", "CSS", "MealDB API"],
    github: "https://github.com/ahmedosama0038/YUMMY.git",
    demo: "https://ahmedosama0038.github.io/YUMMY/",
    image: "/yummy.png",
    accent: "#f59e0b", tag: "Live",
  },
];

type Project = typeof PROJECTS[0];

function Modal({ p, onClose }: { p: Project; onClose: () => void }) {
  return (
    
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(2,6,23,0.92)", backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      
       
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0d1117", border: `1px solid ${p.accent}30`,
          borderRadius: 24, overflow: "hidden",
          maxWidth: 860, width: "100%", maxHeight: "90vh", overflowY: "auto",
        }}
      >
        {/* Screenshot */}
        <div style={{ position: "relative", height: 340, overflow: "hidden" }}>
          <img src={p.image} alt={p.title} style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "top",
            filter: "brightness(0.68)",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0d1117 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at top right, ${p.accent}15, transparent 60%)` }} />

          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            width: 38, height: 38, borderRadius: "50%",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff", fontSize: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>

          <div style={{
            position: "absolute", top: 16, left: 16,
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            border: `1px solid ${p.accent}40`, borderRadius: 100,
            padding: "5px 12px", fontSize: 11, color: p.accent,
            letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.accent, display: "inline-block" }} />
            {p.tag}
          </div>

          <div style={{
            position: "absolute", bottom: -8, right: 20,
            fontSize: 110, fontWeight: 900, lineHeight: 1,
            color: "rgba(255,255,255,0.04)", userSelect: "none",
            fontFamily: "'Inter', system-ui",
          }}>{p.number}</div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 32px 32px" }}>
          <div style={{ fontSize: 11, color: p.accent, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>{p.category}</div>
          <h2 style={{ fontSize: 34, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 14px" }}>{p.title}</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: 22 }}>{p.longDesc}</p>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>Tech Stack</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {p.tech.map(t => (
                <span key={t} style={{ padding: "5px 14px", borderRadius: 100, background: `${p.accent}12`, border: `1px solid ${p.accent}30`, fontSize: 12, color: p.accent, fontFamily: "monospace" }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <a href={p.github} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 100,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              fontSize: 13, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 500,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              View Code
            </a>
            {p.demo
              ? <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 100, background: p.accent, fontSize: 13, color: "#fff", textDecoration: "none", fontWeight: 600 }}>↗ Live Demo</a>
              : <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 100, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>⏳ Demo Soon</span>
            }
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Card({ p, i, onClick }: { p: Project; i: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover="hover" onClick={onClick}
      style={{ position: "relative", width: 530, height: 420, flexShrink: 0, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", background: "#0a0f1a" }}
    >
      <motion.img src={p.image} alt={p.title}
        variants={{ hover: { scale: 1.07 } }}
        initial={{ scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: "brightness(0.42) contrast(1.05)" }}
      />
      <motion.div variants={{ hover: { opacity: 0.22 } }} initial={{ opacity: 0.09 }}
        style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${p.accent}80, transparent 60%)` }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,8,20,0.98) 0%, rgba(5,8,20,0.35) 55%, transparent 100%)" }} />

      <div style={{ position: "absolute", top: -15, right: 12, fontSize: 125, fontWeight: 900, lineHeight: 1, color: "rgba(255,255,255,0.035)", userSelect: "none", fontFamily: "'Inter', system-ui" }}>{p.number}</div>

      <div style={{ position: "absolute", top: 18, left: 18, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: `1px solid ${p.accent}40`, borderRadius: 100, padding: "4px 12px", fontSize: 10, color: p.accent, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>
        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 5, height: 5, borderRadius: "50%", background: p.accent, display: "inline-block" }} />
        {p.tag}
      </div>

      <motion.div variants={{ hover: { opacity: 1, x: 0, y: 0 } }} initial={{ opacity: 0, x: 10, y: -10 }}
        style={{ position: "absolute", top: 14, right: 18, width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#fff" }}
      >↗</motion.div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 20px 20px" }}>
        <div style={{ fontSize: 10, color: p.accent, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 5 }}>{p.category}</div>
        <h3 style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8, fontFamily: "'Inter', system-ui" }}>{p.title}</h3>
        <motion.p variants={{ hover: { opacity: 1, y: 0 } }} initial={{ opacity: 0, y: 6 }}
          style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, marginBottom: 10 }}
        >{p.description}</motion.p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {p.tech.slice(0, 4).map(t => (
            <span key={t} style={{ padding: "2px 9px", borderRadius: 100, background: `${p.accent}12`, border: `1px solid ${p.accent}25`, fontSize: 10, color: p.accent, fontFamily: "monospace" }}>{t}</span>
          ))}
          {p.tech.length > 4 && <span style={{ padding: "2px 9px", borderRadius: 100, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>+{p.tech.length - 4}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Project | null>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-54%"]), { stiffness: 80, damping: 20 });
  const titleX = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const op = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  return (
    <>
      <AnimatePresence>{active && <Modal p={active} onClose={() => setActive(null)} />}</AnimatePresence>

      <section ref={ref} style={{ position: "relative", height: "320vh", background: "#020617" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>

          <motion.div style={{ opacity: op }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: "7vw", marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: "rgba(0,212,255,0.5)" }} />
              <span style={{ fontSize: 11, color: "rgba(0,212,255,0.7)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>Selected Work</span>
            </div>
          </motion.div>

          <motion.h2 style={{ x: titleX, position: "absolute", top: "8%", fontSize: "clamp(80px, 18vw, 200px)", fontWeight: 900, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.02)", whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none", fontFamily: "'Inter', system-ui" }}>PROJECTS</motion.h2>

          <motion.div style={{ x, display: "flex", gap: 18, paddingLeft: "7vw", paddingRight: "7vw", alignItems: "center" }}>
            {PROJECTS.map((p, i) => <Card key={p.id} p={p} i={i} onClick={() => setActive(p)} />)}

            <div style={{ width: 230, height: 420, flexShrink: 0, borderRadius: 22, border: "1px dashed rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "rgba(255,255,255,0.01)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "rgba(255,255,255,0.2)" }}>+</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>More Coming</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 4 }}>Always building</div>
              </div>
              <a href="https://github.com/ahmedosama0038" target="_blank" rel="noopener noreferrer"
                style={{ padding: "7px 18px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none", letterSpacing: "0.05em", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.4)"; (e.currentTarget as HTMLElement).style.color = "#00d4ff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}
              >GitHub →</a>
            </div>
          </motion.div>

          <motion.div style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}>
            <div style={{ position: "absolute", bottom: 30, right: "7vw", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "rgba(255,255,255,0.15)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              Scroll to explore
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}