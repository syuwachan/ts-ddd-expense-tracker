'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, PieChart, BarChart2, Settings } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/transactions", icon: Wallet },
  { name: "Chart", href: "/chart", icon: PieChart },
  { name: "Report", href: "/report", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-200 border-r border-gray-100 shadow-sm flex flex-col p-6">
      <nav className="space-y-2">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-600"
              }`}
            >
              <Icon size={18} />
              {name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} MyBudget
        </p>
      </div>
    </aside>
  );
}
