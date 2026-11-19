import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const base = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  username: z.string().trim().toLowerCase().min(3).regex(/^[a-z0-9._-]+$/),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});
const adminSchema = base.extend({ role: z.enum(["USER", "ADMIN"]) });
const companySchema = base.extend({
  companyRole: z.enum(["MEMBER", "OWNER", "MANAGER"]),
  companyId: z.number().int().positive(),
});

export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const isCompanyFlow = "companyRole" in body;

  const parsed = (isCompanyFlow ? companySchema : adminSchema).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data as z.infer<typeof base> & {
    role?: "USER" | "ADMIN";
    companyRole?: "MEMBER" | "OWNER" | "MANAGER";
    companyId?: number;
  };

  // Autorização no servidor
  if (isCompanyFlow) {
    const membership = await prisma.userCompany.findUnique({
      where: { userId_companyId: { userId: me.id, companyId: d.companyId! } },
      select: { companyRole: true },
    });
    if (membership?.companyRole !== "OWNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else if (me.systemRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const user = await prisma.user.create({
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        userName: d.username,
        email: d.email,
        passwordHash: await bcrypt.hash(d.password, 12),
        systemRole: isCompanyFlow ? "USER" : d.role!,
        mustChangePassword: true,
        // Admin: sem empresa. Owner: vincula na UserCompany.
        ...(isCompanyFlow && {
          userCompanies: {
            create: { companyId: d.companyId!, companyRole: d.companyRole! },
          },
        }),
      },
      select: { id: true },
    });
    return NextResponse.json(user, { status: 201 });
    } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}