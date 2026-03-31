import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

/** Double vérification côté API (le middleware protège déjà les routes). */
export async function unauthorizedIfNotAdmin(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
}
