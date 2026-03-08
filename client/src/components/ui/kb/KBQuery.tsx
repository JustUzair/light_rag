"use client";

import { useState, useRef, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import { API_URL } from "@/lib/config";
import { font } from "@/lib/data";
import RevealWords from "@/components/ui/RevealWords";
import { AskResponse } from "@/lib/types";

// ── Cyan accent constants ──────────────────────────────────────────────────
const C = {
  border: "rgba(6,182,212,0.1)",
  borderActive: "rgba(6,182,212,0.35)",
  glow: "0 0 22px rgba(6,182,212,0.28)",
  bar: "linear-gradient(to right, rgba(6,182,212,0.65), transparent)",
  responseBar: "rgba(6,182,212,0.18)",
};

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01#@!%";

function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    let iter = 0;
    const iv = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < iter) return text[i];
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join(""),
      );
      if (iter >= text.length) clearInterval(iv);
      iter += 0.6;
    }, 28);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{display}</span>;
}

function ConfidenceBar({ value }: { value: number }) {
  // value 0–1
  const pct = Math.round(value * 100);
  const color =
    pct >= 75
      ? "rgba(6,182,212,0.8)"
      : pct >= 45
        ? "rgba(251,146,60,0.8)"
        : "rgba(220,38,38,0.7)";
  return (
    <div className="flex items-center gap-3">
      <span className="lg:text-xl md:text-base text-xs uppercase tracking-[0.45em] text-slate-700 font-bold shrink-0">
        Confidence
      </span>
      <div
        className="flex-1 h-1 relative"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute inset-y-0 left-0 right-0 origin-left"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm font-black tabular-nums italic"
        style={{ color }}
      >
        {pct}%
      </motion.span>
    </div>
  );
}

