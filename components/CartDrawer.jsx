"use client";
import Link from "next/link";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import SmartImage from "./SmartImage";
import { inr } from "@/lib/format";
import { FREE_SHIPPING_ABOVE } from "@/lib/pricing";
import { getLenis } from "./SmoothScroll";

const EASE = [0.76, 0, 0.24, 1];

export default function CartDrawer() {
  const { items, totals, update, open, setOpen } = useCart();

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop(); else l?.start();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const remaining = Math.max(0, FREE_SHIPPING_ABOVE + 1 - totals.subtotal);
  const pct = Math.min(100, (totals.subtotal / (FREE_SHIPPING_ABOVE + 1)) * 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="drawer-backdrop" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
          <motion.aside className="drawer" role="dialog" aria-label="Shopping bag" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.8, ease: EASE }} data-lenis-prevent>
            <div className="drawer-head">
              <h3>Your Bag</h3>
              <button className="eyebrow link-underline" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="drawer-body">
              {items.length === 0 ? (
                <div className="empty">
                  <p>Your bag is empty.</p>
                  <Link href="/shop" className="btn" onClick={() => setOpen(false)}>Discover the collection</Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((it, i) => (
                    <motion.div
                      key={it.key}
                      className="line-item"
                      layout
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                      exit={{ opacity: 0, x: 60, transition: { duration: 0.35 } }}
                    >
                      <SmartImage className="thumb" src={it.image} alt={it.name} tone={it.tone} />
                      <div>
                        <h4>{it.name}</h4>
                        <div className="meta">{it.color} · Size {it.size}</div>
                        <div className="qty">
                          <button onClick={() => update(it.key, it.qty - 1)} aria-label="Decrease">−</button>
                          <span>{it.qty}</span>
                          <button onClick={() => update(it.key, it.qty + 1)} aria-label="Increase">+</button>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="price">{inr(it.price * it.qty)}</div>
                        <button className="remove" onClick={() => update(it.key, 0)}>Remove</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            {items.length > 0 && (
              <div className="drawer-foot">
                <div className="free-ship">
                  {remaining > 0 ? <>Add <b>{inr(remaining)}</b> more for complimentary shipping</> : <>You have unlocked complimentary shipping</>}
                  <div className="bar"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: EASE }} /></div>
                </div>
                <div className="sum-row"><span>Subtotal</span><span>{inr(totals.subtotal)}</span></div>
                <div className="sum-row"><span>Shipping</span><span>{totals.shipping ? inr(totals.shipping) : "Free"}</span></div>
                <div className="sum-row total"><span>Total</span><span>{inr(totals.total)}</span></div>
                <p className="eyebrow" style={{ margin: "6px 0 18px" }}>Inclusive of GST {inr(totals.gstIncluded, { decimals: 2 })}</p>
                <Link href="/checkout" className="btn solid full" onClick={() => setOpen(false)}>Proceed to checkout</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
