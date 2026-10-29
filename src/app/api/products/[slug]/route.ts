import { getProduct } from "@/lib/products";
import { connection, NextResponse } from "next/server";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await context.params;
  const product = await getProduct(slug);
  return product ? NextResponse.json(product) : NextResponse.json({ error: "Product not found" }, { status: 404 });
}
