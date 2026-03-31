import { defaultExpirationDate, generateAvoirCode } from "@/lib/avoir-code";
import { prisma } from "@/lib/prisma";
import { unauthorizedIfNotAdmin } from "@/lib/require-admin";
import { createAvoirSchema } from "@/lib/validators/avoir";

// GET /api/avoirs
export async function GET() {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const avoirs = await prisma.avoir.findMany({
    orderBy: { dateCreation: "desc" },
  });
  return Response.json(avoirs);
}

// POST /api/avoirs
export async function POST(request: Request) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const validated = createAvoirSchema.parse(body);

    const dateExpiration = validated.dateExpiration
      ? new Date(validated.dateExpiration)
      : defaultExpirationDate();

    const newAvoir = await prisma.avoir.create({
      data: {
        code: generateAvoirCode(),
        nom: validated.nom,
        prenom: validated.prenom,
        telephone: validated.telephone,
        montant: validated.montant,
        dateExpiration,
      },
    });

    return Response.json(newAvoir);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur de validation";
    return Response.json({ error: message }, { status: 400 });
  }
}