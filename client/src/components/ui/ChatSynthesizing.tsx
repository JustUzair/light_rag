import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import ScrambleOnMount from "./ScrambleOnMount";

const ChatSynthesizing = ({ loading }: { loading: boolean }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.38 }}
          className="mt-12"
        >
          <div
            className="pl-5 py-3"
            style={{ borderLeft: "1px solid rgba(124,58,237,0.32)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Loader2 size={13} className="animate-spin text-violet-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-violet-600">
                <ScrambleOnMount text="Synthesizing response..." />
              </span>
            </div>
            <div className="flex gap-1 items-end h-7">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [0.12, 1, 0.12],
                    opacity: [0.25, 0.9, 0.25],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.09,
                    ease: "easeInOut",
                  }}
                  className="w-4 sm:w-5 h-full bg-violet-600/20 origin-bottom rounded-sm"
                  style={{ boxShadow: "0 0 5px rgba(124,58,237,0.12)" }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatSynthesizing;
