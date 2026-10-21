# Maison Aurèle — Premium Clothing Store (Full-Stack Demo)

A luxury-minimal fashion storefront built with **Next.js 15 (App Router)**, **React 19**, **Framer Motion** and **Lenis** smooth scrolling, with a Node.js API backend.

## Run it

Requires Node.js 18.18 or newer (Node 20/22 recommended).

```bash
cd maison-aurele
npm install
npm run dev          # http://localhost:3000
```

Production: `npm run build && npm start`
Reset demo stock and clear orders: `npm run reset-db`

## What's inside

| Area | Details |
|---|---|
| Home | Preloader counter + panel reveal, split-text hero, scroll-scaled hero image, fabric marquee, scroll-highlighted manifesto, sticky horizontal product scroll, category list with cursor-following image, parallax editorial with counters, new arrivals grid |
| Shop | Category / gender / sort filters (animated pill), fetches `/api/products`, layout-animated grid, hover image swap + quick add |
| Product | Clip-path image reveals, size selector (shakes if none chosen), magnetic add-to-bag, animated accordion, related products |
| Cart | Slide-in drawer, animated line items, free-shipping progress bar, saved in browser (localStorage) |
| Checkout | Floating-label form, Indian validation (10-digit mobile, 6-digit PIN, optional GSTIN), UPI / COD, posts to `/api/orders` |
| Order | Order saved on the server, stock reduced, animated confirmation page |
| Global | Custom cursor, page transition curtain, hide-on-scroll header, film-grain texture, reduced-motion support, mobile responsive |

## API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/products?category=&gender=&sort=&q=` | List / filter products |
| GET | `/api/products/:slug` | Single product |
| POST | `/api/orders` | Create order (server re-prices items, validates, checks stock) |
| GET | `/api/orders/:id` | Fetch order |

## Data

- `data/products.json` — product catalogue (edit names, prices, images here)
- `data/products.seed.json` — original copy used by `npm run reset-db`
- `data/orders.json` — orders placed (created automatically)
- `lib/db.js` — the only file that touches storage. Replace it with Prisma/PostgreSQL, MongoDB, or an **Odoo / Tally integration** later without changing any UI.

## Pricing & GST

Prices are MRP in INR, inclusive of GST. `lib/pricing.js` holds the rules:
apparel up to ₹2,500 per piece at 5%, above that at 18%; free shipping above ₹2,999, otherwise ₹149.
These are demo settings — please confirm current GST rates with your CA before any live use.

## Images

Product photos are loaded from Unsplash for the demo. If any image fails to load, an elegant tonal placeholder is shown automatically.
For your own brand, put photos in `public/images/` and change the URLs in `data/products.json` to `/images/your-photo.jpg`.

## Folder structure

```
app/            pages + API routes (App Router)
components/     UI and animation components (Motion.jsx has reusable animations)
lib/            db, pricing, formatting helpers
data/           JSON data store
scripts/        reset-db script
```

## Not included (possible next steps)

Customer login and order history, admin panel for products/orders, real payment gateway (Razorpay / Cashfree), e-mail/WhatsApp notifications, e-invoice integration.
