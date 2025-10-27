import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContainer } from "@/infrastructure/di/container";

const expenseUpdateSchema = z.object({
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
    // create new container for each request
    const container = createContainer();
    const updateExpenseService = container.createUpdateExpenseService();

    const json = await req.json();
    const parsed = expenseUpdateSchema.parse(json);

    const updated = await updateExpenseService.execute(params.id, parsed);
    return NextResponse.json(updated.toJSON(), { status: 200 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ PUT /api/expense/[id] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = createContainer();
    const expenseRepository = container.getExpenseRepository();

    await expenseRepository.delete(params.id);
    return NextResponse.json({ message: "Expense deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ DELETE /api/expense/[id] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

