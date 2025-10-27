import { ExpenseRepository } from "@/domain/repositories/ExpenseRepository";
import { Expense } from "@/domain/entities/Expense";
import { Money } from "@/domain/valueObjects/Money";
import { DateValue } from "@/domain/valueObjects/DateValue";
import { Category, ExpenseCategoryType } from "@/domain/valueObjects/Category";
import { Memo } from "@/domain/valueObjects/Memo";

interface UpdateExpenseDTO {
  amount?: number;
  category?: string;
  date?: string;
  memo?: string;
}

export class UpdateExpenseService {
  constructor(private repo: ExpenseRepository) {}

  async execute(id: string, dto: UpdateExpenseDTO): Promise<Expense> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error("Expense not found");
    }

    const updated = new Expense(
      existing.id,
      dto.amount !== undefined ? new Money(dto.amount) : existing.amount,
      dto.date !== undefined ? new DateValue(dto.date) : existing.date,
      dto.category !== undefined ? new Category(dto.category as ExpenseCategoryType) : existing.category,
      dto.memo !== undefined ? new Memo(dto.memo) : existing.memo
    );

    return await this.repo.update(updated);
  }
}
