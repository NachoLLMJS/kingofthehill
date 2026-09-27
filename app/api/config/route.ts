import { CHAIN, TOKEN_ADDRESS } from "@/lib/config";

export const dynamic = "force-dynamic";

// Public game config. The bridge userscript reads it so switching the token
// only needs the site's env vars, not an edit in Tampermonkey.
export function GET() {
  return Response.json({ chain: CHAIN, token: TOKEN_ADDRESS }, { headers: { "Cache-Control": "no-store" } });
}
