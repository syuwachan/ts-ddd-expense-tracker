//this service is used to add a new expense
//this is saved Expense entitiy by using ExpenseRepository

import {Expense} from '@domain/entities/Expense'
import {ExpenseRepository} from '@domain/repositories/ExpenseRepository'

export class AddExpenseService{
	//dependency injection
	constructor(private expenseRepository: ExpenseRepository){}

	async execute(expense: Expense): Promise<void>{
		await this.expenseRepository.save(expense);
	}
}