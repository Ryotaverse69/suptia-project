import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    GOOGLE_SEARCH_CONSOLE_VERIFICATION:
      process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION,
    hasGAId: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    hasSearchConsole: !!process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION,
  });
}
