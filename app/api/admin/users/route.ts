import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "flinch-admin-2026-xyz";

export async function GET(req: NextRequest) {
  // Check admin secret
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const search = req.nextUrl.searchParams.get("search") || "";
  const limit = 50;
  const offset = (page - 1) * limit;

  try {
    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Get users with membership info for tier
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          memberships: {
            include: {
              org: {
                include: {
                  subscriptions: {
                    orderBy: { id: "desc" },
                    take: 1,
                  },
                },
              },
            },
          },
          sessions: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              chatMessages: true, // Using this as proxy for assessments since Assessment doesn't have userId
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Transform data for frontend
    const transformedUsers = users.map((user) => {
      const latestMembership = user.memberships[0];
      const tier = latestMembership?.org?.subscriptions?.[0]?.tier || "FREE";
      const lastActive = user.sessions[0]?.createdAt || null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        tier,
        lastActive: lastActive ? lastActive.toISOString() : null,
        assessmentCount: user._count.chatMessages, // Proxy for now
      };
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      users: transformedUsers,
      totalUsers,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}