// app/api/income/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContainer } from "@/infrastructure/di/container";
import { DateValue } from "@/domain/valueObjects/DateValue";
import { IncomeCategoryType } from "@/domain/valueObjects/Category";

const incomeSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  category: z.string(),
  date: z.string().datetime(),
  memo: z.string().optional().default(""),
});

// ================================
// ✅ 型ガードユーティリティ
// ================================
const isErrorWithMessage = (err: unknown): err is { message: string } => {
  return typeof err === "object" && err !== null && "message" in err;
};

// ================================
// POST /api/income
// register income
// ================================
export async function POST(req: NextRequest) {
  try {
    // リクエストごとに新しいコンテナを作成
    const container = createContainer();
    const recordIncomeService = container.createRecordIncomeService();

    const json = await req.json();
    const parsed = incomeSchema.parse(json);

    const income = await recordIncomeService.execute({
      amount: parsed.amount,
      category: parsed.category as IncomeCategoryType,
      date: new DateValue(parsed.date),
      memo: parsed.memo,
    });

    return NextResponse.json(income.toJSON(), { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ POST /api/income error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ================================
// GET /api/income?month=YYYY-MM
// get all incomes or incomes by month
// ================================
export async function GET(req: NextRequest) {
  try {
    // リクエストごとに新しいコンテナを作成
    const container = createContainer();
    const repo = container.getIncomeRepository();

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    const incomes = month
      ? await repo.findByMonth(month)
      : await repo.findAll();

    return NextResponse.json(
      incomes.map((i) => i.toJSON()),
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ GET /api/income error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
