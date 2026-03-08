import { motion } from "framer-motion";

const AmbientOrbs = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        animate={{ x: [0, 70, -50, 0], y: [0, -60, 40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -top-80 -left-80 w-225 h-225 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 65%)",
        }}
      />
      <motion.div
        animate={{ x: [0, -50, 40, 0], y: [0, 50, -60, 0] }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-80 -right-80 w-175 h-175 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 65%)",
        }}
      />
      <motion.div
        animate={{ x: [0, 25, -20, 0], y: [0, 20, -35, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-1/4 w-87.5 h-87.5 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 65%)",
        }}
      />
    </div>
  );
};

export default AmbientOrbs;
