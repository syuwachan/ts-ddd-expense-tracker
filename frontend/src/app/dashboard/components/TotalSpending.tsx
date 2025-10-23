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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

export default function TotalSpending() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const spending = [4800, 5100, 4650, 5200, 4900, 5300, 5500];

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Total Spending',
        data: spending,
        fill: true, // ← 面グラデーション有効化
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // sky-500 with opacity
        borderColor: 'rgba(59, 130, 246, 1)', // sky-500
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 5,
        tension: 0.4, // ← 曲線にする
      },
    ],
  };

  const options = {
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
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 } },
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: {
          color: '#6b7280',
          callback: (value: number) => `¥${value.toLocaleString()}`,
        },
      },
    },
  };

  const total = spending.reduce((a, b) => a + b, 0);

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
          <p className="text-sm text-gray-400">Total (Jan–Jul)</p>
        </div>
      </div>

      {/* Chart */}
      <Line data={data} options={options} />
    </div>
  );
}
