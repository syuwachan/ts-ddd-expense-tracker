'use client';

export default function RecentTransactions() {
  // ✅ 仮データ
  const transactions = [
    { id: 1, type: "income", category: "Salary", amount: 180000, date: "2025-10-01", memo: "Monthly salary" },
    { id: 2, type: "expense", category: "Food", amount: 12000, date: "2025-10-02", memo: "Lunch with friends" },
    { id: 3, type: "expense", category: "Transport", amount: 8000, date: "2025-10-05", memo: "Train card charge" },
    { id: 4, type: "income", category: "Freelance", amount: 25000, date: "2025-10-15", memo: "Project payment" },
    { id: 5, type: "expense", category: "Shopping", amount: 22000, date: "2025-10-18", memo: "Clothes" },
  ];

  return (
    <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Recent Transactions
      </h3>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-sm">No transactions recorded yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {transactions.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center py-3 hover:bg-gray-50 transition"
            >
              {/* 左側：カテゴリ・メモ */}
              <div>
                <p className="font-medium text-gray-800">{t.category}</p>
                <p className="text-sm text-gray-500">
                  {t.date} — {t.memo}
                </p>
              </div>

              {/* 右側：金額 */}
              <p
                className={`font-semibold ${
                  t.type === "income"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {t.type === "income" ? "+" : "-"}¥
                {t.amount.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
