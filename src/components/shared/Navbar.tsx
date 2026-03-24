"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home",     href: "#home"    },
  { name: "About",    href: "#about"   },
  { name: "Projects", href: "#projects" },
  { name: "Skills",   href: "#skills"  },
  { name: "Contact",  href: "#contact" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden]       = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [active, setActive]       = useState("home");
  const [isMobile, setIsMobile]   = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 150);
    setScrolled(latest > 50);
  });

  // Active section tracker
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.4 }
    );
    navItems.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      variants={{
        visible: { y: 0,    opacity: 1 },
        hidden:  { y: -100, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed", 
        top: isMobile ? 12 : 24, // تقريب الناف بار للسقف في الموبايل
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        zIndex: 5000, pointerEvents: "none",
        padding: "0 10px", // منع الالتصاق بالحواف
      }}
    >
      <motion.div
        animate={{
          background: scrolled ? "rgba(2,6,23,0.85)" : "rgba(2,6,23,0.4)",
          boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05)" : "none",
        }}
        style={{
          display: "flex", alignItems: "center", 
          gap: isMobile ? 2 : 4,
          padding: isMobile ? "4px 6px" : "8px 10px",
          borderRadius: 100,
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          pointerEvents: "all",
          maxWidth: "100%",
        }}
      >
        {navItems.map((item) => {
          const isActive = active === item.href.replace("#", "");
          
          // في الموبايل، هنخفي "Home" و "About" لو المساحة ضيقة، أو نصغرهم جداً
          // هنا اخترت أصغر الـ Padding والخط عشان الكل يظهر بشكل منسق
          return (
            <a
              key={item.name}
              href={item.href}
              style={{ position: "relative", textDecoration: "none" }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    style={{
                      position: "absolute", inset: 0,
                      borderRadius: 100,
                      background: "rgba(0,212,255,0.1)",
                      border: "1px solid rgba(0,212,255,0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              
              <motion.span
                whileHover={{ color: "#00d4ff" }}
                style={{
                  position: "relative", zIndex: 1,
                  display: "block",
                  padding: isMobile ? "6px 10px" : "7px 16px", // بادنج أصغر للموبايل
                  fontSize: isMobile ? 10 : 12, // خط أصغر للموبايل
                  fontWeight: 600,
                  letterSpacing: isMobile ? "0.05em" : "0.1em",
                  textTransform: "uppercase",
                  color: isActive ? "#00d4ff" : "rgba(255,255,255,0.5)",
                  transition: "color 0.2s",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                {item.name}
              </motion.span>
            </a>
          );
        })}

        {/* Divider */}
        <div style={{
          width: 1, height: 16,
          background: "rgba(255,255,255,0.1)",
          margin: isMobile ? "0 2px" : "0 4px",
        }} />

        {/* Hire Me button */}
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          style={{
            padding: isMobile ? "6px 12px" : "8px 18px",
            borderRadius: 100,
            background: "#00d4ff",
            color: "#020617",
            fontSize: isMobile ? 9 : 11,
            fontWeight: 800,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {isMobile ? "Hire" : "Hire Me"}
        </motion.a>
      </motion.div>
    </motion.nav>
  );
}