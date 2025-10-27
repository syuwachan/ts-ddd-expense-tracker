import { IncomeRepository } from '@/domain/repositories/IncomeRepository';
import { Money } from '@/domain/valueObjects/Money';

export interface MonthlyIncome {
  month: string; // YYYY-MM format
  amount: number;
}

/**
 * Application Service: Calculate monthly income
 */
export class CalculateMonthlyIncomeService {
  constructor(private incomeRepository: IncomeRepository) {}

  async execute(monthsToShow: number = 12): Promise<MonthlyIncome[]> {
    // get all incomes
    const incomes = await this.incomeRepository.findAll();

    // aggregate by month
    const monthMap = new Map<string, Money>();

    incomes.forEach((income) => {
      // extract YYYY-MM from date
      const monthKey = income.date.formatted.substring(0, 7); // "YYYY-MM-DD" -> "YYYY-MM"
      const currentAmount = monthMap.get(monthKey) || new Money(0);
      monthMap.set(monthKey, currentAmount.add(income.amount));
    });

    // get last N months
    const now = new Date();
    const result: MonthlyIncome[] = [];

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
