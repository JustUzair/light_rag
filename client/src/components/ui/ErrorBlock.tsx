import { parseError } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import GlitchText from "./GlitchText";
import RevealWords from "./RevealWords";

export default function ErrorBlock({ content }: { content: string }) {
  const { code, message } = parseError(content);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden"
      style={{
        border: "1px solid rgba(220,38,38,0.3)",
        background: "rgba(220,38,38,0.03)",
      }}
    >
      {/* Scan line */}
      <motion.div
        animate={{ y: ["-100%", "200%"] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1.8,
        }}
        className="absolute inset-x-0 h-px z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(220,38,38,0.6), transparent)",
        }}
      />
      {/* Brackets */}
      {[
        ["top-0 left-0", "borderTop borderLeft"],
        ["top-0 right-0", "borderTop borderRight"],
        ["bottom-0 left-0", "borderBottom borderLeft"],
        ["bottom-0 right-0", "borderBottom borderRight"],
      ].map(([pos], i) => (
        <div
          key={i}
          className={`absolute ${pos} w-4 h-4 pointer-events-none`}
          style={Object.fromEntries(
            ["Top", "Right", "Bottom", "Left"]
              .filter(
                (_, j) =>
                  (i === 0 && (j === 0 || j === 3)) ||
                  (i === 1 && (j === 0 || j === 1)) ||
                  (i === 2 && (j === 2 || j === 3)) ||
                  (i === 3 && (j === 2 || j === 1)),
              )
              .map(side => [`border${side}`, "1px solid rgba(220,38,38,0.7)"]),
          )}
        />
      ))}
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 pt-5 pb-3"
        style={{ borderBottom: "1px solid rgba(220,38,38,0.12)" }}
      >
        <motion.div
          animate={{ opacity: [1, 0.3, 1], scale: [1, 0.9, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        >
          <AlertTriangle size={14} className="text-red-500" />
        </motion.div>
        <GlitchText text="[ SYSTEM_ALERT ]" />
        {code && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="ml-auto text-[9px] font-black tabular-nums px-2 py-0.5"
            style={{
              background: "rgba(220,38,38,0.15)",
              border: "1px solid rgba(220,38,38,0.35)",
              color: "rgba(252,165,165,0.9)",
              letterSpacing: "0.15em",
            }}
          >
            ERR_{code}
          </motion.span>
        )}
      </div>
      {/* Body */}
      <div className="px-5 py-4 relative">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-5 right-5 h-px pointer-events-none"
            style={{
              top: `${20 + i * 14}%`,
              background: "rgba(220,38,38,0.04)",
            }}
            animate={{ scaleX: [1, 0.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
        <RevealWords
          text={message}
          className="text-base md:text-lg font-medium leading-relaxed"
          style={{ color: "rgba(252,165,165,0.85)" }}
        />
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="origin-left h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(220,38,38,0.7), rgba(220,38,38,0.1), transparent)",
        }}
      />
    </motion.div>
  );
}
