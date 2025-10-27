'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
  ChartOptions,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { useMonthlyIncome, useMonthlySpending, useBudget, useSummary } from '@/hooks/useTransactions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartsPage() {
  const { data: monthlyIncomeData, isLoading: incomeLoading } = useMonthlyIncome(7);
  const { data: monthlySpendingData, isLoading: spendingLoading } = useMonthlySpending(7);
  const { data: budgetData, isLoading: budgetLoading } = useBudget();
  const { data: summaryData, isLoading: summaryLoading } = useSummary();

  const isLoading = incomeLoading || spendingLoading || budgetLoading || summaryLoading;

  // convert month name
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // monthly trend data
  const monthlyData = useMemo(() => {
    if (!monthlyIncomeData || !monthlySpendingData) return null;

    const labels = monthlyIncomeData.data.map(item => {
      const [year, month] = item.month.split('-');
      return monthNames[parseInt(month, 10) - 1];
    });

    const incomeAmounts = monthlyIncomeData.data.map(item => item.amount);
    const spendingAmounts = monthlySpendingData.data.map(item => item.amount);

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeAmounts,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Expense',
          data: spendingAmounts,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [monthlyIncomeData, monthlySpendingData]);

  // category spending (bar chart & doughnut chart)
  const categoryData = useMemo(() => {
    if (!budgetData) return null;

    const labels = budgetData.budgets.map(b => b.category);
    const amounts = budgetData.budgets.map(b => b.amount);
    const colors = budgetData.budgets.map(b => {
      // Tailwind色をrgba形式に変換
      const colorMap: Record<string, string> = {
        'from-orange-400 to-red-400': 'rgba(251, 146, 60, 0.8)',
        'from-blue-400 to-cyan-400': 'rgba(59, 130, 246, 0.8)',
        'from-pink-500 to-purple-500': 'rgba(236, 72, 153, 0.8)',
        'from-red-400 to-pink-500': 'rgba(239, 68, 68, 0.8)',
        'from-gray-400 to-gray-300': 'rgba(156, 163, 175, 0.8)',
      };
      return colorMap[b.color] || 'rgba(156, 163, 175, 0.8)';
    });

    return { labels, amounts, colors };
  }, [budgetData]);

  // income allocation data
  const incomeAllocationData = useMemo(() => {
    if (!summaryData) return null;

    const { totalIncome, totalExpense, balance } = summaryData;

    return {
      labels: ['Income', 'Expense', 'Savings'],
      datasets: [
        {
          data: [totalIncome, totalExpense, balance],
          backgroundColor: [
            'rgba(34, 197, 94, 0.9)',
            'rgba(239, 68, 68, 0.9)',
            'rgba(59, 130, 246, 0.9)',
          ],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };
  }, [summaryData]);

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) =>
            `${context.dataset.label}: ¥${context.parsed?.y?.toLocaleString() ?? '0'}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) =>
            `¥${Number(tickValue).toLocaleString()}`,
        },
      },
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) =>
            `¥${context.parsed?.y?.toLocaleString() ?? '0'}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) =>
            `¥${Number(tickValue).toLocaleString()}`,
        },
      },
    },
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) =>
            `${context.label}: ¥${context.parsed.toLocaleString()}`,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-gray-800">Charts</h1>
          <p className="text-gray-500">Visual analytics of your finances</p>
        </header>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-400">Loading charts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Charts</h1>
          <p className="text-gray-500">Visual analytics of your finances</p>
        </div>
      </header>

      {/* Income vs Expense Trend */}
      {monthlyData && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">Income vs Expense Trend</h3>
          <Line data={monthlyData} options={lineOptions} />
        </div>
      )}

      {/* 2カラムレイアウト */}
      {categoryData && (
        <div className="grid grid-cols-2 gap-6">
          {/* Category Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-800 font-semibold text-lg mb-4">Spending by Category</h3>
            <Bar
              data={{
                labels: categoryData.labels,
                datasets: [{
                  label: 'Spending by Category',
                  data: categoryData.amounts,
                  backgroundColor: categoryData.colors,
                  borderRadius: 8,
                }],
              }}
              options={barOptions}
            />
          </div>

          {/* Category Doughnut Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-800 font-semibold text-lg mb-4">Category Distribution</h3>
            <Doughnut
              data={{
                labels: categoryData.labels,
                datasets: [{
                  data: categoryData.amounts,
                  backgroundColor: categoryData.colors.map(c => c.replace('0.8', '0.9')),
                  borderWidth: 2,
                  borderColor: '#fff',
                }],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>
      )}

      {/* Income/Expense/Savings Pie */}
      {incomeAllocationData && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">Income Allocation</h3>
          <div className="max-w-md mx-auto">
            <Pie data={incomeAllocationData} options={doughnutOptions} />
          </div>
        </div>
      )}

      {/* No Data Message */}
      {!monthlyData && !categoryData && !incomeAllocationData && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">No data available to display charts</p>
        </div>
      )}
    </div>
  );
}
