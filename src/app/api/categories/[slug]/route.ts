import { getCategory } from "@/lib/products";
import { connection, NextResponse } from "next/server";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await context.params;
  const category = await getCategory(slug);
  return category ? NextResponse.json(category) : NextResponse.json({ error: "Category not found" }, { status: 404 });
}
