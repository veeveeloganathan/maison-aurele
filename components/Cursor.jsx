"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

// Custom cursor: small dot that grows into a label ("View", "Shop"...) over
// any element with a data-cursor attribute.
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState(null);
  const [hoverLink, setHoverLink] = useState(false);

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target.closest?.("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
      setHoverLink(!target && !!e.target.closest?.("a, button, select, input, textarea"));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div className="cursor" style={{ x: sx, y: sy }} aria-hidden>
      <AnimatePresence>
        {label ? (
          <motion.div
            key="label"
            className="cursor-label"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {label}
          </motion.div>
        ) : (
          <motion.div key="dot" className="cursor-dot" animate={{ scale: hoverLink ? 3.2 : 1 }} transition={{ duration: 0.3 }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
