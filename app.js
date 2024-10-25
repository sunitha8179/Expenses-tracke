document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');
    const expenseChartCanvas = document.getElementById('expenseChart').getContext('2d');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Load expenses on page load
    loadExpenses();

    // Add new expense
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        
        const newExpense = { id: Date.now(), amount: parseFloat(amount), category, date };
        expenses.push(newExpense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        loadExpenses();
        expenseForm.reset();
    });

    // Load and display expenses
    function loadExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                $${expense.amount} - ${expense.category} on ${expense.date}
                <div>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${expense.id}">Delete</button>
                </div>
            `;
            expenseList.appendChild(li);
        });

        updateChart();
    }

    // Edit or delete expenses
    expenseList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            expenses = expenses.filter(expense => expense.id != id);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            loadExpenses();
        }
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.getAttribute('data-id');
            const expenseToEdit = expenses.find(expense => expense.id == id);
            
            document.getElementById('amount').value = expenseToEdit.amount;
            document.getElementById('category').value = expenseToEdit.category;
            document.getElementById('date').value = expenseToEdit.date;

            expenses = expenses.filter(expense => expense.id != id);
            localStorage.setItem('expenses', JSON.stringify(expenses));
        }
    });

    // Update Pie Chart
    function updateChart() {
        const categoryTotals = expenses.reduce((totals, expense) => {
            totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
            return totals;
        }, {});

        const chart = new Chart(expenseChartCanvas, {
            type: 'pie',
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    label: 'Expenses by Category',
                    data: Object.values(categoryTotals),
                    backgroundColor: ['#007bff', '#dc3545', '#28a745', '#ffc107'],
                }]
            }
        });
    }
});
