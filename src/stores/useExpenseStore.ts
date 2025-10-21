import { create } from "zustand";
import {LocalExpenseRepository} from '@infrastructure/LocalExpenseRepository';
import {AddExpenseService} from '@application/useCases/AddExpenseService';
import {CalculateTotalExpenseService} from '@application/useCases/CalculateTotalExpenseService';
import {Expense} from '@domain/entities/Expense';

const repo=new LocalExpenseRepository();

//store state interface
interface ExpenseState{
	expenses: Expense[];
	total: number;
	fetchAll: () => Promise<void>;
	addExpense: (expense: Expense) => Promise<void>;
	calculateTotal: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
	expenses: [],
	total: 0,
	fetchAll: async () => {
		const all = await repo.findAll();
                    set({ expenses: all });
	},
	addExpense: async (expense: Expense) => {
		const service = new AddExpenseService(repo);
                    await service.execute(expense);
                    const all = await repo.findAll();
                    set({ expenses: all });
	},
	calculateTotal: async () => {
		const calcService = new CalculateTotalExpenseService(repo);
                    const total = await calcService.execute();
                    set({ total: total.amount });
	},
}));
