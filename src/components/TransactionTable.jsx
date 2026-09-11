import { useMemo, useState } from 'react'
import { CATEGORIES, CATEGORY_COLORS } from '../lib/supabaseClient'

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

const formatDate = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export default function TransactionTable({ transactions, onDelete }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [deletingId, setDeletingId] = useState(null)

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter
      const matchesType = typeFilter === 'All' || t.type === typeFilter
      return matchesSearch && matchesCategory && matchesType
    })
  }, [transactions, search, categoryFilter, typeFilter])

  const handleDelete = async (id) => {
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  return (
    <div className="border border-line">
      <div className="p-6 pb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-xs uppercase tracking-wide text-slate">Transaction history</p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions…"
            className="border border-line px-3.5 py-2 text-sm w-full sm:w-48 focus:border-ink transition-colors"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-line px-3 py-2 text-sm bg-white focus:border-ink transition-colors"
          >
            <option value="All">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-line px-3 py-2 text-sm bg-white focus:border-ink transition-colors"
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate text-center py-16 border-t border-line">
          {transactions.length === 0
            ? 'No transactions yet. Add your first one above.'
            : 'Nothing matches your search or filters.'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b border-line text-left text-xs uppercase tracking-wide text-slate">
                <th className="py-3 px-6 font-medium">Title</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium text-right">Amount</th>
                <th className="py-3 px-6 font-medium text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-line last:border-b-0 hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-6">{t.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
                      />
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate">{formatDate(t.date)}</td>
                  <td
                    className={`py-3.5 px-4 text-right font-medium ${
                      t.type === 'income' ? 'text-teal' : 'text-rust'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id}
                      className="text-xs text-slate hover:text-rust transition-colors disabled:opacity-50"
                    >
                      {deletingId === t.id ? 'Removing…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
