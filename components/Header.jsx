"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useCart } from "./CartContext";

export default function Header() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(v > 40);
    setHidden(v > prev && v > 400);
  });

  useEffect(() => setHidden(false), [pathname]);

  const onDark = pathname === "/";

  return (
    <motion.header
      className={`header ${scrolled ? "scrolled" : ""} ${onDark ? "on-dark" : ""}`}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      <nav>
        <Link className="link-underline" href="/shop">Shop</Link>
        <Link className="link-underline" href="/shop?gender=Women">Women</Link>
        <Link className="link-underline" href="/shop?gender=Men">Men</Link>
      </nav>
      <Link href="/" className="logo">Aurèle</Link>
      <div className="right">
        <Link className="link-underline" href="/shop?sort=new">New In</Link>
        <button onClick={() => setOpen(true)} aria-label={`Open bag, ${count} items`}>
          Bag
          <span className="bag-count">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>
      </div>
    </motion.header>
  );
}
