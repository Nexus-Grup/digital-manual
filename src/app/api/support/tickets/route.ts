import { NextResponse } from "next/server";
import { handleError, readBody, requireUser } from "@/lib/companyAccess";
import { prisma } from "@/lib/prisma";
import { getUserTickets, resolveTicketTarget } from "@/lib/support/queries";
import { createTicketInput } from "@/lib/support/schemas";

// Lista os chamados do usuário logado.
export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(await getUserTickets(user.id));
  } catch (e) {
    return handleError(e);
  }
}

// Abre um chamado. A descrição vira a primeira mensagem.
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const { description, attachments, productId, brandId, companyId, ...fields } = await readBody(
      req,
      createTicketInput,
    );
    const target = await resolveTicketTarget(user.id, fields.about, { productId, brandId, companyId });

    const ticket = await prisma.ticket.create({
      data: {
        ...fields,
        ...target,
        createdById: user.id,
        messages: { create: { body: description, authorId: user.id, attachments: { create: attachments } } },
      },
      select: { id: true },
    });
    return NextResponse.json({ id: ticket.id }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
