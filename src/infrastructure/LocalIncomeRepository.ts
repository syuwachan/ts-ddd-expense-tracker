import { Income, IncomeData } from "@domain/entities/Income";
import { IncomeRepository } from "@domain/repositories/IncomeRepository";
import { Money } from "@domain/valueObjects/Money";
import { Category } from "@domain/valueObjects/Category";
import { Memo } from "@domain/valueObjects/Memo";
import { DateValue } from "@domain/valueObjects/DateValue";

export class LocalIncomeRepository implements IncomeRepository{
	constructor(private incomeRepository: IncomeRepository){}

	async save(income: Income): Promise<void>{
		await this.incomeRepository.save(income);
	}

	async findAll(): Promise<Income[]> {
		const data = localStorage.getItem(this.key);
		if (!data) return [];

		const parsed: IncomeData[] = JSON.parse(data);
		return parsed.map((item: IncomeData) => new Income(item.id, new Money(item.amount), new DateValue(item.date), new Category(item.category), new Memo(item.memo)));
	}

	async findById(id: string): Promise<Income | null> {
		const all = await this.findAll();
		return all.find((e) => e.id === id) ?? null;
	}

	async findByMonth(month: string): Promise<Income[]> {
		const all = await this.findAll();
		return all.filter((e) => e.date.formatted.startsWith(month));
	}

	async delete(id: string): Promise<void> {
		const all = await this.findAll();
		const filtered = all.filter((e) => e.id !== id);
		localStorage.setItem(this.key, JSON.stringify(filtered.map((e) => e.toJSON())));
	}
}