export default function KBQuery({ ingestCount }: { ingestCount: number }) {
  const [question, setQuestion] = useState("");
  const [topK, setTopK] = useState(2);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number | null>(null);
  const [answerData, setAnswerData] = useState<AskResponse | null>(null);
  const [showSources, setShowSources] = useState(true);
  const [focused, setFocused] = useState(false);
  const [isLatest, setIsLatest] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  // Scroll answer into view on new response
  useEffect(() => {
    if (answerData) {
      setTimeout(() => {
        answerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 200);
    }
  }, [answerData]);

  async function handleAsk(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswerData(null);
    setTime(null);
    setIsLatest(false);
    const t0 = performance.now();
    try {
      const res = await fetch(`${API_URL}/api/v1/kb/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question, k: topK }),
      });
      const json: AskResponse | { error: string } = await res.json();
      if (!res.ok) throw new Error((json as any).error ?? "Ask failed");
      setAnswerData(json as AskResponse);
      setIsLatest(true);
    } catch (err: any) {
      // Surface error in answer area
      setAnswerData({
        answer: `error: ${err.message ?? "Ask failed"}`,
        sources: [],
        confidence: 0,
      });
      setIsLatest(true);
    } finally {
      setTime(Math.round(performance.now() - t0));
      setLoading(false);
    }
  }

  const canSubmit = question.trim().length > 0 && !loading;
  const isError = answerData?.answer.toLowerCase().startsWith("error");

  return (
    <div
      className="flex flex-col bg-[#03020a]"
      style={{ borderLeft: "1px solid rgba(6,182,212,0.05)" }}
    >
      {/* ── Panel header ── */}
      <div
        className="flex items-center justify-between px-7 pt-7 pb-5"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-[3px] h-5 bg-cyan-500"
            style={{ boxShadow: "0 0 8px rgba(6,182,212,0.7)" }}
          />
          <div>
            <span
              className={`${font.className} lg:text-4xl md:text-3xl text-xl font-bold text-white leading-none`}
            >
              Query
            </span>
            <div className="lg:text-base md:text-base text-sm  uppercase tracking-[0.45em] text-cyan-700/60 font-bold mt-0.5">
              // ASK YOUR CORPUS
            </div>
          </div>
        </div>

        {/* Corpus ready indicator — lights up when something has been ingested */}
        <AnimatePresence>
          {ingestCount > 0 && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                style={{ boxShadow: "0 0 6px rgba(6,182,212,0.8)" }}
              />
              <span className="text-xs uppercase tracking-[0.4em] text-cyan-700 font-bold">
                {ingestCount} doc{ingestCount !== 1 ? "s" : ""} indexed
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleAsk} className="flex flex-col gap-5 p-7">
        {/* Question input */}
        <div className="flex flex-col gap-2">
          <label className="lg:text-base md:text-base text-sm  uppercase tracking-[0.45em] text-slate-700 font-bold">
            Your Query
          </label>
          <div
            className="relative"
            style={{
              border: focused ? C.borderActive : C.border,
              background: focused
                ? "rgba(6,182,212,0.025)"
                : "rgba(255,255,255,0.01)",
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="AWAITING QUERY..."
              className="w-full bg-transparent text-white lg:text-sm md:text-sm text-xs uppercase tracking-widest placeholder:text-slate-900 outline-none px-4 py-3 font-medium disabled:opacity-50"
              style={{ fontFamily: "inherit" }}
              disabled={loading}
            />
            <motion.div
              animate={{ scaleX: focused ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 h-px origin-left"
              style={{ background: C.bar }}
            />
          </div>
        </div>

        {/* Top-K selector */}
        <div className="flex items-center gap-4 wrap-break-word flex-wrap">
          <label className="lg:text-base md:text-base text-sm  uppercase tracking-[0.45em] text-slate-700 font-bold shrink-0">
            Top-K Sources
          </label>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(k => (
              <motion.button
                key={k}
                type="button"
                onClick={() => setTopK(k)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="cursor-pointer w-12 h-12 flex items-center justify-center text-base font-black tabular-nums transition-colors duration-150"
                style={{
                  border:
                    topK === k
                      ? C.borderActive
                      : "1px solid rgba(255,255,255,0.04)",
                  background:
                    topK === k ? "rgba(6,182,212,0.1)" : "transparent",
                  color:
                    topK === k ? "rgba(6,182,212,0.9)" : "rgba(100,95,115,0.7)",
                  boxShadow: topK === k ? C.glow : "none",
                }}
              >
                {k}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!canSubmit}
          whileHover={canSubmit ? { scale: 1.01 } : {}}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
          className="relative flex items-center justify-center gap-2 py-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white overflow-hidden disabled:opacity-20 transition-colors"
          style={{
            background: "rgba(6,182,212,0.12)",
            border: `1px solid ${C.border}`,
            boxShadow: canSubmit ? C.glow : "none",
          }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,182,212,0.1), transparent)",
            }}
          />
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin text-cyan-400" />
              <ScrambleText text="Querying corpus..." />
            </>
          ) : (
            <span className="text-base flex items-center gap-2">
              <Search size={18} className="text-cyan-500 " />
              Ask KB
            </span>
          )}
        </motion.button>
      </form>

      {/* ── Loading waveform ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-7 pb-5"
          >
            <div
              className="pl-4 py-3"
              style={{ borderLeft: "1px solid rgba(6,182,212,0.3)" }}
            >
              <div className="flex gap-1 items-end h-6">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scaleY: [0.1, 1, 0.1],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 0.85,
                      repeat: Infinity,
                      delay: i * 0.075,
                      ease: "easeInOut",
                    }}
                    className="w-3 h-full origin-bottom"
                    style={{
                      background: "rgba(6,182,212,0.3)",
                      boxShadow: "0 0 4px rgba(6,182,212,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Answer ── */}
      <AnimatePresence>
        {answerData && (
          <motion.div
            ref={answerRef}
            key="answer"
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5 px-7 pb-8"
          >
            {/* Response header */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`${font.className} lg:text-base md:text-base text-xs uppercase tracking-[0.38em] text-white font-bold px-3 py-1`}
                style={{
                  background: isError
                    ? "rgba(220,38,38,0.7)"
                    : "rgba(6,182,212,0.18)",
                  border: isError
                    ? "1px solid rgba(220,38,38,0.35)"
                    : `1px solid ${C.border}`,
                  boxShadow: isError ? "none" : C.glow,
                }}
              >
                {isError ? "Error" : "Synthesis"}
              </span>

              {!isError && time !== null && (
                <span className="lg:text-sm md:text-sm text-xs text-slate-700 ml-auto tabular-nums">
                  {time}ms
                </span>
              )}
            </div>

            {/* Answer text */}
            <div
              className={`lg:text-[18px] md:text-base text-sm whitespace-pre-wrap leading-[1.85] font-medium pl-5 py-1
                ${isError ? "text-red-400/80" : "text-slate-200"}`}
              style={{
                borderLeft: isError
                  ? "1px solid rgba(220,38,38,0.25)"
                  : `1px solid ${C.responseBar}`,
              }}
            >
              {isLatest && !isError ? (
                <RevealWords text={answerData.answer} />
              ) : (
                answerData.answer
              )}
            </div>

            {/* Confidence bar */}
            {!isError && answerData.confidence > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <ConfidenceBar value={answerData.confidence} />
              </motion.div>
            )}

            {/* Sources toggle */}
            {!isError && answerData.sources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col gap-3"
              >
                <button
                  type="button"
                  onClick={() => setShowSources(s => !s)}
                  className="flex items-center gap-2 lg:text-base md:text-sm text-xs uppercase tracking-[0.45em] text-slate-700 hover:text-cyan-600 font-bold transition-colors duration-200 w-fit"
                >
                  <BookOpen size={18} />
                  Sources ({answerData.sources.length})
                  {showSources ? (
                    <ChevronUp size={10} />
                  ) : (
                    <ChevronDown size={10} />
                  )}
                </button>

                <AnimatePresence>
                  {showSources && (
                    <motion.div
                      key="sources"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div
                        className="flex flex-col gap-0 overflow-hidden"
                        style={{
                          border: `1px solid ${C.border}`,
                          background: "rgba(6,182,212,0.02)",
                        }}
                      >
                        {answerData.sources.map((src, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.35 }}
                            className="flex items-center gap-3 px-4 py-3 group hover:bg-cyan-500/5 transition-colors duration-150"
                            style={
                              i < answerData.sources.length - 1
                                ? { borderBottom: `1px solid ${C.border}` }
                                : {}
                            }
                          >
                            {/* Index */}
                            <span className="text-sm font-black tabular-nums text-cyan-800 group-hover:text-cyan-500 transition-colors shrink-0 w-5 text-center">
                              {i + 1}
                            </span>
                            {/* Divider */}
                            <div
                              className="w-px h-6 shrink-0"
                              style={{ background: C.border }}
                            />
                            {/* Source name */}
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="text-sm font-bold text-slate-500 group-hover:text-slate-200 transition-colors duration-150 truncate">
                                {src.source}
                              </span>
                              <span className="text-xs uppercase tracking-[0.4em] text-slate-800 font-bold">
                                chunk #{src.chunkId}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
