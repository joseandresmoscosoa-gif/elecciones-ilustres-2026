/**
 * Normaliza números ecuatorianos a formato E.164 (+593XXXXXXXXX)
 * para que 0991234567 y +593991234567 se reconozcan como el mismo número.
 */
export function normalizePhoneEC(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits.startsWith("593")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+593${digits.slice(1)}`;
  }

  if (digits.length === 9) {
    return `+593${digits}`;
  }

  return `+${digits}`;
}

export function isValidPhoneEC(raw: string): boolean {
  const normalized = normalizePhoneEC(raw);
  return /^\+593\d{9}$/.test(normalized);
}
