// app/api/budget/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createContainer } from "@/infrastructure/di/container";

// define color by category (presentation layer display setting)
const CATEGORY_COLORS: Record<string, string> = {
  Food: "from-orange-400 to-red-400",
  Transport: "from-blue-400 to-cyan-400",
  Housing: "from-pink-500 to-purple-500",
  Entertainment: "from-red-400 to-pink-500",
  Other: "from-gray-400 to-gray-300",
};

// default color
const DEFAULT_COLOR = "from-gray-400 to-gray-300";

// ================================
// type guard utility
// ================================
const isErrorWithMessage = (err: unknown): err is { message: string } => {
  return typeof err === "object" && err !== null && "message" in err;
};

// ================================
// GET /api/budget
// get budget by category (expense amount)
// ================================
export async function GET(req: NextRequest) {
  try {
    // create new container for each request
    const container = createContainer();
    const calculateBudgetService = container.createCalculateBudgetByCategoryService();

    // execute business logic using application layer service
    const budgets = await calculateBudgetService.execute();

    // add color information for display
    const budgetsWithColors = budgets.map((budget) => ({
      ...budget,
      color: CATEGORY_COLORS[budget.category] || DEFAULT_COLOR,
    }));

    return NextResponse.json(
      {
        budgets: budgetsWithColors,
        total: budgets.reduce((sum, b) => sum + b.amount, 0),
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ GET /api/budget error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
