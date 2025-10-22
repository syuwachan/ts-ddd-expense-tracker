
export class DateValue {
	private readonly value: Date;
        
	constructor(value: string | Date) {
	  const date = value instanceof Date ? value : new Date(value);
        
	  if (isNaN(date.getTime())) {
	    throw new Error("Invalid date");
	  }
        
	  this.value = date;
	}
        
	get date(): Date {
	  return this.value;
	}
        
	/** YYYY-MM-DD 形式で返す（UI向け） */
	get formatted(): string {
	  return this.value.toISOString().split("T")[0];
	}
        
	/** ISO 8601形式の完全な文字列 */
	get isoString(): string {
	  return this.value.toISOString();
	}
        
	equals(other: DateValue): boolean {
	  return this.value.getTime() === other.date.getTime();
	}
        }
        