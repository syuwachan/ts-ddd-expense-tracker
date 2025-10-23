// infrastructure/prisma_income_repository.ts
import { prisma } from "@/lib/prisma";
import { IncomeRepository } from "@/domain/repositories/IncomeRepository";
import { Income } from "@/domain/entities/Income";
import { Money } from "@/domain/valueObjects/Money";
import { DateValue } from "@/domain/valueObjects/DateValue";
import { Category } from "@/domain/valueObjects/Category";
import { Memo } from "@/domain/valueObjects/Memo";

export class PrismaIncomeRepository implements IncomeRepository {
	async save(income: Income): Promise<void> {
		await prisma.income.upsert({
			where: { id: income.id },
			update: income.toJSON(),
			create: income.toJSON(),
		});
	}

	async findById(id: string): Promise<Income | null> {
		const record = await prisma.income.findUnique({ where: { id } });
		if (!record) return null;
		return new Income(
			record.id,
			new Money(record.amount),
			new DateValue(record.date),
			new Category(record.category),
			new Memo(record.memo)
		);
	}

	async findAll(): Promise<Income[]> {
		const records = await prisma.income.findMany({ orderBy: { date: "desc" } });
		return records.map(
			(r) =>
				new Income(
					r.id,
					new Money(r.amount),
					new DateValue(r.date),
					new Category(r.category),
					new Memo(r.memo)
				)
		);
	}

	async findByMonth(month: string): Promise<Income[]> {
		// month = "2025-10" の形式を想定
		const start = new Date(`${month}-01`);
		const end = new Date(start);
		end.setMonth(end.getMonth() + 1);

		const records = await prisma.income.findMany({
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
				new Income(
					r.id,
					new Money(r.amount),
					new DateValue(r.date),
					new Category(r.category),
					new Memo(r.memo)
				)
		);
	}

	async delete(id: string): Promise<void> {
		await prisma.income.delete({ where: { id } });
	}
}
