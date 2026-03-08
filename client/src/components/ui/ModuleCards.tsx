"use client";

import { MODULES } from "@/lib/data";
import { motion, easeOut, circOut, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

function rgba(c: { r: number; g: number; b: number }, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

// Orchestration Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between each card appearing
      delayChildren: 0.4, // Initial wait for the grid lines to settle
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: easeOut },
  },
};

const ModuleCards = ({ font }: { font: any }) => {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    // We keep the section in the DOM so height is stable
    <section
      ref={sectionRef}
      className="relative z-20 px-5 sm:px-10 md:px-14 pb-14 pt-2 min-h-100"
    >
      {/* ── Section Divider (Standalone Animation) ── */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={isInView ? { opacity: 1, width: "100%" } : {}}
        transition={{ duration: 1.2, ease: circOut }}
        className="flex items-center gap-4 mb-10 overflow-hidden"
      >
        <div className="h-px flex-1 bg-linear-to-r from-violet-500/40 to-transparent" />
        <span className="lg:text-xl md:text-xl text-xs uppercase tracking-[0.7em] text-violet-500/50 font-black whitespace-nowrap">
          System.Select_Module
        </span>
        <div className="h-px flex-1 bg-linear-to-l from-violet-500/40 to-transparent" />
      </motion.div>

      {/* ── Grid Container ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"} // ← replaces whileInView
        className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-violet-500/5 border border-violet-500/10 backdrop-blur-[1px]"
      >
        {MODULES.map((mod, i) => {
          const isHovered = hoveredModule === mod.href;
          return (
            <motion.div
              key={mod.href}
              variants={cardVariants}
              onHoverStart={() => setHoveredModule(mod.href)}
              onHoverEnd={() => setHoveredModule(null)}
              className="relative"
            >
              <Link
                href={mod.href}
                className="group relative flex flex-col bg-[#03020a] hover:bg-black/20 transition-colors duration-700 overflow-hidden min-h-60"
              >
                {/* ── Hover Glow ── */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    background: isHovered
                      ? `radial-gradient(450px circle at center, ${rgba(mod.accent, 0.08)}, transparent)`
                      : "transparent",
                  }}
                  transition={{ duration: 0.5 }}
                />

                {/* ── Content ── */}
                <div className="relative flex flex-col h-full p-8 sm:p-10 z-10">
                  <div className="flex items-start justify-between mb-auto">
                    <div
                      className="flex items-center justify-center w-11 h-11 border border-white/5 bg-white/1 transition-all duration-500"
                      style={{
                        color: isHovered
                          ? rgba(mod.accent, 1)
                          : "rgba(255,255,255,0.15)",
                        borderColor: isHovered
                          ? rgba(mod.accent, 0.3)
                          : "rgba(255,255,255,0.05)",
                      }}
                    >
                      {mod.icon}
                    </div>
                    <ArrowUpRight
                      size={18}
                      className={`transition-all duration-500 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                      style={{ color: rgba(mod.accent, 1) }}
                    />
                  </div>

                  <div className="mt-8">
                    <span className="block lg:text-[14px] md:text-[14px] text-xs uppercase tracking-[0.5em] font-bold mb-3 opacity-20 group-hover:opacity-50 transition-opacity">
                      // MOD_{mod.module} // {mod.labelTag}
                    </span>
                    <h2
                      className={`${font.className} lg:text-6xl md:text-2xl text-4xl font-bold text-white mb-4 tracking-tighter`}
                    >
                      {mod.title}
                    </h2>
                    <p className="lg:text-[12px] md:text-[12px] text-xs uppercase tracking-[0.15em] text-slate-600 leading-relaxed max-w-65 group-hover:text-slate-400 transition-colors">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                {/* ── Corner Accents (The "Researcher" Aesthetic) ── */}
                <div
                  className={`absolute top-0 right-0 w-8 h-8 border-t border-r transition-all duration-700 pointer-events-none ${isHovered ? "opacity-40 scale-100" : "opacity-0 scale-90"}`}
                  style={{ borderColor: rgba(mod.accent, 1) }}
                />

                {/* ── Bottom Border ── */}
                <motion.div
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-0 left-0 right-0 h-px origin-left"
                  style={{
                    background: `linear-gradient(to right, ${rgba(mod.accent, 0.8)}, transparent)`,
                  }}
                />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default ModuleCards;
