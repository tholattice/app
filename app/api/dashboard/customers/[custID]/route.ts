import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ custID: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { custID: customerId } = await params;
    
    // Get user's locations
    const userLocations = await prisma.location.findMany({
      where: {
        ownerId: userId
      }
    });

    const locationIds = userLocations.map(loc => loc.id);

    if (locationIds.length === 0) {
      return NextResponse.json({ error: "No locations found" }, { status: 404 });
    }

    // Find the specific customer
    const customer = await prisma.client.findFirst({
      where: {
        id: customerId,
        clientLocations: {
          some: {
            locationId: {
              in: locationIds
            }
          }
        }
      },
      include: {
        appointment: {
          where: {
            locationId: {
              in: locationIds
            }
          },
          orderBy: {
            appointmentDate: 'desc'
          },
          include: {
            masseuse: true,
            location: true,
            massage: true
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Calculate stats
    const totalRevenue = customer.appointment.reduce((sum, appt) => sum + (appt.duration * 80), 0);
    const lastAppointment = customer.appointment[0];
    const isActive = lastAppointment && lastAppointment.appointmentDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Transform the data
    const transformedCustomer = {
      id: customer.id,
      name: customer.user?.name || customer.clientName,
      email: customer.user?.email || 'No email',
      image: customer.user?.image,
      status: isActive ? 'Active' : 'Inactive',
      totalRevenue,
      lastAppointment: lastAppointment?.appointmentDate,
      appointmentCount: customer.appointment.length,
      joined: customer.appointment.length > 0 ? customer.appointment[customer.appointment.length - 1].appointmentDate : null,
      appointments: customer.appointment.map(appt => ({
        id: appt.id,
        appointmentDate: appt.appointmentDate,
        duration: appt.duration,
        status: appt.appointmentDate > new Date() ? 'Upcoming' : 'Completed',
        location: appt.location.name,
        masseuse: appt.masseuseAppointmentName,
        massageType: appt.massage.type
      }))
    };

    return NextResponse.json(transformedCustomer);

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 });
  }
}


