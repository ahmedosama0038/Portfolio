"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion";
import confetti from 'canvas-confetti';

const CONFIG = {
  formEndpoint: "https://formcarry.com/s/_Wt6RDf4nbx",
  email: "ah.osama303@gmail.com",
  phone: "+20 102 124 5010",
  whatsapp: "https://wa.me/201021245010",
  linkedin: "https://www.linkedin.com/in/ahmed-osama-6642a9397/",
  instagram: "https://www.instagram.com/__a7med__72",
};

// ─── 1. Magnetic & Tilt Wrapper (The Secret Sauce) ───────────
function InteractiveWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full"
    >
      {children}
    </motion.div>
  );
}

// ─── 2. Professional Input Field ──────────────────────────────
function UltraInput({ label, name, type = "text", textarea = false, error }: any) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative mb-6 group">
      <motion.div
        animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
        className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
          error ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : 
          focused ? "border-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.15)]" : "border-white/10"
        } bg-white/[0.03] backdrop-blur-md`}
      >
        {textarea ? (
          <textarea
            name={name} rows={4} required
            onFocus={() => setFocused(true)}
            onBlur={(e) => { setFocused(false); setHasValue(e.target.value.length > 0); }}
            className="w-full bg-transparent px-5 pt-8 pb-3 text-white outline-none resize-none font-light tracking-wide"
          />
        ) : (
          <input
            name={name} type={type} required
            onFocus={() => setFocused(true)}
            onBlur={(e) => { setFocused(false); setHasValue(e.target.value.length > 0); }}
            className="w-full bg-transparent px-5 pt-8 pb-3 text-white outline-none font-light tracking-wide"
          />
        )}
        <motion.label
          initial={false}
          animate={{
            y: (focused || hasValue) ? -18 : 0,
            scale: (focused || hasValue) ? 0.75 : 1,
            color: error ? "#ef4444" : (focused || hasValue) ? "#00d4ff" : "rgba(255,255,255,0.4)"
          }}
          className="absolute left-5 top-5 pointer-events-none origin-left font-medium tracking-wide text-sm"
        >
          {label}
        </motion.label>
      </motion.div>
    </div>
  );
}

// ─── 3. Contact Card (Reimagined) ─────────────────────────────
function ContactCard({ icon, label, value, href, accent }: any) {
  return (
    <motion.a
      href={href} target="_blank" rel="noreferrer"
      whileHover={{ y: -5, scale: 1.02 }}
      className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-5 transition-all hover:bg-white/[0.05] hover:border-white/20 group"
    >
      <div 
        style={{ background: `rgba(${accent}, 0.1)`, color: `rgb(${accent})` }}
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:shadow-cyan-500/20 transition-all"
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-white/90 group-hover:text-cyan-400 transition-colors">{value}</p>
      </div>
    </motion.a>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    const data = new FormData(formRef.current!);
    const newErrors: any = {};

    if (!data.get("name")) newErrors.name = true;
    if (!data.get("email") || !/^\S+@\S+\.\S+$/.test(data.get("email") as string)) newErrors.email = true;
    if (!data.get("message")) newErrors.message = true;

    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setLoading(true);
    try {
      const res = await fetch(CONFIG.formEndpoint, { method: "POST", body: data, headers: { "Accept": "application/json" } });
      if (res.ok) {
        setSent(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#00d4ff', '#ffffff', '#22c55e'] });
      }
    } catch {
      alert("Error sending transmission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#020617] relative py-24 px-6 md:px-[8vw] overflow-hidden flex items-center snap-start">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Info Side */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
            <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} className="h-1 bg-cyan-400 mb-8 rounded-full" />
            <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-12">
              LET'S BUILD <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500 animate-gradient-x">
                SOMETHING
              </span> <br /> 
              ICONIC.
            </h2>
            
            <div className="space-y-4 max-w-md">
              <ContactCard icon="✉" label="Email" value={CONFIG.email} href={`mailto:${CONFIG.email}`} accent="0,212,255" />
              <div className="grid grid-cols-2 gap-4">
                <ContactCard icon="📸" label="Instagram" value="Ahmed" href={CONFIG.instagram} accent="225,48,108" />
                <ContactCard icon="in" label="LinkedIn" value="Osama" href={CONFIG.linkedin} accent="0,119,181" />
              </div>
              <ContactCard icon="✆" label="WhatsApp" value={CONFIG.phone} href={CONFIG.whatsapp} accent="37,211,102" />
            </div>
          </motion.div>

          {/* Form Side with 3D Tilt */}
          <InteractiveWrapper>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white/[0.01] border border-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20">
                    <div className="text-7xl mb-6">🚀</div>
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">TRANSMISSION SENT!</h3>
                    <p className="text-white/40 text-sm mb-10">I'll get back to you in light speed, Ahmed.</p>
                    <button onClick={() => setSent(false)} className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold border border-cyan-400/30 px-8 py-4 rounded-full hover:bg-cyan-400 hover:text-black transition-all">Send Another</button>
                  </motion.div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative z-10" style={{ transform: "translateZ(50px)" }}>
                    <div className="mb-10">
                      <h4 className="text-white font-bold text-2xl tracking-tight">Send a Message</h4>
                      <p className="text-white/30 text-xs mt-2 font-light">Available for freelance and new opportunities.</p>
                    </div>

                    <UltraInput name="name" label="Full Name" error={errors.name} />
                    <UltraInput name="email" label="Email Address" type="email" error={errors.email} />
                    <UltraInput name="message" label="Project Details / Vision" textarea error={errors.message} />

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,212,255,0.25)" }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="w-full py-5 rounded-2xl bg-cyan-400 text-black font-black text-xs uppercase tracking-[0.25em] shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {loading ? "Transmitting..." : "Initiate Contact"}
                    </motion.button>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          </InteractiveWrapper>
        </div>
      </div>
    </section>
  );
}