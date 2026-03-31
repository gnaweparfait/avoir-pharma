import { prisma } from "@/lib/prisma";
import { unauthorizedIfNotAdmin } from "@/lib/require-admin";
import { z } from "zod";

const codeQuerySchema = z.object({
  code: z.string().min(1).max(80),
});

export async function GET(request: Request) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const url = new URL(request.url);
  const codeParam = url.searchParams.get("code");
  const parsed = codeQuerySchema.safeParse({ code: codeParam });
  if (!parsed.success) {
    return Response.json({ error: "Code invalide" }, { status: 400 });
  }

  const code = parsed.data.code.trim();
  const avoir = await prisma.avoir.findUnique({ where: { code } });
  if (!avoir) {
    return Response.json({ error: "Avoir introuvable" }, { status: 404 });
  }

  return Response.json(avoir);
}

