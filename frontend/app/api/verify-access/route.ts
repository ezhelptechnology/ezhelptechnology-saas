// frontend/app/api/verify-access/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing code" },
        { status: 400 }
      );
    }

    const expected = process.env.DASHBOARD_ACCESS_CODE;

    if (!expected) {
      console.error("DASHBOARD_ACCESS_CODE is not set in env");
      return NextResponse.json(
        { ok: false, error: "Server misconfigured" },
        { status: 500 }
      );
    }

    if (code === expected) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: "Invalid code" },
      { status: 401 }
    );
  } catch (err: any) {
    console.error("verify-access error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
