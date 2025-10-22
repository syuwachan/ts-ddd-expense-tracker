'use client';

export default function IncomeExpenseSection() {
  // ✅ 仮データ
  const incomes = [
    { id: 1, category: 'Salary', amount: 180000, date: '2025-10-01', memo: 'Monthly salary' },
    { id: 2, category: 'Freelance', amount: 25000, date: '2025-10-15', memo: 'Project payment' },
  ];

  const expenses = [
    { id: 1, category: 'Food', amount: 12000, date: '2025-10-02', memo: 'Lunch with friends' },
    { id: 2, category: 'Transport', amount: 8000, date: '2025-10-05', memo: 'Train card charge' },
    { id: 3, category: 'Shopping', amount: 22000, date: '2025-10-10', memo: 'Clothes' },
  ];

  return (
    <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Income & Expenses</h3>

      <div className="grid grid-cols-2 gap-8">
        {/* Incomes */}
        <div>
          <h4 className="text-gray-700 font-semibold mb-3">Incomes</h4>
          {incomes.length === 0 ? (
            <p className="text-gray-500 text-sm">No incomes recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {incomes.map((income) => (
                <li
                  key={income.id}
                  className="flex justify-between py-2 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{income.category}</p>
                    <p className="text-sm text-gray-500">
                      {income.date} — {income.memo}
                    </p>
                  </div>
                  <p className="text-green-600 font-semibold">
                    +¥{income.amount.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Expenses */}
        <div>
          <h4 className="text-gray-700 font-semibold mb-3">Expenses</h4>
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-sm">No expenses recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {expenses.map((expense) => (
                <li
                  key={expense.id}
                  className="flex justify-between py-2 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{expense.category}</p>
                    <p className="text-sm text-gray-500">
                      {expense.date} — {expense.memo}
                    </p>
                  </div>
                  <p className="text-red-500 font-semibold">
                    -¥{expense.amount.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
