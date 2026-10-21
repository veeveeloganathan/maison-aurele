import { notFound } from "next/navigation";
import { getOrder } from "@/lib/db";
import OrderSuccess from "@/components/OrderSuccess";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order confirmed — Maison Aurèle" };

export default async function OrderPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  return <OrderSuccess order={order} />;
}
