import { logger } from "@/logger";
import { NextResponse } from "next/server";

const allowedOrigins = ["https://chatgpt.com"];

export const runtime = "edge";

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  logger.info(`Origin: ${origin}`);
  if (origin !== null && allowedOrigins.includes(origin)) {
    const response = NextResponse.json({ message: "Hello, world!" });
    response.headers.set("Access-Control-Allow-Origin", origin);
    return response;
  }
  return NextResponse.json({ message: "[NOT ALLOWED]Hello, world!" });
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ message: "POST method called", data });
}
