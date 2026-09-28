import { CHAIN, TOKEN_ADDRESS } from "@/lib/config";
import { getStore, storageEnvNames } from "@/lib/store";

export const dynamic = "force-dynamic";

// Public game config. The bridge userscript reads it so switching the token
// only needs the site's env vars, not an edit in Tampermonkey.
export function GET() {
  // `storage` helps check the deploy: it must be "redis-*" in production.
  return Response.json({ chain: CHAIN, token: TOKEN_ADDRESS, storage: getStore().kind, storageEnv: storageEnvNames() }, { headers: { "Cache-Control": "no-store" } });
}
