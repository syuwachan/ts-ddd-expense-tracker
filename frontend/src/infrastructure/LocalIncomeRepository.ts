// src/infrastructure/repositories/LocalIncomeRepository.ts
import { Income, IncomeData } from "@domain/entities/Income";
import { IncomeRepository } from "@domain/repositories/IncomeRepository";
import { Money } from "@domain/valueObjects/Money";
import { Category } from "@domain/valueObjects/Category";
import { Memo } from "@domain/valueObjects/Memo";
import { DateValue } from "@domain/valueObjects/DateValue";

/**
 * 💾 LocalIncomeRepository
 * Implementation of IncomeRepository using LocalStorage
 * ------------------------------------------------------
 * - save()        → Save or update an income
 * - findAll()     → Retrieve all incomes
 * - findById()    → Retrieve a specific income by ID
 * - findByMonth() → Retrieve incomes for a specific month
 * - delete()      → Delete an income
 */
export class LocalIncomeRepository implements IncomeRepository {
  private readonly key = "incomes";

  async save(income: Income): Promise<void> {
    const existing = await this.findAll();
    const updated = [...existing.filter((i) => i.id !== income.id), income];
    localStorage.setItem(this.key, JSON.stringify(updated.map((i) => i.toJSON())));
  }

  async findAll(): Promise<Income[]> {
    const data = localStorage.getItem(this.key);
    if (!data) return [];

    const parsed: IncomeData[] = JSON.parse(data);
    return parsed.map(
      (item: IncomeData) =>
        new Income(
          item.id,
          new Money(item.amount),
          new DateValue(item.date),
          new Category(item.category),
          new Memo(item.memo)
        )
    );
  }

  async findById(id: string): Promise<Income | null> {
    const all = await this.findAll();
    return all.find((i) => i.id === id) ?? null;
  }

  async findByMonth(month: string): Promise<Income[]> {
    const all = await this.findAll();
    return all.filter((i) => i.date.formatted.startsWith(month));
  }

  async delete(id: string): Promise<void> {
    const all = await this.findAll();
    const filtered = all.filter((i) => i.id !== id);
    localStorage.setItem(this.key, JSON.stringify(filtered.map((i) => i.toJSON())));
  }
}
