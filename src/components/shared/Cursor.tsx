"use client";
import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const Cursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useSpring(0, { damping: 20, stiffness: 100 });
  const cursorY = useSpring(0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveMouse);
    return () => window.removeEventListener("mousemove", moveMouse);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{ x: cursorX, y: cursorY }}
      className={`fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-[9999] flex items-center justify-center`}
      animate={{ scale: isHovered ? 2.5 : 1, backgroundColor: isHovered ? "rgba(0, 212, 255, 0.2)" : "transparent" }}
    >
      <div className="w-1 h-1 bg-primary rounded-full" />
    </motion.div>
  );
};