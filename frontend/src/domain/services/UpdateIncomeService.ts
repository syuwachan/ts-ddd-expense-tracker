import { IncomeRepository } from "@/domain/repositories/IncomeRepository";
import { Income } from "@/domain/entities/Income";
import { Money } from "@/domain/valueObjects/Money";
import { DateValue } from "@/domain/valueObjects/DateValue";
import { Category, IncomeCategoryType } from "@/domain/valueObjects/Category";
import { Memo } from "@/domain/valueObjects/Memo";

interface UpdateIncomeDTO {
  amount?: number;
  category?: string;
  date?: string;
  memo?: string;
}

export class UpdateIncomeService {
  constructor(private repo: IncomeRepository) {}

  async execute(id: string, dto: UpdateIncomeDTO): Promise<Income> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error("Income not found");
    }

    const updated = new Income(
      existing.id,
      dto.amount !== undefined ? new Money(dto.amount) : existing.amount,
      dto.date !== undefined ? new DateValue(dto.date) : existing.date,
      dto.category !== undefined ? new Category(dto.category as IncomeCategoryType) : existing.category,
      dto.memo !== undefined ? new Memo(dto.memo) : existing.memo
    );

    return await this.repo.update(updated);
  }
}
