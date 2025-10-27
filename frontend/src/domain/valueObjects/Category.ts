export type ExpenseCategoryType =
  | "Food"
  | "Transport"
  | "Housing"
  | "Entertainment"
  | "Other";

export type IncomeCategoryType =
  | "Salary"
  | "Bonus"
  | "Investment"
  | "Gift"
  | "Other";

export type CategoryType = ExpenseCategoryType | IncomeCategoryType;

export class Category{
	//immutable
	private readonly value:CategoryType;

	constructor(value:CategoryType){
		if(!value){
			throw new Error('Category cannot be empty');
		}
		this.value = value;
	}

	get name():CategoryType{
		return this.value;
	}

	equals(other:Category):boolean{
		return this.value === other.value;
	}

	static allExpense(): Category[] {
		return [
		  new Category("Food"),
		  new Category("Transport"),
		  new Category("Housing"),
		  new Category("Entertainment"),
		  new Category("Other"),
		];
	}

	static allIncome(): Category[] {
		return [
		  new Category("Salary"),
		  new Category("Bonus"),
		  new Category("Investment"),
		  new Category("Gift"),
		  new Category("Other"),
		];
	}

	static all(): Category[] {
		return [...Category.allExpense(), ...Category.allIncome()];
	}

}