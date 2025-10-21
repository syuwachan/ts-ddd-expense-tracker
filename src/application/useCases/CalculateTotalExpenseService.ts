import {ExpenseRepository} from '@domain/repositories/ExpenseRepository'
import {Money} from '@domain/valueObjects/Money'

export class CalculateTotalExpenseService{
	//dependency injection
	constructor(private expenseRepository: ExpenseRepository){}

	async execute(): Promise<Money>{
		//get all expenses
		const expenses = await this.expenseRepository.findAll();
		//calculate total expense
		return expenses.reduce((acc, expense) => acc.add(expense.amount), new Money(0));
	}
}