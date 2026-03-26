"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface FadeInSectionProps {
  children:   ReactNode;
  delay?:     number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}

export default function FadeInSection({
  children, delay = 0, direction = "up", className = "",
}: FadeInSectionProps) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: direction === "up"    ?  20 : 0,
        x: direction === "left"  ? -20 : direction === "right" ? 20 : 0,
      }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
