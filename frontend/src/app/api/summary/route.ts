// app/api/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createContainer } from "@/infrastructure/di/container";

// ================================
// ✅ 型ガードユーティリティ
// ================================
const isErrorWithMessage = (err: unknown): err is { message: string } => {
  return typeof err === "object" && err !== null && "message" in err;
};

// ================================
// GET /api/summary
// Calculate total income, total expense, and balance
// ================================
export async function GET(req: NextRequest) {
  try {
    // リクエストごとに新しいコンテナを作成
    const container = createContainer();
    const calculateTotalIncomeService = container.createCalculateTotalIncomeService();
    const calculateTotalExpenseService = container.createCalculateTotalExpenseService();

    // Application層のサービスを使用してビジネスロジックを実行
    const totalIncomeMoney = await calculateTotalIncomeService.execute();
    const totalExpenseMoney = await calculateTotalExpenseService.execute();

    // Moneyオブジェクトから値を取得
    const totalIncome = totalIncomeMoney.value;
    const totalExpense = totalExpenseMoney.value;
    const balance = totalIncome - totalExpense;

    return NextResponse.json(
      {
        totalIncome,
        totalExpense,
        balance,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ GET /api/summary error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
