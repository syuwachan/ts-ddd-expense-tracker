import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaIncomeRepository } from "@/infrastructure/PrismaIncomeRepository";
import { DateValue } from "@/domain/valueObjects/DateValue";
import { IncomeCategoryType } from "@/domain/valueObjects/Category";

const repo = new PrismaIncomeRepository();

const incomeUpdateSchema = z.object({
  amount: z.number().positive().optional(),
  category: z.string().optional(),
  date: z.string().datetime().optional(),
  memo: z.string().optional(),
});

const isErrorWithMessage = (err: unknown): err is { message: string } =>
  typeof err === "object" && err !== null && "message" in err;

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const json = await req.json();
    const parsed = incomeUpdateSchema.parse(json);

    const existing = await repo.findById(params.id);
    if (!existing) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    const updated = await repo.update(params.id, {
      amount: parsed.amount ?? existing.amount.value,
      category:
        (parsed.category as IncomeCategoryType) ?? existing.category.value,
      date: parsed.date ? new DateValue(parsed.date) : existing.date,
      memo: parsed.memo ?? existing.memo,
    });

    return NextResponse.json(updated.toJSON(), { status: 200 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("L PUT /api/income/[id] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return PUT(req, { params });
}
