const TEXT_TOKEN_PATTERN = /(^|\/)text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)(\/|$)/i;
const LEADING_TOKEN_PATTERN = /(^|\/)leading-(none|tight|snug|normal|relaxed|loose|[0-9]+)(\/|$)/i;

export function isCdsTypographyTokenStyleName(name: string | null | undefined): boolean {
  return Boolean(name && TEXT_TOKEN_PATTERN.test(name) && LEADING_TOKEN_PATTERN.test(name));
}

export function normalizeTypographyStyleName(name: string | null | undefined): string {
  if (!name) return '';

  const parts = name.split('/').map((part) => part.trim()).filter(Boolean);
  const textPart = parts.find((part) => /^text-/i.test(part));
  const leadingPart = parts.find((part) => /^leading-/i.test(part));

  return textPart && leadingPart ? `${textPart}/${leadingPart}` : name.trim();
}
