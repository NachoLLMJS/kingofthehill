import { getGameState } from "@/lib/state";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await getGameState();
  return Response.json(state, { headers: { "Cache-Control": "no-store" } });
}
