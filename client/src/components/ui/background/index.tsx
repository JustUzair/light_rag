"use client";

import { motion } from "framer-motion";
import React, { Dispatch, SetStateAction } from "react";
import AmbientOrbs from "./AmbientOrbs";
import MouseSpotlight from "./MouseSpotlight";
import NoiseGrain from "./NoiseGrain";
import Grid from "./Grid";

export default function Background({
  mouse,
}: {
  mouse: { x: number; y: number };
}) {
  return (
    <>
      <AmbientOrbs />
      <MouseSpotlight mouse={mouse} />
      <NoiseGrain />
      <Grid />
    </>
  );
}
