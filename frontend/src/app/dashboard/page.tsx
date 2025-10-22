import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import IncomeExpenseSection from "./components/IncomeExpenseSection";
import RecentTransactions from "./components/RecentTransactions";

export default function DashboardPage() {
  return (

      <div className="max-w-6xl mx-auto space-y-10">
        <Header />
        <SummaryCards />
        <IncomeExpenseSection />
        <RecentTransactions />
      </div>

  );
}
