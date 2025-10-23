'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function SummaryCards() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const total = 120000;
  const income = 200000;
  const expense = 80000;

  const savingRate =
    income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  const expenseCategories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Other'];
  const incomeCategories = ['Salary', 'Bonus', 'Investment', 'Gift', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここでデータを保存する処理を追加
    console.log({ transactionType, amount, category, description, date });
    // モーダルを閉じてフォームをリセット
    setIsModalOpen(false);
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <>
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
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              + Record
            </button>
          </div>
        </div>

      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Record Transaction</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTransactionType('expense')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      transactionType === 'expense'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType('income')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      transactionType === 'income'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select category</option>
                  {(transactionType === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Enter description (optional)"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-all shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
