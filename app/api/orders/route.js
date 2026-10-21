import { NextResponse } from "next/server";
import { createOrder, getProducts } from "@/lib/db";
import { computeTotals } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const PINCODE = /^[1-9][0-9]{5}$/;
const PHONE = /^[6-9][0-9]{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { customer = {}, items = [] } = body;

  const errors = {};
  if (!customer.name?.trim()) errors.name = "Name is required";
  if (!EMAIL.test(customer.email || "")) errors.email = "Enter a valid email";
  if (!PHONE.test(customer.phone || "")) errors.phone = "Enter a 10-digit mobile number";
  if (!customer.address?.trim()) errors.address = "Address is required";
  if (!customer.city?.trim()) errors.city = "City is required";
  if (!customer.state?.trim()) errors.state = "State is required";
  if (!PINCODE.test(customer.pincode || "")) errors.pincode = "Enter a valid 6-digit PIN code";
  if (customer.gstin && !GSTIN.test(customer.gstin.toUpperCase())) errors.gstin = "Invalid GSTIN format";
  if (!Array.isArray(items) || items.length === 0) errors.items = "Your bag is empty";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  // Never trust prices from the browser - re-price from the catalogue.
  const catalogue = await getProducts();
  const lines = [];
  for (const it of items) {
    const p = catalogue.find((x) => x.id === it.productId);
    const qty = Math.max(1, Math.min(10, parseInt(it.qty, 10) || 1));
    if (!p) return NextResponse.json({ error: "Unknown product in bag" }, { status: 400 });
    if (!p.sizes.includes(it.size)) return NextResponse.json({ error: `Size ${it.size} not available for ${p.name}` }, { status: 400 });
    lines.push({ productId: p.id, slug: p.slug, name: p.name, size: it.size, qty, price: p.price, image: p.images[0], tone: p.tone });
  }

  try {
    const order = await createOrder({
      customer: { ...customer, gstin: customer.gstin?.toUpperCase() || "" },
      items: lines,
      totals: computeTotals(lines),
      payment: { method: customer.payment === "cod" ? "Cash on Delivery" : "UPI (demo)", status: "Pending" },
    });
    return NextResponse.json({ id: order.id, number: order.number }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 409 });
  }
}
