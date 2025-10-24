// app/api/expense/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaExpenseRepository } from "@/infrastructure/PrismaExpenseRepository";
import { RecordExpenseService } from "@domain/services/RecordExpenseService";
import { DateValue } from "@/domain/valueObjects/DateValue";
import { ExpenseCategoryType } from "@/domain/valueObjects/Category";

// ================================
// 🔧 Setup
// ================================
const repo = new PrismaExpenseRepository();
const recordExpenseService = new RecordExpenseService(repo);

const expenseSchema = z.object({
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
// POST /api/expense
// register expense
// ================================
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = expenseSchema.parse(json);

    const expense = await recordExpenseService.execute({
      amount: parsed.amount,
      category: parsed.category as ExpenseCategoryType,
      date: new DateValue(parsed.date),
      memo: parsed.memo,
    });

    return NextResponse.json(expense.toJSON(), { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ POST /api/expense error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ================================
// GET /api/expense?month=YYYY-MM
// get all expenses or expenses by month
// ================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    const expenses = month
      ? await repo.findByMonth(month)
      : await repo.findAll();

    return NextResponse.json(
      expenses.map((i) => i.toJSON()),
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ GET /api/expense error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
