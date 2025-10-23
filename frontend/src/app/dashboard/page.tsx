import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import IncomeExpenseSection from "./components/IncomeExpenseSection";
import BudgetTracker from "./components/BudgetTracker";
import TotalSpending from "./components/TotalSpending";

export default function DashboardPage() {
  return (

      <div className="max-w-6xl mx-auto space-y-10">
        <Header />
        <SummaryCards />
        <BudgetTracker />
        <TotalSpending/>
        <IncomeExpenseSection />
      </div>

  );
}
