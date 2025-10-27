import { useQuery } from '@tanstack/react-query';

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
