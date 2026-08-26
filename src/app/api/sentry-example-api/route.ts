import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const error = new Error("Test Sentry Server API Error - LokerTimika (" + new Date().toISOString() + ")");
  Sentry.captureException(error);
  return NextResponse.json({
    success: true,
    message: "Server-side error captured and sent to Sentry!",
    timestamp: new Date().toISOString(),
  });
}
