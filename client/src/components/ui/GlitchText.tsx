import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function GlitchText({ text }: { text: string }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const t = setInterval(
      () => {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 120);
      },
      3000 + Math.random() * 2000,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block">
      <span
        className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500"
        style={{ textShadow: "0 0 18px rgba(220,38,38,0.6)" }}
      >
        {text}
      </span>
      <AnimatePresence>
        {glitching && (
          <>
            <motion.span
              key="r"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7, x: 2, skewX: 4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.06 }}
              className="absolute inset-0 text-[10px] font-black uppercase tracking-[0.3em]"
              style={{ color: "rgba(239,68,68,0.7)", mixBlendMode: "screen" }}
              aria-hidden
            >
              {text}
            </motion.span>
            <motion.span
              key="b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5, x: -2, skewX: -3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.06, delay: 0.03 }}
              className="absolute inset-0 text-[10px] font-black uppercase tracking-[0.3em]"
              style={{ color: "rgba(167,20,20,0.5)", mixBlendMode: "screen" }}
              aria-hidden
            >
              {text}
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </span>
  );
}
