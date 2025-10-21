//this service is used to add a new income
//this is saved Income entitiy by using IncomeRepository

import {Income} from '@domain/entities/Income'
import {IncomeRepository} from '@domain/repositories/IncomeRepository'

export class AddIncomeService{
	//dependency injection
	constructor(private incomeRepository: IncomeRepository){}

	async execute(income: Income): Promise<void>{
		await this.incomeRepository.save(income);
	}
}