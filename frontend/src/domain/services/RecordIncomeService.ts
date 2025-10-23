// domain/services/RecordIncomeService.ts
import { IncomeRepository } from "../repositories/IncomeRepository";
import { Income } from "../entities/Income";
import { Money } from "../valueObjects/Money";
import { DateValue } from "../valueObjects/DateValue";
import { Category } from "../valueObjects/Category";
import { IncomeCategoryType } from "../valueObjects/Category";
import { Memo } from "../valueObjects/Memo";
import { randomUUID } from "node:crypto";

export interface RecordIncomeInput {
  amount: number;
  category: IncomeCategoryType;
  date: DateValue;
  memo?: string;
}

export class RecordIncomeService {
  constructor(private readonly repo: IncomeRepository) {}

  async execute(input: RecordIncomeInput): Promise<Income> {
    const money = new Money(input.amount);
    const dateValue = new DateValue(input.date.formatted);
    const category = new Category(input.category);
    const memo = new Memo(input.memo ?? "");

    const income = new Income(
      randomUUID(),
      money,
      dateValue,
      category,
      memo
    );

    await this.repo.save(income);
    return income;
  }
}
