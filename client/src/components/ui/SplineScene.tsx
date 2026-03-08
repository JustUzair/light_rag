"use client";

import { SPLINE_URL } from "@/lib/data";
import dynamic from "next/dynamic";

// Dynamically import Spline and disable SSR
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export default function SplineScene({ onLoad }: { onLoad?: () => void }) {
  return <Spline scene={SPLINE_URL} onLoad={onLoad} />;
}
