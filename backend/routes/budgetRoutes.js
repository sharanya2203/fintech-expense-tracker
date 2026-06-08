const express = require("express");

const {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const router = express.Router();

router.post("/", addBudget);

router.get("/", getBudgets);

router.put("/:id", updateBudget);

router.delete("/:id", deleteBudget);

module.exports = router;