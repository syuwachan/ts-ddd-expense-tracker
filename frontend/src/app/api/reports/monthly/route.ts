// app/api/reports/monthly/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createContainer } from "@/infrastructure/di/container";

// ================================
// type guard utility
// ================================
const isErrorWithMessage = (err: unknown): err is { message: string } => {
  return typeof err === "object" && err !== null && "message" in err;
};

// ================================
// GET /api/reports/monthly?month=2025-10
// get monthly financial report
// ================================
export async function GET(req: NextRequest) {
  try {
    // create new container for each request
    const container = createContainer();
    const generateMonthlyReportService = container.createGenerateMonthlyReportService();

    // get query parameter
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { error: "Month parameter is required (format: YYYY-MM)" },
        { status: 400 }
      );
    }

    // execute business logic using application layer service
    const report = await generateMonthlyReportService.execute(month);

    return NextResponse.json(report, { status: 200 });
  } catch (err: unknown) {
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ GET /api/reports/monthly error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
