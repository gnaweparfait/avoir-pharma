import { prisma } from "@/lib/prisma";
import { unauthorizedIfNotAdmin } from "@/lib/require-admin";
import { avoirSchema } from "@/lib/validators/avoir";

// GET /api/avoirs/:id
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const { id } = await context.params;

  const avoir = await prisma.avoir.findUnique({
    where: { id: Number(id) },
  });

  if (!avoir) {
    return Response.json(
      { error: "Avoir non trouvé" },
      { status: 404 }
    );
  }

  return Response.json(avoir);
}

// PUT /api/avoirs/:id
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const body = await request.json();

    const validated = avoirSchema.partial().parse(body);

    const updated = await prisma.avoir.update({
      where: { id: Number(id) },
      data: {
        ...validated,
        dateExpiration: validated.dateExpiration
          ? new Date(validated.dateExpiration)
          : undefined,
      },
    });

    return Response.json(updated);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur de validation";
    return Response.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/avoirs/:id
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const { id } = await context.params;

  await prisma.avoir.delete({
    where: { id: Number(id) },
  });

  return Response.json({ message: "Avoir supprimé" });
}