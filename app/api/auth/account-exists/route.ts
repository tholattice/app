import { NextRequest, NextResponse } from "next/server";
import { ipAddress } from "@vercel/edge";
import prisma from "@/lib/prisma";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const ip = ipAddress(req) || "127.0.0.1";
  
  // Simple rate limiting
  // TODO: Implement proper rate limiting with Upstash Redis

  const { email } = (await req.json()) as { email: string };

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });

    if (user) {
      return NextResponse.json({ exists: true });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Database connection error" },
      { status: 500 }
    );
  }
}