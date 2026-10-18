import { NextResponse } from "next/server";

// Minimal public liveness probe for uptime monitors. It reports nothing about
// internals. Detailed health lives behind `system_health.view` (Phase 8).
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
