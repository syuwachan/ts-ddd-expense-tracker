'use client';

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
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

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
  // 月次推移データ
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Income',
        data: [200000, 200000, 250000, 200000, 200000, 230000, 200000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expense',
        data: [80000, 85000, 78000, 92000, 88000, 95000, 90000],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // カテゴリー別支出（棒グラフ）
  const categoryBarData = {
    labels: ['Food & Drink', 'Entertainment', 'Housing', 'Shopping', 'Transport', 'Others'],
    datasets: [
      {
        label: 'Spending by Category',
        data: [32000, 18000, 45000, 12000, 15000, 8000],
        backgroundColor: [
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  // カテゴリー別支出（ドーナツ）
  const categoryDoughnutData = {
    labels: ['Food & Drink', 'Entertainment', 'Housing', 'Shopping', 'Transport', 'Others'],
    datasets: [
      {
        data: [32000, 18000, 45000, 12000, 15000, 8000],
        backgroundColor: [
          'rgba(251, 146, 60, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(236, 72, 153, 0.9)',
          'rgba(168, 85, 247, 0.9)',
          'rgba(59, 130, 246, 0.9)',
          'rgba(156, 163, 175, 0.9)',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // 収支比率（パイチャート）
  const incomeExpensePieData = {
    labels: ['Income', 'Expense', 'Savings'],
    datasets: [
      {
        data: [200000, 90000, 110000],
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

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ¥${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `¥${value.toLocaleString()}`,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `¥${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `¥${value.toLocaleString()}`,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ¥${context.parsed.toLocaleString()}`,
        },
      },
    },
  };

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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-semibold text-lg mb-4">Income vs Expense Trend</h3>
        <Line data={monthlyData} options={lineOptions} />
      </div>

      {/* 2カラムレイアウト */}
      <div className="grid grid-cols-2 gap-6">
        {/* Category Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">Spending by Category</h3>
          <Bar data={categoryBarData} options={barOptions} />
        </div>

        {/* Category Doughnut Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">Category Distribution</h3>
          <Doughnut data={categoryDoughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Income/Expense/Savings Pie */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-semibold text-lg mb-4">Income Allocation</h3>
        <div className="max-w-md mx-auto">
          <Pie data={incomeExpensePieData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
}
