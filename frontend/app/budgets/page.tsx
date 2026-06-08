"use client";

import { useEffect, useState } from "react";

export default function BudgetsPage() {
  const [category, setCategory] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [budgets, setBudgets] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchBudgets = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/budgets`
      );

      const data = await response.json();

      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setBudgets([]);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSaveBudget = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/budgets`;
      let method = "POST";

      if (editingId) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/budgets/${editingId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          category,
          limit_amount: limitAmount,
        }),
      });

      if (response.ok) {
        alert(
          editingId
            ? "Budget Updated Successfully"
            : "Budget Added Successfully"
        );

        setCategory("");
        setLimitAmount("");
        setEditingId(null);

        fetchBudgets();
      }
    } catch (error) {
      console.error(error);
      alert("Error saving budget");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/budgets/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchBudgets();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8">
        Budgets
      </h1>

      <div className="w-96 border p-6 rounded shadow mb-8">
        <input
          type="text"
          placeholder="Category"
          className="w-full border p-2 mb-4 rounded"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Budget Limit"
          className="w-full border p-2 mb-4 rounded"
          value={limitAmount}
          onChange={(e) =>
            setLimitAmount(e.target.value)
          }
        />

        <button
          onClick={handleSaveBudget}
          className="w-full bg-black text-white p-2 rounded"
        >
          {editingId
            ? "Update Budget"
            : "Add Budget"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setCategory("");
              setLimitAmount("");
            }}
            className="w-full mt-2 bg-gray-500 text-white p-2 rounded"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Budget List
      </h2>

      {budgets.length === 0 ? (
        <p>No budgets found.</p>
      ) : (
        budgets.map((budget) => (
          <div
            key={budget.id}
            className="border p-4 rounded shadow mb-4"
          >
            <h3 className="font-bold text-lg">
              {budget.category}
            </h3>

            <p>
              Budget: ₹{budget.limit_amount}
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setCategory(budget.category);
                  setLimitAmount(
                    budget.limit_amount.toString()
                  );
                  setEditingId(budget.id);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(budget.id)
                }
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}