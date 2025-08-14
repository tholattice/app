import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { realtimeManager, RealtimeEvent } from "@/lib/realtime";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const connectionId = `conn_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add connection to realtime manager
    realtimeManager.addConnection(connectionId, userId);

    // Set up SSE response
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const initialMessage = `data: ${JSON.stringify({
          type: 'connection_established',
          connectionId,
          timestamp: Date.now()
        })}\n\n`;
        
        controller.enqueue(new TextEncoder().encode(initialMessage));

        // Set up event listener for this connection
        const eventListener = (event: RealtimeEvent) => {
          const message = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(new TextEncoder().encode(message));
        };

        realtimeManager.addEventListener(connectionId, eventListener);

        // Handle client disconnect
        request.signal.addEventListener('abort', () => {
          realtimeManager.removeEventListener(connectionId, eventListener);
          realtimeManager.removeConnection(connectionId);
          controller.close();
        });

        // Send heartbeat every 30 seconds to keep connection alive
        const heartbeatInterval = setInterval(() => {
          const heartbeatMessage = `data: ${JSON.stringify({
            type: 'heartbeat',
            timestamp: Date.now()
          })}\n\n`;
          
          try {
            controller.enqueue(new TextEncoder().encode(heartbeatMessage));
          } catch (error) {
            // Connection closed, cleanup
            clearInterval(heartbeatInterval);
            realtimeManager.removeEventListener(connectionId, eventListener);
            realtimeManager.removeConnection(connectionId);
            controller.close();
          }
        }, 30000);

        // Cleanup on connection close
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeatInterval);
          realtimeManager.removeEventListener(connectionId, eventListener);
          realtimeManager.removeConnection(connectionId);
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });

  } catch (error) {
    console.error("Error in realtime connection:", error);
    return NextResponse.json(
      { error: "Failed to establish realtime connection" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventType, data } = await request.json();
    const userId = session.user.id;

    // Broadcast event to user's connections
    realtimeManager.broadcastToUser(userId, {
      type: eventType,
      data,
      timestamp: Date.now()
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error broadcasting event:", error);
    return NextResponse.json(
      { error: "Failed to broadcast event" },
      { status: 500 }
    );
  }
}
