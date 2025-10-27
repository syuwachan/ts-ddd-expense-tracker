import { ExpenseRepository } from '@/domain/repositories/ExpenseRepository';
import { Money } from '@/domain/valueObjects/Money';

export interface MonthlySpending {
  month: string; // YYYY-MM format
  amount: number;
}

/**
 * Application Service: Calculate monthly spending
 */
export class CalculateMonthlySpendingService {
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute(monthsToShow: number = 12): Promise<MonthlySpending[]> {
    // get all expenses
    const expenses = await this.expenseRepository.findAll();

    // aggregate by month
    const monthMap = new Map<string, Money>();

    expenses.forEach((expense) => {
      // extract YYYY-MM from date
      const monthKey = expense.date.formatted.substring(0, 7); // "YYYY-MM-DD" -> "YYYY-MM"
      const currentAmount = monthMap.get(monthKey) || new Money(0);
      monthMap.set(monthKey, currentAmount.add(expense.amount));
    });

    // get last N months
    const now = new Date();
    const result: MonthlySpending[] = [];

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const amount = monthMap.get(monthKey)?.value || 0;

      result.push({
        month: monthKey,
        amount,
      });
    }

    return result;
  }
}
