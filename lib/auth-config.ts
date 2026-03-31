/** Nom du cookie de session (httpOnly) */
export const SESSION_COOKIE = "avoirpharma_session";

export function getJwtSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "AUTH_SECRET doit être défini dans l’environnement (min. 32 caractères)."
    );
  }
  return new TextEncoder().encode(s);
}
