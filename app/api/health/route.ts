import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        status: "unauthorized",
        timestamp: new Date().toISOString(),
        database: "requires_auth"
      }, { status: 401 });
    }

    // Simple database connection test
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      userId: session.user.id
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ 
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
