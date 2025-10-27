'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/domain/valueObjects/Category';

interface TransactionData {
  id: string;
  amount: number;
  category: string;
  date: string;
  memo: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode?: 'income' | 'expense' | null;
  editData?: TransactionData;
}

export default function TransactionModal({ isOpen, onClose, editMode = null, editData }: TransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // if edit mode, set data
  useEffect(() => {
    if (editMode && editData) {
      setTransactionType(editMode);
      setAmount(editData.amount.toString());
      setCategory(editData.category);
      setDescription(editData.memo);
      setDate(new Date(editData.date).toISOString().split('T')[0]);
    } else {
      // reset for new creation mode
      setTransactionType('expense');
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editMode, editData, isOpen]);

  const queryClient = useQueryClient();

  // get categories from domain layer
  const expenseCategories = Category.allExpense().map(cat => cat.name);
  const incomeCategories = Category.allIncome().map(cat => cat.name);

  const mutation = useMutation({
    mutationFn: async (data: { transactionType: 'income' | 'expense'; amount: number; category: string; date: string; memo: string; id?: string }) => {
      const isEdit = editMode && editData;
      const endpoint = isEdit ? `/api/${data.transactionType}/${data.id}` : `/api/${data.transactionType}`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          category: data.category,
          date: new Date(data.date).toISOString(),
          memo: data.memo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'save'} transaction`);
      }

      return response.json();
    },
    onSuccess: () => {
      // re-fetch data
      queryClient.invalidateQueries({ queryKey: ['income'] });
      queryClient.invalidateQueries({ queryKey: ['expense'] });

      // reset form
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);

      onClose();
    },
    onError: (error) => {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await mutation.mutateAsync({
        transactionType,
        amount: parseFloat(amount),
        category,
        date,
        memo: description,
        id: editData?.id,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {editMode ? 'Edit Transaction' : 'Record Transaction'}
          </h2>
          <button
            onClick={onClose}
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
                disabled={!!editMode}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  transactionType === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${editMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('income')}
                disabled={!!editMode}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  transactionType === 'income'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${editMode ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (editMode ? 'Updating...' : 'Saving...') : (editMode ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
