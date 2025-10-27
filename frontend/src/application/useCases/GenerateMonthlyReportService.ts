import { ExpenseRepository } from '@/domain/repositories/ExpenseRepository';
import { IncomeRepository } from '@/domain/repositories/IncomeRepository';
import { Money } from '@/domain/valueObjects/Money';

export interface TopCategory {
  name: string;
  amount: number;
  percent: number;
}

export interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  topCategories: TopCategory[];
}

/**
 * Application Service: Generate monthly financial report
 */
export class GenerateMonthlyReportService {
  constructor(
    private expenseRepository: ExpenseRepository,
    private incomeRepository: IncomeRepository
  ) {}

  async execute(yearMonth: string): Promise<MonthlyReport> {
    // Get data for the specified month
    const expenses = await this.expenseRepository.findByMonth(yearMonth);
    const incomes = await this.incomeRepository.findByMonth(yearMonth);

    // Calculate totals
    const totalExpenseMoney = expenses.reduce(
      (acc, expense) => acc.add(expense.amount),
      new Money(0)
    );
    const totalIncomeMoney = incomes.reduce(
      (acc, income) => acc.add(income.amount),
      new Money(0)
    );

    const totalExpense = totalExpenseMoney.value;
    const totalIncome = totalIncomeMoney.value;
    const netSavings = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    // Calculate top categories
    const categoryMap = new Map<string, Money>();
    expenses.forEach((expense) => {
      const category = expense.category.name;
      const current = categoryMap.get(category) || new Money(0);
      categoryMap.set(category, current.add(expense.amount));
    });

    const topCategories: TopCategory[] = Array.from(categoryMap.entries())
      .map(([name, money]) => {
        const amount = money.value;
        // Calculate percentage of total expense (spending)
        const percent =
          totalExpense > 0
            ? Math.round((amount / totalExpense) * 1000) / 10 // 小数点第1位まで
            : 0;
        return { name, amount, percent };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 categories

    // Format month name
    const [year, month] = yearMonth.split('-');
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];

    return {
      month: `${monthName} ${year}`,
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      topCategories,
    };
  }
}
