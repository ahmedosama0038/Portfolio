"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROJECTS = [
  {
    id: 1, title: "FreshCart", category: "E-Commerce",
    description: "Full-stack e-commerce with SSR, Redux cart, and Apple-like animations.",
    tech: ["Next.js 14", "Redux", "Tailwind"],
    github: "https://github.com/ahmedosama0038/FreshCart.git",
    demo: "https://fresh-cart-five-snowy.vercel.app",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000",
    accent: "#00d4ff",
  },
  {
    id: 2, title: "Movie App", category: "Entertainment",
    description: "React movie discovery app powered by TMDB API with auth flow.",
    tech: ["React", "Bootstrap", "Formik"],
    github: "https://github.com/ahmedosama0038/movie-app.git",
    demo: "https://movie-app-5if8-git-main-ahmedosama0038s-projects.vercel.app",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000",
    accent: "#00d4ff",
  },
  {
    id: 3, title: "LinKyra", category: "Social Media",
    description: "Social networking platform with token auth and Zod validation.",
    tech: ["React", "Tailwind", "Hero UI"],
    github: "https://github.com/ahmedosama0038/LinKyra.git",
    demo: null,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000",
    accent: "#00d4ff",
  },
  {
    id: 4, title: "Yummy", category: "Food & Recipes",
    description: "Vanilla JS recipe app with dynamic search and ingredient details.",
    tech: ["JavaScript", "Bootstrap", "API"],
    github: "https://github.com/ahmedosama0038/YUMMY.git",
    demo: "https://ahmedosama0038.github.io/YUMMY/",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000",
    accent: "#00d4ff",
  },
];

export default function ProjectsSection() {
  return (
    <section className="bg-[#020617] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 text-center md:text-left"
        >
          <h2 className="text-white text-5xl md:text-8xl font-black tracking-tighter">
            SELECTED <span className="text-[#00d4ff]">WORKS</span>
          </h2>
        </motion.div>

        {/* Projects List */}
        <div className="flex flex-col gap-32 md:gap-64">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-20`}
    >
      {/* 1. Image Content */}
      <motion.div 
        initial={{ opacity: 0, x: isEven ? -100 : 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-3/5 group cursor-pointer"
      >
        <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-[#0a0f1a]">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 to-transparent" />
        </div>
      </motion.div>

      {/* 2. Text Content */}
      <motion.div 
        initial={{ opacity: 0, x: isEven ? 100 : -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-2/5 flex flex-col items-start"
      >
        <span className="text-[#00d4ff] font-mono text-sm tracking-widest mb-4 uppercase">
          0{index + 1} // {project.category}
        </span>
        <h3 className="text-white text-4xl md:text-6xl font-bold mb-6">
          {project.title}
        </h3>
        <p className="text-white/40 text-lg leading-relaxed mb-8">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-3 mb-10">
          {project.tech.map((t: string) => (
            <span key={t} className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-6">
          <a href={project.github} target="_blank" className="text-white border-b border-[#00d4ff] pb-1 hover:text-[#00d4ff] transition-colors font-bold">
            Github Code
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" className="text-white border-b border-[#00d4ff] pb-1 hover:text-[#00d4ff] transition-colors font-bold">
              Live Preview
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}