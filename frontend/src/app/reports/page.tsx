'use client';

import { useState } from 'react';

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState('2025-10');

  // サンプルデータ
  const monthlyReport = {
    month: 'October 2025',
    totalIncome: 200000,
    totalExpense: 90000,
    netSavings: 110000,
    savingsRate: 55,
    topCategories: [
      { name: 'Housing', amount: 45000, percent: 50 },
      { name: 'Food & Drink', amount: 32000, percent: 35.6 },
      { name: 'Entertainment', amount: 18000, percent: 20 },
      { name: 'Transport', amount: 15000, percent: 16.7 },
      { name: 'Shopping', amount: 12000, percent: 13.3 },
    ],
    comparison: {
      lastMonth: {
        income: 200000,
        expense: 95000,
        savings: 105000,
      },
      change: {
        income: 0,
        expense: -5.3,
        savings: 4.8,
      },
    },
    insights: [
      {
        type: 'success',
        title: 'Great job on reducing expenses!',
        description: 'You spent 5.3% less this month compared to last month.',
      },
      {
        type: 'warning',
        title: 'Housing costs are high',
        description: 'Housing represents 50% of your expenses. Consider reviewing this category.',
      },
      {
        type: 'info',
        title: 'Savings goal on track',
        description: 'Your savings rate of 55% exceeds the recommended 20-30% guideline.',
      },
    ],
  };

  const yearlyOverview = {
    totalIncome: 1480000,
    totalExpense: 630000,
    totalSavings: 850000,
    avgMonthlySavings: 121428,
    bestMonth: 'March',
    worstMonth: 'June',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
          <p className="text-gray-500">Detailed financial analysis and insights</p>
        </div>
        <div>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </header>

      {/* Monthly Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Monthly Summary - {monthlyReport.month}</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-blue-600">¥{monthlyReport.totalIncome.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              {monthlyReport.comparison.change.income >= 0 ? '+' : ''}
              {monthlyReport.comparison.change.income}% from last month
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Expense</p>
            <p className="text-2xl font-bold text-red-600">¥{monthlyReport.totalExpense.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              {monthlyReport.comparison.change.expense >= 0 ? '+' : ''}
              {monthlyReport.comparison.change.expense}% from last month
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Net Savings</p>
            <p className="text-2xl font-bold text-green-600">¥{monthlyReport.netSavings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              {monthlyReport.comparison.change.savings >= 0 ? '+' : ''}
              {monthlyReport.comparison.change.savings}% from last month
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
            <p className="text-2xl font-bold text-purple-600">{monthlyReport.savingsRate}%</p>
            <p className="text-xs text-gray-500 mt-1">of total income</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Insights & Recommendations</h2>
        <div className="space-y-4">
          {monthlyReport.insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'success'
                  ? 'bg-green-50 border-green-500'
                  : insight.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <h3
                className={`font-semibold mb-1 ${
                  insight.type === 'success'
                    ? 'text-green-800'
                    : insight.type === 'warning'
                    ? 'text-yellow-800'
                    : 'text-blue-800'
                }`}
              >
                {insight.title}
              </h3>
              <p className="text-sm text-gray-700">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Spending Categories */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Spending Categories</h2>
        <div className="space-y-4">
          {monthlyReport.topCategories.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">{category.name}</span>
                <div className="text-right">
                  <span className="text-gray-900 font-semibold">¥{category.amount.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm ml-2">({category.percent}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${category.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Yearly Overview (2025)</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Income (YTD)</p>
            <p className="text-xl font-bold text-gray-800">¥{yearlyOverview.totalIncome.toLocaleString()}</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Expense (YTD)</p>
            <p className="text-xl font-bold text-gray-800">¥{yearlyOverview.totalExpense.toLocaleString()}</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Savings (YTD)</p>
            <p className="text-xl font-bold text-green-600">¥{yearlyOverview.totalSavings.toLocaleString()}</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Avg Monthly Savings</p>
            <p className="text-xl font-bold text-gray-800">¥{yearlyOverview.avgMonthlySavings.toLocaleString()}</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Best Month</p>
            <p className="text-xl font-bold text-green-600">{yearlyOverview.bestMonth}</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Worst Month</p>
            <p className="text-xl font-bold text-red-600">{yearlyOverview.worstMonth}</p>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Reports</h2>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-all shadow-sm">
            Export as PDF
          </button>
          <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all shadow-sm">
            Export as Excel
          </button>
          <button className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all shadow-sm">
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
}
