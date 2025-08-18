import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { name, address, city, state, postalCode, country, phoneNumber } = await request.json();

    // Validate required fields
    if (!name || !address || !city || !state || !postalCode || !country) {
      return NextResponse.json({ 
        error: "Required fields: name, address, city, state, postalCode, country" 
      }, { status: 400 });
    }

    // Create the location
    const location = await prisma.location.create({
      data: {
        name,
        address,
        city,
        state,
        postalCode,
        country,
        phoneNumber: phoneNumber || "", // Provide empty string if not provided
        ownerId: userId
      }
    });

    return NextResponse.json({ 
      message: "Location created successfully", 
      location 
    });

  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}

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
        country: true,
        phoneNumber: true
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
