import { Expense, ExpenseData } from "@domain/entities/Expense";
import { ExpenseRepository } from "@domain/repositories/ExpenseRepository";
import { Money } from "@domain/valueObjects/Money";
import { Category } from "@domain/valueObjects/Category";
import { Memo } from "@domain/valueObjects/Memo";
import { DateValue } from "@domain/valueObjects/DateValue";

/**
 * 💾 LocalExpenseRepository
 * Implementation of ExpenseRepository using LocalStorage
 * ------------------------------------------------------
 * - save()        → Save or update an expense
 * - findAll()     → Retrieve all expenses
 * - findById()    → Retrieve a specific expense by ID
 * - findByMonth() → Retrieve expenses for a specific month
 * - delete()      → Delete an expense
 */

export class LocalExpenseRepository implements ExpenseRepository {
  private readonly key = "expenses";

  async save(expense: Expense): Promise<void> {
    const existing = await this.findAll();
    const updated = [...existing.filter((e) => e.id !== expense.id), expense];
    localStorage.setItem(this.key, JSON.stringify(updated.map((e) => e.toJSON())));
  }

  async findAll(): Promise<Expense[]> {
    const data = localStorage.getItem(this.key);
    if (!data) return [];

    const parsed: ExpenseData[] = JSON.parse(data);
    return parsed.map(
      (item: ExpenseData) =>
        new Expense(
          item.id,
          new Money(item.amount),
          new DateValue(item.date),
          new Category(item.category),
          new Memo(item.memo)
        )
    );
  }

  async findById(id: string): Promise<Expense | null> {
    const all = await this.findAll();
    return all.find((e) => e.id === id) ?? null;
  }

  async findByMonth(month: string): Promise<Expense[]> {
    const all = await this.findAll();
    return all.filter((e) => e.date.formatted.startsWith(month));
  }

  async delete(id: string): Promise<void> {
    const all = await this.findAll();
    const filtered = all.filter((e) => e.id !== id);
    localStorage.setItem(this.key, JSON.stringify(filtered.map((e) => e.toJSON())));
  }
}
