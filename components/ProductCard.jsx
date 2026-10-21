"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import SmartImage from "./SmartImage";
import { useCart } from "./CartContext";
import { inr } from "@/lib/format";

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart();
  const href = `/product/${product.slug}`;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.1 }}
      className="card"
    >
      <div className="card-media">
        <Link href={href} data-cursor="View" aria-label={product.name} style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <SmartImage className="main" src={product.images[0]} alt={product.name} tone={product.tone} />
          <SmartImage className="alt" src={product.images[1]} alt="" tone={product.tone} />
        </Link>
        {product.isNew && <span className="card-badge">New</span>}
        <div className="card-quick">
          <small>Quick add</small>
          {product.sizes.map((s) => (
            <button key={s} className="size-chip" onClick={() => add(product, s)} aria-label={`Add ${product.name}, size ${s}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="card-info">
        <div>
          <Link href={href}><h3>{product.name}</h3></Link>
          <p>{product.color} · {product.category}</p>
        </div>
        <span className="price">{inr(product.price)}</span>
      </div>
    </motion.div>
  );
}
