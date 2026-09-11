import { useState } from 'react'
import { CATEGORIES } from '../lib/supabaseClient'

const today = () => new Date().toISOString().slice(0, 10)

export default function TransactionForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [type, setType] = useState('expense')
  const [date, setDate] = useState(today())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const reset = () => {
    setTitle('')
    setAmount('')
    setCategory(CATEGORIES[0])
    setType('expense')
    setDate(today())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const parsedAmount = parseFloat(amount)
    if (!title.trim()) return setError('Give the transaction a title.')
    if (!parsedAmount || parsedAmount <= 0) return setError('Enter an amount greater than zero.')

    setSubmitting(true)
    const { error } = await onAdd({
      title: title.trim(),
      amount: parsedAmount,
      category,
      type,
      date,
    })
    setSubmitting(false)

    if (error) setError(error)
    else reset()
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line p-6">
      <p className="text-xs uppercase tracking-wide text-slate mb-5">Add a transaction</p>

      {/* Income / expense toggle */}
      <div className="flex mb-5 border border-line w-fit">
        {['expense', 'income'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`px-4 py-1.5 text-sm capitalize transition-colors ${
              type === t
                ? t === 'income'
                  ? 'bg-teal text-white'
                  : 'bg-rust text-white'
                : 'bg-white text-slate hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5" htmlFor="tx-title">
            Title
          </label>
          <input
            id="tx-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'income' ? 'e.g. Paycheck' : 'e.g. Groceries'}
            className="w-full border border-line px-3.5 py-2.5 text-sm focus:border-ink transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="tx-amount">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate text-sm">₹</span>
            <input
              id="tx-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full border border-line pl-7 pr-3.5 py-2.5 text-sm focus:border-ink transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="tx-date">
            Date
          </label>
          <input
            id="tx-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-line px-3.5 py-2.5 text-sm focus:border-ink transition-colors"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5" htmlFor="tx-category">
            Category
          </label>
          <select
            id="tx-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-line px-3.5 py-2.5 text-sm focus:border-ink transition-colors bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-rust bg-rust-soft px-3.5 py-2.5 mb-4">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-ink text-paper py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Adding…' : 'Add transaction'}
      </button>
    </form>
  )
}
