"use client";

import { useEffect, useState } from "react";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";

export default function DashboardPage() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Expenses
      const expenseRes = await fetch(
        "http://localhost:5000/api/expenses"
      );

      const expenses = await expenseRes.json();

      if (Array.isArray(expenses)) {
        setRecentExpenses(expenses.slice(0, 5));
      }

      const expenseTotal = Array.isArray(expenses)
        ? expenses.reduce(
            (sum: number, item: any) =>
              sum + Number(item.amount),
            0
          )
        : 0;

      setTotalExpenses(expenseTotal);

      // Category Chart
      const categoryMap: any = {};

      if (Array.isArray(expenses)) {
        expenses.forEach((expense: any) => {
          if (!categoryMap[expense.category]) {
            categoryMap[expense.category] = 0;
          }

          categoryMap[expense.category] += Number(
            expense.amount
          );
        });
      }

      const chartArray = Object.keys(categoryMap).map(
        (category) => ({
          category,
          amount: categoryMap[category],
        })
      );

      setChartData(chartArray);

      // Monthly Chart
      const monthMap: any = {};

      if (Array.isArray(expenses)) {
        expenses.forEach((expense: any) => {
          const month = new Date(
            expense.created_at
          ).toLocaleString("default", {
            month: "short",
          });

          if (!monthMap[month]) {
            monthMap[month] = 0;
          }

          monthMap[month] += Number(
            expense.amount
          );
        });
      }

      const monthlyChart = Object.keys(
        monthMap
      ).map((month) => ({
        month,
        amount: monthMap[month],
      }));

      setMonthlyData(monthlyChart);

      // Budgets
      const budgetRes = await fetch(
        "http://localhost:5000/api/budgets"
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

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-10">
        FinTech Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-red-600">
            Total Expenses
          </h2>

          <p className="text-4xl font-bold mt-4">
            ₹{totalExpenses}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-green-600">
            Total Budget
          </h2>

          <p className="text-4xl font-bold mt-4">
            ₹{totalBudget}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-blue-600">
            Remaining
          </h2>

          <p className="text-4xl font-bold mt-4">
            ₹{remaining}
          </p>
        </div>

      </div>

      {/* Budget Usage */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Budget Usage
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-6">
          <div
            className="bg-green-500 h-6 rounded-full"
            style={{
              width: `${
                totalBudget > 0
                  ? (totalExpenses / totalBudget) * 100
                  : 0
              }%`,
            }}
          />
        </div>

        <p className="mt-2 text-gray-600">
          {totalBudget > 0
            ? (
                (totalExpenses / totalBudget) *
                100
              ).toFixed(1)
            : 0}
          % of budget used
        </p>
      </div>

      {/* Expense Analytics */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">
          Expense Analytics
        </h2>

        <div className="bg-white border p-6 rounded-xl shadow-lg">
          <ExpenseChart data={chartData} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">
          Recent Transactions
        </h2>

        <div className="bg-white border rounded-xl shadow-lg p-6">
          {recentExpenses.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between border-b pb-3"
                >
                  <div>
                    <h3 className="font-semibold">
                      {expense.title}
                    </h3>

                    <p className="text-gray-500">
                      {expense.category}
                    </p>
                  </div>

                  <p className="font-bold text-red-500">
                    ₹{expense.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">
          Monthly Expense Trends
        </h2>

        <div className="bg-white border rounded-xl shadow-lg p-6">
          <MonthlyExpenseChart
            data={monthlyData}
          />
        </div>
      </div>

    </div>
  );
}