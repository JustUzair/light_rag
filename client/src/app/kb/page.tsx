// app/kb/page.tsx  →  AXIOM Knowledge Base Module
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import Background from "@/components/ui/background";
import { font } from "@/lib/data";
import KBIngest from "@/components/ui/kb/KBIngest";
import KBQuery from "@/components/ui/kb/KBQuery";

export default function KBPage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Lifted so KBIngest can signal KBQuery to re-render source hints if needed
  const [ingestCount, setIngestCount] = useState(0);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      className="flex h-screen flex-col bg-[#03020a] text-slate-300 overflow-hidden relative select-none"
      onMouseMove={onMouseMove}
      style={{
        fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
      }}
    >
      <Background mouse={mouse} />
      <Header font={font} />

      <main
        className="flex-1 overflow-y-auto relative z-20 scroll-smooth"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#06b6d4 transparent",
        }}
      >
        <div className="mx-auto lg:max-w-[80%] max-w-[90%] px-5 lg:px-8 py-10">
          {/* ── Page header ── */}
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
              className="flex items-center gap-2 mb-3"
            >
              <div
                className="w-1 h-4 bg-cyan-500"
                style={{ boxShadow: "0 0 10px rgba(6,182,212,0.8)" }}
              />
              <span className="lg:text-lg md:text-xl text-sm uppercase tracking-[0.5em] text-cyan-700 font-bold">
                Private Retrieval
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className={`${font.className} lg:text-6xl md:text-2xl text-4xl font-bold text-white mb-2 leading-none`}
            >
              Knowledge Base
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base uppercase tracking-[0.4em] text-slate-700 font-bold"
            >
              Ingest documents • Query your corpus • No web, pure signal
            </motion.p>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                delay: 0.35,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-px mt-4 origin-left"
              style={{
                background:
                  "linear-gradient(to right, rgba(6,182,212,0.5), rgba(6,182,212,0.1), transparent)",
              }}
            />
          </div>

          {/* ── Two-column layout ── */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-px"
            style={{
              background: "rgba(6,182,212,0.05)",
              border: "1px solid rgba(6,182,212,0.08)",
            }}
          >
            <KBIngest onIngested={() => setIngestCount(c => c + 1)} />
            <KBQuery ingestCount={ingestCount} />
          </motion.div>

          {/* ── Footer meta ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-4 flex items-center justify-between px-0.5"
          >
            <span className="text-sm uppercase tracking-[0.38em] text-slate-900 font-bold">
              AXIOM • LightRAG • Private Embeddings • Module 02
            </span>
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="w-1 h-1 rounded-full bg-cyan-800"
              />
              <span className="text-sm uppercase tracking-[0.4em] text-slate-900 font-bold tabular-nums">
                {new Date().getFullYear()}
              </span>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
