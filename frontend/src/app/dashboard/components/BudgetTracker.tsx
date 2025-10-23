'use client';

export default function BudgetTracker() {
  const budgets = [
    { category: "Food & Drink", amount: 4839.99, color: "from-orange-400 to-red-400", percent: 36 },
    { category: "Entertainment", amount: 2193.12, color: "from-red-400 to-pink-500", percent: 24 },
    { category: "Housing", amount: 1128.75, color: "from-pink-500 to-purple-500", percent: 13 },
    { category: "Shopping", amount: 654.21, color: "from-purple-500 to-fuchsia-500", percent: 7 },
    { category: "Others", amount: 3213.48, color: "from-gray-400 to-gray-300", percent: 20 },
  ];

  const totalSpent = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalBudget = 12346.68;

  return (
    <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-800 font-semibold text-lg">Budget Tracker</h3>

      </div>

      {/* Total */}
      <div className="mb-1">
        <p className="text-2xl font-semibold text-gray-900">${totalBudget.toLocaleString()}</p>
        <p className="text-sm text-gray-500">Live budget across all categories</p>
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
          ${totalSpent.toLocaleString()} spent so far
        </span>
      </div>

      {/* Category List */}
      <div className="divide-y divide-gray-100">
        {budgets.map((b) => (
          <div key={b.category} className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full bg-gradient-to-r ${b.color}`}
              ></span>
              <span className="text-gray-700 font-medium">{b.category}</span>
            </div>
            <div className="flex items-center gap-8">
              <span className="text-gray-600 font-medium">
                ${b.amount.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm">{b.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
