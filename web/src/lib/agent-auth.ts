import { NextRequest, NextResponse } from "next/server";

/**
 * Validate an incoming request carries a valid agent bearer token.
 * Returns null if valid, or a 401 NextResponse if not.
 */
export function validateAgentToken(
  req: NextRequest,
): NextResponse | null {
  const token = process.env.AGENT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Agent API not configured" },
      { status: 503 },
    );
  }

  const auth = req.headers.get("authorization");
  if (!auth || auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // valid
}
