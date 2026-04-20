import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface ClerkWebhookEvent {
  type: string;
  data: Record<string, unknown>;
}

/** POST /api/webhooks/clerk — handle Clerk webhook events */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as ClerkWebhookEvent;

  switch (body.type) {
    case "user.created": {
      const { id, email_addresses } = body.data as {
        id: string;
        email_addresses: { email_address: string }[];
      };
      const email = email_addresses?.[0]?.email_address;
      if (!email) break;

      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: { email },
        create: { clerkUserId: id, email },
      });
      break;
    }

    case "organization.created": {
      const { id, name, slug } = body.data as {
        id: string;
        name: string;
        slug: string;
      };

      await prisma.organization.upsert({
        where: { clerkOrgId: id },
        update: { name, slug },
        create: { clerkOrgId: id, name, slug },
      });
      break;
    }

    case "organizationMembership.created": {
      const { organization, public_user_data, role } = body.data as {
        organization: { id: string };
        public_user_data: { user_id: string };
        role: string;
      };

      const org = await prisma.organization.findUnique({
        where: { clerkOrgId: organization.id },
      });
      const user = await prisma.user.findUnique({
        where: { clerkUserId: public_user_data.user_id },
      });

      if (org && user) {
        await prisma.membership.create({
          data: {
            orgId: org.id,
            userId: user.id,
            role: role === "admin" ? "ADMIN" : "MEMBER",
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
