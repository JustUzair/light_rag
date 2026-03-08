"use client";
import { FEATURES } from "@/lib/data";
import { motion } from "framer-motion";
import ScrambleOnMount from "./ScrambleOnMount";
import dynamic from "next/dynamic";
const SplineScene = dynamic(() => import("./SplineScene"), {
  ssr: false,
});
const Hero = ({ font, onLoad }: { font: any; onLoad?: () => void }) => {
  return (
    <section className="relative w-full h-screen">
      {/* Spline 3D */}
      <div className="absolute inset-0 z-0">
        <SplineScene onLoad={onLoad} />
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 sm:h-80 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top,#000 5%, #03020a 15%, rgba(3,2,10,0.8) 40%, transparent 100%)",
        }}
      />
      {/* Left fade — desktop only for text legibility */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 z-10 pointer-events-none hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(3,2,10,0.52) 0%, transparent 100%)",
        }}
      />

      {/* Brand content overlay — bottom-left */}
      <div className="absolute bottom-0 left-0 z-20 px-5 sm:px-10 md:px-14 pb-8 sm:pb-14 w-full md:max-w-2xl">
        {/* Blink tag */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex items-center gap-2 mb-5"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.05, repeat: Infinity }}
            className="w-[5px] h-3.5 bg-violet-500"
            style={{ boxShadow: "0 0 10px rgba(124,58,237,0.9)" }}
          />
          <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.5em] text-violet-500/55 font-bold">
            <ScrambleOnMount
              text="v2.0 · Intelligence Synthesis Engine"
              className="lg:text-lg md:text-xl text-sm"
              delay={500}
            />
          </span>
        </motion.div>

        {/* AXIOM wordmark */}
        <div
          className={`${font.className} flex items-end leading-none mb-4 sm:mb-5 lg:text-[16rem] md:text-[8rem] text-[3.5rem]`}
          style={{
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          {"AXIOM".split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 55, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.28 + i * 0.08,
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block text-white"
              style={{
                textShadow: `0 0 70px rgba(124,58,237,${0.09 + i * 0.03})`,
              }}
            >
              {ch}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.78, duration: 0.42 }}
            className="inline-block w-[0.053em] h-[0.76em] bg-violet-500 ml-2 mb-[0.05em] origin-bottom"
            style={{ boxShadow: "0 0 22px rgba(124,58,237,1)" }}
          />
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            delay: 0.82,
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-px origin-left mb-5"
          style={{
            background:
              "linear-gradient(to right, rgba(124,58,237,0.65), rgba(124,58,237,0.15), transparent)",
          }}
        />

        {/* Feature tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex flex-wrap gap-1.5 sm:gap-2"
        >
          {FEATURES.map((f, i) => (
            <motion.span
              key={f.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.05 + i * 0.06 }}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 lg:text-[15px] md:text-base text-xs  font-bold uppercase tracking-[0.25em] text-violet-500/45"
              style={{
                border: "1px solid rgba(124,58,237,0.1)",
                background: "rgba(124,58,237,0.035)",
              }}
            >
              <span className="text-violet-700">{f.icon}</span>
              {f.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
