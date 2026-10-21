"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmartImage from "./SmartImage";
import ProductCard from "./ProductCard";
import { SplitText, Reveal, ImageReveal, Magnetic } from "./Motion";
import { useCart } from "./CartContext";
import { inr } from "@/lib/format";
import { gstRateFor } from "@/lib/pricing";

const EASE_OUT = [0.22, 1, 0.36, 1];

export default function ProductClient({ product, related }) {
  const { add } = useCart();
  const [size, setSize] = useState(null);
  const [shake, setShake] = useState(0);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    if (!size) { setShake((s) => s + 1); return; }
    add(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      <div className="container pdp">
        <div className="pdp-gallery">
          {product.images.map((src, i) => (
            <ImageReveal key={src + i} className="frame" delay={i === 0 ? 0.3 : 0}>
              <SmartImage src={src} alt={`${product.name} view ${i + 1}`} tone={product.tone} eager={i === 0} />
            </ImageReveal>
          ))}
        </div>

        <div className="pdp-info">
          <motion.nav className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Link href="/shop" className="link-underline">Shop</Link> / <Link href={`/shop?category=${product.category}`} className="link-underline">{product.category}</Link>
          </motion.nav>
          <SplitText as="h1" text={product.name} animateNow delay={0.4} />
          <Reveal delay={0.6} y={20}>
            <div className="price">{inr(product.price)}</div>
            <div className="tax">MRP inclusive of all taxes (GST {gstRateFor(product.price)}%)</div>
            <p style={{ color: "var(--muted)", margin: "24px 0 32px", maxWidth: 440 }}>{product.description}</p>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="eyebrow" style={{ color: "var(--ink)" }}>Select size</span>
              <span className="eyebrow">Colour — {product.color}</span>
            </div>
            <motion.div key={shake} className="pdp-sizes" animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.45 }}>
              {product.sizes.map((s) => (
                <button key={s} className={`size-chip ${size === s ? "active" : ""}`} onClick={() => setSize(s)} aria-pressed={size === s}>
                  {s}
                </button>
              ))}
            </motion.div>

            <Magnetic strength={0.15}>
              <button className="btn solid" style={{ minWidth: 300 }} onClick={onAdd} disabled={product.stock <= 0}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={added ? "a" : size ? "b" : "c"} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}>
                    {product.stock <= 0 ? "Sold out" : added ? "Added to bag ✓" : size ? `Add to bag — ${inr(product.price)}` : "Select a size"}
                  </motion.span>
                </AnimatePresence>
              </button>
            </Magnetic>
            {product.stock > 0 && product.stock <= 10 && <p className="stock-note">Only {product.stock} left in stock</p>}

            <div className="accordion">
              <Accordion title="Fabric & care" defaultOpen>
                {product.fabric}. Dry clean or gentle hand wash in cold water. Dry flat in shade. Steam, do not iron directly.
              </Accordion>
              <Accordion title="Delivery & returns">
                Complimentary shipping across India on orders above ₹2,999. Dispatched in 2–4 working days. Easy returns within 15 days of delivery.
              </Accordion>
              <Accordion title="GST invoice">
                A GST tax invoice is issued with every order. Add your GSTIN at checkout to claim input tax credit on business purchases.
              </Accordion>
            </div>
          </Reveal>
        </div>
      </div>

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Complete the look</span>
            <SplitText as="h2" text="You may _also like" />
          </div>
        </div>
        <div className="grid">
          {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </>
  );
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="acc-item">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {title}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease: EASE_OUT }}>+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
            <div>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
