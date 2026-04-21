import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "flinch-admin-2026-xyz";

export async function GET(req: NextRequest) {
  // Check admin secret
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch AI chat messages with user info
    const conversations = await prisma.aiChatMessage.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 500, // Limit to last 500 messages
    });

    // Transform data for frontend
    const transformedConversations = conversations.map((msg) => ({
      id: msg.id,
      userId: msg.userId,
      userEmail: msg.user.email,
      userName: msg.user.name,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
    }));

    return NextResponse.json({
      conversations: transformedConversations,
      total: conversations.length,
    });
  } catch (error) {
    console.error("Admin conversations fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}