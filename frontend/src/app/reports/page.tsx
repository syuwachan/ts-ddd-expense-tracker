'use client';

import { useState } from 'react';
import { useMonthlyReport } from '@/hooks/useTransactions';

export default function ReportsPage() {
  // Default to current year-month
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const { data: monthlyReport, isLoading, isError } = useMonthlyReport(selectedMonth);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
          <p className="text-gray-500">Detailed financial analysis and insights</p>
        </header>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-400">Loading report...</p>
        </div>
      </div>
    );
  }

  if (isError || !monthlyReport) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
          <p className="text-gray-500">Detailed financial analysis and insights</p>
        </header>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-red-500">Failed to load report data</p>
        </div>
      </div>
    );
  }

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
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Expense</p>
            <p className="text-2xl font-bold text-red-600">¥{monthlyReport.totalExpense.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Net Savings</p>
            <p className="text-2xl font-bold text-green-600">¥{monthlyReport.netSavings.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
            <p className="text-2xl font-bold text-purple-600">{monthlyReport.savingsRate}%</p>
            <p className="text-xs text-gray-500 mt-1">of total income</p>
          </div>
        </div>
      </div>

      {/* Top Spending Categories */}
      {monthlyReport.topCategories.length > 0 ? (
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
                    style={{ width: `${Math.min(category.percent, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">No expense data for this month</p>
        </div>
      )}

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
