"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const [sent, setSent] = useState(false);

  return (
    <footer ref={ref} className="footer container">
      <div className="footer-top">
        <div>
          <h4>The Journal</h4>
          <p className="serif" style={{ fontSize: 34, lineHeight: 1.1, margin: 0, maxWidth: 460 }}>
            Private previews, atelier stories and first access to new collections.
          </p>
          {sent ? (
            <p style={{ marginTop: 24 }}>Thank you. You are on the list.</p>
          ) : (
            <form className="newsletter" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <input type="email" required placeholder="Your email address" aria-label="Email" />
              <button className="eyebrow" style={{ color: "inherit" }}>Subscribe →</button>
            </form>
          )}
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link className="link-underline" href="/shop?gender=Women">Women</Link></li>
            <li><Link className="link-underline" href="/shop?gender=Men">Men</Link></li>
            <li><Link className="link-underline" href="/shop?category=Knitwear">Knitwear</Link></li>
            <li><Link className="link-underline" href="/shop?category=Outerwear">Outerwear</Link></li>
          </ul>
        </div>
        <div>
          <h4>Client Care</h4>
          <ul>
            <li>Shipping across India</li>
            <li>Easy 15-day returns</li>
            <li>GST invoice on every order</li>
            <li>Tirupur, Tamil Nadu</li>
          </ul>
        </div>
      </div>
      <motion.div className="footer-word" style={{ y }}>Aurèle</motion.div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Maison Aurèle — Demo store</span>
        <span>Crafted with care</span>
      </div>
    </footer>
  );
}
