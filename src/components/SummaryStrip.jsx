const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

function Figure({ label, value, tone = 'ink', sublabel }) {
  const toneClass =
    tone === 'teal' ? 'text-teal' : tone === 'rust' ? 'text-rust' : tone === 'gold' ? 'text-gold' : 'text-ink'

  return (
    <div className="py-6 md:py-0">
      <p className="text-xs uppercase tracking-wide text-slate mb-2">{label}</p>
      <p className={`font-display text-figure ${toneClass}`}>{formatCurrency(value)}</p>
      {sublabel && <p className="text-xs text-slate mt-1.5">{sublabel}</p>}
    </div>
  )
}

export default function SummaryStrip({ totalIncome, totalExpenses, monthlyBudget }) {
  const balance = totalIncome - totalExpenses
  const remaining = monthlyBudget - totalExpenses
  const overBudget = monthlyBudget > 0 && remaining < 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-line border-y border-line">
      <div className="md:pr-8">
        <Figure label="Total balance" value={balance} tone={balance >= 0 ? 'ink' : 'rust'} />
      </div>
      <div className="md:px-8">
        <Figure label="Total income" value={totalIncome} tone="teal" />
      </div>
      <div className="md:px-8">
        <Figure label="Total expenses" value={totalExpenses} tone="rust" />
      </div>
      <div className="md:pl-8">
        <Figure
          label="Remaining budget"
          value={Math.abs(remaining)}
          tone={overBudget ? 'rust' : 'gold'}
          sublabel={
            monthlyBudget === 0
              ? 'No budget set'
              : overBudget
              ? 'Over your monthly budget'
              : `of ${formatCurrency(monthlyBudget)} goal`
          }
        />
      </div>
    </div>
  )
}
