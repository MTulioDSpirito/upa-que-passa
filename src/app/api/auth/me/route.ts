import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: session.sub,
      nickname: session.name,
      email: session.email,
      avatar: typeof session.avatar === "string" ? session.avatar : undefined,
    },
  });
}
