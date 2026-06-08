"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function ReportsPage() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [transactions, setTransactions] = useState(0);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const expenseRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/expenses`
      );

      const expenses = await expenseRes.json();

      const expenseTotal = Array.isArray(expenses)
        ? expenses.reduce(
            (sum: number, item: any) =>
              sum + Number(item.amount),
            0
          )
        : 0;

      setTotalExpenses(expenseTotal);

      setTransactions(
        Array.isArray(expenses)
          ? expenses.length
          : 0
      );

      const budgetRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/budgets`
      );

      const budgets = await budgetRes.json();

      const budgetTotal = Array.isArray(budgets)
        ? budgets.reduce(
            (sum: number, item: any) =>
              sum + Number(item.limit_amount),
            0
          )
        : 0;

      setTotalBudget(budgetTotal);

    } catch (error) {
      console.error(error);
    }
  };

  const remaining = totalBudget - totalExpenses;

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text(
      "FinTech Financial Report",
      20,
      20
    );

    doc.setFontSize(14);

    doc.text(
      `Total Expenses: Rs.${totalExpenses}`,
      20,
      50
    );

    doc.text(
      `Total Budget: Rs.${totalBudget}`,
      20,
      70
    );

    doc.text(
      `Remaining Balance: Rs.${remaining}`,
      20,
      90
    );

    doc.text(
      `Total Transactions: ${transactions}`,
      20,
      110
    );

    doc.save("Financial_Report.pdf");
  };

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-10">
        Financial Report
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <div className="border p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            Total Expenses
          </h2>

          <p className="text-4xl mt-4">
            ₹{totalExpenses}
          </p>
        </div>

        <div className="border p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            Total Budget
          </h2>

          <p className="text-4xl mt-4">
            ₹{totalBudget}
          </p>
        </div>

        <div className="border p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            Remaining Balance
          </h2>

          <p className="text-4xl mt-4">
            ₹{remaining}
          </p>
        </div>

        <div className="border p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            Total Transactions
          </h2>

          <p className="text-4xl mt-4">
            {transactions}
          </p>
        </div>

      </div>

      <button
        onClick={downloadPDF}
        className="mt-10 bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Download PDF Report
      </button>
    </div>
  );
}