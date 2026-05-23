/**
 * Returns up to 2 uppercase initials from a full name.
 * e.g. "John Doe" → "JD", "Alice" → "A"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
