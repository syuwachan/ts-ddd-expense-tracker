export class Money{
	//immutable
	private readonly value: number;

	constructor(value:number){
		if(value < 0){
			throw new Error('Money must be greater than 0');
		}
		this.value = value;
	}

	get amount():number{
		return this.value;
	}

	add(other:Money):Money{
		return new Money(this.value + other.value);
	}

	subtract(other:Money):Money{
		if(other.value > this.value){
			throw new Error('Insufficient funds');
		}
		return new Money(this.value - other.value);
	}

	equals(other:Money):boolean{
		return this.value === other.value;
	}
}