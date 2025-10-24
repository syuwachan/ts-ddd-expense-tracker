// app/api/income/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaIncomeRepository } from "@/infrastructure/PrismaIncomeRepository";
import { RecordIncomeService } from "@/domain/services/RecordIncomeService";
import { DateValue } from "@/domain/valueObjects/DateValue";
import { IncomeCategoryType } from "@/domain/valueObjects/Category";

// ================================
// 🔧 Setup
// ================================
const repo = new PrismaIncomeRepository();
const recordIncomeService = new RecordIncomeService(repo);

// ✅ JSONパース前提なので、z.date() ではなく z.string().datetime() が安全
const incomeSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  category: z.string(),
  date: z.string().datetime(), // ← z.date() は JSON直列化では動作しない
  memo: z.string().optional().default(""),
});

// ================================
// POST /api/income
// register income
// ================================
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = incomeSchema.parse(json);

    const income = await recordIncomeService.execute({
      amount: parsed.amount,
      category: parsed.category as IncomeCategoryType,
      date: new DateValue(parsed.date),
      memo: parsed.memo,
    });

    return NextResponse.json(income.toJSON(), { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("❌ POST /api/income error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ================================
// GET /api/income?month=YYYY-MM
// get all incomes or incomes by month
// ================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    const incomes = month
      ? await repo.findByMonth(month)
      : await repo.findAll();

    return NextResponse.json(incomes.map((i) => i.toJSON()), { status: 200 });
  } catch (err: any) {
    console.error("❌ GET /api/income error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
