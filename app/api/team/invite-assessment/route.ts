import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserOrg } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** POST /api/team/invite-assessment — send assessment invites to team emails */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const org = await getUserOrg(user.id);
    if (!org) {
      return NextResponse.json({ error: "No organization found" }, { status: 403 });
    }

    // Check if user is admin of the org
    const membership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        orgId: org.id,
        role: "ADMIN"
      }
    });

    if (!membership) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { emails, subject, message } = await req.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "Email list required" }, { status: 400 });
    }

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emails.filter(email => emailRegex.test(email));
    
    if (validEmails.length === 0) {
      return NextResponse.json({ error: "No valid emails provided" }, { status: 400 });
    }

    // Create assessment invites
    const invites = await Promise.all(
      validEmails.map(email => 
        prisma.assessment.create({
          data: {
            orgId: org.id,
            candidateEmail: email.toLowerCase(),
            status: "PENDING",
            inviteMessage: message || `You've been invited to take an AI proficiency assessment by ${org.name}`,
            inviteSubject: subject || "AI Proficiency Assessment Invitation"
          }
        })
      )
    );

    // TODO: Send actual emails here (integrate with email service)
    // For now, we're just creating the invites in the database
    
    return NextResponse.json({ 
      success: true,
      invitesSent: invites.length,
      message: `Assessment invites created for ${invites.length} recipients`
    });

  } catch (error) {
    console.error("Team invite error:", error);
    return NextResponse.json(
      { error: "Failed to send invites" },
      { status: 500 }
    );
  }
}