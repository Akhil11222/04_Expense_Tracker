// Wait until the webpage fully loads
document.addEventListener("DOMContentLoaded", () => {
  // ▼▼▼ Get HTML elements ▼▼▼
  const expenseForm = document.getElementById("expense-form"); // The form element
  const expenseNameInput = document.getElementById("expense-name"); // Expense name input
  const expenseAmountInput = document.getElementById("expense-amount"); // Expense amount input
  const expenseList = document.getElementById("expense-list"); // Where expenses will be listed
  const totalAmountDisplay = document.getElementById("total-amount"); // Total amount display

  // ▼▼▼ Load saved expenses from browser memory ▼▼▼
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let totalAmount = calculateTotal(); // Calculate initial total

  renderExpenses(); // Show existing expenses when page loads

  // ▼▼▼ Handle form submission ▼▼▼
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Stop form from refreshing page

    // Get input values
    const name = expenseNameInput.value.trim(); // Remove extra spaces
    const amount = parseFloat(expenseAmountInput.value.trim()); // Convert to number

    // Check if inputs are valid
    if (name !== "" && !isNaN(amount) && amount > 0) {
      // Create new expense object
      const newExpense = {
        id: Date.now(), // Unique ID using current timestamp
        name: name,
        amount: amount,
      };

      expenses.push(newExpense); // Add to expenses list
      saveExpensesTolocal(); // Save to browser memory
      renderExpenses(); // Update displayed list
      updateTotal(); // Update total amount

      // Clear input fields
      expenseNameInput.value = "";
      expenseAmountInput.value = "";
    }
  });

  // ▼▼▼ Display all expenses ▼▼▼
  function renderExpenses() {
    expenseList.innerHTML = ""; // Clear current list
    expenses.forEach((expense) => {
      const li = document.createElement("li"); // Create list item
      li.innerHTML = `
        ${expense.name} - $${expense.amount}
        <button data-id="${expense.id}">Delete</button>
      `;
      expenseList.appendChild(li); // Add to list
    });
  }

  // ▼▼▼ Calculate total expenses ▼▼▼
  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  // ▼▼▼ Save to browser memory ▼▼▼
  function saveExpensesTolocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  // ▼▼▼ Update total display ▼▼▼
  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2); // Show 2 decimal places
  }

  // ▼▼▼ Handle delete button clicks ▼▼▼
  expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      // Remove expense from array
      expenses = expenses.filter((expense) => expense.id !== expenseId);

      saveExpensesTolocal(); // Update browser memory
      renderExpenses(); // Refresh list
      updateTotal(); // Update total
    }
  });
});
