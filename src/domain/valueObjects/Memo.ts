export class Memo{
	private readonly value:string;

	constructor(value:string){
		this.value = value;
	}

	get content():string{
		return this.value;
	}

	equals(other: Memo): boolean {
		return this.value === other.value;
	        }
}