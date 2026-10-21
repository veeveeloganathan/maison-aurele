"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartContext";
import SmartImage from "@/components/SmartImage";
import { SplitText, Reveal } from "@/components/Motion";
import { inr } from "@/lib/format";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, clear, ready } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "Tamil Nadu", pincode: "", gstin: "", payment: "upi" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items: items.map(({ productId, size, qty }) => ({ productId, size, qty })) }),
      });
      const data = await res.json();
      if (res.status === 422) setErrors(data.errors || {});
      else if (!res.ok) setServerError(data.error || "Something went wrong. Please try again.");
      else {
        clear();
        router.push(`/order/${data.id}`);
        return;
      }
    } catch {
      setServerError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  if (ready && items.length === 0 && !submitting) {
    return (
      <div className="success">
        <div>
          <SplitText as="h1" text="Your bag|is _empty" animateNow />
          <Reveal delay={0.4}><Link href="/shop" className="btn">Continue shopping</Link></Reveal>
        </div>
      </div>
    );
  }

  return (
    <form className="container checkout" onSubmit={submit} noValidate>
      <div>
        <span className="eyebrow">Secure checkout</span>
        <SplitText as="h1" className="page-title" text="Checkout" animateNow delay={0.3} />

        <Reveal delay={0.4}>
          <h2 className="form-section-title">Contact</h2>
          <div className="form-grid">
            <Field className="span2" label="Full name" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
            <Field label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
            <Field label="Mobile number" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel-national" maxLength={10} />
          </div>

          <h2 className="form-section-title">Delivery address</h2>
          <div className="form-grid">
            <Field className="span2" label="House no., street, area" textarea value={form.address} onChange={set("address")} error={errors.address} />
            <Field label="City" value={form.city} onChange={set("city")} error={errors.city} />
            <Field label="PIN code" value={form.pincode} onChange={set("pincode")} error={errors.pincode} inputMode="numeric" maxLength={6} />
            <div className="field">
              <select value={form.state} onChange={set("state")}>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <label>State</label>
            </div>
            <Field label="GSTIN (optional, for business)" value={form.gstin} onChange={set("gstin")} error={errors.gstin} maxLength={15} />
          </div>

          <h2 className="form-section-title">Payment</h2>
          <div className="pay-options">
            {[
              { id: "upi", t: "UPI / Cards", s: "Demo — no real payment is taken" },
              { id: "cod", t: "Cash on Delivery", s: "Pay when your order arrives" },
            ].map((o) => (
              <button type="button" key={o.id} className={`pay-option ${form.payment === o.id ? "active" : ""}`} onClick={() => setForm((f) => ({ ...f, payment: o.id }))}>
                <b>{o.t}</b>
                <small>{o.s}</small>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.6}>
        <aside className="summary">
          <h3>Order summary</h3>
          {items.map((it) => (
            <div key={it.key} className="line-item" style={{ gridTemplateColumns: "64px 1fr auto" }}>
              <SmartImage className="thumb" src={it.image} alt={it.name} tone={it.tone} style={{ width: 64 }} />
              <div>
                <h4 style={{ fontSize: 17 }}>{it.name}</h4>
                <div className="meta">Size {it.size} · Qty {it.qty}</div>
              </div>
              <div className="price">{inr(it.price * it.qty)}</div>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <div className="sum-row"><span>Subtotal</span><span>{inr(totals.subtotal)}</span></div>
            <div className="sum-row"><span>Shipping</span><span>{totals.shipping ? inr(totals.shipping) : "Free"}</span></div>
            <div className="sum-row"><span>GST included</span><span>{inr(totals.gstIncluded, { decimals: 2 })}</span></div>
            <div className="sum-row total"><span>Total</span><span>{inr(totals.total)}</span></div>
          </div>
          <AnimatePresence>
            {(serverError || errors.items) && (
              <motion.div className="alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {serverError || errors.items}
              </motion.div>
            )}
          </AnimatePresence>
          <button className="btn solid full" style={{ marginTop: 24 }} disabled={submitting || items.length === 0}>
            {submitting ? "Placing order…" : `Place order — ${inr(totals.total)}`}
          </button>
          <p className="eyebrow" style={{ marginTop: 14, textAlign: "center" }}>Demo store · No real charges</p>
        </aside>
      </Reveal>
    </form>
  );
}

function Field({ label, error, className = "", textarea, ...props }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className={`field ${className}`}>
      <Tag placeholder=" " {...props} aria-invalid={!!error} />
      <label>{label}</label>
      <AnimatePresence>
        {error && (
          <motion.div className="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
