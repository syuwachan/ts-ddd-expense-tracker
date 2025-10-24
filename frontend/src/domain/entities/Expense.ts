import { Money } from "../valueObjects/Money";
import { DateValue } from "../valueObjects/DateValue";
import { Category, ExpenseCategoryType } from "../valueObjects/Category";
import { Memo } from "../valueObjects/Memo";

export interface ExpenseData {
	id: string;
	amount: number;
	date: string;
	category: ExpenseCategoryType;
	memo: string;
}

export class Expense{

	constructor(
		public readonly id: string,
		private  _amount: Money,
		private  _date: DateValue,
		private  _category: Category,
		private  _memo: Memo,
	) {}

	//getter
	get amount(): Money {
		return this._amount;
	}
	get date(): DateValue {
		return this._date;
	}
	get category(): Category {
		return this._category;
	}
	get memo(): Memo {
		return this._memo;
	}

	//state change methods
	changeAmount(amount: Money): void {
		this._amount = amount;
	}
	changeDate(date: DateValue): void {
		this._date = date;
	}
	changeCategory(category: Category): void {
		this._category = category;
	}
	changeMemo(memo: Memo): void {
		this._memo = memo;
	}

	describe(): string {
		return `[${this._category.name}] ${this._amount.amount}円 - ${this._memo.content}`;
	}

	toJSON(): ExpenseData {
		return {
			id: this.id,
			amount: this._amount.amount,
			date: this._date.formatted,
			category: this._category.name as ExpenseCategoryType,
			memo: this._memo.content
		};
	}
	
	toPersistence() {
		return {
			id: this.id,
			amount: this._amount.amount,
			date: this._date.isoString,
			category: this._category.name,
			memo: this._memo.content,
		};
	}

}