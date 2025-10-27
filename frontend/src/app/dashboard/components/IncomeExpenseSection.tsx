'use client';

import { useIncome, useExpense } from '@/hooks/useTransactions';

export default function IncomeExpenseSection() {
  const { data: incomesData, isLoading: incomesLoading } = useIncome();
  const { data: expensesData, isLoading: expensesLoading } = useExpense();

  const incomes = incomesData?.slice(0, 5) || [];
  const expenses = expensesData?.slice(0, 5) || [];

  return (
    <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Income & Expenses</h3>

      <div className="grid grid-cols-2 gap-8">
        {/* Incomes */}
        <div>
          <h4 className="text-gray-700 font-semibold mb-3">Incomes</h4>
          {incomesLoading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : incomes.length === 0 ? (
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
                      {new Date(income.date).toLocaleDateString('ja-JP')} — {income.memo || 'No memo'}
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
          {expensesLoading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : expenses.length === 0 ? (
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
                      {new Date(expense.date).toLocaleDateString('ja-JP')} — {expense.memo || 'No memo'}
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
