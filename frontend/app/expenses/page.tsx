"use client";

import { useEffect, useState } from "react";

export default function ExpensesPage() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/expenses`
      );

      const data = await response.json();

      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/expenses`;
      let method = "POST";

      if (editingId) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/${editingId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          title,
          amount,
          category,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          editingId
            ? "Expense Updated Successfully"
            : "Expense Added Successfully"
        );

        setTitle("");
        setAmount("");
        setCategory("");
        setEditingId(null);

        fetchExpenses();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchExpenses();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  const filteredExpenses = Array.isArray(expenses)
    ? expenses.filter(
        (expense) =>
          expense.title
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          expense.category
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8">
        Expenses
      </h1>

      <div className="w-96 border p-6 rounded-lg shadow mb-8">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 mb-4 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-2 mb-4 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full border p-2 mb-4 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          onClick={handleAddExpense}
          className="w-full bg-black text-white p-2 rounded"
        >
          {editingId
            ? "Update Expense"
            : "Add Expense"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search expenses..."
        className="w-96 border p-2 rounded mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2 className="text-2xl font-bold mb-4">
        Expense List
      </h2>

      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
          <div
            key={expense.id}
            className="border p-4 rounded shadow"
          >
            <h3 className="font-bold text-lg">
              {expense.title}
            </h3>

            <p>₹{expense.amount}</p>

            <p>{expense.category}</p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setTitle(expense.title);
                  setAmount(expense.amount.toString());
                  setCategory(expense.category);
                  setEditingId(expense.id);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(expense.id)
                }
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}