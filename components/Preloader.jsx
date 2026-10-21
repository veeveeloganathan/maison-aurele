"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1];

// Counter 0 -> 100, then five panels slide up to reveal the page.
// Shown once per browser session.
export default function Preloader({ onDone }) {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("aurele-intro") === "1"; } catch {}
    if (seen) {
      setShow(false);
      onDone?.(true);
      return;
    }
    const controls = animate(0, 100, {
      duration: 2.2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        try { sessionStorage.setItem("aurele-intro", "1"); } catch {}
        setTimeout(() => {
          setShow(false);
          onDone?.(false);
        }, 250);
      },
    });
    return () => controls.stop();
  }, [onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="preloader" exit={{ transition: { duration: 1.2 } }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div key={i} className="panel" exit={{ y: "-100%" }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.07 }} />
          ))}
          <motion.div className="center" exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5 }}>
            <div className="count">{count}</div>
          </motion.div>
          <motion.div className="brand" exit={{ opacity: 0 }}>Maison Aurèle · Est. Tirupur</motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
