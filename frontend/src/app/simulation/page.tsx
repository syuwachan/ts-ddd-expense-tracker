'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SettingsPage() {
  // 目標設定
  const [monthlyIncomeGoal, setMonthlyIncomeGoal] = useState(200000);
  const [monthlyExpenseGoal, setMonthlyExpenseGoal] = useState(80000);
  const [savingsGoal, setSavingsGoal] = useState(1000000);
  const [savingsDeadline, setSavingsDeadline] = useState('2026-12-31');

  // 資産シミュレーション
  const [currentAssets, setCurrentAssets] = useState(500000);
  const [monthlySavings, setMonthlySavings] = useState(120000);
  const [annualReturn, setAnnualReturn] = useState(3);
  const [simulationYears, setSimulationYears] = useState(10);

  // シミュレーション計算
  const calculateSimulation = () => {
    const months = simulationYears * 12;
    const monthlyRate = annualReturn / 100 / 12;
    const data = [];

    let assets = currentAssets;

    for (let i = 0; i <= months; i++) {
      if (i % 12 === 0) {
        data.push(Math.round(assets));
      }
      assets = assets * (1 + monthlyRate) + monthlySavings;
    }

    return data;
  };

  const simulationData = calculateSimulation();
  const finalAssets = simulationData[simulationData.length - 1];

  const chartData = {
    labels: Array.from({ length: simulationYears + 1 }, (_, i) => `Year ${i}`),
    datasets: [
      {
        label: 'Projected Assets',
        data: simulationData,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 4,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context: any) => `¥${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => `¥${(value / 10000).toFixed(0)}万`,
        },
      },
    },
  };

  // 目標達成までの期間計算
  const calculateGoalMonths = () => {
    if (monthlySavings <= 0) return Infinity;
    const remaining = savingsGoal - currentAssets;
    if (remaining <= 0) return 0;

    const monthlyRate = annualReturn / 100 / 12;
    let assets = currentAssets;
    let months = 0;

    while (assets < savingsGoal && months < 600) {
      assets = assets * (1 + monthlyRate) + monthlySavings;
      months++;
    }

    return months;
  };

  const monthsToGoal = calculateGoalMonths();
  const yearsToGoal = Math.floor(monthsToGoal / 12);
  const remainingMonths = monthsToGoal % 12;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        <p className="text-gray-500">Manage your financial goals and simulations</p>
      </header>

      {/* 目標設定セクション */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Financial Goals</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* 月次収入目標 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income Goal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
              <input
                type="number"
                value={monthlyIncomeGoal}
                onChange={(e) => setMonthlyIncomeGoal(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* 月次支出目標 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Expense Goal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
              <input
                type="number"
                value={monthlyExpenseGoal}
                onChange={(e) => setMonthlyExpenseGoal(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* 貯蓄目標額 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Savings Goal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* 目標達成期限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Date
            </label>
            <input
              type="date"
              value={savingsDeadline}
              onChange={(e) => setSavingsDeadline(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* 目標サマリー */}
        <div className="mt-6 p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expected Monthly Savings</p>
              <p className="text-2xl font-bold text-sky-600">
                ¥{(monthlyIncomeGoal - monthlyExpenseGoal).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Savings Rate</p>
              <p className="text-2xl font-bold text-sky-600">
                {monthlyIncomeGoal > 0
                  ? Math.round(((monthlyIncomeGoal - monthlyExpenseGoal) / monthlyIncomeGoal) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 資産シミュレーションセクション */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Asset Simulation</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* 現在の資産 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Assets
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
              <input
                type="number"
                value={currentAssets}
                onChange={(e) => setCurrentAssets(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* 月次積立額 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Savings
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
              <input
                type="number"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* 年間利回り */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Return (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <p className="text-xs text-gray-500 mt-1">Average stock market return: 5-7%</p>
          </div>

          {/* シミュレーション期間 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Simulation Period (Years)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={simulationYears}
              onChange={(e) => setSimulationYears(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* シミュレーション結果 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Starting Amount</p>
            <p className="text-xl font-bold text-blue-600">¥{currentAssets.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Total Contributions</p>
            <p className="text-xl font-bold text-green-600">
              ¥{(monthlySavings * simulationYears * 12).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Projected Final Amount</p>
            <p className="text-xl font-bold text-purple-600">¥{finalAssets.toLocaleString()}</p>
          </div>
        </div>

        {/* チャート */}
        <div className="mb-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* 利益計算 */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Contributions</p>
              <p className="text-lg font-semibold text-gray-800">
                ¥{(currentAssets + monthlySavings * simulationYears * 12).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Investment Gains</p>
              <p className="text-lg font-semibold text-green-600">
                ¥{(finalAssets - currentAssets - monthlySavings * simulationYears * 12).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Return</p>
              <p className="text-lg font-semibold text-purple-600">
                {((finalAssets / (currentAssets + monthlySavings * simulationYears * 12) - 1) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 目標達成シミュレーション */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Goal Achievement Timeline</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Savings Goal</h3>
            <p className="text-3xl font-bold text-sky-600 mb-2">¥{savingsGoal.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mb-4">Target: {savingsDeadline}</p>

            {monthsToGoal !== Infinity && monthsToGoal !== 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time to Goal:</span>
                  <span className="font-semibold text-gray-800">
                    {yearsToGoal > 0 && `${yearsToGoal} years `}
                    {remainingMonths > 0 && `${remainingMonths} months`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-semibold text-gray-800">
                    {((currentAssets / savingsGoal) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className="bg-gradient-to-r from-sky-400 to-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min((currentAssets / savingsGoal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ) : monthsToGoal === 0 ? (
              <div className="p-3 bg-green-100 rounded-lg text-green-800 text-sm font-medium">
                🎉 Goal already achieved!
              </div>
            ) : (
              <div className="p-3 bg-yellow-100 rounded-lg text-yellow-800 text-sm font-medium">
                ⚠️ Increase monthly savings to reach your goal
              </div>
            )}
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Savings Required</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">
              ¥{monthlySavings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-4">per month at {annualReturn}% annual return</p>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600">If you save more (+¥20,000)</p>
                <p className="text-sm font-semibold text-green-600">
                  Reach goal {Math.max(0, Math.floor(((savingsGoal - currentAssets) / (monthlySavings + 20000)) / 12))} months earlier
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600">Total interest earned</p>
                <p className="text-sm font-semibold text-green-600">
                  ¥{Math.max(0, savingsGoal - currentAssets - (monthlySavings * monthsToGoal)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all">
          Cancel
        </button>
        <button className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-all shadow-sm">
          Save Settings
        </button>
      </div>
    </div>
  );
}
