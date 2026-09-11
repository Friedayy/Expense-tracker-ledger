import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useFinanceData } from '../hooks/useFinanceData'
import SummaryStrip from './SummaryStrip'
import CategoryChart from './CategoryChart'
import CashFlowChart from './CashFlowChart'
import TransactionForm from './TransactionForm'
import TransactionTable from './TransactionTable'
import BudgetModal from './BudgetModal'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const {
    transactions,
    monthlyBudget,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateBudget,
  } = useFinanceData()
  const [budgetModalOpen, setBudgetModalOpen] = useState(false)

  const { totalIncome, totalExpenses } = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.totalIncome += Number(t.amount)
        else acc.totalExpenses += Number(t.amount)
        return acc
      },
      { totalIncome: 0, totalExpenses: 0 }
    )
  }, [transactions])

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="font-display text-2xl">Ledger</p>
          <div className="flex items-center gap-5">
            <span className="text-sm text-slate hidden sm:inline">{user?.email}</span>
            <button
              onClick={() => setBudgetModalOpen(true)}
              className="text-sm border border-line px-3.5 py-1.5 hover:bg-white transition-colors"
            >
              Set budget
            </button>
            <button onClick={signOut} className="text-sm text-slate hover:text-ink transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {error && (
          <p className="text-sm text-rust bg-rust-soft px-3.5 py-2.5">
            Something went wrong loading your data: {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-slate py-16 text-center">Loading your finances…</p>
        ) : (
          <>
            <SummaryStrip
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              monthlyBudget={monthlyBudget}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryChart transactions={transactions} />
              <CashFlowChart transactions={transactions} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-1">
                <TransactionForm onAdd={addTransaction} />
              </div>
              <div className="lg:col-span-2">
                <TransactionTable transactions={transactions} onDelete={deleteTransaction} />
              </div>
            </div>
          </>
        )}
      </main>

      <BudgetModal
        open={budgetModalOpen}
        currentBudget={monthlyBudget}
        onClose={() => setBudgetModalOpen(false)}
        onSave={updateBudget}
      />
    </div>
  )
}
