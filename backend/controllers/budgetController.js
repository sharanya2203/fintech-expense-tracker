const pool = require("../config/db");

// ADD BUDGET
const addBudget = async (req, res) => {
  try {
    const { user_id, category, limit_amount } = req.body;

    const result = await pool.query(
      `INSERT INTO budgets(user_id, category, limit_amount)
       VALUES($1,$2,$3)
       RETURNING *`,
      [user_id, category, limit_amount]
    );

    res.status(201).json({
      message: "Budget added",
      budget: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET BUDGETS
const getBudgets = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM budgets ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE BUDGET
const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, limit_amount } = req.body;

    const result = await pool.query(
      `UPDATE budgets
       SET category=$1,
           limit_amount=$2
       WHERE id=$3
       RETURNING *`,
      [category, limit_amount, id]
    );

    res.json({
      message: "Budget updated",
      budget: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE BUDGET
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM budgets WHERE id=$1",
      [id]
    );

    res.json({
      message: "Budget deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};