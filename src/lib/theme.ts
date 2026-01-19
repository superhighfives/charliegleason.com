export type Theme = "light" | "dark";
export type ThemePreference = "light" | "dark" | "auto";

export const THEME_COOKIE = "theme_preference";

export function getThemeFromRequest(request: Request): {
  theme: Theme;
  preference: ThemePreference;
} {
  // Read cookie preference
  const cookies = request.headers.get("cookie") || "";
  const preferenceMatch = cookies.match(/theme_preference=(light|dark|auto)/);
  const preference: ThemePreference =
    (preferenceMatch?.[1] as ThemePreference) || "auto";

  // If explicit preference, use it
  if (preference === "light" || preference === "dark") {
    return { theme: preference, preference };
  }

  // For 'auto', check client hint header
  const clientHint = request.headers.get("sec-ch-prefers-color-scheme");
  if (clientHint === "dark") {
    return { theme: "dark", preference: "auto" };
  }

  // Default to light
  return { theme: "light", preference: "auto" };
}

export function setThemeCookie(theme: ThemePreference): string {
  return `${THEME_COOKIE}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
