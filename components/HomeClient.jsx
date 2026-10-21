"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useInView, animate } from "framer-motion";
import Preloader from "./Preloader";
import SmartImage from "./SmartImage";
import ProductCard from "./ProductCard";
import { SplitText, Reveal, ImageReveal, Magnetic, ScrollHighlight } from "./Motion";
import { inr } from "@/lib/format";

const EASE = [0.76, 0, 0.24, 1];
const HERO_IMG = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=80";
const EDITORIAL_IMG = "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80";

export default function HomeClient({ products, categories }) {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);
  const featured = products.filter((p) => p.featured);
  const newIn = products.filter((p) => p.isNew).slice(0, 6);

  return (
    <>
      <Preloader onDone={onDone} />
      <Hero ready={ready} />
      <Marquee />
      <Intro />
      <HorizontalCollection products={featured} />
      <Categories categories={categories} />
      <Editorial />
      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">New arrivals</span>
            <SplitText as="h2" text="Just _landed" />
          </div>
          <Reveal><Link href="/shop?sort=new" className="btn">View all</Link></Reveal>
        </div>
        <div className="grid">
          {newIn.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </>
  );
}

function Hero({ ready }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="hero">
      <motion.div className="hero-media" style={{ scale, y }}>
        <motion.div
          style={{ width: "100%", height: "100%" }}
          initial={{ clipPath: "inset(14% 14% 14% 14%)", scale: 1.3 }}
          animate={ready ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 } : {}}
          transition={{ duration: 1.8, ease: EASE }}
        >
          <SmartImage src={HERO_IMG} alt="Maison Aurèle Autumn Winter collection" tone="#4a4038" eager />
        </motion.div>
      </motion.div>
      <motion.div className="hero-content" style={{ y: textY, opacity }}>
        <SplitText as="h1" text="Quiet|_luxury,_ worn" animateNow={ready} delay={0.5} stagger={0.09} />
        <motion.div
          className="hero-side"
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow" style={{ color: "rgba(244,240,234,.6)" }}>Autumn / Winter 2026</p>
          <p>Considered pieces in natural fibres — cut to last, made to be lived in.</p>
          <Magnetic>
            <Link href="/shop" className="btn light" data-cursor="Shop">Explore the collection</Link>
          </Magnetic>
        </motion.div>
      </motion.div>
      <div className="scroll-cue" />
    </section>
  );
}

function Marquee() {
  const words = ["Merino", "Mulberry silk", "Belgian linen", "Supima cotton", "Cashmere", "Selvedge denim"];
  const row = [...words, ...words];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {row.map((w, i) => <span key={i}>{w}</span>)}
      </div>
    </div>
  );
}

function Intro() {
  return (
    <section className="section container intro">
      <Reveal><span className="eyebrow">( Our philosophy )</span></Reveal>
      <div>
        <ScrollHighlight
          className="big"
          text="We make fewer things, better. Every Aurèle piece begins with the fibre — sourced with care, knitted and finished by hand in Tirupur, and designed to stay in your wardrobe for years, not seasons."
        />
        <Reveal delay={0.2} style={{ marginTop: 40 }}>
          <Link href="/shop" className="link-underline eyebrow" style={{ color: "var(--ink)" }}>Discover the atelier →</Link>
        </Reveal>
      </div>
    </section>
  );
}

function HorizontalCollection({ products }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const sx = useSpring(x, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 40));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [products.length]);

  return (
    <section ref={ref} className="hscroll" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="hscroll-sticky">
        <div className="hscroll-title">
          <div>
            <span className="eyebrow">The edit — {String(products.length).padStart(2, "0")} pieces</span>
            <SplitText as="h2" text="Signature _pieces" />
          </div>
          <Link href="/shop" className="link-underline eyebrow" style={{ color: "var(--ink)" }}>Shop all</Link>
        </div>
        <motion.div ref={trackRef} className="hscroll-track" style={{ x: sx }}>
          {products.map((p, i) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="hscroll-item card" data-cursor="View">
              <div className="card-media">
                <SmartImage className="main" src={p.images[0]} alt={p.name} tone={p.tone} />
                <SmartImage className="alt" src={p.images[1]} alt="" tone={p.tone} />
              </div>
              <div className="card-info">
                <div>
                  <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{p.name}</h3>
                </div>
                <span className="price">{inr(p.price)}</span>
              </div>
            </Link>
          ))}
        </motion.div>
        <div className="progress"><motion.div style={{ scaleX: scrollYProgress }} /></div>
      </div>
    </section>
  );
}

function Categories({ categories }) {
  const [active, setActive] = useState(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 20 });
  const sy = useSpring(my, { stiffness: 150, damping: 20 });

  return (
    <section
      className="section container"
      onPointerMove={(e) => { mx.set(e.clientX - 140); my.set(e.clientY - 180); }}
    >
      <div className="section-head">
        <div>
          <span className="eyebrow">Categories</span>
          <SplitText as="h2" text="Shop by _form" />
        </div>
      </div>
      <div className="cat-list" onPointerLeave={() => setActive(null)}>
        {categories.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.06} y={30}>
            <Link href={`/shop?category=${encodeURIComponent(c.name)}`} className="cat-row" onPointerEnter={() => setActive(i)} data-cursor="Shop">
              <h3>{c.name}</h3>
              <span className="count">({String(c.count).padStart(2, "0")})</span>
            </Link>
          </Reveal>
        ))}
      </div>
      <motion.div className="cat-float" style={{ x: sx, y: sy }}>
        <AnimatePresence mode="popLayout">
          {active !== null && (
            <motion.div
              key={active}
              style={{ position: "absolute", inset: 0 }}
              initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.2 }}
              animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <SmartImage src={categories[active].image} alt={categories[active].name} tone={categories[active].tone} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <b ref={ref}>{val}{suffix}</b>;
}

function Editorial() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <section ref={ref} className="section container editorial" style={{ background: "var(--paper)" }}>
      <ImageReveal className="editorial-media">
        <motion.div style={{ y, position: "absolute", inset: "-12% 0" }}>
          <SmartImage src={EDITORIAL_IMG} alt="Inside the Aurèle atelier" tone="#5a4e44" style={{ width: "100%", height: "100%" }} />
        </motion.div>
      </ImageReveal>
      <div>
        <Reveal><span className="eyebrow">The atelier</span></Reveal>
        <SplitText as="h2" text="Made slowly,|in _Tirupur" />
        <Reveal delay={0.2}>
          <p>From yarn to final press, each garment passes through the hands of artisans who have worked with knits for generations. We work in small batches, so nothing is wasted and everything is checked twice.</p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="stats">
            <div><Counter to={38} /><span>Artisans</span></div>
            <div><Counter to={100} suffix="%" /><span>Natural fibre</span></div>
            <div><Counter to={12} /><span>Steps of finishing</span></div>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <Magnetic><Link href="/shop" className="btn">Shop the collection</Link></Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
