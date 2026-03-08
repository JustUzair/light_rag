// app/search/page.tsx  →  AXIOM Web Search Module
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import { ChatTurn } from "@/lib/types";
import Header from "@/components/ui/header";

import { CHAT_STORAGE_KEY, font, SUGGESTIONS, V } from "@/lib/data";
import { getDynamicQuery } from "@/lib/utils";
import ErrorBlock from "@/components/ui/ErrorBlock";
import RevealWords from "@/components/ui/RevealWords";
import ClearHistoryButton from "@/components/ui/CleanHistoryButton";
import Background from "@/components/ui/background";
import ChatSynthesizing from "@/components/ui/ChatSynthesizing";
import TiltCard from "@/components/ui/TiltCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<ChatTurn[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatTurn[];
        if (Array.isArray(parsed) && parsed.length > 0) setChat(parsed);
      }
    } catch {
      /* corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (chat.length === 0) localStorage.removeItem(CHAT_STORAGE_KEY);
      else localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chat));
    } catch {
      /* quota exceeded */
    }
  }, [chat, hydrated]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat, loading]);

  const clearHistory = useCallback(() => {
    setChat([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }, []);

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

      {/* ══ MAIN ══ */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto relative z-20 scroll-smooth"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#7c3aed transparent",
        }}
      >
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10">
          <AnimatePresence mode="wait">
            {/* ── EMPTY STATE — quick queries ── */}
            {chat.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                transition={{ duration: 0.38 }}
                className="flex flex-col"
              >
                {/* Page intro */}
                <div className="mb-10">
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-2 mb-3"
                  >
                    <div
                      className="w-1 h-4 bg-violet-600"
                      style={{ boxShadow: "0 0 10px rgba(124,58,237,0.75)" }}
                    />
                    <span className="text-[8px] uppercase tracking-[0.5em] text-violet-700 font-bold">
                      Web Intelligence
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.55 }}
                    className={`${font.className} text-3xl sm:text-4xl font-bold text-white mb-2 leading-none`}
                  >
                    Search
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="text-[9px] uppercase tracking-[0.4em] text-slate-700 font-bold"
                  >
                    Real-time web synthesis · select or type a query
                  </motion.p>

                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{
                      delay: 0.38,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-px mt-4 origin-left"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(124,58,237,0.5), rgba(124,58,237,0.1), transparent)",
                    }}
                  />
                </div>

                {/* Suggestion grid */}
                <motion.div
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-px"
                  style={{
                    background: "rgba(124,58,237,0.06)",
                    border: `1px solid ${V.border}`,
                  }}
                >
                  {SUGGESTIONS.map((item, i) => (
                    <TiltCard
                      key={item.label}
                      onClick={() => setQuery(getDynamicQuery(item.label))}
                      className="group relative flex flex-col items-start p-5 sm:p-6 bg-[#03020a] text-left overflow-hidden cursor-pointer"
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(124,58,237,0.07) 0%, transparent 100%)",
                        }}
                      />
                      <div
                        className="absolute top-0 left-0 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, transparent 100%)",
                        }}
                      />

                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.5 + i * 0.07,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="text-violet-800 group-hover:text-violet-500 transition-colors duration-300 mb-4"
                      >
                        {item.icon}
                      </motion.div>

                      <span className="block text-[7px] uppercase tracking-[0.45em] text-slate-800 group-hover:text-violet-700/55 transition-colors mb-1.5 font-bold">
                        {item.category}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-600 group-hover:text-white transition-colors duration-200 leading-snug">
                        {item.label}
                      </span>

                      <motion.div
                        initial={{ opacity: 0, x: 5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="absolute bottom-3 right-3 text-violet-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <ArrowUpRight size={11} />
                      </motion.div>
                    </TiltCard>
                  ))}

                  {/* Status cell */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.95 }}
                    className="p-5 sm:p-6 bg-[#03020a] flex flex-col justify-end"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                        className="w-1.25 h-3 bg-violet-600"
                        style={{ boxShadow: "0 0 10px rgba(124,58,237,0.75)" }}
                      />
                      <span className="text-[7px] text-slate-800 uppercase tracking-[0.4em] font-bold">
                        Ready
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-900 italic">
                      Enter query to begin synthesis...
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              /* ── CHAT state ── */
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-16 sm:space-y-20"
              >
                {/* Session bar */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="flex items-center justify-between pb-4"
                  style={{ borderBottom: `1px solid ${V.border}` }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-violet-600"
                      style={{ boxShadow: "0 0 6px rgba(124,58,237,0.65)" }}
                    />
                    <span className="text-[8px] uppercase tracking-[0.4em] text-slate-700 font-bold">
                      {chat.filter(t => t.role === "user").length} quer
                      {chat.filter(t => t.role === "user").length !== 1
                        ? "ies"
                        : "y"}{" "}
                      · cached locally
                    </span>
                  </div>
                  <ClearHistoryButton onClear={clearHistory} />
                </motion.div>

                {chat.map((turn, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 36, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {turn.role === "user" ? (
                      <div className="flex flex-col gap-3">
                        <span className="text-[7px] uppercase tracking-[0.45em] text-slate-700 font-bold">
                          Query
                        </span>
                        <div
                          className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight text-slate-500 pl-5"
                          style={{ borderLeft: `2px solid ${V.border}` }}
                        >
                          {turn.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5">
                        {/* Response header */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`${font.className} text-[9px] uppercase tracking-[0.38em] text-white font-bold bg-violet-600 px-3 py-1`}
                            style={{ boxShadow: V.glow }}
                          >
                            Synthesis
                          </span>
                          {turn.mode && (
                            <span
                              className="text-[8px] uppercase tracking-[0.35em] text-violet-500/45 px-2 py-1 font-bold"
                              style={{
                                border: `1px solid rgba(124,58,237,0.18)`,
                              }}
                            >
                              {turn.mode}
                            </span>
                          )}
                          {turn.time !== undefined && turn.time > 0 && (
                            <span className="text-[9px] text-slate-700 ml-auto tabular-nums">
                              {turn.time}ms
                            </span>
                          )}
                        </div>

                        {/* Content / Error */}
                        {turn.content.toLowerCase().includes("error") ? (
                          <ErrorBlock content={turn.content} />
                        ) : idx === chat.length - 1 ? (
                          <div
                            className="text-base sm:text-lg md:text-xl whitespace-pre-wrap leading-[1.88] text-slate-200 font-medium pl-5 py-1"
                            style={{ borderLeft: `1px solid ${V.responseBar}` }}
                          >
                            <RevealWords text={turn.content} />
                          </div>
                        ) : (
                          <div
                            className="text-base sm:text-lg md:text-xl whitespace-pre-wrap leading-[1.88] text-slate-200 font-medium pl-5 py-1"
                            style={{ borderLeft: `1px solid ${V.responseBar}` }}
                          >
                            {turn.content}
                          </div>
                        )}

                        {/* Sources */}
                        {turn.sources && turn.sources.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.32 }}
                            className="flex flex-wrap gap-2 pt-1"
                          >
                            {turn.sources.map((src, si) => (
                              <motion.div
                                key={si}
                                initial={{ opacity: 0, scale: 0.88, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                  delay: 0.38 + si * 0.065,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                              >
                                <Link
                                  href={src}
                                  target="_blank"
                                  className="group flex items-center gap-2 px-3 py-1.5 text-[10px] transition-all duration-200 hover:text-violet-400"
                                  style={{
                                    border: "1px solid rgba(255,255,255,0.04)",
                                    background: "rgba(124,58,237,0.025)",
                                    backdropFilter: "blur(8px)",
                                  }}
                                  onMouseEnter={e =>
                                    (e.currentTarget.style.border =
                                      V.borderHover)
                                  }
                                  onMouseLeave={e =>
                                    (e.currentTarget.style.border =
                                      "1px solid rgba(255,255,255,0.04)")
                                  }
                                >
                                  <span className="text-slate-700 group-hover:text-violet-500 font-bold tabular-nums">
                                    {si + 1}
                                  </span>
                                  {new URL(src).hostname.replace("www.", "")}
                                  <ArrowUpRight
                                    size={10}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  />
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Loading ── */}
          <ChatSynthesizing loading={loading} />
        </div>
      </main>

      <Footer
        queryState={{ query, setQuery }}
        chatState={{ chat, setChat }}
        loadingState={{ loading, setLoading }}
      />
    </div>
  );
}
