import { Income } from "../entities/Income";

export interface IncomeRepository {
	 save(income: Income): Promise<void>;
	 findById(id: string): Promise<Income | null>;
	 findAll(): Promise<Income[]>;
	 findByMonth(month: string): Promise<Income[]>;
	 delete(id: string): Promise<void>;
}