import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Get user's locations
    let locations = await prisma.location.findMany({
      where: {
        ownerId: userId
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        postalCode: true,
        country: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Return empty array if no locations exist
    if (locations.length === 0) {
      return NextResponse.json({ locations: [] });
    }

    return NextResponse.json({ locations });

  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
