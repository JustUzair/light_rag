import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ClearHistoryButton({
  onClear,
}: {
  onClear: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleClick = () => {
    if (confirm) {
      onClear();
      setConfirm(false);
    } else {
      setConfirm(true);
      timerRef.current = setTimeout(() => setConfirm(false), 3000);
    }
  };
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`group relative flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.35em] transition-all duration-200
        ${
          confirm
            ? "border border-violet-400/40 bg-violet-300/10 text-violet-200"
            : "border border-[#ffffff06] bg-violet-600 text-white"
        }`}
      title="Clear session history"
    >
      <AnimatePresence mode="wait">
        {confirm ? (
          <motion.span
            key="c"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            className="flex items-center gap-1.5"
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            >
              <AlertTriangle size={10} />
            </motion.div>
            Confirm clear?
          </motion.span>
        ) : (
          <motion.span
            key="i"
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            className="flex items-center gap-1.5"
          >
            <Trash2
              size={10}
              className="group-hover:text-red-400 transition-colors"
            />
            Clear history
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {confirm && (
          <motion.div
            key="bar"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-0.5 origin-left z-10 bg-violet-400"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
