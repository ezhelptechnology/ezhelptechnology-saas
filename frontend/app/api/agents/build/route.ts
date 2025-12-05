// frontend/app/api/agents/build/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runThreeAgentBuild } from "@/lib/agentSystem";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { businessInfo, email } = await req.json();

    if (!businessInfo || !email) {
      return NextResponse.json(
        { error: "businessInfo and email are required" },
        { status: 400 }
      );
    }

    console.log("🚀 Creating order (if DB is available) and starting 3-agent build…");
    console.log("📋 businessInfo:", businessInfo);

    let orderId: string | undefined = undefined;
    let dbStatus: "created" | "skipped" | "failed" = "skipped";

    // 🔹 Try to write to DB, but DO NOT fail the whole build if it breaks
    if (process.env.DATABASE_URL) {
      try {
        const order = await prisma.order.create({
          data: {
            email,
            businessInfo,
            status: "BUILDING",
            amount: 500000, // $5,000 in cents
          },
        });

        orderId = order.id;
        dbStatus = "created";
        console.log(`✅ Order created in DB: ${order.id}`);
      } catch (err) {
        dbStatus = "failed";
        console.warn(
          "⚠️ prisma.order.create() failed. Continuing build without DB persistence.",
          err
        );
      }
    } else {
      console.warn("⚠️ No DATABASE_URL set. Skipping DB order creation.");
    }

    // 🔹 Always run the 3-agent pipeline, even if DB failed
    const assets = await runThreeAgentBuild(businessInfo, orderId);

    console.log("🎉 3-agent build completed. Returning assets to frontend.");

    return NextResponse.json({
      success: true,
      orderId: orderId || null,
      dbStatus, // "created" | "failed" | "skipped"
      assets,
    });
  } catch (error: any) {
    console.error("Build API error:", error);

    return NextResponse.json(
      { error: error?.message || "Build failed" },
      { status: 500 }
    );
  }
}
