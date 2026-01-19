import type { APIRoute } from "astro";
import { setThemeCookie, type ThemePreference } from "../../lib/theme";

export const POST: APIRoute = async ({ request }) => {
  const data = (await request.json()) as { theme: string };
  const theme = data.theme as ThemePreference;

  if (!["light", "dark", "auto"].includes(theme)) {
    return new Response("Invalid theme", { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": setThemeCookie(theme),
    },
  });
};
