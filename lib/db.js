// Lightweight file-based data store for the demo.
// Products live in data/products.json, orders in data/orders.json.
// Swap this module for Prisma / PostgreSQL / Odoo API later without touching the UI.
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJson(file, data) {
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, file);
}

// Simple in-process lock so concurrent orders don't overwrite each other.
let queue = Promise.resolve();
function withLock(fn) {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

export async function getProducts({ category, gender, sort, q } = {}) {
  let list = await readJson(PRODUCTS_FILE, []);
  if (category && category !== "All") list = list.filter((p) => p.category === category);
  if (gender && gender !== "All") list = list.filter((p) => p.gender === gender);
  if (q) {
    const s = q.toLowerCase();
    list = list.filter((p) => `${p.name} ${p.category} ${p.color}`.toLowerCase().includes(s));
  }
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "new") list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
  return list;
}

export async function getProductBySlug(slug) {
  const list = await readJson(PRODUCTS_FILE, []);
  return list.find((p) => p.slug === slug) || null;
}

export async function getCategories() {
  const list = await readJson(PRODUCTS_FILE, []);
  return [...new Set(list.map((p) => p.category))];
}

export async function createOrder(order) {
  return withLock(async () => {
    const products = await readJson(PRODUCTS_FILE, []);
    // Check & reduce stock
    for (const line of order.items) {
      const p = products.find((x) => x.id === line.productId);
      if (!p) throw new Error(`Product not found: ${line.productId}`);
      if (p.stock < line.qty) throw new Error(`Only ${p.stock} left of ${p.name}`);
    }
    for (const line of order.items) {
      products.find((x) => x.id === line.productId).stock -= line.qty;
    }
    const orders = await readJson(ORDERS_FILE, []);
    const number = `MA-${new Date().getFullYear()}-${String(orders.length + 1).padStart(5, "0")}`;
    const saved = {
      id: crypto.randomUUID(),
      number,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
      ...order,
    };
    orders.push(saved);
    await writeJson(PRODUCTS_FILE, products);
    await writeJson(ORDERS_FILE, orders);
    return saved;
  });
}

export async function getOrder(id) {
  const orders = await readJson(ORDERS_FILE, []);
  return orders.find((o) => o.id === id) || null;
}
