import { ExpenseRepository } from '@/domain/repositories/ExpenseRepository';
import { Money } from '@/domain/valueObjects/Money';

export interface CategoryBudget {
  category: string;
  amount: number;
  percent: number;
}

/**
 * Application Service: Calculate budget by category
 */
export class CalculateBudgetByCategoryService {
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute(): Promise<CategoryBudget[]> {
    // get all expenses
    const expenses = await this.expenseRepository.findAll();

    // aggregate by category
    const categoryMap = new Map<string, Money>();

    expenses.forEach((expense) => {
      const category = expense.category.name;
      const currentAmount = categoryMap.get(category) || new Money(0);
      categoryMap.set(category, currentAmount.add(expense.amount));
    });

    // calculate total amount
    const totalAmount = Array.from(categoryMap.values()).reduce(
      (acc, money) => acc.add(money),
      new Money(0)
    );

    // calculate percentage and sort by amount
    const budgets: CategoryBudget[] = Array.from(categoryMap.entries())
      .map(([category, money]) => {
        const amount = money.amount;
        const percent =
          totalAmount.amount > 0
            ? Math.round((amount / totalAmount.amount) * 100)
            : 0;
        return { category, amount, percent };
      })
      .sort((a, b) => b.amount - a.amount); // 金額の降順

    return budgets;
  }
}
