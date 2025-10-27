import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  memo: string;
}

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface CategoryBudget {
  category: string;
  amount: number;
  percent: number;
  color: string;
}

interface BudgetData {
  budgets: CategoryBudget[];
  total: number;
}

interface MonthlySpending {
  month: string;
  amount: number;
}

interface MonthlySpendingData {
  data: MonthlySpending[];
  total: number;
}

interface TopCategory {
  name: string;
  amount: number;
  percent: number;
}

interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  topCategories: TopCategory[];
}

export function useIncome() {
  return useQuery<Transaction[]>({
    queryKey: ['income'],
    queryFn: async () => {
      const response = await fetch('/api/income');
      if (!response.ok) {
        throw new Error('Failed to fetch income');
      }
      return response.json() as Promise<Transaction[]>;
    },
  });
}

export function useExpense() {
  return useQuery<Transaction[]>({
    queryKey: ['expense'],
    queryFn: async () => {
      const response = await fetch('/api/expense');
      if (!response.ok) {
        throw new Error('Failed to fetch expense');
      }
      return response.json() as Promise<Transaction[]>;
    },
  });
}

export function useSummary() {
  return useQuery<Summary>({
    queryKey: ['summary'],
    queryFn: async () => {
      const response = await fetch('/api/summary');
      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }
      return response.json() as Promise<Summary>;
    },
  });
}

export function useBudget() {
  return useQuery<BudgetData>({
    queryKey: ['budget'],
    queryFn: async () => {
      const response = await fetch('/api/budget');
      if (!response.ok) {
        throw new Error('Failed to fetch budget');
      }
      return response.json() as Promise<BudgetData>;
    },
  });
}

export function useMonthlySpending(months: number = 12) {
  return useQuery<MonthlySpendingData>({
    queryKey: ['monthly-spending', months],
    queryFn: async () => {
      const response = await fetch(`/api/spending/monthly?months=${months}`);
      if (!response.ok) {
        throw new Error('Failed to fetch monthly spending');
      }
      return response.json() as Promise<MonthlySpendingData>;
    },
  });
}

export function useMonthlyIncome(months: number = 12) {
  return useQuery<MonthlySpendingData>({
    queryKey: ['monthly-income', months],
    queryFn: async () => {
      const response = await fetch(`/api/income/monthly?months=${months}`);
      if (!response.ok) {
        throw new Error('Failed to fetch monthly income');
      }
      return response.json() as Promise<MonthlySpendingData>;
    },
  });
}

export function useMonthlyReport(month: string) {
  return useQuery<MonthlyReport>({
    queryKey: ['monthly-report', month],
    queryFn: async () => {
      const response = await fetch(`/api/reports/monthly?month=${month}`);
      if (!response.ok) {
        throw new Error('Failed to fetch monthly report');
      }
      return response.json() as Promise<MonthlyReport>;
    },
    enabled: !!month, // Only fetch if month is provided
  });
}

export function useTransactions() {
  const income = useIncome();
  const expense = useExpense();
  const summary = useSummary();

  return {
    income,
    expense,
    totalIncome: summary.data?.totalIncome ?? 0,
    totalExpense: summary.data?.totalExpense ?? 0,
    balance: summary.data?.balance ?? 0,
    isLoading: income.isLoading || expense.isLoading || summary.isLoading,
    isError: income.isError || expense.isError || summary.isError,
  };
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/income/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete income');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-income'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-report'] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/expense/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-spending'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-report'] });
    },
  });
}
