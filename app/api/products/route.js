import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const products = await getProducts({
    category: searchParams.get("category") || undefined,
    gender: searchParams.get("gender") || undefined,
    sort: searchParams.get("sort") || undefined,
    q: searchParams.get("q") || undefined,
  });
  return NextResponse.json(products);
}
