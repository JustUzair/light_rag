import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function TiltCard({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), {
    stiffness: 260,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 260,
    damping: 28,
  });
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
