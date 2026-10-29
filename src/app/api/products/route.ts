import { getProducts } from "@/lib/products";
import { connection, NextResponse } from "next/server";

export async function GET(request: Request) {
  await connection();
  const category = new URL(request.url).searchParams.get("category") ?? undefined;
  return NextResponse.json(await getProducts(category));
}
