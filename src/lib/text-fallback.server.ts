/**
 * Backup text engine.
 *
 * The storyboard writing normally runs on the project's own Gemini keys, one key
 * at a time (see gemini.server.ts). If every one of those keys is unusable —
 * expired, revoked, or all out of daily quota — the whole run would otherwise
 * collapse into raw untranslated script lines. This fallback keeps writing
 * through Lovable AI so a run always produces real prompts.
 */

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

/** Backup writing model: a fast, high-quota Gemini flash model on the gateway. */
const MODEL = "google/gemini-3.7-flash";

export type FallbackOptions = {
  system?: string;
  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
};

export function hasFallback(): boolean {
  return Boolean(process.env["LOVABLE_API_KEY"]);
}

export async function fallbackChat(user: string, opts: FallbackOptions = {}): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("No backup text engine configured (LOVABLE_API_KEY missing)");

  let lastErr = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(GATEWAY, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(opts.timeoutMs ?? 300_000),
        body: JSON.stringify({
          model: MODEL,
          messages: [
            ...(opts.system ? [{ role: "system", content: opts.system }] : []),
            { role: "user", content: user },
          ],
          temperature: opts.temperature ?? 0.7,
          max_tokens: opts.maxOutputTokens ?? 32_768,
        }),
      });

      if (res.ok) {
        const json = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const text = (json.choices?.[0]?.message?.content ?? "").trim();
        if (text) return text;
        lastErr = "empty completion";
      } else {
        lastErr = `${res.status} ${(await res.text().catch(() => "")).slice(0, 300)}`;
        // Only rate limits and server hiccups are worth another try.
        if (res.status !== 429 && res.status < 500) break;
        const retryAfter = Number(res.headers.get("retry-after") ?? 0);
        await new Promise((r) => setTimeout(r, (retryAfter > 0 ? retryAfter * 1000 : 2000) * (attempt + 1)));
        continue;
      }
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
    await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
  }
  throw new Error(`Backup text engine failed: ${lastErr}`);
}
