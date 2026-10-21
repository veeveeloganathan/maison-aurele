"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ProductCard from "./ProductCard";
import { SplitText, Reveal } from "./Motion";

const GENDERS = ["All", "Women", "Men"];

export default function ShopClient({ initialProducts, categories, initial }) {
  const [filters, setFilters] = useState(initial);
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const params = new URLSearchParams();
    if (filters.category !== "All") params.set("category", filters.category);
    if (filters.gender !== "All") params.set("gender", filters.gender);
    if (filters.sort !== "featured") params.set("sort", filters.sort);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/shop?${qs}` : "/shop");

    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/products?${qs}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [filters]);

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  return (
    <div className="container page-top" style={{ paddingBottom: 140 }}>
      <Reveal><span className="eyebrow">Collection — AW 2026</span></Reveal>
      <SplitText as="h1" className="page-title" text={filters.gender === "All" ? "The _Collection" : `For _${filters.gender}`} key={filters.gender} />

      <div className="filters">
        <Chips name="cat" options={categories} value={filters.category} onChange={(v) => set("category", v)} />
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Chips name="gender" options={GENDERS} value={filters.gender} onChange={(v) => set("gender", v)} />
          <select className="select" value={filters.sort} onChange={(e) => set("sort", e.target.value)} aria-label="Sort">
            <option value="featured">Featured</option>
            <option value="new">New in</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <p className="eyebrow" style={{ marginBottom: 32 }}>
        {loading ? "Loading…" : `${products.length} ${products.length === 1 ? "piece" : "pieces"}`}
      </p>

      <motion.div className="grid" layout style={{ opacity: loading ? 0.5 : 1, transition: "opacity .4s" }}>
        <AnimatePresence>
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </AnimatePresence>
      </motion.div>

      {!loading && products.length === 0 && (
        <p className="serif" style={{ fontSize: 32, textAlign: "center", padding: "80px 0" }}>No pieces match these filters.</p>
      )}
    </div>
  );
}

function Chips({ name, options, value, onChange }) {
  return (
    <LayoutGroup id={name}>
      <div className="chips" role="radiogroup">
        {options.map((o) => (
          <button key={o} role="radio" aria-checked={value === o} className={`chip ${value === o ? "active" : ""}`} onClick={() => onChange(o)}>
            {value === o && <motion.span layoutId={`pill-${name}`} className="pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span>{o}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}
