import type { Database } from "@/types/database.types";

type Profile =
  Database["public"]["Tables"]["profiles"]["Row"];
  
export function getDisplayName(profile: Profile): string {
  const name = [
    profile.first_name,
    profile.last_name,
  ]
    .filter(
      (value): value is string =>
        Boolean(value?.trim()),
    )
    .join(" ")
    .trim();

  return (
    name ||
    profile.email ||
    "Administrator"
  );
}

export function getInitials(value: string): string {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const first = parts[0];

  if (!first) {
    return "A";
  }

  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase();
  }

  const last = parts[parts.length - 1];

  if (!last) {
    return first.slice(0, 2).toUpperCase();
  }

  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

// Role Name Formatter
export function formatRoleName(
  roleName: string,
): string {
  return roleName
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}