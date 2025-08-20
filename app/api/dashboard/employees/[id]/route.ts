import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { realtimeManager, REALTIME_EVENTS } from "@/lib/realtime";
import crypto from "crypto";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id: employeeId } = await params;
    const { name, email, wechatUsername, phone, status, services, scheduleDates } = await request.json();

    // Verify the employee belongs to the user's locations
    const employee = await prisma.masseuse.findFirst({
      where: {
        id: employeeId,
        LocationMasseuse: {
          some: {
            location: {
              ownerId: userId
            }
          }
        }
      },
      include: {
        user: true,
        servicesOffered: true,
        workingHours: true,
        LocationMasseuse: true
      }
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found or unauthorized" }, { status: 404 });
    }

    // Validate input
    if (!name?.trim() || !email?.trim() || !wechatUsername?.trim()) {
      return NextResponse.json({ error: "Name, email, and WeChat username are required" }, { status: 400 });
    }

    if (!services || services.length === 0) {
      return NextResponse.json({ error: "At least one service must be selected" }, { status: 400 });
    }

    // Check for email uniqueness (excluding current employee)
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        id: { not: employee.user.id }
      }
    });

    if (existingEmail) {
      return NextResponse.json({ error: "Email is already taken by another user" }, { status: 409 });
    }

    // Check for WeChat username uniqueness (excluding current employee)
    const existingWeChat = await prisma.masseuse.findFirst({
      where: {
        wechatUsername: wechatUsername,
        id: { not: employeeId }
      }
    });

    if (existingWeChat) {
      return NextResponse.json({ error: "WeChat username is already taken" }, { status: 409 });
    }

    // Update employee in transaction
    const updatedEmployee = await prisma.$transaction(async (tx) => {
      // Update user information
      await tx.user.update({
        where: { id: employee.user.id },
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim()
        }
      });

      // Update masseuse information
      const updatedMasseuse = await tx.masseuse.update({
        where: { id: employeeId },
        data: {
          masseuseName: name.trim(),
          wechatUsername: wechatUsername.trim()
        }
      });

      // Update services offered
      if (employee.servicesOffered) {
        await tx.masseuseService.update({
          where: { id: employee.servicesOffered.id },
          data: {
            serviceNames: services
          }
        });
      } else {
        // Create services offered if they don't exist
        const newService = await tx.masseuseService.create({
          data: {
            type: [],
            addons: [],
            serviceNames: services,
            duration: [60, 90]
          }
        });
        
        // Update the masseuse to link to the new service
        await tx.masseuse.update({
          where: { id: employeeId },
          data: {
            masseuseServiceId: newService.id
          }
        });
      }

      // Handle schedule dates if provided
      if (scheduleDates && scheduleDates.length > 0) {
        // Delete existing schedules for this employee
        await tx.$executeRaw`DELETE FROM "EmployeeSchedule" WHERE "masseuseId" = ${employeeId}`;

        // Create new schedules
        for (const schedule of scheduleDates) {
          await tx.$executeRaw`
            INSERT INTO "EmployeeSchedule" ("id", "date", "startTime", "endTime", "locationId", "masseuseId", "createdAt", "updatedAt")
            VALUES (${crypto.randomUUID()}, ${new Date(schedule.date)}, ${new Date(`2000-01-01T${schedule.startTime}`)}, ${new Date(`2000-01-01T${schedule.endTime}`)}, ${schedule.locationId}, ${employeeId}, NOW(), NOW())
          `;
        }
      }

      return updatedMasseuse;
    });

    // Broadcast employee update event
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.EMPLOYEE_UPDATED,
      data: updatedEmployee,
      timestamp: Date.now()
    });

    // If schedules were updated, also broadcast a schedule update event
    if (scheduleDates && scheduleDates.length > 0) {
      realtimeManager.broadcastToUser(userId, {
        type: REALTIME_EVENTS.EMPLOYEE_SCHEDULE_UPDATE,
        data: {
          employeeName: name,
          changeType: 'updated',
          message: 'Employee schedule updated'
        },
        timestamp: Date.now()
      });
    }

    return NextResponse.json({ 
      success: true, 
      employee: updatedEmployee
    });

  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id: employeeId } = await params;

    // Verify the employee belongs to the user's locations
    const employee = await prisma.masseuse.findFirst({
      where: {
        id: employeeId,
        LocationMasseuse: {
          some: {
            location: {
              ownerId: userId
            }
          }
        }
      },
      include: {
        user: true,
        servicesOffered: true,
        workingHours: true,
        appointments: true,
        LocationMasseuse: true
      }
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found or unauthorized" }, { status: 404 });
    }

    // Check if employee has any appointments
    if (employee.appointments.length > 0) {
      return NextResponse.json({ 
        error: "Cannot delete employee with existing appointments. Please cancel all appointments first." 
      }, { status: 400 });
    }

    // Delete in transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Delete working hours
      await tx.workingHours.deleteMany({
        where: { masseuseId: employeeId }
      });



      // Delete location connections
      await tx.locationMasseuse.deleteMany({
        where: { masseuseId: employeeId }
      });

      // Delete any time off requests
      await tx.timeOffRequest.deleteMany({
        where: { masseuseId: employeeId }
      });

      // Delete any schedule changes
      await tx.scheduleChange.deleteMany({
        where: { masseuseId: employeeId }
      });

      // Delete any employee schedules (date-based schedules)
      // Note: This is handled by the cascade delete in the schema

      // Delete the masseuse first (this will handle the foreign key to masseuseService)
      await tx.masseuse.delete({
        where: { id: employeeId }
      });

      // Delete the masseuse service after the masseuse is deleted
      if (employee.servicesOffered) {
        await tx.masseuseService.delete({
          where: { id: employee.servicesOffered.id }
        });
      }

      // Check if this user owns any locations (business owner)
      const userOwnedLocations = await tx.location.count({
        where: { ownerId: employee.user.id }
      });

      // Only delete the user if they don't own any locations and have no other roles
      const userMasseuseCount = await tx.masseuse.count({
        where: { masseuseId: employee.user.id }
      });
      
      const userClientCount = await tx.client.count({
        where: { clientId: employee.user.id }
      });

      // Don't delete the user if they own locations (business owner)
      if (userMasseuseCount === 0 && userClientCount === 0 && userOwnedLocations === 0) {
        await tx.user.delete({
          where: { id: employee.user.id }
        });
      }
    });

    // Broadcast employee deletion event
    realtimeManager.broadcastToUser(userId, {
      type: REALTIME_EVENTS.EMPLOYEE_DELETED,
      data: { employeeId, employeeName: employee.masseuseName },
      timestamp: Date.now()
    });

    return NextResponse.json({ message: "Employee deleted successfully" });

  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
