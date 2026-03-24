"use client";

import FullHeroParticle from "../components/HeroSection";
import ProjectsSection from "../components/Projects";
import SkillsUltra from "../components/Skills";
import AboutPage from "./about/page";
import ContactSection from "./contact/page";


export default function Home() {
  return (
    <main style={{ background: "#020617", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ─── 1. HERO ─────────────────────────────────────────── */}
      <section id="home">
        <FullHeroParticle />
      </section>

      {/* ─── 2. ABOUT ────────────────────────────────────────── */}
      <section id="about">
        <AboutPage />
      </section>

      {/* ─── 3. PROJECTS ─────────────────────────────────────── */}
      <section id="projects">
        <ProjectsSection />
      </section>

      {/* ─── 4. SKILLS ───────────────────────────────────────── */}
      <section id="skills">
        <SkillsUltra />
      </section>

      {/* ─── 5. CONTACT ──────────────────────────────────────── */}
      <section id="contact">
        <ContactSection />
      </section>

    </main>
  );
}
