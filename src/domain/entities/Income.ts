import { Money } from '../valueObjects/Money';
import { DateValue } from '../valueObjects/DateValue';
import { Category } from '../valueObjects/Category';
import { Memo } from '../valueObjects/Memo';
import { randomUUID } from 'crypto';

export class Income{
	constructor(
		public readonly id: string=randomUUID(),
		private  _amount: Money,
		private  _date: DateValue,
		private  _category: Category,
		private  _memo: Memo,
	) {}

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
		return `[${this._category.name}] +${this._amount.amount}円 - ${this._memo.content}`;
	}

	toJSON() { 
	return { 
		id: this.id, 
		amount: this._amount.amount, 
		date: this._date.formatted, 
		category: this._category.name, 
		memo: this._memo.content, 
	};
	}
}