"use client";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

// ─── Typewriter & Utils ───────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else {
      setDeleting(false);
      setIndex(i => i + 1);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, words]);

  return (
    <span style={{ color: "#22d3ee" }}>
      {displayed}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ borderRight: "2px solid #22d3ee", marginLeft: 2 }} />
    </span>
  );
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = value / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function Reveal({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right"; }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 50 : 0, x: direction === "left" ? -40 : direction === "right" ? 40 : 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? "visible" : "hidden"} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 992);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  const stats = [
    { value: 10, suffix: "+", label: "Projects", icon: "◈" },
    { value: 1, suffix: "", label: "Certificate", icon: "✦" },
    { value: 1, suffix: "yr", label: "Experience", icon: "◉" },
    { value: 20, suffix: "k+", label: "Lines of Code", icon: "▲" },
  ];
const values = [
    { 
      title: "Clean Code", 
      desc: "Every line must be readable. Code is read more than it's written.", 
      icon: " < /> " // أيقونة كود صريحة بدل الكيبورد
    },
    { 
      title: "Attention to Detail", 
      desc: "The magic happens in the smallest pixels and animations.", 
      icon: " ◈ " // أيقونة تركيز (Focus) أشيك بكتير
    },
    { 
      title: "Always Learning", 
      desc: "Technology evolves, and I'm always first in line to level up.", 
      icon: " ✦ " // أيقونة شرارة أو تطور (Sparkle) لايقة مع السماوي
    },
  ];
  return (
    <main ref={containerRef} style={{ background: "#050810", minHeight: "100vh", color: "#fff", overflowX: "hidden", position: "relative", paddingBottom: 100 }}>
      
      {/* ── Background Noise & FX ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, opacity: 0.4 }} />

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: isMobile ? "120px 24px 60px" : "0 8vw" }}>
        
        <motion.div style={{ position: "absolute", right: isMobile ? "-20%" : "0", top: 0, bottom: 0, width: isMobile ? "140%" : "55%", scale: imgScale, zIndex: 0 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url('/WDQX7895.jpeg')`, backgroundSize: "cover", backgroundPosition: "center top", filter: "brightness(0.4) contrast(1.1) grayscale(0.2)" }} />
          <div style={{ position: "absolute", inset: 0, background: isMobile ? "radial-gradient(circle at center, transparent, #050810 90%)" : "linear-gradient(to right, #050810 10%, transparent 50%, #050810 95%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #050810 5%, transparent 30%)" }} />
        </motion.div>

        <motion.div style={{ position: "relative", zIndex: 10, maxWidth: 650, y: isMobile ? 0 : heroY, opacity: heroOpacity, textAlign: isMobile ? "center" : "left", margin: isMobile ? "0 auto" : "0" }}>
          <Reveal delay={0.1}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 24, fontSize: 11, color: "rgba(34,211,238,0.8)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee" }} />
              Frontend Developer · Cairo
            </div>
          </Reveal>
<motion.h1 style={{ 
  fontSize: "clamp(48px, 8vw, 90px)", 
  fontWeight: 900, 
  lineHeight: 0.9, 
  margin: "0 0 20px", 
  color: "#fff" // خلي الاسم الأساسي أبيض صريح عشان ينطق
}}>
  Ahmed Osama<br />
  <span style={{ 
    color: "#22d3ee", // شيلنا الـ Gradient المعقد وخليناه سماوي صريح وواضح
    textShadow: "0 0 30px rgba(34,211,238,0.3)" // ضفنا "هالة" خفيفة ورا الكلمة عشان تنور
  }}>
    Fathy
  </span>
</motion.h1>

          <div style={{ fontSize: "clamp(18px, 3vw, 24px)", marginBottom: 30, color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
            I build <Typewriter words={["Pixel-Perfect UIs.", "Clean React Code.", "Fast Next.js Apps.", "Great UX."]} />
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.4)", maxWidth: 500, marginBottom: 40, marginInline: isMobile ? "auto" : "0" }}>
            Passionate about turning complex ideas into elegant digital solutions using modern web technologies.
          </p>

          <div style={{ display: "flex", gap: 15, justifyContent: isMobile ? "center" : "flex-start", flexWrap: "wrap" }}>
            <button style={{ padding: "14px 32px", borderRadius: 100, background: "#0891b2", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer" }}>View Projects →</button>
            <button style={{ padding: "14px 32px", borderRadius: 100, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 500, cursor: "pointer" }}>Resume</button>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: "60px 24px", marginTop: isMobile ? 0 : -100, position: "relative", zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 32, backdropFilter: "blur(10px)", overflow: "hidden" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: isMobile ? "30px 15px" : "50px 30px", textAlign: "center", borderRight: (i + 1) % (isMobile ? 2 : 4) === 0 ? "none" : "1px solid rgba(255,255,255,0.05)", borderBottom: isMobile && i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ fontSize: "clamp(32px, 5vw, 50px)", fontWeight: 900, marginBottom: 5 }}><AnimatedNumber value={s.value} suffix={s.suffix} /></div>
              <div style={{ fontSize: 11, color: "rgba(34,211,238,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STORY SECTION
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1.5fr", gap: isMobile ? 60 : 100, alignItems: "center" }}>
          
          <Reveal direction="left">
            <div style={{ position: "relative", width: "100%", maxWidth: 400, margin: "0 auto" }}>
              <div style={{ position: "absolute", inset: -15, border: "1px solid rgba(34,211,238,0.2)", borderRadius: 30, transform: "rotate(-3deg)" }} />
              <div style={{ borderRadius: 24, overflow: "hidden", aspectRatio: "4/5", position: "relative", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Image src="/me.jpeg" alt="Ahmed Osama" fill style={{ objectFit: "cover", filter: "brightness(0.9)" }} />
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div style={{ textAlign: isMobile ? "center" : "left" }}>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, marginBottom: 25, lineHeight: 1.1 }}>Turning Ideas Into <span style={{ color: "rgba(255,255,255,0.3)" }}>Digital Reality</span></h2>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: "rgba(255,255,255,0.5)", marginBottom: 25 }}>
                I started my journey with a passion for building interfaces that don't just work, but feel right. Over the past year, I've specialized in React & Next.js to deliver high-performance applications.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: isMobile ? "center" : "flex-start" }}>
                {["React", "Next.js", "TypeScript", "Tailwind", "Framer"].map(tag => (
                  <span key={tag} style={{ padding: "6px 16px", borderRadius: 100, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", fontSize: 12, color: "#22d3ee" }}>{tag}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          VALUES
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {values.map((v, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ padding: 40, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 28, height: "100%" }}>
                <div style={{ fontSize: 30, marginBottom: 20, color: "#22d3ee" }}>{v.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 15 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

    </main>
  );
}









































