"use client";
import { useState, useCallback } from "react";
import Header from "@/components/ui/header";
import Background from "@/components/ui/background";
import ModuleCards from "@/components/ui/ModuleCards";
import { Syne } from "next/font/google";

import dynamic from "next/dynamic";
const Hero = dynamic(() => import("@/components/ui/Hero"), {
  ssr: false,
});

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });
export default function LandingPage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [heroReady, setHeroReady] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      className="min-h-screen bg-[#03020a] text-slate-300 overflow-x-hidden"
      onMouseMove={onMouseMove}
      style={{
        fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
      }}
    >
      <Background mouse={mouse} />
      <Header font={syne} />
      {/* ══ HERO — Spline and Typographies ══ */}
      <Hero font={syne} onLoad={() => setHeroReady(true)} />
      {/* ══ LCEL + RAG Module Cards ══ */}
      {heroReady && <ModuleCards font={syne} />}
    </div>
  );
}
