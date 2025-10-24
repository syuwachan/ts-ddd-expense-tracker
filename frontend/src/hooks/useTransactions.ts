import { useQuery } from '@tanstack/react-query';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  memo: string;
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

export function useTransactions() {
  const income = useIncome();
  const expense = useExpense();

  const totalIncome = income.data?.reduce((sum, item) => sum + item.amount, 0) ?? 0;
  const totalExpense = expense.data?.reduce((sum, item) => sum + item.amount, 0) ?? 0;
  const balance = totalIncome - totalExpense;

  return {
    income,
    expense,
    totalIncome,
    totalExpense,
    balance,
    isLoading: income.isLoading || expense.isLoading,
    isError: income.isError || expense.isError,
  };
}
