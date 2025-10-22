'use client';

import { useEffect, useState } from "react";

export default function Header() {
  const [today, setToday] = useState("");

  useEffect(() => {
    const date = new Date();
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(formatted);
  }, []);

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500">Overview of your finances</p>
      </div>
      <p className="text-gray-600 font-medium">{today}</p>
    </header>
  );
}
