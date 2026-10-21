"use client";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1];
const EASE_OUT = [0.22, 1, 0.36, 1];

// Masked word-by-word reveal. Use "|" in text to force a line break.
export function SplitText({ text, as: Tag = "div", className, delay = 0, stagger = 0.06, once = true, animateNow = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  const show = animateNow || inView;
  const lines = text.split("|");
  let idx = 0;
  let inItalic = false; // "_word" opens italics, "word_" closes them
  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\|/g, " ")}>
      {lines.map((line, li) => (
        <span className="split-line" key={li} aria-hidden>
          {line.trim().split(" ").map((word, wi) => {
            const i = idx++;
            if (word.startsWith("_")) inItalic = true;
            const italic = inItalic;
            if (word.endsWith("_")) inItalic = false;
            const clean = word.replace(/^_|_$/g, "");
            return (
              <span className="split-word" key={wi}>
                <motion.span
                  initial={{ y: "110%", rotate: 4 }}
                  animate={show ? { y: "0%", rotate: 0 } : {}}
                  transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
                >
                  {italic ? <em>{clean}</em> : clean}
                  {" "}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

// Fade + rise when scrolled into view
export function Reveal({ children, delay = 0, y = 40, className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

// Image wipe reveal (clip-path curtain) + slow zoom-out
export function ImageReveal({ children, className, style, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ overflow: "hidden", ...style }}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      <motion.div
        style={{ width: "100%", height: "100%" }}
        initial={{ scale: 1.25 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.8, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Parallax wrapper: children move slower than the scroll
export function Parallax({ children, speed = 0.15, className, style }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  return (
    <div ref={ref} className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      <motion.div style={{ y, position: "absolute", inset: `-${speed * 100}% 0` }}>{children}</motion.div>
    </div>
  );
}

// Magnetic hover - element is pulled toward the pointer
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

// Text whose words light up as you scroll through it
export function ScrollHighlight({ text, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span className="w" style={{ opacity }}>
      {children}
    </motion.span>
  );
}
