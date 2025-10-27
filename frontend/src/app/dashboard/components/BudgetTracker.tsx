'use client';

import { useBudget } from '@/hooks/useTransactions';

export default function BudgetTracker() {
  const { data, isLoading, isError } = useBudget();

  if (isLoading) {
    return (
      <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
        <h3 className="text-gray-800 font-semibold text-lg mb-4">Budget Tracker</h3>
        <p className="text-gray-400">Loading...</p>
      </section>
    );
  }
  if (isError || !data) {
    return (
      <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
        <h3 className="text-gray-800 font-semibold text-lg mb-4">Budget Tracker</h3>
        <p className="text-red-500">Failed to load budget data</p>
      </section>
    );
  }

  const budgets = data.budgets;
  const totalBudget = data.total;

  return (
    <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-800 font-semibold text-lg">Budget Tracker</h3>

      </div>

      {/* Total */}
      <div className="mb-1">
        <p className="text-2xl font-semibold text-gray-900">¥{totalBudget.toLocaleString()}</p>
        <p className="text-sm text-gray-500">Total spent across all categories</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mt-4 mb-6">
        <div className="flex-1 h-4 flex overflow-hidden rounded-full">
          {budgets.map((b) => (
            <div
              key={b.category}
              className={`h-full bg-gradient-to-r ${b.color}`}
              style={{ width: `${b.percent}%` }}
            ></div>
          ))}
        </div>
        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
          100%
        </span>
      </div>

      {/* Category List */}
      <div className="divide-y divide-gray-100">
        {budgets.length > 0 ? (
          budgets.map((b) => (
            <div key={b.category} className="flex justify-between items-center py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${b.color}`}
                ></span>
                <span className="text-gray-700 font-medium">{b.category}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-gray-600 font-medium">
                  ¥{b.amount.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm">{b.percent}%</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-4">No expense data yet</p>
        )}
      </div>
    </section>
  );
}
