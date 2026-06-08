const pool = require("../config/db");

// ADD EXPENSE
const addExpense = async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    const result = await pool.query(
      `INSERT INTO expenses(user_id, title, amount, category)
       VALUES($1, $2, $3, $4)
       RETURNING *`,
      [user_id, title, amount, category]
    );

    res.status(201).json({
      message: "Expense added",
      expense: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET EXPENSES
const getExpenses = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE EXPENSE
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category } = req.body;

    const result = await pool.query(
      `UPDATE expenses
       SET title = $1,
           amount = $2,
           category = $3
       WHERE id = $4
       RETURNING *`,
      [title, amount, category, id]
    );

    res.json({
      message: "Expense updated",
      expense: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE EXPENSE
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM expenses WHERE id = $1",
      [id]
    );

    res.json({
      message: "Expense deleted",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};