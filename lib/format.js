// Indian number format: ₹1,25,000
export function inr(value, { decimals = 0 } = {}) {
  return (
    "₹" +
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

// DD-MM-YYYY
export function ddmmyyyy(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}`;
}
