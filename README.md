# 💰 Expense Tracker Ledger

A modern personal finance dashboard built with React that helps users track their income, expenses, budgets, and spending habits in one place.

The application provides an easy way to manage financial transactions, visualize spending by category, monitor cash flow, and keep track of monthly budgets.

## ✨ Features

- 🔐 User authentication
- 💸 Add income and expense transactions
- 🗑️ Delete transactions
- ✏️ Manage and update monthly budgets
- 📊 Expense breakdown by category
- 📈 Cash flow trend visualization
- 🔎 Search and filter transactions
- 🏷️ Categorize income and expenses
- 💰 Track total balance, income, and expenses
- 🇮🇳 Indian Rupee (₹) currency support
- ☁️ Cloud database integration with Supabase
- 📱 Responsive and modern user interface

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS

### Backend & Database

- Supabase
- Supabase Authentication
- Supabase Database

### Data Visualization

- Charts for expense categories
- Cash flow trend visualization

## 📂 Project Structure

```text
expense-tracker-ledger/
│
├── src/
│   ├── components/
│   │   ├── AuthScreen.jsx
│   │   ├── BudgetModal.jsx
│   │   ├── CashFlowChart.jsx
│   │   ├── CategoryChart.jsx
│   │   ├── Dashboard.jsx
│   │   ├── SummaryStrip.jsx
│   │   ├── TransactionForm.jsx
│   │   └── TransactionTable.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   └── useFinanceData.js
│   │
│   ├── lib/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── supabase/
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
