import { useEffect, useState } from 'react'

export default function BudgetModal({ open, currentBudget, onClose, onSave }) {
  const [value, setValue] = useState(currentBudget)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open) {
      setValue(currentBudget)
      setError(null)
    }
  }, [open, currentBudget])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const parsed = parseFloat(value)
    if (isNaN(parsed) || parsed < 0) {
      setError('Enter a budget of zero or more.')
      return
    }
    setSubmitting(true)
    const { error } = await onSave(parsed)
    setSubmitting(false)
    if (error) setError(error)
    else onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-ink/40 flex items-center justify-center px-6 z-50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-paper border border-line w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-modal-title"
      >
        <p id="budget-modal-title" className="text-xs uppercase tracking-wide text-slate mb-5">
          Monthly budget goal
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="budget-input" className="block text-sm font-medium mb-1.5">
            Amount
          </label>
          <div className="relative mb-4">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate text-sm">₹</span>
            <input
              id="budget-input"
              type="number"
              step="0.01"
              min="0"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-line pl-7 pr-3.5 py-2.5 text-sm focus:border-ink transition-colors"
            />
          </div>

          {error && <p className="text-sm text-rust bg-rust-soft px-3.5 py-2.5 mb-4">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-line py-2.5 text-sm font-medium hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-ink text-paper py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
