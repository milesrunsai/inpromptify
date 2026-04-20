import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** POST /api/demo-booking — create a new demo booking */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, teamSize, date, time, message } = body;

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Name, email, date, and time are required" },
        { status: 400 }
      );
    }

    const booking = await prisma.demoBooking.create({
      data: {
        name,
        email,
        company: company || null,
        teamSize: teamSize || null,
        date: new Date(date),
        time,
        message: message || null,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Demo booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

/** GET /api/demo-booking — list all bookings (admin only) */
export async function GET() {
  try {
    const bookings = await prisma.demoBooking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Demo booking list error:", error);
    return NextResponse.json({ bookings: [] });
  }
}
