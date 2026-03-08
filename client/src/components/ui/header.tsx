"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Database } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV = [
  {
    href: "/search",
    label: "Search",
    short: "SRC",
    icon: <Search size={18} />,
  },
  {
    href: "/kb",
    label: "Knowledge",
    short: "KB",
    icon: <Database size={18} />,
  },
];

export default function Header({ font }: { font: any }) {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 h-20 bg-[#03020a]/88 backdrop-blur-2xl"
      style={{ borderBottom: "1px solid rgba(124,58,237,0.08)" }}
    >
      {/* ── Brand ── */}
      <Link href="/" className="group flex items-center lg:gap-2.5 gap-3">
        <motion.div
          whileHover={{ rotate: 90, scale: 1.06 }}
          transition={{ duration: 0.32, ease: "easeInOut" }}
          className="flex h-12 w-12 items-center justify-center shrink-0"
        >
          <Image src={"/logo.svg"} alt="AXIOM" width={100} height={100} />
        </motion.div>
        <div className="hidden sm:block">
          <div
            className={`${font.className} lg:text-2xl md:text-xl text-sm font-bold text-white leading-none tracking-tight`}
            style={{ textShadow: "0 0 32px rgba(167,139,250,0.15)" }}
          >
            AXIOM
          </div>
          <div className="text-xs uppercase tracking-[0.42em] text-violet-500/55 font-bold mt-0.5">
            Synthesis Engine
          </div>
        </div>
        {/* Mobile: just wordmark */}
        <span
          className={`${font.className} sm:hidden text-2xl font-bold text-white tracking-tight`}
        >
          AXIOM
        </span>
      </Link>

      {/* ── Nav ── */}
      <nav className="flex items-center gap-0.5 sm:gap-1">
        {NAV.map(item => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 lg:text-base md:text-xl  text-xs font-bold uppercase tracking-[0.28em] sm:tracking-[0.32em] transition-colors duration-200"
              style={{
                border: isActive
                  ? "1px solid rgba(124,58,237,0.2)"
                  : "1px solid transparent",
                background: isActive ? "rgba(124,58,237,0.08)" : "transparent",
                color: isActive
                  ? "rgba(192,173,255,0.9)"
                  : "rgba(100,95,115,0.85)",
              }}
              onMouseEnter={e =>
                !isActive &&
                (e.currentTarget.style.color = "rgba(192,173,255,0.65)")
              }
              onMouseLeave={e =>
                !isActive &&
                (e.currentTarget.style.color = "rgba(100,95,115,0.85)")
              }
            >
              <span className={isActive ? "text-violet-400" : "text-slate-700"}>
                {item.icon}
              </span>
              {/* Desktop label */}
              <span className="hidden sm:inline">{item.label}</span>
              {/* Mobile label */}
              <span className="inline sm:hidden">{item.short}</span>

              {/* Active underline */}
              {isActive && (
                <motion.div
                  layoutId="header-active-bar"
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(124,58,237,0.7), rgba(124,58,237,0.1))",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 38 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Status indicator ── */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.45, 1], opacity: [0.85, 0.4, 0.85] }}
          transition={{ duration: 2.3, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          style={{ boxShadow: "0 0 8px rgba(52,211,153,0.9)" }}
        />
        <span className="lg:text-xl md:text-base text-sm text-emerald-500/60 font-bold tracking-[0.3em] hidden md:block">
          Online
        </span>
      </div>
    </motion.header>
  );
}
