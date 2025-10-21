import {IncomeRepository} from '@domain/repositories/IncomeRepository'
import {Money} from '@domain/valueObjects/Money'

export class CalculateTotalIncomeService{
	//dependency injection
	constructor(private incomeRepository: IncomeRepository){}

	async execute(): Promise<Money>{
		//get all incomes
		const incomes = await this.incomeRepository.findAll();
		//calculate total income
		return incomes.reduce((acc, income) => acc.add(income.amount), new Money(0));
	}
}
