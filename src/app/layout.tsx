"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import "./globals.css";
import Navbar from "../components/shared/Navbar";
import { Metadata } from "next";

// ─── 1. مكون شريط التقدم العلوي (Scroll Indicator) ──────────────────
function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scaleX,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #00d4ff, #0081ff)", 
        transformOrigin: "0%",
        zIndex: 9999,
      }}
    />
  );
}

// ─── 2. الـ Layout الرئيسي ──────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Ahmed Osama Fathy | Frontend Developer</title>
        <meta name="description" content="Frontend Developer specializing in React, Next.js & TypeScript. Based in Cairo, Egypt." />
      </head>
      <body suppressHydrationWarning={true}
        className="snap-y snap-mandatory overflow-y-scroll overflow-x-hidden"
        style={{ 
          background: "#020617", 
          margin: 0, 
          padding: 0,
          height: "100vh" // ضروري لعمل الـ Snap بشكل صحيح
        }}
      >
        {/* شريط التقدم المضيء */}
        <ScrollIndicator />
        
        {/* الـ Navbar ثابت فوق كل السكاشن */}
        <Navbar />

        {/* محتوى الصفحة */}
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}