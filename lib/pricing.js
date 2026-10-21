// Shared pricing rules (used by both the browser cart and the server API).
// Prices are MRP, inclusive of GST, in INR.
// GST slab for apparel is kept as config - confirm current rates with your CA before going live.
export const GST_RULES = { threshold: 2500, lowRate: 5, highRate: 18 };
export const FREE_SHIPPING_ABOVE = 2999;
export const SHIPPING_FEE = 149;

export function gstRateFor(unitPrice) {
  return unitPrice <= GST_RULES.threshold ? GST_RULES.lowRate : GST_RULES.highRate;
}

export function computeTotals(lines) {
  // lines: [{ price, qty }]
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const gstIncluded = lines.reduce((s, l) => {
    const rate = gstRateFor(l.price);
    const gross = l.price * l.qty;
    return s + gross - gross / (1 + rate / 100);
  }, 0);
  const shipping = subtotal === 0 || subtotal > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  return {
    subtotal,
    shipping,
    gstIncluded: Math.round(gstIncluded * 100) / 100,
    total: subtotal + shipping,
  };
}
