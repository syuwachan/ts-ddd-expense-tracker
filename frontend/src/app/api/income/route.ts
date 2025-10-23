// app/api/income/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaIncomeRepository } from "@/infrastructure/PrismaIncomeRepository";
import { RecordIncomeService } from "@/domain/services/RecordIncomeService";
import { z } from "zod";
import { DateValue } from "@/domain/valueObjects/DateValue";
import { IncomeCategoryType } from "@/domain/valueObjects/Category";

const repo = new PrismaIncomeRepository();
const recordIncomeService = new RecordIncomeService(repo);
const incomeSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  category: z.string(),
  date: z.date(),
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
      date: new DateValue(parsed.date.toISOString()),
      memo: parsed.memo,
    });

    return NextResponse.json(income.toJSON(), { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
