import { Expense } from "../entities/Expense";

export interface ExpenseRepository {
	 save(expense: Expense): Promise<void>;
	 findById(id: string): Promise<Expense | null>;
	 findAll(): Promise<Expense[]>;
	 findByMonth(month: string): Promise<Expense[]>;
	 delete(id: string): Promise<void>;
}