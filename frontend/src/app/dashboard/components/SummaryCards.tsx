'use client';

export default function SummaryCards() {
  const total = 120000;
  const income = 200000;
  const expense = 80000;

  const savingRate =
    income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  return (
    <section className="grid grid-cols-3 gap-6">
      {/* 💰 Total Balance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
        <p className="text-2xl font-semibold text-gray-800 mt-1">
          ¥{total.toLocaleString()}
        </p>

        {/* 💡 貯蓄率 */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Savings Rate</span>
            <span>{savingRate}%</span>
          </div>
        </div>

        {/* ➕ Record ボタン */}
        <div className="mt-6 text-center hover:scale-105 transition-transform duration-200">
          <button
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            + Record
          </button>
        </div>
      </div>

    </section>
  );
}
