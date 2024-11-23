import { parseRequest } from "@/lib/utils";
import { NextResponse } from "next/server";
import * as v from "valibot";

const BodySchema = v.object({
  name: v.string(),
});
export async function POST(req: Request) {
  const data = await parseRequest(req, BodySchema);
  if (!data.success) {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }
  return NextResponse.json({ message: "POST method called", data });
}
