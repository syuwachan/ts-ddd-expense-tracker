import { create } from "zustand";
import { LocalIncomeRepository } from "@infrastructure/LocalIncomeRepository";
import { AddIncomeService } from "@application/useCases/AddIncomeService";
import { CalculateTotalIncomeService } from "@application/useCases/CalculateTotalIncomeService";

import { Income } from "@domain/entities/Income";

const repo = new LocalIncomeRepository();

// Store state interface
interface IncomeState {
  incomes: Income[];
  total:number;
  fetchAll: () => Promise<void>;
  addIncome: (income: Income) => Promise<void>;
  calculateTotal: () => Promise<void>;
}

export const useIncomeStore = create<IncomeState>((set) => ({
  incomes: [],
  total: 0,

  fetchAll: async () => {
    const all = await repo.findAll();
    set({ incomes: all });
  },

  addIncome: async (income: Income) => {
    const service = new AddIncomeService(repo);
    await service.execute(income);
    const all = await repo.findAll();
    set({ incomes: all });
  },

  calculateTotal: async () => {
    const calcService = new CalculateTotalIncomeService(repo);
    const total = await calcService.execute();
    set({ total: total.amount });
  },
}));
