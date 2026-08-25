const form = document.getElementById("transactionForm");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


/* Add transaction */

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (!description || amount <= 0) {
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type
    };

    transactions.push(transaction);

    saveTransactions();

    form.reset();

    displayTransactions();
    updateSummary();

});


/* Display transactions */

function displayTransactions() {

    transactionList.innerHTML = "";

    transactions.forEach(function(transaction) {

        const li = document.createElement("li");

        li.classList.add(
            "transaction",
            transaction.type
        );

        const sign =
            transaction.type === "income"
                ? "+"
                : "-";

        li.innerHTML = `
            <div class="transaction-info">
                <strong>${transaction.description}</strong>
                <small>${transaction.type}</small>
            </div>

            <div>
                <span class="transaction-amount">
                    ${sign}₹${transaction.amount.toFixed(2)}
                </span>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            </div>
        `;

        transactionList.appendChild(li);

    });
}


/* Delete transaction */

function deleteTransaction(id) {

    transactions = transactions.filter(
        function(transaction) {
            return transaction.id !== id;
        }
    );

    saveTransactions();

    displayTransactions();
    updateSummary();
}


/* Calculate totals */

function updateSummary() {

    let income = 0;
    let expense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

    });

    const balance = income - expense;

    incomeElement.textContent =
        `₹${income.toFixed(2)}`;

    expenseElement.textContent =
        `₹${expense.toFixed(2)}`;

    balanceElement.textContent =
        `₹${balance.toFixed(2)}`;
}


/* Save to localStorage */

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


/* Load when page opens */

displayTransactions();
updateSummary();