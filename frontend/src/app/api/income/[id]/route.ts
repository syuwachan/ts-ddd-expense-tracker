import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContainer } from "@/infrastructure/di/container";

// =============================
// 🧩 Validation schema
// =============================
const incomeUpdateSchema = z.object({
  amount: z.number().positive().optional(),
  category: z.string().optional(),
  date: z.string().datetime().optional(),
  memo: z.string().optional(),
});

const isErrorWithMessage = (err: unknown): err is { message: string } =>
  typeof err === "object" && err !== null && "message" in err;

// =============================
// PUT /api/income/[id]
// =============================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // create new container for each request
    const container = createContainer();
    const updateIncomeService = container.createUpdateIncomeService();

    const params = await context.params;
    const json = await req.json();
    const parsed = incomeUpdateSchema.parse(json);

    const updated = await updateIncomeService.execute(params.id, parsed);
    return NextResponse.json(updated.toJSON(), { status: 200 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ PUT /api/income/[id] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// =============================
// PATCH /api/income/[id]
// =============================
// PATCH has the same behavior as PUT
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PUT(req, context);
}

// =============================
// DELETE /api/income/[id]
// =============================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = createContainer();
    const incomeRepository = container.getIncomeRepository();

    await incomeRepository.delete(params.id);
    return NextResponse.json({ message: "Income deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    const message = isErrorWithMessage(err)
      ? err.message
      : "Unexpected error occurred";
    console.error("❌ DELETE /api/income/[id] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
