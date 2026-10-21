import { getProducts, getCategories } from "@/lib/db";
import ShopClient from "@/components/ShopClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop — Maison Aurèle" };

export default async function ShopPage({ searchParams }) {
  const sp = await searchParams;
  const initial = {
    category: sp.category || "All",
    gender: sp.gender || "All",
    sort: sp.sort || "featured",
  };
  const [products, categories] = await Promise.all([getProducts(initial), getCategories()]);
  return <ShopClient key={`${initial.category}-${initial.gender}-${initial.sort}`} initialProducts={products} categories={["All", ...categories]} initial={initial} />;
}
