const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('list');
const balanceEl = document.getElementById('balance');
const category = document.getElementById('category');
let chartInstance;

let transactions = [];

addBtn.addEventListener('click', () => {
    const description = text.value.trim();
    const amountValue = Number(amount.value.trim());

    if(!description || !amount) {
        alert("Please enter the valid description and amount")
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount: amountValue,
        type: type.value,
        category: category.value
    }

    transactions.push(transaction);
    updateUI();
    saveData();

    text.value = ""
    amount.value = ""
})

function updateUI() {
    list.innerHTML = "";

    let balance = 0;

    transactions.forEach((trans) => {
        let li = document.createElement('li');
        li.classList = `p-2 border rounded flex justify-between items-center`;
        
        li.innerHTML = `
           <div class="flex w-full justify-between">
             <span class="font-semibold">${trans.description}</span>
             <span class="${trans.type == "income" ? "text-green-600" : "text-red-600"}">
               ${trans.type == "income" ? "+" : "-"} &#8377;${trans.amount}
             </span>
             <button class="text-red-500 font-bold" onClick="deleteTransaction(${trans.id})">X</button>
           </div>
        `;
        
        list.appendChild(li);

        if(trans.type == "income") balance += trans.amount
        else balance -= trans.amount
        
        balanceEl.textContent = `${balance < 0 ? "-" : ''}\u20B9${Math.abs(balance)}`

        renderChart()
    })
}

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadData() {
    const data = localStorage.getItem("transactions");
    if(data) {
        transactions = JSON.parse(data);
        updateUI();
    }
}


function deleteTransaction(id) {
    transactions = transactions.filter(trans => trans.id !== id);
    updateUI();
    saveData();
}

loadData()



function renderChart() {
  const categories = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });

  const labels = Object.keys(categories);
  const values = Object.values(categories);

  const ctx = document.getElementById("chart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Expenses by Category",
          data: values,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
