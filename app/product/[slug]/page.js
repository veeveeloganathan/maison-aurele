import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/db";
import ProductClient from "@/components/ProductClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  return { title: p ? `${p.name} — Maison Aurèle` : "Not found" };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = (await getProducts({ category: product.category })).filter((p) => p.id !== product.id).slice(0, 3);
  const fill = related.length < 3 ? (await getProducts()).filter((p) => p.id !== product.id && !related.includes(p)).slice(0, 3 - related.length) : [];
  return <ProductClient product={product} related={[...related, ...fill]} />;
}
