// domain/services/RecordExpenseService.ts
import { ExpenseRepository } from "../repositories/ExpenseRepository";
import { Expense } from "../entities/Expense";
import { Money } from "../valueObjects/Money";
import { DateValue } from "../valueObjects/DateValue";
import { Category } from "../valueObjects/Category";
import { ExpenseCategoryType } from "../valueObjects/Category";
import { Memo } from "../valueObjects/Memo";
import { randomUUID } from "node:crypto";

export interface RecordExpenseInput {
  amount: number;
  category: ExpenseCategoryType;
  date: DateValue;
  memo?: string;
}

export class RecordExpenseService {
  constructor(private readonly repo: ExpenseRepository) {}

  async execute(input: RecordExpenseInput): Promise<Expense> {
    const money = new Money(input.amount);
    const dateValue = new DateValue(input.date.formatted);
    const category = new Category(input.category);
    const memo = new Memo(input.memo ?? "");

    const expense = new Expense(randomUUID(), money, dateValue, category, memo);

    await this.repo.save(expense);
    return expense;
  }
}
