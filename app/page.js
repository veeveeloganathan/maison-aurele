import { getProducts, getCategories } from "@/lib/db";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const categoryData = categories.map((c) => {
    const items = products.filter((p) => p.category === c);
    return { name: c, count: items.length, image: items[0]?.images[0], tone: items[0]?.tone };
  });
  return <HomeClient products={products} categories={categoryData} />;
}
