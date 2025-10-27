// infrastructure/di/container.ts
import { PrismaExpenseRepository } from "@/infrastructure/PrismaExpenseRepository";
import { PrismaIncomeRepository } from "@/infrastructure/PrismaIncomeRepository";
import { RecordExpenseService } from "@/domain/services/RecordExpenseService";
import { RecordIncomeService } from "@/domain/services/RecordIncomeService";
import { UpdateExpenseService } from "@/domain/services/UpdateExpenseService";
import { UpdateIncomeService } from "@/domain/services/UpdateIncomeService";
import { CalculateTotalExpenseService } from "@/application/useCases/CalculateTotalExpenseService";
import { CalculateTotalIncomeService } from "@/application/useCases/CalculateTotalIncomeService";
import { CalculateBudgetByCategoryService } from "@/application/useCases/CalculateBudgetByCategoryService";
import { CalculateMonthlySpendingService } from "@/application/useCases/CalculateMonthlySpendingService";
import { ExpenseRepository } from "@/domain/repositories/ExpenseRepository";
import { IncomeRepository } from "@/domain/repositories/IncomeRepository";

/**
 * Dependency Injection Container
 */
class DIContainer {
  // =============================
  // Repository Factories
  // =============================

  private createExpenseRepository(): ExpenseRepository {
    return new PrismaExpenseRepository();
  }

  private createIncomeRepository(): IncomeRepository {
    return new PrismaIncomeRepository();
  }

  // =============================
  // Service Factories (Expense)
  // =============================

  public createRecordExpenseService(): RecordExpenseService {
    const repo = this.createExpenseRepository();
    return new RecordExpenseService(repo);
  }

  public createUpdateExpenseService(): UpdateExpenseService {
    const repo = this.createExpenseRepository();
    return new UpdateExpenseService(repo);
  }

  // =============================
  // Service Factories (Income)
  // =============================

  public createRecordIncomeService(): RecordIncomeService {
    const repo = this.createIncomeRepository();
    return new RecordIncomeService(repo);
  }

  public createUpdateIncomeService(): UpdateIncomeService {
    const repo = this.createIncomeRepository();
    return new UpdateIncomeService(repo);
  }

  // =============================
  // Direct Repository Access
  // (for GET operations)
  // =============================

  public getExpenseRepository(): ExpenseRepository {
    return this.createExpenseRepository();
  }

  public getIncomeRepository(): IncomeRepository {
    return this.createIncomeRepository();
  }

  // =============================
  // Application Service Factories
  // (for calculations)
  // =============================

  public createCalculateTotalExpenseService(): CalculateTotalExpenseService {
    const repo = this.createExpenseRepository();
    return new CalculateTotalExpenseService(repo);
  }

  public createCalculateTotalIncomeService(): CalculateTotalIncomeService {
    const repo = this.createIncomeRepository();
    return new CalculateTotalIncomeService(repo);
  }

  public createCalculateBudgetByCategoryService(): CalculateBudgetByCategoryService {
    const repo = this.createExpenseRepository();
    return new CalculateBudgetByCategoryService(repo);
  }

  public createCalculateMonthlySpendingService(): CalculateMonthlySpendingService {
    const repo = this.createExpenseRepository();
    return new CalculateMonthlySpendingService(repo);
  }
}

/**
 * Factory function to create a new container instance per request
 */
export const createContainer = (): DIContainer => {
  return new DIContainer();
};
