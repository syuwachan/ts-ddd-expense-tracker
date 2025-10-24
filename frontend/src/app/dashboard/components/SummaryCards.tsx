'use client';

import { useState } from 'react';
import TransactionModal from './TransactionModal';
import { useTransactions } from '@/hooks/useTransactions';

export default function SummaryCards() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { totalIncome, totalExpense, balance, isLoading } = useTransactions();

  const savingRate =
    totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <>
      <section className="grid grid-cols-3 gap-6">
        {/* 💰 Total Balance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
          {isLoading ? (
            <p className="text-2xl font-semibold text-gray-400 mt-1">Loading...</p>
          ) : (
            <p className="text-2xl font-semibold text-gray-800 mt-1">
              ¥{balance.toLocaleString()}
            </p>
          )}

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

        {/* 💵 Total Income */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Income</h3>
          {isLoading ? (
            <p className="text-2xl font-semibold text-gray-400 mt-1">Loading...</p>
          ) : (
            <p className="text-2xl font-semibold text-green-600 mt-1">
              ¥{totalIncome.toLocaleString()}
            </p>
          )}
        </div>

        {/* 💸 Total Expense */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Expense</h3>
          {isLoading ? (
            <p className="text-2xl font-semibold text-gray-400 mt-1">Loading...</p>
          ) : (
            <p className="text-2xl font-semibold text-red-600 mt-1">
              ¥{totalExpense.toLocaleString()}
            </p>
          )}
        </div>

      </section>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
