import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

let handlers: ReturnType<typeof toNextJsHandler> | undefined;

function getHandlers() {
  handlers ??= toNextJsHandler(getAuth());
  return handlers;
}

function configured() {
  return Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET);
}

export async function GET(request: Request) {
  if (!configured()) {
    if (new URL(request.url).pathname.endsWith("/get-session")) return NextResponse.json({ session: null, user: null });
    return NextResponse.json({ error: { message: "Authentication requires DATABASE_URL and BETTER_AUTH_SECRET." } }, { status: 503 });
  }
  return getHandlers().GET(request);
}

export async function POST(request: Request) {
  if (!configured()) return NextResponse.json({ error: { message: "Authentication requires DATABASE_URL and BETTER_AUTH_SECRET." } }, { status: 503 });
  return getHandlers().POST(request);
}
