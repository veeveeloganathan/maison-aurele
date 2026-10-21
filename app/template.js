"use client";
import { motion } from "framer-motion";

// Page transition: an ink curtain sweeps away and content rises in on every route change.
export default function Template({ children }) {
  return (
    <>
      <motion.div
        aria-hidden
        style={{ position: "fixed", inset: 0, background: "#141312", zIndex: 9400, transformOrigin: "top", pointerEvents: "none" }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
      >
        {children}
      </motion.div>
    </>
  );
}
