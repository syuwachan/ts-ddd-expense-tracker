// infrastructure/PrismaExpenseRepository.ts
import { prisma } from "@/lib/prisma";
import { ExpenseRepository } from "@/domain/repositories/ExpenseRepository";
import { Expense } from "@/domain/entities/Expense";
import { Money } from "@/domain/valueObjects/Money";
import { DateValue } from "@/domain/valueObjects/DateValue";
import { Category, ExpenseCategoryType } from "@/domain/valueObjects/Category";
import { Memo } from "@/domain/valueObjects/Memo";

export class PrismaExpenseRepository implements ExpenseRepository {
	async save(expense: Expense): Promise<void> {
		await prisma.expense.upsert({
			where: { id: expense.id },
			update: expense.toPersistence(),
			create: expense.toPersistence(),
		});
	}

	async findById(id: string): Promise<Expense | null> {
		const record = await prisma.expense.findUnique({ where: { id } });
		if (!record) return null;
		return new Expense(
			record.id,
			new Money(record.amount),
			new DateValue(record.date),
			new Category(record.category as ExpenseCategoryType),
			new Memo(record.memo)
		);
	}

	async findAll(): Promise<Expense[]> {
		const records = await prisma.expense.findMany({ orderBy: { date: "desc" } });
		return records.map(
			(r) =>
				new Expense(
					r.id,
					new Money(r.amount),
					new DateValue(r.date),
					new Category(r.category as ExpenseCategoryType),
					new Memo(r.memo)
				)
		);
	}

	async findByMonth(month: string): Promise<Expense[]> {
		const start = new Date(`${month}-01`);
		const end = new Date(start);
		end.setMonth(end.getMonth() + 1);

		const records = await prisma.expense.findMany({
			where: {
				date: {
					gte: start,
					lt: end,
				},
			},
			orderBy: { date: "desc" },
		});

		return records.map(
			(r) =>
				new Expense(
					r.id,
					new Money(r.amount),
					new DateValue(r.date),
					new Category(r.category as ExpenseCategoryType),
					new Memo(r.memo)
				)
		);
	}

	async update(expense: Expense): Promise<Expense> {
		await prisma.expense.update({
		  where: { id: expense.id },
		  data: expense.toPersistence(),
		});
		return expense;
	        }
	        
	async delete(id: string): Promise<void> {
		await prisma.expense.delete({ where: { id } });	
	}
}
