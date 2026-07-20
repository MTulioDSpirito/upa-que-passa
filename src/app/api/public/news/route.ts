import { NextResponse } from "next/server";
import { getMergedAdminNews } from "@/lib/adminNews";

export const dynamic = "force-dynamic";

export async function GET() {
  const news = await getMergedAdminNews();
  return NextResponse.json({ news });
}
