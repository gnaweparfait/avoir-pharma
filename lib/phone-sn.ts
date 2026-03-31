/** Extrait les 9 chiffres nationaux depuis +221XXXXXXXXX (ou chaîne vide). */
export function digitsFromSenegalE164(telephone: string | undefined | null): string {
  if (!telephone) return "";
  const t = telephone.replace(/\s/g, "");
  if (t.startsWith("+221")) return t.slice(4).replace(/\D/g, "").slice(0, 9);
  return t.replace(/\D/g, "").slice(-9);
}

export function toSenegalE164(nineDigits: string): string {
  const d = nineDigits.replace(/\D/g, "").slice(0, 9);
  return `+221${d}`;
}

/** Affichage lisible : +221 77 123 45 67 */
export function formatSenegalDisplay(e164: string | undefined | null): string {
  if (!e164) return "—";
  const d = e164.replace(/\s/g, "");
  const m = d.match(/^\+221(\d{9})$/);
  if (!m) return e164;
  const x = m[1];
  return `+221 ${x.slice(0, 2)} ${x.slice(2, 5)} ${x.slice(5, 7)} ${x.slice(7, 9)}`;
}
