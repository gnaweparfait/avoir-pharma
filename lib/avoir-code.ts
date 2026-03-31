/** Code unique pour un avoir (collision négligeable) */
export function generateAvoirCode(): string {
  return `AV-${crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`;
}

export function defaultExpirationDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d;
}
