'use client';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMonthlySpending } from '@/hooks/useTransactions';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

export default function TotalSpending() {
  const { data: monthlyData, isLoading, isError } = useMonthlySpending(7); // 直近7ヶ月

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-semibold text-lg mb-4">Total Spending</h3>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (isError || !monthlyData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-semibold text-lg mb-4">Total Spending</h3>
        <p className="text-red-500">Failed to load spending data</p>
      </div>
    );
  }
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = monthlyData.data.map(item => {
    const [year, month] = item.month.split('-');
    return monthNames[parseInt(month, 10) - 1];
  });

  const spending = monthlyData.data.map(item => item.amount);
  const total = monthlyData.total;

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Total Spending',
        data: spending,
        fill: true, 
        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
        borderColor: 'rgba(59, 130, 246, 1)', 
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 5,
        tension: 0.4, 
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => `¥${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 } },
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: {
          color: '#6b7280',
          callback: (value: number | string) => `¥${Number(value).toLocaleString()}`,
        },
      },
    },
  };

  // generate period text dynamically
  const firstMonth = months[0] || '';
  const lastMonth = months[months.length - 1] || '';
  const periodText = firstMonth && lastMonth ? `${firstMonth}–${lastMonth}` : 'Recent months';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-gray-800 font-semibold text-lg">Total Spending</h3>
          <p className="text-gray-500 text-sm">Monthly overview of expenses</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-gray-800">
            ¥{total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">Total ({periodText})</p>
        </div>
      </div>

      {/* Chart */}
      {spending.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p className="text-gray-400 text-center py-8">No spending data available</p>
      )}
    </div>
  );
}
