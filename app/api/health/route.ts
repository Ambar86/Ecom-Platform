import { NextResponse } from "next/server";
import { validateEnvironmentVariables } from "@/lib/env-validation";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    // Validate environment variables
    validateEnvironmentVariables();

    // Test database connection
    await connectDB();

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
