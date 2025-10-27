'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useIncome, useExpense, useDeleteIncome, useDeleteExpense } from '@/hooks/useTransactions';
import TransactionModal from './TransactionModal';

interface TransactionData {
  id: string;
  amount: number;
  category: string;
  date: string;
  memo: string;
}

export default function IncomeExpenseSection() {
  const { data: incomesData, isLoading: incomesLoading } = useIncome();
  const { data: expensesData, isLoading: expensesLoading } = useExpense();
  const deleteIncome = useDeleteIncome();
  const deleteExpense = useDeleteExpense();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<'income' | 'expense' | null>(null);
  const [editData, setEditData] = useState<TransactionData | undefined>(undefined);

  const incomes = incomesData?.slice(0, 5) || [];
  const expenses = expensesData?.slice(0, 5) || [];

  const handleEdit = (type: 'income' | 'expense', data: TransactionData) => {
    setEditMode(type);
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleDelete = async (type: 'income' | 'expense', id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      if (type === 'income') {
        await deleteIncome.mutateAsync(id);
      } else {
        await deleteExpense.mutateAsync(id);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditMode(null);
    setEditData(undefined);
  };

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
                  className="flex justify-between items-center py-2 hover:bg-gray-50 transition group"
                >
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{income.category}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(income.date).toLocaleDateString('ja-JP')} — {income.memo || 'No memo'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-green-600 font-semibold">
                      +¥{income.amount.toLocaleString()}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit('income', income)}
                        className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete('income', income.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
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
                  className="flex justify-between items-center py-2 hover:bg-gray-50 transition group"
                >
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{expense.category}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString('ja-JP')} — {expense.memo || 'No memo'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-red-500 font-semibold">
                      -¥{expense.amount.toLocaleString()}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit('expense', expense)}
                        className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete('expense', expense.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editMode={editMode}
        editData={editData}
      />
    </section>
  );
}
