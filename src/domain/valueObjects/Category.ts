export type CategoryType =
  | "Food"
  | "Transport"
  | "Housing"
  | "Entertainment"
  | "Other";

export class Category{
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

	static all(): Category[] {
		return [
		  new Category("Food"),
		  new Category("Transport"),
		  new Category("Housing"),
		  new Category("Entertainment"),
		  new Category("Other"),
		];
	}

}