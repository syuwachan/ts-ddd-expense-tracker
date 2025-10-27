import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaIncomeRepository } from "@/infrastructure/PrismaIncomeRepository";
import { UpdateIncomeService } from "@/domain/services/UpdateIncomeService";

// Infrastructure層に依存するRepositoryを注入
const repo = new PrismaIncomeRepository();
const updateIncomeService = new UpdateIncomeService(repo);

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
  { params }: { params: { id: string } }
) {
  try {
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
// PATCH もPUTと同じ動作
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return PUT(req, { params });
}
