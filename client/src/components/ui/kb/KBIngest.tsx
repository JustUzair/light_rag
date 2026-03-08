"use client";

import { useState, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { API_URL } from "@/lib/config";
import { font } from "@/lib/data";
import { IngestResult, Status } from "@/lib/types";

// ── Cyan accent constants ─────────────────────────────────────────────────
const C = {
  border: "rgba(6,182,212,0.1)",
  borderActive: "rgba(6,182,212,0.35)",
  glow: "0 0 22px rgba(6,182,212,0.28)",
  bar: "linear-gradient(to right, rgba(6,182,212,0.65), transparent)",
};

export default function KBIngest({ onIngested }: { onIngested: () => void }) {
  const [ingestText, setIngestText] = useState("");
  const [ingestSource, setIngestSource] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [sourceFocused, setSourceFocused] = useState(false);
  const [textFocused, setTextFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = ingestText.length;

  async function handleIngest(e: FormEvent) {
    e.preventDefault();
    if (!ingestText.trim()) return;
    setStatus({ type: "loading" });
    try {
      const res = await fetch(`${API_URL}/api/v1/kb/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: ingestText,
          source: ingestSource || undefined,
        }),
      });
      const json: IngestResult | { error: string } = await res.json();
      if (!res.ok) throw new Error((json as any).error ?? "Ingest failed");
      const result = json as IngestResult;
      setStatus({
        type: "success",
        msg: `${result.chunkCount} chunk${result.chunkCount !== 1 ? "s" : ""} indexed from "${result.source}"`,
      });
      onIngested();
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message ?? "Ingest failed" });
    }
  }

  function handleReset() {
    setIngestText("");
    setIngestSource("");
    setStatus({ type: "idle" });
    textareaRef.current?.focus();
  }

  const isLoading = status.type === "loading";
  const canSubmit = ingestText.trim().length > 0 && !isLoading;

  return (
    <div className="flex flex-col bg-[#03020a]">
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
              Ingest
            </span>
            <div className="lg:text-sm md:text-sm text-xs uppercase tracking-[0.45em] text-cyan-700/60 font-bold mt-0.5">
              // ADD DOCUMENTS
            </div>
          </div>
        </div>

        {/* Char counter */}
        <AnimatePresence>
          {charCount > 0 && (
            <motion.span
              key="counter"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
              className="text-xs font-black tabular-nums tracking-widest text-slate-700"
            >
              {charCount.toLocaleString()} chars
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleIngest} className="flex flex-col gap-5 p-7 flex-1">
        {/* Source label input */}
        <div className="flex flex-col gap-2">
          <label className="text-base sm:text-sm uppercase tracking-[0.45em] text-slate-700 font-bold">
            Source Label{" "}
            <span className="text-slate-900 normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <div
            className="relative"
            style={{
              border: sourceFocused ? C.borderActive : C.border,
              background: sourceFocused
                ? "rgba(6,182,212,0.025)"
                : "rgba(255,255,255,0.01)",
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            <input
              value={ingestSource}
              onChange={e => setIngestSource(e.target.value)}
              onFocus={() => setSourceFocused(true)}
              onBlur={() => setSourceFocused(false)}
              placeholder="e.g. company-policy-2025"
              className="w-full bg-transparent text-white lg:text-sm md:text-sm text-xs uppercase tracking-widest placeholder:text-slate-900 outline-none px-4 py-3 font-medium"
              style={{ fontFamily: "inherit" }}
              disabled={isLoading}
            />
            {/* Focus accent line */}
            <motion.div
              animate={{ scaleX: sourceFocused ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 h-px origin-left"
              style={{ background: C.bar }}
            />
          </div>
        </div>

        {/* Document textarea */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-base sm:text-sm uppercase tracking-[0.45em] text-slate-700 font-bold">
            Document Text / Markdown
          </label>
          <div
            className="relative flex-1"
            style={{
              border: textFocused ? C.borderActive : C.border,
              background: textFocused
                ? "rgba(6,182,212,0.02)"
                : "rgba(255,255,255,0.01)",
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            <textarea
              ref={textareaRef}
              value={ingestText}
              onChange={e => setIngestText(e.target.value)}
              onFocus={() => setTextFocused(true)}
              onBlur={() => setTextFocused(false)}
              placeholder="Paste documents, policy text, research notes, markdown..."
              className="w-full min-h-55 bg-transparent text-white lg:text-base md:text-base text-sm leading-relaxed placeholder:text-slate-900 outline-none resize-none px-4 py-3 font-medium"
              style={{
                fontFamily: "inherit",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(6,182,212,0.25) transparent",
              }}
              disabled={isLoading}
              spellCheck
            />
            <motion.div
              animate={{ scaleX: textFocused ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 h-px origin-left"
              style={{ background: C.bar }}
            />
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <motion.button
            type="button"
            onClick={handleReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600 hover:text-slate-300 transition-colors duration-200"
            style={{ border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <RotateCcw size={18} />
            <span className="hidden text-sm sm:inline">Reset</span>
          </motion.button>

          {/* Ingest */}
          <motion.button
            type="submit"
            disabled={!canSubmit}
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.95 } : {}}
            className="relative flex-1 flex items-center justify-center gap-2 py-2.5 text-[9px] font-bold uppercase tracking-[0.3em] text-white overflow-hidden disabled:opacity-25 transition-colors"
            style={{
              background: "rgba(6,182,212,0.15)",
              border: `1px solid ${C.border}`,
              boxShadow: canSubmit ? C.glow : "none",
            }}
          >
            {/* Shimmer on hover */}
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
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin text-cyan-400" />
                <span className="text-cyan-400">Ingesting...</span>
              </>
            ) : (
              <span className="text-base flex items-center gap-2">
                <Upload size={18} className="text-cyan-500" />
                <span>Ingest to KB</span>
              </span>
            )}
          </motion.button>
        </div>

        {/* ── Status feedback ── */}
        <AnimatePresence mode="wait">
          {status.type === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 px-4 py-3 relative overflow-hidden"
              style={{
                border: "1px solid rgba(6,182,212,0.2)",
                background: "rgba(6,182,212,0.04)",
              }}
            >
              {/* Scan line */}
              <motion.div
                animate={{ y: ["-100%", "200%"] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2,
                }}
                className="absolute inset-x-0 h-px pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)",
                }}
              />
              <CheckCircle2
                size={13}
                className="text-cyan-500 shrink-0 mt-0.5"
              />
              <div>
                <div className="text-[8px] uppercase tracking-[0.4em] text-cyan-600 font-black mb-0.5">
                  [ INGEST_COMPLETE ]
                </div>
                <div className="lg:text-sm text-xs text-cyan-400/70 font-medium">
                  {status.msg}
                </div>
              </div>
              {/* Bottom accent */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="absolute bottom-0 left-0 right-0 h-px origin-left"
                style={{ background: C.bar }}
              />
            </motion.div>
          )}

          {status.type === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 px-4 py-3"
              style={{
                border: "1px solid rgba(220,38,38,0.2)",
                background: "rgba(220,38,38,0.03)",
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              >
                <AlertTriangle
                  size={13}
                  className="text-red-500 shrink-0 mt-0.5"
                />
              </motion.div>
              <div>
                <div className="text-[8px] uppercase tracking-[0.4em] text-red-600 font-black mb-0.5">
                  [ INGEST_FAILED ]
                </div>
                <div className="lg:text-sm text-xs text-red-400/70 font-medium">
                  {status.msg}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
