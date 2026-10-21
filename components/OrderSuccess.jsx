"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SplitText, Reveal } from "./Motion";
import { inr, ddmmyyyy } from "@/lib/format";

export default function OrderSuccess({ order }) {
  const first = order.customer.name.split(" ")[0];
  return (
    <div className="success">
      <div style={{ width: "100%" }}>
        <svg className="check-circle" viewBox="0 0 96 96" aria-hidden>
          <motion.circle cx="48" cy="48" r="46" fill="none" stroke="currentColor" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.4 }} />
          <motion.path d="M30 49 L43 62 L67 36" fill="none" stroke="currentColor" strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.4 }} />
        </svg>
        <span className="eyebrow">Order {order.number}</span>
        <SplitText as="h1" text={`Thank you,|_${first}_`} animateNow delay={0.6} />
        <Reveal delay={1.2}>
          <p style={{ color: "var(--muted)" }}>
            Your order was placed on {ddmmyyyy(order.createdAt)}. A confirmation will be sent to your email.
          </p>
        </Reveal>

        <Reveal delay={1.4} className="order-card">
          {order.items.map((it) => (
            <div key={`${it.productId}-${it.size}`} className="sum-row" style={{ padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--ink)" }}>
              <span>{it.name} · {it.size} × {it.qty}</span>
              <span>{inr(it.price * it.qty)}</span>
            </div>
          ))}
          <div className="sum-row" style={{ marginTop: 12 }}><span>Shipping</span><span>{order.totals.shipping ? inr(order.totals.shipping) : "Free"}</span></div>
          <div className="sum-row"><span>GST included</span><span>{inr(order.totals.gstIncluded, { decimals: 2 })}</span></div>
          <div className="sum-row total"><span>Total</span><span>{inr(order.totals.total)}</span></div>
          <div className="sum-row" style={{ marginTop: 16 }}><span>Payment</span><span>{order.payment.method}</span></div>
          <div className="sum-row"><span>Deliver to</span><span style={{ textAlign: "right" }}>{order.customer.city}, {order.customer.state} {order.customer.pincode}</span></div>
        </Reveal>

        <Reveal delay={1.6}>
          <Link href="/shop" className="btn">Continue shopping</Link>
        </Reveal>
      </div>
    </div>
  );
}
