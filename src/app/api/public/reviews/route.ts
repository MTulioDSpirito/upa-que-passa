import { NextResponse } from "next/server";
import { readAdminReviews } from "@/lib/adminReviews";

export const dynamic = "force-dynamic";

export async function GET() {
  const reviews = await readAdminReviews();
  return NextResponse.json({ reviews });
}
