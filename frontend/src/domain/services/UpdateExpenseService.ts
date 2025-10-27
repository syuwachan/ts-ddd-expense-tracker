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
      new Money(dto.amount ?? existing.amount.amount),
      new DateValue(dto.date ?? existing.date.isoString),
      new Category(
        (dto.category as ExpenseCategoryType) ?? existing.category.name
      ),
      new Memo(dto.memo ?? existing.memo.content)
    );

    return await this.repo.update(updated);
  }
}
