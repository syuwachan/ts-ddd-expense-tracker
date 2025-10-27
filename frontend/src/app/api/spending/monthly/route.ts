// app/api/spending/monthly/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createContainer } from "@/infrastructure/di/container";

// ================================
// type guard utility
// ================================
const isErrorWithMessage = (err: unknown): err is { message: string } => {
  return typeof err === "object" && err !== null && "message" in err;
};

// ================================
// GET /api/spending/monthly?months=12
// get monthly spending data
// ================================
export async function GET(req: NextRequest) {
  try {
    // create new container for each request
    const container = createContainer();
    const calculateMonthlySpendingService = container.createCalculateMonthlySpendingService();

    // get query parameter
    const { searchParams } = new URL(req.url);
    const monthsParam = searchParams.get("months");
    const months = monthsParam ? parseInt(monthsParam, 10) : 12;

    // execute business logic using application layer service
    const monthlyData = await calculateMonthlySpendingService.execute(months);

    return NextResponse.json(
      {
        data: monthlyData,
        total: monthlyData.reduce((sum, m) => sum + m.amount, 0),
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ GET /api/spending/monthly error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
