import { getCategories } from "@/lib/products";
import { connection, NextResponse } from "next/server";

export async function GET() {
  await connection();
  return NextResponse.json(await getCategories());
}
