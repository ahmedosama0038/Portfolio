"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

// ══════════════════════════════════════════════════════════════
//  ✏️  CONFIG
// ══════════════════════════════════════════════════════════════
const CONFIG = {
  formEndpoint: "https://formcarry.com/s/_Wt6RDf4nbx",
  email:    "ah.osama303@gmail.com",
  phone:    "+20 102 124 5010",
  whatsapp: "https://wa.me/201021245010",
  github:   "https://github.com/ahmedosama0038",
  linkedin: "https://www.linkedin.com/in/ahmed-osama-6642a9397/",
};

// ── Magnetic Button ───────────────────────────────────────────
function MagneticBtn({ children, href, style }: { children: React.ReactNode; href: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 18 });
  const y = useSpring(0, { stiffness: 200, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ x, y, ...style, display: "inline-flex", textDecoration: "none" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
}

// ── Animated Input ─────────────────────────────────────────────
function FloatInput({
  label, name, type = "text", required = false, textarea = false,
}: {
  label: string; name: string; type?: string; required?: boolean; textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isUp = focused || hasValue;

  const inputStyles: React.CSSProperties = {
    width: "100%", 
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${focused ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 14, 
    padding: textarea ? "28px 16px 12px" : "22px 16px 10px",
    color: "#fff", 
    fontSize: 15, 
    outline: "none",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxShadow: focused ? "0 0 0 4px rgba(0,212,255,0.05)" : "none",
  };

  return (
    <div style={{ position: "relative", marginBottom: 20, width: "100%" }}>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={4}
          onFocus={() => setFocused(true)}
          onBlur={e => { setFocused(false); setHasValue(e.target.value.length > 0); }}
          style={{ ...inputStyles, resize: "none" }}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={e => { setFocused(false); setHasValue(e.target.value.length > 0); }}
          style={inputStyles}
        />
      )}
      <motion.label
        animate={{
          y: isUp ? (textarea ? -12 : -10) : (textarea ? 18 : 0),
          x: isUp ? 0 : 0,
          scale: isUp ? 0.85 : 1,
          color: isUp ? (focused ? "#00d4ff" : "rgba(255,255,255,0.5)") : "rgba(255,255,255,0.3)",
        }}
        style={{
          position: "absolute", left: 16,
          top: textarea ? 0 : "50%",
          transform: textarea ? "none" : "translateY(-50%)",
          pointerEvents: "none",
          letterSpacing: "0.05em", textTransform: "uppercase",
          fontFamily: "monospace",
          transformOrigin: "left center",
          zIndex: 1,
        }}
      >
        {label}
      </motion.label>
    </div>
  );
}

// ── Contact Link Card ──────────────────────────────────────────
function ContactCard({ icon, label, value, href, accent }: {
  icon: React.ReactNode; label: string; value: string; href: string; accent: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <MagneticBtn href={href} style={{ width: "100%" }}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{
          background: hovered ? `rgba(${accent},0.08)` : "rgba(255,255,255,0.02)",
          borderColor: hovered ? `rgba(${accent},0.3)` : "rgba(255,255,255,0.07)",
        }}
        style={{
          width: "100%", padding: "16px 18px",
          borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 14,
          cursor: "pointer", transition: "all 0.3s",
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: hovered ? `rgba(${accent},0.2)` : "rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, color: hovered ? `rgb(${accent})` : "rgba(255,255,255,0.5)",
          flexShrink: 0,
        }}>{icon}</div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: 9, color: `rgba(${accent},0.8)`, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 13, color: hovered ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
        </div>
      </motion.div>
    </MagneticBtn>
  );
}

// ── Send Button ────────────────────────────────────────────────
function SendButton({ loading, sent }: { loading: boolean; sent: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={loading || sent}
      whileHover={!loading && !sent ? { scale: 1.02 } : {}}
      whileTap={!loading && !sent ? { scale: 0.98 } : {}}
      style={{
        width: "100%", padding: "16px", borderRadius: 14, border: "none",
        background: sent ? "#10b981" : "linear-gradient(90deg, #00d4ff, #0099cc)",
        color: "#fff", fontSize: 13, fontWeight: 700, cursor: loading || sent ? "not-allowed" : "pointer",
        textTransform: "uppercase", letterSpacing: "0.1em", position: "relative",
      }}
    >
      {loading ? "Sending..." : sent ? "✓ Message Sent" : "Send Message →"}
    </motion.button>
  );
}

// ── Main Section ───────────────────────────────────────────────
export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    const handleMouse = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(formRef.current!);
    try {
      const res = await fetch(CONFIG.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (res.ok) { setSent(true); formRef.current?.reset(); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const contacts = [
    { icon: "✉", label: "Email", value: CONFIG.email, href: `mailto:${CONFIG.email}`, accent: "0,212,255" },
    { icon: "✆", label: "WhatsApp", value: CONFIG.phone, href: CONFIG.whatsapp, accent: "16,185,129" },
    { icon: "in", label: "LinkedIn", value: "ahmed-osama", href: CONFIG.linkedin, accent: "59,130,246" },
  ];

  return (
    <section ref={sectionRef} style={{ minHeight: "100vh", background: "#020617", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: isMobile ? "60px 20px" : "100px 8vw", justifyContent: "center" }}>
      
      {/* Background Decorative Elements */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: "50px 50px", maskImage: "radial-gradient(circle, black, transparent)", pointerEvents: "none" }} />

      {/* Watermark */}
      <div style={{ position: "absolute", bottom: -20, right: -20, fontSize: isMobile ? 80 : 200, fontWeight: 900, color: "rgba(255,255,255,0.015)", userSelect: "none", zIndex: 0 }}>CONTACT</div>

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", zIndex: 10 }}>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: isMobile ? 40 : 60, textAlign: isMobile ? "left" : "center" }}>
          <h2 style={{ fontSize: isMobile ? 32 : 64, fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 15 }}>
            Let's Start a <span style={{ color: "#00d4ff" }}>Project</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>I'm currently available for freelance and full-time opportunities.</p>
        </motion.div>

        {/* Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr", gap: isMobile ? 40 : 60, alignItems: "start" }}>
          
          {/* Info Side */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "8px 15px", borderRadius: 100, fontSize: 12, width: "fit-content", marginBottom: 10 }}>● Available for new work</div>
            {contacts.map((c, i) => <ContactCard key={i} {...c} />)}
          </motion.div>

          {/* Form Side */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: isMobile ? "25px" : "40px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 50, marginBottom: 15 }}>✅</div>
                <h3 style={{ color: "#fff", marginBottom: 10 }}>Sent Successfully!</h3>
                <p style={{ color: "rgba(255,255,255,0.4)" }}>I'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} style={{ marginTop: 20, background: "none", border: "1px solid #333", color: "#fff", padding: "8px 20px", borderRadius: 10, cursor: "pointer" }}>Send Another</button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 0 : "0 20px" }}>
                  <FloatInput label="Name" name="name" required />
                  <FloatInput label="Email" name="email" type="email" required />
                </div>
                <FloatInput label="Subject" name="subject" required />
                <FloatInput label="Message" name="message" required textarea />
                <SendButton loading={loading} sent={sent} />
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <footer style={{ marginTop: 80, textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12, borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: 30 }}>
        © {new Date().getFullYear()} Ahmed Osama · All Rights Reserved
      </footer>
    </section>
  );
}