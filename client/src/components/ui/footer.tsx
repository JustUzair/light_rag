"use client";
// components/ui/footer.tsx  →  AXIOM Query Input Footer
import { API_URL } from "@/lib/config";
import { ChatTurn } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, CornerDownLeft } from "lucide-react";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

const MAX_ROWS = 6;
const LINE_HEIGHT = 22;
const BASE_HEIGHT = 56;

const Footer = ({
  queryState: { query, setQuery },
  chatState: { chat, setChat },
  loadingState: { loading, setLoading },
}: {
  queryState: { query: string; setQuery: Dispatch<SetStateAction<string>> };
  chatState: {
    chat: ChatTurn[];
    setChat: Dispatch<SetStateAction<ChatTurn[]>>;
  };
  loadingState: {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
  };
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [rows, setRows] = useState(1);

  // ── Auto-resize ──────────────────────────────────────────────────────────
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const scrollH = el.scrollHeight;
    const maxH = BASE_HEIGHT + LINE_HEIGHT * (MAX_ROWS - 1);
    el.style.height = `${Math.min(scrollH, maxH)}px`;
    setRows(
      Math.max(1, Math.min(Math.round((scrollH - 24) / LINE_HEIGHT), MAX_ROWS)),
    );
  }, []);

  useEffect(() => {
    resize();
  }, [query, resize]);

  // ── API ──────────────────────────────────────────────────────────────────
  async function runSearch(prompt: string) {
    setLoading(true);
    setChat(prev => [...prev, { role: "user", content: prompt }]);
    const t0 = performance.now();
    try {
      const res = await fetch(`${API_URL}/api/v1/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message ?? data.error ?? "Search failed");
      setChat(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          mode: data.mode,
          time: Math.round(performance.now() - t0),
        },
      ]);
    } catch (err: any) {
      setChat(prev => [
        ...prev,
        {
          role: "assistant",
          content: `${err.message}` || "System Fault. Request Terminated.",
          sources: [],
          time: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const submit = () => {
    const p = query.trim();
    if (!p || loading) return;
    setQuery("");
    if (textareaRef.current) {
      textareaRef.current.style.height = `${BASE_HEIGHT}px`;
      setRows(1);
    }
    runSearch(p);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return;
      if (e.metaKey || e.ctrlKey || rows === 1) {
        e.preventDefault();
        submit();
      }
    }
  };

  const charCount = query.length;
  const isNearLimit = charCount > 320;
  const isOverLimit = charCount > 400;

  return (
    <motion.footer
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.32, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 bg-[#03020a]/92 backdrop-blur-2xl px-4 sm:px-6 pt-4 pb-4"
      style={{ borderTop: "1px solid rgba(124,58,237,0.07)" }}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        {/* ── Input shell ── */}
        <div className="group relative">
          {/* Focus glow border */}
          <motion.div
            animate={{ opacity: focused ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="absolute -inset-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(124,58,237,0.7), rgba(167,139,250,0.25), rgba(124,58,237,0.7))",
              backgroundSize: "200% 100%",
              animation: focused ? "shimmerBorder 2.6s ease infinite" : "none",
            }}
          />

          {/* Inner box */}
          <div
            className="relative flex items-end overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.05)",
              background: focused ? "#07050f" : "#050310",
              transition: "background 0.3s",
            }}
          >
            {/* Prompt sigil */}
            <motion.span
              animate={{
                color: focused ? "rgb(167,139,250)" : "rgb(76,48,140)",
                opacity: focused ? 1 : 0.55,
              }}
              transition={{ duration: 0.22 }}
              className="hidden xs:flex items-center self-end pb-[18px] pl-5 text-sm font-black select-none shrink-0"
              style={{ fontFamily: "inherit" }}
            >
              {">"}_
            </motion.span>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="AWAITING QUERY..."
              rows={1}
              disabled={loading}
              autoCorrect="on"
              autoCapitalize="sentences"
              spellCheck
              className="flex-1 bg-transparent text-white text-xs sm:text-sm uppercase tracking-widest placeholder:text-slate-900 outline-none resize-none px-4 py-[17px] disabled:cursor-not-allowed min-w-0 overflow-y-auto leading-[22px]"
              style={{
                fontFamily: "inherit",
                height: `${BASE_HEIGHT}px`,
                maxHeight: `${BASE_HEIGHT + LINE_HEIGHT * (MAX_ROWS - 1)}px`,
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(124,58,237,0.3) transparent",
              }}
            />

            {/* Right column */}
            <div className="flex flex-col items-end justify-center self-stretch pr-2 shrink-0">
              {/* Char counter anchor */}
              <div className="relative w-full h-0 flex justify-end">
                <AnimatePresence>
                  {charCount > 0 && (
                    <motion.span
                      key="counter"
                      initial={{
                        opacity: 0,
                        y: 6,
                        filter: "blur(6px)",
                        scale: 0.9,
                      }}
                      animate={{
                        opacity: 1,
                        y: -14,
                        filter: "blur(0px)",
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 8,
                        filter: "blur(4px)",
                        scale: 0.85,
                      }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className={`absolute whitespace-nowrap text-[7px] font-black tabular-nums tracking-[0.35em] transition-colors duration-300
                        ${isOverLimit ? "text-red-400" : isNearLimit ? "text-violet-400" : "text-slate-700"}`}
                    >
                      {charCount}
                      {isNearLimit && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 0.45, x: 0 }}
                          className="text-[7px]"
                        >
                          /400
                        </motion.span>
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading || query.trim().length < 2 || isOverLimit}
                whileHover={{ backgroundColor: "rgb(139,92,246)", scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                className="relative flex items-center justify-center gap-1.5 h-10 px-4 sm:px-6 bg-violet-600 text-white font-black text-[9px] uppercase tracking-[0.25em] z-10 overflow-hidden disabled:opacity-20 transition-colors"
                style={{ boxShadow: "0 0 26px rgba(124,58,237,0.28)" }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: "100%", opacity: 1 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                  }}
                />
                {loading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <>
                    <span className="hidden xs:inline">Execute</span>
                    <Send size={11} />
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Multiline keyboard hint */}
          <AnimatePresence>
            {focused && rows > 1 && (
              <motion.div
                key="hint"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.18 }}
                className="absolute -bottom-6 left-1 flex items-center gap-1.5 text-[7px] sm:text-[8px] text-slate-800 font-bold tracking-[0.3em] uppercase pointer-events-none"
              >
                <CornerDownLeft size={8} className="text-slate-800" />
                <span>Shift+Enter newline · Enter submit</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metadata row */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[7px] sm:text-[8px] font-bold tracking-[0.22em] sm:tracking-[0.3em] uppercase text-slate-900 px-0.5">
          <span className="tabular-nums whitespace-nowrap">
            LAT: {chat[chat.length - 1]?.time ?? "—"}ms
          </span>
          <span className="whitespace-nowrap">REF: 01.A</span>
          <span className="whitespace-nowrap">
            TURNS: {chat.filter(c => c.role === "user").length}
          </span>
          <span className="ml-auto text-violet-950/60 italic normal-case tracking-normal hidden xs:block">
            Web Intelligence · AXIOM
          </span>
        </div>
      </form>

      {/* shimmerBorder keyframe — injected once */}
      <style>{`
        @keyframes shimmerBorder {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.footer>
  );
};

export default Footer;
